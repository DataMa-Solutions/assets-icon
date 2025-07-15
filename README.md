# @datama/icons

DataMa icon library with 118 icons, available as Vue 2 components and JSON data.

## Installation

```bash
npm install @datama/icons
```

## Usage

### As JSON data (for vanilla JS projects)

```javascript
import { DataMaLightIcons } from '@datama/icons';
// or
const { DataMaLightIcons } = require('@datama/icons');

// Use icon data
const checkIcon = DataMaLightIcons.check;
console.log(checkIcon.path); // SVG path data
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

## Color Management

DataMa Icons supports two types of icons with different color behaviors:

### Simple Icons vs Complex Icons

**Simple Icons** (59 icons):
- Single-color icons with basic paths
- Colors are easily customizable via the `fill` property
- Examples: `check-svg`, `download-svg`, `arrow-left-svg`

**Complex Icons** (59 icons):
- Multi-element icons with intentional colors, gradients, masks, or advanced styling
- Preserve their original design and colors by default
- Examples: `datama-svg`, `settings-svg`, `illustration-*-svg`

### Using the Vanilla JavaScript API

```javascript
// Load the DataMaIcons API
// <script src="path/to/DataMaIconsNew.js"></script>

// Simple icon with custom color (works automatically)
const simpleIcon = DataMaIcons.get('check-svg', { 
  size: 32, 
  fill: '#007acc' 
});

// Complex icon with original colors (default behavior)
const complexIcon = DataMaIcons.get('datama-svg', { 
  size: 32 
});

// Complex icon with forced color (when needed)
const complexIconColored = DataMaIcons.get('datama-svg', { 
  size: 32, 
  fill: '#007acc',
  forceComplexColor: true  // Force color on complex icons
});
```

### Color Properties

- **`fill`**: Color value (hex, rgb, named colors, or 'currentColor')
- **`forceComplexColor`**: Boolean (default: false) - Forces color application on complex icons

### Best Practices

✅ **Recommended:**
```javascript
// Let simple icons inherit color naturally
DataMaIcons.get('check-svg', { fill: '#28a745' })

// Keep complex icons with original styling
DataMaIcons.get('datama-svg')

// Force color only when specifically needed
DataMaIcons.get('settings-svg', { fill: '#dc3545', forceComplexColor: true })
```

❌ **Not recommended:**
```javascript
// Don't force colors on complex icons unless necessary
// This may break intentional design elements
DataMaIcons.get('illustration-data-svg', { fill: '#000000', forceComplexColor: true })
```

### Vue Component Color Usage

```vue
<template>
  <div>
    <!-- Simple icon with color -->
    <IconCheck :size="24" fill="#28a745" />
    
    <!-- Complex icon with original colors -->
    <IconDatama :size="32" />
    
    <!-- Complex icon with forced color (use sparingly) -->
    <IconSettings :size="24" fill="#dc3545" :force-complex-color="true" />
  </div>
