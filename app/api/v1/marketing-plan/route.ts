/**
 * External API - Create Marketing Plan
 *
 * POST /api/v1/marketing-plan
 *
 * Creates a marketing plan from a domain. This is a simplified external API
 * that triggers plan generation asynchronously.
 *
 * Request body:
 * - domain: string (required) - Company website domain
 * - language: string (optional) - Language code (en, fr, de, es). Defaults to 'en'
 * - industry: string (optional) - Industry type. If not provided, will be auto-detected
 * - force: boolean (optional) - Force regeneration even if plan exists. Defaults to false
 * - webhook_url: string (optional) - URL to call when plan is ready
 * - webhook_secret: string (optional) - Secret for webhook signature
 *
 * Response:
 * - If existing plan found: { status: 'complete', plan_url: string, plan: MarketingPlan }
 * - If new plan initiated: { status: 'processing', job_id: string, poll_url: string }
 *
 * Authentication:
 * - Header: x-api-key (required)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMarketingPlanByDomain } from '@/lib/marketing-plan/db';
import { normalizeDomain } from '@/lib/marketing-plan/normalize';
import { logApiCall, createTimer, hashApiKey } from '@/lib/api-logger';

export const runtime = 'nodejs';
export const maxDuration = 10;

// API key validation - supports multiple keys separated by comma
const API_KEYS = (process.env.EXTERNAL_API_KEYS || process.env.EXTERNAL_API_KEY || 'mp-api-key-2024')
  .split(',')
  .map((k) => k.trim());

function checkApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey ? API_KEYS.includes(apiKey) : false;
}

// Request validation schema
const CreatePlanRequestSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  language: z.enum(['en', 'fr', 'de', 'es']).optional().default('en'),
  industry: z
    .enum([
      'Fashion',
      'Beauty',
      'Home',
      'Electronics',
      'Food',
      'Sports',
      'Luxury',
      'Family',
      'SaaS',
      'Services',
      'Manufacturing',
      'Wholesale',
    ])
    .optional(),
  force: z.boolean().optional().default(false),
  webhook_url: z.string().url().optional(),
  webhook_secret: z.string().optional(),
});

// Language-specific prompts for the AI
// NOTE: Keep prompts SHORT to avoid Dust timeout. The AI agent already knows the JSON structure.
const languageConfig: Record<string, { intro: string; prompt: string }> = {
  en: {
    intro: 'You are an expert marketing strategist.',
    prompt: `Analyze {domain} and create a marketing relationship plan with 3-5 programs. Return JSON with: introduction, company_summary, programs_list, how_brevo_helps_you, conclusion.`,
  },
  fr: {
    intro: 'Vous êtes un expert en stratégie marketing.',
    prompt: `Analysez {domain} et créez un plan marketing relationnel avec 3-5 programmes. Retournez du JSON avec: introduction, company_summary, programs_list, how_brevo_helps_you, conclusion.`,
  },
  de: {
    intro: 'Sie sind ein Experte für Marketingstrategie.',
    prompt: `Analysieren Sie {domain} und erstellen Sie einen Marketing-Beziehungsplan mit 3-5 Programmen. JSON-Antwort mit: introduction, company_summary, programs_list, how_brevo_helps_you, conclusion.`,
  },
  es: {
    intro: 'Eres un experto en estrategia de marketing.',
    prompt: `Analiza {domain} y crea un plan de marketing relacional con 3-5 programas. Responde en JSON con: introduction, company_summary, programs_list, how_brevo_helps_you, conclusion.`,
  },
};

export async function POST(request: Request) {
  const timer = createTimer();
  const apiKeyHash = hashApiKey(request.headers.get('x-api-key'));
  let statusCode = 200;
  let errorMessage: string | undefined;
  let domain: string | undefined;

  try {
    // API key validation
    if (!checkApiKey(request)) {
      statusCode = 401;
      errorMessage = 'Invalid or missing API key';
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid or missing API key. Include x-api-key header.',
        },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { domain: rawDomain, language, industry, force, webhook_url, webhook_secret } =
      CreatePlanRequestSchema.parse(body);

    // Normalize the domain
    const normalizedDomain = normalizeDomain(rawDomain);
    domain = normalizedDomain || rawDomain;

    if (!normalizedDomain) {
      statusCode = 400;
      errorMessage = 'Invalid domain';
      return NextResponse.json(
        {
          error: 'Invalid domain',
          message: 'The provided domain could not be normalized. Please provide a valid domain.',
        },
        { status: 400 }
      );
    }

    // Get base URL for plan links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brevo-marketing-relationship-plan.netlify.app';

    // Check for existing plan in database (unless force=true)
    if (!force) {
      const existingPlan = await getMarketingPlanByDomain(normalizedDomain, language);

      if (existingPlan.success && existingPlan.data) {
        return NextResponse.json({
          status: 'complete',
          message: 'Existing plan found',
          domain: normalizedDomain,
          language,
          plan_url: `${baseUrl}/${encodeURIComponent(normalizedDomain)}?lang=${language}`,
          timestamp: new Date().toISOString(),
          plan: existingPlan.data,
        });
      }
    }

    // Get AI Gateway configuration
    const gatewayUrl = process.env.AI_GATEWAY_URL;
    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

    if (!gatewayUrl || !gatewayApiKey) {
      statusCode = 503;
      errorMessage = 'AI service not configured';
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'AI service is not configured. Please try again later.',
        },
        { status: 503 }
      );
    }

    // Build the AI prompt
    const langConfig = languageConfig[language] || languageConfig.en;
    const industryContext = industry ? ` which operates in the ${industry} industry` : '';
    const prompt = `${langConfig.intro.replace('{domain}', normalizedDomain)}

${langConfig.prompt.replace(/{domain}/g, normalizedDomain)}${industryContext}`;

    // Call AI Gateway (non-blocking)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Always use our internal webhook to save plans to DB
    // Client can also provide their own webhook_url for additional notifications
    const internalWebhookUrl = `${baseUrl}/api/v1/webhook`;
    const webhookSecret = process.env.WEBHOOK_SECRET;

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
            client: 'external-api',
            industry: industry || 'auto-detect',
            domain: normalizedDomain,
            language,
            // Internal webhook for DB persistence
            internal_webhook_url: internalWebhookUrl,
            internal_webhook_secret: webhookSecret,
            // Client webhook (optional, for their own notifications)
            webhook_url,
            webhook_secret,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!gatewayResponse.ok) {
        console.error('[External API] Gateway error status:', gatewayResponse.status);
        statusCode = 502;
        errorMessage = 'AI service error';
        return NextResponse.json(
          {
            error: 'AI service error',
            message: 'Failed to initiate plan generation. Please try again later.',
          },
          { status: 502 }
        );
      }

      const { jobId } = await gatewayResponse.json();

      // Return job info for polling
      const response: Record<string, unknown> = {
        status: 'processing',
        message: 'Plan generation started. Poll the status URL to get results.',
        job_id: jobId,
        domain: normalizedDomain,
        language,
        poll_url: `/api/marketing-plan/${jobId}`,
        plan_url: `${baseUrl}/${encodeURIComponent(normalizedDomain)}?lang=${language}`,
        timestamp: new Date().toISOString(),
        estimated_time: '2-3 minutes',
      };

      // Include webhook info if provided
      if (webhook_url) {
        response.webhook_url = webhook_url;
        response.webhook_enabled = true;
      }

      return NextResponse.json(response);
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        statusCode = 504;
        errorMessage = 'Request timeout';
        return NextResponse.json(
          {
            error: 'Timeout',
            message: 'AI service request timed out. Please try again.',
          },
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
        {
          error: 'Validation error',
          message: 'Invalid request parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    statusCode = 500;
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[External API] Error:', errorMessage);
    return NextResponse.json(
      {
        error: 'Internal error',
        message: error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 }
    );
  } finally {
    // Log the API call (async, don't await)
    logApiCall({
      endpoint: '/api/v1/marketing-plan',
      method: 'POST',
      domain,
      api_key_hash: apiKeyHash,
      status_code: statusCode,
      response_time_ms: timer(),
      error_message: errorMessage,
    });
  }
}

// GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '1.1',
    features: ['webhook_callback', 'api_logging'],
    endpoints: {
      create_plan: {
        method: 'POST',
        path: '/api/v1/marketing-plan',
        description: 'Create a marketing plan for a domain',
        params: {
          domain: 'string (required)',
          language: 'en|fr|de|es (optional, default: en)',
          industry: 'string (optional, auto-detected)',
          force: 'boolean (optional, default: false)',
          webhook_url: 'string (optional) - URL to receive callback when plan is ready',
          webhook_secret: 'string (optional) - Secret for webhook signature',
        },
      },
      poll_status: {
        method: 'GET',
        path: '/api/marketing-plan/{job_id}',
        description: 'Poll for plan generation status',
      },
    },
  });
}
