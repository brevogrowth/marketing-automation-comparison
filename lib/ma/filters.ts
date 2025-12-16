/**
 * Vendor Filtering System
 *
 * Provides filtering functionality with a never-empty guarantee.
 * Uses progressive relaxation to always return results.
 */

import type {
  Vendor,
  UserProfile,
  AdvancedFilters,
  FilterResult,
  SortOption,
} from '@/src/types/ma';
import { displaySettings } from '@/config/ma';
import { scoreVendor, scoreVendors } from './scoring';

/**
 * Filter vendors based on profile and advanced filters
 * Implements progressive relaxation to never return empty results
 */
export function filterVendors(
  vendors: Vendor[],
  profile: UserProfile,
  advanced?: AdvancedFilters | null,
  search?: string
): FilterResult {
  // Tier 1: Apply all filters
  let results = applyAllFilters(vendors, profile, advanced, search);
  if (results.length >= displaySettings.minVendorsBeforeRelax) {
    return { vendors: results, relaxed: false, relaxationLevel: 0 };
  }

  // Tier 2: Relax advanced filters
  results = applyAllFilters(vendors, profile, null, search);
  if (results.length >= displaySettings.minVendorsBeforeRelax) {
    return { vendors: results, relaxed: true, relaxationLevel: 1 };
  }

  // Tier 3: Relax to segment only (ignore industry and goal)
  results = vendors.filter((v) =>
    v.target_segments.includes(profile.company_size)
  );
  if (search) {
    results = applySearch(results, search);
  }
  if (results.length >= displaySettings.minVendorsBeforeRelax) {
    return { vendors: results, relaxed: true, relaxationLevel: 2 };
  }

  // Tier 4: Return all vendors sorted by score (search still applies)
  results = search ? applySearch(vendors, search) : [...vendors];
  if (results.length > 0) {
    return { vendors: results, relaxed: true, relaxationLevel: 3 };
  }

  // Tier 5: Return all vendors (final fallback)
  return { vendors: [...vendors], relaxed: true, relaxationLevel: 4 };
}

/**
 * Sort vendors based on the selected sort option
 */
export function sortVendors(
  vendors: Vendor[],
  sortBy: SortOption,
  profile: UserProfile,
  advanced?: AdvancedFilters | null
): Vendor[] {
  const vendorsCopy = [...vendors];

  switch (sortBy) {
    case 'recommended':
      // Sort by fit score (highest first)
      const scores = scoreVendors(vendorsCopy, profile, advanced);
      const scoreMap = new Map(scores.map((s) => [s.vendor_id, s.score]));
      return vendorsCopy.sort(
        (a, b) => (scoreMap.get(b.vendor_id) || 0) - (scoreMap.get(a.vendor_id) || 0)
      );

    case 'rating':
      // Sort by average rating (highest first)
      return vendorsCopy.sort((a, b) => {
        const avgA = (a.g2.rating + a.capterra.rating) / 2;
        const avgB = (b.g2.rating + b.capterra.rating) / 2;
        return avgB - avgA;
      });

    case 'complexity':
      // Sort by complexity (simplest first)
      const complexityOrder = { light: 1, medium: 2, heavy: 3 };
      return vendorsCopy.sort(
        (a, b) => complexityOrder[a.complexity] - complexityOrder[b.complexity]
      );

    case 'name':
      // Sort alphabetically by name
      return vendorsCopy.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return vendorsCopy;
  }
}

/**
 * Filter and sort vendors in one operation
 */
export function filterAndSortVendors(
  vendors: Vendor[],
  profile: UserProfile,
  sortBy: SortOption,
  advanced?: AdvancedFilters | null,
  search?: string
): FilterResult {
  const filtered = filterVendors(vendors, profile, advanced, search);
  const sorted = sortVendors(filtered.vendors, sortBy, profile, advanced);
  return { ...filtered, vendors: sorted };
}

// =============================================================================
// Filter Implementation Functions
// =============================================================================

/**
 * Apply all filters (profile + advanced + search)
 */
function applyAllFilters(
  vendors: Vendor[],
  profile: UserProfile,
  advanced?: AdvancedFilters | null,
  search?: string
): Vendor[] {
  let results = [...vendors];

  // Apply profile filters
  results = applyProfileFilters(results, profile);

  // Apply advanced filters (if provided)
  if (advanced) {
    results = applyAdvancedFilters(results, advanced);
  }

  // Apply search (if provided)
  if (search) {
    results = applySearch(results, search);
  }

  return results;
}

/**
 * Apply profile filters (segment, industry, goal)
 */
function applyProfileFilters(vendors: Vendor[], profile: UserProfile): Vendor[] {
  return vendors.filter((vendor) => {
    // Must match company size segment
    if (!vendor.target_segments.includes(profile.company_size)) {
      return false;
    }

    // Industry filter (if not General)
    if (profile.industry && profile.industry !== 'General') {
      // Vendors don't have explicit industry field, so we check strength_tags
      // This is a soft filter - vendors without matching tags are still included
      // but scored lower in the scoring system
    }

    // Goal filter is handled in scoring, not hard filtering
    // All vendors pass through, but better matches get higher scores

    return true;
  });
}

