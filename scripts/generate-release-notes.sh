#!/bin/bash

# DataMa Icons Release Notes Generator
# Usage: ./scripts/generate-release-notes.sh [version] [last_tag] [format]
# Format: markdown (default) | github-actions

set -e

VERSION=${1:-""}
LAST_TAG=${2:-""}
FORMAT=${3:-"markdown"}

# Colors for output (only in interactive mode)
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    BLUE=''
    YELLOW=''
    NC=''
fi

# Get version if not provided
if [[ -z "$VERSION" ]]; then
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")
fi

# Get last tag if not provided
if [[ -z "$LAST_TAG" ]]; then
    LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
fi

# Set commit range
if [[ -z "$LAST_TAG" ]]; then
    COMMIT_RANGE="HEAD"
else
    COMMIT_RANGE="$LAST_TAG..HEAD"
fi

echo -e "${BLUE}📝 Generating release notes for v$VERSION${NC}" >&2
echo -e "${BLUE}   Commit range: $COMMIT_RANGE${NC}" >&2

# Get dynamic counts
TOTAL_ICONS=$(find icons -name "*.svg" 2>/dev/null | wc -l | tr -d ' ' || echo "150")
CATEGORIES=$(find icons -type d -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ' || echo "8")

echo -e "${BLUE}   Icons: $TOTAL_ICONS, Categories: $CATEGORIES${NC}" >&2

# Get commits with conventional naming
FEAT_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- feat:" || echo "")
FIX_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- fix:" || echo "")
DOCS_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- docs:" || echo "")
OTHER_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep -v "^- \(feat\|fix\|docs\):" || echo "")

# Get icon changes
NEW_ICONS=""
MODIFIED_ICONS=""
REMOVED_ICONS=""

