import { NextResponse } from 'next/server';
import { z } from 'zod';
import { benchmarks, PriceTier, Industry } from '@/data/benchmarks';

export const runtime = 'nodejs';
// Reduced timeout - this endpoint now returns immediately
export const maxDuration = 10;

// Rate limiting configuration
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

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

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  rateLimit.forEach((record, ip) => {
    if (now > record.resetTime) {
      rateLimit.delete(ip);
    }
  });
}, 5 * 60 * 1000);

// Zod schema for request validation
const AnalysisSchema = z.object({
    userValues: z.record(z.string()),
    priceTier: z.enum(['Budget', 'Mid-Range', 'Luxury']),
    industry: z.enum([
        // B2C Retail
        'Fashion', 'Home', 'Beauty', 'Electronics', 'Sports', 'Family', 'Food', 'Luxury',
        // B2B
        'SaaS', 'Services', 'Manufacturing', 'Wholesale'
    ]),
    language: z.enum(['en', 'fr', 'de', 'es']).optional().default('en')
});

// Language-specific prompt templates
const languageConfig: Record<string, {
    consultant: string;
    b2b: string;
    b2c: string;
    intro: string;
    prompt: string;
}> = {
    en: {
        consultant: 'Senior',
        b2b: 'B2B Marketing',
        b2c: 'Retail Strategy',
        intro: 'Your client is a {industry} company in the {businessType} sector with a {priceTier} price positioning.',
        prompt: `Here is their performance data compared to market benchmarks:

{data}

Please analyze this data and provide a strategic report in Markdown format.
Structure your response exactly as follows:

# Executive Summary
(2-3 sentences highlighting the overall health and biggest opportunity. Be direct.)

# Traffic Light Analysis
- **Strengths**: (List 2 metrics where they excel and *why* it matters for revenue/growth)
- **Critical Gaps**: (List 2 metrics where they lag significantly and the *business impact*)

# Strategic Recommendations
Provide 3 specific, actionable initiatives to improve performance. Focus on CRM, Automation, and Channel Mix (Email/SMS).
1. **[Action Title]**: [Description with specific tactics]
2. **[Action Title]**: [Description with specific tactics]
3. **[Action Title]**: [Description with specific tactics]

Tone: Professional, insightful, direct. Avoid generic advice.`
    },
    fr: {
        consultant: 'Senior',
        b2b: 'Marketing B2B',
        b2c: 'Stratégie Retail',
        intro: 'Votre client est une entreprise {industry} dans le secteur {businessType} avec un positionnement prix {priceTier}.',
        prompt: `Voici leurs données de performance comparées aux benchmarks du marché :

{data}

Veuillez analyser ces données et fournir un rapport stratégique en format Markdown.
Structurez votre réponse exactement comme suit :

# Résumé Exécutif
(2-3 phrases mettant en avant la santé globale et la plus grande opportunité. Soyez direct.)

# Analyse Feux Tricolores
- **Points forts** : (Listez 2 métriques où ils excellent et *pourquoi* c'est important pour le CA/croissance)
- **Lacunes critiques** : (Listez 2 métriques où ils sont en retard et l'*impact business*)

# Recommandations Stratégiques
Fournissez 3 initiatives spécifiques et actionnables pour améliorer la performance. Concentrez-vous sur le CRM, l'Automatisation et le Mix Canal (Email/SMS).
1. **[Titre de l'action]** : [Description avec tactiques spécifiques]
2. **[Titre de l'action]** : [Description avec tactiques spécifiques]
3. **[Titre de l'action]** : [Description avec tactiques spécifiques]

Ton : Professionnel, perspicace, direct. Évitez les conseils génériques.`
    },
    de: {
        consultant: 'Senior',
        b2b: 'B2B-Marketing',
        b2c: 'Retail-Strategie',
        intro: 'Ihr Kunde ist ein {industry}-Unternehmen im {businessType}-Sektor mit einer {priceTier} Preispositionierung.',
        prompt: `Hier sind ihre Leistungsdaten im Vergleich zu Markt-Benchmarks:

{data}

Bitte analysieren Sie diese Daten und erstellen Sie einen strategischen Bericht im Markdown-Format.
Strukturieren Sie Ihre Antwort genau wie folgt:

# Executive Summary
(2-3 Sätze, die den Gesamtzustand und die größte Chance hervorheben. Seien Sie direkt.)

# Ampel-Analyse
- **Stärken**: (Listen Sie 2 Metriken auf, bei denen sie hervorragend sind und *warum* dies für Umsatz/Wachstum wichtig ist)
- **Kritische Lücken**: (Listen Sie 2 Metriken auf, bei denen sie deutlich zurückliegen, und die *geschäftlichen Auswirkungen*)

# Strategische Empfehlungen
Geben Sie 3 spezifische, umsetzbare Initiativen zur Leistungsverbesserung. Konzentrieren Sie sich auf CRM, Automatisierung und Kanal-Mix (E-Mail/SMS).
1. **[Aktionstitel]**: [Beschreibung mit spezifischen Taktiken]
2. **[Aktionstitel]**: [Beschreibung mit spezifischen Taktiken]
3. **[Aktionstitel]**: [Beschreibung mit spezifischen Taktiken]

Ton: Professionell, aufschlussreich, direkt. Vermeiden Sie allgemeine Ratschläge.`
    },
    es: {
        consultant: 'Senior',
        b2b: 'Marketing B2B',
        b2c: 'Estrategia Retail',
        intro: 'Su cliente es una empresa de {industry} en el sector {businessType} con un posicionamiento de precio {priceTier}.',
        prompt: `Aquí están sus datos de rendimiento comparados con los benchmarks del mercado:

{data}

Por favor, analice estos datos y proporcione un informe estratégico en formato Markdown.
Estructure su respuesta exactamente de la siguiente manera:

# Resumen Ejecutivo
(2-3 frases destacando la salud general y la mayor oportunidad. Sea directo.)

# Análisis de Semáforo
- **Fortalezas**: (Liste 2 métricas donde destacan y *por qué* importa para ingresos/crecimiento)
- **Brechas Críticas**: (Liste 2 métricas donde están rezagados significativamente y el *impacto comercial*)

# Recomendaciones Estratégicas
Proporcione 3 iniciativas específicas y accionables para mejorar el rendimiento. Enfóquese en CRM, Automatización y Mix de Canales (Email/SMS).
1. **[Título de Acción]**: [Descripción con tácticas específicas]
2. **[Título de Acción]**: [Descripción con tácticas específicas]
3. **[Título de Acción]**: [Descripción con tácticas específicas]

Tono: Profesional, perspicaz, directo. Evite consejos genéricos.`
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
        const { userValues, priceTier, industry, language } = AnalysisSchema.parse(body);

        // Get Dust.tt credentials
        const workspaceId = process.env.DUST_WORKSPACE_ID;
        const apiKey = process.env.DUST_API_KEY;
        const assistantId = process.env.DUST_ASSISTANT_ID;

        if (!workspaceId || !apiKey || !assistantId) {
            return NextResponse.json(
                { error: 'Missing Dust API credentials' },
                { status: 500 }
            );
        }

        // Get language-specific config
        const langConfig = languageConfig[language] || languageConfig.en;

        // Determine B2B or B2C
        const b2bIndustries = ['SaaS', 'Services', 'Manufacturing', 'Wholesale'];
        const isB2B = b2bIndustries.includes(industry);
        const businessType = isB2B ? langConfig.b2b : langConfig.b2c;
        const consultantType = isB2B ? langConfig.b2b : langConfig.b2c;

        const selectedIndustry = (industry && benchmarks[industry as Industry])
            ? industry
            : 'Fashion';

        const relevantBenchmarks = benchmarks[selectedIndustry as Industry];

        // Build data string for KPIs
        let dataString = '';
        relevantBenchmarks.forEach((kpi) => {
            const range = kpi.ranges[priceTier as PriceTier];
            const userVal = userValues[kpi.id];

            if (userVal) {
                dataString += `- ${kpi.name}: User Value = ${userVal}${kpi.unit} (Market: Low ${range.low}, Median ${range.median}, High ${range.high})\n`;
            }
        });

        // Construct the intro
        const intro = langConfig.intro
            .replace('{industry}', industry)
            .replace('{businessType}', businessType)
            .replace('{priceTier}', priceTier);

        // Construct prompt with language-specific template
        const prompt = `You are a ${langConfig.consultant} ${consultantType} Consultant.
${intro}

${langConfig.prompt.replace('{data}', dataString)}`;

        // Create conversation with Dust (non-blocking)
        const createResponse = await fetch(
            `https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: {
                        content: prompt,
                        mentions: [{ configurationId: assistantId }],
                        context: {
                            timezone: "Europe/Paris",
                            username: "KPI_Tool_User"
                        }
                    },
                    blocking: false,  // Non-blocking: return immediately
                }),
            }
        );

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            return NextResponse.json(
                { error: `Failed to create conversation: ${createResponse.statusText} - ${errorText}` },
                { status: 502 }
            );
        }

        const createData = await createResponse.json();
        const conversationId = createData.conversation.sId;

        // Return immediately with conversation ID
        return NextResponse.json({
            status: 'created',
            conversationId,
            message: 'Analysis started. Poll /api/analyze/' + conversationId + ' for results.'
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to parse request', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
