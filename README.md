# @datama/icons

DataMa icon library with 133 icons, available as Vue 2 components and JSON data.

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

## Changelog

Pour consulter l’historique complet des modifications, voir le fichier [CHANGELOG.md](./CHANGELOG.md).

## Available Icons (133)

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
- `csv-svg`
- `data-svg`
- `database-svg`
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
- `email-svg`
- `excel-svg`
- `eyes-svg`
- `facebook-svg`
- `filter-svg`
- `folder-open-svg`
- `font-svg`
- `function-svg`
- `gauge-svg`
- `google-ads-svg`
- `google-analytics-svg`
- `google-bigquery-svg`
- `google-drive-svg`
- `google-sheets-svg`
- `google-svg`
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
- `looker-svg`
- `magnifier-svg`
- `maximize-2-svg`
- `minus-svg`
- `more-horizontal-svg`
- `more-vertical-svg`
- `new-tab-svg`
- `onedrive-svg`
- `paint-svg`
- `peace-svg`
- `pivot-svg`
- `play-svg`
- `plus-svg`
- `power-bi-svg`
- `profile-1-svg`
- `profile-add-svg`
- `profile-info-svg`
- `profile-setting-svg`
- `profile-svg`
- `qlik-svg`
- `redshift-svg`
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
- `snowflake-svg`
- `stacked-svg`
- `star-cool-svg`
- `table-svg`
- `tableau-svg`
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

Ce package est généré automatiquement à partir des fichiers SVG présents dans le dossier `icons/`.

1. Ajoutez vos SVG dans le dossier approprié.
2. Lancez `npm run build:all` pour régénérer la librairie, les fichiers JSON et Vue.
3. Les fichiers de distribution sont générés dans `dist/`.
4. Consultez le fichier [CHANGELOG.md](./CHANGELOG.md) pour suivre l’évolution du projet.

## License

Copyright (c) 2025 DATAMA SAS, All rights reserved.
