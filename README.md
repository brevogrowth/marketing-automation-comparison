# Brevo KPI Benchmark

A strategic marketing asset for Brevo's mid-market prospecting. This interactive benchmarking tool helps B2C and B2B businesses compare their marketing KPIs against industry standards and receive AI-powered recommendations.

**Live Demo:** [brevo-kpi-benchmark.netlify.app](https://brevo-kpi-benchmark.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/brevo-kpi-benchmark/deploys)

## Ecosystem Overview

This project is part of the **Brevo Growth Marketing Assets** ecosystem, consisting of three interconnected repositories:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BREVO GROWTH ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────┐       ┌─────────────────────┐                    │
│   │  @brevogrowth/      │       │  brevo-lead-hub     │                    │
│   │  lead-capture       │       │  (Netlify App)      │                    │
│   │  (NPM Package)      │       │                     │                    │
│   │                     │       │  Centralized lead   │                    │
│   │  - Email validation │       │  processing:        │                    │
│   │  - Modal/Form UI    │       │  - API key auth     │                    │
│   │  - Multi-language   │       │  - Brevo CRM sync   │                    │
│   │  - localStorage     │       │  - Deduplication    │                    │
│   └──────────┬──────────┘       └──────────▲──────────┘                    │
│              │ npm install                  │ POST /api/capture            │
│              │                              │ + X-API-Key header            │
│              ▼                              │                               │
│   ┌──────────────────────────────────────────────────────────────┐        │
│   │                    brevo-kpi-benchmark                        │        │
│   │                    (This Repository)                          │        │
│   │                                                               │        │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │        │
│   │  │ Lead Modal  │  │ Benchmark   │  │ AI Analysis         │  │        │
│   │  │ (from pkg)  │→ │ Comparison  │→ │ (Dust.tt)           │  │        │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘  │        │
│   │                                                               │        │
│   │  POST /api/lead ─────────────────────────────────────────────┼────────┘
│   └──────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Related Repositories

| Repository | Purpose | URL |
|------------|---------|-----|
| **brevo-kpi-benchmark** | Interactive KPI benchmarking tool | [This repo](https://github.com/brevogrowth/brevo-kpi-benchmark) |
| **lead-capture** | Reusable NPM package for lead capture UI | [GitHub](https://github.com/brevogrowth/lead-capture) |
| **brevo-lead-hub** | Centralized lead processing API | [GitHub](https://github.com/brevogrowth/brevo-lead-hub) |

## Features

- **12 Industries Supported** - B2C (Fashion, Beauty, Home, Electronics, Food, Sports, Luxury, Family) and B2B (SaaS, Services, Manufacturing, Wholesale)
- **3 Price Tiers** - Budget, Mid-Range, and Luxury segments with tailored benchmarks
- **Traffic Light System** - Instant visual feedback (green/yellow/red) on your performance
- **AI-Powered Analysis** - Personalized strategic recommendations via Dust.tt
- **Lead Capture Module** - Reusable `@brevogrowth/lead-capture` package with professional email validation
- **Multi-Language Support** - English, French, German, and Spanish
- **Collapsible UI** - Clean interface with expandable sections and "Why this metric?" explanations
- **Research-Backed Data** - Benchmarks sourced from industry reports and real data

## Quick Start

### Prerequisites

1. **GitHub Personal Access Token** with `read:packages` scope for accessing `@brevogrowth/lead-capture`
2. **Dust.tt API credentials** for AI analysis feature

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

## Architecture

### Lead Capture Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   User visits    │     │   Lead Modal     │     │   /api/lead      │
│   KPI Benchmark  │────▶│   (from package) │────▶│   (Next.js)      │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                         ┌─────────────────────────────────┘
                         │ POST + X-API-Key header
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        BREVO LEAD HUB                                 │
│                 https://brevo-lead-hub.netlify.app                    │
├──────────────────────────────────────────────────────────────────────┤
│  POST /api/capture                                                    │
│  ├─ Validates API key                                                │
│  ├─ Validates lead data (Zod)                                        │
│  ├─ Deduplicates by email                                            │
│  └─ Creates/updates contact in Brevo CRM                             │
└──────────────────────────────────────────────────────────────────────┘
```

### AI Analysis Flow (Async Polling)

Due to Netlify Free tier's 10-second timeout constraint, AI analysis uses an async polling pattern:

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/analyze  │  API Route     │
│   (page.tsx)    │ ─────────────────────▶ │  (route.ts)    │
│                 │ ◀───── conversationId ─│                │
└────────┬────────┘       (~2s)            └───────┬────────┘
         │                                         │
         │ 2. GET /api/analyze/[id]                │ Dust.tt
         │    (polling every 5s)                   │ (blocking: false)
         │                                         ▼
         │◀─── status: pending ────────────┌───────────────┐
         │◀─── status: pending ────────────│   Dust.tt     │
         │◀─── status: complete ───────────│   Processing  │
         │     + analysis content          │   (~3 min)    │
         ▼                                 └───────────────┘
```

### Project Structure

```
app/
├── page.tsx                # Main landing page with lead capture
├── api/
│   ├── lead/route.ts       # Lead capture → forwards to Lead Hub
│   └── analyze/            # Dust.tt AI endpoint (async polling)
│       ├── route.ts        # POST - Create conversation
│       └── [conversationId]/route.ts  # GET - Poll status

components/
├── BenchmarkGrid.tsx       # KPI grid with collapsible sections
├── AiAnalysisResult.tsx    # Markdown rendering for AI output
├── SidebarInputs.tsx       # Industry/price tier selector
└── Providers.tsx           # LeadCaptureProvider wrapper

lib/
└── lead-capture/           # Re-exports from @brevogrowth/lead-capture
    └── index.ts            # export * from '@brevogrowth/lead-capture'

data/
├── benchmarks.csv          # Source of truth (synced from Google Sheets)
└── benchmarks.ts           # Auto-generated TypeScript (DO NOT EDIT)

utils/
└── benchmarkUtils.ts       # Traffic light logic & scoring

tests/
├── benchmarkUtils.test.ts  # Unit tests for business logic
├── lead-capture.test.ts    # Email validation tests
├── full-user-journey.spec.ts # E2E tests (Playwright)
└── dust-integration.spec.ts  # AI integration E2E test
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Dust.tt API | v1 |
| Lead Capture | @brevogrowth/lead-capture | 1.x |
| Validation | Zod | 3.x |
| Testing | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify | Free tier |

## Environment Variables

### Required for Netlify Deployment

```bash
# Lead Hub Integration
LEAD_HUB_URL=https://brevo-lead-hub.netlify.app/api/capture
LEAD_HUB_API_KEY=lh_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Dust.tt AI Analysis
DUST_WORKSPACE_ID=your_workspace_id
DUST_API_KEY=your_api_key
DUST_ASSISTANT_ID=your_assistant_id

# GitHub Packages (for @brevogrowth/lead-capture)
NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Local Development (.env.local)

```bash
# Copy from .env.example
cp .env.example .env.local

# Minimum required for local dev (AI analysis)
DUST_WORKSPACE_ID=xxx
DUST_API_KEY=sk-xxx
DUST_ASSISTANT_ID=xxx

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
| AI Integration | 1 | Dust.tt analysis |

## Documentation

| File | Description |
|------|-------------|
| [CLAUDE.md](CLAUDE.md) | Development guidelines for Claude Code |
| [docs/SYNC.md](docs/SYNC.md) | Google Sheets synchronization guide |
| [docs/BENCHMARKS.md](docs/BENCHMARKS.md) | Benchmark data structure |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Developer guide |
| [docs/AUDIT.md](docs/AUDIT.md) | Technical audit & roadmap |

## Deployment

### Netlify Configuration

The project is deployed on Netlify. Required environment variables:

| Variable | Description |
|----------|-------------|
| `LEAD_HUB_URL` | Lead Hub API endpoint |
| `LEAD_HUB_API_KEY` | API key for Lead Hub auth |
| `DUST_WORKSPACE_ID` | Dust.tt workspace |
| `DUST_API_KEY` | Dust.tt API key |
| `DUST_ASSISTANT_ID` | Dust.tt agent ID |
| `NPM_TOKEN` | GitHub PAT for @brevogrowth packages |

### Build Configuration (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NPM_CONFIG_@brevogrowth:registry = "https://npm.pkg.github.com"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Follow the conventions in [CLAUDE.md](CLAUDE.md).

## License

Brevo Internal Project - All rights reserved.
