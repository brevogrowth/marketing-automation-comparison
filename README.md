# Brevo Marketing KPI Benchmark - Example Pages

Static example pages for Brevo's "Marketing KPI Benchmark" micro-SaaS.

## 🌟 Two Versions Available

This project includes **two different layout versions**, both in **English**:

### Version 1 - Detailed Analysis (Fashion E-commerce)
**URL**: http://localhost:3002/
- Traditional detailed layout with comprehensive sections
- 10 KPIs in organized tables
- **Industry**: E-commerce Fashion & Accessories
- **Region**: Europe
- **Average basket**: €65
- **Purchase frequency**: 2.1/year
- **Estimated annual revenue**: €8-12M

### Version 2 - Card Grid Layout (B2B SaaS)
**URL**: http://localhost:3002/v2
- Modern card-based grid layout
- 12 KPI cards with visual ranges
- **Company**: TechFlow Solutions
- **Industry**: B2B SaaS Platform
- **Revenue**: $8.5M
- **Employees**: 120
- **Marketing budget**: 18% of revenue

**Switch between versions** using the buttons in the header!

## Stack technique

- React 19
- Next.js 16
- TypeScript
- TailwindCSS 4

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Build pour production

```bash
npm run build
npm start
```

## Structure du projet

```
├── app/
│   ├── globals.css         # Styles globaux avec TailwindCSS
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Page d'accueil (toutes les sections)
├── components/
│   ├── ActionPlan.tsx       # Plan d'action priorisé
│   ├── BusinessAssumptions.tsx  # Bandeau hypothèses business
│   ├── Card.tsx             # Composant Card réutilisable
│   ├── CtaSection.tsx       # Section capture email
│   ├── Header.tsx           # En-tête de page
│   ├── HeroSection.tsx      # Section hero + résumé
│   ├── KpiTable.tsx         # Tableau de KPIs réutilisable
│   ├── OverviewByCategory.tsx   # Vue par catégorie
│   ├── PersonalizedAnalysis.tsx # Analyse personnalisée
│   ├── SectionTitle.tsx     # Titre de section réutilisable
│   └── SectorKpiSection.tsx # Tableau KPIs sectoriels
├── tailwind.config.js       # Configuration TailwindCSS
├── tsconfig.json            # Configuration TypeScript
└── package.json
```

## Fonctionnalités implémentées

### ✅ Sections principales

1. **Header** - Logo Brevo + titre + bouton Partager
2. **Hero** - Badge secteur + titre + résumé + profil exemple
3. **Hypothèses business** - Bandeau avec inputs (désactivés pour l'exemple)
4. **Vue d'ensemble** - 4 cartes par catégorie du funnel
5. **Tableau KPIs** - KPIs sectoriels structurés en blocs
6. **Analyse personnalisée** - Résumé chiffré + 3 insights prioritaires
7. **Plan d'action** - 3 cartes de priorités avec actions concrètes
8. **CTA** - Formulaire de capture email (avec console.log)

### 📦 Composants réutilisables

- `<Card>` : Carte avec fond blanc, arrondi, padding, ombre
- `<SectionTitle>` : Titre + sous-titre optionnel
- `<KpiTable>` : Tableau stylé pour les KPIs

### 🎨 Design

- Fond vert très clair façon Brevo (`bg-brevo-light`)
- Container centré max-width 1200px
- Cartes à bords arrondis avec ombres légères
- Espacement généreux entre les sections
- Responsive (mobile-first avec TailwindCSS)

## Notes importantes

### Pour l'exemple statique

- Les données sont codées en dur dans chaque composant
- Les inputs sont désactivés (attribut `disabled`)
- Le formulaire fait un `console.log` au lieu d'envoyer vraiment
- Aucun appel API ou backend requis

### Pour la version dynamique future

- Remplacer les données statiques par des props
- Connecter les inputs à un state React
- Implémenter la logique de calcul des KPIs
- Brancher le formulaire à une vraie API
- Ajouter la gestion des erreurs et loading states

## Palette de couleurs Brevo

```css
brevo-light: #F0FDF4  /* Fond vert très clair */
brevo-green: #10B981  /* Vert principal */
brevo-dark: #065F46   /* Vert foncé */
```

## Prochaines étapes

1. Brancher un backend (Node.js, Python, etc.)
2. Intégrer un LLM pour la génération d'insights personnalisés
3. Ajouter l'authentification utilisateur
4. Implémenter la sauvegarde et le partage de rapports
5. Créer un dashboard admin pour gérer les benchmarks sectoriels
6. Ajouter des graphiques avec recharts ou chart.js

## License

Projet d'exemple pour Brevo.
