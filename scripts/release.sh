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

# Create release notes content
RELEASE_NOTES="## DataMa Icons v$NEW_VERSION

### 🚀 Quick Start
\`\`\`bash
npm install @datama/icons@$NEW_VERSION
\`\`\`

Or use via CDN:
\`\`\`html
<script src=\"https://cdn.jsdelivr.net/npm/@datama/icons@$NEW_VERSION/dist/DataMaIconsNew.js\"></script>
\`\`\`
$ICON_CHANGES
### 👥 Contributors
"

# Add contributors with GitHub handles
while IFS= read -r contributor; do
    # Extract email and try to get GitHub username
    EMAIL=$(echo "$contributor" | sed 's/.*<\(.*\)>.*/\1/')
    NAME=$(echo "$contributor" | sed 's/\s*<.*>//')
    
    # Try to get GitHub username from git config or common patterns
    GITHUB_USER=""
    if [[ "$EMAIL" == *"@users.noreply.github.com" ]]; then
        GITHUB_USER=$(echo "$EMAIL" | sed 's/@users.noreply.github.com//' | sed 's/^[0-9]*+//')
    elif command -v gh >/dev/null 2>&1; then
        # Try using GitHub CLI if available
        GITHUB_USER=$(gh api user --jq '.login' 2>/dev/null || echo "")
    fi
    
    if [ ! -z "$GITHUB_USER" ]; then
        RELEASE_NOTES="${RELEASE_NOTES}- $NAME (@$GITHUB_USER)\n"
    else
        RELEASE_NOTES="${RELEASE_NOTES}- $NAME\n"
    fi
done <<< "$CONTRIBUTORS"

RELEASE_NOTES="${RELEASE_NOTES}\n### 📚 Full Changelog
See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.

---
*🤖 Generated with [Claude Code](https://claude.ai/code)*"

# Commit version change and updated files
echo "💾 Committing version change and updated files..."
git add .
git commit -m "🔖 Bump version to v$NEW_VERSION

📝 Updated files with new icons and documentation

$ICON_CHANGES

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

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