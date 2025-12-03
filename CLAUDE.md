# Claude Code Development Guide

This file contains directives for Claude Code when developing on this project.

---

## Business Context

### What is this project?

**Brevo KPI Benchmark** is a **strategic marketing asset** for Brevo's mid-market prospecting. It's an interactive tool that allows B2C retailers and B2B companies to compare their marketing KPIs against industry benchmarks and receive personalized AI-powered recommendations.

### Strategic Objectives

1. **Lead Generation** - Attract mid-market prospects by offering free value
2. **Qualification** - User inputs reveal maturity level and pain points
3. **Nurturing** - AI analysis positions Brevo as an expert and suggests its solutions (CRM, Email, SMS, Automation)
4. **Conversion** - CTAs to Brevo free trial and demos

### Target Audience

- **Profile**: Marketing Directors / Growth Leaders
- **Size**: Mid-market (10-500 employees, 1-50M revenue)
- **Industries**: 12 verticals (B2C: Fashion, Beauty, Home, Electronics, Food, Sports, Luxury, Family | B2B: SaaS, Services, Manufacturing, Wholesale)
- **Maturity**: Already using email marketing, looking to optimize

### Value Proposition

> "Compare your KPIs to market standards and get personalized AI recommendations to improve your CRM and Automation strategy."

---

## Technical Architecture

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Dust.tt API | v1 |
| Validation | Zod | 3.x |
| Tests | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify Free | - |
| Data | CSV → TypeScript (auto-generated) | - |

### Application Versions

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Static landing page | Legacy |
| `/v2` | Interactive grid with traffic lights | Stable |
| `/v3` | Detailed comparative analysis | Stable |
| `/v4` | **AI analysis via Dust.tt** | Active |

**Current Focus**: Version `/v4` with Dust.tt integration and improved UX

### API Architecture (Async Polling Pattern)

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/analyze  │  API Route     │
│   (v4/page.tsx) │ ─────────────────────▶ │  (route.ts)    │
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

**Why this pattern?**
- Netlify Free timeout = 10 seconds
- Dust.tt AI generation = ~3 minutes
- SSE streaming impossible → Async polling required

### Folder Structure

```
app/
├── api/
│   └── analyze/
│       ├── route.ts              # POST - Create Dust conversation
│       └── [conversationId]/
│           └── route.ts          # GET - Poll status
├── page.tsx                      # Main landing page with lead capture
├── v2/page.tsx                   # Interactive grid
├── v3/page.tsx                   # Comparative analysis
├── v4/page.tsx                   # AI analysis (main)
├── layout.tsx                    # Global layout + fonts
└── globals.css                   # Tailwind styles

components/
├── BenchmarkGrid.tsx             # KPI grid with collapsible sections
├── AiAnalysisResult.tsx          # Markdown AI result display
├── SidebarInputs.tsx             # Industry/priceTier selector
├── Header.tsx                    # Brevo navigation
└── [30+ others]                  # Legacy components (to refactor)

packages/
└── lead-capture/                 # @brevo/lead-capture NPM package
    ├── src/
    │   ├── core/
    │   │   ├── api.ts            # Brevo API integration + retry logic
    │   │   ├── storage.ts        # localStorage management
    │   │   ├── types.ts          # TypeScript interfaces
    │   │   ├── validation.ts     # Email validation (100+ blocked domains)
    │   │   └── translations/     # i18n (en, fr, de, es)
    │   ├── modal/
    │   │   ├── LeadCaptureProvider.tsx  # Context provider
    │   │   ├── LeadGateModal.tsx        # Modal component
    │   │   └── useLeadGate.ts           # Hook for gating
    │   └── form/
    │       ├── LeadCaptureForm.tsx      # Standalone form
    │       └── useLeadForm.ts           # Form hook
    └── tests/
        └── validation.test.ts    # 45 validation tests

lib/
└── lead-capture/                 # Re-exports from @brevo/lead-capture
    └── index.ts                  # Backwards compatibility layer

data/
├── benchmarks.csv                # Source of truth (sync Google Sheets)
└── benchmarks.ts                 # AUTO-GENERATED - do not edit

utils/
└── benchmarkUtils.ts             # Traffic lights & scoring logic

scripts/
├── generate-benchmarks.js        # CSV → TypeScript
└── sync-from-gsheet.js           # Google Sheets → CSV

tests/
├── benchmarkUtils.test.ts        # Unit tests for business logic
├── full-user-journey.spec.ts     # E2E Playwright tests (9 tests)
└── dust-integration.spec.ts      # AI integration E2E test

docs/                             # Detailed documentation
```

