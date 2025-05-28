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

# Commit version change
echo "💾 Committing version change..."
git add package.json
git commit -m "🔖 Bump version to v$NEW_VERSION"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin $CURRENT_BRANCH
git push origin "v$NEW_VERSION"

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