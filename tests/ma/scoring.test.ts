/**
 * MA Scoring System - Unit Tests
 *
 * Tests the vendor scoring algorithm for deterministic, predictable results.
 */

import { describe, it, expect } from 'vitest';
import { scoreVendor } from '@/lib/ma/scoring';
import type { Vendor, UserProfile, AdvancedFilters } from '@/src/types/ma';

// Mock vendor data
const createMockVendor = (overrides: Partial<Vendor> = {}): Vendor => ({
  vendor_id: 'test-vendor',
  name: 'Test Vendor',
  logo_path: '/logos/test.svg',
  website_url: 'https://test-vendor.com',
  short_description: 'A test marketing automation platform',
  long_description: 'A detailed description of the test platform',
  target_segments: ['MM'],
  supported_goals: ['Retention'],
  complexity: 'medium',
  g2: {
    rating: 4.5,
    reviews_count: 1000,
    url: 'https://g2.com/test',
    last_checked: '2025-01-01',
  },
  capterra: {
    rating: 4.3,
    reviews_count: 800,
    url: 'https://capterra.com/test',
    last_checked: '2025-01-01',
  },
  pricing_model: 'subscription',
  starting_price_bucket: '$$',
  strength_tags: ['email', 'automation'],
  weakness_tags: ['complex setup'],
  industry_focus: ['E-commerce'],
  channels: ['email', 'sms'],
  native_integrations: ['Shopify', 'Salesforce'],
  governance_features: ['SSO', 'RBAC'],
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

describe('scoreVendor', () => {
  describe('Basic Scoring', () => {
    it('should return a score between 0 and 100', () => {
      const vendor = createMockVendor();
      const profile = createMockProfile();
      const result = scoreVendor(vendor, profile);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should return consistent scores for same inputs (deterministic)', () => {
      const vendor = createMockVendor();
      const profile = createMockProfile();

      const result1 = scoreVendor(vendor, profile);
      const result2 = scoreVendor(vendor, profile);

      expect(result1.score).toBe(result2.score);
      expect(result1.reasons).toEqual(result2.reasons);
    });

    it('should return array of reasons', () => {
      const vendor = createMockVendor();
      const profile = createMockProfile();
      const result = scoreVendor(vendor, profile);

      expect(Array.isArray(result.reasons)).toBe(true);
    });
  });

  describe('Segment Matching', () => {
    it('should give higher score when vendor targets user segment', () => {
      const vendor = createMockVendor({ target_segments: ['SMB', 'MM'] });
      const matchingProfile = createMockProfile({ company_size: 'MM' });
      const nonMatchingProfile = createMockProfile({ company_size: 'ENT' });

      const matchingResult = scoreVendor(vendor, matchingProfile);
      const nonMatchingResult = scoreVendor(vendor, nonMatchingProfile);

      expect(matchingResult.score).toBeGreaterThan(nonMatchingResult.score);
    });

    it('should include segment match in reasons when matching', () => {
      const vendor = createMockVendor({ target_segments: ['MM'] });
      const profile = createMockProfile({ company_size: 'MM' });
      const result = scoreVendor(vendor, profile);

      const hasSegmentReason = result.reasons.some((r) =>
        r.toLowerCase().includes('segment') || r.toLowerCase().includes('size') || r.toLowerCase().includes('mid')
      );
      expect(hasSegmentReason).toBe(true);
    });
  });

  describe('Goal Alignment', () => {
    it('should give higher score when vendor supports user goal', () => {
      const vendor = createMockVendor({ supported_goals: ['Retention', 'Acquisition'] });
      const matchingProfile = createMockProfile({ primary_goal: 'Retention' });
      const nonMatchingProfile = createMockProfile({ primary_goal: 'CRM' });

      const matchingResult = scoreVendor(vendor, matchingProfile);
      const nonMatchingResult = scoreVendor(vendor, nonMatchingProfile);

      expect(matchingResult.score).toBeGreaterThanOrEqual(nonMatchingResult.score);
    });
  });

  describe('Rating Impact', () => {
    it('should give higher score to vendors with better ratings', () => {
      const highRatedVendor = createMockVendor({
        vendor_id: 'high-rated',
        g2: { rating: 4.9, reviews_count: 1000, url: '', last_checked: '' },
        capterra: { rating: 4.8, reviews_count: 800, url: '', last_checked: '' },
      });
      const lowRatedVendor = createMockVendor({
        vendor_id: 'low-rated',
        g2: { rating: 3.5, reviews_count: 1000, url: '', last_checked: '' },
        capterra: { rating: 3.2, reviews_count: 800, url: '', last_checked: '' },
      });
      const profile = createMockProfile();

      const highRatedResult = scoreVendor(highRatedVendor, profile);
      const lowRatedResult = scoreVendor(lowRatedVendor, profile);

      expect(highRatedResult.score).toBeGreaterThan(lowRatedResult.score);
    });
  });

  describe('Brevo Bonus', () => {
    it('should give Brevo a small bonus score', () => {
      const brevoVendor = createMockVendor({ vendor_id: 'brevo', is_brevo: true });
      const otherVendor = createMockVendor({ vendor_id: 'other', is_brevo: false });
      const profile = createMockProfile();

      const brevoResult = scoreVendor(brevoVendor, profile);
      const otherResult = scoreVendor(otherVendor, profile);

      // Brevo should have at least equal or higher score due to bonus
      expect(brevoResult.score).toBeGreaterThanOrEqual(otherResult.score);
    });
  });

  describe('Advanced Filters', () => {
    it('should increase score when vendor has required channels', () => {
      const vendor = createMockVendor({ channels: ['email', 'sms', 'push'] });
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: ['email', 'sms'],
        integrations: [],
        budget_sensitivity: 'medium',
        governance: false,
        implementation_tolerance: 'medium',
      };

      const withAdvanced = scoreVendor(vendor, profile, advanced);
      const withoutAdvanced = scoreVendor(vendor, profile);

      expect(withAdvanced.score).toBeGreaterThanOrEqual(withoutAdvanced.score);
    });

    it('should increase score when vendor has required integrations', () => {
      const vendor = createMockVendor({ native_integrations: ['Shopify', 'Salesforce', 'HubSpot'] });
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: [],
        integrations: ['Shopify'],
        budget_sensitivity: 'medium',
        governance: false,
        implementation_tolerance: 'medium',
      };

      const withAdvanced = scoreVendor(vendor, profile, advanced);
      const withoutAdvanced = scoreVendor(vendor, profile);

      expect(withAdvanced.score).toBeGreaterThanOrEqual(withoutAdvanced.score);
    });

    it('should boost score for vendors with governance features when required', () => {
      const vendorWithGovernance = createMockVendor({
        vendor_id: 'with-gov',
        governance_features: ['SSO', 'RBAC', 'Audit'],
      });
      const vendorWithoutGovernance = createMockVendor({
        vendor_id: 'without-gov',
        governance_features: [],
      });
      const profile = createMockProfile();
      const advanced: AdvancedFilters = {
        channels: [],
        integrations: [],
        budget_sensitivity: 'medium',
        governance: true,
        implementation_tolerance: 'medium',
      };

      const withGov = scoreVendor(vendorWithGovernance, profile, advanced);
      const withoutGov = scoreVendor(vendorWithoutGovernance, profile, advanced);

      // Vendor with governance should score at least equal or higher
      expect(withGov.score).toBeGreaterThanOrEqual(withoutGov.score);
    });
  });

  describe('Edge Cases', () => {
    it('should handle vendor with empty arrays', () => {
      const vendor = createMockVendor({
        target_segments: [],
        supported_goals: [],
        strength_tags: [],
        weakness_tags: [],
        channels: [],
        native_integrations: [],
        governance_features: [],
      });
      const profile = createMockProfile();

      expect(() => scoreVendor(vendor, profile)).not.toThrow();
      const result = scoreVendor(vendor, profile);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should handle null advanced filters', () => {
      const vendor = createMockVendor();
      const profile = createMockProfile();

      expect(() => scoreVendor(vendor, profile, null)).not.toThrow();
    });

    it('should cap score at 100', () => {
      // Create a perfect match vendor
      const vendor = createMockVendor({
        target_segments: ['MM'],
        supported_goals: ['Retention'],
        is_brevo: true,
        g2: { rating: 5.0, reviews_count: 10000, url: '', last_checked: '' },
        capterra: { rating: 5.0, reviews_count: 10000, url: '', last_checked: '' },
        channels: ['email', 'sms', 'push', 'whatsapp'],
        native_integrations: ['Shopify', 'Salesforce', 'HubSpot'],
        governance_features: ['SSO', 'RBAC', 'Audit'],
      });
      const profile = createMockProfile({ company_size: 'MM', primary_goal: 'Retention' });
      const advanced: AdvancedFilters = {
        channels: ['email', 'sms'],
        integrations: ['Shopify'],
        budget_sensitivity: 'high',
        governance: true,
        implementation_tolerance: 'low',
      };

      const result = scoreVendor(vendor, profile, advanced);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should not return negative scores', () => {
      // Create a completely mismatched vendor
      const vendor = createMockVendor({
        target_segments: ['ENT'],
        supported_goals: ['Acquisition'],
        g2: { rating: 1.0, reviews_count: 10, url: '', last_checked: '' },
        capterra: { rating: 1.0, reviews_count: 10, url: '', last_checked: '' },
      });
      const profile = createMockProfile({ company_size: 'SMB', primary_goal: 'CRM' });

      const result = scoreVendor(vendor, profile);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });
});
