# AGENTS.md

## Cursor Cloud specific instructions

This is a **standalone SVG icon library** (`@datama/icons`) — no external services, databases, or Docker required.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm ci` |
| Full build | `npm run build:all` |
| Dev build (diagnostic) | `npm run dev` |
| Tests | `npm test` |
| Lint | `npx eslint scripts/ --ext .js` |
| Font only | `npm run build:font` |

### Notes

- **Node.js 18+** is required (22 works fine).
- The `npm run dev` script is a one-shot build diagnostic, not a persistent dev server. It rebuilds SVG→JSON→Vue and prints a summary.
- `npm run build:all` chains: `build:svg` → `build:json` → `build:vue` → `build` (Rollup/CDN) → `build:font` (webfont).
- The font demo page is generated at `dist/fonts/vue3-icons.html` after `build:font`. Serve it with any static server (e.g. `python3 -m http.server 8080` from `dist/fonts/`).
- ESLint has pre-existing errors in the codebase (style/indent issues). These are not regressions.
- Tests validate icon structure and SVG validity. Some tests warn "run build first" if `dist/` is absent — run `npm run build:all` first for full test coverage.
- The `icons/` directory contains source SVGs organized by category (`actions/`, `charts/`, `data/`, `illustrations/`, `logos/`, `navigation/`, `settings/`, `sort/`, `sources/`, `ui/`, `vue3/`).
- Only icons in `icons/vue3/` are included in the web font build.
- **Icon authoring skill**: see [.cursor/skills/icons/SKILL.md](.cursor/skills/icons/SKILL.md) (loaded automatically via [.cursor/rules/icons.mdc](.cursor/rules/icons.mdc) when editing `icons/**/*.svg`).
