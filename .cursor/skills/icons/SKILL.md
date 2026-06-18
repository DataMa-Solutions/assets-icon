---
name: icons
description: >-
  Create and edit SVG icons for the @datama/icons library. Mandatory when
  creating, modifying, or reviewing any file in icons/**/*.svg. Covers SVG
  structure, filled paths, 24×24 viewport margins, category folders, vue3
  webfont rules, variant proposals, and build validation.
---

# Icons — SVG authoring skill

Portable skill for any AI agent working on the **@datama/icons** repository (or any similar SVG icon library).

## Repository context

| Item | Value |
|------|-------|
| Package | `@datama/icons` |
| Source | `icons/<category>/<name>.svg` |
| Build | `npm run build:all` |
| Tests | `npm test` |
| Font build | `npm run build:font` (only `icons/vue3/`) |

Categories are discovered automatically from subfolders (`actions/`, `charts/`, `data/`, `ui/`, `vue3/`, etc.). Each icon is exposed as `<name>-svg` in `dist/svg-data.json`.

---

## Workflow

### 1. Clarify the request

- What concept does the icon represent?
- Where will it be used?
- Which category folder? (create a new one if needed, e.g. `icons/charts/`)
- Should it be included in the webfont? → only if placed in `icons/vue3/`

### 2. Analyze existing icons before drawing

Before authoring a new SVG from scratch, **search the library for a viable base**:

1. List or grep `icons/**/*.svg` (all categories: `ui/`, `vue3/`, `charts/`, `actions/`, …).
2. Read candidates that share the same metaphor or geometry (e.g. `vue3/search.svg` for zoom icons).
3. If a base icon already matches the intended shape, **reuse its path verbatim** and only append the delta (badge, modifier, second glyph).
4. Keep the same `fill-rule`, winding, and viewport conventions as the base — do not redraw the base from memory.

**Example:** `zoom-in` / `zoom-out` must copy `icons/vue3/search.svg` exactly (ring + handle via `fill-rule="evenodd"`), then add a rounded `+` or `−` inside the lens. Never replace the ring with a filled disc.

### 3. Propose 2–3 visual variants

Describe each option (minimal, balanced, alternative metaphor). **Wait for user confirmation** before writing the SVG unless the user explicitly asked to implement directly.

### 4. Create the SVG

Follow structure, style, and viewport rules below.

### 5. Build and verify

```bash
npm run build:all
npm test
```

Visually check the icon at 16px, 24px, and 32px if possible.

---

## Mandatory SVG structure

Every new icon **must** match this template:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="currentColor" d="..."/>
</svg>
```

### Required

| Rule | Detail |
|------|--------|
| XML declaration | `<?xml version="1.0" encoding="UTF-8"?>` |
| viewBox | Always `0 0 24 24` |
| Color | `fill="currentColor"` — never hardcoded hex |
| Single path | One `<path>`; combine shapes with `M` (move) commands |
| Filled shapes | Use filled paths, not strokes (see webfont section) |

### Forbidden

- `<g>`, `<defs>`, `<mask>`, `<clipPath>`, `<filter>`
- Primitive elements: `<circle>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>` (convert to path)
- `id`, `data-name`, inline `style`, `<style>` tags
- `width` / `height` on `<svg>` (viewBox only)
- Multiple `<path>` elements

---

## Visual style

| Property | Target |
|----------|--------|
| Grid | 24 × 24 |
| Look | Minimal line-art; geometric, modern |
| Weight | ~2px visual thickness (filled paths that read as strokes) |
| Corners / caps | Rounded (`rx ≈ 0.75` on rects; rounded joins on lines) |
| Margins | **3 units** from each viewport edge (default) |

Design filled paths that **look** like 2px stroked line art. In Figma / Illustrator / Inkscape: draw with stroke → **Outline Stroke** / **Stroke to Path** → union → export with `fill="currentColor"`.

---

## Viewport positioning (critical)

Icons must **fill the viewport evenly**. Uneven padding makes icons look smaller or off-center at runtime.

### Default margins

- **Target margin: 3 units** on every side.
- Usable content area: **x 3 → 21**, **y 3 → 21** (18 × 18 units).

### Verification (do this before saving)

Measure bounding box of all visible geometry:

```
top_margin    = min_y - 0
bottom_margin = 24 - max_y
left_margin   = min_x - 0
right_margin  = 24 - max_x
```

**Top and bottom margins must match** (same for left/right). If they differ, fix before shipping.

### How to fix unbalanced margins

1. **Prefer proportional scaling** over a simple translate when the icon has a clear baseline (charts, bars, axes):
   - Keep anchored elements on the baseline (e.g. `y = 21`).
   - Scale vertical extent so `min_y = 3` and `max_y = 21`.
   - Example: content was y 8→21 (13 units) → scale to y 3→21 (18 units), factor `18/13`.

2. **Simple shift** when all edges should move together and no baseline must stay fixed.

3. **Re-check after every proportion change** — resizing bars or spacing often breaks margin balance.

### Chart / composite icons

- Define explicit coordinates in a table (x, y, w, h per shape) before writing path data.
- Validate alignments (e.g. waterfall: bar tops/bottoms that must line up).
- After spacing or height tweaks, **re-run margin verification**.

---

## Category-specific rules

### General icons (`icons/charts/`, `icons/ui/`, `icons/data/`, …)

- Filled `currentColor` paths (same as template above).
- Aim for `isComplex: false` in the build (single simple path).
- Not included in webfont unless copied to `icons/vue3/`.

### Webfont icons (`icons/vue3/` only)

Icons here are converted to a font via `webfont` (`scripts/build-font.js`).

**Stroke-based SVGs do not work reliably in webfont.** Glyphs may be missing, distorted, or inconsistent.

| Do | Don't |
|----|-------|
| Filled paths with `fill="currentColor"` | `stroke` attributes |
| Outline strokes in design tools first | Rely on automatic stroke→fill conversion |
| Manual filled version in `icons/vue3/` | Assume the build script fixes strokes |

After changes: `npm run build:font` → check `dist/fonts/vue3-icons.html`.

---

## Path construction quick reference

- **Rounded rect** `(x, y, w, h, rx)`: use `L` + `Q` corner arcs (see [reference.md](reference.md)).
- **Disconnected shapes**: `M ... Z M ... Z` in one path.
- **Circles**: arc commands `A`, not `<circle>`.

Full command table and examples: [reference.md](reference.md).

---

## Pre-save checklist

```
- [ ] Existing icons reviewed; base path reused when applicable
- [ ] XML declaration + xmlns + viewBox 0 0 24 24
- [ ] Single <path>, fill="currentColor", no stroke
- [ ] No forbidden elements or attributes
- [ ] Margins ≈ 3 units on all four sides (verified numerically)
- [ ] Top margin ≈ bottom margin; left ≈ right
- [ ] Rounded corners where appropriate
- [ ] Path data reasonably compact
- [ ] Correct category folder and kebab-case filename
- [ ] npm run build:all && npm test pass
- [ ] (vue3 only) font demo checked
```

---

## Build commands

| Action | Command |
|--------|---------|
| Full pipeline | `npm run build:all` |
| SVG processing only | `npm run build:svg` |
| Font only | `npm run build:font` |
| Tests | `npm test` |

Pipeline order: `build:svg` → `build:json` → `build:vue` → `build` → `build:font`.

---

## Additional resources

- Path syntax, good/bad examples: [reference.md](reference.md)
- Project agent notes: [AGENTS.md](../../../AGENTS.md) (repo root)