</template>
```

### Icon Type Reference

**Simple Icons:** Automatically accept color changes
```
alert-circle-svg, alert-triangle-svg, area-chart-svg, arrow-*-svg, 
balance-scale-svg, books-svg, chat-svg, check-svg, chevron-*-svg, 
close-svg, cog-svg, detect-svg, download-svg, edit-svg, filter-svg, 
font-svg, function-svg, gauge-svg, handshake-svg, heart-svg, 
help-circle-svg, key-svg, label-svg, link-svg, magnifier-svg, 
maximize-2-svg, minus-svg, more-*-svg, new-tab-svg, paint-svg, 
peace-svg, play-svg, reverse-axis-svg, rotate-*-svg, save-svg, 
share-2-svg, stacked-svg, table-svg, text-color-svg, trash-2-svg, 
tree-svg, unstacked-svg, x-svg
```

**Complex Icons:** Preserve original styling by default
```
add-folder-svg, assess-svg, compare-svg, upload-svg, pivot-svg, 
data-svg, graph-chart-svg, journey-svg, illustration-*-svg, 
datama-logo-svg, logo-*-svg, drop-*-svg, contacts-svg, copy-svg, 
cross-svg, documentation-svg, documents-svg, earth-svg, eyes-svg, 
folder-open-svg, group-svg, groups-svg, home-svg, license-key-svg, 
link-open-svg, lock-svg, plus-svg, profile-*-svg, release-notes-*-svg, 
search-svg, settings-*-svg, shopping-cart-svg, star-cool-svg, 
tutorials-svg, warning-svg
```

## Available Icons (118)

- `add-folder-svg`
- `alert-circle-svg`
- `alert-triangle-svg`
- `area-chart-svg`
- `arrow-bottom-svg`
- `arrow-down-right-svg`
- `arrow-left-svg`
- `arrow-right-svg`
- `arrow-top-svg`
- `arrow-up-right-svg`
- `assess-svg`
- `balance-scale-svg`
- `books-svg`
- `chat-svg`
- `check-svg`
- `chevron-down-svg`
- `chevron-left-svg`
- `chevron-right-svg`
- `chevron-up-svg`
- `close-svg`
- `cog-svg`
- `compare-svg`
- `contacts-svg`
- `copy-svg`
- `cross-svg`
- `data-svg`
- `datama-logo-svg`
- `datama-svg`
- `detect-svg`
- `documentation-svg`
- `documents-svg`
- `download-svg`
- `drop-down-1-svg`
- `drop-down-svg`
- `drop-left-svg`
- `drop-right-svg`
- `drop-up-svg`
- `earth-svg`
- `edit-svg`
- `eyes-svg`
- `filter-svg`
- `folder-open-svg`
- `font-svg`
- `function-svg`
- `gauge-svg`
- `graph-chart-svg`
- `group-svg`
- `groups-svg`
- `handshake-svg`
- `heart-svg`
- `help-circle-svg`
- `home-svg`
- `illustration-analyze-slack-etc-svg`
- `illustration-analyze-svg`
- `illustration-anonymous-svg`
- `illustration-compare-svg`
- `illustration-data-svg`
- `illustration-datasettings-svg`
- `illustration-extension-premium-svg`
- `illustration-free-svg`
- `illustration-hearts-svg`
- `illustration-ideas-svg`
- `illustration-log-out-svg`
- `illustration-premium-svg`
- `journey-svg`
- `key-svg`
- `label-svg`
- `leave-org-svg`
- `license-key-svg`
- `link-open-svg`
- `link-svg`
- `lock-svg`
- `logo-looker-studio-svg`
- `logo-power-bi-svg`
- `logo-tableau-svg`
- `magnifier-svg`
- `maximize-2-svg`
- `minus-svg`
- `more-horizontal-svg`
- `more-vertical-svg`
- `new-tab-svg`
- `paint-svg`
- `peace-svg`
- `pivot-svg`
- `play-svg`
- `plus-svg`
- `profile-1-svg`
- `profile-add-svg`
- `profile-info-svg`
- `profile-setting-svg`
- `profile-svg`
- `release-notes-1-svg`
- `release-notes-svg`
- `reverse-axis-svg`
- `rotate-ccw-svg`
- `rotate-ccw1-svg`
- `rotate-cw-svg`
- `rotate-cw1-svg`
- `save-svg`
- `search-svg`
- `settings-1-svg`
- `settings-org-svg`
- `settings-svg`
- `share-2-svg`
- `shopping-cart-svg`
- `stacked-svg`
- `star-cool-svg`
- `table-svg`
- `text-color-svg`
- `trash-2-svg`
- `tree-svg`
- `tutorials-svg`
- `unstacked-svg`
- `update-svg`
- `upload-1-svg`
- `upload-svg`
- `warning-svg`
- `x-svg`

## Icon Data Format

Each icon contains:

```typescript
interface IconData {
  height: number;        // SVG height (usually 1024)
  path: string;         // SVG path data
  tags: string[];       // Search tags
  ratio?: {             // Aspect ratio (optional)
    width: number;
    height: number;
  };
}
```

## Development

This package is auto-generated from SVG files. To contribute:

1. Add your SVG files to the root directory
2. Run `npm run build:all` to regenerate the package
3. The CI/CD pipeline will automatically create a new release

## License

Copyright (c) 2025 DATAMA SAS, All rights reserved.
