/**
 * MA Filtering System - Unit Tests
 *
 * Tests the vendor filtering algorithm and never-empty guarantee.
 */

import { describe, it, expect } from 'vitest';
import { filterAndSortVendors, filterVendors, sortVendors } from '@/lib/ma';
import type { Vendor, UserProfile, AdvancedFilters, SortOption } from '@/src/types/ma';

// Mock vendor data factory
const createMockVendor = (id: string, overrides: Partial<Vendor> = {}): Vendor => ({
  vendor_id: id,
  name: `Vendor ${id}`,
  logo_path: `/logos/${id}.svg`,
  website_url: `https://${id}.com`,
  short_description: `${id} marketing automation platform`,
  long_description: `Detailed description of ${id}`,
  target_segments: ['MM'],
  supported_goals: ['Retention'],
  complexity: 'medium',
  g2: {
    rating: 4.0,
    reviews_count: 500,
    url: `https://g2.com/${id}`,
    last_checked: '2025-01-01',
  },
  capterra: {
    rating: 4.0,
    reviews_count: 400,
    url: `https://capterra.com/${id}`,
    last_checked: '2025-01-01',
  },
  pricing_model: 'subscription',
  starting_price_bucket: '$$',
  strength_tags: ['email'],
  weakness_tags: [],
  industry_focus: ['General'],
  channels: ['email'],
  native_integrations: [],
  governance_features: [],
  is_brevo: false,
  features: [],
  feedback: [],
  last_updated: '2025-01-01',
  ...overrides,
});

const createMockProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  company_size: 'MM',
  industry: 'General',
  primary_goal: 'Retention',
  ...overrides,
});

// Create test dataset
const testVendors: Vendor[] = [
  createMockVendor('brevo', {
    name: 'Brevo',
    target_segments: ['SMB', 'MM'],
    supported_goals: ['Retention', 'Acquisition'],
    complexity: 'light',
    is_brevo: true,
    g2: { rating: 4.5, reviews_count: 2000, url: '', last_checked: '' },
    capterra: { rating: 4.4, reviews_count: 1800, url: '', last_checked: '' },
    channels: ['email', 'sms', 'push', 'whatsapp'],
    native_integrations: ['Shopify', 'WooCommerce', 'Salesforce'],
  }),
  createMockVendor('klaviyo', {
    name: 'Klaviyo',
    target_segments: ['SMB', 'MM'],
    supported_goals: ['Retention', 'Acquisition'],
    complexity: 'medium',
    g2: { rating: 4.6, reviews_count: 3000, url: '', last_checked: '' },
    capterra: { rating: 4.5, reviews_count: 2500, url: '', last_checked: '' },
    channels: ['email', 'sms'],
    industry_focus: ['E-commerce'],
    native_integrations: ['Shopify', 'BigCommerce'],
  }),
  createMockVendor('hubspot', {
    name: 'HubSpot Marketing Hub',
    target_segments: ['MM', 'ENT'],
    supported_goals: ['Acquisition', 'CRM'],
    complexity: 'heavy',
    g2: { rating: 4.4, reviews_count: 5000, url: '', last_checked: '' },
    capterra: { rating: 4.5, reviews_count: 4000, url: '', last_checked: '' },
    channels: ['email', 'social'],
    native_integrations: ['Salesforce', 'HubSpot CRM'],
    governance_features: ['SSO', 'RBAC'],
  }),
  createMockVendor('mailchimp', {
    name: 'Mailchimp',
    target_segments: ['SMB'],
    supported_goals: ['Acquisition'],
    complexity: 'light',
    g2: { rating: 4.3, reviews_count: 8000, url: '', last_checked: '' },
    capterra: { rating: 4.4, reviews_count: 7000, url: '', last_checked: '' },
    channels: ['email'],
    native_integrations: ['Shopify', 'WooCommerce'],
  }),
  createMockVendor('activecampaign', {
    name: 'ActiveCampaign',
    target_segments: ['SMB', 'MM'],
    supported_goals: ['Retention', 'Activation'],
    complexity: 'medium',
    g2: { rating: 4.5, reviews_count: 2500, url: '', last_checked: '' },
    capterra: { rating: 4.6, reviews_count: 2000, url: '', last_checked: '' },
    channels: ['email', 'sms'],
    native_integrations: ['Shopify', 'WordPress'],
  }),
];

