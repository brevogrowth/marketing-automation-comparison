/**
 * Admin API Logs
 *
 * GET /api/admin/logs - List API call logs
 *
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - status: 'all' | 'success' | 'error'
 * - endpoint: filter by endpoint
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
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status') || 'all';
    const endpoint = url.searchParams.get('endpoint');

    let query = supabase
      .from('api_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'success') {
      query = query.lt('status_code', 400);
    } else if (status === 'error') {
      query = query.gte('status_code', 400);
    }

    if (endpoint) {
      query = query.eq('endpoint', endpoint);
    }

    const { data, error, count } = await query;

    if (error) {
      // Table might not exist yet
      if (error.code === '42P01') {
        return NextResponse.json({
          logs: [],
          total: 0,
          message: 'API logs table not created yet. Run the migration.',
        });
      }
      throw error;
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin Logs] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
