# Icons — reference

Supplementary material for the `icons` skill. Read when you need path syntax or concrete examples.

---

## Path commands

| Command | Syntax | Description |
|---------|--------|-------------|
| Move | `M x,y` | Move pen without drawing |
| Line | `L x,y` | Straight line |
| Horizontal | `H x` | Line to x |
| Vertical | `V y` | Line to y |
| Cubic bezier | `C x1,y1 x2,y2 x,y` | Curve |
| Quadratic | `Q x1,y1 x,y` | Simple curve |
| Arc | `A rx,ry rot large sweep x,y` | Elliptical arc |
| Close | `Z` | Close subpath |

Use **uppercase** for absolute coordinates.

---

## Rounded rectangle path

For rect `(x, y, width, height)` with corner radius `rx`:

```
M (x+rx),y
L (x+w-rx),y
Q (x+w),y (x+w),(y+rx)
L (x+w),(y+h-rx)
Q (x+w),(y+h) (x+w-rx),(y+h)
L (x+rx),(y+h)
Q x,(y+h) x,(y+h-rx)
L x,(y+rx)
Q x,y (x+rx),y
Z
```

Example — rect `(2.5, 7.15, 4, 13.85)`, `rx=0.75`:

```
M 3.25,7.15 L 5.75,7.15 Q 6.5,7.15 6.5,7.9 L 6.5,20.25 Q 6.5,21 5.75,21 L 3.25,21 Q 2.5,21 2.5,20.25 L 2.5,7.9 Q 2.5,7.15 3.25,7.15 Z
```

---

## Circle as path

```xml
<!-- radius 4, center (12,12) -->
M 16,12 A 4,4 0 1,1 8,12 A 4,4 0 1,1 16,12 Z
```

---

## Multiple shapes in one path

```xml
<path fill="currentColor" d="M12,3 L12,12 M5,7 C3,9,2,11,2,13 ... Z M8,8 L16,8 L16,16 L8,16 Z"/>
```

Each disconnected shape starts with `M`.

---

## Good examples (this repo)

### `icons/vue3/grid.svg` — filled tiles

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="currentColor" d="M 3,3 L 3,11 L 11,11 L 11,3 Z M 13,3 L 13,11 L 21,11 L 21,3 Z M 3,13 L 3,21 L 11,21 L 11,13 Z M 13,13 L 13,21 L 21,21 L 21,13 Z"/>
</svg>
```

### `icons/charts/waterfall.svg` — chart with aligned bars

- 4 rounded rects in one path
- Bars anchored to baseline `y = 21`
- Top of graphic at `y = 3` (3-unit top margin)
- Floating bars aligned by shared y values

---

## Bad example

```xml
<svg viewBox="0 0 24 24">
  <g id="icon">
    <circle cx="12" cy="12" r="10" fill="#000"/>
    <line x1="12" y1="2" x2="12" y2="12" stroke="black"/>
  </g>
</svg>
```

Problems: no XML declaration, no `xmlns`, groups, primitives, hardcoded colors, stroke-based, `id` attribute.

---

## Viewport margin worked example

**Problem:** content spans y 8→21 → top margin 8, bottom margin 3 (unbalanced).

**Fix:** scale vertically by `18/13` while keeping baseline at y = 21:

| | Before | After |
|---|--------|-------|
| Top | y = 8 | y = 3 |
| Bottom | y = 21 | y = 21 |
| Height used | 13 | 18 |
| Top margin | 8 | 3 |
| Bottom margin | 3 | 3 |

Apply the same scale factor to all y coordinates and heights relative to the baseline.

---

## Webfont output

After `npm run build:font`:

| File | Purpose |
|------|---------|
| `dist/fonts/vue3-icons.woff2` | Modern browsers |
| `dist/fonts/vue3-icons.css` | CSS classes |
| `dist/fonts/vue3-icons.html` | Visual demo |
| `dist/fonts/vue3-icons-mapping.json` | Unicode map |

Usage:

```html
<link rel="stylesheet" href="vue3-icons.css">
<i class="vue3-icon vue3-icon-home"></i>
```