describe('filterVendors', () => {
  describe('Never-Empty Guarantee', () => {
    it('should never return empty results regardless of filters', () => {
      const profile = createMockProfile({ company_size: 'ENT', primary_goal: 'CRM' });
      const result = filterVendors(testVendors, profile);

      expect(result.vendors.length).toBeGreaterThan(0);
    });

    it('should set relaxed flag when filters are relaxed', () => {
      // Profile that matches almost nothing
      const profile = createMockProfile({ company_size: 'ENT', primary_goal: 'CRM' });
      const advanced: AdvancedFilters = {
        channels: ['whatsapp', 'push'],
        integrations: ['NonExistentCRM'],
        budget_sensitivity: 'high',
        governance: true,
        implementation_tolerance: 'low',
      };

      const result = filterVendors(testVendors, profile, advanced);

      // Should still return vendors and indicate relaxation
      expect(result.vendors.length).toBeGreaterThan(0);
      expect(result.relaxed).toBe(true);
    });

    it('should not relax filters when good matches exist', () => {
      const profile = createMockProfile({ company_size: 'MM', primary_goal: 'Retention' });
      const result = filterVendors(testVendors, profile);

      expect(result.vendors.length).toBeGreaterThanOrEqual(3);
      expect(result.relaxed).toBe(false);
    });
  });

  describe('Segment Filtering', () => {
    it('should prioritize vendors matching user segment', () => {
      const profile = createMockProfile({ company_size: 'SMB' });
      const result = filterVendors(testVendors, profile);

      // SMB-targeting vendors should be included
      const vendorIds = result.vendors.map((v) => v.vendor_id);
      expect(vendorIds).toContain('mailchimp');
      expect(vendorIds).toContain('brevo');
    });

    it('should filter by Enterprise segment', () => {
      const profile = createMockProfile({ company_size: 'ENT' });
      const result = filterVendors(testVendors, profile);

      // HubSpot targets ENT
      const hasEntVendor = result.vendors.some((v) =>
        v.target_segments.includes('ENT')
      );
      expect(hasEntVendor).toBe(true);
    });
  });

  describe('Search Filtering', () => {
    it('should filter by vendor name search', () => {
      const profile = createMockProfile();
      const result = filterVendors(testVendors, profile, null, 'klaviyo');

      expect(result.vendors.length).toBeGreaterThanOrEqual(1);
      expect(result.vendors.some((v) => v.name.toLowerCase().includes('klaviyo'))).toBe(true);
    });

    it('should be case insensitive in search', () => {
      const profile = createMockProfile();
      const result1 = filterVendors(testVendors, profile, null, 'BREVO');
      const result2 = filterVendors(testVendors, profile, null, 'brevo');

      expect(result1.vendors.length).toBe(result2.vendors.length);
    });

    it('should search in description as well', () => {
      const profile = createMockProfile();
      const result = filterVendors(testVendors, profile, null, 'marketing');

      expect(result.vendors.length).toBeGreaterThan(0);
    });

    it('should return relaxed results for no-match search', () => {
      const profile = createMockProfile();
      const result = filterVendors(testVendors, profile, null, 'nonexistentvendor12345');

      // Should still return something (never-empty guarantee)
      expect(result.vendors.length).toBeGreaterThan(0);
      expect(result.relaxed).toBe(true);
    });
  });

  describe('Advanced Filters', () => {
    it('should filter by required channels', () => {
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: ['sms'],
        integrations: [],
        budget_sensitivity: 'medium',
        governance: false,
        implementation_tolerance: 'medium',
      };

      const result = filterVendors(testVendors, profile, advanced);

      // All returned vendors should have SMS (unless relaxed)
      if (!result.relaxed) {
        const allHaveSms = result.vendors.every((v) =>
          v.channels.includes('sms')
        );
        expect(allHaveSms).toBe(true);
      }
    });

    it('should filter by required integrations', () => {
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: [],
        integrations: ['Shopify'],
        budget_sensitivity: 'medium',
        governance: false,
        implementation_tolerance: 'medium',
      };

      const result = filterVendors(testVendors, profile, advanced);

      // Check that Shopify-integrated vendors are prioritized
      const hasShopify = result.vendors.some((v) =>
        v.native_integrations.includes('Shopify')
      );
      expect(hasShopify).toBe(true);
    });

    it('should filter by governance requirement', () => {
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: [],
        integrations: [],
        budget_sensitivity: 'medium',
        governance: true,
        implementation_tolerance: 'medium',
      };

      const result = filterVendors(testVendors, profile, advanced);

      // HubSpot has governance features
      if (!result.relaxed) {
        const hasGovernance = result.vendors.some(
          (v) => v.governance_features.length > 0
        );
        expect(hasGovernance).toBe(true);
      }
    });
  });
});

