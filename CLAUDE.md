# Claude Code Development Guide

This file contains directives for Claude Code when developing on this project.

---

## Business Context

### What is this project?

**Brevo Marketing Relationship Plan Generator** is a **strategic marketing asset** for Brevo's mid-market prospecting. It's an interactive tool that allows B2C retailers and B2B companies to generate personalized marketing relationship plans with AI-powered recommendations.

### Strategic Objectives

1. **Lead Generation** - Attract mid-market prospects by offering free value (static industry plans)
2. **Qualification** - Domain input reveals company profile and maturity level
3. **Nurturing** - AI-generated personalized plans position Brevo as an expert and suggest its solutions (CRM, Email, SMS, Automation)
4. **Conversion** - CTAs to Brevo free trial and demos

### Target Audience

- **Profile**: Marketing Directors / Growth Leaders
- **Size**: Mid-market (10-500 employees, 1-50M revenue)
- **Industries**: 12 verticals (B2C: Fashion, Beauty, Home, Electronics, Food, Sports, Luxury, Family | B2B: SaaS, Services, Manufacturing, Wholesale)
- **Maturity**: Already using email marketing, looking to optimize

### Value Proposition

> "Get your personalized AI-powered marketing relationship plan in minutes. Discover programs, scenarios, and strategies tailored to your business."

### Two-Level Value Proposition

| Level | Access | Features |
|-------|--------|----------|
| **Level 1 (Free)** | No email required | Static industry template plans |
| **Level 2 (Personalized)** | Email required (lead-capture) | AI-generated plan based on company website |

---

## Technical Architecture

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Dust.tt API via AI Gateway | v1 |
| Database | Supabase (PostgreSQL) | - |
| Validation | Zod | 3.x |
| Tests | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify Free | - |

### API Architecture (Async Polling Pattern)

```
┌─────────────────┐                           ┌────────────────┐
│    Frontend     │  1. POST /api/marketing-plan │  API Route     │
│   (page.tsx)    │ ─────────────────────────────▶ │  (route.ts)    │
│                 │ ◀───── conversationId ────────│                │
└────────┬────────┘       (~2s)                   └───────┬────────┘
         │                                                 │
         │ 2. GET /api/marketing-plan/[id]                 │ AI Gateway
         │    (polling every 5s)                           │ → Dust.tt
         │                                                 ▼
         │◀─── status: processing ────────────────┌───────────────┐
         │◀─── status: processing ────────────────│   AI Agent    │
         │◀─── status: complete ──────────────────│   Processing  │
         │     + MarketingPlan JSON               │   (~3 min)    │
         ▼                                        └───────────────┘
```

**Why this pattern?**
- Netlify Free timeout = 10 seconds
- Dust.tt AI generation = ~3 minutes
- SSE streaming impossible → Async polling required

### Folder Structure

