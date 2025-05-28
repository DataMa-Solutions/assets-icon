# @datama/icons

DataMa icon library with 118 icons organized in 7 categories, available as Vue 2 directive/components and JSON data.

## Installation

```bash
npm install @datama/icons
```

## Categories

The library includes 118 icons organized in 7 categories:

- **💼 Actions** - User interface actions and controls  
- **📊 Data** - Data visualization and analysis icons
- **🎨 Illustrations** - Complex illustrations and graphics
- **💡 Light** - Simple line icons with consistent styling
- **🏢 Logos** - Brand and service logos
- **🧭 Navigation** - Navigation and directional icons
- **🎛️ UI** - User interface elements and controls

## Usage

### 🔥 Vue 2 (Recommended)

#### Installation in Vue

```javascript
import Vue from 'vue';
import DatamaIcons from '@datama/icons/vue';

Vue.use(DatamaIcons);
```

#### Method 1: Using `<i>` tags with `data-datama` attribute

```vue
<template>
  <div>
    <!-- Simple usage -->
    <i data-datama="check-svg"></i>
    <i data-datama="arrow-right-svg"></i>
    
    <!-- With size and color -->
    <i data-datama="settings-svg" data-size="32" data-fill="#007acc"></i>
    
    <!-- Reactive attributes -->
    <i data-datama="home-svg" :data-size="iconSize" :data-fill="iconColor"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconSize: 24,
      iconColor: '#007acc'
    }
  }
}
</script>
```

#### Method 2: Using `v-datama` directive

```vue
<template>
  <div>
    <!-- Basic directive usage -->
    <span v-datama="'check-svg'"></span>
    
    <!-- With reactive icon name -->
    <span v-datama="selectedIcon"></span>
    
    <!-- With attributes -->
    <span v-datama="'upload-svg'" :data-size="48" :data-fill="'red'"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIcon: 'search-svg'
    }
  }
}
</script>
```

#### Method 3: Programmatic API

```vue
<template>
  <div>
    <!-- Using the global API -->
    <div v-html="$datama.toSvg('data-svg', { size: 48, fill: 'blue' })"></div>
    
    <!-- Using in methods -->
    <div v-html="generateIcon()"></div>
  </div>
</template>

<script>
export default {
  methods: {
    generateIcon() {
      return this.$datama.toSvg('settings-svg', {
        size: this.iconSize,
        fill: this.iconColor
      });
    }
  },
  data() {
    return {
      iconSize: 32,
      iconColor: '#ff6b6b'
    }
  }
}
</script>
```

#### Available options for all methods

- `data-size` / `size`: Icon size in pixels (default: 24)
- `data-width` / `width`: Icon width (overrides size)
- `data-height` / `height`: Icon height (overrides size)
- `data-fill` / `fill`: Fill color (default: 'currentColor')
- `data-stroke` / `stroke`: Stroke color (default: 'none')
- `data-stroke-width` / `strokeWidth`: Stroke width (default: 0)

### 📦 Vanilla JavaScript

#### Using the simple API

```javascript
import { DataMaLightIcons, replace, toSvg } from '@datama/icons';

// Replace all elements with data-datama attributes
replace({
  size: 24,
  fill: 'currentColor'
});

// Generate SVG string
const svgString = toSvg('check-svg', { size: 32, fill: 'blue' });

// Access icon data directly
const checkIcon = DataMaLightIcons['check-svg'];
console.log(checkIcon.path);
```

#### HTML usage

```html
<!-- Include the simple API -->
<script type="module" src="node_modules/@datama/icons/dist/index-simple.js"></script>

<!-- Use data-datama attributes -->
<i data-datama="check-svg" data-size="24"></i>
<i data-datama="arrow-right-svg" data-fill="#007acc"></i>

<script>
// Replace all icons automatically when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.DatamaIcons.replace();
});
</script>
```

### 📋 JSON Data (Node.js/Advanced usage)

```javascript
// ES Modules
import { DataMaLightIcons } from '@datama/icons';

// CommonJS
const { DataMaLightIcons } = require('@datama/icons');

// Access icon data
const checkIcon = DataMaLightIcons['check-svg'];
console.log(checkIcon);
// Output: { height: 24, path: "M9 16.17L4.83...", tags: ["check", "done"], ... }
```

