# 🤖 Guide pour Claude Code

Ce fichier contient les directives pour Claude Code lors du développement sur ce projet.

## 📁 Structure du projet

```
app/              # Next.js App Router
components/       # Composants React réutilisables
data/            # Benchmarks (CSV + TypeScript généré)
utils/           # Logique métier (benchmarkUtils.ts)
tests/           # Tests unitaires (Vitest)
scripts/         # Scripts utilitaires (génération, sync)
docs/            # Documentation
```

## 🧪 Protocole de Tests et Debugging

### ❌ NE JAMAIS créer de fichiers de test/debug à la racine

**Interdits** :
- `test_*.txt`, `test_*.js` à la racine
- `debug_*.txt`, `debug_*.log` à la racine
- Fichiers temporaires sans extension

### ✅ À la place, utiliser

#### 1. Tests unitaires (tests/)

```bash
# Créer dans tests/
tests/
├── benchmarkUtils.test.ts
├── components/
│   └── BenchmarkGrid.test.tsx
└── api/
    └── analyze.test.ts
```

**Commande** :
```bash
npm test
```

#### 2. Tests d'intégration (tests/e2e/)

```bash
# Tests Playwright
tests/e2e/
├── v2.spec.ts
├── v3.spec.ts
└── v4.spec.ts
```

**Commande** :
```bash
npx playwright test
```

#### 3. Scripts de test temporaires (.dev-tests/)

**Pour les tests API ou debugging ponctuel** :

```bash
# Créer dans .dev-tests/ (gitignored)
.dev-tests/
├── test-dust-api.js
├── debug-benchmark-calc.js
└── temp-data-validation.ts
```

**Exécution** :
```bash
node .dev-tests/test-dust-api.js
```

**Note** : Ce dossier est dans .gitignore et ne sera jamais commité.

#### 4. Logs de debug (console.log)

**Pour du debugging temporaire** :
```typescript
// Utiliser console.log directement dans le code
console.log('Debug:', variable);

// Retirer avant commit
```

#### 5. Fichiers de sortie (.dev-tests/output/)

**Pour capturer des sorties de tests** :
```bash
.dev-tests/output/
├── api-response-1.json
├── benchmark-calc-result.json
└── dust-analysis.txt
```

### 🔄 Workflow de test recommandé

#### Pour tester une nouvelle fonctionnalité

```bash
# 1. Créer un test unitaire
touch tests/nouvelle-feature.test.ts

# 2. Écrire le test
# tests/nouvelle-feature.test.ts

# 3. Implémenter la feature
# utils/nouvelle-feature.ts

# 4. Lancer les tests
npm test

# 5. Commit (tests + code)
git add tests/ utils/
git commit -m "feat: Ajouter nouvelle feature avec tests"
```

#### Pour débugger une API externe

```bash
# 1. Créer un script de test temporaire
touch .dev-tests/test-api.js

# 2. Tester l'API
node .dev-tests/test-api.js > .dev-tests/output/result.txt

# 3. Analyser le résultat
cat .dev-tests/output/result.txt

# 4. Nettoyer (optionnel, car gitignored)
rm .dev-tests/test-api.js
```

#### Pour valider des calculs complexes

```bash
# 1. Créer un test interactif temporaire
touch .dev-tests/validate-calculation.ts

# 2. Exécuter avec tsx
npx tsx .dev-tests/validate-calculation.ts

# 3. Une fois validé, transformer en test unitaire
mv .dev-tests/validate-calculation.ts tests/calculation.test.ts

# 4. Adapter au format Vitest
# ...

# 5. Commit le test unitaire
git add tests/calculation.test.ts
git commit -m "test: Add calculation validation tests"
```

## 📝 Conventions de nommage

### Tests unitaires (tests/)

```
tests/
├── <module>.test.ts          # Tests d'un module utils
├── components/
│   └── <Component>.test.tsx  # Tests de composant
└── api/
    └── <route>.test.ts       # Tests de route API
```

### Tests E2E (tests/e2e/)

```
tests/e2e/
└── <feature>.spec.ts         # Tests end-to-end Playwright
```

### Scripts temporaires (.dev-tests/)

```
.dev-tests/
├── test-<description>.js     # Scripts de test ad-hoc
├── debug-<feature>.ts        # Scripts de debug
└── output/                   # Sorties de tests
    └── <timestamp>-result.json
```

## 🛠️ Outils de test disponibles

### Vitest (tests unitaires)

```bash
# Lancer tous les tests
npm test

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui

# Coverage
npm test -- --coverage
```

### Playwright (tests E2E)

```bash
# Lancer les tests E2E
npx playwright test

# Mode UI
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

### Scripts personnalisés

```bash
# Générer benchmarks
npm run generate:benchmarks

# Synchroniser depuis Google Sheets
npm run sync:benchmarks
```

## 🔍 Debugging

### VS Code Launch Configuration

Créer `.vscode/launch.json` :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Vitest",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Chrome DevTools

Pour débugger l'API Next.js :

```bash
NODE_OPTIONS='--inspect' npm run dev
```

Puis ouvrir `chrome://inspect`

## ✅ Checklist avant commit

- [ ] Tests unitaires passent (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Pas de fichiers de test/debug à la racine
- [ ] `.dev-tests/` contient uniquement du temporaire (optionnel à nettoyer)
- [ ] Types TypeScript sont valides (`npx tsc --noEmit`)
- [ ] Linter passe (`npm run lint`)

## 🚫 Anti-patterns à éviter

### ❌ Créer des fichiers temporaires à la racine

```bash
# MAUVAIS
touch test_output.txt
node script.js > debug.log
echo "test" > temp.json
```

```bash
# BON
mkdir -p .dev-tests/output
node script.js > .dev-tests/output/result.txt
```

### ❌ Commiter des console.log de debug

```typescript
// MAUVAIS (à commiter)
console.log('DEBUG USER VALUES:', userValues);
const result = calculateScore(userValues);
console.log('DEBUG RESULT:', result);
```

```typescript
// BON (retiré avant commit)
const result = calculateScore(userValues);
```

### ❌ Tests sans assertions

```typescript
// MAUVAIS
test('should work', () => {
  const result = myFunction();
  console.log(result); // Pas d'assertion !
});
```

```typescript
// BON
test('should return correct value', () => {
  const result = myFunction(5);
  expect(result).toBe(10);
});
```

## 📚 Ressources

- **Documentation projet** : [docs/](docs/)
- **Guide développeur** : [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Tests** : [tests/](tests/)
- **Vitest Docs** : https://vitest.dev
- **Playwright Docs** : https://playwright.dev
