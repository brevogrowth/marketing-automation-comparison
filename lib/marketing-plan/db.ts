/**
 * Marketing Plan Database Operations
 *
 * Supabase operations for marketing_plans table.
 * Key: (company_domain, user_language)
 */

import type { MarketingPlan, MarketingPlanRow } from '../../src/types/marketing-plan';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { normalizeDomain } from './normalize';
import { deepStructureClone } from '../../src/utils/marketing-plan-parser';

/**
 * Result type for database operations
 */
export interface DbResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get a marketing plan by domain and language
 *
 * @param companyDomain - The company domain (will be normalized)
 * @param userLanguage - The user's language code (e.g., 'en', 'fr')
 */
export async function getMarketingPlanByDomain(
  companyDomain: string,
  userLanguage: string
): Promise<DbResult<MarketingPlan | null>> {
  try {
    if (!companyDomain) {
      return { success: false, error: 'Company domain is required' };
    }

    if (!isSupabaseConfigured()) {
      console.warn('[DB] Supabase not configured, skipping database lookup');
      return { success: true, data: null };
    }

    const normalizedDomain = normalizeDomain(companyDomain);
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('marketing_plans')
      .select('form_data')
      .eq('company_domain', normalizedDomain)
      .eq('user_language', userLanguage)
      .single();

    if (error) {
      // PGRST116 = no rows returned, which is not an error
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }
      console.error('[DB] Error fetching marketing plan:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: true, data: null };
    }

    return { success: true, data: data.form_data as MarketingPlan };
  } catch (error) {
    console.error('[DB] Unexpected error fetching marketing plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Save a new marketing plan
 *
 * @param companyDomain - The company domain (will be normalized)
 * @param email - The user's email
 * @param planData - The marketing plan data
 * @param userLanguage - The user's language code
 */
export async function saveMarketingPlan(
  companyDomain: string,
  email: string,
  planData: MarketingPlan,
  userLanguage: string
): Promise<DbResult> {
  try {
    if (!companyDomain || !email) {
      return { success: false, error: 'Missing required fields' };
    }

    if (!isSupabaseConfigured()) {
      console.warn('[DB] Supabase not configured, skipping save');
      return { success: true };
    }

    const normalizedDomain = normalizeDomain(companyDomain);
    const supabase = getSupabaseClient();

    // Deep clone to preserve nested structure
    const preservedData = deepStructureClone(planData);

    const { error } = await supabase.from('marketing_plans').insert([
      {
        company_domain: normalizedDomain,
        email,
        form_data: preservedData,
        user_language: userLanguage,
      },
    ]);

    if (error) {
      console.error('[DB] Error saving marketing plan:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[DB] Unexpected error saving marketing plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing marketing plan (upsert)
 *
 * Uses manual SELECT + INSERT/UPDATE pattern since Supabase upsert
 * requires a unique constraint which may not exist in all environments.
 *
 * @param companyDomain - The company domain (will be normalized)
 * @param email - The user's email
 * @param planData - The marketing plan data
 * @param userLanguage - The user's language code
 */
export async function upsertMarketingPlan(
  companyDomain: string,
  email: string,
  planData: MarketingPlan,
  userLanguage: string
): Promise<DbResult> {
  try {
    if (!companyDomain) {
      return { success: false, error: 'Company domain is required' };
    }

    if (!isSupabaseConfigured()) {
      console.warn('[DB] Supabase not configured, skipping upsert');
      return { success: false, error: 'Supabase not configured' };
    }

    const normalizedDomain = normalizeDomain(companyDomain);
    if (!normalizedDomain) {
      return { success: false, error: `Domain normalization failed for: ${companyDomain}` };
    }

    console.log('[DB] Starting upsert:', {
      originalDomain: companyDomain,
      normalizedDomain,
      userLanguage,
      hasPlanData: !!planData,
      planKeys: planData ? Object.keys(planData) : [],
    });

    const supabase = getSupabaseClient();

    // Deep clone to preserve nested structure
    const preservedData = deepStructureClone(planData);

    // Log the size of the data being saved
    const dataStr = JSON.stringify(preservedData);
    console.log('[DB] Data size:', {
      chars: dataStr.length,
      kb: Math.round(dataStr.length / 1024),
    });

    // Manual upsert: Check if record exists first
    const { data: existing, error: selectError } = await supabase
      .from('marketing_plans')
      .select('id')
      .eq('company_domain', normalizedDomain)
      .eq('user_language', userLanguage)
      .maybeSingle();

    if (selectError) {
      console.error('[DB] Error checking existing plan:', selectError);
      return { success: false, error: `Select failed: ${selectError.message}` };
    }

    if (existing) {
      // UPDATE existing record
      console.log('[DB] Updating existing plan:', { id: existing.id });
      const { error: updateError } = await supabase
        .from('marketing_plans')
        .update({
          email,
          form_data: preservedData,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[DB] Error updating marketing plan:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
        });
        return { success: false, error: `Update failed: ${updateError.code}: ${updateError.message}` };
      }

      console.log('[DB] Update success:', { domain: normalizedDomain });
    } else {
      // INSERT new record
      console.log('[DB] Inserting new plan');
      const { error: insertError } = await supabase.from('marketing_plans').insert([
        {
          company_domain: normalizedDomain,
          email,
          form_data: preservedData,
          user_language: userLanguage,
        },
      ]);

      if (insertError) {
        console.error('[DB] Error inserting marketing plan:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
        return { success: false, error: `Insert failed: ${insertError.code}: ${insertError.message}` };
      }

      console.log('[DB] Insert success:', { domain: normalizedDomain });
    }

    return { success: true };
  } catch (error) {
    console.error('[DB] Unexpected error upserting marketing plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if a plan exists for a domain and language
 *
 * @param companyDomain - The company domain (will be normalized)
 * @param userLanguage - The user's language code
 */
export async function planExists(
  companyDomain: string,
  userLanguage: string
): Promise<boolean> {
  const result = await getMarketingPlanByDomain(companyDomain, userLanguage);
  return result.success && result.data !== null;
}
