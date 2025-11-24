# 🔄 Synchronisation Automatique depuis Google Sheets

## 🎯 Vue d'ensemble

Votre Google Sheet est maintenant configuré pour synchroniser automatiquement les benchmarks :

**Google Sheet** : [Brevo KPI Benchmarks](https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit)

## 🚀 Synchronisation manuelle (locale)

### Commande rapide

```bash
npm run sync:benchmarks
```

### Ce que fait la commande

1. ✅ **Sauvegarde** le CSV actuel
2. 📥 **Télécharge** depuis Google Sheets
3. 💾 **Écrit** le nouveau CSV
4. ✔️ **Valide** que `low < median < high`
5. ⚙️ **Génère** le TypeScript
6. 📊 **Affiche** les différences

### Résultat attendu

```
╔═══════════════════════════════════════════════════════════╗
║     ✅ SYNC COMPLETED SUCCESSFULLY                        ║
╚═══════════════════════════════════════════════════════════╝

📊 Changes detected:
  Fashion,Budget,cac: 15,25,40 → 20,40,60

📝 Next steps:
   1. Review the changes above
   2. Test your application: npm run dev
   3. Commit the changes:
      git add data/
      git commit -m "chore: Sync benchmarks from Google Sheets"
      git push
```

### En cas d'erreur

Si la validation échoue (ex: `low >= median`), le script :
- ❌ Annule le changement
- ♻️ Restaure la version précédente
- 📋 Affiche l'erreur avec le numéro de ligne

**Corrigez l'erreur dans Google Sheets** puis relancez `npm run sync:benchmarks`

## 🤖 Synchronisation automatique (GitHub Actions)

### Configuration actuelle

✅ **Activée** : Le workflow GitHub Actions est déjà configuré avec votre Sheet ID

### Déclencheurs

#### 1. Automatique (programmé)

**Fréquence** : Tous les lundis à 9h UTC (11h Paris en hiver, 12h en été)

Le workflow :
1. Télécharge le CSV depuis Google Sheets
2. Valide et génère le TypeScript
3. Commit et push automatiquement si des changements sont détectés

#### 2. Manuel (à la demande)

**Via GitHub** :
1. Aller sur https://github.com/VOTRE_USERNAME/brevo-kpi-benchmark/actions
2. Cliquer sur "Sync Benchmarks from Google Sheets"
3. Cliquer sur "Run workflow"
4. (Optionnel) Personnaliser le message de commit
5. Cliquer sur "Run workflow"

### Monitoring

**Voir les exécutions** :
- GitHub → Actions → Sync Benchmarks from Google Sheets

Chaque exécution affiche :
- ✅ Statut (Success/Failed)
- 📊 Changements détectés
- 🔗 Lien vers le Google Sheet
- 📈 Statistiques (nombre de lignes, industries, etc.)

### Notifications

Par défaut, GitHub vous envoie un email si le workflow échoue.

**Configurer les notifications** :
- GitHub → Settings → Notifications → Actions

## 📅 Workflow recommandé

### Pour les modifications urgentes

```bash
# 1. Modifier dans Google Sheets
# 2. Synchroniser immédiatement
npm run sync:benchmarks

# 3. Tester
npm run dev

# 4. Commit et push
git add data/
git commit -m "chore: Update CAC benchmarks for Fashion Budget"
git push
```

### Pour les modifications planifiées

```bash
# 1. Modifier dans Google Sheets
# 2. Attendre la sync automatique du lundi matin
# 3. Vérifier le commit automatique
# 4. Pull les changements localement
git pull
```

### Pour les gros changements (ex: nouvelle industrie)

```bash
# 1. Créer une branche
git checkout -b feat/add-beauty-industry

# 2. Modifier dans Google Sheets
# 3. Synchroniser
npm run sync:benchmarks

# 4. Tester
npm run build

# 5. Commit et push
git add data/
git commit -m "feat: Add Beauty industry benchmarks"
git push origin feat/add-beauty-industry

# 6. Créer une Pull Request sur GitHub
```

## 🔧 Configuration avancée

### Changer la fréquence de sync automatique

Éditer `.github/workflows/sync-benchmarks.yml` :

```yaml
schedule:
  # Tous les jours à 9h
  - cron: '0 9 * * *'

  # Tous les lundis et vendredis à 9h
  - cron: '0 9 * * 1,5'

  # Toutes les heures
  - cron: '0 * * * *'
```

**Outil de calcul cron** : https://crontab.guru

### Désactiver la sync automatique

**Option 1** : Commenter le schedule

```yaml
# schedule:
#   - cron: '0 9 * * 1'
```

