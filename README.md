# @datama/icons

DataMa icon library with 144 icons, available as Vue 2 components and JSON data.

## Installation

```bash
npm install @datama/icons
```

## Usage

### NEW: JavaScript API (Recommended)

The library now includes a new JavaScript API (`DataMaIconsNew`) with improved functionality:

#### For ES6 Modules (import/export) - DataMa Light Project

```javascript
// Use the ES6 module version for projects with import/export
import { DataMaIconsNew } from '@datama/icons/dist/DataMaIconsNew.esm.js';

// Create an icon element
const cogIcon = DataMaIconsNew.get('cog-svg', {
    size: 32,
    fill: '#007acc'
});
document.body.appendChild(cogIcon);

// Search icons by tag
const navigationIcons = DataMaIconsNew.searchByTag('navigation');
console.log('Navigation icons:', navigationIcons);
```

#### For Script Tags (vanilla HTML)

```html
<!-- Load the vanilla JS version -->
<script src="node_modules/@datama/icons/dist/DataMaIconsNew.js"></script>

<script>
// Create an icon element
const homeIcon = DataMaIconsNew.get('home-svg', {
    size: 24,
    fill: 'currentColor'
});
document.getElementById('my-container').appendChild(homeIcon);

// Get all available icons
console.log('Available icons:', DataMaIconsNew.getAvailableIcons());
</script>
```

### Legacy: As JSON data (for vanilla JS projects)

```javascript
import { DataMaLightIconsNew } from '@datama/icons';
// or
const { DataMaLightIconsNew } = require('@datama/icons');

// Use icon data
const checkIcon = DataMaLightIconsNew['check-svg'];
console.log(checkIcon.content); // SVG content data
```

### As Vue 2 components

```javascript
import Vue from 'vue';
import DatamaIcons from '@datama/icons/vue';

Vue.use(DatamaIcons);
```

```vue
<template>
  <div>
    <!-- Using specific icon component -->
    <IconCheck :size="24" fill="blue" />
    
    <!-- Using generic icon component -->
    <IconGeneric name="check" :size="24" fill="blue" />
  </div>
</template>
```

### Available props for Vue components

- `size`: Number or string (default: 24)
- `width`: Number or string (overrides size)
- `height`: Number or string (overrides size)  
- `fill`: String (default: 'currentColor')
- `stroke`: String (default: 'none')
- `strokeWidth`: Number or string (default: 0)
- `class`: String, object, or array for additional CSS classes

### DataMaIconsNew API Methods

The new JavaScript API provides these methods:

```javascript
// Get an icon as DOM element
DataMaIconsNew.get(iconName, options)

// Get all available icon names
DataMaIconsNew.getAvailableIcons()

// Search icons by tag
DataMaIconsNew.searchByTag(tagName)

// Get icon raw data
DataMaIconsNew.getIconData(iconName)

// Generate SVG as string
DataMaIconsNew.toSvg(iconName, options)

// Replace data-datama attributes in DOM
DataMaIconsNew.replace(options)
```

#### Options for `get()` and `toSvg()` methods:

- `size`: Number (default: 24) - Sets both width and height
- `width`: Number - Override width specifically  
- `height`: Number - Override height specifically
- `fill`: String (default: 'currentColor') - Icon color, use 'original' for original colors
- `stroke`: String (default: 'none') - Stroke color
- `strokeWidth`: Number (default: 0) - Stroke width
- `className`: String - CSS class name(s)
- `invert`: Boolean (default: false) - Invert colors (white ↔ colored)

## Available Icons (144)

