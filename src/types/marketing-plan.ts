/**
 * Marketing Plan Type Definitions
 *
 * Core types for the Marketing Relationship Plan Generator.
 * Migrated from legacy implementation with TypeScript strict mode compliance.
 */

/**
 * Scenario message within a program scenario
 */
export interface ScenarioMessage {
  title?: string;
  description?: string;
  content?: string;
  [key: string]: unknown;
}

/**
 * Program scenario - a specific automation workflow within a program
 */
export interface ProgramScenario {
  /** Primary field for scenario target */
  scenario_target?: string;
  /** Mapped field for backward compatibility */
  target?: string;
  /** Primary field for scenario objective */
  scenario_objective?: string;
  /** Mapped field for backward compatibility */
  objective?: string;
  /** Primary field for main message ideas */
  main_messages_ideas?: string;
  /** Mapped field for backward compatibility */
  main_message_ideas?: string;
  /** Messages content */
  messages?: string;
  /** Sequence of messages - can be array or object */
  message_sequence?: ScenarioMessage[] | Record<string, ScenarioMessage | string>;
  [key: string]: unknown;
}

/**
 * Marketing program - a high-level marketing initiative
 */
export interface MarketingProgram {
  /** Primary field for program name */
  program_name?: string;
  /** Mapped field for backward compatibility */
  name?: string;
  /** Target audience for this program */
  target?: string;
  /** Program objective */
  objective?: string;
  /** Key Performance Indicator */
  kpi?: string;
  /** Program description */
  description?: string;
  /** Scenarios within this program */
  scenarios?: ProgramScenario[];
}

/**
 * Company summary - information about the company
 */
export interface CompanySummary {
  /** Company name */
  name: string;
  /** Company website/domain */
  website: string;
  /** Primary field for company activities */
  activities?: string;
  /** Primary field for target audience */
  target?: string;
  /** Mapped field for backward compatibility */
  industry?: string;
  /** Mapped field for backward compatibility */
  target_audience?: string;
  /** Number of employees */
  nb_employees?: string;
  /** Business model */
  business_model?: string;
  /** LinkedIn scrape status (internal use) */
  linkedin_scrape_status?: string;
  /** Customer lifecycle key steps */
  customer_lifecycle_key_steps?: string;
}

/**
 * Brevo help scenario - how Brevo can assist
 */
export interface BrevoHelpScenario {
  /** Name of the scenario */
  scenario_name: string;
  /** Why Brevo is a better choice */
  why_brevo_is_better: string;
  /** Omnichannel strategy details */
  omnichannel_channels: string;
  /** Setup efficiency information */
  setup_efficiency: string;
}

/**
 * Complete marketing plan structure
 */
export interface MarketingPlan {
  /** Introduction text */
  introduction?: string;
  /** Company information */
  company_summary: CompanySummary;
  /** Tools used (optional) */
  tools_used?: string;
  /** List of marketing programs - can be array or object */
  programs_list: Record<string, MarketingProgram> | MarketingProgram[];
  /** Conclusion text */
  conclusion?: string;
  /** How Brevo helps scenarios */
  how_brevo_helps_you?: BrevoHelpScenario[];
  /** Metadata from parsing */
  metadata?: {
    conversation_id?: string;
    [key: string]: unknown;
  };
  /** Raw content structure for debugging */
  raw_content_structure?: {
    contentKeys: string[];
    programDetailKeys: string[];
    contentPath: string;
  };
  /** Allow additional properties for program details */
  [key: string]: unknown;
}

/**
 * Supabase database row for marketing_plans table
 */
export interface MarketingPlanRow {
  id: string;
  company_domain: string;
  email: string;
  form_data: MarketingPlan;
  user_language: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Insert type for marketing_plans table
 */
export interface MarketingPlanInsert {
  company_domain: string;
  email: string;
  form_data: MarketingPlan;
  user_language: string;
}

/**
 * Validation error for plan parsing
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Result of parsing and validation
 */
export interface ParsedPlanResult {
  data: MarketingPlan | null;
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * API response status for async operations
 */
export type PlanGenerationStatus = 'created' | 'processing' | 'complete' | 'error';

/**
 * Source of the plan data
 */
export type PlanSource = 'db' | 'ai' | 'static';

/**
 * API response for plan generation
 */
export interface PlanGenerationResponse {
  status: PlanGenerationStatus;
  source?: PlanSource;
  conversationId?: string;
  plan?: MarketingPlan;
  error?: string;
}

/**
 * Lookup response for existing plans
 */
export interface PlanLookupResponse {
  found: boolean;
  plan?: MarketingPlan;
}