if [[ "$LAST_TAG" != "" ]]; then
    NEW_ICONS=$(git diff --name-status $COMMIT_RANGE 2>/dev/null | grep "^A.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort || echo "")
    MODIFIED_ICONS=$(git diff --name-status $COMMIT_RANGE 2>/dev/null | grep "^M.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort || echo "")
    REMOVED_ICONS=$(git diff --name-status $COMMIT_RANGE 2>/dev/null | grep "^D.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort || echo "")
fi

# Build icon changes section
ICON_CHANGES=""
if [[ ! -z "$NEW_ICONS" ]]; then
    ICON_CHANGES="${ICON_CHANGES}### ✨ New Icons Added\n"
    for icon in $NEW_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
    ICON_CHANGES="${ICON_CHANGES}\n"
fi

if [[ ! -z "$MODIFIED_ICONS" ]]; then
    ICON_CHANGES="${ICON_CHANGES}### 🔄 Modified Icons\n"
    for icon in $MODIFIED_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
    ICON_CHANGES="${ICON_CHANGES}\n"
fi

if [[ ! -z "$REMOVED_ICONS" ]]; then
    ICON_CHANGES="${ICON_CHANGES}### ❌ Removed Icons\n"
    for icon in $REMOVED_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
    ICON_CHANGES="${ICON_CHANGES}\n"
fi

# Build commits section
COMMITS_SECTION=""
if [[ ! -z "$FEAT_COMMITS" ]]; then
    COMMITS_SECTION="${COMMITS_SECTION}#### ✨ Nouvelles fonctionnalités\n${FEAT_COMMITS}\n\n"
fi
if [[ ! -z "$FIX_COMMITS" ]]; then
    COMMITS_SECTION="${COMMITS_SECTION}#### 🐛 Corrections\n${FIX_COMMITS}\n\n"
fi
if [[ ! -z "$DOCS_COMMITS" ]]; then
    COMMITS_SECTION="${COMMITS_SECTION}#### 📚 Documentation\n${DOCS_COMMITS}\n\n"
fi
if [[ ! -z "$OTHER_COMMITS" ]]; then
    COMMITS_SECTION="${COMMITS_SECTION}#### 🔄 Autres changements\n${OTHER_COMMITS}\n\n"
fi

# Generate release notes based on format
if [[ "$FORMAT" == "github-actions" ]]; then
    # Format for GitHub Actions (no line breaks, escaped for YAML)
    cat << EOF
## 🎨 DataMa Icons $VERSION

Bibliothèque d'icônes DataMa avec **$TOTAL_ICONS icônes** organisées en **$CATEGORIES catégories**.

### 📥 Téléchargement direct

**Pour les extensions et projets JS :**
- \`datama-icons-simple.js\` - API JavaScript vanilla compatible (2MB)
- \`datama-icons-cdn.js\` - Système CDN Font Awesome-style (2MB)

**Pour le projet Light :**
- \`datama-icons-light-integration-$VERSION.zip\` - Package d'intégration avec script automatique

**Autres fichiers :**
- \`datama-icons-data.js\` - Données des icônes (ES modules)
- \`datama-icons-data.json\` - Données des icônes (JSON)

### 🚀 Utilisation rapide

**Extensions JS / Projets vanilla :**
\`\`\`html
<!-- Inclure dans votre extension -->
<script src="datama-icons-simple.js"></script>
<script>
  // Utiliser l'API (100% compatible avec ancien système)
  const iconSvg = DataMaIcons.get('home-svg', { size: 24 });
  document.getElementById('myIcon').appendChild(iconSvg);
</script>
\`\`\`

**Projet Light :**
\`\`\`bash
# 1. Télécharger datama-icons-light-integration-$VERSION.zip
# 2. Extraire et exécuter :
./integrate-icons.sh /chemin/vers/projet/light

# 3. Dans votre code Light :
import { DataMaIcons } from './DataMaIconsNew.js';
const icon = DataMaIcons.get('home-svg');
\`\`\`

**Vue.js / CDN :**
\`\`\`html
<script src="datama-icons-cdn.js"></script>
<!-- Syntaxe recommandée avec data-icon -->
<i class="datama-icon" data-icon="home-svg" data-size="20"></i>
<i class="datama-icon" data-icon="settings-svg" data-size="32"></i>
<i class="datama-icon" data-icon="excel-svg"></i>

<!-- Mode invert disponible -->
<i class="datama-icon" data-icon="journey-svg" data-invert="true"></i>
\`\`\`

### 📦 URLs de téléchargement direct

Vous pouvez télécharger les fichiers directement depuis :
\`\`\`
https://github.com/DataMa-Solutions/assets-icon/releases/download/$VERSION/datama-icons-simple.js
\`\`\`

### 🎯 Categories disponibles

- 💼 **Actions** - Contrôles d'interface utilisateur
- 📊 **Data** - Visualisation de données  
- 🎨 **Illustrations** - Illustrations complexes
- 💡 **Light** - Icônes simples et cohérentes
- 🏢 **Logos** - Logos de marques
- 🧭 **Navigation** - Icônes de navigation
- 🔗 **Sources** - Connecteurs de données
- 🎛️ **UI** - Éléments d'interface

$ICON_CHANGES

### 📝 Commits inclus dans cette release

$COMMITS_SECTION

### 📚 Full Changelog
See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.
EOF
else
    # Standard markdown format
    cat << EOF
## DataMa Icons v$VERSION

🎨 DataMa Icons $VERSION
Bibliothèque d'icônes DataMa avec $TOTAL_ICONS icônes organisées en $CATEGORIES catégories.

### 📥 Téléchargement direct
Pour les extensions et projets JS :

- **datama-icons-simple.js** - API JavaScript vanilla compatible (2MB)
- **datama-icons-cdn.js** - Système CDN Font Awesome-style (2MB)

Pour le projet Light :

- **datama-icons-light-integration-$VERSION.zip** - Package d'intégration avec script automatique

Autres fichiers :

- **datama-icons-data.js** - Données des icônes (ES modules)
- **datama-icons-data.json** - Données des icônes (JSON)

### 🚀 Utilisation rapide

**Extensions JS / Projets vanilla :**
\`\`\`html
<!-- Inclure dans votre extension -->
<script src="datama-icons-simple.js"></script>
<script>
  // Utiliser l'API (100% compatible avec ancien système)
  const iconSvg = DataMaIcons.get('home-svg', { size: 24 });
  document.getElementById('myIcon').appendChild(iconSvg);
</script>
\`\`\`

**Vue.js / CDN :**
\`\`\`html
<script src="datama-icons-cdn.js"></script>
<!-- Syntaxe recommandée avec data-icon -->
<i class="datama-icon" data-icon="home-svg" data-size="20"></i>
<i class="datama-icon" data-icon="settings-svg" data-size="32"></i>
<i class="datama-icon" data-icon="excel-svg"></i>

<!-- Mode invert disponible -->
<i class="datama-icon" data-icon="journey-svg" data-invert="true"></i>
\`\`\`

**Projet Light :**
\`\`\`bash
# 1. Télécharger datama-icons-light-integration-$VERSION.zip
# 2. Extraire et exécuter :
./integrate-icons.sh /chemin/vers/projet/light

# 3. Dans votre code Light :
import { DataMaIcons } from './DataMaIconsNew.js';
const icon = DataMaIcons.get('home-svg');
\`\`\`

### 📦 URLs de téléchargement direct
Vous pouvez télécharger les fichiers directement depuis :

https://github.com/DataMa-Solutions/assets-icon/releases/download/$VERSION/datama-icons-simple.js

### 🎯 Categories disponibles
- 💼 **Actions** - Contrôles d'interface utilisateur
- 📊 **Data** - Visualisation de données  
- 🎨 **Illustrations** - Illustrations complexes
- 💡 **Light** - Icônes simples et cohérentes
- 🏢 **Logos** - Logos de marques
- 🧭 **Navigation** - Icônes de navigation
- 🔗 **Sources** - Connecteurs de données
- 🎛️ **UI** - Éléments d'interface

### 🚀 Quick Start (NPM)
\`\`\`bash
npm install @datama/icons@$VERSION
\`\`\`

Or use via CDN:
\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/@datama/icons@$VERSION/dist/DataMaIconsNew.js"></script>
\`\`\`

$ICON_CHANGES

### 📝 Commits inclus dans cette release

$COMMITS_SECTION
### 📚 Full Changelog
See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.

---
EOF
fi
