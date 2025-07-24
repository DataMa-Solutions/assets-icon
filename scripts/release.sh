#!/bin/bash

# DataMa Icons Release Script
# Usage: ./scripts/release.sh [patch|minor|major|<version>]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 DataMa Icons Release Script${NC}"
echo "=================================="

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${RED}❌ Error: You must be on the main/master branch to create a release${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Error: Working directory is not clean. Please commit or stash your changes.${NC}"
    git status --short
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "📦 Current version: ${YELLOW}v$CURRENT_VERSION${NC}"

# Determine new version
if [ $# -eq 0 ]; then
    echo "Usage: $0 [patch|minor|major|<version>]"
    echo ""
    echo "Examples:"
    echo "  $0 patch     # 1.0.0 -> 1.0.1"
    echo "  $0 minor     # 1.0.0 -> 1.1.0"
    echo "  $0 major     # 1.0.0 -> 2.0.0"
    echo "  $0 1.2.3     # Set specific version"
    exit 1
fi

VERSION_TYPE=$1

# Calculate new version
if [[ "$VERSION_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+.*$ ]]; then
    # Specific version provided
    NEW_VERSION=$VERSION_TYPE
else
    # Use npm to calculate version
    case $VERSION_TYPE in
        patch|minor|major)
            NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version | sed 's/v//')
            # Reset the version change since we just want to calculate
            git checkout package.json
            ;;
        *)
            echo -e "${RED}❌ Error: Invalid version type '$VERSION_TYPE'${NC}"
            echo "Valid types: patch, minor, major, or specific version (e.g., 1.2.3)"
            exit 1
            ;;
    esac
fi

echo -e "🚀 New version will be: ${GREEN}v$NEW_VERSION${NC}"

# Confirm release
echo ""
read -p "Do you want to create release v$NEW_VERSION? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Release cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔄 Creating release v$NEW_VERSION...${NC}"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# Update package.json version
echo "📝 Updating package.json version..."
npm version $NEW_VERSION --no-git-tag-version --allow-same-version

# Build the project to ensure everything works
echo "🔨 Building project..."
npm run build:all

# Run tests
echo "🧪 Running tests..."
npm test

# Generate release notes with icon changes and contributors
echo "📝 Generating release notes..."

# Get commits since last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LAST_TAG" ]; then
    COMMIT_RANGE="HEAD"
else
    COMMIT_RANGE="$LAST_TAG..HEAD"
fi

# Generate icon changes summary
ICON_CHANGES=""
NEW_ICONS=""
MODIFIED_ICONS=""
REMOVED_ICONS=""

# Check for new/modified/removed SVG files
if [ "$LAST_TAG" != "" ]; then
    NEW_ICONS=$(git diff --name-status $COMMIT_RANGE | grep "^A.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort)
    MODIFIED_ICONS=$(git diff --name-status $COMMIT_RANGE | grep "^M.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort)
    REMOVED_ICONS=$(git diff --name-status $COMMIT_RANGE | grep "^D.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort)
fi

# Build icon changes summary
if [ ! -z "$NEW_ICONS" ]; then
    ICON_CHANGES="${ICON_CHANGES}\n### ✨ New Icons Added\n"
    for icon in $NEW_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
fi

if [ ! -z "$MODIFIED_ICONS" ]; then
    ICON_CHANGES="${ICON_CHANGES}\n### 🔄 Modified Icons\n"
    for icon in $MODIFIED_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
fi

if [ ! -z "$REMOVED_ICONS" ]; then
    ICON_CHANGES="${ICON_CHANGES}\n### ❌ Removed Icons\n"
    for icon in $REMOVED_ICONS; do
        ICON_CHANGES="${ICON_CHANGES}- \`${icon}-svg\`\n"
    done
fi

# Get contributors for this release
CONTRIBUTORS=$(git log --pretty=format:"%an <%ae>" $COMMIT_RANGE | sort | uniq)

# Get total icon count from the build
TOTAL_ICONS=$(node -p "Object.keys(require('./dist/icons.json')).length" 2>/dev/null || echo "133")
CATEGORIES=$(node -p "Object.keys(Object.values(require('./dist/icons.json')).reduce((acc, icon) => { acc[icon.category] = true; return acc; }, {})).length" 2>/dev/null || echo "8")

# Get PR information and contributors with GitHub handles
PR_INFO=""
CONTRIBUTORS_WITH_PR=""

# Try to get PR information from commit messages
PR_COMMITS=$(git log --pretty=format:"%H %s" $COMMIT_RANGE | grep -i "pr\|pull request" || echo "")
if [ ! -z "$PR_COMMITS" ]; then
    PR_INFO="\n### 🔗 Pull Requests\n"
    while IFS= read -r commit; do
        HASH=$(echo "$commit" | awk '{print $1}')
        MESSAGE=$(echo "$commit" | sed 's/^[^ ]* //')
        AUTHOR=$(git log --pretty=format:"%an" -n 1 $HASH)
        PR_INFO="${PR_INFO}- **$MESSAGE** by @$AUTHOR\n"
    done <<< "$PR_COMMITS"
fi

# Create release notes content
RELEASE_NOTES="## DataMa Icons v$NEW_VERSION

🎨 DataMa Icons $NEW_VERSION
Bibliothèque d'icônes DataMa avec $TOTAL_ICONS icônes organisées en $CATEGORIES catégories.

### 📥 Téléchargement direct
Pour les extensions et projets JS :

- **datama-icons-simple.js** - API JavaScript vanilla compatible (2MB)
- **datama-icons-cdn.js** - Système CDN Font Awesome-style (2MB)

Pour le projet Light :

- **datama-icons-light-integration-$NEW_VERSION.zip** - Package d'intégration avec script automatique

Autres fichiers :

- **datama-icons-data.js** - Données des icônes (ES modules)
- **datama-icons-data.json** - Données des icônes (JSON)

### 🚀 Utilisation rapide

**Extensions JS / Projets vanilla :**
\`\`\`html
<!-- Inclure dans votre extension -->
<script src=\"datama-icons-simple.js\"></script>
<script>
  // Utiliser l'API (100% compatible avec ancien système)
  const iconSvg = DataMaIcons.get('home-svg', { size: 24 });
  document.getElementById('myIcon').appendChild(iconSvg);
</script>
\`\`\`

**Vue.js / CDN :**
\`\`\`html
<script src=\"datama-icons-cdn.js\"></script>
<!-- Font Awesome style -->
<i class=\"datama datama-home\"></i>
<i class=\"datama datama-settings\" data-size=\"32\"></i>

<!-- Nouvelle syntaxe avec data-icon -->
<i class=\"datama-icon\" data-icon=\"home-svg\" data-size=\"20\"></i>
\`\`\`

**Projet Light :**
\`\`\`bash
# 1. Télécharger datama-icons-light-integration-$NEW_VERSION.zip
# 2. Extraire et exécuter :
./integrate-icons.sh /chemin/vers/projet/light

# 3. Dans votre code Light :
import { DataMaIcons } from './DataMaIconsNew.js';
const icon = DataMaIcons.get('home-svg');
\`\`\`

### 📦 URLs de téléchargement direct
Vous pouvez télécharger les fichiers directement depuis :

https://github.com/DataMa-Solutions/assets-icon/releases/download/$NEW_VERSION/datama-icons-simple.js

### 🎯 Categories disponibles
- 💼 **Actions** - Contrôles d'interface utilisateur
- 📊 **Data** - Visualisation de données  
- 🎨 **Illustrations** - Illustrations complexes
- 💡 **Light** - Icônes simples et cohérentes
- 🏢 **Logos** - Logos de marques
- 🧭 **Navigation** - Icônes de navigation
- 🎛️ **UI** - Éléments d'interface

### 🚀 Quick Start (NPM)
\`\`\`bash
npm install @datama/icons@$NEW_VERSION
\`\`\`

Or use via CDN:
\`\`\`html
<script src=\"https://cdn.jsdelivr.net/npm/@datama/icons@$NEW_VERSION/dist/DataMaIconsNew.js\"></script>
\`\`\`

$ICON_CHANGES
$PR_INFO
### 👥 Contributors
"

# Add contributors with GitHub handles and PR information
while IFS= read -r contributor; do
    # Extract email and try to get GitHub username
    EMAIL=$(echo "$contributor" | sed 's/.*<\(.*\)>.*/\1/')
    NAME=$(echo "$contributor" | sed 's/\s*<.*>//')
    
    # Try to get GitHub username from git config or common patterns
    GITHUB_USER=""
    if [[ "$EMAIL" == *"@users.noreply.github.com" ]]; then
        GITHUB_USER=$(echo "$EMAIL" | sed 's/@users.noreply.github.com//' | sed 's/^[0-9]*+//')
    elif [[ "$EMAIL" == *"@github.com" ]]; then
        GITHUB_USER=$(echo "$EMAIL" | sed 's/@github.com//')
    elif command -v gh >/dev/null 2>&1; then
        # Try using GitHub CLI if available
        GITHUB_USER=$(gh api user --jq '.login' 2>/dev/null || echo "")
    fi
    
    # Get commit count for this contributor
    COMMIT_COUNT=$(git log --pretty=format:"%an" $COMMIT_RANGE | grep -c "$NAME" || echo "1")
    
    if [ ! -z "$GITHUB_USER" ]; then
        RELEASE_NOTES="${RELEASE_NOTES}- **$NAME** (@$GITHUB_USER) - $COMMIT_COUNT commit(s)\n"
    else
        RELEASE_NOTES="${RELEASE_NOTES}- **$NAME** - $COMMIT_COUNT commit(s)\n"
    fi
done <<< "$CONTRIBUTORS"

RELEASE_NOTES="${RELEASE_NOTES}\n### 📚 Full Changelog
See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.

---


# Commit version change and updated files
echo "💾 Committing version change and updated files..."
git add .
git commit -m "🔖 Bump version to v$NEW_VERSION

📝 Updated files with new icons and documentation

$ICON_CHANGES"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin $CURRENT_BRANCH
git push origin "v$NEW_VERSION"

# Create GitHub release with generated notes
echo "📋 Creating GitHub release..."
if command -v gh >/dev/null 2>&1; then
    echo -e "$RELEASE_NOTES" | gh release create "v$NEW_VERSION" --title "DataMa Icons v$NEW_VERSION" --notes-file -
    echo -e "${GREEN}✅ GitHub release created with detailed icon changes and contributors!${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Release notes generated but not published to GitHub.${NC}"
    echo -e "${BLUE}Release notes:${NC}"
    echo -e "$RELEASE_NOTES"
fi

echo ""
echo -e "${GREEN}✅ Release v$NEW_VERSION created successfully!${NC}"
echo ""
echo -e "${BLUE}📋 What happens next:${NC}"
echo "1. 🤖 GitHub Actions will automatically build and test the release"
echo "2. 📦 NPM package will be published automatically"
echo "3. ☁️  Files will be deployed to Google Cloud Storage"
echo "4. 📄 GitHub release will be created with changelog"
echo ""
echo -e "${BLUE}🌐 Once deployed, the release will be available at:${NC}"
echo "   • NPM: npm install @datama/icons@$NEW_VERSION"
echo "   • CDN Latest: \$GCS_CDN_URL/latest/"
echo "   • CDN Version: \$GCS_CDN_URL/releases/$NEW_VERSION/"
echo ""
echo -e "${YELLOW}📺 Monitor the release progress at:${NC}"
echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')/actions" 