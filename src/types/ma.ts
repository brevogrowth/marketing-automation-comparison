/**
 * Marketing Automation Comparison - Type Definitions
 *
 * Core types for the MA comparison tool including vendors, features,
 * user profiles, and filters.
 */

// =============================================================================
// COMPANY & SEGMENT TYPES
// =============================================================================

/** Company size segments */
export type CompanySize = 'SMB' | 'MM' | 'ENT';

/** Vendor complexity levels */
export type Complexity = 'light' | 'medium' | 'heavy';

/** Feature implementation levels */
export type FeatureLevel = 'full' | 'partial' | 'limited' | 'none';

/** Pricing models */
export type PricingModel = 'contacts' | 'events' | 'seats' | 'messages' | 'hybrid' | 'custom';

/** Price buckets for filtering */
export type PriceBucket = 'low' | 'medium' | 'high' | 'enterprise' | 'unknown';

/** Feedback type */
export type FeedbackType = 'pro' | 'con';

// =============================================================================
// REVIEW SOURCE
// =============================================================================

/** Rating data from review platforms (G2, Capterra) */
export interface ReviewSource {
  /** Rating out of 5 */
  rating: number;
  /** Number of reviews */
  reviews_count: number;
  /** Direct URL to vendor page on platform */
  url: string;
  /** Date when data was last verified (ISO string) */
  last_checked: string;
}

// =============================================================================
// VENDOR FEATURE
// =============================================================================

/** Feature category names */
export type FeatureCategory =
  | 'Email Marketing'
  | 'SMS Marketing'
  | 'Push Notifications'
  | 'WhatsApp'
  | 'In-App Messaging'
  | 'Automation'
  | 'Segmentation'
  | 'Personalization'
  | 'Analytics'
  | 'Integrations'
  | 'AI Features'
  | 'Deliverability'
  | 'Support'
  | 'Compliance';

/** Single feature with implementation level */
export interface VendorFeature {
  /** Feature category */
  category: FeatureCategory | string;
  /** Feature name */
  feature: string;
  /** Implementation level */
  level: FeatureLevel;
  /** Optional notes */
  notes?: string;
}

// =============================================================================
// VENDOR FEEDBACK
// =============================================================================

/** User feedback theme (pro or con) */
export interface VendorFeedback {
  /** Pro or con */
  type: FeedbackType;
  /** Theme name (e.g., "Ease of Use", "Customer Support") */
  theme: string;
  /** Brief description */
  description: string;
  /** Optional: Weight/frequency (1-5, higher = more common) */
  weight?: number;
  /** Optional: Source URL for attribution */
  source_url?: string;
}

// =============================================================================
// VENDOR (MAIN ENTITY)
// =============================================================================

/** Complete vendor profile */
export interface Vendor {
  /** Unique identifier (slug, e.g., "brevo", "klaviyo") */
  vendor_id: string;

  /** Display name */
  name: string;

  /** Path to logo (relative to /public or absolute URL) */
  logo_path: string;

  /** Vendor website URL */
  website_url: string;

  /** Short description (1-2 sentences) */
  short_description: string;

  /** Long description for details view */
  long_description?: string;

  /** Target company segments */
  target_segments: CompanySize[];

  /** Implementation complexity */
  complexity: Complexity;

  /** G2 rating data */
  g2: ReviewSource;

  /** Capterra rating data */
  capterra: ReviewSource;

  /** Primary pricing model */
  pricing_model: PricingModel;

  /** Starting price bucket */
  starting_price_bucket: PriceBucket;

  /** Pricing notes (e.g., "Free tier available", "Volume discounts") */
  pricing_notes?: string;

  /** Strength tags for quick scanning */
  strength_tags: string[];

  /** Weakness tags for quick scanning */
  weakness_tags: string[];

  /** Industries where vendor excels */
  industries?: string[];

  /** Goals vendor supports well */
  supported_goals?: string[];

  /** Available integrations */
  integrations?: string[];

  /** Features list (populated from vendor_features.csv) */
  features: VendorFeature[];

  /** User feedback themes (populated from vendor_feedback.csv) */
  feedback: VendorFeedback[];

  /** Date of last data update (ISO string) */
  last_updated: string;

  /** Is this Brevo? (for neutral CTA positioning) */
  is_brevo?: boolean;
}

// =============================================================================
// USER PROFILE (BASIC FILTERS)
// =============================================================================