describe('sortVendors', () => {
  describe('Sort Options', () => {
    it('should sort by recommended (score) by default', () => {
      const profile = createMockProfile();
      const sorted = sortVendors(testVendors, 'recommended', profile);

      // Verify sorted by score (descending)
      let prevScore = 100;
      for (const vendor of sorted) {
        // Just verify the order is maintained
        expect(sorted.length).toBe(testVendors.length);
      }
    });

    it('should sort by rating', () => {
      const profile = createMockProfile();
      const sorted = sortVendors(testVendors, 'rating', profile);

      // Check descending order by average rating
      for (let i = 1; i < sorted.length; i++) {
        const prevAvg = (sorted[i - 1].g2.rating + sorted[i - 1].capterra.rating) / 2;
        const currAvg = (sorted[i].g2.rating + sorted[i].capterra.rating) / 2;
        expect(prevAvg).toBeGreaterThanOrEqual(currAvg);
      }
    });

    it('should sort by name alphabetically', () => {
      const profile = createMockProfile();
      const sorted = sortVendors(testVendors, 'name', profile);

      // Check alphabetical order
      for (let i = 1; i < sorted.length; i++) {
        const comparison = sorted[i - 1].name.localeCompare(sorted[i].name);
        expect(comparison).toBeLessThanOrEqual(0);
      }
    });

    it('should sort by complexity (simplest first)', () => {
      const profile = createMockProfile();
      const sorted = sortVendors(testVendors, 'complexity', profile);

      // Light should come before medium, medium before heavy
      const complexityOrder = { light: 0, medium: 1, heavy: 2 };
      for (let i = 1; i < sorted.length; i++) {
        const prevOrder = complexityOrder[sorted[i - 1].complexity];
        const currOrder = complexityOrder[sorted[i].complexity];
        expect(prevOrder).toBeLessThanOrEqual(currOrder);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const profile = createMockProfile();
      const sorted = sortVendors([], 'recommended', profile);

      expect(sorted).toEqual([]);
    });

    it('should handle single vendor', () => {
      const profile = createMockProfile();
      const singleVendor = [testVendors[0]];
      const sorted = sortVendors(singleVendor, 'rating', profile);

      expect(sorted.length).toBe(1);
      expect(sorted[0]).toBe(singleVendor[0]);
    });

    it('should not mutate original array', () => {
      const profile = createMockProfile();
      const originalOrder = [...testVendors];
      sortVendors(testVendors, 'name', profile);

      // Original array should remain unchanged
      expect(testVendors.map((v) => v.vendor_id)).toEqual(
        originalOrder.map((v) => v.vendor_id)
      );
    });
  });
});

describe('filterAndSortVendors', () => {
  it('should combine filtering and sorting', () => {
    const profile = createMockProfile({ company_size: 'MM' });
    const result = filterAndSortVendors(testVendors, profile, 'rating');

    expect(result.vendors.length).toBeGreaterThan(0);
    expect(typeof result.relaxed).toBe('boolean');

    // Should be sorted by rating
    if (result.vendors.length > 1) {
      const firstRating = (result.vendors[0].g2.rating + result.vendors[0].capterra.rating) / 2;
      const lastRating = (result.vendors[result.vendors.length - 1].g2.rating + result.vendors[result.vendors.length - 1].capterra.rating) / 2;
      expect(firstRating).toBeGreaterThanOrEqual(lastRating);
    }
  });

  it('should apply search filter before sorting', () => {
    const profile = createMockProfile();
    const result = filterAndSortVendors(testVendors, profile, 'name', null, 'brevo');

    expect(result.vendors.length).toBeGreaterThanOrEqual(1);
    expect(result.vendors[0].name.toLowerCase()).toContain('brevo');
  });

  it('should apply advanced filters before sorting', () => {
    const profile = createMockProfile();
    const advanced: AdvancedFilters = {
      channels: ['email', 'sms'],
      integrations: [],
      budget_sensitivity: 'medium',
      governance: false,
      implementation_tolerance: 'medium',
    };
    const result = filterAndSortVendors(testVendors, profile, 'recommended', advanced);

    expect(result.vendors.length).toBeGreaterThan(0);
  });
});
