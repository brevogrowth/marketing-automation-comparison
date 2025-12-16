/**
 * Marketing Automation Comparison Configuration
 *
 * Contains all configuration values for the MA comparison tool
 * including filter options, scoring weights, and display settings.
 */

import type { CompanySize, Complexity, SortOption } from '@/src/types/ma';

// =============================================================================
// COMPANY SIZE / SEGMENT
// =============================================================================

export const companySizes: { value: CompanySize; label: string; description: string }[] = [
  {
    value: 'SMB',
    label: 'Small Business',
    description: '1-50 employees',
  },
  {
    value: 'MM',
    label: 'Mid-Market',
    description: '51-500 employees',
  },
  {
    value: 'ENT',
    label: 'Enterprise',
    description: '500+ employees',
  },
];

export const companySizeLabels: Record<CompanySize, string> = {
  SMB: 'Small Business',
  MM: 'Mid-Market',
  ENT: 'Enterprise',
};

// =============================================================================
// INDUSTRIES
// =============================================================================

export const industries = [
  'General',
  'E-commerce',
  'SaaS',
  'Services',
  'Healthcare',
  'Finance',
  'Education',
  'Non-profit',
  'Media',
  'Travel',
  'Real Estate',
  'Manufacturing',
] as const;

export type Industry = (typeof industries)[number];

// =============================================================================
// PRIMARY GOALS
// =============================================================================

export const primaryGoals = [
  {
    value: 'Acquisition',
    label: 'Customer Acquisition',
    description: 'Attract and convert new customers',
  },
  {
    value: 'Activation',
    label: 'User Activation',
    description: 'Onboard and engage new users',
  },
  {
    value: 'Retention',
    label: 'Customer Retention',
    description: 'Keep existing customers engaged',
  },
  {
    value: 'Omnichannel',
    label: 'Omnichannel Marketing',
    description: 'Coordinate across multiple channels',
  },
  {
    value: 'CRM',
    label: 'CRM Alignment',
    description: 'Integrate with sales and CRM',
  },
] as const;

export type PrimaryGoal = (typeof primaryGoals)[number]['value'];

// =============================================================================
// MARKETING CHANNELS (Advanced Filter)
// =============================================================================

export const marketingChannels = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'push', label: 'Push Notifications' },
  { value: 'in-app', label: 'In-App Messaging' },
  { value: 'web-push', label: 'Web Push' },
] as const;

export type MarketingChannel = (typeof marketingChannels)[number]['value'];

// =============================================================================
// INTEGRATIONS (Advanced Filter)
// =============================================================================

export const integrationCategories = [
  {
    category: 'E-commerce',
    integrations: ['Shopify', 'WooCommerce', 'BigCommerce', 'Magento', 'PrestaShop'],
  },
  {
    category: 'CRM',
    integrations: ['Salesforce', 'HubSpot CRM', 'Pipedrive', 'Zoho CRM'],
  },
  {
    category: 'Data',
    integrations: ['Segment', 'Snowflake', 'BigQuery', 'Google Analytics'],
  },
  {
    category: 'Productivity',
    integrations: ['Zapier', 'Make', 'Slack', 'Microsoft Teams'],
  },
] as const;

export const popularIntegrations = [
  'Shopify',
  'WooCommerce',
  'Salesforce',
  'WordPress',
  'Zapier',
  'Segment',
];

// =============================================================================
// COMPLEXITY LEVELS
// =============================================================================

export const complexityLevels: { value: Complexity; label: string; description: string }[] = [
  {
    value: 'light',
    label: 'Easy',
    description: 'Quick setup, intuitive interface',
  },
  {
    value: 'medium',
    label: 'Moderate',
    description: 'Some learning curve, good documentation',
  },
  {
    value: 'heavy',
    label: 'Complex',
    description: 'Requires training, powerful but complex',
  },
];

export const complexityLabels: Record<Complexity, string> = {
  light: 'Easy',
  medium: 'Moderate',
  heavy: 'Complex',
};

// =============================================================================
// SORT OPTIONS
// =============================================================================

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'complexity', label: 'Simplest First' },
  { value: 'name', label: 'Name (A-Z)' },
];

// =============================================================================
// SCORING WEIGHTS
// =============================================================================

export const scoringWeights = {
  /** Points for matching target segment */
  segmentMatch: 20,

  /** Points for goal alignment */
  goalAlignment: 15,

  /** Points for industry fit */
  industryFit: 10,

  /** Max points from rating (scaled 0-10) */
  ratingBonus: 10,

  /** Base score for all vendors */
  baseScore: 50,

  /** Advanced filter bonuses */
  channelMatch: 5,
  integrationMatch: 3,
  budgetFit: 10,
};

// =============================================================================
// DISPLAY SETTINGS
// =============================================================================

export const displaySettings = {
  /** Minimum vendors to show before relaxing filters */
  minVendorsBeforeRelax: 3,

  /** Default number of vendors per page (if paginated) */
  vendorsPerPage: 20,

  /** Max vendors in compare mode */
  maxCompareVendors: 4,

  /** Min vendors in compare mode */
  minCompareVendors: 2,

  /** Show "Why Recommended" bullets */
  showWhyRecommended: true,

  /** Max bullets in "Why Recommended" */
  maxRecommendedBullets: 3,
};

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const defaults = {
  profile: {
    company_size: 'MM' as CompanySize,
    industry: 'General' as Industry,
    primary_goal: 'Retention' as PrimaryGoal,
  },
  sort: 'recommended' as SortOption,
};
