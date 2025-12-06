# Marketing Plan Generator - Refactoring Plan

## Executive Summary

Transform the Brevo KPI Benchmark project into a **Marketing Relationship Plan Generator** while preserving the technical architecture (Next.js, TypeScript, Tailwind, LanguageContext, lead-capture).

---

## 1. Current State Analysis

### KPI Benchmark (to remove/refactor)

| File/Component | Action | Reason |
|----------------|--------|--------|
| `app/page.tsx` | **REPLACE** | New Marketing Plan page |
| `app/v2/`, `app/v3/`, `app/v4/` | **DELETE** | KPI-specific versions |
| `app/api/analyze/` | **KEEP PATTERN, NEW ROUTE** | Same async pattern, new endpoint |
| `components/BenchmarkGrid.tsx` | **DELETE** | KPI-specific |
| `components/AiAnalysisResult.tsx` | **DELETE** | KPI-specific markdown display |
| `components/SidebarInputs.tsx` | **REFACTOR** | Keep pattern, new fields |
| `components/IntroBlock.tsx` | **REFACTOR** | Keep pattern, new content |
| `components/Header.tsx` | **KEEP** | Rebrand messaging only |
| `components/LanguageSelector.tsx` | **KEEP** | Works as-is |
| `components/Contributors.tsx` | **KEEP/MODIFY** | Update content |
| `components/Providers.tsx` | **KEEP** | Works as-is |
| `contexts/LanguageContext.tsx` | **KEEP** | Works perfectly |
| `data/benchmarks.ts` | **DELETE** | KPI data |
| `utils/benchmarkUtils.ts` | **DELETE** | KPI logic |
| `config/industries.ts` | **REFACTOR** | Different industry list |

### Legacy Marketing Plan (to migrate)

| Source File | Target Location | Priority |
|-------------|-----------------|----------|
| `types.ts` | `src/types/marketing-plan.ts` | P0 |
| `parsePlanData.ts` | `src/utils/marketing-plan-parser.ts` | P0 |
| `marketingPlanService.ts` | `src/lib/marketing-plan-db.ts` | P0 |
| `PlanHeader.tsx` | `components/marketing-plan/PlanHeader.tsx` | P1 |
| `CompanySummary.tsx` | `components/marketing-plan/CompanySummary.tsx` | P1 |
| `MarketingPrograms.tsx` | `components/marketing-plan/MarketingPrograms.tsx` | P1 |
| `ProgramDetails.tsx` | `components/marketing-plan/ProgramDetails.tsx` | P1 |
| `BrevoHelp.tsx` | `components/marketing-plan/BrevoHelp.tsx` | P1 |
| `BrevoCallToAction.tsx` | `components/marketing-plan/BrevoCallToAction.tsx` | P1 |
| `pollingUtils.ts` | `src/utils/polling.ts` | P1 |
| `retryUtils.ts` | `src/utils/retry.ts` | P2 |
| `languageDetection.ts` | **SKIP** | Use existing LanguageContext |

---

## 2. New Architecture

### Folder Structure

