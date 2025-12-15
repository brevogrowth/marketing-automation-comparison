'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  PlanActions,
} from '@/components/marketing-plan';

// Valid industries
const VALID_INDUSTRIES: Industry[] = [
  'Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family',
  'SaaS', 'Services', 'Manufacturing', 'Wholesale'
];

// Safe JSON stringify that handles circular references
const safeJsonStringify = (obj: unknown, maxLength: number = 500): string => {
  try {
    const seen = new WeakSet();
    const result = JSON.stringify(obj, (key, value) => {
      // Skip DOM elements and React internal properties
      if (typeof Element !== 'undefined' && value instanceof Element) {
        return '[DOM Element]';
      }
      if (typeof Node !== 'undefined' && value instanceof Node) {
        return '[DOM Node]';
      }
      if (key.startsWith('__react') || key.startsWith('_react')) {
        return '[React Internal]';
      }
      if (typeof value === 'function') {
        return '[Function]';
      }
      // Handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }, 2);
    return result.length > maxLength ? result.substring(0, maxLength) + '...' : result;
  } catch {
    return '[Unable to serialize]';
  }
};

export default function DomainPlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { requireLead, isUnlocked } = useLeadGate();

  // Extract domain from URL params
  const urlDomain = params.domain as string;

  // State
  const [industry, setIndustry] = useState<Industry>('Fashion');
  const [domain, setDomain] = useState(urlDomain || '');
  const [domainError, setDomainError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<Record<string, unknown> | null>(null);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [planSource, setPlanSource] = useState<'static' | 'db' | 'ai' | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(5);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [autoGenerateTriggered, setAutoGenerateTriggered] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [lastPollStatus, setLastPollStatus] = useState<string | null>(null);
  const [lastPollMessage, setLastPollMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const startTimeRef = React.useRef<number | null>(null);

  // Helper to add debug log
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]);
  };

  // Read URL parameters
  const forceParam = searchParams.get('force') === 'true';
  const industryParam = searchParams.get('industry');

  // Set industry from URL param
  useEffect(() => {
    if (industryParam && VALID_INDUSTRIES.includes(industryParam as Industry)) {
      setIndustry(industryParam as Industry);
    }
  }, [industryParam]);

  // Load plan from DB on mount
  useEffect(() => {
    if (urlDomain) {
      if (forceParam) {
        // Force regeneration - skip DB lookup and trigger generation
        setIsLoading(false);
        setDomain(urlDomain);
        loadStaticPlan(industryParam as Industry || industry);
        // Auto-trigger generation after a short delay to let lead-capture initialize
        if (!autoGenerateTriggered) {
          setAutoGenerateTriggered(true);
          setTimeout(() => {
            triggerAutoGeneration(true);
          }, 500);
        }
      } else {
        loadPlanFromDB(urlDomain);
      }
    }
  }, [urlDomain, language, forceParam]);

  // Auto-generate function that triggers lead-capture then generation
  const triggerAutoGeneration = (forceRegenerate: boolean = false) => {
    if (!urlDomain) return;

    // Validate domain
    const stripped = urlDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!stripped.includes('.') || stripped.length < 4) {
      setError(t.marketingPlan?.errorInvalidDomainFormat || 'Invalid domain format');
      return;
    }

    // Require lead capture before generating
    requireLead({
      reason: 'generate_marketing_plan',
      context: { industry, domain: urlDomain, language },
      onSuccess: () => {
        generatePersonalizedPlan(forceRegenerate);
      },
    });
  };

  // Load plan from database
  const loadPlanFromDB = async (domainToLoad: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/marketing-plan/lookup?domain=${encodeURIComponent(domainToLoad)}&language=${language}`
      );
      const data = await response.json();

      if (data.found && data.plan) {
        setPlan(data.plan);
        setPlanSource('db');
        setDomain(domainToLoad);

        // Try to infer industry from plan
        if (data.plan.company_summary?.industry) {
          const planIndustry = data.plan.company_summary.industry as Industry;
          if (VALID_INDUSTRIES.includes(planIndustry)) {
            setIndustry(planIndustry);
          }
        }
      } else {
        // Plan not found - auto-trigger generation with lead-capture
        setDomain(domainToLoad);
        loadStaticPlan(industryParam as Industry || industry);

        // Auto-trigger generation (with lead-capture gate)
        if (!autoGenerateTriggered) {
          setAutoGenerateTriggered(true);
          setTimeout(() => {
            triggerAutoGeneration(false);
          }, 500);
        }
      }
    } catch (err) {
      console.error('Error loading plan:', err);
      setError(t.marketingPlan?.errorLoadingPlan || 'Failed to load marketing plan');
      loadStaticPlan(industry);
    } finally {
      setIsLoading(false);
    }
  };

  // Load static plan for an industry
  const loadStaticPlan = (ind: Industry) => {
    const staticPlan = getStaticPlan(ind, language);
    setPlan(staticPlan);
    setPlanSource('static');
  };

  // Handle industry change
  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry);
    if (planSource === 'static') {
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

    const stripped = trimmed.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    if (!stripped.includes('.')) {
      setDomainError(t.marketingPlan?.errorInvalidDomainFormat || 'Please enter a valid domain (e.g., example.com)');
      return false;
    }

    if (stripped.length < 4) {
      setDomainError(t.marketingPlan?.errorDomainTooShort || 'Domain appears too short');
      return false;
    }

    const placeholders = ['example.com', 'test.com', 'domain.com', 'yourcompany.com'];
    if (placeholders.includes(stripped.toLowerCase())) {
      setDomainError(t.marketingPlan?.errorPlaceholderDomain || 'Please enter your actual company domain');
      return false;
    }

    setDomainError(undefined);
    return true;
  };

  // Generate personalized plan
  // Note: onClick may pass MouseEvent as first arg, so we explicitly check for boolean
  const handleGeneratePersonalizedPlan = (forceRegenerate?: boolean | React.MouseEvent) => {
    // Ensure forceRegenerate is a boolean (onClick passes MouseEvent)
    const shouldForce = typeof forceRegenerate === 'boolean' ? forceRegenerate : false;

    if (!validateDomain(domain)) {
      return;
    }

    requireLead({
      reason: 'generate_marketing_plan',
      context: { industry, domain, language },
      onSuccess: () => {
        generatePersonalizedPlan(shouldForce);
      },
    });
  };

  // Core personalized plan generation
  const generatePersonalizedPlan = async (forceRegenerate: boolean = false) => {
    setIsGenerating(true);
    setError(null);
    setErrorDetails(null);
    setConversationId(null);
    setProgress(5);
    setElapsedTime(0);
    setPollCount(0);
    setLastPollStatus(null);
    setLastPollMessage(null);
    setDebugLogs([]);
    startTimeRef.current = Date.now();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    addDebugLog(`Starting generation for domain: ${domain}, language: ${language}, force: ${forceRegenerate}`);

    try {
      const createResponse = await fetch('/api/marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          domain: domain.trim(),
          language,
          force: forceRegenerate,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        addDebugLog(`Create error: HTTP ${createResponse.status} - ${errorData.error || 'Unknown'}`);
        throw new Error(errorData.error || `HTTP ${createResponse.status}`);
      }

      const createData = await createResponse.json();
      addDebugLog(`Create response: status=${createData.status}, source=${createData.source || 'N/A'}`);

      if (createData.status === 'complete') {
        setPlan(createData.plan);
        setPlanSource(createData.source);
        setIsGenerating(false);

        // Navigate to the domain URL
        const normalizedDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
        router.push(`/${normalizedDomain}`);
        return;
      }

      if (createData.status === 'created' && createData.conversationId) {
        addDebugLog(`AI job created: conversationId=${createData.conversationId}`);
        setConversationId(createData.conversationId);
        await pollForResults(createData.conversationId);
      } else {
        addDebugLog(`Unexpected response: ${safeJsonStringify(createData)}`);
        throw new Error('Unexpected response from API');
      }

    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsGenerating(false);
    }
  };

  // Poll for AI generation results
  const pollForResults = async (jobId: string) => {
    const MAX_POLLS = 120;
    const POLL_INTERVAL = 5000;

    addDebugLog(`Starting polling for job ${jobId}`);

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      setPollCount(i + 1);
      setProgress(Math.min(90, 5 + ((i + 1) / MAX_POLLS) * 85));
      setElapsedTime(Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000));

      try {
        const pollResponse = await fetch(`/api/marketing-plan/${jobId}`);
        const pollData = await pollResponse.json();

        setLastPollStatus(pollData.status);
        setLastPollMessage(pollData.message || null);
        addDebugLog(`Poll #${i + 1}: status=${pollData.status}${pollData.message ? `, msg=${pollData.message.substring(0, 50)}` : ''}`);

        if (pollData.status === 'complete') {
          if (pollData._dbSave) {
            addDebugLog(`DB Save: ${safeJsonStringify(pollData._dbSave)}`);
          }
          addDebugLog('Plan complete! Redirecting...');
          setPlan(pollData.plan);
          setPlanSource('ai');
          setIsGenerating(false);
          setProgress(100);

          // Navigate to the domain URL
          const normalizedDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
          router.push(`/${normalizedDomain}`);
          return;
        }

        if (pollData.status === 'error') {
          addDebugLog(`Error: ${pollData.error}`);
          if (pollData.debug) {
            console.error('API Debug info:', safeJsonStringify(pollData.debug, 2000));
            addDebugLog(`Debug details: ${safeJsonStringify(pollData.debug)}`);
            setErrorDetails(pollData.debug);
          }
          throw new Error(pollData.error || 'Plan generation failed');
        }

      } catch (pollError) {
        const errorMsg = pollError instanceof Error ? pollError.message : 'Unknown error';
        addDebugLog(`Poll exception: ${errorMsg}`);
        console.error('Poll error:', pollError);
        throw pollError;
      }
    }

    addDebugLog('TIMEOUT: Max polls reached (120 polls / 10 minutes)');
    throw new Error('Plan generation timed out. Please try again.');
  };

  // Handle cancel during loading
  const handleCancel = () => {
    setIsGenerating(false);
    setConversationId(null);
    if (urlDomain) {
      loadPlanFromDB(urlDomain);
    } else {
      loadStaticPlan(industry);
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    if (domain.trim()) {
      generatePersonalizedPlan();
    } else if (urlDomain) {
      loadPlanFromDB(urlDomain);
    } else {
      loadStaticPlan(industry);
    }
  };

  // Handle try different domain
  const handleTryDifferentDomain = () => {
    setError(null);
    router.push('/');
  };

  // Get programs as array
  const programsArray = plan?.programs_list
    ? (Array.isArray(plan.programs_list)
      ? plan.programs_list
      : Object.values(plan.programs_list))
    : [];

  // Show loading skeleton while fetching from DB
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="flex gap-8">
              <div className="w-1/4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="w-3/4 space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-2">
            {plan?.company_summary?.name
              ? `${t.marketingPlan?.planFor || 'Marketing Plan for'} ${plan.company_summary.name}`
              : t.marketingPlan?.pageTitle || 'Marketing Relationship Plan Generator'}
          </h1>
          {planSource === 'db' && (
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {t.marketingPlan?.savedPlan || 'Personalized AI-generated plan'}
            </p>
          )}
          {/* Action Buttons (Export PDF + Share) */}
          {plan && !isGenerating && (
            <div className="mt-4 flex justify-center">
              <PlanActions
                plan={plan}
                companyName={plan.company_summary?.name || urlDomain || 'Company'}
                isPersonalized={planSource !== 'static'}
              />
            </div>
          )}
        </div>

        {/* Loading Banner */}
        {isGenerating && (
          <LoadingBanner
            companyDomain={domain}
            progress={progress}
            elapsedTime={elapsedTime}
            onCancel={handleCancel}
            debugInfo={{
              conversationId,
              pollCount,
              lastPollStatus,
              lastPollMessage,
              logs: debugLogs,
            }}
          />
        )}

        {/* Intro Accordion */}
        <IntroAccordion />

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <MarketingPlanSidebar
              industry={industry}
              setIndustry={handleIndustryChange}
              domain={domain}
              setDomain={setDomain}
              onGeneratePersonalizedPlan={handleGeneratePersonalizedPlan}
              isLoading={isGenerating}
              isUnlocked={isUnlocked}
              domainError={domainError}
              hasPlan={!!plan}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Error State */}
            {error && !isGenerating && (
              <ErrorState
                message={error}
                details={errorDetails}
                domainName={domain}
                onRetry={handleRetry}
                onTryDifferentDomain={handleTryDifferentDomain}
              />
            )}

            {/* Plan Display */}
            {plan && !error && (
              <div className="space-y-6">
                {/* Company Summary */}
                {planSource !== 'static' && (
                  <>
                    <h2 className="text-lg font-bold text-gray-900">
                      {(t.marketingPlan as Record<string, string>)?.companyAnalysis || 'Company Analysis'} {domain}
                    </h2>
                    <CompanySummary summary={plan.company_summary} showTitle={false} companyDomain={domain} />
                  </>
                )}

                {/* Marketing Programs Overview */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t.marketingPlan?.marketingPrograms || 'Relationship Programs Overview'}
                </h2>
                <MarketingPrograms programs={plan.programs_list} />

                {/* Program Details */}
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

      {/* Sticky CTA Footer (appears on scroll up, for all plans) */}
      {plan && !isGenerating && !error && (
        <BrevoCallToAction variant="sticky" />
      )}
    </div>
  );
}
