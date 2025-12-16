/**
 * Vendor Scoring System
 *
 * Calculates fit scores for vendors based on user profile and advanced filters.
 * Generates "Why Recommended" explanations for each vendor.
 */

import type {
  Vendor,
  UserProfile,
  AdvancedFilters,
  VendorScore,
  CompanySize,
} from '@/src/types/ma';
import { scoringWeights } from '@/config/ma';

/**
 * Goal-to-strength-tags mapping
 * Used to calculate goal alignment score
 */
const goalStrengthMapping: Record<string, string[]> = {
  Acquisition: [
    'lead-generation',
    'landing-pages',
    'forms',
    'ads',
    'social',
    'acquisition',
    'growth',
  ],
  Activation: [
    'onboarding',
    'welcome-series',
    'activation',
    'engagement',
    'behavioral',
    'triggers',
  ],
  Retention: [
    'loyalty',
    'retention',
    'churn',
    'lifecycle',
    'customer-success',
    'engagement',
  ],
  Omnichannel: [
    'omnichannel',
    'multi-channel',
    'email',
    'sms',
    'push',
    'whatsapp',
    'unified',
  ],
  CRM: ['crm', 'sales', 'pipeline', 'contacts', 'deals', 'integration', 'sync'],
};

/**
 * Calculate the fit score for a vendor based on user profile
 */
export function scoreVendor(
  vendor: Vendor,
  profile: UserProfile,
  advanced?: AdvancedFilters | null
): VendorScore {
  let score = scoringWeights.baseScore;
  const reasons: string[] = [];
  const breakdown: VendorScore['breakdown'] = {
    segment: 0,
    goal: 0,
    rating: 0,
    channels: 0,
    integrations: 0,
    budget: 0,
  };

  // 1. Segment match (+20)
  if (vendor.target_segments.includes(profile.company_size)) {
    breakdown.segment = scoringWeights.segmentMatch;
    score += breakdown.segment;
    reasons.push(getSegmentReason(profile.company_size, vendor.name));
  }

  // 2. Goal alignment (+15)
  const goalScore = calculateGoalAlignment(vendor, profile.primary_goal);
  if (goalScore > 0) {
    breakdown.goal = goalScore;
    score += breakdown.goal;
    reasons.push(getGoalReason(profile.primary_goal, vendor.name));
  }

  // 3. Rating bonus (0-10)
  const avgRating = (vendor.g2.rating + vendor.capterra.rating) / 2;
  breakdown.rating = Math.round((avgRating / 5) * scoringWeights.ratingBonus);
  score += breakdown.rating;
  if (avgRating >= 4.5) {
    reasons.push(`Top-rated with ${avgRating.toFixed(1)}/5 average rating`);
  }

  // 4. Industry fit (+10) - if industry matches vendor's strength tags
  if (profile.industry && profile.industry !== 'General') {
    const industryTags = [profile.industry.toLowerCase(), profile.industry.toLowerCase().replace(' ', '-')];
    const hasIndustryFit = vendor.strength_tags.some((tag) =>
      industryTags.some((it) => tag.toLowerCase().includes(it))
    );
    if (hasIndustryFit) {
      score += scoringWeights.industryFit;
      reasons.push(`Strong fit for ${profile.industry} industry`);
    }
  }

  // 5. Advanced filters (if unlocked)
  if (advanced) {
    // Channel coverage
    if (advanced.channels && advanced.channels.length > 0) {
      const channelMatches = countChannelMatches(vendor, advanced.channels);
      breakdown.channels = Math.min(
        channelMatches * scoringWeights.channelMatch,
        scoringWeights.channelMatch * 3
      );
      score += breakdown.channels;
      if (channelMatches >= 3) {
        reasons.push('Excellent channel coverage');
      }
    }

    // Integration matches
    if (advanced.integrations && advanced.integrations.length > 0) {
      const integrationMatches = countIntegrationMatches(
        vendor,
        advanced.integrations
      );
      breakdown.integrations = Math.min(
        integrationMatches * scoringWeights.integrationMatch,
        scoringWeights.integrationMatch * 4
      );
      score += breakdown.integrations;
      if (integrationMatches >= 2) {
        reasons.push('Has your required integrations');
      }
    }

    // Budget fit
    if (advanced.budget_sensitivity) {
      const budgetScore = calculateBudgetFit(vendor, advanced.budget_sensitivity);
      breakdown.budget = budgetScore;
      score += budgetScore;
      if (budgetScore > 0) {
        reasons.push(getBudgetReason(advanced.budget_sensitivity, vendor));
      }
    }

    // Governance requirements
    if (advanced.governance) {
      const hasGovernance = vendor.strength_tags.some((tag) =>
        ['enterprise', 'sso', 'rbac', 'governance', 'compliance', 'security'].includes(
          tag.toLowerCase()
        )
      );
      if (hasGovernance) {
        score += 5;
        reasons.push('Enterprise-grade security & governance');
      }
    }

    // Implementation tolerance
    if (advanced.implementation_tolerance) {
      const complexityMatch = matchesComplexityTolerance(
        vendor,
        advanced.implementation_tolerance
      );
      if (complexityMatch) {
        score += 5;
        reasons.push(getComplexityReason(vendor.complexity));
      }
    }
  }

  // Ensure score is within bounds
  score = Math.min(100, Math.max(0, Math.round(score)));

  return {
    vendor_id: vendor.vendor_id,
    score,
    breakdown,
    reasons: reasons.slice(0, 3), // Max 3 reasons
  };
}

