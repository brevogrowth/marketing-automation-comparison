# 🤖 Guide pour Claude Code

Ce fichier contient les directives pour Claude Code lors du développement sur ce projet.

---

## 🎯 Contexte Business

### Qu'est-ce que ce projet ?

**Brevo KPI Benchmark** est un **market asset stratégique** pour la prospection mid-market de Brevo. C'est un outil interactif permettant aux retailers B2C de comparer leurs KPIs marketing avec les benchmarks sectoriels et d'obtenir des recommandations personnalisées via IA.

### Objectifs stratégiques

1. **Lead Generation** : Attirer des prospects mid-market (Fashion, Home, etc.) en offrant de la valeur gratuite
2. **Qualification** : Les données saisies révèlent le niveau de maturité et les pain points du prospect
3. **Nurturing** : L'analyse AI positionne Brevo comme expert et suggère ses solutions (CRM, Email, SMS, Automation)
4. **Conversion** : CTAs vers essai gratuit Brevo et démos

### Audience cible

- **Profil** : Directeurs Marketing / Growth de retailers B2C
- **Taille** : Mid-market (10-500 employés, 1-50M€ CA)
- **Industries** : Fashion, Home & Living (Beauty et Electronics prévus)
- **Maturité** : Utilisent déjà email marketing, cherchent à optimiser

### Proposition de valeur

> "Comparez vos KPIs aux standards du marché et obtenez des recommandations AI personnalisées pour améliorer votre stratégie CRM et Automation."

---

## 🏗️ Architecture Technique

### Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React + Tailwind CSS | 19.x / 4.x |
| Language | TypeScript (strict) | 5.x |
| AI | Dust.tt API | v1 |
| Validation | Zod | 3.x |
| Tests | Vitest + Playwright | 2.x / 1.x |
| Hosting | Netlify Free | - |
| Data | CSV → TypeScript (auto-généré) | - |

### Versions de l'application

| Route | Description | Statut |
|-------|-------------|--------|
| `/` | Landing page statique | ✅ Legacy |
| `/v2` | Grille interactive avec traffic lights | ✅ Stable |
| `/v3` | Analyse comparative détaillée | ✅ Stable |
| `/v4` | **Analyse AI via Dust.tt** | 🚧 Active |

**Focus actuel** : Version `/v4` avec intégration Dust.tt

### Architecture API (Pattern Async Polling)

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

**Pourquoi ce pattern ?**
- Netlify Free timeout = 10 secondes
- Dust.tt génération AI = ~3 minutes
- Streaming SSE impossible → Polling async obligatoire

### Structure des dossiers

```
app/
├── api/
│   └── analyze/
│       ├── route.ts              # POST - Créer conversation Dust
│       └── [conversationId]/
│           └── route.ts          # GET - Poll status (à implémenter)
├── v2/page.tsx                   # Grille interactive
├── v3/page.tsx                   # Analyse comparative
├── v4/page.tsx                   # Analyse AI (principal)
├── layout.tsx                    # Layout global + fonts
└── globals.css                   # Styles Tailwind

components/
├── BenchmarkGrid.tsx             # Grille KPIs avec inputs
├── AiAnalysisResult.tsx          # Affichage résultat Markdown AI
├── SidebarInputs.tsx             # Sélecteur industry/priceTier
├── Header.tsx                    # Navigation Brevo
└── [30+ autres]                  # Composants legacy (à refactorer)

data/
├── benchmarks.csv                # Source de vérité (sync Google Sheets)
└── retailBenchmarks.ts           # ⚠️ AUTO-GÉNÉRÉ - ne pas éditer

utils/
└── benchmarkUtils.ts             # Logique traffic lights & scores

scripts/
├── generate-benchmarks.js        # CSV → TypeScript
└── sync-from-gsheet.js           # Google Sheets → CSV

tests/
├── benchmarkUtils.test.ts        # Tests unitaires logique métier
└── dust-integration.spec.ts      # Tests E2E Playwright

docs/                             # Documentation détaillée
```

---