---

## Data Model

### Industries & Price Tiers

```typescript
type Industry =
  // B2C
  | 'Fashion' | 'Beauty' | 'Home' | 'Electronics' | 'Food' | 'Sports' | 'Luxury' | 'Family'
  // B2B
  | 'SaaS' | 'Services' | 'Manufacturing' | 'Wholesale';

type PriceTier = 'Budget' | 'Mid-Range' | 'Luxury';
```

### KPI Categories

| Category | Metrics | Direction |
|----------|---------|-----------|
| **Strategic Efficiency** | LTV:CAC, MER | Higher is better |
| **Acquisition** | CAC, ROAS, Marketing % | CAC: lower, others: higher |
| **Conversion** | Conv Desktop/Mobile, Cart Abandon, AOV | Cart: lower, others: higher |
| **Channel Mix** | Email %, SMS % | Higher is better |
| **Retention** | Repeat Rate, Purchase Freq, Churn | Churn: lower, others: higher |
| **Economics** | Return Rate, Gross Margin | Return: lower, Margin: higher |

### Traffic Lights Logic

```typescript
// utils/benchmarkUtils.ts
getBenchmarkStatus(value, benchmark, metricId) → 'good' | 'average' | 'poor' | 'unknown'

// Higher is Better (ROAS, LTV, etc.)
- value > high → 'good' (green)
- median ≤ value ≤ high → 'average' (yellow)
- value < median → 'poor' (red)

// Lower is Better (CAC, Churn, etc.)
- value < low → 'good' (green)
- low ≤ value ≤ median → 'average' (yellow)
- value > median → 'poor' (red)
```

---

## Integrations

### Dust.tt (AI Analysis)

**Configuration**:
```env
DUST_WORKSPACE_ID=xxx    # Brevo workspace
DUST_API_KEY=sk-xxx      # API Key (secret!)
DUST_ASSISTANT_ID=xxx    # Agent configured for retail analysis
```

**Endpoints used**:
1. `POST /w/{workspace}/assistant/conversations` (blocking: false)
2. `GET /w/{workspace}/assistant/conversations/{id}`

**Conversation response format**:
```json
{
  "conversation": {
    "sId": "conversationId",
    "content": [
      [{ "type": "user_message", "content": "..." }],
      [{ "type": "agent_message", "status": "succeeded", "content": "# Analysis..." }]
    ]
  }
}
```

**Agent statuses**: `created` → `running` → `succeeded` | `failed` | `cancelled`

### Netlify

**Netlify Free Constraints**:
- Serverless timeout: **10 seconds max**
- Background Functions: Not available
- Edge Functions: Not needed

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  timeout = 10  # Async pattern = fast responses
```

### Google Sheets (Benchmarks)

**Source sheet**: [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

**Workflow**:
```bash
# Sync from Google Sheets
npm run sync:benchmarks

# Generate TypeScript from local CSV
npm run generate:benchmarks
```

> **Never edit `data/benchmarks.ts` manually**

### Lead Capture (`@brevo/lead-capture`)

**Purpose**: Capture professional emails before users can access AI analysis features.

**Architecture**:
```tsx
// 1. Wrap app with provider
<LeadCaptureProvider config={{
  brevoListId: 123,
  language: 'fr',
  blockFreeEmails: true
}}>
  <App />
</LeadCaptureProvider>

// 2. Use hook to gate features
const { isUnlocked, showModal, capturedLead } = useLeadGate();

