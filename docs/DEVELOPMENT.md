# 🛠️ Guide de Développement

Guide pour contribuer et développer sur le projet Brevo KPI Benchmark.

## 🚀 Setup

```bash
# Clone
git clone <repo-url>
cd brevo-kpi-benchmark

# Installation
npm install

# Environnement
cp .env.example .env
# Éditer .env et ajouter DUST_API_KEY

# Développement
npm run dev
```

## 📂 Architecture

### Structure des dossiers

```
app/
├── v2/page.tsx         # Grille interactive
├── v3/page.tsx         # Analyse comparative
├── v4/page.tsx         # Analyse AI
├── api/analyze/route.ts # Endpoint AI
├── layout.tsx          # Layout global
└── globals.css         # Styles globaux

components/
├── BenchmarkGrid.tsx      # Grille avec traffic lights
├── AiAnalysisResult.tsx   # Affichage résultat AI
└── SidebarInputs.tsx      # Inputs utilisateur

data/
├── benchmarks.csv          # Source (sync Google Sheets)
└── retailBenchmarks.ts     # Auto-généré

utils/
└── benchmarkUtils.ts       # Logique métier

tests/
└── benchmarkUtils.test.ts  # Tests unitaires

scripts/
├── generate-benchmarks.js  # CSV → TypeScript
└── sync-from-gsheet.js     # Google Sheets → CSV
```

### Logique métier (utils/benchmarkUtils.ts)

#### `getBenchmarkStatus(value, benchmark, metricId)`

Retourne le statut d'une métrique :
- `'good'` : Vert
- `'average'` : Jaune
- `'poor'` : Rouge
- `'unknown'` : Gris

**Métriques "Higher is Better"** : roas, ltv_cac, mer, conv_rate, mobile_conv, aov, repeat_rate, purchase_freq, email_rev_share, sms_rev_share, gross_margin

**Métriques "Lower is Better"** : cac, marketing_spend, cart_abandon, return_rate, churn_rate

#### `getHumorousMessage(level, metricId)`

Retourne un message humoristique selon le niveau (0-4).

#### `calculateDetailedScore(userValues, benchmarks, priceTier)`

Calcule le score global (0-100) avec détails par catégorie.

## 🧪 Tests

### Installation

```bash
npm install -D vitest @vitest/ui
```

### Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Exécution

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui

# Coverage
npm test -- --coverage
```

### Tests existants (tests/benchmarkUtils.test.ts)

```typescript
describe('getBenchmarkStatus', () => {
  // Higher is Better (ROAS)
  test('value > high = good', ...)
  test('median ≤ value ≤ high = average', ...)
  test('value < median = poor', ...)

  // Lower is Better (CAC)
  test('value < low = good', ...)
  test('low ≤ value ≤ median = average', ...)
  test('value > median = poor', ...)

  // Edge cases
  test('empty string = unknown', ...)
  test('non-numeric = unknown', ...)
});

describe('getHumorousMessage', () => {
  test('returns string for levels 0-4', ...)
  test('deterministic (same input = same output)', ...)
});
```

## 🛡️ Validation

### Installation Zod

```bash
npm install zod
```

### API Route (app/api/analyze/route.ts)

```typescript
import { z } from 'zod';

const AnalysisSchema = z.object({
  userValues: z.record(z.string()),
  priceTier: z.enum(['Budget', 'Mid-Range', 'Luxury']),
  industry: z.enum(['Fashion', 'Home', 'Beauty', 'Electronics'])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userValues, priceTier, industry } = AnalysisSchema.parse(body);

    // ... rest of the code
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    // ... other errors
  }
}
```

## 🔄 Workflow de développement

### Feature branch

```bash
# Créer une branche
git checkout -b feat/nouvelle-fonctionnalite

# Développer et tester
npm test
npm run build

# Commit
git add .
git commit -m "feat: Ajouter nouvelle fonctionnalité"

# Push
git push origin feat/nouvelle-fonctionnalite

# Créer une PR sur GitHub
```

### Hotfix

```bash
git checkout -b fix/bug-urgent
# Fix
git commit -m "fix: Corriger bug urgent"
git push origin fix/bug-urgent
```

## 📝 Conventions

### Commits

Format : `<type>(<scope>): <message>`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

Exemples :
```bash
feat(v4): Add AI analysis with Dust.tt
fix(benchmarks): Correct CAC validation
docs(sync): Update Google Sheets guide
test(utils): Add getBenchmarkStatus tests
chore(deps): Update Next.js to 16.0.3
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier (config Next.js)
- Composants fonctionnels avec hooks
- Props typées avec TypeScript

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Variables d'environnement

```
DUST_API_KEY=your_dust_api_key
```

Configurer dans Vercel → Settings → Environment Variables

## 🆘 Dépannage

### Build échoue

```bash
# Clean cache
rm -rf .next node_modules
npm install
npm run build
```

### Tests échouent

```bash
# Re-générer les benchmarks
npm run generate:benchmarks

# Vérifier les types
npx tsc --noEmit
```

### Sync Google Sheets échoue

Voir [docs/SYNC.md](SYNC.md) section "Dépannage"

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest](https://vitest.dev)
- [Zod](https://zod.dev)