```
app/
├── layout.tsx                    # KEEP - Minimal changes
├── page.tsx                      # NEW - Marketing Plan main page
├── globals.css                   # KEEP - Add new styles
├── api/
│   ├── lead/route.ts             # KEEP - Works as-is
│   └── marketing-plan/
│       ├── route.ts              # NEW - POST create plan
│       ├── [conversationId]/
│       │   └── route.ts          # NEW - GET poll status
│       └── lookup/
│           └── route.ts          # NEW - GET lookup by domain

components/
├── Header.tsx                    # KEEP - Update branding
├── LanguageSelector.tsx          # KEEP
├── Providers.tsx                 # KEEP
├── Contributors.tsx              # KEEP/MODIFY
├── MarketingPlanSidebar.tsx      # NEW - Industry + Domain + Generate
├── IntroBlock.tsx                # REFACTOR - New content
└── marketing-plan/
    ├── index.ts                  # NEW - Re-exports
    ├── PlanHeader.tsx            # MIGRATE
    ├── CompanySummary.tsx        # MIGRATE
    ├── MarketingPrograms.tsx     # MIGRATE
    ├── ProgramDetails.tsx        # MIGRATE
    ├── BrevoHelp.tsx             # MIGRATE
    ├── BrevoCallToAction.tsx     # MIGRATE
    ├── StaticPlanBadge.tsx       # NEW - "Template" vs "Personalized" badge
    └── PlanLoadingState.tsx      # NEW - Skeleton + progress messages

config/
├── branding.ts                   # KEEP - Minor updates
├── industries.ts                 # REFACTOR - New industry list
├── api.ts                        # KEEP
└── index.ts                      # KEEP

contexts/
└── LanguageContext.tsx           # KEEP

data/
└── static-marketing-plans/
    ├── index.ts                  # NEW - Loader function
    ├── saas.en.json              # NEW - Static plan
    ├── saas.fr.json              # NEW - Static plan
    ├── ecommerce.en.json         # NEW - Static plan
    └── ... (12 industries × 4 languages)

i18n/
├── index.ts                      # REFACTOR - New keys
├── en.json                       # REFACTOR - New strings
├── fr.json                       # REFACTOR - New strings
├── de.json                       # REFACTOR - New strings
└── es.json                       # REFACTOR - New strings

lib/
├── lead-capture/                 # KEEP
│   └── index.ts
└── marketing-plan/
    ├── db.ts                     # NEW - Supabase integration
    ├── normalize.ts              # NEW - Domain normalization
    └── types.ts                  # NEW - Type exports

src/
├── types/
│   └── marketing-plan.ts         # NEW - Type definitions
└── utils/
    ├── marketing-plan-parser.ts  # NEW - Parse/validate AI response
    └── polling.ts                # NEW - Polling utilities

tests/
├── marketing-plan-parser.test.ts # NEW
├── domain-normalize.test.ts      # NEW
└── full-user-journey.spec.ts     # REFACTOR - New E2E tests
```

---

## 3. Data Model

### Industry Enum (New)

```typescript
// config/industries.ts
export type Industry =
  // B2C Retail
  | 'Fashion'
  | 'Beauty'
  | 'Home'
  | 'Electronics'
  | 'Food'
  | 'Sports'
  | 'Luxury'
  | 'Family'
  // B2B
  | 'SaaS'
  | 'Services'
  | 'Manufacturing'
  | 'Wholesale';

export const INDUSTRIES: Industry[] = [...];
export const B2C_INDUSTRIES: Industry[] = [...];
export const B2B_INDUSTRIES: Industry[] = [...];
```

### MarketingPlan Types (Migrated)

```typescript
// src/types/marketing-plan.ts
export interface CompanySummary {
  name: string;
  website: string;
  activities?: string;
  target?: string;
  industry?: string;           // Mapped for backward compat
  target_audience?: string;    // Mapped for backward compat
  nb_employees?: string;
  business_model?: string;
  customer_lifecycle_key_steps?: string;
}

export interface ScenarioMessage {
  title?: string;
  description?: string;
  content?: string;
  [key: string]: unknown;
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
  [key: string]: unknown;
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
  [key: string]: unknown;
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

---

## 4. API Design

### POST `/api/marketing-plan`

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
  "conversationId": "abc123"
}
```

### GET `/api/marketing-plan/[conversationId]`

**Response (processing):**
```json
{
  "status": "processing"
}
```

**Response (complete):**
```json
{
  "status": "complete",
  "source": "ai",
  "plan": { /* MarketingPlan */ }
}
```

**Response (error):**
```json
{
  "status": "error",
  "error": "Failed to analyze domain"
}
```

### GET `/api/marketing-plan/lookup?domain=acme.com&language=en`

**Response:**
```json
{
  "found": true,
  "plan": { /* MarketingPlan */ }
}
```

or

