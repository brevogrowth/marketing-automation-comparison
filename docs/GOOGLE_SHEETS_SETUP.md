# 🚀 Guide de mise en place Google Sheets

## 📋 Checklist de démarrage

### 1. Créer le Google Sheet

1. **Ouvrir** https://sheets.google.com
2. **Créer un nouveau spreadsheet**
3. **Renommer** : "Brevo KPI Benchmarks"
4. **Importer le CSV initial** :
   - File → Import → Upload
   - Sélectionner `data/benchmarks.csv` depuis votre ordinateur
   - Import location : "Replace spreadsheet"
   - Separator type : "Comma"
   - ✅ Import

### 2. Configurer la mise en forme

#### Figer la ligne d'en-tête
- View → Freeze → 1 row

#### Activer les filtres
- Data → Create a filter

#### Formattage des colonnes (optionnel mais recommandé)

**Colonnes numériques (H, I, J : low, median, high)**
- Sélectionner H2:J
- Format → Number → Number (ou Custom)

**Colonne Industry (A)**
- Sélectionner colonne A
- Data → Data validation
- Criteria : List of items
- Values : `Fashion,Home,Beauty,Electronics`

**Colonne Price Tier (B)**
- Sélectionner colonne B
- Data → Data validation
- Criteria : List of items
- Values : `Budget,Mid-Range,Luxury`

**Colonne Category (D)**
- Sélectionner colonne D
- Data → Data validation
- Criteria : List of items
- Values : `Strategic Efficiency,Acquisition,Conversion,Channel Mix,Retention,Economics`

### 3. Validation automatique (IMPORTANT)

Ajouter une colonne de validation (colonne L) pour vérifier `low < median < high` :

**En cellule L1** :
```
Validation
```

**En cellule L2** (puis copier vers le bas) :
```
=IF(H2<I2, IF(I2<J2, "✅", "❌ median≥high"), "❌ low≥median")
```

Appliquer le formattage conditionnel :
- Sélectionner L2:L
- Format → Conditional formatting
- Format cells if : Text contains → "❌"
- Formatting style : Rouge vif

### 4. Partager le Google Sheet

#### Option A : Lecture seule publique (recommandée)

1. **Share** (en haut à droite)
2. **General access** → "Anyone with the link" → **Viewer**
3. **Copier le lien**
4. **Récupérer l'ID du sheet** :
   - URL : `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Extraire `{SHEET_ID}`

#### Option B : Édition collaborative

1. **Share** → Ajouter les emails de vos collaborateurs
2. **Role** : Editor
3. ⚠️ Attention : Toute personne avec accès peut modifier

### 5. Récupérer le lien de téléchargement CSV

Format du lien :
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv
```

**Remplacer `{SHEET_ID}`** par votre ID récupéré à l'étape 4.

**Tester le lien** :
- Ouvrir le lien dans un navigateur
- Le CSV doit se télécharger automatiquement

### 6. Premier test de synchronisation

**Depuis votre terminal** :

```bash
# Télécharger le CSV depuis Google Sheets
curl -L "https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv" -o data/benchmarks.csv

# Regénérer le TypeScript
npm run generate:benchmarks

# Vérifier que tout fonctionne
git diff data/retailBenchmarks.ts
```

Si pas de différence (ou différences mineures de formatage), c'est ✅

### 7. Documenter le lien

**Mettre à jour** `docs/BENCHMARKS_WORKFLOW.md` section "Lien Google Sheets" :

```markdown
## 🔗 Lien Google Sheets

**Spreadsheet** : [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/{VOTRE_SHEET_ID}/edit)

**Téléchargement CSV direct** :
```bash
curl -L "https://docs.google.com/spreadsheets/d/{VOTRE_SHEET_ID}/export?format=csv" -o data/benchmarks.csv
```
```

## 🎨 Templates de formatage avancés (optionnel)

### Grouper par Industry

Pour chaque industrie :
1. Sélectionner toutes les lignes de l'industrie
2. Data → Group rows
3. Répéter pour chaque industrie

Cela permet de plier/déplier chaque section.

### Couleurs par catégorie

Appliquer des couleurs d'arrière-plan par catégorie :
- **Strategic Efficiency** : Bleu clair
- **Acquisition** : Vert clair
- **Conversion** : Orange clair
- **Channel Mix** : Violet clair
- **Retention** : Jaune clair
- **Economics** : Rose clair

### Notes et commentaires

Pour documenter les sources des benchmarks :
- Clic droit sur une cellule → Insert comment
- Ajouter la source (étude, rapport, benchmarking interne)

## 🔄 Workflow de mise à jour

### Mise à jour manuelle (simple)

1. **Éditer dans Google Sheets**
2. **Vérifier la colonne Validation** (doit afficher ✅)
3. **Télécharger le CSV** :
   ```bash
   curl -L "https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv" \
     -o data/benchmarks.csv
   ```
4. **Regénérer** :
   ```bash
   npm run generate:benchmarks
   ```
5. **Commit** :
   ```bash
   git add data/
   git commit -m "chore: Update benchmarks from Google Sheets"
   git push
   ```

### Mise à jour automatique (GitHub Actions)

Si vous avez configuré le workflow GitHub Actions, il suffit de :

1. **Pousser un tag** :
   ```bash
   git tag sync-benchmarks-$(date +%Y%m%d-%H%M%S)
   git push --tags
   ```

2. Ou **déclencher manuellement** :
   - Aller sur GitHub → Actions
   - Sync Benchmarks from Google Sheets
   - Run workflow

## 🆘 Dépannage

### Le CSV téléchargé est vide

→ Vérifier que le Google Sheet est en accès "Anyone with the link can view"

### Le CSV contient des caractères bizarres

→ S'assurer que le Google Sheet utilise UTF-8 (automatique normalement)

### Les virgules dans les descriptions cassent le CSV

→ Google Sheets gère automatiquement les guillemets autour des champs avec virgules

### La validation échoue après téléchargement

→ Vérifier la colonne Validation (L) dans Google Sheets
→ Corriger les erreurs avant de télécharger

## 📱 Accès mobile

Le Google Sheet est éditable depuis :
- 📱 L'app Google Sheets (iOS/Android)
- 💻 Le navigateur mobile

**Conseil** : Utiliser l'app pour des modifications rapides, le navigateur desktop pour des modifications importantes.

## 🔒 Sécurité

### Bonnes pratiques

- ✅ Utiliser "Viewer" par défaut pour le lien public
- ✅ Ajouter uniquement les collaborateurs nécessaires en "Editor"
- ✅ Versionner le CSV dans Git (historique complet)
- ✅ Faire un backup mensuel (File → Download → CSV)

### Éviter

- ❌ Donner accès "Editor" à "Anyone with the link"
- ❌ Modifier directement `retailBenchmarks.ts` (auto-généré)
- ❌ Oublier de commit le CSV après modification

## 📚 Ressources

- [Google Sheets - Fonctions](https://support.google.com/docs/table/25273)
- [Google Sheets - Validation de données](https://support.google.com/docs/answer/186103)
- [Google Sheets - Export CSV](https://support.google.com/docs/answer/37579)
