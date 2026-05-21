# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

`@datama/icons` is a standalone SVG icon library that builds icons into JSON data, Vue 2 components, and an icon webfont. No backend, no database, no Docker needed.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm ci` |
| Lint | `npx eslint .` |
| Test | `npm test` |
| Full build | `npm run build:all` |
| Dev build (quick) | `npm run dev` |
| Font build only | `npm run build:font` |

### Notes

- Node.js 18+ required (the VM has Node 22 which is compatible).
- The `npm run build:all` pipeline runs: `build:svg` → `build:json` → `build:vue` → `build` (Rollup bundle) → `build:font` (webfont).
- Tests (`npm test`) pass without running `build:all` first, but some checks emit warnings about missing dist files. For full coverage, run `npm run build:all` before `npm test`.
- ESLint has pre-existing errors in the codebase (mostly in `test-icons.js` and `scripts/dev.js`). These are not blocking.
- Build outputs go to `dist/` (JS bundles, Vue components, fonts). This directory is gitignored.
- The `icons/` folder contains source SVGs organized by category (actions, data, illustrations, logos, navigation, settings, sort, sources, ui, vue3).
- Icons in `icons/vue3/` are used specifically for webfont generation via `scripts/build-font.js`.