/**
 * Score multiple vendors and return sorted by score
 */
export function scoreVendors(
  vendors: Vendor[],
  profile: UserProfile,
  advanced?: AdvancedFilters | null
): VendorScore[] {
  return vendors
    .map((vendor) => scoreVendor(vendor, profile, advanced))
    .sort((a, b) => b.score - a.score);
}

/**
 * Get "Why Recommended" reasons for a vendor
 */
export function getWhyRecommended(
  vendor: Vendor,
  profile: UserProfile,
  advanced?: AdvancedFilters | null
): string[] {
  const score = scoreVendor(vendor, profile, advanced);
  return score.reasons;
}

// =============================================================================
// Helper Functions
// =============================================================================

function calculateGoalAlignment(vendor: Vendor, goal: string): number {
  const relevantTags = goalStrengthMapping[goal] || [];
  const matchCount = vendor.strength_tags.filter((tag) =>
    relevantTags.some((rt) => tag.toLowerCase().includes(rt))
  ).length;

  if (matchCount >= 3) return scoringWeights.goalAlignment;
  if (matchCount >= 2) return Math.round(scoringWeights.goalAlignment * 0.7);
  if (matchCount >= 1) return Math.round(scoringWeights.goalAlignment * 0.4);
  return 0;
}

function countChannelMatches(vendor: Vendor, requiredChannels: string[]): number {
  // Check which required channels the vendor supports via features
  const vendorChannels = vendor.features
    .filter((f) => f.category.toLowerCase() === 'channels')
    .map((f) => f.feature.toLowerCase());

  // Also check strength tags for channel mentions
  const channelTags = vendor.strength_tags.map((t) => t.toLowerCase());

  let matches = 0;
  for (const channel of requiredChannels) {
    const channelLower = channel.toLowerCase();
    if (
      vendorChannels.some((vc) => vc.includes(channelLower)) ||
      channelTags.some((ct) => ct.includes(channelLower))
    ) {
      matches++;
    }
  }
  return matches;
}

function countIntegrationMatches(
  vendor: Vendor,
  requiredIntegrations: string[]
): number {
  if (!vendor.integrations) return 0;
  const vendorIntegrations = vendor.integrations.map((i) => i.toLowerCase());

  let matches = 0;
  for (const integration of requiredIntegrations) {
    if (
      vendorIntegrations.some((vi) =>
        vi.includes(integration.toLowerCase())
      )
    ) {
      matches++;
    }
  }
  return matches;
}

function calculateBudgetFit(
  vendor: Vendor,
  budgetSensitivity: string
): number {
  const bucket = vendor.starting_price_bucket.toLowerCase();

  switch (budgetSensitivity) {
    case 'low': // Price-sensitive
      if (bucket.includes('low') || bucket.includes('free')) {
        return scoringWeights.budgetFit;
      }
      if (bucket.includes('medium')) {
        return Math.round(scoringWeights.budgetFit * 0.5);
      }
      return 0;

    case 'medium': // Balanced
      if (bucket.includes('medium')) {
        return scoringWeights.budgetFit;
      }
      if (bucket.includes('low') || bucket.includes('high')) {
        return Math.round(scoringWeights.budgetFit * 0.7);
      }
      return Math.round(scoringWeights.budgetFit * 0.3);

    case 'high': // Value-focused (less price sensitive)
      // All options work, slight preference for proven enterprise solutions
      if (bucket.includes('enterprise') || bucket.includes('high')) {
        return scoringWeights.budgetFit;
      }
      return Math.round(scoringWeights.budgetFit * 0.8);

    default:
      return 0;
  }
}

function matchesComplexityTolerance(
  vendor: Vendor,
  tolerance: string
): boolean {
  switch (tolerance) {
    case 'low': // Quick setup only
      return vendor.complexity === 'light';
    case 'medium': // Some complexity OK
      return vendor.complexity === 'light' || vendor.complexity === 'medium';
    case 'high': // Full customization OK
      return true; // All complexities acceptable
    default:
      return true;
  }
}

function getSegmentReason(size: CompanySize, vendorName: string): string {
  const sizeLabels: Record<CompanySize, string> = {
    SMB: 'small businesses',
    MM: 'mid-market companies',
    ENT: 'enterprises',
  };
  return `Built specifically for ${sizeLabels[size]}`;
}

function getGoalReason(goal: string, vendorName: string): string {
  const goalPhrases: Record<string, string> = {
    Acquisition: 'Strong lead generation and acquisition capabilities',
    Activation: 'Excellent onboarding and user activation features',
    Retention: 'Proven retention and loyalty program tools',
    Omnichannel: 'True omnichannel orchestration across all channels',
    CRM: 'Deep CRM integration and sales alignment',
  };
  return goalPhrases[goal] || `Aligned with your ${goal} goals`;
}

function getBudgetReason(
  budgetSensitivity: string,
  vendor: Vendor
): string {
  switch (budgetSensitivity) {
    case 'low':
      return 'Competitive pricing for your budget';
    case 'medium':
      return 'Good value for money';
    case 'high':
      return 'Premium features worth the investment';
    default:
      return 'Fits your budget criteria';
  }
}

function getComplexityReason(complexity: string): string {
  switch (complexity) {
    case 'light':
      return 'Easy to set up and get started';
    case 'medium':
      return 'Balanced setup complexity with powerful features';
    case 'heavy':
      return 'Highly customizable for complex needs';
    default:
      return 'Matches your implementation preferences';
  }
}
