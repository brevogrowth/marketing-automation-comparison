# 📊 Brevo KPI Benchmark

Application Next.js pour analyser et comparer vos KPIs e-commerce avec les benchmarks sectoriels. Obtenez des insights personnalisés basés sur votre industrie, votre pricing et votre taille d'entreprise.

## ✨ Fonctionnalités

- 📈 **3 versions d'analyse** : Grille interactive, analyse comparative, et analyse AI
- 🤖 **AI-Powered Insights** : Recommandations personnalisées via Dust.tt
- 🎯 **Traffic Lights System** : Visualisation immédiate de vos performances (vert/jaune/rouge)
- 📊 **Benchmarks sectoriels** : 3+ industries avec données réelles
- 🔄 **Synchronisation automatique** : Google Sheets → CSV → TypeScript

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/brevogrowth/brevo-kpi-benchmark.git
cd brevo-kpi-benchmark

# Installer les dépendances
npm install

# Configurer les variables d'environnement (optionnel pour v4)
cp .env.example .env.local
# Éditer .env.local avec vos clés Dust.tt
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Lancer les tests
npm test

# Lancer les tests E2E
npx playwright test

# Build de production
npm run build
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📊 Versions disponibles

- **v2** (`/v2`) - Grille interactive avec traffic lights (vert/jaune/rouge)
- **v3** (`/v3`) - Analyse comparative détaillée avec insights sectoriels
- **v4** (`/v4`) - Analyse AI via Dust.tt avec recommandations personnalisées

## 🗂️ Gestion des Benchmarks

### Synchronisation Google Sheets

```bash
# Sync manuelle depuis Google Sheets
npm run sync:benchmarks

# Génération TypeScript depuis CSV local
npm run generate:benchmarks
```

**Google Sheet** : [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

**Documentation complète** : [docs/](docs/)
- [docs/SYNC.md](docs/SYNC.md) - Guide de synchronisation
- [docs/BENCHMARKS.md](docs/BENCHMARKS.md) - Structure des données
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Guide développeur

## 🏗️ Structure du projet

```
app/
├── v2/          # Grille interactive avec traffic lights
├── v3/          # Analyse comparative
├── v4/          # Analyse AI
└── api/analyze/ # Endpoint AI Dust.tt

components/      # Composants React
├── BenchmarkGrid.tsx
├── AiAnalysisResult.tsx
└── SidebarInputs.tsx

data/
├── benchmarks.csv          # Source de vérité (sync Google Sheets)
└── retailBenchmarks.ts     # Auto-généré depuis CSV

scripts/
├── generate-benchmarks.js  # CSV → TypeScript
└── sync-from-gsheet.js     # Google Sheets → CSV

utils/
└── benchmarkUtils.ts       # Logique métier (traffic lights, scores)

tests/
└── benchmarkUtils.test.ts  # Tests unitaires
```

## 🛠️ Tech Stack

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS 4, Shadcn/ui
- **Language** : TypeScript (strict mode)
- **AI** : Dust.tt API (streaming responses)
- **Tests** : Vitest (unitaires) + Playwright (E2E)
- **Validation** : Zod
- **Data** : CSV synchronisé depuis Google Sheets

## 🧪 Tests

```bash
# Tests unitaires (Vitest)
npm test

# Tests avec couverture
npm test -- --coverage

# Tests E2E (Playwright)
npx playwright test

# Tests E2E en mode UI
npx playwright test --ui
```

**Couverture actuelle** :
- ✅ `benchmarkUtils.ts` - Tests unitaires complets
- ⚠️ Composants React - À ajouter
- ⚠️ API routes - À ajouter

## 🔒 Configuration (.env.local)

Pour utiliser la version v4 (analyse AI), créez un fichier `.env.local` :

```bash
# Dust.tt Configuration (requis pour v4)
DUST_WORKSPACE_ID=your_workspace_id
DUST_API_KEY=your_api_key
DUST_ASSISTANT_ID=your_assistant_id
```

⚠️ **IMPORTANT** : Ne committez JAMAIS le fichier `.env` avec vos secrets !

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| [docs/SYNC.md](docs/SYNC.md) | Synchronisation Google Sheets (automatique et manuelle) |
| [docs/BENCHMARKS.md](docs/BENCHMARKS.md) | Structure des benchmarks, ajout d'industries, métriques |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Guide développeur, tests, validation |
| [CLAUDE.md](CLAUDE.md) | Conventions pour développement avec Claude Code |

## 🔗 Liens utiles

- **Application** : http://localhost:3000
- **Google Sheet** : https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit
- **Repository** : https://github.com/brevogrowth/brevo-kpi-benchmark
- **GitHub Actions** : Sync automatique tous les lundis à 9h UTC

## 🐛 Issues connues et TODOs

Voir [docs/AUDIT.md](docs/AUDIT.md) pour l'audit complet de la codebase.

**Priorités** :
- [ ] Refactoriser duplication de composants (HeroSection v1/v2/v3)
- [ ] Ajouter tests pour composants React
- [ ] Optimiser performance (React.memo, lazy loading)
- [ ] Configurer ESLint + Prettier
- [ ] Ajouter rate limiting sur `/api/analyze`

## 🤝 Contributing

Les contributions sont les bienvenues ! Veuillez :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

Suivez les conventions définies dans [CLAUDE.md](CLAUDE.md).

## 📝 License

Projet Brevo - Usage interne.
