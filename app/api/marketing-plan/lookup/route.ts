/**
 * GET /api/marketing-plan/lookup
 *
 * Look up an existing marketing plan by domain and language.
 *
 * Query parameters:
 * - domain: Company domain (required)
 * - language: Language code (optional, defaults to 'en')
 *
 * Response:
 * - Found: { found: true, plan: MarketingPlan }
 * - Not found: { found: false }
 * - Error: { error: string }
 */

import { NextResponse } from 'next/server';
import { getMarketingPlanByDomain } from '@/lib/marketing-plan/db';
import { normalizeDomain } from '@/lib/marketing-plan/normalize';
import { isSupabaseConfigured } from '@/lib/marketing-plan/supabase';

export const runtime = 'nodejs';
export const maxDuration = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const language = searchParams.get('language') || searchParams.get('lang') || 'en';
    const debug = searchParams.get('debug') === 'true';

    // Debug mode: return configuration status and test DB write
    if (debug) {
      const supabaseConfigured = isSupabaseConfigured();
      const envVars = {
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
        hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
        hasSupabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        urlSource: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC' : (process.env.SUPABASE_URL ? 'non-prefixed' : 'none'),
        anonKeySource: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'NEXT_PUBLIC' : (process.env.SUPABASE_ANON_KEY ? 'non-prefixed' : 'none'),
      };

      // Test DB write if requested
      let dbWriteTest = null;
      if (searchParams.get('testWrite') === 'true' && supabaseConfigured) {
        try {
          const { getSupabaseClient } = await import('@/lib/marketing-plan/supabase');
          const supabase = getSupabaseClient();
          const testDomain = `test-${Date.now()}.example.com`;

          // Try to insert a test row
          const { data, error } = await supabase
            .from('marketing_plans')
            .insert([{
              company_domain: testDomain,
              email: 'debug-test@brevo.com',
              form_data: { test: true },
              user_language: 'en',
            }])
            .select();

          if (error) {
            dbWriteTest = { success: false, error: error.message, code: error.code };
          } else {
            // Clean up test row
            await supabase
              .from('marketing_plans')
              .delete()
              .eq('company_domain', testDomain);
            dbWriteTest = { success: true, message: 'Write test passed' };
          }
        } catch (e) {
          dbWriteTest = { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
        }
      }

      return NextResponse.json({
        debug: true,
        supabaseConfigured,
        envVars,
        dbWriteTest,
        timestamp: new Date().toISOString(),
      });
    }

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    const normalizedDomain = normalizeDomain(domain);

    if (!normalizedDomain) {
      return NextResponse.json(
        { error: 'Invalid domain provided' },
        { status: 400 }
      );
    }

    const result = await getMarketingPlanByDomain(normalizedDomain, language);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Database error' },
        { status: 500 }
      );
    }

    if (result.data) {
      return NextResponse.json({
        found: true,
        plan: result.data,
        domain: normalizedDomain,
        language,
      });
    }

    return NextResponse.json({
      found: false,
      domain: normalizedDomain,
      language,
    });

  } catch (error) {
    console.error('[Lookup] Error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup plan' },
      { status: 500 }
    );
  }
}