/** User profile for basic filtering (always visible) */
export interface UserProfile {
  /** Company size */
  company_size: CompanySize;

  /** Industry vertical */
  industry: string;

  /** Primary marketing goal */
  primary_goal: string;
}

/** Default profile values */
export const DEFAULT_PROFILE: UserProfile = {
  company_size: 'MM',
  industry: 'General',
  primary_goal: 'Retention',
};

// =============================================================================
// ADVANCED FILTERS (GATED)
// =============================================================================

/** Advanced filters (require lead capture to unlock) */
export interface AdvancedFilters {
  /** Required marketing channels */
  channels: string[];

  /** Required integrations */
  integrations: string[];

  /** Budget sensitivity */
  budget_sensitivity: 'low' | 'medium' | 'high';

  /** Requires governance features (SSO, RBAC, etc.) */
  governance: boolean;

  /** Implementation tolerance */
  implementation_tolerance: 'low' | 'medium' | 'high';

  /** Data model requirements */
  data_model?: string[];
}

/** Default advanced filters (empty/neutral) */
export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  channels: [],
  integrations: [],
  budget_sensitivity: 'medium',
  governance: false,
  implementation_tolerance: 'medium',
  data_model: [],
};

// =============================================================================
// SCORING & RECOMMENDATIONS
// =============================================================================

/** Score breakdown by category */
export interface ScoreBreakdown {
  segment: number;
  goal: number;
  rating: number;
  channels: number;
  integrations: number;
  budget: number;
}

/** Score result with explanation */
export interface VendorScore {
  /** Vendor ID */
  vendor_id: string;

  /** Overall score (0-100) */
  score: number;

  /** Explanation bullets (max 3) */
  reasons: string[];

  /** Score breakdown by category */
  breakdown: ScoreBreakdown;
}

// =============================================================================
// FILTER RESULTS
// =============================================================================

/** Result of filtering vendors */
export interface FilterResult {
  /** Filtered vendors */
  vendors: Vendor[];

  /** Were filters relaxed to ensure results? */
  relaxed: boolean;

  /** Level of filter relaxation (0 = none, 1-4 = progressive relaxation) */
  relaxationLevel: number;

  /** Message if filters were relaxed */
  relaxed_message?: string;
}

// =============================================================================
// COMPARE MODE
// =============================================================================

/** Compare state */
export interface CompareState {
  /** Compare mode active */
  active: boolean;

  /** Selected vendor IDs (2-4) */
  vendor_ids: string[];
}

/** Maximum vendors in compare mode */
export const MAX_COMPARE_VENDORS = 4;

/** Minimum vendors in compare mode */
export const MIN_COMPARE_VENDORS = 2;

// =============================================================================
// SORT OPTIONS
// =============================================================================

/** Sort options for vendor list */
export type SortOption = 'recommended' | 'rating' | 'complexity' | 'name';

/** Sort configuration */
export interface SortConfig {
  /** Sort field */
  field: SortOption;

  /** Sort direction */
  direction: 'asc' | 'desc';
}

// =============================================================================
// CSV ROW TYPES (for parsing)
// =============================================================================

/** Raw CSV row for vendors.csv */
export interface VendorCsvRow {
  vendor_id: string;
  name: string;
  logo_path: string;
  website_url: string;
  short_description: string;
  long_description?: string;
  target_segments: string; // Pipe-separated: "SMB|MM|ENT"
  complexity: string;
  g2_rating: string;
  g2_reviews_count: string;
  g2_url: string;
  g2_last_checked: string;
  capterra_rating: string;
  capterra_reviews_count: string;
  capterra_url: string;
  capterra_last_checked: string;
  pricing_model: string;
  starting_price_bucket: string;
  pricing_notes?: string;
  strength_tags: string; // Pipe-separated
  weakness_tags: string; // Pipe-separated
  industries?: string; // Pipe-separated
  supported_goals?: string; // Pipe-separated
  integrations?: string; // Pipe-separated
  last_updated: string;
  is_brevo?: string; // "true" or "false"
}

/** Raw CSV row for vendor_features.csv */
export interface FeatureCsvRow {
  vendor_id: string;
  category: string;
  feature: string;
  level: string;
  notes?: string;
}

/** Raw CSV row for vendor_feedback.csv */
export interface FeedbackCsvRow {
  vendor_id: string;
  type: string;
  theme: string;
  description: string;
  weight?: string;
  source_url?: string;
}
