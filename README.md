# @datama/icons

DataMa icon library with 136 icons, available as Vue 2 components and JSON data.

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

## Available Icons

| Nom de l'icône | Aperçu |
|:-------------- |:------:|
| settings.svg | <img src="icons/ui/settings.svg" width="32" height="32" alt="settings" /> |
| flow.svg | <img src="icons/ui/flow.svg" width="32" height="32" alt="flow" /> |
| shopping_cart.svg | <img src="icons/ui/shopping_cart.svg" width="32" height="32" alt="shopping_cart" /> |
| star - cool.svg | <img src="icons/ui/star%20-%20cool.svg" width="32" height="32" alt="star - cool" /> |
| tutorials.svg | <img src="icons/ui/tutorials.svg" width="32" height="32" alt="tutorials" /> |
| warning.svg | <img src="icons/ui/warning.svg" width="32" height="32" alt="warning" /> |
| profile-add.svg | <img src="icons/ui/profile-add.svg" width="32" height="32" alt="profile-add" /> |
| profile-info.svg | <img src="icons/ui/profile-info.svg" width="32" height="32" alt="profile-info" /> |
| profile-setting.svg | <img src="icons/ui/profile-setting.svg" width="32" height="32" alt="profile-setting" /> |
| profile.svg | <img src="icons/ui/profile.svg" width="32" height="32" alt="profile" /> |
| release-notes-1.svg | <img src="icons/ui/release-notes-1.svg" width="32" height="32" alt="release-notes-1" /> |
| release-notes.svg | <img src="icons/ui/release-notes.svg" width="32" height="32" alt="release-notes" /> |
| search.svg | <img src="icons/ui/search.svg" width="32" height="32" alt="search" /> |
| settings-1.svg | <img src="icons/ui/settings-1.svg" width="32" height="32" alt="settings-1" /> |
| settings-org.svg | <img src="icons/ui/settings-org.svg" width="32" height="32" alt="settings-org" /> |
| eyes.svg | <img src="icons/ui/eyes.svg" width="32" height="32" alt="eyes" /> |
| folder_open.svg | <img src="icons/ui/folder_open.svg" width="32" height="32" alt="folder_open" /> |
| group.svg | <img src="icons/ui/group.svg" width="32" height="32" alt="group" /> |
| groups.svg | <img src="icons/ui/groups.svg" width="32" height="32" alt="groups" /> |
| home.svg | <img src="icons/ui/home.svg" width="32" height="32" alt="home" /> |
| license-key.svg | <img src="icons/ui/license-key.svg" width="32" height="32" alt="license-key" /> |
| link-open.svg | <img src="icons/ui/link-open.svg" width="32" height="32" alt="link-open" /> |
| lock.svg | <img src="icons/ui/lock.svg" width="32" height="32" alt="lock" /> |
| plus.svg | <img src="icons/ui/plus.svg" width="32" height="32" alt="plus" /> |
| profile-1.svg | <img src="icons/ui/profile-1.svg" width="32" height="32" alt="profile-1" /> |
| check.svg | <img src="icons/ui/check.svg" width="32" height="32" alt="check" /> |
| contacts.svg | <img src="icons/ui/contacts.svg" width="32" height="32" alt="contacts" /> |
| copy.svg | <img src="icons/ui/copy.svg" width="32" height="32" alt="copy" /> |
| cross.svg | <img src="icons/ui/cross.svg" width="32" height="32" alt="cross" /> |
| documentation.svg | <img src="icons/ui/documentation.svg" width="32" height="32" alt="documentation" /> |
| documents.svg | <img src="icons/ui/documents.svg" width="32" height="32" alt="documents" /> |
| earth.svg | <img src="icons/ui/earth.svg" width="32" height="32" alt="earth" /> |
| edit.svg | <img src="icons/ui/edit.svg" width="32" height="32" alt="edit" /> |
| redshift.svg | <img src="icons/sources/redshift.svg" width="32" height="32" alt="redshift" /> |
| google-sheets.svg | <img src="icons/sources/google-sheets.svg" width="32" height="32" alt="google-sheets" /> |
| excel.svg | <img src="icons/sources/excel.svg" width="32" height="32" alt="excel" /> |
| piano.svg | <img src="icons/sources/piano.svg" width="32" height="32" alt="piano" /> |
| google-trend.svg | <img src="icons/sources/google-trend.svg" width="32" height="32" alt="google-trend" /> |
| xtwitter.svg | <img src="icons/sources/xtwitter.svg" width="32" height="32" alt="xtwitter" /> |
| google.svg | <img src="icons/sources/google.svg" width="32" height="32" alt="google" /> |
| tableau.svg | <img src="icons/sources/tableau.svg" width="32" height="32" alt="tableau" /> |
| looker.svg | <img src="icons/sources/looker.svg" width="32" height="32" alt="looker" /> |
| onedrive.svg | <img src="icons/sources/onedrive.svg" width="32" height="32" alt="onedrive" /> |
| power-bi.svg | <img src="icons/sources/power-bi.svg" width="32" height="32" alt="power-bi" /> |
| snowflake.svg | <img src="icons/sources/snowflake.svg" width="32" height="32" alt="snowflake" /> |
| facebook.svg | <img src="icons/sources/facebook.svg" width="32" height="32" alt="facebook" /> |
| google-ads.svg | <img src="icons/sources/google-ads.svg" width="32" height="32" alt="google-ads" /> |
| google-analytics.svg | <img src="icons/sources/google-analytics.svg" width="32" height="32" alt="google-analytics" /> |
| google-bigquery.svg | <img src="icons/sources/google-bigquery.svg" width="32" height="32" alt="google-bigquery" /> |
| google-drive.svg | <img src="icons/sources/google-drive.svg" width="32" height="32" alt="google-drive" /> |
| csv.svg | <img src="icons/sources/csv.svg" width="32" height="32" alt="csv" /> |
| database.svg | <img src="icons/data/database.svg" width="32" height="32" alt="database" /> |
| journey.svg | <img src="icons/data/journey.svg" width="32" height="32" alt="journey" /> |
| Pivot.svg | <img src="icons/data/Pivot.svg" width="32" height="32" alt="Pivot" /> |
| data.svg | <img src="icons/data/data.svg" width="32" height="32" alt="data" /> |
| graph-chart.svg | <img src="icons/data/graph-chart.svg" width="32" height="32" alt="graph-chart" /> |
| illustration-extension-premium.svg | <img src="icons/illustrations/illustration-extension-premium.svg" width="32" height="32" alt="illustration-extension-premium" /> |
| illustration-free.svg | <img src="icons/illustrations/illustration-free.svg" width="32" height="32" alt="illustration-free" /> |
| illustration-hearts.svg | <img src="icons/illustrations/illustration-hearts.svg" width="32" height="32" alt="illustration-hearts" /> |
| illustration-ideas.svg | <img src="icons/illustrations/illustration-ideas.svg" width="32" height="32" alt="illustration-ideas" /> |
| illustration-log-out.svg | <img src="icons/illustrations/illustration-log-out.svg" width="32" height="32" alt="illustration-log-out" /> |
| illustration-premium.svg | <img src="icons/illustrations/illustration-premium.svg" width="32" height="32" alt="illustration-premium" /> |
| illustration-analyze-slack-etc.svg | <img src="icons/illustrations/illustration-analyze-slack-etc.svg" width="32" height="32" alt="illustration-analyze-slack-etc" /> |
| illustration-analyze.svg | <img src="icons/illustrations/illustration-analyze.svg" width="32" height="32" alt="illustration-analyze" /> |
| illustration-anonymous.svg | <img src="icons/illustrations/illustration-anonymous.svg" width="32" height="32" alt="illustration-anonymous" /> |
| illustration-compare.svg | <img src="icons/illustrations/illustration-compare.svg" width="32" height="32" alt="illustration-compare" /> |
| illustration-data.svg | <img src="icons/illustrations/illustration-data.svg" width="32" height="32" alt="illustration-data" /> |
| illustration-datasettings.svg | <img src="icons/illustrations/illustration-datasettings.svg" width="32" height="32" alt="illustration-datasettings" /> |
| unstacked.svg | <img src="icons/light/unstacked.svg" width="32" height="32" alt="unstacked" /> |
| x.svg | <img src="icons/light/x.svg" width="32" height="32" alt="x" /> |
| stacked.svg | <img src="icons/light/stacked.svg" width="32" height="32" alt="stacked" /> |
| table.svg | <img src="icons/light/table.svg" width="32" height="32" alt="table" /> |
| text-color.svg | <img src="icons/light/text-color.svg" width="32" height="32" alt="text-color" /> |
| trash-2.svg | <img src="icons/light/trash-2.svg" width="32" height="32" alt="trash-2" /> |
| tree.svg | <img src="icons/light/tree.svg" width="32" height="32" alt="tree" /> |
| rotate-ccw1.svg | <img src="icons/light/rotate-ccw1.svg" width="32" height="32" alt="rotate-ccw1" /> |
| rotate-cw.svg | <img src="icons/light/rotate-cw.svg" width="32" height="32" alt="rotate-cw" /> |
| rotate-cw1.svg | <img src="icons/light/rotate-cw1.svg" width="32" height="32" alt="rotate-cw1" /> |
| save.svg | <img src="icons/light/save.svg" width="32" height="32" alt="save" /> |
| settings.svg | <img src="icons/light/settings.svg" width="32" height="32" alt="settings" /> |
| share-2.svg | <img src="icons/light/share-2.svg" width="32" height="32" alt="share-2" /> |
| play.svg | <img src="icons/light/play.svg" width="32" height="32" alt="play" /> |
| plus.svg | <img src="icons/light/plus.svg" width="32" height="32" alt="plus" /> |
| reverse-axis.svg | <img src="icons/light/reverse-axis.svg" width="32" height="32" alt="reverse-axis" /> |
| rotate-ccw.svg | <img src="icons/light/rotate-ccw.svg" width="32" height="32" alt="rotate-ccw" /> |
| more-horizontal.svg | <img src="icons/light/more-horizontal.svg" width="32" height="32" alt="more-horizontal" /> |
| more-vertical.svg | <img src="icons/light/more-vertical.svg" width="32" height="32" alt="more-vertical" /> |
| new-tab.svg | <img src="icons/light/new-tab.svg" width="32" height="32" alt="new-tab" /> |
| paint.svg | <img src="icons/light/paint.svg" width="32" height="32" alt="paint" /> |
| peace.svg | <img src="icons/light/peace.svg" width="32" height="32" alt="peace" /> |
| link.svg | <img src="icons/light/link.svg" width="32" height="32" alt="link" /> |
| lock.svg | <img src="icons/light/lock.svg" width="32" height="32" alt="lock" /> |
| magnifier.svg | <img src="icons/light/magnifier.svg" width="32" height="32" alt="magnifier" /> |
| maximize-2.svg | <img src="icons/light/maximize-2.svg" width="32" height="32" alt="maximize-2" /> |
| minus.svg | <img src="icons/light/minus.svg" width="32" height="32" alt="minus" /> |
| handshake.svg | <img src="icons/light/handshake.svg" width="32" height="32" alt="handshake" /> |
| heart.svg | <img src="icons/light/heart.svg" width="32" height="32" alt="heart" /> |
| help-circle.svg | <img src="icons/light/help-circle.svg" width="32" height="32" alt="help-circle" /> |
| key.svg | <img src="icons/light/key.svg" width="32" height="32" alt="key" /> |
| label.svg | <img src="icons/light/label.svg" width="32" height="32" alt="label" /> |
| download.svg | <img src="icons/light/download.svg" width="32" height="32" alt="download" /> |
| edit.svg | <img src="icons/light/edit.svg" width="32" height="32" alt="edit" /> |
| filter.svg | <img src="icons/light/filter.svg" width="32" height="32" alt="filter" /> |
| font.svg | <img src="icons/light/font.svg" width="32" height="32" alt="font" /> |
| function.svg | <img src="icons/light/function.svg" width="32" height="32" alt="function" /> |
| gauge.svg | <img src="icons/light/gauge.svg" width="32" height="32" alt="gauge" /> |
| close.svg | <img src="icons/light/close.svg" width="32" height="32" alt="close" /> |
| cog.svg | <img src="icons/light/cog.svg" width="32" height="32" alt="cog" /> |
| copy.svg | <img src="icons/light/copy.svg" width="32" height="32" alt="copy" /> |
| datama.svg | <img src="icons/light/datama.svg" width="32" height="32" alt="datama" /> |
| chevron-down.svg | <img src="icons/light/chevron-down.svg" width="32" height="32" alt="chevron-down" /> |
| chevron-left.svg | <img src="icons/light/chevron-left.svg" width="32" height="32" alt="chevron-left" /> |
| chevron-right.svg | <img src="icons/light/chevron-right.svg" width="32" height="32" alt="chevron-right" /> |
| chevron-up.svg | <img src="icons/light/chevron-up.svg" width="32" height="32" alt="chevron-up" /> |
| arrow-top.svg | <img src="icons/light/arrow-top.svg" width="32" height="32" alt="arrow-top" /> |
| arrow-up-right.svg | <img src="icons/light/arrow-up-right.svg" width="32" height="32" alt="arrow-up-right" /> |
| balance-scale.svg | <img src="icons/light/balance-scale.svg" width="32" height="32" alt="balance-scale" /> |
| books.svg | <img src="icons/light/books.svg" width="32" height="32" alt="books" /> |
| chat.svg | <img src="icons/light/chat.svg" width="32" height="32" alt="chat" /> |
| check.svg | <img src="icons/light/check.svg" width="32" height="32" alt="check" /> |
| arrow-down-right.svg | <img src="icons/light/arrow-down-right.svg" width="32" height="32" alt="arrow-down-right" /> |
| arrow-left.svg | <img src="icons/light/arrow-left.svg" width="32" height="32" alt="arrow-left" /> |
| arrow-right.svg | <img src="icons/light/arrow-right.svg" width="32" height="32" alt="arrow-right" /> |
| alert-triangle.svg | <img src="icons/light/alert-triangle.svg" width="32" height="32" alt="alert-triangle" /> |
| area-chart.svg | <img src="icons/light/area-chart.svg" width="32" height="32" alt="area-chart" /> |
| arrow-bottom.svg | <img src="icons/light/arrow-bottom.svg" width="32" height="32" alt="arrow-bottom" /> |
| alert-circle.svg | <img src="icons/light/alert-circle.svg" width="32" height="32" alt="alert-circle" /> |
| qlik.svg | <img src="icons/logos/qlik.svg" width="32" height="32" alt="qlik" /> |
| datama-logo.svg | <img src="icons/logos/datama-logo.svg" width="32" height="32" alt="datama-logo" /> |
| drop-down-1.svg | <img src="icons/navigation/drop-down-1.svg" width="32" height="32" alt="drop-down-1" /> |
| drop-down.svg | <img src="icons/navigation/drop-down.svg" width="32" height="32" alt="drop-down" /> |
| drop-left.svg | <img src="icons/navigation/drop-left.svg" width="32" height="32" alt="drop-left" /> |
| drop-right.svg | <img src="icons/navigation/drop-right.svg" width="32" height="32" alt="drop-right" /> |
| drop-up.svg | <img src="icons/navigation/drop-up.svg" width="32" height="32" alt="drop-up" /> |

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

