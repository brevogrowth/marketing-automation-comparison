# 📊 Workflow de gestion des Benchmarks

## 🎯 Vue d'ensemble

Le référentiel de benchmarks est géré via un fichier CSV (`data/benchmarks.csv`) qui peut être synchronisé avec Google Sheets pour faciliter la collaboration. Les données sont ensuite converties en TypeScript pour être utilisées dans l'application.

## 📋 Structure du CSV

Le fichier `data/benchmarks.csv` contient les colonnes suivantes :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `industry` | Secteur d'activité | Fashion, Home, Beauty, Electronics |
| `price_tier` | Positionnement prix | Budget, Mid-Range, Luxury |
| `metric_id` | Identifiant unique de la métrique | cac, roas, aov |
| `category` | Catégorie de la métrique | Acquisition, Conversion, Retention, etc. |
| `name` | Nom affiché de la métrique | Customer Acquisition Cost (CAC) |
| `unit` | Unité de mesure | €, %, x, #/yr |
| `description` | Description détaillée | Total marketing spend divided by... |
| `low` | Valeur basse de la fourchette | 15 |
| `median` | Valeur médiane | 25 |
| `high` | Valeur haute de la fourchette | 40 |
| `insight` | Insight contextuel | Low margins require highly efficient... |

## 🔄 Workflow de mise à jour

### Option 1 : Édition directe du CSV (Simple)

1. **Éditer le fichier** `data/benchmarks.csv`
2. **Générer le TypeScript** :
   ```bash
   npm run generate:benchmarks
   ```
3. **Commit les changements** :
   ```bash
   git add data/benchmarks.csv data/retailBenchmarks.ts
   git commit -m "chore: Update benchmarks"
   ```

### Option 2 : Via Google Sheets (Recommandé pour collaboration)

#### 📤 Initialisation : CSV → Google Sheets

1. **Ouvrir Google Sheets** : https://sheets.google.com
2. **Créer un nouveau spreadsheet** nommé "Brevo KPI Benchmarks"
3. **Importer le CSV** :
   - File → Import → Upload
   - Sélectionner `data/benchmarks.csv`
   - Import location : "Replace spreadsheet"
   - Separator type : "Comma"
4. **Configurer les permissions** :
   - Share → Anyone with the link → Viewer
   - Pour l'édition : Ajouter les collaborateurs avec "Editor"
5. **Figer la première ligne** (headers) :
   - View → Freeze → 1 row

#### 📥 Synchronisation : Google Sheets → GitHub

##### Méthode A : Manuelle (recommandée pour démarrer)

1. **Dans Google Sheets** :
   - File → Download → Comma Separated Values (.csv)
2. **Remplacer le fichier local** :
   ```bash
   mv ~/Downloads/Brevo\ KPI\ Benchmarks*.csv data/benchmarks.csv
   ```
3. **Générer et commit** :
   ```bash
   npm run generate:benchmarks
   git add data/benchmarks.csv data/retailBenchmarks.ts
   git commit -m "chore: Update benchmarks from Google Sheets"
   git push
   ```

##### Méthode B : Automatique avec GitHub Actions (optionnel)

Créer `.github/workflows/sync-benchmarks.yml` :

```yaml
name: Sync Benchmarks from Google Sheets

on:
  workflow_dispatch:  # Déclenchement manuel
  schedule:
    - cron: '0 9 * * 1'  # Tous les lundis à 9h

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Download from Google Sheets
        run: |
          SHEET_ID="YOUR_GOOGLE_SHEET_ID"
          curl -L "https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv" \
            -o data/benchmarks.csv

      - name: Generate TypeScript
        run: |
          npm ci
          npm run generate:benchmarks

      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data/
          git diff --staged --quiet || git commit -m "chore: Auto-sync benchmarks from Google Sheets"
          git push
```

**Note** : Pour automatiser, le Google Sheet doit être **public** (Anyone with the link can view).

## ✅ Validation automatique

Le script `generate-benchmarks.js` valide automatiquement que :

- ✔️ `low < median < high` pour chaque métrique
- ✔️ Toutes les colonnes sont présentes
- ✔️ Les valeurs numériques sont valides

En cas d'erreur, le script s'arrête avec un message clair :

```
❌ Line 42: Validation failed for Fashion Budget cac - low (30) must be < median (25)
```

## 📊 Ajout d'une nouvelle industrie

1. **Dans le CSV**, ajouter les lignes pour la nouvelle industrie :
   ```csv
   Beauty,Budget,cac,Acquisition,Customer Acquisition Cost (CAC),€,...
   Beauty,Mid-Range,cac,Acquisition,Customer Acquisition Cost (CAC),€,...
   ...
   ```

2. **Regénérer** :
   ```bash
   npm run generate:benchmarks
   ```

3. Le type TypeScript `Industry` sera automatiquement mis à jour :
   ```typescript
   export type Industry = 'Beauty' | 'Fashion' | 'Home';
   ```

## 🎨 Format Google Sheets recommandé

Pour faciliter la lecture dans Google Sheets :

1. **Figer les en-têtes** : View → Freeze → 1 row
2. **Filtres automatiques** : Data → Create a filter
3. **Formattage conditionnel** (optionnel) :
   - Sélectionner colonnes H:J (low, median, high)
   - Format → Conditional formatting
   - Règle : `=H2>=I2` (rouge si low ≥ median)
4. **Grouper par industrie** :
   - Sélectionner les lignes d'une industrie
   - Data → Group rows

## 🔗 Lien Google Sheets

**Template à copier** : _À compléter après création_

Pour créer votre propre version :
1. Ouvrir le template ci-dessus
2. File → Make a copy
3. Partager avec votre équipe

## 🚨 Bonnes pratiques

### ✅ À faire

- Toujours valider avec `npm run generate:benchmarks` avant de commit
- Documenter les sources de vos benchmarks dans les insights
- Utiliser des valeurs réalistes basées sur des données sectorielles
- Versionner le CSV dans Git (historique des changements)

### ❌ À éviter

- Modifier directement `data/retailBenchmarks.ts` (fichier auto-généré)
- Créer des incohérences (low ≥ median ou median ≥ high)
- Oublier de commit le CSV après modification du Google Sheet
- Mélanger plusieurs systèmes d'unités

## 🛠️ Dépannage

### Le script échoue avec "Validation failed"

→ Vérifier que `low < median < high` pour la ligne indiquée

### Les modifications ne s'affichent pas dans l'app

→ Avez-vous bien regénéré avec `npm run generate:benchmarks` ?

### Conflit Git sur retailBenchmarks.ts

→ Résoudre d'abord le conflit sur `benchmarks.csv`, puis regénérer

## 📚 Ressources

- [Google Sheets → CSV Export](https://support.google.com/docs/answer/37579)
- [CSV Best Practices](https://datatracker.ietf.org/doc/html/rfc4180)
- [TypeScript Generation Script](../scripts/generate-benchmarks.js)
