# 🔄 Synchronisation des Benchmarks

Guide complet pour synchroniser les benchmarks depuis Google Sheets.

## 📊 Google Sheet

**URL** : [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

**Sheet ID** : `1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ`

## ⚡ Synchronisation manuelle

```bash
npm run sync:benchmarks
```

Cette commande :
1. ✅ Sauvegarde le CSV actuel
2. 📥 Télécharge depuis Google Sheets
3. 💾 Écrit le nouveau CSV
4. ✔️ Valide `low < median < high`
5. ⚙️ Génère le TypeScript
6. 📊 Affiche les différences

## 🤖 Synchronisation automatique (GitHub Actions)

**Fréquence** : Tous les lundis à 9h UTC (11h Paris)

**Déclenchement manuel** :
1. GitHub → Actions
2. "Sync Benchmarks from Google Sheets"
3. Run workflow

**Workflow** : `.github/workflows/sync-benchmarks.yml`

## 🔧 Configuration

### Changer la fréquence

Éditer `.github/workflows/sync-benchmarks.yml` :

```yaml
schedule:
  # Tous les jours à 9h
  - cron: '0 9 * * *'

  # Tous les lundis et vendredis
  - cron: '0 9 * * 1,5'
```

Outil : https://crontab.guru

### Changer le Google Sheet source

1. Éditer `scripts/sync-from-gsheet.js` :
   ```javascript
   const SHEET_ID = 'NOUVEAU_SHEET_ID';
   ```

2. Éditer `.github/workflows/sync-benchmarks.yml` :
   ```yaml
   SHEET_ID="NOUVEAU_SHEET_ID"
   ```

3. Commit et push

## 🔄 Workflow quotidien

### Modifications urgentes

```bash
# 1. Modifier dans Google Sheets
# 2. Synchroniser
npm run sync:benchmarks

# 3. Vérifier
git diff data/

# 4. Commit
git add data/
git commit -m "chore: Update benchmarks from Google Sheets"
git push
```

### Modifications planifiées

```bash
# 1. Modifier dans Google Sheets
# 2. Attendre la sync automatique du lundi
# 3. Pull
git pull
```

## ✅ Validation automatique

Le script valide :
- ✔️ `low < median < high`
- ✔️ Valeurs numériques valides
- ✔️ CSV non vide

En cas d'erreur :
- ❌ Annule les changements
- ♻️ Restaure la version précédente
- 📋 Affiche l'erreur avec le numéro de ligne

## 🆘 Dépannage

### "HTTP 403" ou "Downloaded CSV is empty"

**Cause** : Sheet non public

**Solution** :
1. Ouvrir le Google Sheet
2. Share → Anyone with the link → Viewer
3. Relancer `npm run sync:benchmarks`

### Validation échoue

**Cause** : `low >= median` ou `median >= high`

**Solution** :
1. Corriger dans Google Sheets
2. Relancer `npm run sync:benchmarks`

### Changements non détectés

```bash
# Forcer le téléchargement
npm run sync:benchmarks

# Vérifier
git diff data/benchmarks.csv
```

## 📊 Historique

```bash
# Commits de sync
git log --grep="Sync benchmarks" --oneline

# Changements d'une métrique
git log -p --all -S "Fashion,Budget,cac" -- data/benchmarks.csv
```

## ⚡ Commandes rapides

```bash
# Sync + test
npm run sync:benchmarks && npm run build

# Sync + commit
npm run sync:benchmarks && \
  git add data/ && \
  git commit -m "chore: Sync benchmarks" && \
  git push

# Diff sans sync
curl -L "https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/export?format=csv" | \
  diff data/benchmarks.csv -
```
