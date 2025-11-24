# 📊 Données de Benchmarks

## 📁 Fichiers

### `benchmarks.csv` (SOURCE DE VÉRITÉ)

Fichier source contenant tous les benchmarks pour chaque :
- Industrie (Fashion, Home, Beauty, Electronics, ...)
- Positionnement prix (Budget, Mid-Range, Luxury)
- Métrique (CAC, ROAS, AOV, etc.)

**⚠️ Ce fichier est la source de vérité.** Toute modification doit passer par ce CSV.

### `retailBenchmarks.ts` (AUTO-GÉNÉRÉ)

Fichier TypeScript généré automatiquement depuis `benchmarks.csv`.

**🚨 NE PAS ÉDITER MANUELLEMENT**

Pour mettre à jour ce fichier :
```bash
npm run generate:benchmarks
```

## 🔄 Workflow

1. **Éditer** `benchmarks.csv` (ou via Google Sheets)
2. **Générer** avec `npm run generate:benchmarks`
3. **Commit** les deux fichiers

Voir [BENCHMARKS_WORKFLOW.md](../docs/BENCHMARKS_WORKFLOW.md) pour plus de détails.

## 📊 Structure des données

Chaque ligne du CSV représente une **métrique** pour une combinaison **industrie × tier** :

```csv
industry,price_tier,metric_id,category,name,unit,description,low,median,high,insight
Fashion,Budget,cac,Acquisition,Customer Acquisition Cost (CAC),€,Total marketing spend...,15,25,40,Low margins require...
```

## 🎯 Catégories de métriques

- **Strategic Efficiency** : LTV:CAC, MER
- **Acquisition** : CAC, ROAS, Marketing Spend %
- **Conversion** : Conversion Rate, AOV, Cart Abandonment
- **Channel Mix** : Email Revenue Share, SMS Revenue Share
- **Retention** : Repeat Rate, Purchase Frequency, Churn
- **Economics** : Return Rate, Gross Margin

## 📈 Ajouter une nouvelle industrie

1. Dupliquer toutes les lignes d'une industrie existante (ex: Fashion)
2. Remplacer `Fashion` par la nouvelle industrie (ex: `Electronics`)
3. Adapter les valeurs `low`, `median`, `high`, et `insight`
4. Regénérer : `npm run generate:benchmarks`

## ✅ Validation

Le script de génération valide automatiquement :
- ✔️ `low < median < high`
- ✔️ Valeurs numériques valides
- ✔️ Pas de champs vides critiques

## 🔗 Google Sheets

Pour éditer collaborativement, voir le workflow dans [BENCHMARKS_WORKFLOW.md](../docs/BENCHMARKS_WORKFLOW.md).