**Option 2** : Désactiver le workflow
- GitHub → Actions → Sync Benchmarks → ⋮ → Disable workflow

### Changer le Google Sheet source

1. **Éditer** `scripts/sync-from-gsheet.js` :
   ```javascript
   const SHEET_ID = 'VOTRE_NOUVEAU_SHEET_ID';
   ```

2. **Éditer** `.github/workflows/sync-benchmarks.yml` :
   ```yaml
   SHEET_ID="VOTRE_NOUVEAU_SHEET_ID"
   ```

3. **Commit** :
   ```bash
   git add scripts/ .github/
   git commit -m "chore: Update Google Sheet source"
   git push
   ```

## 🆘 Dépannage

### Le script local échoue avec "HTTP 403"

**Cause** : Le Google Sheet n'est pas accessible publiquement

**Solution** :
1. Ouvrir le Google Sheet
2. Share → Anyone with the link → **Viewer**
3. Copier le lien
4. Relancer `npm run sync:benchmarks`

### GitHub Actions échoue avec "Downloaded CSV is empty"

**Causes possibles** :
- Sheet non public
- Sheet ID incorrect
- Google Sheets temporairement indisponible

**Solution** :
1. Vérifier que le Sheet est public
2. Vérifier le Sheet ID dans le workflow
3. Déclencher manuellement le workflow pour retenter

### Les changements ne sont pas détectés

**Causes possibles** :
- Le CSV local est déjà à jour
- Le Google Sheet n'a pas été sauvegardé (Ctrl+S)

**Solution** :
```bash
# Forcer le téléchargement
npm run sync:benchmarks

# Vérifier les différences
git diff data/benchmarks.csv
```

### Validation échoue (low >= median)

**Cause** : Erreur de saisie dans Google Sheets

**Solution** :
1. Le script affiche la ligne et la métrique concernée
2. Corriger dans Google Sheets
3. Relancer `npm run sync:benchmarks`

## 📊 Statistiques de sync

### Visualiser l'historique des syncs

```bash
# Voir les commits de sync
git log --grep="Sync benchmarks" --oneline

# Voir les changements du dernier sync
git show HEAD:data/benchmarks.csv
```

### Qui a modifié quoi

```bash
# Historique d'une métrique spécifique
git log -p --all -S "Fashion,Budget,cac" -- data/benchmarks.csv
```

## 🔗 Liens utiles

- **Google Sheet** : https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/edit
- **GitHub Actions** : https://github.com/VOTRE_USERNAME/brevo-kpi-benchmark/actions
- **Script local** : `scripts/sync-from-gsheet.js`
- **Workflow CI/CD** : `.github/workflows/sync-benchmarks.yml`

## ⚡ Commandes rapides

```bash
# Synchroniser depuis Google Sheets
npm run sync:benchmarks

# Synchroniser et tester
npm run sync:benchmarks && npm run build

# Synchroniser et commiter
npm run sync:benchmarks && \
  git add data/ && \
  git commit -m "chore: Sync benchmarks from Google Sheets" && \
  git push

# Voir les changements sans synchroniser
curl -L "https://docs.google.com/spreadsheets/d/1Q6U5y8GLPnY4QZcoRgbJkAGq9LJ20YmXXU1KvJ7NWuQ/export?format=csv" | \
  diff data/benchmarks.csv -
```

## 📝 Bonnes pratiques

### ✅ À faire

- Tester localement avant de push (`npm run sync:benchmarks`)
- Vérifier la validation dans Google Sheets (colonne Validation)
- Committer avec des messages descriptifs
- Utiliser la sync manuelle pour les changements urgents
- Documenter les sources des benchmarks dans les insights

### ❌ À éviter

- Modifier directement `data/retailBenchmarks.ts` (auto-généré)
- Push sans avoir testé localement
- Ignorer les erreurs de validation
- Modifier le CSV directement (utiliser Google Sheets)
- Oublier de pull après une sync automatique

## 🎓 Formation équipe

**Pour onboarder un nouveau collaborateur** :

1. **Accès Google Sheets** :
   - Lui donner accès Editor au Google Sheet
   - Lui montrer la colonne Validation

2. **Workflow de modification** :
   ```
   1. Modifier dans Google Sheets
   2. Vérifier que Validation = ✅
   3. Attendre la sync automatique (lundi 9h)
      OU déclencher manuellement sur GitHub Actions
   4. Pull les changements : git pull
   ```

3. **En cas d'urgence** :
   - Lui donner accès au repo GitHub
   - Lui montrer comment déclencher manuellement le workflow

---

**✨ Votre système de sync automatique est opérationnel !**

Toute modification dans Google Sheets sera automatiquement synchronisée et validée.
