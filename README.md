# Brevo KPI Benchmark

A strategic marketing asset for Brevo's mid-market prospecting. This interactive benchmarking tool helps B2C and B2B businesses compare their marketing KPIs against industry standards and receive AI-powered recommendations.

**Live Demo:** [brevo-kpi-benchmark.netlify.app](https://brevo-kpi-benchmark.netlify.app)

## Ecosystem Overview

This project is part of the **Brevo Growth Marketing Assets** ecosystem:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BREVO GROWTH ECOSYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐  │
│  │  @brevogrowth/      │    │  brevo-lead-hub     │    │  brevo-ai-gateway   │  │
│  │  lead-capture       │    │  (Netlify App)      │    │  (Netlify App)      │  │
│  │  (NPM Package)      │    │                     │    │                     │  │
│  │                     │    │  Centralized lead   │    │  Unified LLM API:   │  │
│  │  - Email validation │    │  processing:        │    │  - Dust.tt adapter  │  │
│  │  - Modal/Form UI    │    │  - API key auth     │    │  - OpenAI adapter   │  │
│  │  - Multi-language   │    │  - Brevo CRM sync   │    │  - Rate limiting    │  │
│  │  - localStorage     │    │  - Deduplication    │    │  - Job management   │  │
│  └──────────┬──────────┘    └──────────▲──────────┘    └──────────▲──────────┘  │
│             │ npm install               │                         │              │
│             │                           │ POST /api/capture       │ POST/GET     │
│             ▼                           │                         │ /api/v1/     │
│  ┌──────────────────────────────────────┴─────────────────────────┴───────────┐ │
│  │                         brevo-kpi-benchmark                                 │ │
│  │                         (This Repository)                                   │ │
│  │                                                                             │ │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐   │ │
│  │   │ Lead Modal  │    │ Benchmark   │    │ AI Analysis                  │   │ │
│  │   │ (from pkg)  │───▶│ Comparison  │───▶│ (via AI Gateway → Dust.tt)   │   │ │
│  │   └─────────────┘    └─────────────┘    └─────────────────────────────┘   │ │
│  │                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Related Repositories

| Repository | Purpose | URL |
|------------|---------|-----|
| **brevo-kpi-benchmark** | Interactive KPI benchmarking tool | [This repo](https://github.com/brevogrowth/brevo-kpi-benchmark) |
| **brevo-ai-gateway** | Unified LLM API abstraction layer | [GitHub](https://github.com/brevogrowth/brevo-ai-gateway) |
| **brevo-lead-hub** | Centralized lead processing API | [GitHub](https://github.com/brevogrowth/brevo-lead-hub) |
| **lead-capture** | Reusable NPM package for lead capture UI | [GitHub](https://github.com/brevogrowth/lead-capture) |

## Features

- **12 Industries Supported** - B2C (Fashion, Beauty, Home, Electronics, Food, Sports, Luxury, Family) and B2B (SaaS, Services, Manufacturing, Wholesale)
- **3 Price Tiers** - Budget, Mid-Range, and Luxury segments with tailored benchmarks
- **Traffic Light System** - Instant visual feedback (green/yellow/red) on your performance
- **AI-Powered Analysis** - Personalized strategic recommendations via AI Gateway (Dust.tt backend)
- **Lead Capture Module** - Reusable `@brevogrowth/lead-capture` package with professional email validation
- **Multi-Language Support** - English, French, German, and Spanish
- **Collapsible UI** - Clean interface with expandable sections and "Why this metric?" explanations
- **Research-Backed Data** - Benchmarks sourced from industry reports and real data

## Architecture

### Functional Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. LANDING              2. LEAD CAPTURE         3. KPI INPUT              │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│   │ Select      │         │ Email Modal │         │ Enter your  │           │
│   │ Industry &  │────────▶│ (blocks     │────────▶│ KPI values  │           │
│   │ Price Tier  │         │ free emails)│         │ vs market   │           │
│   └─────────────┘         └─────────────┘         └──────┬──────┘           │
│                                                          │                   │
│   4. AI ANALYSIS          5. RECOMMENDATIONS                                │
│   ┌─────────────┐         ┌─────────────┐                                   │
│   │ Processing  │         │ Executive   │                                   │
│   │ (~30 sec)   │◀────────│ Summary +   │                                   │
│   │ with live   │         │ Action Plan │                                   │
│   │ progress    │         │             │                                   │
│   └─────────────┘         └─────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technical Architecture

#### Lead Capture Flow

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
                         │  - Validates API key                           │
                         │  - Validates lead data (Zod)                   │
                         │  - Extracts traffic source (utm_source)        │
                         │  - Creates/updates contact in Brevo CRM        │
                         └────────────────────────────────────────────────┘
```

#### AI Analysis Flow (Async Polling via AI Gateway)

Due to Netlify's 10-second function timeout, AI analysis uses an async polling pattern:

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/analyze  │  Next.js API   │
│   (useAnalysis) │ ─────────────────────▶ │  Route         │
│                 │ ◀───── jobId ──────────│                │
└────────┬────────┘       (~2s)            └───────┬────────┘
         │                                         │
         │                                         │ POST /api/v1/analyze
         │                                         ▼
         │                                ┌────────────────────┐
         │                                │   AI GATEWAY       │
         │                                │   brevo-ai-gateway │
         │                                │   .netlify.app     │
         │                                ├────────────────────┤
         │                                │ - API key auth     │
         │                                │ - Agent routing    │
         │                                │ - Dust.tt adapter  │
         │                                └────────┬───────────┘
         │                                         │
         │ 2. GET /api/analyze/[jobId]             │ Dust.tt API
         │    (polling every 5s)                   │ (non-blocking)
         │                                         ▼
         │◀─── status: pending ────────────┌───────────────┐
         │◀─── status: pending ────────────│   Dust.tt     │
         │◀─── status: complete ───────────│   Agent       │
         │     + analysis content          │   (~30 sec)   │
         ▼                                 └───────────────┘
```

**Key points:**
- **AI Gateway** abstracts the LLM provider (currently Dust.tt, can switch to OpenAI, etc.)
- **Agent alias**: `kpi-benchmark-analyst` (configured in AI Gateway)
- **Job ID format**: `dust_xxxxxxxxxxxx` (provider-prefixed)
- **Timeout handling**: Frontend polls for up to 5 minutes before timing out

### Project Structure

```
app/
├── page.tsx                          # Main landing page with lead capture
├── layout.tsx                        # Root layout with fonts
├── globals.css                       # Tailwind styles
└── api/
    ├── lead/route.ts                 # Lead capture → forwards to Lead Hub
    └── analyze/
        ├── route.ts                  # POST - Create analysis job via AI Gateway
        └── [conversationId]/route.ts # GET - Poll job status from AI Gateway

components/
├── BenchmarkGrid.tsx                 # KPI grid with collapsible sections
├── AiAnalysisResult.tsx              # Markdown rendering for AI output
├── SidebarInputs.tsx                 # Industry/price tier selector
├── Header.tsx                        # Brevo navigation header
└── Providers.tsx                     # LeadCaptureProvider wrapper

hooks/
└── useAnalysis.ts                    # AI analysis state management + polling

lib/
└── lead-capture/
    └── index.ts                      # Re-exports from @brevogrowth/lead-capture

data/
├── benchmarks.csv                    # Source of truth (synced from Google Sheets)
└── benchmarks.ts                     # Auto-generated TypeScript (DO NOT EDIT)

utils/
└── benchmarkUtils.ts                 # Traffic light logic & scoring

config/
└── api.ts                            # API configuration (endpoints, timeouts)

tests/
├── benchmarkUtils.test.ts            # Unit tests for business logic
├── lead-capture.test.ts              # Email validation tests
├── full-user-journey.spec.ts         # E2E tests (Playwright)
└── dust-integration.spec.ts          # AI integration E2E test
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Brevo AI Gateway → Dust.tt | v1 |
| Lead Capture | @brevogrowth/lead-capture | 1.x |
| Validation | Zod | 3.x |
| Testing | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify | Free tier |

## Quick Start

### Prerequisites

1. **GitHub Personal Access Token** with `read:packages` scope for accessing `@brevogrowth/lead-capture`
2. **AI Gateway API key** for AI analysis feature

### Installation

```bash
# Clone the repository
git clone https://github.com/brevogrowth/brevo-kpi-benchmark.git
cd brevo-kpi-benchmark

# Configure npm for GitHub Packages (see .npmrc.example)
cp .npmrc.example .npmrc
# Edit .npmrc with your GitHub token OR set NPM_TOKEN env var

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Development

```bash
# Start development server
npm run dev

# Run unit tests
npm test

# Run E2E tests
npx playwright test

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required for Production (Netlify)

```bash
# AI Gateway Integration
AI_GATEWAY_URL=https://brevo-ai-gateway.netlify.app
AI_GATEWAY_API_KEY=gw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Lead Hub Integration
LEAD_HUB_URL=https://brevo-lead-hub.netlify.app/api/capture
LEAD_HUB_API_KEY=lh_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitHub Packages (for @brevogrowth/lead-capture)
NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Local Development (.env.local)

```bash
# Copy from .env.example
cp .env.example .env.local

# Minimum required for local dev
AI_GATEWAY_URL=https://brevo-ai-gateway.netlify.app
AI_GATEWAY_API_KEY=gw_xxx

# Optional: Lead Hub (can be skipped locally - leads logged to console)
LEAD_HUB_URL=https://brevo-lead-hub.netlify.app/api/capture
LEAD_HUB_API_KEY=lh_xxx
```

> **Security:** Never commit `.env.local` or real credentials.

## Lead Capture Integration

This project uses `@brevogrowth/lead-capture` from GitHub Packages:

### How it works

1. **Package** (`@brevogrowth/lead-capture`) provides:
   - `LeadCaptureProvider` - Context wrapper
   - `useLeadGate()` - Hook to gate features behind lead capture
   - Email validation (blocks 100+ free email domains)
   - Multi-language support (EN, FR, DE, ES)

2. **Local API route** (`/api/lead`) receives lead data and forwards to Lead Hub

3. **Lead Hub** (`brevo-lead-hub.netlify.app`) centralizes:
   - API key authentication
   - Brevo CRM contact creation
   - Traffic source extraction (utm_source, referrer)
   - Deduplication logic

### Configuration in Providers.tsx

```tsx
<LeadCaptureProvider
  config={{
    apiEndpoint: '/api/lead',      // Local route that forwards to Lead Hub
    storageKey: 'brevo_kpi_lead',  // localStorage key
    mode: 'blocking',              // Block access until email captured
    blockFreeEmails: true,         // Reject gmail, yahoo, etc.
  }}
>
  {children}
</LeadCaptureProvider>
```

### Testing Lead Capture

```bash
# Reset lead capture state for testing
# Add ?force=true to any URL
http://localhost:3000/?force=true

# Or via DevTools console
localStorage.removeItem('brevo_kpi_lead');
location.reload();
```

## AI Analysis Integration

### How it works

1. **Frontend** (`useAnalysis` hook) sends KPI data to `/api/analyze`
2. **API Route** forwards to AI Gateway with:
   - `agentAlias`: `kpi-benchmark-analyst`
   - `prompt`: Multi-language template with user's KPI data
   - `metadata`: industry, language, priceTier
3. **AI Gateway** routes to Dust.tt agent, returns `jobId`
4. **Frontend** polls `/api/analyze/{jobId}` every 5 seconds
5. **API Route** checks AI Gateway for job status
6. **Result** returned as Markdown, rendered in `AiAnalysisResult` component

### Agent Configuration

The AI agent (`kpi-benchmark-analyst`) is configured in `brevo-ai-gateway` with:
- Custom system prompt for marketing consultant persona
- Access to industry benchmark context
- Structured output format (Executive Summary, Traffic Lights, Recommendations)

## Benchmark Data Management

### Sync from Google Sheets

```bash
# Manual sync from Google Sheets
npm run sync:benchmarks

# Generate TypeScript from local CSV
npm run generate:benchmarks
```

**Source Sheet:** [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

> **Warning:** Never edit `data/benchmarks.ts` manually. Always use `npm run generate:benchmarks`.

## Testing

```bash
# Unit tests (Vitest) - 88 tests
npm test
npm test -- --coverage
npm test -- --watch

# E2E tests (Playwright) - 9 smoke tests + AI integration
npx playwright test
npx playwright test --ui
npx playwright test --debug

# Test specific file
npx playwright test full-user-journey

# Skip AI tests (faster)
npx playwright test --grep-invert "AI"
```

### Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| Email Validation | 45 | 100+ free domains |
| Benchmark Utils | 15 | Traffic lights, scoring |
| Lead Capture API | 18 | Retry, backup strategy |
| E2E Smoke Tests | 9 | Full user journey |
| AI Integration | 1 | AI Gateway analysis |

## Deployment

### Netlify Configuration

The project is deployed on Netlify. Required environment variables:

| Variable | Description |
|----------|-------------|
| `AI_GATEWAY_URL` | AI Gateway endpoint |
| `AI_GATEWAY_API_KEY` | API key for AI Gateway auth |
| `LEAD_HUB_URL` | Lead Hub API endpoint |
| `LEAD_HUB_API_KEY` | API key for Lead Hub auth |
| `NPM_TOKEN` | GitHub PAT for @brevogrowth packages |

### Build Configuration (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NPM_CONFIG_@brevogrowth:registry = "https://npm.pkg.github.com"
```

## Documentation

| File | Description |
|------|-------------|
| [CLAUDE.md](CLAUDE.md) | Development guidelines for Claude Code |
| [docs/SYNC.md](docs/SYNC.md) | Google Sheets synchronization guide |
| [docs/BENCHMARKS.md](docs/BENCHMARKS.md) | Benchmark data structure |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Developer guide |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Follow the conventions in [CLAUDE.md](CLAUDE.md).

## License

Brevo Internal Project - All rights reserved.
