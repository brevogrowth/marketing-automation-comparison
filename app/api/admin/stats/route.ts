/**
 * Admin Stats API
 *
 * GET /api/admin/stats - Get dashboard statistics
 *
 * Returns:
 * - Plans per day (last 30 days)
 * - Total plans
 * - Unique emails
 * - Plans by language
 * - Plans today
 */

import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/marketing-plan/supabase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'growth';

function checkAdminAuth(request: Request): boolean {
  const password = request.headers.get('x-admin-password');
  return password === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const supabase = getSupabaseClient();

    // Get total plans count
    const { count: totalPlans } = await supabase
      .from('marketing_plans')
      .select('*', { count: 'exact', head: true });

    // Get unique emails count
    const { data: emailsData } = await supabase
      .from('marketing_plans')
      .select('email');

    const uniqueEmails = new Set(emailsData?.map(e => e.email) || []).size;

    // Get plans by language
    const { data: plansData } = await supabase
      .from('marketing_plans')
      .select('user_language, created_at');

    const byLanguage: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    let plansToday = 0;
    const today = new Date().toISOString().split('T')[0];

    plansData?.forEach(plan => {
      // Count by language
      const lang = plan.user_language || 'unknown';
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;

      // Count by day
      const day = plan.created_at?.split('T')[0];
      if (day) {
        byDay[day] = (byDay[day] || 0) + 1;
        if (day === today) {
          plansToday++;
        }
      }
    });

    // Get last 30 days data
    const last30Days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.push({
        date: dateStr,
        count: byDay[dateStr] || 0,
      });
    }

    // Get API logs stats if table exists
    let apiStats = null;
    try {
      const { count: totalApiCalls } = await supabase
        .from('api_logs')
        .select('*', { count: 'exact', head: true });

      const { count: apiCallsToday } = await supabase
        .from('api_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', today);

      const { count: apiErrors } = await supabase
        .from('api_logs')
        .select('*', { count: 'exact', head: true })
        .gte('status_code', 400);

      apiStats = {
        total_calls: totalApiCalls || 0,
        calls_today: apiCallsToday || 0,
        total_errors: apiErrors || 0,
      };
    } catch {
      // api_logs table might not exist yet
      apiStats = null;
    }

    return NextResponse.json({
      total_plans: totalPlans || 0,
      unique_emails: uniqueEmails,
      plans_today: plansToday,
      by_language: byLanguage,
      plans_per_day: last30Days,
      api_stats: apiStats,
    });
  } catch (error) {
    console.error('[Admin Stats] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
