# 📊 Structure des Benchmarks

Guide de la structure et gestion des données de benchmarks.

## 📁 Fichiers

### `data/benchmarks.csv` (Source de vérité)

CSV source contenant tous les benchmarks :
- **Industries** : Fashion, Home, Beauty, Electronics
- **Tiers** : Budget, Mid-Range, Luxury
- **Métriques** : 16 KPIs par industrie

**⚠️ Ne pas éditer manuellement** — Utiliser Google Sheets

### `data/retailBenchmarks.ts` (Auto-généré)

TypeScript généré automatiquement depuis CSV.

**🚨 NE JAMAIS ÉDITER MANUELLEMENT**

Pour mettre à jour :
```bash
npm run generate:benchmarks
```

## 📋 Structure du CSV

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `industry` | Secteur | Fashion, Home, Beauty, Electronics |
| `price_tier` | Positionnement | Budget, Mid-Range, Luxury |
| `metric_id` | ID unique | cac, roas, aov |
| `category` | Catégorie | Acquisition, Conversion, Retention |
| `name` | Nom affiché | Customer Acquisition Cost (CAC) |
| `unit` | Unité | €, %, x, #/yr |
| `description` | Description | Total marketing spend... |
| `low` | Valeur basse | 15 |
| `median` | Valeur médiane | 25 |
| `high` | Valeur haute | 40 |
| `insight` | Contexte | Low margins require... |

## 🎯 Catégories de métriques

### Strategic Efficiency (2)
- LTV:CAC Ratio
- Marketing Efficiency Ratio (MER)

### Acquisition (3)
- Customer Acquisition Cost (CAC)
- Blended ROAS
- Marketing % of Revenue

### Conversion (4)
- Conversion Rate (Desktop)
- Conversion Rate (Mobile)
- Cart Abandonment Rate
- Average Order Value (AOV)

### Channel Mix (2)
- Email Revenue Share
- SMS Revenue Share

### Retention (3)
- Repeat Customer Rate
- Purchase Frequency
- Annual Churn Rate

### Economics (2)
- Return Rate
- Gross Margin

## ➕ Ajouter une nouvelle industrie

### Dans Google Sheets

1. Dupliquer toutes les lignes Fashion (48 lignes)
2. Remplacer la colonne `industry` par `Beauty`
3. Adapter les valeurs `low`, `median`, `high`, `insight`
4. Synchroniser :
   ```bash
   npm run sync:benchmarks
   ```

Le type TypeScript sera mis à jour automatiquement :
```typescript
export type Industry = 'Beauty' | 'Electronics' | 'Fashion' | 'Home';
```

### Localement (CSV)

1. Ouvrir `data/benchmarks.csv`
2. Copier les 48 lignes Fashion
3. Remplacer `Fashion` par `Beauty`
4. Adapter les valeurs
5. Regénérer :
   ```bash
   npm run generate:benchmarks
   ```

## ➕ Ajouter une nouvelle métrique

### Dans Google Sheets

Ajouter 3 lignes (une par tier) avec :

```csv
Fashion,Budget,new_metric,Category,Metric Name,unit,Description,10,20,30,Insight
Fashion,Mid-Range,new_metric,Category,Metric Name,unit,Description,20,30,40,Insight
Fashion,Luxury,new_metric,Category,Metric Name,unit,Description,30,40,50,Insight
```

Répéter pour chaque industrie (Home, Beauty, Electronics).

### Règles de validation

✅ **Obligatoire** :
- `low < median < high`
- Valeurs numériques pour low/median/high
- Même `metric_id` pour les 3 tiers d'une industrie
- Toutes les colonnes renseignées

❌ **Interdit** :
- `low >= median`
- `median >= high`
- Valeurs non numériques
- Champs vides (sauf insight)

## 📊 Données actuelles

**2 industries** × **16 métriques** × **3 tiers** = **96 lignes**

Industries disponibles :
- ✅ Fashion
- ✅ Home
- ⏳ Beauty (à ajouter)
- ⏳ Electronics (à ajouter)

## 🔄 Workflow de modification

### Option 1 : Google Sheets (recommandé)

```bash
# 1. Modifier dans Google Sheets
# 2. Synchroniser
npm run sync:benchmarks

# 3. Commit
git add data/
git commit -m "chore: Update benchmarks"
git push
```

### Option 2 : CSV local

```bash
# 1. Éditer data/benchmarks.csv
# 2. Générer
npm run generate:benchmarks

# 3. Commit
git add data/
git commit -m "chore: Update benchmarks"
git push
```

## ✅ Bonnes pratiques

### À faire
- Documenter les sources dans `insight`
- Tester localement avant commit
- Vérifier la validation dans Google Sheets
- Utiliser des valeurs réalistes basées sur data sectorielle

### À éviter
- Modifier `data/retailBenchmarks.ts` directement
- Créer des incohérences (low ≥ median)
- Oublier de regénérer après modification CSV
- Push sans avoir testé le build

## 📈 Validation Google Sheets

Ajouter une colonne L "Validation" avec formule :

```
=IF(H2<I2, IF(I2<J2, "✅", "❌ median≥high"), "❌ low≥median")
```

Formattage conditionnel :
- Texte contient "❌" → Rouge vif

## 🛠️ Scripts disponibles

```bash
# Générer TypeScript depuis CSV
npm run generate:benchmarks

# Synchroniser depuis Google Sheets
npm run sync:benchmarks
```
