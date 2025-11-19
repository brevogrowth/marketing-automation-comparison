# Quick Start Guide - Brevo KPI Benchmark

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:3000 (ou le port affiché dans le terminal)
```

## Ce que vous verrez

Une page complète de résultats de benchmark avec :

1. **Header** avec logo Brevo et bouton Partager
2. **Section Hero** avec badge secteur et profil d'exemple
3. **Bandeau hypothèses** avec inputs pour personnaliser (désactivés)
4. **4 cartes overview** par étape du funnel
5. **Tableau complet de KPIs** sectoriels structurés
6. **Analyse personnalisée** avec résumé chiffré et 3 insights
7. **Plan d'action** avec 3 priorités et leviers Brevo
8. **Formulaire CTA** pour capture email

## Données d'exemple

Toutes les données sont codées en dur pour cet exemple :
- **Secteur** : E-commerce Mode & Accessoires (Europe)
- **Panier moyen** : 65 €
- **Fréquence d'achat** : 2,1 / an
- **CA estimé** : 8–12 M€

## Personnalisation

Pour adapter à vos besoins :

### 1. Modifier les couleurs Brevo

Éditer `app/globals.css` :

```css
@theme {
  --color-brevo-light: #F0FDF4;  /* Fond vert clair */
  --color-brevo-green: #10B981;  /* Vert principal */
  --color-brevo-dark: #065F46;   /* Vert foncé */
}
```

### 2. Changer les données sectorielles

Éditer les fichiers dans `components/` :
- `SectorKpiSection.tsx` - Tableau de KPIs
- `OverviewByCategory.tsx` - Cartes overview
- `PersonalizedAnalysis.tsx` - Insights personnalisés
- `ActionPlan.tsx` - Plan d'action

### 3. Activer les inputs

Dans `BusinessAssumptions.tsx`, retirer les attributs `disabled` et ajouter :

```tsx
const [basket, setBasket] = useState(65);
const [frequency, setFrequency] = useState(2.1);
// ... logique de calcul
```

## Architecture des composants

```
Page (app/page.tsx)
├── Header
├── HeroSection
├── BusinessAssumptions
├── OverviewByCategory
├── SectorKpiSection
├── PersonalizedAnalysis
├── ActionPlan
└── CtaSection

Composants réutilisables :
├── Card
├── SectionTitle
└── KpiTable
```

## Prochaines étapes

### Pour rendre dynamique :

1. **Backend API**
   ```typescript
   // Exemple d'appel API
   const response = await fetch('/api/benchmark', {
     method: 'POST',
     body: JSON.stringify({ industry, basket, frequency })
   });
   const data = await response.json();
   ```

2. **State Management**
   ```typescript
   // Avec React Context ou Zustand
   const [benchmarkData, setBenchmarkData] = useState(null);
   ```

3. **Génération avec LLM**
   ```typescript
   // Appel à OpenAI/Anthropic pour insights personnalisés
   const insights = await generateInsights(kpiData, userProfile);
   ```

### Pour déployer :

```bash
# Build production
npm run build

# Déployer sur Vercel
vercel deploy

# Ou autre plateforme (Netlify, Railway, etc.)
```

## Besoin d'aide ?

- Documentation Next.js : https://nextjs.org/docs
- Documentation TailwindCSS : https://tailwindcss.com/docs
- Documentation TypeScript : https://www.typescriptlang.org/docs

## Structure du projet

```
brevo-kpi-benchmark/
├── app/
│   ├── globals.css          # Styles TailwindCSS
│   ├── layout.tsx           # Layout racine
│   └── page.tsx             # Page principale
├── components/
│   ├── ActionPlan.tsx       # 3 priorités avec actions
│   ├── BusinessAssumptions.tsx  # Inputs hypothèses
│   ├── Card.tsx             # Composant carte
│   ├── CtaSection.tsx       # Formulaire email
│   ├── Header.tsx           # En-tête
│   ├── HeroSection.tsx      # Hero + profil
│   ├── KpiTable.tsx         # Tableau KPIs
│   ├── OverviewByCategory.tsx   # 4 cartes funnel
│   ├── PersonalizedAnalysis.tsx # Insights + résumé
│   ├── SectionTitle.tsx     # Titre section
│   └── SectorKpiSection.tsx # KPIs sectoriels
├── postcss.config.js        # Config PostCSS
├── tsconfig.json            # Config TypeScript
├── next.config.js           # Config Next.js
├── package.json
└── README.md
```

## Tips & Tricks

### Modifier les KPIs affichés

Dans `SectorKpiSection.tsx` :

```typescript
const acquisitionData: KpiRow[] = [
  {
    kpi: 'Nouveau KPI',
    low: '< 10 €',
    median: '10-20 €',
    high: '> 20 €',
    position: 'Votre position',
  },
  // ...
];
```

### Ajouter une nouvelle section

1. Créer un nouveau composant dans `components/`
2. L'importer dans `app/page.tsx`
3. L'ajouter dans le `<main>`

### Changer le layout

Modifier la grille dans chaque section :
- `grid-cols-1` : 1 colonne mobile
- `md:grid-cols-2` : 2 colonnes tablette
- `lg:grid-cols-3` : 3 colonnes desktop

---

**Bon développement ! 🚀**