// 3. Trigger modal on user interaction
if (!isUnlocked) showModal();
```

**Key Features**:
- **Email Validation**: Blocks 100+ free email domains
- **Backup Strategy**: Failed submissions saved to localStorage, retried on next visit
- **Multi-Language**: EN, FR, DE, ES built-in translations
- **Theming**: Customizable colors, border radius, shadows

**LocalStorage Keys**:
| Key | Purpose |
|-----|---------|
| `brevo_kpi_lead` | Captured lead data (email, timestamp) |
| `brevo_lead_backup` | Failed submissions awaiting retry |

**API Integration**: Submits to Brevo API via `/api/leads` endpoint with contact creation.

---

## Constraints & Key Decisions

### Async Pattern Required (No Streaming)

| Approach | Netlify Free Compatible | Time |
|----------|------------------------|------|
| ~~Streaming SSE~~ | Timeout 10s | ~3min |
| **Async Polling** | Requests <5s | ~3min |

### Security

- No auth on `/api/analyze` (public asset)
- Rate limiting recommended (10 req/min/IP)
- Zod validation on inputs
- Secrets in Netlify environment variables

### Performance

- Components not memoized (React.memo missing)
- No lazy loading for v2/v3/v4 pages
- Bundle not optimized (~500KB)

---

## Testing & Debugging Protocol

### DO NOT create test/debug files at root

**Forbidden**:
- `test_*.txt`, `test_*.js` at root
- `debug_*.txt`, `debug_*.log` at root
- Temporary files without extension

### Use instead

#### 1. Unit tests (tests/)

```bash
tests/
├── benchmarkUtils.test.ts        # Business logic tests
├── components/
│   └── BenchmarkGrid.test.tsx    # Component tests
└── api/
    └── analyze.test.ts           # API route tests
```

**Commands**:
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --ui      # Vitest UI
npm test -- --coverage
```

#### 2. E2E Tests (Playwright)

```bash
npx playwright test           # Run E2E
npx playwright test --ui      # UI mode
npx playwright test --debug   # Debug mode
```

#### 3. Production Testing with MCP (Playwright preferred)

