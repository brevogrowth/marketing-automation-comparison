# Brevo Marketing Relationship Plan Generator

A strategic marketing asset for Brevo's mid-market prospecting. This interactive tool enables B2C retailers and B2B companies to generate personalized marketing relationship plans powered by AI.

**Live Demo:** [brevo-kpi-benchmark.netlify.app](https://brevo-kpi-benchmark.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/brevo-kpi-benchmark/deploy-status)](https://app.netlify.com/sites/brevo-kpi-benchmark/deploys)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [Features](#features)
4. [User Journey](#user-journey)
5. [Technical Architecture](#technical-architecture)
6. [Tech Stack](#tech-stack)
7. [Quick Start](#quick-start)
8. [Environment Variables](#environment-variables)
9. [Lead Capture Integration](#lead-capture-integration)
10. [AI Plan Generation](#ai-plan-generation)
11. [Static Plans](#static-plans)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Contributing](#contributing)

---

## Executive Summary

**Brevo Marketing Relationship Plan Generator** is a lead generation tool disguised as a free value-add service. Marketing directors select their industry, browse template marketing plans, and unlock AI-powered personalized plans by providing their professional email and company domain.

### Key Metrics

| Metric | Value |
|--------|-------|
| Industries covered | 12 (8 B2C + 4 B2B) |
| Static plan templates | 24 (12 EN + 12 FR) |
| Languages | 4 (EN, FR, DE, ES) |
| AI personalization | Domain-specific analysis |

### Value Proposition

> *"Generate a customized marketing relationship plan for your business. Choose an industry template or get a personalized AI-powered plan."*

---

## Business Context

### Strategic Objectives

| Objective | Implementation |
|-----------|----------------|
| **Lead Generation** | Free tool attracts mid-market prospects |
| **Qualification** | Domain input reveals company context |
| **Nurturing** | AI analysis positions Brevo as expert advisor |
| **Conversion** | CTAs to Brevo free trial and demo requests |

### Target Audience

- **Profile**: Marketing Directors / Growth Leaders / CMOs
- **Company Size**: Mid-market (10-500 employees, 1M-50M EUR revenue)
- **Industries**: 12 verticals across B2C retail and B2B services
- **Maturity**: Looking to optimize their CRM and automation strategy

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Industry Templates** | Pre-built marketing plans for 12 industries |
| **AI Personalization** | Domain-specific plans via AI Gateway + Dust.tt |
| **Lead Capture** | Professional email validation blocking 100+ free domains |
| **Plan Persistence** | Supabase storage for personalized plans |
| **Multi-Language** | Full support for English, French, German, and Spanish |

### Plan Components

Each marketing plan includes:

- **Company Summary** - Industry, target audience, business model
- **Marketing Programs** - 4-6 programs with objectives and KPIs
- **Program Scenarios** - Detailed message sequences per program
- **Brevo Integration** - How Brevo helps implement each scenario
- **Call to Action** - Personalized next steps

---

## User Journey

```
                                    USER JOURNEY FLOW

    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                  │
    │   STEP 1                 STEP 2                 STEP 3                          │
    │   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐               │
    │   │  LANDING      │      │  STATIC PLAN  │      │  LEAD GATE    │               │
    │   │               │      │               │      │               │               │
    │   │ • Select      │      │ • View        │      │ • Email modal │               │
    │   │   Industry    │─────▶│   template    │─────▶│   appears     │               │
    │   │ • Browse      │      │   plan        │      │ • Enter       │               │
    │   │   templates   │      │ • Free access │      │   domain      │               │
    │   │               │      │               │      │               │               │
    │   └───────────────┘      └───────────────┘      └───────┬───────┘               │
    │                                                         │                        │
    │                                                         ▼                        │
    │                          STEP 5                 STEP 4                          │
    │                          ┌───────────────┐      ┌───────────────┐               │
    │                          │  PERSONALIZED │      │  AI ANALYSIS  │               │
    │                          │  PLAN         │      │               │               │
    │                          │               │      │ • Processing  │               │
    │                          │ • Company-    │◀─────│   indicator   │               │
    │                          │   specific    │      │ • Progress    │               │
    │                          │   analysis    │      │   bar         │               │
    │                          │ • Saved to DB │      │ • ~3 minutes  │               │
    │                          └───────────────┘      └───────────────┘               │
    │                                                                                  │
    └─────────────────────────────────────────────────────────────────────────────────┘
```

### Step Details

| Step | Action | Technical Implementation |
|------|--------|-------------------------|
| 1. Landing | User selects industry | `MarketingPlanSidebar.tsx` component |
| 2. Static Plan | View industry template | `getStaticPlan()` from JSON files |
| 3. Lead Gate | Modal captures email + domain | `@brevogrowth/lead-capture` package |
| 4. AI Analysis | System analyzes domain | Async polling via AI Gateway → Dust.tt |
| 5. Personalized | Domain-specific recommendations | Stored in Supabase for future visits |

---

## Technical Architecture

### Ecosystem Overview

This project is part of the **Brevo Growth Marketing Assets** ecosystem:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            BREVO GROWTH ECOSYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐       │
│   │  @brevogrowth/      │   │  brevo-lead-hub     │   │  brevo-ai-gateway   │       │
│   │  lead-capture       │   │  (Netlify App)      │   │  (Netlify App)      │       │
│   │  (NPM Package)      │   │                     │   │                     │       │
│   │                     │   │  Centralized lead   │   │  Unified LLM API:   │       │
│   │  - Email validation │   │  processing:        │   │  - Dust.tt adapter  │       │
│   │  - Modal/Form UI    │   │  - API key auth     │   │  - OpenAI adapter   │       │
│   │  - Multi-language   │   │  - Brevo CRM sync   │   │  - Rate limiting    │       │
│   │  - localStorage     │   │  - Deduplication    │   │  - Job management   │       │
│   └──────────┬──────────┘   └──────────▲──────────┘   └──────────▲──────────┘       │
│              │                         │                         │                   │
│              │ npm install             │ POST /api/capture       │ POST/GET         │
│              │                         │                         │ /api/v1/analyze  │
│              ▼                         │                         │                   │
│   ┌──────────────────────────────────────────────────────────────────────────────┐  │
│   │                          brevo-relationship-plan                              │  │
│   │                          (This Repository)                                    │  │
│   │                                                                               │  │
│   │    ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐     │  │
│   │    │ Lead Modal  │    │ Static/DB   │    │ AI Personalization           │     │  │
│   │    │ (from pkg)  │───▶│ Plan Lookup │───▶│ (via AI Gateway → Dust.tt)   │     │  │
│   │    └─────────────┘    └─────────────┘    └─────────────────────────────┘     │  │
│   │                                                                               │  │
│   └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Related Repositories

| Repository | Purpose | URL |
|------------|---------|-----|
| **brevo-relationship-plan** | Marketing plan generator | This repo |
| **brevo-ai-gateway** | Unified LLM API abstraction layer | [GitHub](https://github.com/brevogrowth/brevo-ai-gateway) |
| **brevo-lead-hub** | Centralized lead processing API | [GitHub](https://github.com/brevogrowth/brevo-lead-hub) |
| **lead-capture** | Reusable NPM package for lead capture UI | [GitHub](https://github.com/brevogrowth/lead-capture) |

### AI Analysis Flow (Async Polling Pattern)

Due to Netlify's 10-second serverless function timeout, AI analysis uses an async polling pattern:

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/         │  Next.js API   │
│   (page.tsx)    │     marketing-plan     │  Route         │
│                 │ ─────────────────────▶ │                │
│                 │ ◀─ conversationId ─────│                │
└────────┬────────┘       (~2s)            └───────┬────────┘
         │                                         │
         │                                         │ POST /api/v1/analyze
         │                                         │ + x-api-key header
         │                                         ▼
         │                                ┌────────────────────┐
         │                                │   AI GATEWAY       │
         │                                │   brevo-ai-gateway │
         │                                │   .netlify.app     │
         │                                ├────────────────────┤
         │                                │ • Agent routing    │
         │                                │ • Dust.tt adapter  │
         │                                │ • Job persistence  │
         │                                └────────┬───────────┘
         │                                         │
         │ 2. GET /api/marketing-plan/[id]         │ Dust.tt API
         │    (polling every 5s)                   │ (blocking: false)
         │                                         ▼
         │◀─── status: pending ────────────┌───────────────┐
         │◀─── status: pending ────────────│   Dust.tt     │
         │◀─── status: complete ───────────│   Agent       │
         │     + plan content              │   (~3 min)    │
         ▼                                 └───────────────┘
```

**Key Configuration:**

| Parameter | Value |
|-----------|-------|
| Job ID Format | `dust_xxxxxxxxxxxx` |
| Polling Interval | 5 seconds |
| Max Timeout | 5 minutes |
| Netlify Function Timeout | 10 seconds |

### Project Structure

```
brevo-relationship-plan/
│
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Main page with marketing plan display
│   ├── layout.tsx                    # Root layout with fonts & providers
│   ├── globals.css                   # Tailwind CSS styles
│   └── api/
│       ├── lead/
│       │   └── route.ts              # POST - Forward leads to Lead Hub
│       └── marketing-plan/
│           ├── route.ts              # POST - Create plan / check DB
│           ├── lookup/
│           │   └── route.ts          # GET - Lookup by domain
│           └── [conversationId]/
│               └── route.ts          # GET - Poll job status
│
├── components/
│   ├── MarketingPlanSidebar.tsx      # Industry + domain input sidebar
│   ├── Header.tsx                    # Brevo navigation header
│   ├── Providers.tsx                 # LeadCaptureProvider wrapper
│   ├── Contributors.tsx              # Team credits section
│   └── marketing-plan/               # Marketing plan display components
│       ├── index.ts                  # Re-exports
│       ├── PlanHeader.tsx            # Plan title + badges
│       ├── CompanySummary.tsx        # Company info card
│       ├── MarketingPrograms.tsx     # Programs overview table
│       ├── ProgramDetails.tsx        # Expandable program scenarios
│       ├── BrevoHelp.tsx             # How Brevo helps section
│       ├── BrevoCallToAction.tsx     # CTA banners
│       ├── LoadingState.tsx          # Generation progress UI
│       └── ErrorState.tsx            # Error display + retry
│
├── contexts/
│   └── LanguageContext.tsx           # i18n context provider
│
├── data/
│   └── static-marketing-plans/       # Static plan JSON files
│       ├── index.ts                  # Plan loader with fallback logic
│       ├── fashion.en.json           # Fashion industry (EN)
│       ├── fashion.fr.json           # Fashion industry (FR)
│       └── ... (24 files total)
│
├── lib/
│   ├── lead-capture/
│   │   └── index.ts                  # Re-exports from @brevogrowth/lead-capture
│   └── marketing-plan/
│       ├── db.ts                     # Supabase CRUD operations
│       └── normalize.ts              # Domain normalization
│
├── src/
│   ├── types/
│   │   └── marketing-plan.ts         # TypeScript type definitions
│   └── utils/
│       └── marketing-plan-parser.ts  # AI response parser + validator
│
├── i18n/
│   ├── index.ts                      # Translation loader
│   ├── en.json                       # English translations
│   ├── fr.json                       # French translations
│   ├── de.json                       # German translations
│   └── es.json                       # Spanish translations
│
├── config/
│   ├── industries.ts                 # Industry type definitions
│   └── branding.ts                   # Brevo colors + constants
│
├── tests/
│   ├── lead-capture.test.ts          # Unit tests (Vitest)
│   ├── full-user-journey.spec.ts     # E2E tests (Playwright)
│   └── dust-integration.spec.ts      # AI integration E2E
│
├── docs/                             # Additional documentation
│   └── temp/
│       └── refactoring-plan.md       # Original refactoring spec
│
├── legacy/                           # Archived KPI benchmark code (excluded from build)
│
├── CLAUDE.md                         # Claude Code development guide
├── netlify.toml                      # Netlify deployment config
└── package.json
```

---

## Tech Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js (App Router) | 15.x | React framework with SSR |
| **Language** | TypeScript | 5.x | Type safety |
| **UI** | React + Tailwind CSS | 19.x / 4.x | Components & styling |
| **AI** | Brevo AI Gateway → Dust.tt | v1 | LLM analysis |
| **Database** | Supabase | - | Plan persistence |
| **Lead Capture** | @brevogrowth/lead-capture | 1.x | Email capture modal |
| **Validation** | Zod | 3.x | Schema validation |
| **Unit Tests** | Vitest | 2.x | Fast unit testing |
| **E2E Tests** | Playwright | 1.x | Browser automation |
| **Hosting** | Netlify | Free tier | Serverless deployment |

---

## Quick Start

### Prerequisites

1. **Node.js** 20.x or higher
2. **GitHub Personal Access Token** with `read:packages` scope (for `@brevogrowth/lead-capture`)
3. **AI Gateway API Key** (contact team for access)
4. **Supabase Project** with `marketing_plans` table

### Installation

```bash
# Clone the repository
git clone https://github.com/brevogrowth/brevo-relationship-plan.git
cd brevo-relationship-plan

# Configure npm for GitHub Packages
cp .npmrc.example .npmrc
# Edit .npmrc with your GitHub token OR set NPM_TOKEN env var
export NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev           # Start dev server (port 3000)
npm run build         # Production build
npm start             # Start production server
npm test              # Run unit tests (Vitest)
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
npx playwright test   # Run E2E tests
npx playwright test --ui  # Interactive E2E UI
```

---

## Environment Variables

### Required for Production (Netlify)

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_GATEWAY_URL` | AI Gateway base URL | `https://brevo-ai-gateway.netlify.app` |
| `AI_GATEWAY_API_KEY` | API key for AI Gateway | `gw_xxxxxxxxxxxxx` |
| `LEAD_HUB_URL` | Lead Hub API endpoint | `https://brevo-lead-hub.netlify.app/api/capture` |
| `LEAD_HUB_API_KEY` | API key for Lead Hub | `lh_xxxxxxxxxxxxx` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJxxxx...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | `eyJxxxx...` |
| `NPM_TOKEN` | GitHub PAT for packages | `ghp_xxxxxxxxxxxxx` |

### Local Development (.env.local)

```bash
# Required
AI_GATEWAY_URL=https://brevo-ai-gateway.netlify.app
AI_GATEWAY_API_KEY=gw_your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (leads logged to console if missing)
LEAD_HUB_URL=https://brevo-lead-hub.netlify.app/api/capture
LEAD_HUB_API_KEY=lh_your_key_here
```

> **Security:** Never commit `.env.local` or real credentials to git.

---

## Lead Capture Integration

### Package: @brevogrowth/lead-capture

The lead capture modal is provided by a private NPM package:

```tsx
// components/Providers.tsx
import { LeadCaptureProvider } from '@brevogrowth/lead-capture';

export function Providers({ children }) {
  return (
    <LeadCaptureProvider
      config={{
        apiEndpoint: '/api/lead',
        storageKey: 'brevo_kpi_lead',
        mode: 'blocking',
        blockFreeEmails: true,
      }}
    >
      {children}
    </LeadCaptureProvider>
  );
}
```

### Features

| Feature | Description |
|---------|-------------|
| **Email Validation** | Blocks 100+ free email domains (gmail, yahoo, etc.) |
| **Multi-Language** | EN, FR, DE, ES built-in |
| **Persistence** | localStorage for returning visitors |
| **Retry Logic** | Failed submissions saved and retried |
| **Theming** | Customizable colors and styling |

### When Lead Capture Triggers

- **NOT triggered**: Browsing static plans (industry selection)
- **NOT triggered**: Returning with saved personalized plan
- **TRIGGERED**: Clicking "Generate My Plan" with domain entered

### Testing Lead Capture

```bash
# Reset lead capture state
# Add ?force=true to any URL
http://localhost:3000/?force=true

# Or via DevTools console
localStorage.removeItem('brevo_kpi_lead');
location.reload();
```

---

## AI Plan Generation

### How It Works

1. **Frontend** sends industry + domain to `/api/marketing-plan`
2. **API Route** checks Supabase for existing plan
3. If not found, forwards to AI Gateway with metadata
4. **AI Gateway** routes to Dust.tt, returns `conversationId`
5. **Frontend** polls `/api/marketing-plan/{id}` every 5 seconds
6. **Result** parsed and stored in Supabase for future visits

### API Endpoints

#### POST `/api/marketing-plan`

**Request:**
```json
{
  "industry": "SaaS",
  "domain": "acme.com",
  "language": "en",
  "force": false
}
```

**Response (existing plan found):**
```json
{
  "status": "complete",
  "source": "db",
  "plan": { /* MarketingPlan */ }
}
```

**Response (new plan initiated):**
```json
{
  "status": "created",
  "source": "ai",
  "conversationId": "dust_abc123"
}
```

#### GET `/api/marketing-plan/[conversationId]`

**Response (processing):**
```json
{
  "status": "pending",
  "message": "Generating your marketing plan..."
}
```

**Response (complete):**
```json
{
  "status": "complete",
  "plan": { /* MarketingPlan */ }
}
```

#### GET `/api/marketing-plan/lookup?domain=acme.com&language=en`

**Response:**
```json
{
  "found": true,
  "plan": { /* MarketingPlan */ }
}
```

---

## Static Plans

### Structure

Static plans are JSON files in `data/static-marketing-plans/`:

```
data/static-marketing-plans/
├── index.ts              # Loader with fallback logic
├── fashion.en.json       # Fashion industry (EN)
├── fashion.fr.json       # Fashion industry (FR)
├── beauty.en.json
├── beauty.fr.json
├── home.en.json
├── home.fr.json
├── electronics.en.json
├── electronics.fr.json
├── food.en.json
├── food.fr.json
├── sports.en.json
├── sports.fr.json
├── luxury.en.json
├── luxury.fr.json
├── family.en.json
├── family.fr.json
├── saas.en.json
├── saas.fr.json
├── services.en.json
├── services.fr.json
├── manufacturing.en.json
├── manufacturing.fr.json
├── wholesale.en.json
└── wholesale.fr.json
```

### Language Fallback

```typescript
// data/static-marketing-plans/index.ts
export function getStaticPlan(industry: Industry, language: string): MarketingPlan {
  // Try requested language first
  let plan = plans[`${industry.toLowerCase()}.${language}`];

  // Fallback to English if not found
  if (!plan) {
    plan = plans[`${industry.toLowerCase()}.en`];
  }

  return plan;
}
```

### Industries Covered

#### B2C Retail (8 industries)

| Industry | Description | Key Focus |
|----------|-------------|-----------|
| **Fashion** | Apparel, accessories, footwear | Seasonal campaigns, loyalty |
| **Beauty** | Cosmetics, skincare, fragrances | Personalization, replenishment |
| **Home** | Furniture, decor, home goods | High-value nurturing |
| **Electronics** | Consumer electronics, gadgets | Research phase, reviews |
| **Food** | Food & beverage, grocery | Subscription, replenishment |
| **Sports** | Sporting goods, fitness | Seasonal, community |
| **Luxury** | Premium goods, high-end | VIP experience, clienteling |
| **Family** | Baby, kids, family products | Lifecycle marketing |

#### B2B Services (4 industries)

| Industry | Description | Key Focus |
|----------|-------------|-----------|
| **SaaS** | Software as a Service | Onboarding, activation, retention |
| **Services** | Professional services | Lead qualification, nurturing |
| **Manufacturing** | Industrial goods | Account management, quotes |
| **Wholesale** | Bulk distribution | Reorder automation |

---

## Testing

### Unit Tests (Vitest)

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
npm test -- --ui      # Vitest UI
```

### E2E Tests (Playwright)

```bash
npx playwright test           # Run all E2E tests
npx playwright test --ui      # Interactive UI mode
npx playwright test --debug   # Debug mode
npx playwright test full-user-journey  # Specific file
```

### Test Coverage

| Category | Tests | Description |
|----------|-------|-------------|
| Email Validation | 24 | Professional email validation |
| Lead Capture API | 18 | Retry & backup logic |
| E2E Smoke Tests | 9 | Full user journey |
| AI Integration | 1 | End-to-end AI flow |

---

## Deployment

### Netlify Configuration

The project deploys automatically on push to `master`.

**Required Environment Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_URL` | Yes | AI Gateway endpoint |
| `AI_GATEWAY_API_KEY` | Yes | AI Gateway auth |
| `LEAD_HUB_URL` | Yes | Lead Hub endpoint |
| `LEAD_HUB_API_KEY` | Yes | Lead Hub auth |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service key |
| `NPM_TOKEN` | Yes | GitHub Packages access |

### Build Settings (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NPM_CONFIG_@brevogrowth:registry = "https://npm.pkg.github.com"
```

### Supabase Schema

```sql
-- marketing_plans table
CREATE TABLE IF NOT EXISTS marketing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  form_data JSONB NOT NULL,
  user_language VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint on domain + language
CREATE UNIQUE INDEX IF NOT EXISTS idx_marketing_plans_domain_language
ON marketing_plans (company_domain, user_language);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_marketing_plans_domain
ON marketing_plans (company_domain);
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
<type>(<scope>): <message>

feat(plan): Add new program scenario
fix(api): Handle timeout gracefully
docs(readme): Update architecture diagram
test(e2e): Add lead capture tests
```

### Code Guidelines

- TypeScript strict mode required
- No `any` types (type correctly)
- No `console.log` in production
- All PRs need passing tests

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

---

## License

Brevo Internal Project - All rights reserved.

---

## Support

For questions or issues:
- Open a GitHub issue
- Contact the Brevo Growth team
