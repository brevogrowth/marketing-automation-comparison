/**
 * Marketing Plan Library
 *
 * Re-exports all marketing plan utilities and types.
 */

// Types
export type {
  MarketingPlan,
  MarketingProgram,
  CompanySummary,
  ProgramScenario,
  ScenarioMessage,
  BrevoHelpScenario,
  MarketingPlanRow,
  MarketingPlanInsert,
  ValidationError,
  ParsedPlanResult,
  PlanGenerationStatus,
  PlanSource,
  PlanGenerationResponse,
  PlanLookupResponse,
} from '../../src/types/marketing-plan';

// Domain normalization
export { normalizeDomain, isDomainLikelyValid, extractCompanyNameFromDomain } from './normalize';

// Parser and validation
export {
  parsePlanData,
  validatePlanData,
  hasContent,
  extractCompanyName,
  deepStructureClone,
} from '../../src/utils/marketing-plan-parser';

// Database operations
export {
  getMarketingPlanByDomain,
  saveMarketingPlan,
  upsertMarketingPlan,
  planExists,
} from './db';
export type { DbResult } from './db';

// Supabase client
export { getSupabaseClient, getSupabaseClientSide, isSupabaseConfigured } from './supabase';