```json
{
  "found": false
}
```

---

## 5. URL Behavior Specification

| URL Params | Behavior |
|------------|----------|
| `?industry=SaaS` | Load static plan for SaaS (no lead-capture) |
| `?industry=SaaS&domain=acme.com` | Lookup personalized plan in DB |
| `?industry=SaaS&domain=acme.com` (found) | Display personalized plan (no lead-capture) |
| `?industry=SaaS&domain=acme.com` (not found) | Show message: "No saved plan. Generate your plan." |
| `?force=true` | Internal: force regeneration (still requires lead-capture) |
| `?lang=fr` | Set language via URL |

---

## 6. Lead-Capture Rules

### When NOT to show lead-capture:
- Selecting an industry (browsing static plans)
- Loading a page with existing personalized plan from DB
- Switching languages

### When TO show lead-capture:
- User clicks "Generate my plan" button
- User has entered a domain (non-empty input)
- This is triggered ONLY via `requireLead()` with:
  - `reason: 'generate_marketing_plan'`
  - `context: { industry, domain, language }`

---

## 7. Implementation Steps

### Phase 1: Foundation (Types & Utils)

1. **Create types** (`src/types/marketing-plan.ts`)
   - Port all interfaces from legacy
   - Add JSDoc comments

2. **Create parser** (`src/utils/marketing-plan-parser.ts`)
   - Port `parsePlanData` and `validatePlanData`
   - Adapt to TypeScript strict mode
   - Add unit tests

3. **Create domain normalizer** (`lib/marketing-plan/normalize.ts`)
   - Port `normalizeDomain` function
   - Add unit tests

4. **Create DB helper** (`lib/marketing-plan/db.ts`)
   - Port Supabase integration
   - Add `getByDomain`, `save`, `update` functions
   - Use existing Supabase client pattern

### Phase 2: Static Plans

5. **Create industry config** (`config/industries.ts`)
   - Define Industry type
   - Define arrays for B2C and B2B

6. **Create static plan structure** (`data/static-marketing-plans/`)
   - Create folder
   - Create one sample plan (saas.en.json)
   - Create loader function

7. **Create remaining static plans**
   - 12 industries × 4 languages = 48 files (can start with EN only = 12 files)

### Phase 3: UI Components

8. **Create MarketingPlanSidebar** (`components/MarketingPlanSidebar.tsx`)
   - Industry dropdown (B2C/B2B optgroups)
   - Domain text input
   - "Generate my plan" button
   - Follows SidebarInputs pattern

9. **Migrate PlanHeader** (`components/marketing-plan/PlanHeader.tsx`)
   - Adapt styling to match KPI Benchmark
   - Keep share/export functionality

10. **Migrate CompanySummary** (`components/marketing-plan/CompanySummary.tsx`)
    - Adapt styling
    - Use Tailwind classes from current project

11. **Migrate MarketingPrograms** (`components/marketing-plan/MarketingPrograms.tsx`)
    - Adapt table styling

12. **Migrate ProgramDetails** (`components/marketing-plan/ProgramDetails.tsx`)
    - Adapt accordion/collapsible styling

13. **Migrate BrevoHelp** (`components/marketing-plan/BrevoHelp.tsx`)
    - Adapt card styling

14. **Migrate BrevoCallToAction** (`components/marketing-plan/BrevoCallToAction.tsx`)
    - Match current CTA styling

15. **Create PlanLoadingState** (`components/marketing-plan/PlanLoadingState.tsx`)
    - Skeleton components
    - Progress messages

16. **Create StaticPlanBadge** (`components/marketing-plan/StaticPlanBadge.tsx`)
    - "Template" vs "Personalized for domain.com" badge

### Phase 4: API Routes

17. **Create POST `/api/marketing-plan`**
    - Validate input with Zod
    - Check DB for existing plan
    - Call AI Gateway if needed
    - Return conversationId or plan

18. **Create GET `/api/marketing-plan/[conversationId]`**
    - Poll AI Gateway
    - Parse response
    - Save to Supabase on completion
    - Return status and plan

