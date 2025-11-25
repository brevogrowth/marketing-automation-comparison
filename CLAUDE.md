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

data/
├── benchmarks.csv                # Source of truth (sync Google Sheets)
├── benchmarks.ts                 # AUTO-GENERATED - do not edit
└── metricExplanations.ts         # "Why this metric?" content

utils/
└── benchmarkUtils.ts             # Traffic lights & scoring logic

scripts/
├── generate-benchmarks.js        # CSV → TypeScript
└── sync-from-gsheet.js           # Google Sheets → CSV

tests/
├── benchmarkUtils.test.ts        # Unit tests for business logic
└── dust-integration.spec.ts      # E2E Playwright tests

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

#### 3. Temporary test scripts (.dev-tests/)

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
| Nov 2025 | Streaming → Async polling migration | Netlify Free 10s timeout |
| Nov 2025 | Dust.tt integration | AI analysis for v4 |
| Nov 2025 | Heartbeat approach (abandoned) | Timeout incompatible |
| Nov 2025 | Expanded to 12 industries | B2B market coverage |
| Nov 2025 | Collapsible UI sections | Reduce cognitive load |
| Nov 2025 | "Why this metric?" toggles | Educational UX improvement |
