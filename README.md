# @datama/icons

DataMa icon library with 211 icons, available as Vue 2 components and JSON data.

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

## Available Icons (211)

| Nom de l'icône | Aperçu |
|:-------------- |:------:|
| `add-folder-svg` | <img src="icons/actions/add-folder.svg" width="32" height="32" alt="add-folder" /> |
| `alert-circle-svg` | <img src="icons/legacy/alert-circle.svg" width="32" height="32" alt="alert-circle" /> |
| `alert-triangle-svg` | <img src="icons/legacy/alert-triangle.svg" width="32" height="32" alt="alert-triangle" /> |
| `annotate-svg` | <img src="icons/charts/annotate.svg" width="32" height="32" alt="annotate" /> |
| `area-chart-svg` | <img src="icons/legacy/area-chart.svg" width="32" height="32" alt="area-chart" /> |
| `areas-svg` | <img src="icons/charts/areas.svg" width="32" height="32" alt="areas" /> |
| `arrow-bottom-svg` | <img src="icons/legacy/arrow-bottom.svg" width="32" height="32" alt="arrow-bottom" /> |
| `arrow-down-right-svg` | <img src="icons/legacy/arrow-down-right.svg" width="32" height="32" alt="arrow-down-right" /> |
| `arrow-down-svg` | <img src="icons/ui/arrow-down.svg" width="32" height="32" alt="arrow-down" /> |
| `arrow-left-svg` | <img src="icons/legacy/arrow-left.svg" width="32" height="32" alt="arrow-left" /> |
| `arrow-right-svg` | <img src="icons/legacy/arrow-right.svg" width="32" height="32" alt="arrow-right" /> |
| `arrow-top-svg` | <img src="icons/legacy/arrow-top.svg" width="32" height="32" alt="arrow-top" /> |
| `arrow-up-right-svg` | <img src="icons/legacy/arrow-up-right.svg" width="32" height="32" alt="arrow-up-right" /> |
| `arrow-up-svg` | <img src="icons/ui/arrow-up.svg" width="32" height="32" alt="arrow-up" /> |
| `assess-svg` | <img src="icons/data/assess.svg" width="32" height="32" alt="assess" /> |
| `axis-cut-svg` | <img src="icons/charts/axis-cut.svg" width="32" height="32" alt="axis-cut" /> |
| `axis-svg` | <img src="icons/charts/axis.svg" width="32" height="32" alt="axis" /> |
| `balance-scale-svg` | <img src="icons/legacy/balance-scale.svg" width="32" height="32" alt="balance-scale" /> |
| `bars-stacked-2-svg` | <img src="icons/charts/bars-stacked-2.svg" width="32" height="32" alt="bars-stacked-2" /> |
| `bars-stacked-svg` | <img src="icons/charts/bars-stacked.svg" width="32" height="32" alt="bars-stacked" /> |
| `bars-svg` | <img src="icons/charts/bars.svg" width="32" height="32" alt="bars" /> |
| `basketball-svg` | <img src="icons/ui/basketball.svg" width="32" height="32" alt="basketball" /> |
| `book-svg` | <img src="icons/ui/book.svg" width="32" height="32" alt="book" /> |
| `bookmark-svg` | <img src="icons/ui/bookmark.svg" width="32" height="32" alt="bookmark" /> |
| `books-svg` | <img src="icons/legacy/books.svg" width="32" height="32" alt="books" /> |
| `bug-svg` | <img src="icons/legacy/bug.svg" width="32" height="32" alt="bug" /> |
| `calendar-display-svg` | <img src="icons/legacy/calendar-display.svg" width="32" height="32" alt="calendar-display" /> |
| `calendar-markers-svg` | <img src="icons/legacy/calendar-markers.svg" width="32" height="32" alt="calendar-markers" /> |
| `calendar-svg` | <img src="icons/ui/calendar.svg" width="32" height="32" alt="calendar" /> |
| `cards-svg` | <img src="icons/charts/cards.svg" width="32" height="32" alt="cards" /> |
| `chat-svg` | <img src="icons/legacy/chat.svg" width="32" height="32" alt="chat" /> |
| `check-svg` | <img src="icons/ui/check.svg" width="32" height="32" alt="check" /> |
| `chevron-down-svg` | <img src="icons/ui/chevron-down.svg" width="32" height="32" alt="chevron-down" /> |
| `chevron-left-svg` | <img src="icons/legacy/chevron-left.svg" width="32" height="32" alt="chevron-left" /> |
| `chevron-right-svg` | <img src="icons/legacy/chevron-right.svg" width="32" height="32" alt="chevron-right" /> |
| `chevron-up-svg` | <img src="icons/ui/chevron-up.svg" width="32" height="32" alt="chevron-up" /> |
| `close-svg` | <img src="icons/legacy/close.svg" width="32" height="32" alt="close" /> |
| `cluster-svg` | <img src="icons/legacy/cluster.svg" width="32" height="32" alt="cluster" /> |
| `cog-svg` | <img src="icons/settings/cog.svg" width="32" height="32" alt="cog" /> |
| `cogs-svg` | <img src="icons/settings/cogs.svg" width="32" height="32" alt="cogs" /> |
| `comment-bubble-svg` | <img src="icons/ui/comment-bubble.svg" width="32" height="32" alt="comment-bubble" /> |
| `compare-svg` | <img src="icons/data/compare.svg" width="32" height="32" alt="compare" /> |
| `connector-svg` | <img src="icons/charts/connector.svg" width="32" height="32" alt="connector" /> |
| `contacts-svg` | <img src="icons/ui/contacts.svg" width="32" height="32" alt="contacts" /> |
| `copy-svg` | <img src="icons/ui/copy.svg" width="32" height="32" alt="copy" /> |
| `cross-svg` | <img src="icons/ui/cross.svg" width="32" height="32" alt="cross" /> |
| `csv-outline-2-svg` | <img src="icons/sources/csv-outline-2.svg" width="32" height="32" alt="csv-outline-2" /> |
| `csv-outline-svg` | <img src="icons/sources/csv-outline.svg" width="32" height="32" alt="csv-outline" /> |
| `csv-svg` | <img src="icons/sources/csv.svg" width="32" height="32" alt="csv" /> |
| `cube-svg` | <img src="icons/ui/cube.svg" width="32" height="32" alt="cube" /> |
| `data-svg` | <img src="icons/data/data.svg" width="32" height="32" alt="data" /> |
| `database-svg` | <img src="icons/data/database.svg" width="32" height="32" alt="database" /> |
| `datama-logo-svg` | <img src="icons/logos/datama-logo.svg" width="32" height="32" alt="datama-logo" /> |
| `datama-svg` | <img src="icons/legacy/datama.svg" width="32" height="32" alt="datama" /> |
| `detect-svg` | <img src="icons/data/detect.svg" width="32" height="32" alt="detect" /> |
| `disconnect-svg` | <img src="icons/vue3/disconnect.svg" width="32" height="32" alt="disconnect" /> |
| `documentation-svg` | <img src="icons/ui/documentation.svg" width="32" height="32" alt="documentation" /> |
| `documents-svg` | <img src="icons/ui/documents.svg" width="32" height="32" alt="documents" /> |
| `download-svg` | <img src="icons/ui/download.svg" width="32" height="32" alt="download" /> |
| `drop-down-1-svg` | <img src="icons/navigation/drop-down-1.svg" width="32" height="32" alt="drop-down-1" /> |
| `drop-down-svg` | <img src="icons/navigation/drop-down.svg" width="32" height="32" alt="drop-down" /> |
| `drop-left-svg` | <img src="icons/navigation/drop-left.svg" width="32" height="32" alt="drop-left" /> |
| `drop-right-svg` | <img src="icons/navigation/drop-right.svg" width="32" height="32" alt="drop-right" /> |
| `drop-up-svg` | <img src="icons/navigation/drop-up.svg" width="32" height="32" alt="drop-up" /> |
| `earth-svg` | <img src="icons/ui/earth.svg" width="32" height="32" alt="earth" /> |
| `edit-svg` | <img src="icons/ui/edit.svg" width="32" height="32" alt="edit" /> |
| `elements-svg` | <img src="icons/charts/elements.svg" width="32" height="32" alt="elements" /> |
| `excel-outline-2-svg` | <img src="icons/sources/excel-outline-2.svg" width="32" height="32" alt="excel-outline-2" /> |
| `excel-outline-svg` | <img src="icons/sources/excel-outline.svg" width="32" height="32" alt="excel-outline" /> |
| `excel-svg` | <img src="icons/sources/excel.svg" width="32" height="32" alt="excel" /> |
| `eyes-svg` | <img src="icons/ui/eyes.svg" width="32" height="32" alt="eyes" /> |
| `facebook-svg` | <img src="icons/sources/facebook.svg" width="32" height="32" alt="facebook" /> |
| `filter-svg` | <img src="icons/legacy/filter.svg" width="32" height="32" alt="filter" /> |
| `flow-svg` | <img src="icons/ui/flow.svg" width="32" height="32" alt="flow" /> |
| `folder-open-svg` | <img src="icons/ui/folder-open.svg" width="32" height="32" alt="folder-open" /> |
| `font-size-svg` | <img src="icons/ui/font-size.svg" width="32" height="32" alt="font-size" /> |
| `font-svg` | <img src="icons/legacy/font.svg" width="32" height="32" alt="font" /> |
| `function-svg` | <img src="icons/legacy/function.svg" width="32" height="32" alt="function" /> |
| `gauge-horizontal-svg` | <img src="icons/ui/gauge-horizontal.svg" width="32" height="32" alt="gauge-horizontal" /> |
| `gauge-svg` | <img src="icons/legacy/gauge.svg" width="32" height="32" alt="gauge" /> |
| `google-ads-svg` | <img src="icons/sources/google-ads.svg" width="32" height="32" alt="google-ads" /> |
| `google-analytics-svg` | <img src="icons/sources/google-analytics.svg" width="32" height="32" alt="google-analytics" /> |
| `google-bigquery-svg` | <img src="icons/sources/google-bigquery.svg" width="32" height="32" alt="google-bigquery" /> |
| `google-drive-svg` | <img src="icons/sources/google-drive.svg" width="32" height="32" alt="google-drive" /> |
| `google-sheets-svg` | <img src="icons/sources/google-sheets.svg" width="32" height="32" alt="google-sheets" /> |
| `google-svg` | <img src="icons/sources/google.svg" width="32" height="32" alt="google" /> |
| `google-trend-svg` | <img src="icons/sources/google-trend.svg" width="32" height="32" alt="google-trend" /> |
| `graph-chart-svg` | <img src="icons/data/graph-chart.svg" width="32" height="32" alt="graph-chart" /> |
| `grid-svg` | <img src="icons/ui/grid.svg" width="32" height="32" alt="grid" /> |
| `group-svg` | <img src="icons/ui/group.svg" width="32" height="32" alt="group" /> |
| `groups-svg` | <img src="icons/ui/groups.svg" width="32" height="32" alt="groups" /> |
| `handshake-svg` | <img src="icons/legacy/handshake.svg" width="32" height="32" alt="handshake" /> |
| `heart-svg` | <img src="icons/legacy/heart.svg" width="32" height="32" alt="heart" /> |
| `help-circle-svg` | <img src="icons/ui/help-circle.svg" width="32" height="32" alt="help-circle" /> |
| `home-svg` | <img src="icons/vue3/home.svg" width="32" height="32" alt="home" /> |
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
| `inactive-sort-svg` | <img src="icons/sort/inactive-sort.svg" width="32" height="32" alt="inactive-sort" /> |
| `include-zero-svg` | <img src="icons/charts/include-zero.svg" width="32" height="32" alt="include-zero" /> |
| `journey-svg` | <img src="icons/data/journey.svg" width="32" height="32" alt="journey" /> |
| `key-svg` | <img src="icons/legacy/key.svg" width="32" height="32" alt="key" /> |
| `label-svg` | <img src="icons/legacy/label.svg" width="32" height="32" alt="label" /> |
| `leave-org-svg` | <img src="icons/actions/leave-org.svg" width="32" height="32" alt="leave-org" /> |
| `legend-svg` | <img src="icons/legacy/legend.svg" width="32" height="32" alt="legend" /> |
| `license-key-svg` | <img src="icons/ui/license-key.svg" width="32" height="32" alt="license-key" /> |
| `lines-svg` | <img src="icons/charts/lines.svg" width="32" height="32" alt="lines" /> |
| `link-open-svg` | <img src="icons/ui/link-open.svg" width="32" height="32" alt="link-open" /> |
| `link-svg` | <img src="icons/legacy/link.svg" width="32" height="32" alt="link" /> |
| `lock-svg` | <img src="icons/ui/lock.svg" width="32" height="32" alt="lock" /> |
| `looker-svg` | <img src="icons/sources/looker.svg" width="32" height="32" alt="looker" /> |
| `magnifier-svg` | <img src="icons/legacy/magnifier.svg" width="32" height="32" alt="magnifier" /> |
| `manage-billing-svg` | <img src="icons/settings/manage-billing.svg" width="32" height="32" alt="manage-billing" /> |
| `manage-org-svg` | <img src="icons/settings/manage-org.svg" width="32" height="32" alt="manage-org" /> |
| `manage-profile-svg` | <img src="icons/settings/manage-profile.svg" width="32" height="32" alt="manage-profile" /> |
| `mariadb-svg` | <img src="icons/sources/mariadb.svg" width="32" height="32" alt="mariadb" /> |
| `maximize-2-svg` | <img src="icons/legacy/maximize-2.svg" width="32" height="32" alt="maximize-2" /> |
| `mekko-svg` | <img src="icons/charts/mekko.svg" width="32" height="32" alt="mekko" /> |
| `merge-cells-svg` | <img src="icons/ui/merge-cells.svg" width="32" height="32" alt="merge-cells" /> |
| `metabase-svg` | <img src="icons/sources/metabase.svg" width="32" height="32" alt="metabase" /> |
| `minus-svg` | <img src="icons/vue3/minus.svg" width="32" height="32" alt="minus" /> |
| `more-horizontal-svg` | <img src="icons/legacy/more-horizontal.svg" width="32" height="32" alt="more-horizontal" /> |
| `more-vertical-svg` | <img src="icons/legacy/more-vertical.svg" width="32" height="32" alt="more-vertical" /> |
| `moves-svg` | <img src="icons/charts/moves.svg" width="32" height="32" alt="moves" /> |
| `multiply-svg` | <img src="icons/charts/multiply.svg" width="32" height="32" alt="multiply" /> |
| `mysql-svg` | <img src="icons/sources/mysql.svg" width="32" height="32" alt="mysql" /> |
| `new-pillar-svg` | <img src="icons/charts/new-pillar.svg" width="32" height="32" alt="new-pillar" /> |
| `new-tab-svg` | <img src="icons/legacy/new-tab.svg" width="32" height="32" alt="new-tab" /> |
| `number-by-asc-svg` | <img src="icons/sort/number-by-asc.svg" width="32" height="32" alt="number-by-asc" /> |
| `number-by-desc-svg` | <img src="icons/sort/number-by-desc.svg" width="32" height="32" alt="number-by-desc" /> |
| `onedrive-svg` | <img src="icons/sources/onedrive.svg" width="32" height="32" alt="onedrive" /> |
| `openai-svg` | <img src="icons/sources/openai.svg" width="32" height="32" alt="openai" /> |
| `operator-svg` | <img src="icons/charts/operator.svg" width="32" height="32" alt="operator" /> |
| `paint-bucket-svg` | <img src="icons/ui/paint-bucket.svg" width="32" height="32" alt="paint-bucket" /> |
| `paint-svg` | <img src="icons/ui/paint.svg" width="32" height="32" alt="paint" /> |
| `palette-svg` | <img src="icons/ui/palette.svg" width="32" height="32" alt="palette" /> |
| `peace-svg` | <img src="icons/legacy/peace.svg" width="32" height="32" alt="peace" /> |
| `piano-svg` | <img src="icons/sources/piano.svg" width="32" height="32" alt="piano" /> |
| `pivot-svg` | <img src="icons/data/pivot.svg" width="32" height="32" alt="pivot" /> |
| `play-svg` | <img src="icons/legacy/play.svg" width="32" height="32" alt="play" /> |
| `plus-circle-svg` | <img src="icons/ui/plus-circle.svg" width="32" height="32" alt="plus-circle" /> |
| `plus-svg` | <img src="icons/vue3/plus.svg" width="32" height="32" alt="plus" /> |
| `postgresql-svg` | <img src="icons/sources/postgresql.svg" width="32" height="32" alt="postgresql" /> |
| `power-bi-svg` | <img src="icons/sources/power-bi.svg" width="32" height="32" alt="power-bi" /> |
| `profile-1-svg` | <img src="icons/ui/profile-1.svg" width="32" height="32" alt="profile-1" /> |
| `profile-add-svg` | <img src="icons/ui/profile-add.svg" width="32" height="32" alt="profile-add" /> |
| `profile-info-svg` | <img src="icons/ui/profile-info.svg" width="32" height="32" alt="profile-info" /> |
| `profile-setting-svg` | <img src="icons/ui/profile-setting.svg" width="32" height="32" alt="profile-setting" /> |
| `profile-svg` | <img src="icons/ui/profile.svg" width="32" height="32" alt="profile" /> |
| `qlik-svg` | <img src="icons/logos/qlik.svg" width="32" height="32" alt="qlik" /> |
| `ratio-svg` | <img src="icons/charts/ratio.svg" width="32" height="32" alt="ratio" /> |
| `redshift-svg` | <img src="icons/sources/redshift.svg" width="32" height="32" alt="redshift" /> |
| `refresh-svg` | <img src="icons/vue3/refresh.svg" width="32" height="32" alt="refresh" /> |
| `release-notes-1-svg` | <img src="icons/ui/release-notes-1.svg" width="32" height="32" alt="release-notes-1" /> |
| `release-notes-svg` | <img src="icons/ui/release-notes.svg" width="32" height="32" alt="release-notes" /> |
| `reverse-axis-svg` | <img src="icons/charts/reverse-axis.svg" width="32" height="32" alt="reverse-axis" /> |
| `reverse-h-svg` | <img src="icons/actions/reverse-h.svg" width="32" height="32" alt="reverse-h" /> |
| `reverse-v-svg` | <img src="icons/actions/reverse-v.svg" width="32" height="32" alt="reverse-v" /> |
| `rotate-ccw-svg` | <img src="icons/legacy/rotate-ccw.svg" width="32" height="32" alt="rotate-ccw" /> |
| `rotate-ccw1-svg` | <img src="icons/legacy/rotate-ccw1.svg" width="32" height="32" alt="rotate-ccw1" /> |
| `rotate-cw-svg` | <img src="icons/legacy/rotate-cw.svg" width="32" height="32" alt="rotate-cw" /> |
| `rotate-cw1-svg` | <img src="icons/legacy/rotate-cw1.svg" width="32" height="32" alt="rotate-cw1" /> |
| `save-svg` | <img src="icons/legacy/save.svg" width="32" height="32" alt="save" /> |
| `scatter-svg` | <img src="icons/charts/scatter.svg" width="32" height="32" alt="scatter" /> |
| `search-svg` | <img src="icons/vue3/search.svg" width="32" height="32" alt="search" /> |
| `settings-1-svg` | <img src="icons/ui/settings-1.svg" width="32" height="32" alt="settings-1" /> |
| `settings-org-svg` | <img src="icons/ui/settings-org.svg" width="32" height="32" alt="settings-org" /> |
| `settings-svg` | <img src="icons/vue3/settings.svg" width="32" height="32" alt="settings" /> |
| `share-2-svg` | <img src="icons/legacy/share-2.svg" width="32" height="32" alt="share-2" /> |
| `shopping-cart-svg` | <img src="icons/ui/shopping-cart.svg" width="32" height="32" alt="shopping-cart" /> |
| `sidebar-toggle-svg` | <img src="icons/ui/sidebar-toggle.svg" width="32" height="32" alt="sidebar-toggle" /> |
| `snowflake-svg` | <img src="icons/sources/snowflake.svg" width="32" height="32" alt="snowflake" /> |
| `split-by-svg` | <img src="icons/ui/split-by.svg" width="32" height="32" alt="split-by" /> |
| `stacked-svg` | <img src="icons/legacy/stacked.svg" width="32" height="32" alt="stacked" /> |
| `star-cool-svg` | <img src="icons/ui/star-cool.svg" width="32" height="32" alt="star-cool" /> |
| `string-by-asc-svg` | <img src="icons/sort/string-by-asc.svg" width="32" height="32" alt="string-by-asc" /> |
| `string-by-desc-svg` | <img src="icons/sort/string-by-desc.svg" width="32" height="32" alt="string-by-desc" /> |
| `table-compact-svg` | <img src="icons/ui/table-compact.svg" width="32" height="32" alt="table-compact" /> |
| `table-minimal-svg` | <img src="icons/ui/table-minimal.svg" width="32" height="32" alt="table-minimal" /> |
| `table-striped-svg` | <img src="icons/ui/table-striped.svg" width="32" height="32" alt="table-striped" /> |
| `table-svg` | <img src="icons/vue3/table.svg" width="32" height="32" alt="table" /> |
| `tableau-svg` | <img src="icons/sources/tableau.svg" width="32" height="32" alt="tableau" /> |
| `tag-svg` | <img src="icons/charts/tag.svg" width="32" height="32" alt="tag" /> |
| `text-color-svg` | <img src="icons/legacy/text-color.svg" width="32" height="32" alt="text-color" /> |
| `trash-2-svg` | <img src="icons/legacy/trash-2.svg" width="32" height="32" alt="trash-2" /> |
| `tree-hierarchy-svg` | <img src="icons/charts/tree-hierarchy.svg" width="32" height="32" alt="tree-hierarchy" /> |
| `tree-svg` | <img src="icons/charts/tree.svg" width="32" height="32" alt="tree" /> |
| `tutorials-svg` | <img src="icons/ui/tutorials.svg" width="32" height="32" alt="tutorials" /> |
| `unmerge-cells-svg` | <img src="icons/ui/unmerge-cells.svg" width="32" height="32" alt="unmerge-cells" /> |
| `unstacked-svg` | <img src="icons/legacy/unstacked.svg" width="32" height="32" alt="unstacked" /> |
| `update-svg` | <img src="icons/actions/update.svg" width="32" height="32" alt="update" /> |
| `upload-1-svg` | <img src="icons/actions/upload-1.svg" width="32" height="32" alt="upload-1" /> |
| `upload-svg` | <img src="icons/actions/upload.svg" width="32" height="32" alt="upload" /> |
| `user-svg` | <img src="icons/vue3/user.svg" width="32" height="32" alt="user" /> |
| `value-by-asc-svg` | <img src="icons/sort/value-by-asc.svg" width="32" height="32" alt="value-by-asc" /> |
| `value-by-desc-svg` | <img src="icons/sort/value-by-desc.svg" width="32" height="32" alt="value-by-desc" /> |
| `warning-svg` | <img src="icons/ui/warning.svg" width="32" height="32" alt="warning" /> |
| `waterfall-svg` | <img src="icons/charts/waterfall.svg" width="32" height="32" alt="waterfall" /> |
| `x-svg` | <img src="icons/legacy/x.svg" width="32" height="32" alt="x" /> |
| `xtwitter-svg` | <img src="icons/sources/xtwitter.svg" width="32" height="32" alt="xtwitter" /> |
| `zoom-in-svg` | <img src="icons/ui/zoom-in.svg" width="32" height="32" alt="zoom-in" /> |
| `zoom-out-svg` | <img src="icons/ui/zoom-out.svg" width="32" height="32" alt="zoom-out" /> |

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
