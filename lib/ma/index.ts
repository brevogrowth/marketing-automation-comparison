/**
 * Marketing Automation Comparison Library
 *
 * Re-exports all MA-related utilities for convenient imports.
 */

// Scoring
export {
  scoreVendor,
  scoreVendors,
  getWhyRecommended,
} from './scoring';

// Filtering
export {
  filterVendors,
  sortVendors,
  filterAndSortVendors,
  getFilterSummary,
  getRelaxationMessage,
} from './filters';

// Types (re-export for convenience)
export type {
  Vendor,
  VendorFeature,
  VendorFeedback,
  UserProfile,
  AdvancedFilters,
  VendorScore,
  FilterResult,
  CompanySize,
  Complexity,
  FeatureLevel,
  SortOption,
} from '@/src/types/ma';