| Nom de l'icône | Aperçu |
|:-------------- |:------:|
| `add-folder-svg` | <img src="icons/actions/add-folder.svg" width="32" height="32" alt="add-folder" /> |
| `alert-circle-svg` | <img src="icons/light/alert-circle.svg" width="32" height="32" alt="alert-circle" /> |
| `alert-triangle-svg` | <img src="icons/light/alert-triangle.svg" width="32" height="32" alt="alert-triangle" /> |
| `area-chart-svg` | <img src="icons/light/area-chart.svg" width="32" height="32" alt="area-chart" /> |
| `arrow-bottom-svg` | <img src="icons/light/arrow-bottom.svg" width="32" height="32" alt="arrow-bottom" /> |
| `arrow-down-right-svg` | <img src="icons/light/arrow-down-right.svg" width="32" height="32" alt="arrow-down-right" /> |
| `arrow-left-svg` | <img src="icons/light/arrow-left.svg" width="32" height="32" alt="arrow-left" /> |
| `arrow-right-svg` | <img src="icons/light/arrow-right.svg" width="32" height="32" alt="arrow-right" /> |
| `arrow-top-svg` | <img src="icons/light/arrow-top.svg" width="32" height="32" alt="arrow-top" /> |
| `arrow-up-right-svg` | <img src="icons/light/arrow-up-right.svg" width="32" height="32" alt="arrow-up-right" /> |
| `assess-svg` | <img src="icons/data/assess.svg" width="32" height="32" alt="assess" /> |
| `balance-scale-svg` | <img src="icons/light/balance-scale.svg" width="32" height="32" alt="balance-scale" /> |
| `books-svg` | <img src="icons/light/books.svg" width="32" height="32" alt="books" /> |
| `chat-svg` | <img src="icons/light/chat.svg" width="32" height="32" alt="chat" /> |
| `check-svg` | <img src="icons/ui/check.svg" width="32" height="32" alt="check" /> |
| `chevron-down-svg` | <img src="icons/light/chevron-down.svg" width="32" height="32" alt="chevron-down" /> |
| `chevron-left-svg` | <img src="icons/light/chevron-left.svg" width="32" height="32" alt="chevron-left" /> |
| `chevron-right-svg` | <img src="icons/light/chevron-right.svg" width="32" height="32" alt="chevron-right" /> |
| `chevron-up-svg` | <img src="icons/light/chevron-up.svg" width="32" height="32" alt="chevron-up" /> |
| `close-svg` | <img src="icons/light/close.svg" width="32" height="32" alt="close" /> |
| `cog-svg` | <img src="icons/light/cog.svg" width="32" height="32" alt="cog" /> |
| `compare-svg` | <img src="icons/data/compare.svg" width="32" height="32" alt="compare" /> |
| `contacts-svg` | <img src="icons/ui/contacts.svg" width="32" height="32" alt="contacts" /> |
| `copy-svg` | <img src="icons/ui/copy.svg" width="32" height="32" alt="copy" /> |
| `cross-svg` | <img src="icons/ui/cross.svg" width="32" height="32" alt="cross" /> |
| `csv-outline-2-svg` | <img src="icons/sources/csv-outline-2.svg" width="32" height="32" alt="csv-outline-2" /> |
| `csv-outline-svg` | <img src="icons/sources/csv-outline.svg" width="32" height="32" alt="csv-outline" /> |
| `csv-svg` | <img src="icons/sources/csv.svg" width="32" height="32" alt="csv" /> |
| `data-svg` | <img src="icons/data/data.svg" width="32" height="32" alt="data" /> |
| `database-svg` | <img src="icons/data/database.svg" width="32" height="32" alt="database" /> |
| `datama-logo-svg` | <img src="icons/logos/datama-logo.svg" width="32" height="32" alt="datama-logo" /> |
| `datama-svg` | <img src="icons/light/datama.svg" width="32" height="32" alt="datama" /> |
| `detect-svg` | <img src="icons/data/detect.svg" width="32" height="32" alt="detect" /> |
| `documentation-svg` | <img src="icons/ui/documentation.svg" width="32" height="32" alt="documentation" /> |
| `documents-svg` | <img src="icons/ui/documents.svg" width="32" height="32" alt="documents" /> |
| `download-svg` | <img src="icons/light/download.svg" width="32" height="32" alt="download" /> |
| `drop-down-1-svg` | <img src="icons/navigation/drop-down-1.svg" width="32" height="32" alt="drop-down-1" /> |
| `drop-down-svg` | <img src="icons/navigation/drop-down.svg" width="32" height="32" alt="drop-down" /> |
| `drop-left-svg` | <img src="icons/navigation/drop-left.svg" width="32" height="32" alt="drop-left" /> |
| `drop-right-svg` | <img src="icons/navigation/drop-right.svg" width="32" height="32" alt="drop-right" /> |
| `drop-up-svg` | <img src="icons/navigation/drop-up.svg" width="32" height="32" alt="drop-up" /> |
| `earth-svg` | <img src="icons/ui/earth.svg" width="32" height="32" alt="earth" /> |
| `edit-svg` | <img src="icons/ui/edit.svg" width="32" height="32" alt="edit" /> |
| `excel-outline-2-svg` | <img src="icons/sources/excel-outline-2.svg" width="32" height="32" alt="excel-outline-2" /> |
| `excel-outline-svg` | <img src="icons/sources/excel-outline.svg" width="32" height="32" alt="excel-outline" /> |
| `excel-svg` | <img src="icons/sources/excel.svg" width="32" height="32" alt="excel" /> |
| `eyes-svg` | <img src="icons/ui/eyes.svg" width="32" height="32" alt="eyes" /> |
| `facebook-svg` | <img src="icons/sources/facebook.svg" width="32" height="32" alt="facebook" /> |
| `filter-svg` | <img src="icons/light/filter.svg" width="32" height="32" alt="filter" /> |
| `flow-svg` | <img src="icons/ui/flow.svg" width="32" height="32" alt="flow" /> |
| `folder-open-svg` | <img src="icons/ui/folder-open.svg" width="32" height="32" alt="folder-open" /> |
| `font-svg` | <img src="icons/light/font.svg" width="32" height="32" alt="font" /> |
| `function-svg` | <img src="icons/light/function.svg" width="32" height="32" alt="function" /> |
| `gauge-svg` | <img src="icons/light/gauge.svg" width="32" height="32" alt="gauge" /> |
| `google-ads-svg` | <img src="icons/sources/google-ads.svg" width="32" height="32" alt="google-ads" /> |
| `google-analytics-svg` | <img src="icons/sources/google-analytics.svg" width="32" height="32" alt="google-analytics" /> |
| `google-bigquery-svg` | <img src="icons/sources/google-bigquery.svg" width="32" height="32" alt="google-bigquery" /> |
| `google-drive-svg` | <img src="icons/sources/google-drive.svg" width="32" height="32" alt="google-drive" /> |
| `google-sheets-svg` | <img src="icons/sources/google-sheets.svg" width="32" height="32" alt="google-sheets" /> |
| `google-svg` | <img src="icons/sources/google.svg" width="32" height="32" alt="google" /> |
| `google-trend-svg` | <img src="icons/sources/google-trend.svg" width="32" height="32" alt="google-trend" /> |
| `graph-chart-svg` | <img src="icons/data/graph-chart.svg" width="32" height="32" alt="graph-chart" /> |
| `group-svg` | <img src="icons/ui/group.svg" width="32" height="32" alt="group" /> |
| `groups-svg` | <img src="icons/ui/groups.svg" width="32" height="32" alt="groups" /> |
| `handshake-svg` | <img src="icons/light/handshake.svg" width="32" height="32" alt="handshake" /> |
| `heart-svg` | <img src="icons/light/heart.svg" width="32" height="32" alt="heart" /> |
| `help-circle-svg` | <img src="icons/light/help-circle.svg" width="32" height="32" alt="help-circle" /> |
| `home-svg` | <img src="icons/ui/home.svg" width="32" height="32" alt="home" /> |
| `illustration-analyze-slack-etc-svg` | <img src="icons/illustrations/illustration-analyze-slack-etc.svg" width="32" height="32" alt="illustration-analyze-slack-etc" /> |
| `illustration-analyze-svg` | <img src="icons/illustrations/illustration-analyze.svg" width="32" height="32" alt="illustration-analyze" /> |
| `illustration-anonymous-svg` | <img src="icons/illustrations/illustration-anonymous.svg" width="32" height="32" alt="illustration-anonymous" /> |
| `illustration-compare-svg` | <img src="icons/illustrations/illustration-compare.svg" width="32" height="32" alt="illustration-compare" /> |
| `illustration-data-svg` | <img src="icons/illustrations/illustration-data.svg" width="32" height="32" alt="illustration-data" /> |
| `illustration-datasettings-svg` | <img src="icons/illustrations/illustration-datasettings.svg" width="32" height="32" alt="illustration-datasettings" /> |
| `illustration-extension-premium-svg` | <img src="icons/illustrations/illustration-extension-premium.svg" width="32" height="32" alt="illustration-extension-premium" /> |
| `illustration-free-svg` | <img src="icons/illustrations/illustration-free.svg" width="32" height="32" alt="illustration-free" /> |
| `illustration-hearts-svg` | <img src="icons/illustrations/illustration-hearts.svg" width="32" height="32" alt="illustration-hearts" /> |
| `illustration-ideas-svg` | <img src="icons/illustrations/illustration-ideas.svg" width="32" height="32" alt="illustration-ideas" /> |
| `illustration-log-out-svg` | <img src="icons/illustrations/illustration-log-out.svg" width="32" height="32" alt="illustration-log-out" /> |
| `illustration-premium-svg` | <img src="icons/illustrations/illustration-premium.svg" width="32" height="32" alt="illustration-premium" /> |
| `journey-svg` | <img src="icons/data/journey.svg" width="32" height="32" alt="journey" /> |
| `key-svg` | <img src="icons/light/key.svg" width="32" height="32" alt="key" /> |
| `label-svg` | <img src="icons/light/label.svg" width="32" height="32" alt="label" /> |
| `leave-org-svg` | <img src="icons/actions/leave-org.svg" width="32" height="32" alt="leave-org" /> |
| `license-key-svg` | <img src="icons/ui/license-key.svg" width="32" height="32" alt="license-key" /> |
| `link-open-svg` | <img src="icons/ui/link-open.svg" width="32" height="32" alt="link-open" /> |
| `link-svg` | <img src="icons/light/link.svg" width="32" height="32" alt="link" /> |
| `lock-svg` | <img src="icons/ui/lock.svg" width="32" height="32" alt="lock" /> |
| `looker-svg` | <img src="icons/sources/looker.svg" width="32" height="32" alt="looker" /> |
| `magnifier-svg` | <img src="icons/light/magnifier.svg" width="32" height="32" alt="magnifier" /> |
| `mariadb-svg` | <img src="icons/sources/mariadb.svg" width="32" height="32" alt="mariadb" /> |
| `maximize-2-svg` | <img src="icons/light/maximize-2.svg" width="32" height="32" alt="maximize-2" /> |
| `minus-svg` | <img src="icons/light/minus.svg" width="32" height="32" alt="minus" /> |
| `more-horizontal-svg` | <img src="icons/light/more-horizontal.svg" width="32" height="32" alt="more-horizontal" /> |
| `more-vertical-svg` | <img src="icons/light/more-vertical.svg" width="32" height="32" alt="more-vertical" /> |
| `mysql-svg` | <img src="icons/sources/mysql.svg" width="32" height="32" alt="mysql" /> |
| `new-tab-svg` | <img src="icons/light/new-tab.svg" width="32" height="32" alt="new-tab" /> |
| `onedrive-svg` | <img src="icons/sources/onedrive.svg" width="32" height="32" alt="onedrive" /> |
| `openai-svg` | <img src="icons/sources/openai.svg" width="32" height="32" alt="openai" /> |
| `paint-svg` | <img src="icons/light/paint.svg" width="32" height="32" alt="paint" /> |
| `peace-svg` | <img src="icons/light/peace.svg" width="32" height="32" alt="peace" /> |
| `piano-svg` | <img src="icons/sources/piano.svg" width="32" height="32" alt="piano" /> |
| `pivot-svg` | <img src="icons/data/pivot.svg" width="32" height="32" alt="pivot" /> |
| `play-svg` | <img src="icons/light/play.svg" width="32" height="32" alt="play" /> |
| `plus-svg` | <img src="icons/ui/plus.svg" width="32" height="32" alt="plus" /> |
| `postgresql-svg` | <img src="icons/sources/postgresql.svg" width="32" height="32" alt="postgresql" /> |
| `power-bi-svg` | <img src="icons/sources/power-bi.svg" width="32" height="32" alt="power-bi" /> |
| `profile-1-svg` | <img src="icons/ui/profile-1.svg" width="32" height="32" alt="profile-1" /> |
| `profile-add-svg` | <img src="icons/ui/profile-add.svg" width="32" height="32" alt="profile-add" /> |
| `profile-info-svg` | <img src="icons/ui/profile-info.svg" width="32" height="32" alt="profile-info" /> |
| `profile-setting-svg` | <img src="icons/ui/profile-setting.svg" width="32" height="32" alt="profile-setting" /> |
| `profile-svg` | <img src="icons/ui/profile.svg" width="32" height="32" alt="profile" /> |
| `qlik-svg` | <img src="icons/logos/qlik.svg" width="32" height="32" alt="qlik" /> |
| `redshift-svg` | <img src="icons/sources/redshift.svg" width="32" height="32" alt="redshift" /> |
| `release-notes-1-svg` | <img src="icons/ui/release-notes-1.svg" width="32" height="32" alt="release-notes-1" /> |
| `release-notes-svg` | <img src="icons/ui/release-notes.svg" width="32" height="32" alt="release-notes" /> |
| `reverse-axis-svg` | <img src="icons/light/reverse-axis.svg" width="32" height="32" alt="reverse-axis" /> |
| `rotate-ccw-svg` | <img src="icons/light/rotate-ccw.svg" width="32" height="32" alt="rotate-ccw" /> |
| `rotate-ccw1-svg` | <img src="icons/light/rotate-ccw1.svg" width="32" height="32" alt="rotate-ccw1" /> |
| `rotate-cw-svg` | <img src="icons/light/rotate-cw.svg" width="32" height="32" alt="rotate-cw" /> |
| `rotate-cw1-svg` | <img src="icons/light/rotate-cw1.svg" width="32" height="32" alt="rotate-cw1" /> |
| `save-svg` | <img src="icons/light/save.svg" width="32" height="32" alt="save" /> |
| `search-svg` | <img src="icons/ui/search.svg" width="32" height="32" alt="search" /> |
| `settings-1-svg` | <img src="icons/ui/settings-1.svg" width="32" height="32" alt="settings-1" /> |
| `settings-org-svg` | <img src="icons/ui/settings-org.svg" width="32" height="32" alt="settings-org" /> |
| `settings-svg` | <img src="icons/ui/settings.svg" width="32" height="32" alt="settings" /> |
| `share-2-svg` | <img src="icons/light/share-2.svg" width="32" height="32" alt="share-2" /> |
| `shopping-cart-svg` | <img src="icons/ui/shopping-cart.svg" width="32" height="32" alt="shopping-cart" /> |
| `snowflake-svg` | <img src="icons/sources/snowflake.svg" width="32" height="32" alt="snowflake" /> |
| `stacked-svg` | <img src="icons/light/stacked.svg" width="32" height="32" alt="stacked" /> |
| `star-cool-svg` | <img src="icons/ui/star-cool.svg" width="32" height="32" alt="star-cool" /> |
| `table-svg` | <img src="icons/light/table.svg" width="32" height="32" alt="table" /> |
| `tableau-svg` | <img src="icons/sources/tableau.svg" width="32" height="32" alt="tableau" /> |
| `text-color-svg` | <img src="icons/light/text-color.svg" width="32" height="32" alt="text-color" /> |
| `trash-2-svg` | <img src="icons/light/trash-2.svg" width="32" height="32" alt="trash-2" /> |
| `tree-svg` | <img src="icons/light/tree.svg" width="32" height="32" alt="tree" /> |
| `tutorials-svg` | <img src="icons/ui/tutorials.svg" width="32" height="32" alt="tutorials" /> |
| `unstacked-svg` | <img src="icons/light/unstacked.svg" width="32" height="32" alt="unstacked" /> |
| `update-svg` | <img src="icons/actions/update.svg" width="32" height="32" alt="update" /> |
| `upload-1-svg` | <img src="icons/actions/upload-1.svg" width="32" height="32" alt="upload-1" /> |
| `upload-svg` | <img src="icons/actions/upload.svg" width="32" height="32" alt="upload" /> |
| `warning-svg` | <img src="icons/ui/warning.svg" width="32" height="32" alt="warning" /> |
| `x-svg` | <img src="icons/light/x.svg" width="32" height="32" alt="x" /> |
| `xtwitter-svg` | <img src="icons/sources/xtwitter.svg" width="32" height="32" alt="xtwitter" /> |