## 📊 Modèle de Données

### Industries & Price Tiers

```typescript
type Industry = 'Fashion' | 'Home';  // Beauty, Electronics à venir
type PriceTier = 'Budget' | 'Mid-Range' | 'Luxury';
```

### KPIs (16 métriques par industrie)

| Catégorie | Métriques | Direction |
|-----------|-----------|-----------|
| **Strategic Efficiency** | LTV:CAC, MER | Higher is better |
| **Acquisition** | CAC, ROAS, Marketing % | CAC: lower, autres: higher |
| **Conversion** | Conv Desktop/Mobile, Cart Abandon, AOV | Cart: lower, autres: higher |
| **Channel Mix** | Email %, SMS % | Higher is better |
| **Retention** | Repeat Rate, Purchase Freq, Churn | Churn: lower, autres: higher |
| **Economics** | Return Rate, Gross Margin | Return: lower, Margin: higher |

### Traffic Lights Logic

```typescript
// utils/benchmarkUtils.ts
getBenchmarkStatus(value, benchmark, metricId) → 'good' | 'average' | 'poor' | 'unknown'

// Higher is Better (ROAS, LTV, etc.)
- value > high → 'good' (vert)
- median ≤ value ≤ high → 'average' (jaune)
- value < median → 'poor' (rouge)

// Lower is Better (CAC, Churn, etc.)
- value < low → 'good' (vert)
- low ≤ value ≤ median → 'average' (jaune)
- value > median → 'poor' (rouge)
```

---

## 🔌 Intégrations

### Dust.tt (AI Analysis)

**Configuration** :
```env
DUST_WORKSPACE_ID=xxx    # Workspace Brevo
DUST_API_KEY=sk-xxx      # API Key (secret!)
DUST_ASSISTANT_ID=xxx    # Agent configuré pour retail analysis
```

**Endpoints utilisés** :
1. `POST /w/{workspace}/assistant/conversations` (blocking: false)
2. `GET /w/{workspace}/assistant/conversations/{id}`

**Format réponse conversation** :
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

**Statuts agent** : `created` → `running` → `succeeded` | `failed` | `cancelled`

### Netlify

**Contraintes Netlify Free** :
- ⏱️ Timeout serverless : **10 secondes max**
- ❌ Background Functions : Non disponible
- ❌ Edge Functions : Non nécessaire

**Configuration** (`netlify.toml`) :
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  timeout = 10  # Pattern async = réponses rapides
```

### Google Sheets (Benchmarks)

**Sheet source** : [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

**Workflow** :
```bash
# Sync depuis Google Sheets
npm run sync:benchmarks

# Générer TypeScript depuis CSV local
npm run generate:benchmarks
```

⚠️ **Ne jamais éditer `data/retailBenchmarks.ts` manuellement**

---

## 🚨 Contraintes & Décisions Importantes

### Pattern Async obligatoire (pas de streaming)

| Approche | Compatible Netlify Free | Temps |
|----------|------------------------|-------|
| ~~Streaming SSE~~ | ❌ Timeout 10s | ~3min |
| **Async Polling** | ✅ Requêtes <5s | ~3min |

### Sécurité

- ❌ Pas d'auth sur `/api/analyze` (asset public)
- ⚠️ Rate limiting recommandé (10 req/min/IP)
- ✅ Validation Zod sur inputs
- ✅ Secrets dans variables d'environnement Netlify

### Performance

- Components non mémorisés (React.memo manquant)
- Pas de lazy loading des pages v2/v3/v4
- Bundle non optimisé (~500KB)

---

## 🧪 Protocole de Tests et Debugging

### ❌ NE JAMAIS créer de fichiers de test/debug à la racine

**Interdits** :
- `test_*.txt`, `test_*.js` à la racine
- `debug_*.txt`, `debug_*.log` à la racine
- Fichiers temporaires sans extension

### ✅ À la place, utiliser

#### 1. Tests unitaires (tests/)

```bash
tests/
├── benchmarkUtils.test.ts        # Tests logique métier
├── components/
│   └── BenchmarkGrid.test.tsx    # Tests composants
└── api/
    └── analyze.test.ts           # Tests routes API
