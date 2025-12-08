'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { IntroAccordion } from '@/components/IntroAccordion';
import { MarketingPlanSidebar } from '@/components/MarketingPlanSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLeadGate } from '@/lib/lead-capture';
import { getStaticPlan } from '@/data/static-marketing-plans';
import type { Industry } from '@/config/industries';
import type { MarketingPlan } from '@/src/types/marketing-plan';

// Import marketing plan components
import {
  CompanySummary,
  MarketingPrograms,
  ProgramDetails,
  BrevoHelp,
  BrevoCallToAction,
  LoadingBanner,
  ErrorState,
} from '@/components/marketing-plan';

// Valid industries
const VALID_INDUSTRIES: Industry[] = [
  'Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family',
  'SaaS', 'Services', 'Manufacturing', 'Wholesale'
];

export default function Home() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { requireLead, isUnlocked } = useLeadGate();

  // State
  const [industry, setIndustry] = useState<Industry>('Fashion');
  const [domain, setDomain] = useState('');
  const [domainError, setDomainError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [planSource, setPlanSource] = useState<'static' | 'db' | 'ai' | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [progress, setProgress] = useState(5);
  const [elapsedTime, setElapsedTime] = useState(0);

  const planRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Read URL parameters on mount
  useEffect(() => {
    const industryParam = searchParams.get('industry');
    const domainParam = searchParams.get('domain');
    const langParam = searchParams.get('lang');

    if (industryParam && VALID_INDUSTRIES.includes(industryParam as Industry)) {
      setIndustry(industryParam as Industry);
    }

    if (domainParam) {
      setDomain(domainParam);
      // If domain is in URL, check for existing plan
      lookupExistingPlan(domainParam, industryParam as Industry || industry);
    } else {
      // Load static plan for default industry
      loadStaticPlan(industryParam as Industry || industry);
    }
  }, [searchParams]);

  // Load static plan for an industry
  const loadStaticPlan = useCallback((ind: Industry) => {
    const staticPlan = getStaticPlan(ind, language);
    setPlan(staticPlan);
    setPlanSource('static');
    setError(null);
  }, [language]);

  // Lookup existing personalized plan from database
  const lookupExistingPlan = async (domainToLookup: string, ind: Industry) => {
    try {
      const response = await fetch(
        `/api/marketing-plan/lookup?domain=${encodeURIComponent(domainToLookup)}&language=${language}`
      );
      const data = await response.json();

      if (data.found && data.plan) {
        setPlan(data.plan);
        setPlanSource('db');
        setError(null);
      } else {
        // No existing plan, show static
        loadStaticPlan(ind);
      }
    } catch (err) {
      console.error('Error looking up plan:', err);
      loadStaticPlan(ind);
    }
  };

  // Handle industry change
  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry);

    // If no domain, load static plan for new industry
    if (!domain.trim()) {
      loadStaticPlan(newIndustry);
    }
  };

  // Validate domain input
  const validateDomain = (domainInput: string): boolean => {
    const trimmed = domainInput.trim();

    if (!trimmed) {
      setDomainError(t.marketingPlan?.errorEmptyDomain || 'Please enter a company domain');
      return false;
    }

    // Strip protocol and path
    const stripped = trimmed.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    if (!stripped.includes('.')) {
      setDomainError(t.marketingPlan?.errorInvalidDomainFormat || 'Please enter a valid domain (e.g., example.com)');
      return false;
    }

    if (stripped.length < 4) {
      setDomainError(t.marketingPlan?.errorDomainTooShort || 'Domain appears too short');
      return false;
    }

    // Check for placeholder domains
    const placeholders = ['example.com', 'test.com', 'domain.com', 'yourcompany.com'];
    if (placeholders.includes(stripped.toLowerCase())) {
      setDomainError(t.marketingPlan?.errorPlaceholderDomain || 'Please enter your actual company domain');
      return false;
    }

    setDomainError(undefined);
    return true;
  };

  // Generate personalized plan (requires email)
  const handleGeneratePersonalizedPlan = () => {
    if (!validateDomain(domain)) {
      return;
    }

    // Require lead capture
    requireLead({
      reason: 'generate_marketing_plan',
      context: { industry, domain, language },
      onSuccess: () => {
        generatePersonalizedPlan();
      },
    });
  };

  // Core personalized plan generation
  const generatePersonalizedPlan = async () => {
    setIsLoading(true);
    setError(null);
    // Keep the current plan visible while loading (non-blocking UX)
    // Only clear plan if we don't have one
    if (!plan) {
      loadStaticPlan(industry);
    }
    setConversationId(null);
    setPollCount(0);
    setProgress(5);
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Scroll to top to see the loading banner
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Step 1: Create the plan generation job
      const createResponse = await fetch('/api/marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          domain: domain.trim(),
          language,
          force: false,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || `HTTP ${createResponse.status}`);
      }

      const createData = await createResponse.json();

      // If plan was found in DB or returned as static
      if (createData.status === 'complete') {
        setPlan(createData.plan);
        setPlanSource(createData.source);
        setIsLoading(false);
        return;
      }

      // AI generation started - poll for results
      if (createData.status === 'created' && createData.conversationId) {
        setConversationId(createData.conversationId);
        await pollForResults(createData.conversationId);
      } else {
        throw new Error('Unexpected response from API');
      }

    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  // Poll for AI generation results
  const pollForResults = async (jobId: string) => {
    const MAX_POLLS = 60; // 5 minutes max
    const POLL_INTERVAL = 5000; // 5 seconds

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      setPollCount(i + 1);
      setProgress(Math.min(90, 5 + ((i + 1) / MAX_POLLS) * 85));
      setElapsedTime(Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000));

      try {
        const pollResponse = await fetch(`/api/marketing-plan/${jobId}`);
        const pollData = await pollResponse.json();

        if (pollData.status === 'complete') {
          setPlan(pollData.plan);
          setPlanSource('ai');
          setIsLoading(false);
          setProgress(100);
          return;
        }

        if (pollData.status === 'error') {
          // Log debug info if available
          if (pollData.debug) {
            console.error('API Debug info:', JSON.stringify(pollData.debug, null, 2));
          }
          throw new Error(pollData.error || 'Plan generation failed');
        }

        // Still processing - continue polling
      } catch (pollError) {
        console.error('Poll error:', pollError);
        throw pollError;
      }
    }

    // Timeout
    throw new Error('Plan generation timed out. Please try again.');
  };

  // Handle cancel during loading
  const handleCancel = () => {
    setIsLoading(false);
    setConversationId(null);
    loadStaticPlan(industry);
  };

  // Handle retry after error
  const handleRetry = () => {
    if (domain.trim()) {
      generatePersonalizedPlan();
    } else {
      loadStaticPlan(industry);
    }
  };

  // Handle try different domain
  const handleTryDifferentDomain = () => {
    setError(null);
    setDomain('');
    loadStaticPlan(industry);
  };

  // Get programs as array
  const programsArray = plan?.programs_list
    ? (Array.isArray(plan.programs_list)
      ? plan.programs_list
      : Object.values(plan.programs_list))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {t.marketingPlan?.pageTitle || 'Marketing Relationship Plan Generator'}
          </h1>
        </div>

        {/* Loading Banner - Non-blocking, allows user to continue browsing */}
        {isLoading && (
          <LoadingBanner
            companyDomain={domain}
            progress={progress}
            elapsedTime={elapsedTime}
            onCancel={handleCancel}
          />
        )}

        {/* Intro Accordion */}
        <IntroAccordion />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <MarketingPlanSidebar
              industry={industry}
              setIndustry={handleIndustryChange}
              domain={domain}
              setDomain={setDomain}
              onGeneratePersonalizedPlan={handleGeneratePersonalizedPlan}
              isLoading={isLoading}
              isUnlocked={isUnlocked}
              domainError={domainError}
            />
          </div>

          {/* Main Content - Plan Display */}
          <div className="lg:w-3/4" ref={planRef}>
            {/* Error State */}
            {error && !isLoading && (
              <ErrorState
                message={error}
                domainName={domain}
                onRetry={handleRetry}
                onTryDifferentDomain={handleTryDifferentDomain}
              />
            )}

            {/* Plan Display - Always visible, even during loading for non-blocking UX */}
            {plan && !error && (
              <div className="space-y-6">
                {/* CTA Inline (for personalized plans) */}
                {planSource !== 'static' && (
                  <BrevoCallToAction variant="inline" />
                )}

                {/* Company Summary - Only shown for personalized plans */}
                {planSource !== 'static' && (
                  <CompanySummary summary={plan.company_summary} />
                )}

                {/* Marketing Programs Overview */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t.marketingPlan?.marketingPrograms || 'Relationship Programs Overview'}
                </h2>
                <MarketingPrograms programs={plan.programs_list} />

                {/* Program Details (expandable) */}
                {programsArray.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {t.marketingPlan?.programDetailsTitle || 'Program Details'}
                    </h2>
                    {programsArray.map((program, index) => (
                      <ProgramDetails
                        key={index}
                        program={program}
                        programNumber={index + 1}
                      />
                    ))}
                  </div>
                )}

                {/* How Brevo Helps */}
                {plan.how_brevo_helps_you && plan.how_brevo_helps_you.length > 0 && (
                  <BrevoHelp scenarios={plan.how_brevo_helps_you} />
                )}

                {/* Conclusion */}
                {plan.conclusion && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.marketingPlan?.conclusion || 'Conclusion'}
                    </h2>
                    <p className="text-gray-600">{plan.conclusion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <div className="bg-[#0B1221] rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-brevo-green opacity-20 blur-[100px] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full transform translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                {t.marketingPlan?.ctaSectionTitle || 'Ready to Execute Your Marketing Plan?'}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                {t.marketingPlan?.ctaSectionDesc || 'Brevo provides all the tools you need to implement your marketing relationship programs: Email, SMS, WhatsApp, Marketing Automation, and CRM.'}
              </p>
              <div className="flex justify-center">
                <a
                  href="https://www.brevo.com/contact/"
                  className="bg-brevo-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brevo-dark-green transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,146,93,0.39)]"
                >
                  {t.marketingPlan?.ctaSectionButton || 'Talk to an Expert'}
                </a>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                {t.marketingPlan?.ctaSectionNote || 'Free consultation, no commitment required'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA Footer (for static plans, hidden during loading) */}
      {plan && planSource === 'static' && !isLoading && !error && (
        <BrevoCallToAction variant="sticky" />
      )}
    </div>
  );
}
