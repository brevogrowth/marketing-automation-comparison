# Brevo KPI Benchmark

A strategic marketing asset for Brevo's mid-market prospecting. This interactive benchmarking tool helps B2C and B2B businesses compare their marketing KPIs against industry standards and receive AI-powered recommendations.

**Live Demo:** [brevo-kpi-benchmark.netlify.app](https://brevo-kpi-benchmark.netlify.app)

## Features

- **12 Industries Supported** - B2C (Fashion, Beauty, Home, Electronics, Food, Sports, Luxury, Family) and B2B (SaaS, Services, Manufacturing, Wholesale)
- **3 Price Tiers** - Budget, Mid-Range, and Luxury segments with tailored benchmarks
- **Traffic Light System** - Instant visual feedback (green/yellow/red) on your performance
- **AI-Powered Analysis** - Personalized strategic recommendations via Dust.tt
- **Collapsible UI** - Clean interface with expandable sections and "Why this metric?" explanations
- **Research-Backed Data** - Benchmarks sourced from industry reports and real data

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/brevogrowth/brevo-kpi-benchmark.git
cd brevo-kpi-benchmark

# Install dependencies
npm install

# Configure environment variables (required for AI analysis)
cp .env.example .env.local
# Edit .env.local with your Dust.tt credentials
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

## Application Versions

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Static landing page | Legacy |
| `/v2` | Interactive grid with traffic lights | Stable |
| `/v3` | Detailed comparative analysis | Stable |
| `/v4` | **AI-powered analysis via Dust.tt** | Active |

## Project Structure

```
app/
├── v2/              # Interactive benchmark grid
├── v3/              # Comparative analysis
├── v4/              # AI analysis (main version)
└── api/analyze/     # Dust.tt AI endpoint

components/
├── BenchmarkGrid.tsx       # KPI grid with collapsible sections
├── AiAnalysisResult.tsx    # Markdown rendering for AI output
└── SidebarInputs.tsx       # Industry/price tier selector

data/
├── benchmarks.csv          # Source of truth (synced from Google Sheets)
└── benchmarks.ts           # Auto-generated TypeScript (DO NOT EDIT)

utils/
└── benchmarkUtils.ts       # Traffic light logic & scoring

scripts/
├── generate-benchmarks.js  # CSV → TypeScript generator
└── sync-from-gsheet.js     # Google Sheets → CSV sync
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Dust.tt API | v1 |
| Validation | Zod | 3.x |
| Testing | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify | Free tier |

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

## Environment Variables

Create a `.env.local` file for the AI analysis feature (v4):

```bash
# Dust.tt Configuration (required for v4)
DUST_WORKSPACE_ID=your_workspace_id
DUST_API_KEY=your_api_key
DUST_ASSISTANT_ID=your_assistant_id
```

> **Security:** Never commit `.env.local` with real credentials.

## Testing

```bash
# Unit tests (Vitest)
npm test
npm test -- --coverage
npm test -- --watch

# E2E tests (Playwright)
npx playwright test
npx playwright test --ui
npx playwright test --debug
```

## Documentation

| File | Description |
|------|-------------|
| [CLAUDE.md](CLAUDE.md) | Development guidelines for Claude Code |
| [docs/SYNC.md](docs/SYNC.md) | Google Sheets synchronization guide |
| [docs/BENCHMARKS.md](docs/BENCHMARKS.md) | Benchmark data structure |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Developer guide |
| [docs/AUDIT.md](docs/AUDIT.md) | Technical audit & roadmap |

## Architecture Highlights

### Async Polling Pattern

Due to Netlify Free tier's 10-second timeout constraint, AI analysis uses an async polling pattern instead of streaming:

1. **POST /api/analyze** - Creates a Dust.tt conversation (returns in ~2s)
2. **GET /api/analyze/[id]** - Polls for completion (every 5s for up to 5 min)

This enables AI-powered analysis that takes 2-3 minutes without hitting serverless timeouts.

### UX Improvements (Latest)

- **Collapsible Sections** - Category headers are closed by default to reduce cognitive load
- **"Why this metric?"** - Each KPI has an expandable explanation with definition, importance, and best practices
- **Animated Transitions** - Smooth chevron animations and content reveals

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Follow the conventions in [CLAUDE.md](CLAUDE.md).

## License

Brevo Internal Project - All rights reserved.
