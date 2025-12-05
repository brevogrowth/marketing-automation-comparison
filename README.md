# Brevo KPI Benchmark

A strategic marketing asset for Brevo's mid-market prospecting. This interactive benchmarking tool enables B2C retailers and B2B companies to compare their marketing KPIs against industry standards and receive AI-powered personalized recommendations.

**Live Demo:** [brevo-kpi-benchmark.netlify.app](https://brevo-kpi-benchmark.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/brevo-kpi-benchmark/deploy-status)](https://app.netlify.com/sites/brevo-kpi-benchmark/deploys)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [Features](#features)
4. [User Journey](#user-journey)
5. [Technical Architecture](#technical-architecture)
6. [Benchmark Data Reference](#benchmark-data-reference)
7. [Tech Stack](#tech-stack)
8. [Quick Start](#quick-start)
9. [Environment Variables](#environment-variables)
10. [Lead Capture Integration](#lead-capture-integration)
11. [AI Analysis Integration](#ai-analysis-integration)
12. [Data Management](#data-management)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Contributing](#contributing)

---

## Executive Summary

**Brevo KPI Benchmark** is a lead generation tool disguised as a free value-add service. Marketing directors input their KPIs, receive instant traffic-light benchmarking against industry peers, and unlock AI-powered strategic recommendations by providing their professional email.

### Key Metrics

| Metric | Value |
|--------|-------|
| Industries covered | 12 (8 B2C + 4 B2B) |
| KPIs tracked | 23 unique metrics |
| Price tiers | 3 (Budget, Mid-Range, Luxury) |
| Languages | 4 (EN, FR, DE, ES) |
| Benchmark data points | 800+ |

### Value Proposition

> *"Compare your KPIs to market standards and get personalized AI recommendations to improve your CRM and Automation strategy."*

---

## Business Context

### Strategic Objectives

| Objective | Implementation |
|-----------|----------------|
| **Lead Generation** | Free tool attracts mid-market prospects |
| **Qualification** | User inputs reveal maturity level and pain points |
| **Nurturing** | AI analysis positions Brevo as expert advisor |
| **Conversion** | CTAs to Brevo free trial and demo requests |

### Target Audience

- **Profile**: Marketing Directors / Growth Leaders / CMOs
- **Company Size**: Mid-market (10-500 employees, 1M-50M EUR revenue)
- **Industries**: 12 verticals across B2C retail and B2B services
- **Maturity**: Already using email marketing, looking to optimize performance

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Traffic Light System** | Instant visual feedback (green/yellow/red) comparing user KPIs to market |
| **Industry Benchmarks** | Research-backed data from industry reports and real performance data |
| **AI-Powered Analysis** | Personalized strategic recommendations via Dust.tt agent |
| **Lead Capture** | Professional email validation blocking 100+ free email domains |
| **Multi-Language** | Full support for English, French, German, and Spanish |

### User Interface

- **Collapsible Sections** - Clean interface with expandable KPI categories
- **"Why this metric?"** - Educational tooltips explaining each KPI's importance
- **Progress Indicators** - Visual feedback during AI analysis (4-step process)
- **Responsive Design** - Optimized for desktop and mobile devices

---

## User Journey

```
                                    USER JOURNEY FLOW

    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                  │
    │   STEP 1                 STEP 2                 STEP 3                          │
    │   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐               │
    │   │  LANDING      │      │  LEAD GATE    │      │  KPI INPUT    │               │
    │   │               │      │               │      │               │               │
    │   │ • Select      │      │ • Email modal │      │ • Enter your  │               │
    │   │   Industry    │─────▶│   appears     │─────▶│   KPI values  │               │
    │   │ • Select      │      │ • Validates   │      │ • See traffic │               │
    │   │   Price Tier  │      │   pro emails  │      │   lights vs   │               │
    │   │               │      │               │      │   benchmarks  │               │
    │   └───────────────┘      └───────────────┘      └───────┬───────┘               │
    │                                                         │                        │
    │                                                         ▼                        │
    │                          STEP 5                 STEP 4                          │
    │                          ┌───────────────┐      ┌───────────────┐               │
    │                          │  RESULTS      │      │  AI ANALYSIS  │               │
    │                          │               │      │               │               │
    │                          │ • Executive   │      │ • Processing  │               │
    │                          │   Summary     │◀─────│   indicator   │               │
    │                          │ • Strengths & │      │ • 4-step      │               │
    │                          │   Gaps        │      │   progress    │               │
    │                          │ • 3 Action    │      │ • ~30 seconds │               │
    │                          │   Items       │      │               │               │
    │                          └───────────────┘      └───────────────┘               │
    │                                                                                  │
    └─────────────────────────────────────────────────────────────────────────────────┘
```

### Step Details

| Step | Action | Technical Implementation |
|------|--------|-------------------------|
| 1. Landing | User selects industry and price tier | `SidebarInputs.tsx` component |
| 2. Lead Gate | Modal captures professional email | `@brevogrowth/lead-capture` package |
| 3. KPI Input | User enters their metrics | `BenchmarkGrid.tsx` with traffic lights |
| 4. AI Analysis | System processes data | Async polling via AI Gateway → Dust.tt |
| 5. Results | Personalized recommendations | `AiAnalysisResult.tsx` markdown renderer |

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
│   │                          brevo-kpi-benchmark                                  │  │
│   │                          (This Repository)                                    │  │
│   │                                                                               │  │
│   │    ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐     │  │
│   │    │ Lead Modal  │    │ Benchmark   │    │ AI Analysis                  │     │  │
│   │    │ (from pkg)  │───▶│ Comparison  │───▶│ (via AI Gateway → Dust.tt)   │     │  │
│   │    └─────────────┘    └─────────────┘    └─────────────────────────────┘     │  │
│   │                                                                               │  │
│   └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Related Repositories

| Repository | Purpose | URL |
|------------|---------|-----|
| **brevo-kpi-benchmark** | Interactive KPI benchmarking tool | This repo |
| **brevo-ai-gateway** | Unified LLM API abstraction layer | [GitHub](https://github.com/brevogrowth/brevo-ai-gateway) |
| **brevo-lead-hub** | Centralized lead processing API | [GitHub](https://github.com/brevogrowth/brevo-lead-hub) |
| **lead-capture** | Reusable NPM package for lead capture UI | [GitHub](https://github.com/brevogrowth/lead-capture) |

### Lead Capture Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   User visits    │     │   Lead Modal     │     │   /api/lead      │
│   KPI Benchmark  │────▶│   (@brevogrowth/ │────▶│   (Next.js)      │
│                  │     │   lead-capture)  │     └────────┬─────────┘
└──────────────────┘     └──────────────────┘              │
                                                           │ POST + API Key
                                                           ▼
                         ┌────────────────────────────────────────────────┐
                         │              BREVO LEAD HUB                     │
                         │       brevo-lead-hub.netlify.app               │
                         ├────────────────────────────────────────────────┤
                         │  • Validates API key per client                │
                         │  • Validates lead data (Zod schema)            │
                         │  • Extracts traffic source (utm_source)        │
                         │  • Creates/updates contact in Brevo CRM        │
                         │  • Adds to segmented lists by industry         │
                         └────────────────────────────────────────────────┘
```

### AI Analysis Flow (Async Polling Pattern)

Due to Netlify's 10-second serverless function timeout, AI analysis uses an async polling pattern:

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/analyze  │  Next.js API   │
│   (useAnalysis) │ ─────────────────────▶ │  Route         │
│                 │ ◀───── jobId ──────────│                │
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
         │ 2. GET /api/analyze/[jobId]             │ Dust.tt API
         │    (polling every 5s)                   │ (blocking: false)
         │                                         ▼
         │◀─── status: pending ────────────┌───────────────┐
         │◀─── status: pending ────────────│   Dust.tt     │
         │◀─── status: complete ───────────│   Agent       │
         │     + analysis content          │   (~30 sec)   │
         ▼                                 └───────────────┘
```

**Key Configuration:**

| Parameter | Value |
|-----------|-------|
| Agent Alias | `kpi-benchmark-analyst` |
| Job ID Format | `dust_xxxxxxxxxxxx` |
| Polling Interval | 5 seconds |
| Max Timeout | 5 minutes |
| Netlify Function Timeout | 10 seconds |

### Project Structure

```
brevo-kpi-benchmark/
│
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Main landing page with lead capture
│   ├── layout.tsx                    # Root layout with fonts & providers
│   ├── globals.css                   # Tailwind CSS styles
│   └── api/
│       ├── lead/
│       │   └── route.ts              # POST - Forward leads to Lead Hub
│       └── analyze/
│           ├── route.ts              # POST - Create analysis job
│           └── [conversationId]/
│               └── route.ts          # GET - Poll job status
│
├── components/
│   ├── BenchmarkGrid.tsx             # KPI input grid with traffic lights
│   ├── AiAnalysisResult.tsx          # Markdown AI output renderer
│   ├── SidebarInputs.tsx             # Industry/price tier selector
│   ├── Header.tsx                    # Brevo navigation header
│   ├── Providers.tsx                 # LeadCaptureProvider wrapper
│   └── ui/                           # Reusable UI components
│
├── hooks/
│   └── useAnalysis.ts                # AI analysis state + polling logic
│
├── lib/
│   └── lead-capture/
│       └── index.ts                  # Re-exports from @brevogrowth/lead-capture
│
├── data/
│   ├── benchmarks.csv                # Source of truth (from Google Sheets)
│   └── benchmarks.ts                 # AUTO-GENERATED TypeScript (DO NOT EDIT)
│
├── utils/
│   └── benchmarkUtils.ts             # Traffic light logic & scoring
│
├── config/
│   └── api.ts                        # API endpoints & timeouts
│
├── scripts/
│   ├── generate-benchmarks.js        # CSV → TypeScript generator
│   └── sync-from-gsheet.js           # Google Sheets → CSV sync
│
├── tests/
│   ├── benchmarkUtils.test.ts        # Unit tests (Vitest)
│   ├── full-user-journey.spec.ts     # E2E tests (Playwright)
│   └── dust-integration.spec.ts      # AI integration E2E
│
├── docs/                             # Additional documentation
│   ├── SYNC.md                       # Benchmark sync guide
│   ├── BENCHMARKS.md                 # Data structure docs
│   └── DEVELOPMENT.md                # Developer guide
│
├── .github/
│   └── workflows/
│       ├── playwright.yml            # E2E tests on push
│       └── sync-benchmarks.yml       # Scheduled benchmark sync
│
├── CLAUDE.md                         # Claude Code development guide
├── netlify.toml                      # Netlify deployment config
└── package.json
```

---

## Benchmark Data Reference

### Industries Covered

#### B2C Retail (8 industries)

| Industry | Description | Key Characteristics |
|----------|-------------|---------------------|
| **Fashion** | Apparel, accessories, footwear | High return rates, seasonal patterns |
| **Beauty** | Cosmetics, skincare, fragrances | High repeat rates, subscription potential |
| **Home** | Furniture, decor, home goods | High AOV, low frequency |
| **Electronics** | Consumer electronics, gadgets | Price comparison, spec-driven |
| **Food** | Food & beverage, grocery | Replenishment cycles, subscription |
| **Sports** | Sporting goods, fitness | Seasonal, lifestyle-driven |
| **Luxury** | Premium goods, high-end | High margins, clienteling focus |
| **Family** | Baby, kids, family products | High LTV, lifecycle marketing |

#### B2B Services (4 industries)

| Industry | Description | Key Characteristics |
|----------|-------------|---------------------|
| **SaaS** | Software as a Service | MRR focus, churn critical |
| **Services** | Professional services | Lead qualification, long sales cycle |
| **Manufacturing** | Industrial goods | Quote-based, account management |
| **Wholesale** | Bulk distribution | Volume pricing, repeat orders |

### KPI Categories & Metrics

#### Strategic Efficiency (3 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `ltv_cac` | LTV:CAC Ratio | x | Higher is better |
| `mer` | Marketing Efficiency Ratio | x | Higher is better |
| `cac_payback` | CAC Payback Period | months | Lower is better |

#### Acquisition (3 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `cac` | Customer Acquisition Cost | EUR | Lower is better |
| `roas` | Blended ROAS | x | Higher is better |
| `marketing_spend` | Marketing % of Revenue | % | Context-dependent |

#### Conversion (4 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `conv_rate` | Conversion Rate (Desktop) | % | Higher is better |
| `mobile_conv` | Conversion Rate (Mobile) | % | Higher is better |
| `cart_abandon` | Cart Abandonment Rate | % | Lower is better |
| `aov` | Average Order Value | EUR | Higher is better |

#### Channel Mix (5 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `email_rev_share` | Email Revenue Share | % | Higher is better |
| `sms_rev_share` | SMS Revenue Share | % | Higher is better |
| `social_rev_share` | Social Media Revenue Share | % | Context-dependent |
| `paid_rev_share` | Paid Advertising Revenue Share | % | Lower often better |
| `organic_rev_share` | Organic Search Revenue Share | % | Higher is better |

#### Email Marketing (5 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `email_open_rate` | Email Open Rate | % | Higher is better |
| `email_click_rate` | Email Click Rate | % | Higher is better |
| `email_ctor` | Click-to-Open Rate (CTOR) | % | Higher is better |
| `email_bounce_rate` | Bounce Rate | % | Lower is better |
| `email_unsub_rate` | Unsubscribe Rate | % | Lower is better |

#### Retention (4 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `repeat_rate` | Repeat Customer Rate | % | Higher is better |
| `purchase_freq` | Purchase Frequency | #/year | Higher is better |
| `churn_rate` | Annual Churn Rate | % | Lower is better |

#### Economics (2 metrics)

| Metric ID | Name | Unit | Direction |
|-----------|------|------|-----------|
| `return_rate` | Return Rate | % | Lower is better |
| `gross_margin` | Gross Margin | % | Higher is better |

### Price Tiers

| Tier | Description | Typical AOV | Example Brands |
|------|-------------|-------------|----------------|
| **Budget** | Value-focused, high volume | < EUR 50 | H&M, Primark, AliExpress |
| **Mid-Range** | Balanced quality/price | EUR 50-200 | Zara, Sephora, Nike |
| **Luxury** | Premium positioning | > EUR 200 | Gucci, La Mer, Dyson |

### Traffic Light Logic

```typescript
// Higher is Better (ROAS, LTV, Conversion, etc.)
value > high         → GREEN  (Excellent)
median ≤ value ≤ high → YELLOW (Average)
value < median       → RED    (Below benchmark)

// Lower is Better (CAC, Churn, Cart Abandonment, etc.)
value < low          → GREEN  (Excellent)
low ≤ value ≤ median → YELLOW (Average)
value > median       → RED    (Above benchmark = bad)
```

---

## Tech Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js (App Router) | 16.x | React framework with SSR |
| **Language** | TypeScript | 5.x | Type safety |
| **UI** | React + Tailwind CSS | 19.x / 4.x | Components & styling |
| **AI** | Brevo AI Gateway → Dust.tt | v1 | LLM analysis |
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

### Installation

```bash
# Clone the repository
git clone https://github.com/brevogrowth/brevo-kpi-benchmark.git
cd brevo-kpi-benchmark

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
| `NPM_TOKEN` | GitHub PAT for packages | `ghp_xxxxxxxxxxxxx` |

### Local Development (.env.local)

```bash
# Required
AI_GATEWAY_URL=https://brevo-ai-gateway.netlify.app
AI_GATEWAY_API_KEY=gw_your_key_here

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

## AI Analysis Integration

### How It Works

1. **Frontend** sends KPI data to `/api/analyze`
2. **API Route** forwards to AI Gateway with agent alias
3. **AI Gateway** routes to Dust.tt, returns `jobId`
4. **Frontend** polls `/api/analyze/{jobId}` every 5 seconds
5. **Result** returned as Markdown, rendered in UI

### Prompt Structure

The AI receives a structured prompt with:
- Consultant persona (B2B or B2C specialist)
- Industry and price tier context
- User's KPI values vs. market benchmarks
- Request for Executive Summary, Traffic Lights, and 3 Recommendations

### Output Format (Markdown)

```markdown
# Executive Summary
(2-3 sentences on overall performance)

# Traffic Light Analysis
- **Strengths**: (2 metrics where they excel)
- **Critical Gaps**: (2 metrics needing attention)

# Strategic Recommendations
1. **[Action Title]**: [Specific tactics]
2. **[Action Title]**: [Specific tactics]
3. **[Action Title]**: [Specific tactics]
```

---

## Data Management

### Benchmark Data Pipeline

```
Google Sheets  ──(sync)──▶  benchmarks.csv  ──(generate)──▶  benchmarks.ts
   (source)                    (local)                      (TypeScript)
```

### Commands

```bash
# Sync from Google Sheets (requires auth)
npm run sync:benchmarks

# Generate TypeScript from local CSV
npm run generate:benchmarks
```

### Source Google Sheet

[Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

> **Warning:** Never edit `data/benchmarks.ts` manually. Always regenerate from CSV.

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
| Email Validation | 45 | 100+ blocked domains |
| Benchmark Utils | 15 | Traffic light logic |
| Lead Capture API | 18 | Retry & backup |
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
| `NPM_TOKEN` | Yes | GitHub Packages access |

### Build Settings (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NPM_CONFIG_@brevogrowth:registry = "https://npm.pkg.github.com"
```

### GitHub Actions

The repository includes automated workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `playwright.yml` | Push to master | E2E tests |
| `sync-benchmarks.yml` | Scheduled | Benchmark data sync |

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

feat(grid): Add new KPI metric
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