19. **Create GET `/api/marketing-plan/lookup`**
    - Simple DB lookup by domain + language

### Phase 5: Main Page

20. **Refactor IntroBlock** (`components/IntroBlock.tsx`)
    - Update content for Marketing Plan context
    - Keep visual structure

21. **Create new main page** (`app/page.tsx`)
    - 2-column layout
    - Sidebar with industry/domain
    - Main area with intro/static plan/personalized plan
    - Lead-capture gating logic
    - Async polling for AI generation
    - URL parameter handling

### Phase 6: i18n

22. **Update translation files**
    - Add marketing-plan specific keys
    - Keep existing structure

### Phase 7: Cleanup

23. **Delete KPI-specific files**
    - Remove `app/v2/`, `app/v3/`, `app/v4/`
    - Remove `app/api/analyze/`
    - Remove `components/BenchmarkGrid.tsx`
    - Remove `components/AiAnalysisResult.tsx`
    - Remove `data/benchmarks.ts`, `data/benchmarks.csv`
    - Remove `utils/benchmarkUtils.ts`
    - Remove `scripts/generate-benchmarks.js`, `scripts/sync-from-gsheet.js`

24. **Update CLAUDE.md**
    - Replace KPI documentation with Marketing Plan documentation

### Phase 8: Testing

25. **Unit tests**
    - Parser tests
    - Normalizer tests
    - DB helper tests

26. **E2E tests**
    - Static plan loading
    - Lead-capture trigger
    - AI plan generation
    - URL parameter handling

---

## 8. Supabase Schema

```sql
-- marketing_plans table (verify/create)
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

## 9. Environment Variables

### Required (Existing)
```env
# AI Gateway (same as current)
AI_GATEWAY_URL=https://ai-gateway.example.com
AI_GATEWAY_API_KEY=sk-xxx

# Lead Hub (same as current)
LEAD_HUB_URL=https://brevo-lead-hub.netlify.app/api/capture
LEAD_HUB_API_KEY=xxx
```

### Required (New)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI response format changes | Robust parsing with multiple path options |
| Supabase connection issues | Graceful fallback to static plans |
| Lead-capture package updates | Pin version, test before updates |
| Large static plan files | Lazy loading, dynamic imports |
| AI timeout | Async polling pattern (already proven) |
| Multiple languages missing | English fallback for all |

---

## 11. Success Criteria

- [ ] User can browse static plans by industry without providing email
- [ ] User can generate personalized plan (requires email)
- [ ] Personalized plans are persisted in Supabase
- [ ] Saved plans load instantly on revisit (no re-generation)
- [ ] URL sharing works for personalized plans
- [ ] All 4 languages work (EN, FR, DE, ES)
- [ ] Mobile responsive
- [ ] Build passes on Netlify
- [ ] E2E tests pass

---

## 12. Estimated Effort

| Phase | Files | Complexity |
|-------|-------|------------|
| Phase 1: Foundation | 4 | Medium |
| Phase 2: Static Plans | 14 | Low |
| Phase 3: UI Components | 8 | Medium |
| Phase 4: API Routes | 3 | Medium |
| Phase 5: Main Page | 2 | High |
| Phase 6: i18n | 4 | Low |
| Phase 7: Cleanup | 10+ | Low |
| Phase 8: Testing | 4 | Medium |

**Total: ~50 files to create/modify/delete**

---

## Appendix: Key Decisions Made

1. **No new versioned routes** - Single `/` route instead of `/marketing-plan` to keep it simple
2. **Reuse existing lead-capture package** - No changes needed to the package
3. **Static plans as JSON files** - Simple, no CMS needed
4. **Supabase over localStorage** - Persistence across devices, shareable URLs
5. **Same AI Gateway** - Reuse existing infrastructure
6. **Keep LanguageContext** - Works well, no changes needed
7. **English fallback** - For missing translations in static plans
