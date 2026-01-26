# @datama/icons

DataMa icon library with 106 icons, available as Vue 2 components and JSON data.

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

## Available Icons (106)

| Nom de l'icône | Aperçu |
|:-------------- |:------:|
| `add-folder-svg` | <img src="icons/actions/add-folder.svg" width="32" height="32" alt="add-folder" /> |
| `assess-svg` | <img src="icons/data/assess.svg" width="32" height="32" alt="assess" /> |
| `basketball-svg` | <img src="icons/ui/basketball.svg" width="32" height="32" alt="basketball" /> |
| `book-svg` | <img src="icons/ui/book.svg" width="32" height="32" alt="book" /> |
| `bookmark-svg` | <img src="icons/ui/bookmark.svg" width="32" height="32" alt="bookmark" /> |
| `check-svg` | <img src="icons/ui/check.svg" width="32" height="32" alt="check" /> |
| `cog-svg` | <img src="icons/settings/cog.svg" width="32" height="32" alt="cog" /> |
| `cogs-svg` | <img src="icons/settings/cogs.svg" width="32" height="32" alt="cogs" /> |
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
| `detect-svg` | <img src="icons/data/detect.svg" width="32" height="32" alt="detect" /> |
| `documentation-svg` | <img src="icons/ui/documentation.svg" width="32" height="32" alt="documentation" /> |
| `documents-svg` | <img src="icons/ui/documents.svg" width="32" height="32" alt="documents" /> |
| `dog-svg` | <img src="icons/illustrations/dog.svg" width="32" height="32" alt="dog" /> |
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
| `flow-svg` | <img src="icons/ui/flow.svg" width="32" height="32" alt="flow" /> |
| `folder-open-svg` | <img src="icons/ui/folder-open.svg" width="32" height="32" alt="folder-open" /> |
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
| `help-circle-svg` | <img src="icons/ui/help-circle.svg" width="32" height="32" alt="help-circle" /> |
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
| `leave-org-svg` | <img src="icons/actions/leave-org.svg" width="32" height="32" alt="leave-org" /> |
| `license-key-svg` | <img src="icons/ui/license-key.svg" width="32" height="32" alt="license-key" /> |
| `link-open-svg` | <img src="icons/ui/link-open.svg" width="32" height="32" alt="link-open" /> |
| `lock-svg` | <img src="icons/ui/lock.svg" width="32" height="32" alt="lock" /> |
| `looker-svg` | <img src="icons/sources/looker.svg" width="32" height="32" alt="looker" /> |
| `manage-billing-svg` | <img src="icons/settings/manage-billing.svg" width="32" height="32" alt="manage-billing" /> |
| `manage-org-svg` | <img src="icons/settings/manage-org.svg" width="32" height="32" alt="manage-org" /> |
| `manage-profile-svg` | <img src="icons/settings/manage-profile.svg" width="32" height="32" alt="manage-profile" /> |
| `mariadb-svg` | <img src="icons/sources/mariadb.svg" width="32" height="32" alt="mariadb" /> |
| `metabase-svg` | <img src="icons/sources/metabase.svg" width="32" height="32" alt="metabase" /> |
| `mysql-svg` | <img src="icons/sources/mysql.svg" width="32" height="32" alt="mysql" /> |
| `onedrive-svg` | <img src="icons/sources/onedrive.svg" width="32" height="32" alt="onedrive" /> |
| `openai-svg` | <img src="icons/sources/openai.svg" width="32" height="32" alt="openai" /> |
| `piano-svg` | <img src="icons/sources/piano.svg" width="32" height="32" alt="piano" /> |
| `pivot-svg` | <img src="icons/data/pivot.svg" width="32" height="32" alt="pivot" /> |
| `plus-circle-svg` | <img src="icons/ui/plus-circle.svg" width="32" height="32" alt="plus-circle" /> |
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
| `reverse-h-svg` | <img src="icons/actions/reverse-h.svg" width="32" height="32" alt="reverse-h" /> |
| `reverse-v-svg` | <img src="icons/actions/reverse-v.svg" width="32" height="32" alt="reverse-v" /> |
| `search-svg` | <img src="icons/ui/search.svg" width="32" height="32" alt="search" /> |
| `settings-1-svg` | <img src="icons/ui/settings-1.svg" width="32" height="32" alt="settings-1" /> |
| `settings-org-svg` | <img src="icons/ui/settings-org.svg" width="32" height="32" alt="settings-org" /> |
| `settings-svg` | <img src="icons/ui/settings.svg" width="32" height="32" alt="settings" /> |
| `shopping-cart-svg` | <img src="icons/ui/shopping-cart.svg" width="32" height="32" alt="shopping-cart" /> |
| `snowflake-svg` | <img src="icons/sources/snowflake.svg" width="32" height="32" alt="snowflake" /> |
| `star-cool-svg` | <img src="icons/ui/star-cool.svg" width="32" height="32" alt="star-cool" /> |
| `tableau-svg` | <img src="icons/sources/tableau.svg" width="32" height="32" alt="tableau" /> |
| `tutorials-svg` | <img src="icons/ui/tutorials.svg" width="32" height="32" alt="tutorials" /> |
| `update-svg` | <img src="icons/actions/update.svg" width="32" height="32" alt="update" /> |
| `upload-1-svg` | <img src="icons/actions/upload-1.svg" width="32" height="32" alt="upload-1" /> |
| `upload-svg` | <img src="icons/actions/upload.svg" width="32" height="32" alt="upload" /> |
| `warning-svg` | <img src="icons/ui/warning.svg" width="32" height="32" alt="warning" /> |
| `xtwitter-svg` | <img src="icons/sources/xtwitter.svg" width="32" height="32" alt="xtwitter" /> |

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

Copyright (c) 2026 DATAMA SAS, All rights reserved.
