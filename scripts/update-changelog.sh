#!/bin/bash

# DataMa Icons Changelog Updater
# Usage: ./scripts/update-changelog.sh [version] [last_tag]

set -e

VERSION=${1:-""}
LAST_TAG=${2:-""}

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

echo "📝 Updating CHANGELOG.md for v$VERSION"
echo "   Commit range: $COMMIT_RANGE"

# Get dynamic counts
TOTAL_ICONS=$(find icons -name "*.svg" 2>/dev/null | wc -l | tr -d ' ' || echo "150")
CATEGORIES=$(find icons -type d -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ' || echo "8")

# Get commits with conventional naming
FEAT_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- feat:" || echo "")
FIX_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- fix:" || echo "")
DOCS_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep "^- docs:" || echo "")
OTHER_COMMITS=$(git log --pretty=format:"- %s" $COMMIT_RANGE 2>/dev/null | grep -v "^- \(feat\|fix\|docs\|Merge\):" || echo "")

# Get icon changes
NEW_ICONS=""
MODIFIED_ICONS=""
if [[ "$LAST_TAG" != "" ]]; then
    NEW_ICONS=$(git diff --name-status $COMMIT_RANGE 2>/dev/null | grep "^A.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort || echo "")
    MODIFIED_ICONS=$(git diff --name-status $COMMIT_RANGE 2>/dev/null | grep "^M.*\.svg$" | awk '{print $2}' | sed 's|icons/[^/]*/||' | sed 's|\.svg||' | sort || echo "")
fi

# Get current date
CURRENT_DATE=$(date +"%Y-%m-%d")

# Build the new changelog entry
NEW_ENTRY="## [${VERSION}] - ${CURRENT_DATE}

### ✨ Nouvelles fonctionnalités"

if [[ ! -z "$FEAT_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$FEAT_COMMITS" | sed 's/^- feat:/- **Feat:**/')"
fi

if [[ ! -z "$NEW_ICONS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
- **Nouvelles icônes**: Ajout de $(echo "$NEW_ICONS" | wc -w | tr -d ' ') nouvelles icônes"
    NEW_ENTRY="${NEW_ENTRY} ($(echo "$NEW_ICONS" | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g'))"
fi

NEW_ENTRY="${NEW_ENTRY}

### 🛠️ Améliorations techniques"

if [[ ! -z "$FIX_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$FIX_COMMITS" | sed 's/^- fix:/- **Fix:**/')"
fi

if [[ ! -z "$MODIFIED_ICONS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
- **Icônes améliorées**: Redesign de $(echo "$MODIFIED_ICONS" | wc -w | tr -d ' ') icônes"
    NEW_ENTRY="${NEW_ENTRY} ($(echo "$MODIFIED_ICONS" | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g'))"
fi

if [[ ! -z "$DOCS_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}

### 📖 Documentation
$(echo "$DOCS_COMMITS" | sed 's/^- docs:/- **Docs:**/')"
fi

NEW_ENTRY="${NEW_ENTRY}

### 📊 Statistiques
- **${TOTAL_ICONS} icônes** organisées en **${CATEGORIES} catégories**
- Support complet du mode invert et nouvelles fonctionnalités

### 🔄 Commits inclus"

if [[ ! -z "$FEAT_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$FEAT_COMMITS")"
fi

if [[ ! -z "$FIX_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$FIX_COMMITS")"
fi

if [[ ! -z "$DOCS_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$DOCS_COMMITS")"
fi

if [[ ! -z "$OTHER_COMMITS" ]]; then
    NEW_ENTRY="${NEW_ENTRY}
$(echo "$OTHER_COMMITS")"
fi

NEW_ENTRY="${NEW_ENTRY}

### 🔄 Compatibilité
- Aucune rupture de compatibilité - l'API reste identique
- Nouvelles options disponibles sans impact sur l'existant

---

"

# Check if the version already exists in changelog
if grep -q "## \[${VERSION}\]" CHANGELOG.md 2>/dev/null; then
    echo "⚠️  Version $VERSION already exists in CHANGELOG.md"
    echo "   Replacing existing entry..."
    
    # Create temp file with updated content
    awk -v version="$VERSION" -v new_entry="$NEW_ENTRY" '
        BEGIN { in_section = 0; found = 0 }
        /^## \[/ {
            if ($0 ~ "\\[" version "\\]") {
                print new_entry
                in_section = 1
                found = 1
                next
            } else if (in_section) {
                in_section = 0
            }
        }
        !in_section { print }
        END { 
            if (!found) {
                print "ERROR: Version not found for replacement" > "/dev/stderr"
                exit 1
            }
        }
    ' CHANGELOG.md > CHANGELOG.md.tmp && mv CHANGELOG.md.tmp CHANGELOG.md
else
    echo "✅ Adding new version $VERSION to CHANGELOG.md"
    
    # Add new entry at the top (after the title)
    {
        head -n 2 CHANGELOG.md
        echo "$NEW_ENTRY"
        tail -n +3 CHANGELOG.md
    } > CHANGELOG.md.tmp && mv CHANGELOG.md.tmp CHANGELOG.md
fi

echo "✅ CHANGELOG.md updated successfully for v$VERSION"
echo "📊 Statistics: $TOTAL_ICONS icons, $CATEGORIES categories"
