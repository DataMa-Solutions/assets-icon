# Migration and Integration Guide: DataMa Icons

This guide explains how to use and integrate the new `@datama/icons` icon library in your native JavaScript and Vue.js projects.

## 🎯 Overview

The `assets-icon` system generates icons in multiple formats:
- **For Native JS**: `DataMaPicto.js` - Compatible with the legacy `DataMaPicto.get()` API
- **For Vue.js**: CDN system with `<i>` tags (Font Awesome style)
- **For NPM**: Complete package with Vue components

## 📦 System Architecture

```
assets-icon/
├── icons/                      # Source SVG icons organized by categories
├── dist/
│   ├── DataMaPicto.js      # 🎯 For native JS projects (light/)
│   ├── datama-icons-cdn.js    # 🎯 For Vue.js (CDN)
│   ├── icons.json             # 🎯 Icon data
│   └── vue/                   # Complete Vue components
└── scripts/                   # Build scripts
```

## 🚀 For Native JavaScript Projects (light/)

### Automatic Process

The build automatically generates `DataMaPicto.js` and copies it to the `light/` project:

```bash
cd assets-icon/
npm run build:all
```

This will:
1. ✅ Generate `dist/DataMaPicto.js`
2. ✅ Automatically copy to `light/src/resources/components/DataMaPicto.js`
3. ✅ Copy `icons.json` to `light/src/assets/icons/icons.json`

### Integration in light/

1. **Import the new system** (without breaking the existing one):
```javascript
// In your light/ components
import { DataMaPicto } from "./DataMaPicto.js";  // New version
// import { DataMaPicto } from "./DataMaPicto.js";  // Old version (kept)

// Identical usage
const icon = DataMaPicto.get('home-svg', { id: 'my-icon' });
```

2. **Backward compatibility maintained**:
   - Same API: `DataMaPicto.get(iconName, options)`
   - Same export name: `DataMaPicto`
   - Same SVG structure returned

3. **New features available**:
```javascript
// Automatic color management
const greenCheck = DataMaPicto.get('check-svg', { fill: '#28a745' });

// Force color on complex icons (use with caution)
const coloredLogo = DataMaPicto.get('datama-svg', { 
  fill: '#007acc',
  forceComplexColor: true 
});
```

### Migration Strategy

**Phase 1 - Test** (No changes required):
```javascript
// Current imports continue to work
import { DataMaPicto } from "./DataMaPicto.js";
```

**Phase 2 - Migration** (When ready):
```javascript
// Simply change the import
import { DataMaPicto } from "./DataMaPicto.js";
```

**Phase 3 - Cleanup** (Later):
```javascript
// Remove old DataMaPicto.js file
// Update all imports to DataMaPicto.js
```

## 🌐 For Vue.js Projects (CDN)

### Quick Integration

1. **Add CDN script**:
```html
<script src="https://cdn.datama.fr/icons/datama-icons-cdn.js"></script>
```

2. **Use Font Awesome-style tags**:
```vue
<template>
  <div>
    <!-- Basic usage -->
    <i class="datama-icon" data-icon="check-svg"></i>
    
    <!-- With custom size -->
    <i class="datama-icon" data-icon="home-svg" data-size="32"></i>
    
    <!-- With custom color (for simple icons) -->
    <i class="datama-icon" data-icon="download-svg" 
       data-size="24" data-fill="#007acc"></i>
  </div>
</template>
```

3. **Initialize after DOM ready**:
```javascript
// Vue.js example
export default {
  mounted() {
    // Icons are automatically processed when DOM is ready
    window.DataMaPictoCDN?.init();
  }
}
```

### Advanced CDN Usage

```vue
<template>
  <div class="toolbar">
    <!-- Status icons with colors -->
    <i class="datama-icon" data-icon="check-svg" 
       data-fill="#28a745" data-size="20"></i>
    <i class="datama-icon" data-icon="alert-triangle-svg" 
       data-fill="#ffc107" data-size="20"></i>
    
    <!-- Complex icons (keep original colors) -->
    <i class="datama-icon" data-icon="datama-svg" data-size="32"></i>
    
    <!-- Force color on complex icon -->
    <i class="datama-icon" data-icon="settings-svg" 
       data-fill="#007acc" data-force-complex-color="true"></i>
  </div>
</template>

<style>
.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.datama-icon {
  cursor: pointer;
  transition: opacity 0.2s;
}

.datama-icon:hover {
  opacity: 0.7;
}
</style>
```

## 📦 For NPM Projects (Vue Components)

### Installation

```bash
npm install @datama/icons
```

### Vue 2 Integration

```javascript
// main.js
import Vue from 'vue';
import DataMaPicto from '@datama/icons/vue';

Vue.use(DataMaPicto);
```

### Usage in Components

```vue
<template>
  <div>
    <!-- Specific icon components -->
    <IconCheck :size="24" fill="#28a745" />
    <IconDownload :size="20" fill="#007acc" />
    
    <!-- Generic component -->
    <IconGeneric name="datama-svg" :size="32" />
    
    <!-- With all props -->
    <IconGeneric 
      name="arrow-right-svg"
      :size="24"
      fill="currentColor"
      stroke="none"
      :stroke-width="0"
      class="nav-icon"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconSize: 24,
      primaryColor: '#007acc'
    }
  }
}
</script>
```

