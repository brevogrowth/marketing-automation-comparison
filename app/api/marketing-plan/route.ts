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

// Language-specific prompts for the AI
const languageConfig: Record<string, { intro: string; prompt: string }> = {
  en: {
    intro: 'You are an expert marketing strategist. Analyze the company at {domain} and create a comprehensive marketing relationship plan.',
    prompt: `Create a detailed marketing relationship plan for the company at {domain}, which operates in the {industry} industry.

Structure your response as a JSON object with the following format:
{
  "introduction": "Brief overview of the plan",
  "company_summary": {
    "name": "Company name",
    "website": "{domain}",
    "activities": "Main activities",
    "target": "Primary target audience",
    "industry": "{industry}",
    "target_audience": "Detailed target description",
    "nb_employees": "Estimated employee count",
    "business_model": "B2B or B2C",
    "customer_lifecycle_key_steps": "Key customer lifecycle stages"
  },
  "programs_list": [
    {
      "program_name": "Program Name",
      "target": "Target audience for this program",
      "objective": "Main objective",
      "kpi": "Key performance indicator",
      "description": "Program description",
      "scenarios": [
        {
          "scenario_target": "Specific target",
          "scenario_objective": "Scenario objective",
          "main_messages_ideas": "Key messages",
          "message_sequence": [
            { "title": "Message 1", "description": "When to send", "content": "Message content" }
          ]
        }
      ]
    }
  ],
  "how_brevo_helps_you": [
    {
      "scenario_name": "Scenario",
      "why_brevo_is_better": "Why Brevo is the best solution",
      "omnichannel_channels": "Channels to use (Email, SMS, WhatsApp, etc.)",
      "setup_efficiency": "How easy it is to set up"
    }
  ],
  "conclusion": "Closing summary"
}

Focus on actionable, specific recommendations. Include 3-5 marketing programs with detailed scenarios.`
  },
  fr: {
    intro: 'Vous êtes un expert en stratégie marketing. Analysez l\'entreprise {domain} et créez un plan marketing relationnel complet.',
    prompt: `Créez un plan marketing relationnel détaillé pour l'entreprise {domain}, qui opère dans le secteur {industry}.

Structurez votre réponse en JSON avec le format suivant:
{
  "introduction": "Aperçu du plan",
  "company_summary": {
    "name": "Nom de l'entreprise",
    "website": "{domain}",
    "activities": "Activités principales",
    "target": "Audience cible principale",
    "industry": "{industry}",
    "target_audience": "Description détaillée de la cible",
    "nb_employees": "Nombre estimé d'employés",
    "business_model": "B2B ou B2C",
    "customer_lifecycle_key_steps": "Étapes clés du cycle de vie client"
  },
  "programs_list": [...],
  "how_brevo_helps_you": [...],
  "conclusion": "Résumé final"
}

Concentrez-vous sur des recommandations actionnables et spécifiques. Incluez 3-5 programmes marketing avec des scénarios détaillés.`
  },
  de: {
    intro: 'Sie sind ein Experte für Marketingstrategie. Analysieren Sie das Unternehmen {domain} und erstellen Sie einen umfassenden Marketing-Beziehungsplan.',
    prompt: `Erstellen Sie einen detaillierten Marketing-Beziehungsplan für das Unternehmen {domain} in der Branche {industry}.

Strukturieren Sie Ihre Antwort als JSON-Objekt mit folgendem Format:
{
  "introduction": "Kurze Übersicht des Plans",
  "company_summary": {...},
  "programs_list": [...],
  "how_brevo_helps_you": [...],
  "conclusion": "Zusammenfassung"
}

Konzentrieren Sie sich auf umsetzbare, spezifische Empfehlungen. Fügen Sie 3-5 Marketingprogramme mit detaillierten Szenarien hinzu.`
  },
  es: {
    intro: 'Eres un experto en estrategia de marketing. Analiza la empresa {domain} y crea un plan de marketing relacional completo.',
    prompt: `Crea un plan de marketing relacional detallado para la empresa {domain}, que opera en la industria {industry}.

Estructura tu respuesta como un objeto JSON con el siguiente formato:
{
  "introduction": "Descripción general del plan",
  "company_summary": {...},
  "programs_list": [...],
  "how_brevo_helps_you": [...],
  "conclusion": "Resumen final"
}

Enfócate en recomendaciones específicas y accionables. Incluye 3-5 programas de marketing con escenarios detallados.`
  }
};

export async function POST(request: Request) {
  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in 1 minute.' },
      { status: 429 }
    );
  }

  try {
    // Validate request body
    const body = await request.json();
    const { industry, domain, language, force } = MarketingPlanRequestSchema.parse(body);

    // If no domain provided, return static plan
    if (!domain || domain.trim() === '') {
      const staticPlan = getStaticPlan(industry as Industry, language);
      return NextResponse.json({
        status: 'complete',
        source: 'static',
        plan: staticPlan,
      });
    }

    // Normalize the domain
    const normalizedDomain = normalizeDomain(domain);

    if (!normalizedDomain) {
      return NextResponse.json(
        { error: 'Invalid domain provided' },
        { status: 400 }
      );
    }

    // Check for existing plan in database (unless force=true)
    if (!force) {
      const existingPlan = await getMarketingPlanByDomain(normalizedDomain, language);

      if (existingPlan.success && existingPlan.data) {
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
      console.warn('[Marketing Plan] AI Gateway not configured, returning static plan');
      const staticPlan = getStaticPlan(industry as Industry, language);
      return NextResponse.json({
        status: 'complete',
        source: 'static',
        plan: staticPlan,
        message: 'AI service not available, returning template plan',
      });
    }

    // Build the AI prompt
    const langConfig = languageConfig[language] || languageConfig.en;
    const prompt = `${langConfig.intro.replace('{domain}', normalizedDomain)}

${langConfig.prompt.replace(/{domain}/g, normalizedDomain).replace(/{industry}/g, industry)}`;

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
        const errorText = await gatewayResponse.text();
        console.error('[Marketing Plan] Gateway error:', gatewayResponse.status, errorText);
        return NextResponse.json(
          { error: 'AI service temporarily unavailable' },
          { status: 502 }
        );
      }

      const { jobId } = await gatewayResponse.json();

      // Return immediately with job ID
      return NextResponse.json({
        status: 'created',
        source: 'ai',
        conversationId: jobId,
        message: `Plan generation started. Poll /api/marketing-plan/${jobId} for results.`,
      });

    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'AI service timeout' },
          { status: 504 }
        );
      }
      throw err;
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Marketing Plan] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
