/**
 * Admin API - Plans Management
 *
 * GET /api/admin/plans - List all marketing plans
 * DELETE /api/admin/plans?id=xxx - Delete a specific plan
 *
 * Protected by simple password header: x-admin-password
 */

import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/marketing-plan/supabase';

const ADMIN_PASSWORD = 'growth';

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
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('marketing_plans')
      .select('id, company_domain, email, user_language, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`company_domain.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[Admin API] Error fetching plans:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      plans: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('marketing_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Admin API] Error deleting plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
