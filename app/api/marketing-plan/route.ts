/**
 * POST /api/marketing-plan
 *
 * Create a new personalized marketing plan or retrieve an existing one.
 *
 * Request body:
 * - industry: Industry type (required)
 * - domain: Company domain (required for personalized plans)
 * - language: User's language code (optional, defaults to 'en')
 * - force: Force regeneration even if plan exists (optional, defaults to false)
 *
 * Response:
 * - If existing plan found: { status: 'complete', source: 'db', plan: MarketingPlan }
 * - If new plan initiated: { status: 'created', source: 'ai', conversationId: string }
 * - If static plan (no domain): { status: 'complete', source: 'static', plan: MarketingPlan }
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMarketingPlanByDomain } from '@/lib/marketing-plan/db';
import { normalizeDomain } from '@/lib/marketing-plan/normalize';
import { getStaticPlan } from '@/data/static-marketing-plans';
import { logApiCall, createTimer } from '@/lib/api-logger';
import type { Industry } from '@/config/industries';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Rate limiting configuration
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  rateLimit.forEach((record, ip) => {
    if (now > record.resetTime) {
      rateLimit.delete(ip);
    }
  });
}, 5 * 60 * 1000);

// Zod schema for request validation
const MarketingPlanRequestSchema = z.object({
  industry: z.enum([
    // B2C
    'Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family',
    // B2B
    'SaaS', 'Services', 'Manufacturing', 'Wholesale'
  ]),
  domain: z.string().optional(),
  language: z.enum(['en', 'fr', 'de', 'es']).optional().default('en'),
  force: z.boolean().optional().default(false),
});

// Minimal language-specific prompts for the AI
// All detailed instructions are handled by the Dust agent's system prompt
const languageConfig: Record<string, string> = {
  en: 'Analyze company: {domain}',
  fr: 'Analysez l\'entreprise : {domain}',
  de: 'Analysiere das Unternehmen: {domain}',
  es: 'Analiza la empresa: {domain}',
};

export async function POST(request: Request) {
  const timer = createTimer();
  let statusCode = 200;
  let errorMessage: string | undefined;
  let domain: string | undefined;
  let source: string | undefined;

  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  if (!checkRateLimit(ip)) {
    statusCode = 429;
    errorMessage = 'Rate limit exceeded';
    logApiCall({
      endpoint: '/api/marketing-plan',
      method: 'POST',
      domain,
      status_code: statusCode,
      response_time_ms: timer(),
      error_message: errorMessage,
    });
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in 1 minute.' },
      { status: 429 }
    );
  }

  try {
    // Validate request body
    const body = await request.json();
    const { industry, domain: rawDomain, language, force } = MarketingPlanRequestSchema.parse(body);

    // If no domain provided, return static plan
    if (!rawDomain || rawDomain.trim() === '') {
      source = 'static';
      statusCode = 200;
      const staticPlan = getStaticPlan(industry as Industry, language);
      return NextResponse.json({
        status: 'complete',
        source: 'static',
        plan: staticPlan,
      });
    }

    // Normalize the domain
    const normalizedDomain = normalizeDomain(rawDomain);
    domain = normalizedDomain || rawDomain;

    if (!normalizedDomain) {
      statusCode = 400;
      errorMessage = 'Invalid domain';
      return NextResponse.json(
        { error: 'Invalid domain provided' },
        { status: 400 }
      );
    }

    // Check for existing plan in database (unless force=true)
    if (!force) {
      const existingPlan = await getMarketingPlanByDomain(normalizedDomain, language);

      if (existingPlan.success && existingPlan.data) {
        source = 'db';
        statusCode = 200;
        return NextResponse.json({
          status: 'complete',
          source: 'db',
          plan: existingPlan.data,
        });
      }
    }

    // Get AI Gateway configuration
    const gatewayUrl = process.env.AI_GATEWAY_URL;
    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

    if (!gatewayUrl || !gatewayApiKey) {
      // Fallback to static plan if AI not configured
      console.warn('[Marketing Plan] AI Gateway not configured, returning static plan for industry:', industry);
      source = 'static';
      statusCode = 200;
      const staticPlan = getStaticPlan(industry as Industry, language);
      return NextResponse.json({
        status: 'complete',
        source: 'static',
        plan: staticPlan,
        message: 'AI service not available, returning template plan',
      });
    }

    // Build the AI prompt (minimal - Dust agent handles detailed instructions)
    const prompt = (languageConfig[language] || languageConfig.en).replace('{domain}', normalizedDomain);

    // Call AI Gateway (non-blocking)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const gatewayResponse = await fetch(`${gatewayUrl}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': gatewayApiKey,
        },
        body: JSON.stringify({
          agentAlias: 'marketing-plan-generator',
          prompt,
          metadata: {
            client: 'marketing-plan-generator',
            industry,
            domain: normalizedDomain,
            language,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!gatewayResponse.ok) {
        // Log status only, not response body which may contain sensitive data
        console.error('[Marketing Plan] Gateway error status:', gatewayResponse.status);
        statusCode = 502;
        errorMessage = 'AI service error';
        return NextResponse.json(
          { error: 'AI service temporarily unavailable' },
          { status: 502 }
        );
      }

      const { jobId } = await gatewayResponse.json();

      // Return immediately with job ID (don't include domain in response)
      source = 'ai';
      statusCode = 200;
      return NextResponse.json({
        status: 'created',
        source: 'ai',
        conversationId: jobId,
        message: 'Plan generation started. Poll for results.',
      });

    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        statusCode = 504;
        errorMessage = 'AI service timeout';
        return NextResponse.json(
          { error: 'AI service timeout' },
          { status: 504 }
        );
      }
      throw err;
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      statusCode = 400;
      errorMessage = 'Validation error';
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    // Log error details for debugging
    statusCode = 500;
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Marketing Plan] Error:', errorMessage);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  } finally {
    // Log the API call (async, don't await)
    logApiCall({
      endpoint: '/api/marketing-plan',
      method: 'POST',
      domain,
      status_code: statusCode,
      response_time_ms: timer(),
      error_message: errorMessage,
      metadata: { source },
    });
  }
}
