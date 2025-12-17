'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ToolLayout,
  Container,
  Button,
  cn,
} from '@brevogrowth/brevo-tools-ui-kit';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLeadGate } from '@/lib/lead-capture';
import { getVendors, getVendorsByIds } from '@/data/ma';
import { filterAndSortVendors } from '@/lib/ma';
import { branding } from '@/config/branding';
import { LanguageSelector } from '@/components/LanguageSelector';
import type { UserProfile, AdvancedFilters, CompanySize, SortOption } from '@/src/types/ma';
import { MAX_COMPARE_VENDORS } from '@/src/types/ma';

// Import MA components
import {
  MASidebar,
  MASidebarLoadingState,
  VendorList,
  CompareToolbar,
  CompareBar,
  MALoadingState,
  MACallToAction,
} from '@/components/ma';

// Default profile values
const DEFAULT_PROFILE: UserProfile = {
  company_size: 'MM',
  industry: 'General',
  primary_goal: 'Retention',
};

export default function MAComparison() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { requireLead, isUnlocked } = useLeadGate();
  const ma = t.ma;

  // Profile state (with defaults)
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Advanced filters (gated - null means not unlocked)
  const [advanced, setAdvanced] = useState<AdvancedFilters | null>(null);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareVendorIds, setCompareVendorIds] = useState<string[]>([]);

  // Search & sort
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load all vendors
  const allVendors = useMemo(() => {
    try {
      return getVendors();
    } catch {
      return [];
    }
  }, []);

  // Filter and sort vendors
  const filterResult = useMemo(() => {
    return filterAndSortVendors(allVendors, profile, sortBy, advanced, search);
  }, [allVendors, profile, sortBy, advanced, search]);

  // Get compare vendors
  const compareVendors = useMemo(() => {
    return getVendorsByIds(compareVendorIds);
  }, [compareVendorIds]);

  // Read URL parameters on mount
  useEffect(() => {
    const sizeParam = searchParams.get('size') as CompanySize | null;
    const industryParam = searchParams.get('industry');
    const goalParam = searchParams.get('goal');
    const compareParam = searchParams.get('compare');
    const sortParam = searchParams.get('sort') as SortOption | null;
    const searchParam = searchParams.get('q');

    // Update profile from URL params
    const newProfile: UserProfile = { ...DEFAULT_PROFILE };
    if (sizeParam && ['SMB', 'MM', 'ENT'].includes(sizeParam)) {
      newProfile.company_size = sizeParam;
    }
    if (industryParam) {
      newProfile.industry = industryParam;
    }
    if (goalParam && ['Acquisition', 'Activation', 'Retention', 'Omnichannel', 'CRM'].includes(goalParam)) {
      newProfile.primary_goal = goalParam;
    }
    setProfile(newProfile);

    // Update compare vendors from URL
    if (compareParam) {
      const ids = compareParam.split(',').filter(Boolean).slice(0, MAX_COMPARE_VENDORS);
      if (ids.length > 0) {
        setCompareVendorIds(ids);
        setCompareMode(true);
      }
    }

    // Update sort from URL
    if (sortParam && ['recommended', 'rating', 'name', 'complexity'].includes(sortParam)) {
      setSortBy(sortParam);
    }

    // Update search from URL
    if (searchParam) {
      setSearch(searchParam);
    }

    // Mark loading complete
    setIsLoading(false);
  }, [searchParams]);

  // Sync state to URL (debounced)
  useEffect(() => {
    if (isLoading) return;

    const params = new URLSearchParams();

    // Only add non-default values
    if (profile.company_size !== DEFAULT_PROFILE.company_size) {
      params.set('size', profile.company_size);
    }
    if (profile.industry !== DEFAULT_PROFILE.industry) {
      params.set('industry', profile.industry);
    }
    if (profile.primary_goal !== DEFAULT_PROFILE.primary_goal) {
      params.set('goal', profile.primary_goal);
    }
    if (compareVendorIds.length > 0) {
      params.set('compare', compareVendorIds.join(','));
    }
    if (sortBy !== 'recommended') {
      params.set('sort', sortBy);
    }
    if (search) {
      params.set('q', search);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/';

    // Replace without adding to history for minor changes
    router.replace(newUrl, { scroll: false });
  }, [profile, compareVendorIds, sortBy, search, isLoading, router]);

  // Handle profile update
  const handleProfileChange = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
  }, []);

  // Handle advanced filters unlock
  const handleUnlockAdvanced = useCallback(() => {
    requireLead({
      reason: 'unlock_advanced_ma',
      context: { profile },
      onSuccess: () => {
        setAdvanced({
          channels: [],
          integrations: [],
          budget_sensitivity: 'medium',
          governance: false,
          implementation_tolerance: 'medium',
        });
      },
    });
  }, [requireLead, profile]);

  // Handle advanced filters change
  const handleAdvancedChange = useCallback((newAdvanced: AdvancedFilters | null) => {
    setAdvanced(newAdvanced);
  }, []);

  // Toggle compare vendor
  const handleToggleCompare = useCallback((vendorId: string) => {
    setCompareVendorIds(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      }
      if (prev.length >= MAX_COMPARE_VENDORS) {
        return prev;
      }
      return [...prev, vendorId];
    });
  }, []);

  // Clear compare
  const handleClearCompare = useCallback(() => {
    setCompareVendorIds([]);
    setCompareMode(false);
  }, []);

  // Handle compare navigation
  const handleCompare = useCallback(() => {
    if (compareVendorIds.length >= 2) {
      // For now, scroll to top to show comparison
      // Future: navigate to /compare/[vendors] route
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [compareVendorIds]);

  // Toggle compare mode
  const handleCompareModeChange = useCallback((mode: boolean) => {
    if (!mode) {
      // Exiting compare mode - clear selections
      setCompareVendorIds([]);
    }
    setCompareMode(mode);
  }, []);

  return (
    <ToolLayout
      headerProps={{
        title: t.header.title,
        logo: {
          src: branding.logo.white,
          alt: branding.name,
          href: branding.links.website,
        },
        rightSlot: <LanguageSelector />,
        cta: {
          href: branding.links.demo,
          label: t.header.cta,
          targetBlank: true,
        },
        LinkComponent: Link,
      }}
      footerProps={{
        legalLinks: [
          { label: 'Privacy Policy', href: branding.links.privacy, targetBlank: true },
          { label: 'Terms of Service', href: 'https://www.brevo.com/legal/termsofuse/', targetBlank: true },
        ],
        socialLinks: [
          { platform: 'linkedin', href: branding.social.linkedin },
          { platform: 'twitter', href: branding.social.twitter },
        ],
        LinkComponent: Link,
      }}
      mainClassName="py-8 sm:py-12"
    >
      <Container>
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-tomato)' }}
          >
            {ma?.pageTitle || 'Marketing Automation Comparison'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {ma?.pageSubtitle || 'Find the perfect marketing automation platform for your business'}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="secondary"
            onClick={() => setSidebarOpen(true)}
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {ma?.sidebar?.profileTitle || 'Filters & Profile'}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-1/4 xl:w-1/5">
            {isLoading ? (
              <MASidebarLoadingState />
            ) : (
              <MASidebar
                profile={profile}
                onProfileChange={handleProfileChange}
                advanced={advanced}
                onAdvancedChange={handleAdvancedChange}
                isUnlocked={isUnlocked || advanced !== null}
                onUnlock={handleUnlockAdvanced}
              />
            )}
          </aside>

          {/* Sidebar - Mobile Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-gray-50 shadow-xl overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {ma?.sidebar?.profileTitle || 'Filters & Profile'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <MASidebar
                    profile={profile}
                    onProfileChange={handleProfileChange}
                    advanced={advanced}
                    onAdvancedChange={handleAdvancedChange}
                    isUnlocked={isUnlocked || advanced !== null}
                    onUnlock={handleUnlockAdvanced}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <section className="lg:w-3/4 xl:w-4/5">
            {isLoading ? (
              <MALoadingState />
            ) : (
              <div className="space-y-4">
                {/* Toolbar */}
                <CompareToolbar
                  search={search}
                  onSearchChange={setSearch}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  compareMode={compareMode}
                  onCompareModeChange={handleCompareModeChange}
                  compareCount={compareVendorIds.length}
                  totalCount={filterResult.vendors.length}
                />

                {/* Vendor List */}
                <VendorList
                  filterResult={filterResult}
                  profile={profile}
                  advanced={advanced}
                  compareMode={compareMode}
                  compareVendors={compareVendorIds}
                  onToggleCompare={handleToggleCompare}
                />
              </div>
            )}
          </section>
        </div>

        {/* CTA Section */}
        <MACallToAction />
      </Container>

      {/* Compare Bar - Fixed at bottom when comparing */}
      {compareMode && compareVendorIds.length > 0 && (
        <CompareBar
          vendors={compareVendors}
          onRemove={handleToggleCompare}
          onClear={handleClearCompare}
          onCompare={handleCompare}
        />
      )}

      {/* Bottom padding when compare bar is visible */}
      {compareMode && compareVendorIds.length > 0 && (
        <div className="h-24" />
      )}
    </ToolLayout>
  );
}