```
app/
├── api/
│   ├── lead/
│   │   └── route.ts              # POST - Lead capture
│   └── marketing-plan/
│       ├── route.ts              # POST - Create AI plan generation
│       ├── [conversationId]/
│       │   └── route.ts          # GET - Poll status
│       └── lookup/
│           └── route.ts          # GET - Lookup existing plan by domain
├── page.tsx                      # Main Marketing Plan page
├── layout.tsx                    # Global layout + fonts
└── globals.css                   # Tailwind styles

components/
├── Header.tsx                    # Brevo navigation
├── LanguageSelector.tsx          # EN/FR/DE/ES switcher
├── Providers.tsx                 # Context providers wrapper
├── MarketingPlanSidebar.tsx      # Industry + Domain + Generate button
├── IntroBlock.tsx                # Welcome section with toggles
├── Contributors.tsx              # Partners & credits
└── marketing-plan/
    ├── index.ts                  # Re-exports
    ├── PlanHeader.tsx            # Plan title + share/export
    ├── CompanySummary.tsx        # Company info display
    ├── MarketingPrograms.tsx     # Programs table
    ├── ProgramDetails.tsx        # Expandable program scenarios
    ├── BrevoHelp.tsx             # How Brevo helps section
    ├── BrevoCallToAction.tsx     # Bottom CTA
    ├── StaticPlanBadge.tsx       # "Template" vs "Personalized" badge
    └── PlanLoadingState.tsx      # Skeleton + progress messages

config/
├── branding.ts                   # Colors, logos, links
├── industries.ts                 # Industry types and helpers
├── api.ts                        # API endpoints config
└── index.ts                      # Re-exports

contexts/
└── LanguageContext.tsx           # Language state management

data/
└── static-marketing-plans/
    ├── index.ts                  # Loader function
    ├── fashion.en.json           # Static plan per industry/language
    ├── fashion.fr.json
    ├── saas.en.json
    └── ... (12 industries × 4 languages)

i18n/
├── index.ts                      # Exports & types
├── en.json                       # English translations
├── fr.json                       # French translations
├── de.json                       # German translations
└── es.json                       # Spanish translations

lib/
├── lead-capture/
│   └── index.ts                  # Re-exports from @brevogrowth/lead-capture
└── marketing-plan/
    ├── db.ts                     # Supabase operations
    ├── normalize.ts              # Domain normalization
    └── types.ts                  # Type exports

packages/
└── lead-capture/                 # @brevo/lead-capture NPM package
    └── ... (unchanged)

src/
├── types/
│   └── marketing-plan.ts         # MarketingPlan, CompanySummary, etc.
└── utils/
    ├── marketing-plan-parser.ts  # Parse/validate AI response
    └── polling.ts                # Polling utilities

tests/
├── lead-capture.test.ts          # Email validation unit tests
├── full-user-journey.spec.ts     # E2E Playwright tests
└── dust-integration.spec.ts      # AI integration E2E test

docs/
└── temp/
    └── REFACTORING-PLAN.md       # Migration plan documentation

legacy/
└── marketing-plan-legacy/        # Original React/Vite implementation (reference)
```

---

## Data Model

### Industries

```typescript
// config/industries.ts
export type Industry =
  // B2C
  | 'Fashion' | 'Beauty' | 'Home' | 'Electronics' | 'Food' | 'Sports' | 'Luxury' | 'Family'
  // B2B
  | 'SaaS' | 'Services' | 'Manufacturing' | 'Wholesale';

export const B2C_INDUSTRIES: Industry[] = ['Fashion', 'Beauty', 'Home', 'Electronics', 'Food', 'Sports', 'Luxury', 'Family'];
export const B2B_INDUSTRIES: Industry[] = ['SaaS', 'Services', 'Manufacturing', 'Wholesale'];
```

### MarketingPlan Types

```typescript
// src/types/marketing-plan.ts

export interface CompanySummary {
  name: string;
  website: string;
  activities?: string;
  target?: string;
  industry?: string;
  target_audience?: string;
  nb_employees?: string;
  business_model?: string;
  customer_lifecycle_key_steps?: string;
}

export interface ProgramScenario {
  scenario_target?: string;
  target?: string;
  scenario_objective?: string;
  objective?: string;
  main_messages_ideas?: string;
  main_message_ideas?: string;
  messages?: string;
  message_sequence?: ScenarioMessage[] | Record<string, ScenarioMessage | string>;
}

export interface MarketingProgram {
  program_name?: string;
  name?: string;
  target?: string;
  objective?: string;
  kpi?: string;
  description?: string;
  scenarios?: ProgramScenario[];
}

export interface BrevoHelpScenario {
  scenario_name: string;
  why_brevo_is_better: string;
  omnichannel_channels: string;
  setup_efficiency: string;
}

export interface MarketingPlan {
  introduction?: string;
  company_summary: CompanySummary;
  tools_used?: string;
  programs_list: Record<string, MarketingProgram> | MarketingProgram[];
  conclusion?: string;
  how_brevo_helps_you?: BrevoHelpScenario[];
}

// Database row type
export interface MarketingPlanRow {
  id: string;
  company_domain: string;
  email: string;
  form_data: MarketingPlan;
  user_language: string;
  created_at: string;
}
```

### Supabase Schema

```sql
-- marketing_plans table
CREATE TABLE marketing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  form_data JSONB NOT NULL,
  user_language VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one plan per domain+language
CREATE UNIQUE INDEX idx_marketing_plans_domain_language
ON marketing_plans (company_domain, user_language);
```