/**
 * Apply advanced filters
 */
function applyAdvancedFilters(
  vendors: Vendor[],
  advanced: AdvancedFilters
): Vendor[] {
  return vendors.filter((vendor) => {
    // Channel requirements (at least one must match)
    if (advanced.channels && advanced.channels.length > 0) {
      const hasChannel = hasAnyChannel(vendor, advanced.channels);
      if (!hasChannel) {
        return false;
      }
    }

    // Integration requirements (at least one must match)
    if (advanced.integrations && advanced.integrations.length > 0) {
      const hasIntegration = hasAnyIntegration(vendor, advanced.integrations);
      if (!hasIntegration) {
        return false;
      }
    }

    // Governance requirement
    if (advanced.governance) {
      const hasGovernance = vendor.strength_tags.some((tag) =>
        ['enterprise', 'sso', 'rbac', 'governance', 'compliance', 'security'].includes(
          tag.toLowerCase()
        )
      );
      if (!hasGovernance) {
        return false;
      }
    }

    // Implementation tolerance
    if (advanced.implementation_tolerance) {
      const matchesComplexity = checkComplexityTolerance(
        vendor,
        advanced.implementation_tolerance
      );
      if (!matchesComplexity) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Apply search filter
 */
function applySearch(vendors: Vendor[], search: string): Vendor[] {
  const searchLower = search.toLowerCase().trim();
  if (!searchLower) return vendors;

  return vendors.filter((vendor) => {
    // Search in name
    if (vendor.name.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Search in description
    if (vendor.short_description.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Search in strength tags
    if (vendor.strength_tags.some((tag) => tag.toLowerCase().includes(searchLower))) {
      return true;
    }

    // Search in integrations
    if (vendor.integrations?.some((i) => i.toLowerCase().includes(searchLower))) {
      return true;
    }

    return false;
  });
}

// =============================================================================
// Helper Functions
// =============================================================================

function hasAnyChannel(vendor: Vendor, requiredChannels: string[]): boolean {
  const vendorChannels = vendor.features
    .filter((f) => f.category.toLowerCase() === 'channels')
    .map((f) => f.feature.toLowerCase());

  const channelTags = vendor.strength_tags.map((t) => t.toLowerCase());

  for (const channel of requiredChannels) {
    const channelLower = channel.toLowerCase();
    if (
      vendorChannels.some((vc) => vc.includes(channelLower)) ||
      channelTags.some((ct) => ct.includes(channelLower))
    ) {
      return true;
    }
  }
  return false;
}

function hasAnyIntegration(
  vendor: Vendor,
  requiredIntegrations: string[]
): boolean {
  if (!vendor.integrations || vendor.integrations.length === 0) {
    return false;
  }

  const vendorIntegrations = vendor.integrations.map((i) => i.toLowerCase());

  for (const integration of requiredIntegrations) {
    if (vendorIntegrations.some((vi) => vi.includes(integration.toLowerCase()))) {
      return true;
    }
  }
  return false;
}

function checkComplexityTolerance(vendor: Vendor, tolerance: string): boolean {
  switch (tolerance) {
    case 'low':
      return vendor.complexity === 'light';
    case 'medium':
      return vendor.complexity === 'light' || vendor.complexity === 'medium';
    case 'high':
      return true;
    default:
      return true;
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get a summary of applied filters for UI display
 */
export function getFilterSummary(
  profile: UserProfile,
  advanced?: AdvancedFilters | null
): string[] {
  const summary: string[] = [];

  summary.push(`Size: ${profile.company_size}`);
  if (profile.industry && profile.industry !== 'General') {
    summary.push(`Industry: ${profile.industry}`);
  }
  summary.push(`Goal: ${profile.primary_goal}`);

  if (advanced) {
    if (advanced.channels && advanced.channels.length > 0) {
      summary.push(`Channels: ${advanced.channels.join(', ')}`);
    }
    if (advanced.integrations && advanced.integrations.length > 0) {
      summary.push(`Integrations: ${advanced.integrations.join(', ')}`);
    }
    if (advanced.governance) {
      summary.push('Governance required');
    }
    if (advanced.budget_sensitivity) {
      summary.push(`Budget: ${advanced.budget_sensitivity}`);
    }
    if (advanced.implementation_tolerance) {
      summary.push(`Complexity: ${advanced.implementation_tolerance}`);
    }
  }

  return summary;
}

/**
 * Get human-readable message about filter relaxation
 */
export function getRelaxationMessage(
  result: FilterResult,
  t?: { ma?: { vendors?: { showingClosestMatches?: string } } }
): string | null {
  if (!result.relaxed) {
    return null;
  }

  const defaultMessages = [
    null, // level 0 - no relaxation
    'Some advanced filters were relaxed to show more options.',
    'Showing vendors for your company size. Refine other criteria for better matches.',
    'Showing all vendors sorted by relevance. Try adjusting your filters.',
    'Showing all available vendors.',
  ];

  // Use translation if available
  if (t?.ma?.vendors?.showingClosestMatches) {
    return t.ma.vendors.showingClosestMatches;
  }

  return defaultMessages[result.relaxationLevel] || defaultMessages[4];
}