## 🛠️ Development Scripts

### Build Scripts

- **`npm run build`** - Complete build process (processes SVGs, generates Vue components, JSON, and distribution files)
- **`npm run build:svg`** - Process SVG files from `icons/` directory and generate SVG data
- **`npm run build:vue`** - Generate Vue 2 components and directives from SVG data  
- **`npm run build:json`** - Generate JSON exports (`icons.js`, `icons.json`, `categories.js`)
- **`npm run build:all`** - Run all build steps in sequence (svg → vue → json → build)

### Development Scripts

- **`npm run dev`** - Development build with detailed output and examples
- **`npm run preview`** - Build and test the complete package
- **`npm run test`** - Run Jest tests
- **`npm run lint`** - Lint JavaScript files in scripts/

### Release Scripts

- **`npm run release`** - Interactive release (prompts for version type)
- **`npm run release:patch`** - Patch version release (1.0.0 → 1.0.1)
- **`npm run release:minor`** - Minor version release (1.0.0 → 1.1.0)  
- **`npm run release:major`** - Major version release (1.0.0 → 2.0.0)
- **`npm run version:check`** - Display current version

### Utility Scripts

- **`npm run prepare`** - Auto-run `build:all` when installing (npm hook)

## 📁 Project Structure

```
├── icons/                    # Source SVG files organized by category
│   ├── actions/             # Action icons (UI controls)
│   ├── data/                # Data visualization icons  
│   ├── illustrations/       # Complex illustrations
│   ├── light/               # Simple line icons
│   ├── logos/               # Brand logos
│   ├── navigation/          # Navigation icons
│   └── ui/                  # UI element icons
├── dist/                    # Generated distribution files
│   ├── index.js             # CommonJS entry point
│   ├── index.esm.js         # ES modules entry point
│   ├── index.d.ts           # TypeScript definitions
│   ├── index-simple.js      # Vanilla JavaScript API
│   ├── icons.js             # Icon data (ES modules)
│   ├── icons.json           # Icon data (JSON)
│   └── vue/                 # Vue 2 components package
├── scripts/                 # Build scripts
│   ├── build.js             # Main build orchestrator
│   ├── build-svg.js         # SVG processing
│   ├── build-vue.js         # Vue components generation
│   ├── build-json.js        # JSON exports generation
│   ├── dev.js               # Development utilities
│   └── release.sh           # Release automation
├── example.html             # Vanilla JavaScript example
├── example-vue.html         # Vue 2 example
└── package.json
```

## 📊 Icon Data Format

Each icon contains the following data:

```typescript
interface IconData {
  height: number;          // SVG viewBox height (usually 24)
  path?: string;          // SVG path data (for simple icons)
  content?: string;       // Full SVG content (for complex icons)
  tags: string[];         // Search/category tags
  viewBox?: string;       // Custom viewBox (default: "0 0 24 24")
  isComplex?: boolean;    // Whether icon uses content vs path
  ratio?: {               // Custom aspect ratio
    width: number;
    height: number;
  };
}
```

### Simple vs Complex Icons

- **Simple icons**: Use `path` property, single SVG path element
- **Complex icons**: Use `content` property, can contain multiple elements, gradients, etc.

## 🎨 Examples

Check out the included example files:

- **`example.html`** - Vanilla JavaScript usage with automatic icon replacement
- **`example-vue.html`** - Vue 2 usage with all three methods (directive, data-attribute, API)

## 🔧 Contributing

### Adding New Icons

1. Add SVG files to the appropriate category folder in `icons/`
2. Run `npm run build:all` to regenerate all outputs
3. Test your icons in `example.html` or `example-vue.html`
4. The build process will automatically:
   - Optimize SVGs
   - Generate Vue components  
   - Update JSON exports
   - Create TypeScript definitions

### Build Process Details

The build process automatically:
- Scans `icons/` subdirectories for SVG files
- Generates icon names by converting filenames to kebab-case + `-svg` suffix
- Creates categories based on folder structure
- Optimizes SVGs and handles complex/simple icon types
- Generates Vue directives, components, and vanilla JS APIs
- Creates comprehensive TypeScript definitions

## 📜 License

MIT © DataMa SAS