---

## Integrations

### AI Gateway / Dust.tt

**Configuration**:
```env
AI_GATEWAY_URL=https://xxx.netlify.app
AI_GATEWAY_API_KEY=sk-xxx
```

**Endpoints used**:
1. `POST /api/v1/marketing-plan` (non-blocking, returns conversationId)
2. `GET /api/v1/marketing-plan/{conversationId}` (poll status)

**AI Response Format** (JSON):
```json
{
  "company_summary": {
    "name": "Acme Corp",
    "website": "acme.com",
    "activities": "E-commerce fashion",
    "target": "Young professionals 25-35"
  },
  "programs_list": [
    {
      "program_name": "Welcome Program",
      "target": "New subscribers",
      "objective": "Convert to first purchase",
      "kpi": "First purchase rate",
      "scenarios": [...]
    }
  ],
  "how_brevo_helps_you": [...]
}
```

### Supabase (Database)

**Configuration**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Key functions** (`lib/marketing-plan/db.ts`):
- `getMarketingPlanByDomain(domain, language)` - Lookup existing plan
- `saveMarketingPlan(domain, email, plan, language)` - Save new plan
- `updateMarketingPlan(domain, plan, language)` - Update existing plan

### Lead Capture (`@brevo/lead-capture`)

**Purpose**: Capture professional emails before generating personalized AI plans.

**Architecture**:
```tsx
// 1. Wrap app with provider
<LeadCaptureProvider config={{
  apiEndpoint: '/api/lead',
  storageKey: 'brevo_marketing_plan_lead',
  mode: 'blocking',
  blockFreeEmails: true
}}>
  <App />
</LeadCaptureProvider>

// 2. Use hook to gate personalized plan generation
const { requireLead, isUnlocked } = useLeadGate();

// 3. Trigger ONLY on "Generate my plan" click with domain
const handleGeneratePlan = () => {
  if (!domain) return;

  requireLead({
    reason: 'generate_marketing_plan',
    context: { industry, domain, language },
    onSuccess: () => callAI(),
  });
};
```

**Lead-Capture Rules**:
| Action | Lead-Capture Required? |
|--------|------------------------|
| Browse industries | NO |
| View static template plans | NO |
| Switch languages | NO |
| Load saved personalized plan (from URL) | NO |
| Click "Generate my plan" (with domain) | YES |

---

## URL Behavior

### Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `industry` | Pre-select industry | `?industry=SaaS` |
| `domain` | Pre-fill domain input | `?domain=acme.com` |
| `lang` | Override language | `?lang=fr` |
| `force` | Force regeneration (internal) | `?force=true` |

### Auto-Load Behavior

| URL Pattern | Behavior |
|-------------|----------|
| `/?industry=SaaS` | Show static plan for SaaS (no lead-capture) |
| `/?industry=SaaS&domain=acme.com` | Lookup DB → show if found, else show "Generate" prompt |
| `/?force=true` | Clear localStorage, allow fresh state |

---

## Netlify Constraints

**Netlify Free**:
- Serverless timeout: **10 seconds max**
- Background Functions: Not available
- Edge Functions: Not needed

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  timeout = 10
```

---

## Testing & Debugging Protocol

### DO NOT create test/debug files at root

**Forbidden**:
- `test_*.txt`, `test_*.js` at root
- `debug_*.txt`, `debug_*.log` at root

### Use instead

#### 1. Unit tests (tests/)

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --ui      # Vitest UI
```

#### 2. E2E Tests (Playwright)

```bash
npx playwright test           # Run E2E
npx playwright test --ui      # UI mode
npx playwright test --debug   # Debug mode
```

#### 3. Testing Lead Capture

**Reset lead capture state**:
```
http://localhost:3000/?force=true
```

**LocalStorage keys**:
| Key | Purpose |
|-----|---------|
| `brevo_marketing_plan_lead` | Captured lead data |
| `brevo_lead_backup` | Failed submissions |

---

## Conventions

### Commits

Format: `<type>(<scope>): <message>`

