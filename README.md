# Brevo Marketing Relationship Plan Generator

<div align="center">

![Brevo Logo](https://www.brevo.com/wp-content/uploads/2023/07/cropped-brevo-logo-new.png)

**AI-powered marketing relationship plans for mid-market companies**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://brevo-marketing-relationship-plan.netlify.app)
[![Netlify Status](https://api.netlify.com/api/v1/badges/brevo-marketing-relationship-plan/deploy-status)](https://app.netlify.com/sites/brevo-marketing-relationship-plan/deploys)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)

[Live Demo](https://brevo-marketing-relationship-plan.netlify.app) | [Documentation](#documentation) | [Quick Start](#quick-start)

</div>

---

## Overview

The **Brevo Marketing Relationship Plan Generator** is a strategic marketing asset that helps B2C retailers and B2B companies generate personalized marketing relationship plans powered by AI.

### Value Proposition

> *"Get your personalized AI-powered marketing relationship plan in minutes. Discover programs, scenarios, and strategies tailored to your business."*

### Two-Level Access Model

| Level | Access | Features |
|-------|--------|----------|
| **Level 1** | Free (no email) | Static industry template plans for 12 industries |
| **Level 2** | Email required | AI-generated personalized plan based on company website |

---

## Features

| Feature | Description |
|---------|-------------|
| **12 Industry Templates** | Pre-built marketing plans for B2C & B2B industries |
| **AI Personalization** | Domain-specific analysis via Dust.tt AI |
| **4 Languages** | Full support for EN, FR, DE, ES |
| **Lead Capture** | Professional email validation (blocks 100+ free domains) |
| **Plan Persistence** | Supabase storage for shareable URLs |
| **Direct URL Access** | Navigate to `/acme.com` to view/generate plans |

---

## URL Parameters

### Supported Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `?lang=` | `?lang=fr` | Force specific language (en, fr, de, es) |
| `?industry=` | `?industry=SaaS` | Pre-select industry |
| `?domain=` | `?domain=acme.com` | Pre-fill domain input (main page only) |
| `?force=true` | `?force=true` | Force regeneration even if plan exists |

### URL Patterns

```
# Main page with industry
https://brevo-marketing-relationship-plan.netlify.app/?industry=Fashion

# Direct domain access (auto-loads from DB or triggers generation)
https://brevo-marketing-relationship-plan.netlify.app/acme.com

# Force regeneration with French language
https://brevo-marketing-relationship-plan.netlify.app/acme.com?force=true&lang=fr

# Main page with domain pre-filled
https://brevo-marketing-relationship-plan.netlify.app/?domain=acme.com&industry=SaaS
```

### Auto-Generation Behavior

When navigating to `/acme.com`:

1. **Plan exists in DB** → Displays immediately
2. **Plan doesn't exist** → Triggers lead-capture modal, then generates AI plan
3. **With `?force=true`** → Skips DB lookup, triggers regeneration

---

## Industries Covered

### B2C Retail (8 industries)

| Industry | Description | Key Focus |
|----------|-------------|-----------|
| **Fashion** | Apparel, accessories | Seasonal campaigns, loyalty |
| **Beauty** | Cosmetics, skincare | Personalization, replenishment |
| **Home** | Furniture, decor | High-value nurturing |
| **Electronics** | Consumer electronics | Research phase, reviews |
| **Food** | Food & beverage | Subscription, replenishment |
| **Sports** | Sporting goods | Seasonal, community |
| **Luxury** | Premium goods | VIP experience |
| **Family** | Baby, kids products | Lifecycle marketing |

### B2B Services (4 industries)

| Industry | Description | Key Focus |
|----------|-------------|-----------|
| **SaaS** | Software as a Service | Onboarding, activation |
| **Services** | Professional services | Lead qualification |
| **Manufacturing** | Industrial goods | Account management |
| **Wholesale** | Bulk distribution | Reorder automation |

---

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- GitHub Personal Access Token (for `@brevogrowth/lead-capture`)
- AI Gateway API Key (contact team)
- Supabase Project

### Installation

```bash
# Clone the repository
git clone https://github.com/brevogrowth/brevo-relationship-plan.git
cd brevo-relationship-plan

# Configure npm for GitHub Packages
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
npm run dev           # Start dev server
npm run build         # Production build
npm test              # Run unit tests (Vitest)
npm test -- --watch   # Watch mode
npx playwright test   # Run E2E tests
```

---

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `AI_GATEWAY_URL` | AI Gateway base URL |
| `AI_GATEWAY_API_KEY` | API key for AI Gateway |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key |
| `NPM_TOKEN` | GitHub PAT for packages |

### Optional

| Variable | Description |
|----------|-------------|
| `LEAD_HUB_URL` | Lead Hub API endpoint |
| `LEAD_HUB_API_KEY` | API key for Lead Hub |

---

## Architecture

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| AI | Brevo AI Gateway → Dust.tt | v1 |
| Database | Supabase (PostgreSQL) | - |
| Lead Capture | @brevogrowth/lead-capture | 1.x |
| Testing | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify | Free tier |

### Async Polling Pattern

Due to Netlify's 10-second timeout, AI generation uses async polling:

```
┌─────────────────┐                        ┌────────────────┐
│    Frontend     │  1. POST /api/         │  Next.js API   │
│                 │     marketing-plan     │                │
│                 │ ─────────────────────▶ │                │
│                 │ ◀─ conversationId ─────│                │
└────────┬────────┘                        └───────┬────────┘
         │                                         │
         │ 2. GET /api/marketing-plan/[id]         │ AI Gateway
         │    (polling every 5s)                   │ → Dust.tt
         │                                         ▼
         │◀─── status: pending ───────────┌───────────────┐
         │◀─── status: complete ──────────│   Dust.tt     │
         │     + plan content             │   (~3 min)    │
         ▼                                └───────────────┘
```

### Project Structure

```
brevo-relationship-plan/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Main page
│   ├── [domain]/page.tsx             # Dynamic domain route
│   ├── admin/page.tsx                # Admin dashboard
│   └── api/
│       ├── lead/route.ts             # Lead capture
│       ├── admin/plans/route.ts      # Admin API (list/delete)
│       ├── v1/marketing-plan/route.ts # External API
│       └── marketing-plan/
│           ├── route.ts              # Create plan
│           ├── lookup/route.ts       # Lookup by domain
│           └── [conversationId]/route.ts  # Poll status
├── components/
│   ├── marketing-plan/               # Plan display components
│   └── ...
├── contexts/
│   └── LanguageContext.tsx           # i18n provider
├── data/
│   └── static-marketing-plans/       # 48 static plan files
├── lib/
│   └── marketing-plan/
│       ├── db.ts                     # Supabase operations
│       └── normalize.ts              # Domain normalization
├── i18n/                             # Translation files
└── tests/                            # Unit & E2E tests
```

---

## Admin Interface

Access the admin dashboard at `/admin` (password: contact team).

### Features

| Feature | Description |
|---------|-------------|
| **Plans List** | View all generated plans with search, filter, delete |
| **API Docs** | Interactive documentation for external API |
| **Statistics** | Total plans, language distribution |

---

## External API

The external API allows programmatic creation of marketing plans.

### Authentication

All requests require an API key header:

```bash
x-api-key: YOUR_API_KEY
```

### POST `/api/v1/marketing-plan`

Create a marketing plan for a domain.

**Request:**
```json
{
  "domain": "acme.com",
  "language": "en",
  "industry": "SaaS",
  "force": false
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `domain` | Yes | Company website domain |
| `language` | No | `en` (default), `fr`, `de`, `es` |
| `industry` | No | Industry type (auto-detected if not provided) |
| `force` | No | Force regeneration (default: false) |

**Response (existing plan):**
```json
{
  "status": "complete",
  "message": "Existing plan found",
  "domain": "acme.com",
  "language": "en",
  "plan_url": "https://site/?domain=acme.com&lang=en",
  "plan": { /* MarketingPlan */ }
}
```

**Response (new generation):**
```json
{
  "status": "processing",
  "message": "Plan generation started. Poll the status URL to get results.",
  "job_id": "dust_abc123",
  "poll_url": "/api/marketing-plan/dust_abc123",
  "plan_url": "https://site/?domain=acme.com&lang=en",
  "estimated_time": "2-3 minutes"
}
```

**Example:**
```bash
curl -X POST https://brevo-marketing-relationship-plan.netlify.app/api/v1/marketing-plan \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"domain": "brevo.com", "language": "en"}'
```

---

## Internal API Reference

### POST `/api/marketing-plan`

Create or retrieve a marketing plan.

**Request:**
```json
{
  "industry": "SaaS",
  "domain": "acme.com",
  "language": "en",
  "force": false
}
```

**Response (existing plan):**
```json
{
  "status": "complete",
  "source": "db",
  "plan": { /* MarketingPlan */ }
}
```

**Response (new generation):**
```json
{
  "status": "created",
  "source": "ai",
  "conversationId": "dust_abc123"
}
```

### GET `/api/marketing-plan/[conversationId]`

Poll for generation status.

**Response:**
```json
{
  "status": "complete",  // or "pending" or "error"
  "plan": { /* MarketingPlan */ }
}
```

### GET `/api/marketing-plan/lookup?domain=acme.com`

Lookup existing plan by domain.

**Response:**
```json
{
  "found": true,
  "plan": { /* MarketingPlan */ }
}
```

---

## Testing

### Unit Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --ui      # Vitest UI
```

### E2E Tests

```bash
npx playwright test           # Run all E2E tests
npx playwright test --ui      # Interactive UI
npx playwright test --debug   # Debug mode
```

### Reset Lead Capture

```bash
# Add ?force=true to any URL to trigger fresh generation
# Or via DevTools:
localStorage.removeItem('brevo_kpi_lead');
location.reload();
```

---

## Deployment

The project deploys automatically on push to `master` via Netlify.

### Netlify Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NPM_CONFIG_@brevogrowth:registry = "https://npm.pkg.github.com"
```

### Database Schema

```sql
CREATE TABLE marketing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  form_data JSONB NOT NULL,
  user_language VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketing_plans_domain
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
docs(readme): Update documentation
```

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

---

## Related Projects

| Repository | Purpose |
|------------|---------|
| **brevo-ai-gateway** | Unified LLM API abstraction |
| **brevo-lead-hub** | Centralized lead processing |
| **lead-capture** | Reusable NPM package for lead capture UI |

---

## License

Brevo Internal Project - All rights reserved.

---

## Support

For questions or issues:
- Open a GitHub issue
- Contact the Brevo Growth team
