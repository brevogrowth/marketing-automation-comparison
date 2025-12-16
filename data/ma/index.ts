/**
 * Vendor Data Loader
 *
 * Provides functions to load and access vendor data from the generated JSON file.
 * Uses caching to avoid repeated JSON parsing.
 */

import type { Vendor } from '@/src/types/ma';

// Import generated vendor data
// This file is generated at build time by scripts/generate-ma-data.ts
import vendorsData from './generated/vendors.json';

// Cache for vendor data
let vendorCache: Vendor[] | null = null;
let vendorByIdCache: Map<string, Vendor> | null = null;

/**
 * Get all vendors
 * Results are cached after first call for performance
 */
export function getVendors(): Vendor[] {
  if (!vendorCache) {
    vendorCache = vendorsData as Vendor[];
  }
  return vendorCache;
}

/**
 * Get a vendor by ID
 * Uses a Map cache for O(1) lookups
 */
export function getVendorById(vendorId: string): Vendor | undefined {
  if (!vendorByIdCache) {
    vendorByIdCache = new Map();
    const vendors = getVendors();
    for (const vendor of vendors) {
      vendorByIdCache.set(vendor.vendor_id, vendor);
    }
  }
  return vendorByIdCache.get(vendorId);
}

/**
 * Get multiple vendors by IDs
 * Maintains the order of input IDs
 */
export function getVendorsByIds(vendorIds: string[]): Vendor[] {
  return vendorIds
    .map((id) => getVendorById(id))
    .filter((vendor): vendor is Vendor => vendor !== undefined);
}

/**
 * Get vendors by target segment
 */
export function getVendorsBySegment(segment: 'SMB' | 'MM' | 'ENT'): Vendor[] {
  return getVendors().filter((vendor) => vendor.target_segments.includes(segment));
}

/**
 * Get all unique feature categories from vendors
 */
export function getFeatureCategories(): string[] {
  const categories = new Set<string>();
  for (const vendor of getVendors()) {
    for (const feature of vendor.features) {
      categories.add(feature.category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get all unique integrations from vendors
 */
export function getAllIntegrations(): string[] {
  const integrations = new Set<string>();
  for (const vendor of getVendors()) {
    if (vendor.integrations) {
      for (const integration of vendor.integrations) {
        integrations.add(integration);
      }
    }
  }
  return Array.from(integrations).sort();
}

/**
 * Get vendor count
 */
export function getVendorCount(): number {
  return getVendors().length;
}

/**
 * Clear all caches (useful for testing)
 */
export function clearVendorCache(): void {
  vendorCache = null;
  vendorByIdCache = null;
}
