# 🚀 Guide de Release - DataMa Icons

Ce guide explique comment créer une nouvelle release de la librairie d'icônes DataMa.

## 🔄 Nouveau Workflow de Release

### Concept
Le système de release a été reconfiguré pour **ne se déclencher que sur les tags** au lieu de chaque push vers main. Cela vous donne un contrôle total sur quand publier une nouvelle version.

### Architecture
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Pull Request  │ → │ Tests Only   │    │   Tag Push      │
│                 │    │              │    │                 │
│ • Tests         │    │ • Build      │    │ • Build         │
│ • Build preview │    │ • Tests      │    │ • Tests         │
│ • Comments      │    │ • PR Comment │    │ • NPM Publish   │
└─────────────────┘    └──────────────┘    │ • GCS Deploy    │
                                           │ • GitHub Release│
                                           └─────────────────┘
```

## 📋 Processus de Release

### Étape 1: Préparer les changements
```bash
# Ajouter de nouveaux SVG dans le dossier racine
cp new-icon.svg .

# Créer une PR pour review
git checkout -b add-new-icons
git add *.svg
git commit -m "Add new icons: new-icon"
git push origin add-new-icons
```

### Étape 2: Review et merge
- La PR déclenchera automatiquement les tests
- Un commentaire sera ajouté avec le preview des changements
- **Merger la PR ne déclenche PAS de release**

### Étape 3: Créer la release
Utilisez le script automatisé :

```bash
# Release patch (1.0.0 → 1.0.1)
./scripts/release.sh patch

# Release minor (1.0.0 → 1.1.0)
./scripts/release.sh minor

# Release major (1.0.0 → 2.0.0)
./scripts/release.sh major

# Version spécifique
./scripts/release.sh 1.2.3
```

#### Ou manuellement :
```bash
# S'assurer d'être sur main et à jour
git checkout main
git pull origin main

# Mettre à jour la version dans package.json
npm version patch  # ou minor, major

# Créer et pousser le tag
git tag v$(node -p "require('./package.json').version")
git push origin main
git push origin --tags
```

## 🌐 Déploiement GCS

### Structure des fichiers déployés
```
gs://your-bucket/
├── latest/                     # Version la plus récente
│   ├── icons.js
│   ├── icons.json
│   ├── dist/
│   └── version.json
├── releases/
│   ├── 1.0.0/                 # Version spécifique
│   │   ├── icons.js
│   │   ├── icons.json
│   │   ├── dist/
│   │   └── version.json
│   └── 1.0.1/
└── archives/
    ├── datama-icons-1.0.0.zip
    └── datama-icons-1.0.1.tar.gz
```

### Configuration requise

Ajoutez ces secrets dans votre repository GitHub :

```bash
# Google Cloud
GCP_SERVICE_ACCOUNT_KEY   # JSON key pour l'authentification GCS
GCS_BUCKET               # Nom du bucket GCS (ex: datama-icons-cdn)
GCS_CDN_URL             # URL CDN publique (ex: https://cdn.datama.io)

# NPM (existant)
NPM_TOKEN               # Token pour publier sur NPM
```

### Service Account GCP
Le service account doit avoir les permissions :
- `Storage Object Admin` sur le bucket
- `Storage Legacy Bucket Writer` (optionnel pour les headers)

## 📦 Utilisation des releases

### NPM
```bash
npm install @datama/icons@1.0.1
```

### CDN (GCS)
```html
<!-- Dernière version -->
<script src="https://cdn.datama.io/latest/icons.js"></script>

<!-- Version spécifique -->
<script src="https://cdn.datama.io/releases/1.0.1/icons.js"></script>

<!-- Vue components -->
<script src="https://cdn.datama.io/latest/dist/vue/index.js"></script>
```

### API pour vérifier les versions
```javascript
// Obtenir la dernière version
fetch('https://cdn.datama.io/latest/version.json')
  .then(r => r.json())
  .then(data => console.log(data.version, data.icon_count));

// Charger les icônes
fetch('https://cdn.datama.io/latest/icons.json')
  .then(r => r.json())
  .then(icons => console.log('Icons loaded:', Object.keys(icons).length));
```

## 🔧 Scripts npm

```bash
# Test local avant release
npm run build:all
npm test

# Script de release automatique
npm run release:patch   # → ./scripts/release.sh patch
npm run release:minor   # → ./scripts/release.sh minor
npm run release:major   # → ./scripts/release.sh major
```

## 📊 Monitoring

### GitHub Actions
- Surveillez les builds : `https://github.com/your-org/assets-icon/actions`
- Les logs GCS apparaissent dans l'étape "Deploy to GCS"

### Vérifications post-release
```bash
# Vérifier NPM
npm view @datama/icons version

# Vérifier GCS
curl -s https://cdn.datama.io/latest/version.json | jq .

# Vérifier GitHub release
gh release list
```

## ❗ Troubleshooting

### La release ne se déclenche pas
- ✅ Vérifiez que le tag commence par `v` (ex: `v1.0.1`)
- ✅ Assurez-vous d'avoir pushé le tag : `git push origin v1.0.1`
- ✅ Vérifiez les permissions GitHub Actions

### Erreur GCS
- ✅ Vérifiez que `GCP_SERVICE_ACCOUNT_KEY` est valide
- ✅ Confirmez les permissions du service account
- ✅ Vérifiez que `GCS_BUCKET` existe et est accessible

### Rollback d'une release
```bash
# Supprimer le tag localement et à distance
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1

# Supprimer la release GitHub (manuellement via l'interface)
# Les packages NPM ne peuvent pas être "non-publiés" après 24h
```
