/**
 * Industry Configuration
 *
 * Defines the supported industries and business types for the KPI benchmark.
 */

/** B2C (Business to Consumer) industries */
export const b2cIndustries = [
  'Fashion',
  'Beauty',
  'Home',
  'Electronics',
  'Food',
  'Sports',
  'Luxury',
  'Family',
] as const;

/** B2B (Business to Business) industries */
export const b2bIndustries = [
  'SaaS',
  'Services',
  'Manufacturing',
  'Wholesale',
] as const;

/** All industries combined */
export const industries = {
  b2c: b2cIndustries,
  b2b: b2bIndustries,
} as const;

/** Type for B2C industries */
export type B2CIndustry = typeof b2cIndustries[number];

/** Type for B2B industries */
export type B2BIndustry = typeof b2bIndustries[number];

/** Type for all industries */
export type Industry = B2CIndustry | B2BIndustry;

/** All industries as a flat array */
export const allIndustries: Industry[] = [...b2cIndustries, ...b2bIndustries];

/**
 * Check if an industry is B2B
 * @param industry - Industry to check
 * @returns true if the industry is B2B
 */
export function isB2B(industry: Industry): industry is B2BIndustry {
  return (b2bIndustries as readonly string[]).includes(industry);
}

/**
 * Check if an industry is B2C
 * @param industry - Industry to check
 * @returns true if the industry is B2C
 */
export function isB2C(industry: Industry): industry is B2CIndustry {
  return (b2cIndustries as readonly string[]).includes(industry);
}

/**
 * Get industry display name with business type
 * @param industry - Industry to format
 * @returns Formatted industry name (e.g., "Fashion (B2C)")
 */
export function getIndustryLabel(industry: Industry): string {
  const type = isB2B(industry) ? 'B2B' : 'B2C';
  return `${industry} (${type})`;
}

/** Price tiers for benchmark comparison */
export const priceTiers = ['Budget', 'Mid-Range', 'Luxury'] as const;

/** Type for price tiers */
export type PriceTier = typeof priceTiers[number];