## File Structure

The package includes multiple distribution formats:

- **`DataMaIconsNew.js`** - Vanilla JavaScript for `<script>` tags
- **`DataMaIconsNew.esm.js`** - ES6 module for `import/export` (use this for DataMa Light project)
- **`icons.json`** - Raw icon data as JSON
- **`vue/`** - Vue 2 components

## Icon Data Format

Each icon contains:

```typescript
interface IconData {
  height: number;        // SVG height (usually 24)
  width: number;         // SVG width (usually 24) 
  viewBox: string;       // SVG viewBox
  isComplex: boolean;    // Whether icon has complex styling
  category: string;      // Icon category (actions, data, light, ui, etc.)
  content: string;       // SVG content for complex icons
  path?: string;         // SVG path data for simple icons
  tags: string[];        // Search tags
  originalDimensions: {  // Original SVG dimensions
    width: number;
    height: number;
  };
}
```

## Migration from Legacy API

If you're migrating from the old API:

```javascript
// OLD
const iconData = DataMaLightIcons['check'];
// Create your own SVG element

// NEW
const iconElement = DataMaIconsNew.get('check-svg', { size: 24 });
// Ready-to-use DOM element
```

## Development

This package is auto-generated from SVG files. To contribute:

1. Add your SVG files to the `icons/` directory (organized by category)
2. Run `npm run build:all` to regenerate the package
3. The CI/CD pipeline will automatically create a new release

### Development Commands

```bash
npm run build:svg     # Process SVG files
npm run build:json    # Generate JSON data
npm run build:vue     # Generate Vue components  
npm run build         # Generate distribution files
npm run build:all     # Full build process
```

## Important Notes

### For DataMa Light Project

Always use the **ES6 module version** (`DataMaIconsNew.esm.js`) when working with the DataMa Light project:

```javascript
// ✅ Correct for DataMa Light
import { DataMaIconsNew } from '../components/DataMaIconsNew.esm.js';

// ❌ Don't use this in DataMa Light (causes import errors)
import { DataMaIconsNew } from '../components/DataMaIconsNew.js';
```

### Icon Naming Convention

All icons follow the pattern `{name}-svg` (e.g., `cog-svg`, `home-svg`, `settings-svg`)

## License

Copyright (c) 2025 DATAMA SAS, All rights reserved.
