/**
 * Configuration Index
 *
 * Re-exports all configuration modules for easy importing.
 *
 * Usage:
 *   import { branding, industries, apiConfig } from '@/config';
 */

export { branding, type Branding, type Partner } from './branding';
export {
  industries,
  b2cIndustries,
  b2bIndustries,
  allIndustries,
  priceTiers,
  isB2B,
  isB2C,
  getIndustryLabel,
  type Industry,
  type B2CIndustry,
  type B2BIndustry,
  type PriceTier,
} from './industries';
export { apiConfig, type ApiConfig } from './api';