**When to use**: Testing features directly on production (https://brevo-kpi-benchmark.netlify.app/)

**Recommended**: Use Playwright MCP tools (consistent with project E2E tests). Puppeteer is available as fallback.

**Playwright MCP Setup** (one-time):
```bash
# The MCP uses chromium-1179. If missing, copy from nearest version:
cp -r "$LOCALAPPDATA/ms-playwright/chromium-1181" "$LOCALAPPDATA/ms-playwright/chromium-1179"
```

**Available MCP tools** (Claude Code):
```
# Playwright (preferred)
mcp__playwright__playwright_navigate    - Navigate to URL
mcp__playwright__playwright_screenshot  - Take screenshot
mcp__playwright__playwright_click       - Click elements
mcp__playwright__playwright_fill        - Fill form inputs
mcp__playwright__playwright_select      - Select dropdown values
mcp__playwright__playwright_evaluate    - Run JavaScript
mcp__playwright__playwright_close       - Close browser

# Puppeteer (fallback if Playwright browsers not installed)
mcp__puppeteer__puppeteer_navigate
mcp__puppeteer__puppeteer_screenshot
mcp__puppeteer__puppeteer_click
mcp__puppeteer__puppeteer_fill
mcp__puppeteer__puppeteer_select
mcp__puppeteer__puppeteer_evaluate
```

**Quick test with `?force=true`**:
```
# Reset lead capture state and test popup
https://brevo-kpi-benchmark.netlify.app/?force=true

# Combine with other params
https://brevo-kpi-benchmark.netlify.app/?force=true&industry=Beauty
```

**Example workflow** (testing lead capture popup):
```
1. Navigate to: https://brevo-kpi-benchmark.netlify.app/?force=true
2. Change industry dropdown
3. Take screenshot to verify popup appears
4. Submit form and verify success
```

**Common debugging scenarios**:
- **Feature not working locally but works in prod**: Check localStorage/sessionStorage state
- **Popup not appearing**: Add `?force=true` to URL or verify storage key is not set
- **Visual regression**: Take screenshots before/after changes

**LocalStorage keys used by this app**:
| Key | Purpose | Reset method |
|-----|---------|--------------|
| `brevo_kpi_lead` | Lead capture gate | `?force=true` URL param or `localStorage.removeItem('brevo_kpi_lead')` |
| `brevo_lead_backup` | Failed lead submissions awaiting retry | `localStorage.removeItem('brevo_lead_backup')` |

#### 4. Temporary test scripts (.dev-tests/)

**For API tests or ad-hoc debugging**:

```bash
.dev-tests/
├── test-dust-api.js          # Dust integration test
├── test-async-api.js         # Polling pattern test
└── output/                   # Test outputs (gitignored)
```

```bash
node .dev-tests/test-dust-api.js
```

**Note**: `.dev-tests/` is in `.gitignore`

### Recommended test workflow

```bash
# 1. Create unit test
touch tests/new-feature.test.ts

# 2. Implement
# utils/new-feature.ts

# 3. Test
npm test

# 4. Commit
git add tests/ utils/
git commit -m "feat: Add new feature with tests"
```

### Testing Lead Capture Feature

The lead capture popup uses localStorage to track if a user has already provided their email.

**Easiest way to test** (recommended):
```
# Just add ?force=true to any URL
http://localhost:3000/?force=true
https://brevo-kpi-benchmark.netlify.app/?force=true
```

This automatically clears localStorage and removes the param from URL (clean state).

**Alternative - DevTools console**:
```javascript
localStorage.removeItem('brevo_kpi_lead');
location.reload();
```

**Popup trigger conditions** (see `app/page.tsx:77-110`):
1. User changes industry selector AND
2. `isUnlocked` is `false` (localStorage key not set) AND
3. `hasInteracted` is `false` (first interaction in session)

**Implementation**: `lib/lead-capture/LeadCaptureProvider.tsx:31-43`

---

## Conventions

### Commits

Format: `<type>(<scope>): <message>`

```bash
feat(v4): Add async polling for Dust analysis
fix(api): Handle timeout gracefully
docs(claude): Update architecture documentation
test(utils): Add getBenchmarkStatus edge cases
chore(deps): Update Next.js to 16.0.4
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

### DO NOT edit benchmarks.ts manually
```bash
# BAD
vim data/benchmarks.ts

# GOOD
npm run generate:benchmarks
```

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
const apiKey = process.env.DUST_API_KEY;
```

### DO NOT create temporary files at root
```bash
# BAD
touch test_output.txt

# GOOD
mkdir -p .dev-tests/output
touch .dev-tests/output/result.txt
```

---

## Resources

### Project Documentation
- [docs/SYNC.md](docs/SYNC.md) - Google Sheets synchronization
- [docs/BENCHMARKS.md](docs/BENCHMARKS.md) - Data structure
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Developer guide
- [docs/AUDIT.md](docs/AUDIT.md) - Technical audit

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Dust.tt API](https://docs.dust.tt/reference/developer-platform-overview)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

## Decision History

| Date | Decision | Reason |
|------|----------|--------|
| Dec 2025 | `@brevo/lead-capture` package | Reusable module for future marketing assets |
| Dec 2025 | 100+ blocked email domains | Comprehensive free email filtering |
| Dec 2025 | Lead backup/retry strategy | Handle API failures gracefully |
| Dec 2025 | E2E tests with localStorage bypass | Avoid lead modal blocking tests |
| Nov 2025 | Streaming → Async polling migration | Netlify Free 10s timeout |
| Nov 2025 | Dust.tt integration | AI analysis for v4 |
| Nov 2025 | Heartbeat approach (abandoned) | Timeout incompatible |
| Nov 2025 | Expanded to 12 industries | B2B market coverage |
| Nov 2025 | Collapsible UI sections | Reduce cognitive load |
| Nov 2025 | "Why this metric?" toggles | Educational UX improvement |

---

## Test Coverage Summary

| Category | Tests | File |
|----------|-------|------|
| Email Validation | 45 | `packages/lead-capture/tests/validation.test.ts` |
| Benchmark Utils | 15 | `tests/benchmarkUtils.test.ts` |
| Lead Capture API | 18 | `packages/lead-capture/tests/api.test.ts` |
| E2E Smoke Tests | 9 | `tests/full-user-journey.spec.ts` |
| AI Integration | 1 | `tests/dust-integration.spec.ts` |

**Total**: 88 unit tests + 10 E2E tests

Run all tests:
```bash
npm test              # Unit tests (Vitest)
npx playwright test   # E2E tests (Playwright)
```