### Available Props

All Vue components support:
- `size`: Number or string (default: 24)
- `width`: Number or string (overrides size)
- `height`: Number or string (overrides size)
- `fill`: String (default: 'currentColor')
- `stroke`: String (default: 'none')
- `strokeWidth`: Number or string (default: 0)
- `class`: String, object, or array for CSS classes

## 🔄 API Reference

### `DataMaPicto.get(iconName, options)`

**Parameters:**
- `iconName` (string): Icon name with `-svg` suffix (e.g., 'check-svg')
- `options` (object, optional):
  - `size`: Number (default: 24)
  - `fill`: String (default: 'currentColor')
  - `forceComplexColor`: Boolean (default: false) - Force color on complex icons
  - `id`: String - Custom ID for the SVG element
  - `className`: String - CSS classes to add

**Returns:** SVG Element ready to insert in DOM

### Examples

```javascript
// Simple icon with color
const icon1 = DataMaPicto.get('check-svg', { 
  size: 32, 
  fill: '#28a745' 
});

// Complex icon (original colors)
const icon2 = DataMaPicto.get('datama-svg', { size: 48 });

// Force color on complex icon
const icon3 = DataMaPicto.get('settings-svg', {
  fill: '#007acc',
  forceComplexColor: true
});

// Custom ID and classes
const icon4 = DataMaPicto.get('download-svg', {
  id: 'download-btn',
  className: 'toolbar-icon',
  fill: '#007acc'
});
```

## 🎨 Icon Classification

### Simple Icons (59 icons)
Automatically accept color changes:
- **UI Elements**: check, x, download, save, edit, trash-2
- **Navigation**: arrow-*, chevron-*, more-*
- **Interface**: cog, filter, magnifier, maximize-2

### Complex Icons (59 icons)
Preserve original colors by default:
- **Logos**: datama-svg, logo-*-svg
- **Illustrations**: illustration-*-svg
- **Advanced UI**: settings-svg, profile-*-svg

## 🛠️ Development and Testing

### Build Process

```bash
# In assets-icon/
npm run build:all        # Complete build
npm run build:vue        # Vue components only
npm run build:json       # JSON data only
npm run build:svg        # SVG processing only
```

### Testing Tools

1. **`example.html`**: Interactive test interface
   - Real-time color testing
   - Icon type indicators
   - Force color testing
   - Code generation

2. **`test-complex-icons.html`**: Comprehensive icon testing
   - All icons display
   - Filter by type (simple/complex)
   - Search functionality
   - Statistics overview

### Debug Mode

```javascript
// Enable debug logging
DataMaPicto.debug = true;

// Get detailed information
const iconData = DataMaPicto.getIconData('check-svg');
console.log(iconData.isComplex); // false for simple icons
```

## 🚀 Deployment and CDN

### Automatic Deployment

The GitHub Actions pipeline automatically:
1. Builds the library on new releases
2. Deploys to CDN at `https://cdn.datama.fr/icons/`
3. Updates NPM package
4. Copies files to `light/` project

### CDN Files Available

- `datama-icons-cdn.js` - Complete CDN system
- `icons.json` - Raw icon data
- `vue/` - Complete Vue component library

### Manual CDN Update

```bash
# Deploy to CDN (requires permissions)
npm run deploy:cdn
```

## ❓ Troubleshooting

### Common Issues

**Issue**: Icons not displaying
```javascript
// Solution: Check if DataMaPicto is loaded
if (typeof DataMaPicto !== 'undefined') {
  const icon = DataMaPicto.get('check-svg');
  document.body.appendChild(icon);
}
```

**Issue**: Colors not applying
```javascript
// Check if icon is complex
const iconData = DataMaPicto.getIconData('icon-name');
if (iconData.isComplex) {
  // Use forceComplexColor if needed
  const icon = DataMaPicto.get('icon-name', { 
    fill: '#color',
    forceComplexColor: true 
  });
}
```

**Issue**: Vue components not working
```javascript
// Ensure proper installation
Vue.use(DataMaPicto);

// Check component registration
console.log(Vue.options.components); // Should include icon components
```

### Performance Tips

1. **Preload common icons**:
```javascript
// Preload frequently used icons
['check-svg', 'x-svg', 'download-svg'].forEach(icon => {
  DataMaPicto.get(icon); // Cached for future use
});
```

2. **Use appropriate icon types**:
   - Use simple icons for UI elements that need color changes
   - Use complex icons for branding and illustrations

3. **Optimize bundle size**:
   - Import only needed Vue components
   - Use CDN for lighter builds

## 📚 Additional Resources

- **Example Files**: `example.html`, `test-complex-icons.html`
- **Color Examples**: `COLOR_EXAMPLES.md`
- **API Documentation**: `README.md`
- **Changelog**: `CHANGELOG.md` 