```bash
feat(plan): Add program details component
fix(api): Handle AI timeout gracefully
docs(claude): Update architecture documentation
test(parser): Add edge cases for program parsing
chore(deps): Update Supabase client
```

### Code Style

- TypeScript strict mode required
- Functional components with hooks
- Explicitly typed props
- No `any` (type correctly)
- No `console.log` in production

### File Naming

```
components/
├── ComponentName.tsx      # PascalCase
├── ComponentName.test.tsx # Associated tests

utils/
└── functionName.ts        # camelCase

tests/
└── moduleName.test.ts     # camelCase + .test
```

---

## Pre-commit Checklist

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Types valid (`npx tsc --noEmit`)
- [ ] No debug files at root
- [ ] No debug `console.log`
- [ ] No unjustified `any`

---

## Anti-patterns to Avoid

### DO NOT use streaming SSE (Netlify timeout)
```typescript
// BAD - Timeout after 10s
const stream = new ReadableStream({ ... });
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });

// GOOD - Async polling pattern
return NextResponse.json({ status: 'created', conversationId });
```

### DO NOT hardcode secrets
```typescript
// BAD
const apiKey = 'sk-xxxxxxxx';

// GOOD
const apiKey = process.env.AI_GATEWAY_API_KEY;
```

### DO NOT trigger lead-capture for static plan browsing
```typescript
// BAD - Lead-capture on industry change
const handleIndustryChange = (industry) => {
  requireLead({ reason: 'view_plan', ... }); // WRONG!
};

// GOOD - Lead-capture ONLY on personalized plan generation
const handleGeneratePlan = () => {
  if (domain) {
    requireLead({ reason: 'generate_marketing_plan', context: { domain }, ... });
  }
};
```

---

## Resources

### Project Documentation
- [docs/temp/REFACTORING-PLAN.md](docs/temp/REFACTORING-PLAN.md) - Migration plan

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Dust.tt API](https://docs.dust.tt/reference/developer-platform-overview)
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

## Decision History

| Date | Decision | Reason |
|------|----------|--------|
| Dec 2025 | KPI Benchmark → Marketing Plan | Strategic repositioning |
| Dec 2025 | Two-level access (static + personalized) | Lead-capture only for high-value feature |
| Dec 2025 | Supabase for persistence | Share plans via URL, avoid re-generation |
| Dec 2025 | Domain normalization | Consistent DB key (no www, no protocol) |
| Dec 2025 | Static plans per industry/language | Quick value without AI cost |
| Dec 2025 | Keep async polling pattern | Proven pattern from KPI Benchmark |
| Dec 2025 | Keep LanguageContext | Works well, no changes needed |
| Dec 2025 | Keep @brevo/lead-capture | Reusable, well-tested |

---

## Static Plans Coverage

| Industry | EN | FR | DE | ES |
|----------|:--:|:--:|:--:|:--:|
| Fashion | ✅ | ✅ | ✅ | ✅ |
| Beauty | ✅ | ✅ | ✅ | ✅ |
| Home | ✅ | ✅ | ✅ | ✅ |
| Electronics | ✅ | ✅ | ✅ | ✅ |
| Food | ✅ | ✅ | ✅ | ✅ |
| Sports | ✅ | ✅ | ✅ | ✅ |
| Luxury | ✅ | ✅ | ✅ | ✅ |
| Family | ✅ | ✅ | ✅ | ✅ |
| SaaS | ✅ | ✅ | ✅ | ✅ |
| Services | ✅ | ✅ | ✅ | ✅ |
| Manufacturing | ✅ | ✅ | ✅ | ✅ |
| Wholesale | ✅ | ✅ | ✅ | ✅ |

**Coverage**: All 12 industries available in all 4 languages (48 template files total).

---

## Known Limitations

1. **AI generation takes ~3 minutes** - Users see progress indicator
2. **In-memory rate limiting** - Consider external store for production
3. **Domain in URL** - May be visible in referrer logs

---

## Legacy Reference

The `legacy/` folder contains the archived KPI Benchmark code for reference.

**Do not modify legacy files** - they are excluded from build via `tsconfig.json`.