```

**Commandes** :
```bash
npm test              # Run tous les tests
npm test -- --watch   # Watch mode
npm test -- --ui      # UI Vitest
npm test -- --coverage
```

#### 2. Tests E2E (Playwright)

```bash
npx playwright test           # Run E2E
npx playwright test --ui      # Mode UI
npx playwright test --debug   # Debug mode
```

#### 3. Scripts de test temporaires (.dev-tests/)

**Pour les tests API ou debugging ponctuel** :

```bash
.dev-tests/
├── test-dust-api.js          # Test intégration Dust
├── test-async-api.js         # Test pattern polling
└── output/                   # Sorties de tests (gitignored)
```

```bash
node .dev-tests/test-dust-api.js
```

**Note** : `.dev-tests/` est dans `.gitignore`

### Workflow de test recommandé

```bash
# 1. Créer test unitaire
touch tests/nouvelle-feature.test.ts

# 2. Implémenter
# utils/nouvelle-feature.ts

# 3. Tester
npm test

# 4. Commit
git add tests/ utils/
git commit -m "feat: Ajouter nouvelle feature avec tests"
```

---

## 📝 Conventions

### Commits

Format : `<type>(<scope>): <message>`

```bash
feat(v4): Add async polling for Dust analysis
fix(api): Handle timeout gracefully
docs(claude): Update architecture documentation
test(utils): Add getBenchmarkStatus edge cases
chore(deps): Update Next.js to 16.0.4
```

### Code Style

- TypeScript strict mode obligatoire
- Composants fonctionnels avec hooks
- Props typées explicitement
- Pas de `any` (typer correctement)
- Pas de `console.log` en production

### Nommage fichiers

```
components/
├── ComponentName.tsx      # PascalCase
├── ComponentName.test.tsx # Tests associés

utils/
└── functionName.ts        # camelCase

tests/
└── moduleName.test.ts     # camelCase + .test
```

---

## ✅ Checklist avant commit

- [ ] Tests passent (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Types valides (`npx tsc --noEmit`)
- [ ] Pas de fichiers debug à la racine
- [ ] Pas de `console.log` de debug
- [ ] Pas de `any` non justifié

---

## 🚫 Anti-patterns à éviter

### ❌ Éditer retailBenchmarks.ts manuellement
```bash
# MAUVAIS
vim data/retailBenchmarks.ts

# BON
npm run generate:benchmarks
```

### ❌ Utiliser streaming SSE (timeout Netlify)
```typescript
// MAUVAIS - Timeout après 10s
const stream = new ReadableStream({ ... });
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });

// BON - Pattern async polling
return NextResponse.json({ status: 'created', conversationId });
```

### ❌ Secrets en dur dans le code
```typescript
// MAUVAIS
const apiKey = 'sk-xxxxxxxx';

// BON
const apiKey = process.env.DUST_API_KEY;
```

### ❌ Fichiers temporaires à la racine
```bash
# MAUVAIS
touch test_output.txt

# BON
mkdir -p .dev-tests/output
touch .dev-tests/output/result.txt
```

---

## 📚 Ressources

### Documentation projet
- [docs/SYNC.md](docs/SYNC.md) - Synchronisation Google Sheets
- [docs/BENCHMARKS.md](docs/BENCHMARKS.md) - Structure des données
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Guide développeur
- [docs/AUDIT.md](docs/AUDIT.md) - Audit technique

### Documentation externe
- [Next.js Docs](https://nextjs.org/docs)
- [Dust.tt API](https://docs.dust.tt/reference/developer-platform-overview)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

## 📅 Historique des décisions

| Date | Décision | Raison |
|------|----------|--------|
| Nov 2025 | Migration streaming → async polling | Netlify Free timeout 10s |
| Nov 2025 | Intégration Dust.tt | AI analysis pour v4 |
| Nov 2025 | Ajout heartbeat (abandonné) | Timeout incompatible |
