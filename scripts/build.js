const fs = require('fs');
const path = require('path');
const { buildSvgData } = require('./build-svg');
const { buildJson } = require('./build-json');
const { buildVue } = require('./build-vue');

/**
 * Create TypeScript definitions
 */
function generateTypeScriptDefinitions(iconData) {
  const iconNames = Object.keys(iconData).sort();
  
  const iconNamesType = iconNames.map(name => `'${name}'`).join(' | ');
  
  const definitions = `// Auto-generated TypeScript definitions for @datama/icons

export interface IconData {
  height: number;
  path: string;
  tags: string[];
  ratio?: {
    width: number;
    height: number;
  };
}

export type IconName = ${iconNamesType};

export interface IconsCollection {
  [key: string]: IconData;
}

export declare const DataMaLightIcons: IconsCollection;

export interface VueIconProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  class?: string | object | any[];
}

export interface GenericIconProps extends VueIconProps {
  name: IconName;
}

// Vue component exports
export declare const IconGeneric: any;
${iconNames.map(iconName => {
  const componentName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `export declare const Icon${componentName}: any;`;
}).join('\n')}

// Plugin
declare const DatamaIcons: {
  install(Vue: any, options?: any): void;
};

export default DatamaIcons;
`;

  return definitions;
}

/**
 * Create distribution packages
 */
function createDistPackages(iconData) {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  
  // Generate TypeScript definitions
  const tsDefinitions = generateTypeScriptDefinitions(iconData);
  fs.writeFileSync(path.join(distDir, 'index.d.ts'), tsDefinitions);
  
  // Create main index.js for Node.js usage
  const mainIndexJs = `const { DataMaLightIcons } = require('./icons.js');

module.exports = {
  DataMaLightIcons,
  iconData: DataMaLightIcons,
  default: DataMaLightIcons
};
`;
  
  fs.writeFileSync(path.join(distDir, 'index.js'), mainIndexJs);
  
  // Create ESM index
  const esmIndexJs = `export { DataMaLightIcons } from './icons.js';
export const iconData = DataMaLightIcons;
export default DataMaLightIcons;
`;
  
  fs.writeFileSync(path.join(distDir, 'index.esm.js'), esmIndexJs);
  
  // Create vanilla JavaScript API (nouvelle version compatible)
  const iconDataJson = JSON.stringify(iconData, null, 2);
  
  const vanillaJsApi = `/**
 * DataMa Icons - JavaScript API (NEW VERSION)
 * Compatible with both ES modules and classic scripts
 */

// Icon data embedded
const DataMaLightIconsNew = ${iconDataJson};

/**
 * Create SVG element from icon data
 */
function createSVG(iconData, options = {}) {
    const {
        size = 24,
        width = size,
        height = size,
        fill = 'currentColor',
        stroke = 'none',
        strokeWidth = 0,
        className = '',
        invert = false
    } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', iconData.viewBox || '0 0 24 24');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('fill', fill);
    svg.setAttribute('stroke', stroke);
    svg.setAttribute('stroke-width', strokeWidth);
    
    if (className) {
        svg.className = className;
    }
    
    if (iconData.isComplex && iconData.content) {
        // Check if invert mode is requested
        if (options.invert && iconData.invertFillContent) {
            // Use invert fill version
            let content = iconData.invertFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else if (fill !== 'currentColor' && fill !== 'original' && fill !== 'none' && iconData.selectiveFillContent) {
            // Use selective fill version (includes URL replacement) when custom fill is provided
            let content = iconData.selectiveFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else {
            // Use original content with all original colors and gradients
            svg.innerHTML = iconData.content;
        }
    } else if (!iconData.isComplex && iconData.path) {
        // Check if invert mode is requested
        if (options.invert && iconData.invertFillContent) {
            // Use invert fill version
            let content = iconData.invertFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else if (fill !== 'currentColor' && fill !== 'original' && fill !== 'none' && iconData.selectiveFillContent) {
            // Use selective fill version (includes URL replacement) for simple icons when custom fill is provided
            let content = iconData.selectiveFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else {
            // For simple icons, create a path element
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', iconData.path);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        }
    } else {
        // Fallback for malformed icon data
        console.warn(\`Malformed icon data for icon. isComplex: \${iconData.isComplex}, hasContent: \${!!iconData.content}, hasPath: \${!!iconData.path}\`);
        if (iconData.content) {
            svg.innerHTML = iconData.content;
        } else if (iconData.path) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', iconData.path);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        }
    }
    
    return svg;
}

/**
 * Apply selective fill to icons
 * Uses pre-processed selective fill content when available
 */
function applySelectiveFill(svg, fillColor) {
    // This function is now mainly for fallback cases
    // Most of the work is done at build time in the selective fill content
    const elements = svg.querySelectorAll('[fill="currentColor"], [stroke="currentColor"]');
    
    elements.forEach(element => {
        const currentFill = element.getAttribute('fill');
        const currentStroke = element.getAttribute('stroke');
        
        if (currentFill === 'currentColor') {
            element.setAttribute('fill', fillColor);
        }
        
        if (currentStroke === 'currentColor') {
            element.setAttribute('stroke', fillColor);
        }
    });
}

/**
 * Replace all elements with data-datama attributes
 */
function replace(options = {}) {
    const elements = document.querySelectorAll('[data-datama]');
    
    elements.forEach(element => {
        const iconName = element.getAttribute('data-datama');
        const iconData = DataMaLightIconsNew[iconName];
        
        if (!iconData) {
            console.warn(\`Icon not found: \${iconName}\`);
            return;
        }
        
        // Get options from element attributes or global options
        const elementOptions = {
            size: element.getAttribute('data-size') || options.size,
            width: element.getAttribute('data-width') || options.width,
            height: element.getAttribute('data-height') || options.height,
            fill: element.getAttribute('data-fill') || options.fill,
            stroke: element.getAttribute('data-stroke') || options.stroke,
            strokeWidth: element.getAttribute('data-stroke-width') || options.strokeWidth,
            className: element.className,
            forceComplexColor: element.getAttribute('data-force-complex-color') === 'true' || options.forceComplexColor,
            selectiveFill: element.getAttribute('data-selective-fill') !== 'false' && options.selectiveFill !== false,
            invert: element.getAttribute('data-invert') === 'true' || options.invert === true
        };
        
        const svg = createSVG(iconData, elementOptions);
        
        // Replace the element with the SVG
        element.parentNode.replaceChild(svg, element);
    });
}

/**
 * Generate SVG string for an icon
 */
function toSvg(iconName, options = {}) {
    const iconData = DataMaLightIconsNew[iconName];
    
    if (!iconData) {
        console.warn(\`Icon not found: \${iconName}\`);
        return '';
    }
    
    const svg = createSVG(iconData, options);
    return svg.outerHTML;
}

/**
 * Get icon data
 */
function getIcon(iconName) {
    return DataMaLightIconsNew[iconName];
}

/**
 * Get all available icon names
 */
function getIconNames() {
    return Object.keys(DataMaLightIconsNew);
}

// Main API object
const DataMaIconsNew = {
    get: function(iconName, props = {}) {
        const iconData = DataMaLightIconsNew[iconName];
        if (!iconData) {
            console.warn('Icon not found:', iconName);
            return null;
        }
        return createSVG(iconData, props);
    },
    replace: replace,
    toSvg: toSvg,
    getIcon: getIcon,
    getIconNames: getIconNames,
    getAvailableIcons: function() {
        return Object.keys(DataMaLightIconsNew);
    },
    getIconData: function(iconName) {
        return DataMaLightIconsNew[iconName];
    },
    searchByTag: function(tag) {
        return Object.keys(DataMaLightIconsNew).filter(iconName => 
            DataMaLightIconsNew[iconName].tags && 
            DataMaLightIconsNew[iconName].tags.includes(tag)
        );
    }
};

// Create global API (browser only)
if (typeof window !== 'undefined') {
    window.DataMaIconsNew = DataMaIconsNew;

    // Auto-replace on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            replace();
        });
    } else {
        // DOM already loaded
        replace();
    }
}

console.log('DataMa Icons vanilla JS API loaded (NEW VERSION)');
console.log(\`Available icons: \${Object.keys(DataMaLightIconsNew).length}\`);

// Export compatible ES Modules et script classique
if (typeof module !== 'undefined' && module.exports) {
    // Node.js / CommonJS
    module.exports = DataMaIconsNew;
    module.exports.DataMaLightIconsNew = DataMaLightIconsNew;
    module.exports.replace = replace;
    module.exports.toSvg = toSvg;
    module.exports.getIcon = getIcon;
    module.exports.getIconNames = getIconNames;
    module.exports.default = DataMaIconsNew;
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() { return DataMaIconsNew; });
}`;
  
  fs.writeFileSync(path.join(distDir, 'DataMaIconsNew.js'), vanillaJsApi);
  
  // Create ES6 module version
  const es6Module = `/**
 * DataMa Icons - ES6 Module (NEW VERSION)
 * For use with import/export syntax
 */

// Icon data embedded
const DataMaLightIconsNew = ${iconDataJson};

/**
 * Create SVG element from icon data
 */
function createSVG(iconData, options = {}) {
    const {
        size = 24,
        width = size,
        height = size,
        fill = 'currentColor',
        stroke = 'none',
        strokeWidth = 0,
        className = '',
        invert = false
    } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', iconData.viewBox || '0 0 24 24');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('fill', fill);
    svg.setAttribute('stroke', stroke);
    svg.setAttribute('stroke-width', strokeWidth);
    
    if (className) {
        svg.className = className;
    }
    
    if (iconData.isComplex && iconData.content) {
        // Check if invert mode is requested
        if (options.invert && iconData.invertFillContent) {
            let content = iconData.invertFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else if (fill !== 'currentColor' && fill !== 'original' && fill !== 'none' && iconData.selectiveFillContent) {
            let content = iconData.selectiveFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else {
            svg.innerHTML = iconData.content;
        }
    } else if (!iconData.isComplex && iconData.path) {
        if (options.invert && iconData.invertFillContent) {
            let content = iconData.invertFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else if (fill !== 'currentColor' && fill !== 'original' && fill !== 'none' && iconData.selectiveFillContent) {
            let content = iconData.selectiveFillContent;
            if (fill !== 'currentColor') {
                content = content.replace(/fill="currentColor"/g, 'fill="' + fill + '"');
                content = content.replace(/stroke="currentColor"/g, 'stroke="' + fill + '"');
            }
            svg.innerHTML = content;
        } else {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', iconData.path);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        }
    } else {
        console.warn(\`Malformed icon data for icon. isComplex: \${iconData.isComplex}, hasContent: \${!!iconData.content}, hasPath: \${!!iconData.path}\`);
        if (iconData.content) {
            svg.innerHTML = iconData.content;
        } else if (iconData.path) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', iconData.path);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        }
    }
    
    return svg;
}

/**
 * Replace all elements with data-datama attributes
 */
function replace(options = {}) {
    const elements = document.querySelectorAll('[data-datama]');
    
    elements.forEach(element => {
        const iconName = element.getAttribute('data-datama');
        const iconData = DataMaLightIconsNew[iconName];
        
        if (!iconData) {
            console.warn(\`Icon not found: \${iconName}\`);
            return;
        }
        
        const elementOptions = {
            size: element.getAttribute('data-size') || options.size,
            width: element.getAttribute('data-width') || options.width,
            height: element.getAttribute('data-height') || options.height,
            fill: element.getAttribute('data-fill') || options.fill,
            stroke: element.getAttribute('data-stroke') || options.stroke,
            strokeWidth: element.getAttribute('data-stroke-width') || options.strokeWidth,
            className: element.className,
            forceComplexColor: element.getAttribute('data-force-complex-color') === 'true' || options.forceComplexColor,
            selectiveFill: element.getAttribute('data-selective-fill') !== 'false' && options.selectiveFill !== false,
            invert: element.getAttribute('data-invert') === 'true' || options.invert === true
        };
        
        const svg = createSVG(iconData, elementOptions);
        element.parentNode.replaceChild(svg, element);
    });
}

/**
 * Generate SVG string for an icon
 */
function toSvg(iconName, options = {}) {
    const iconData = DataMaLightIconsNew[iconName];
    
    if (!iconData) {
        console.warn(\`Icon not found: \${iconName}\`);
        return '';
    }
    
    const svg = createSVG(iconData, options);
    return svg.outerHTML;
}

/**
 * Get icon data
 */
function getIcon(iconName) {
    return DataMaLightIconsNew[iconName];
}

/**
 * Get all available icon names
 */
function getIconNames() {
    return Object.keys(DataMaLightIconsNew);
}

// Main API object
const DataMaIconsNew = {
    get: function(iconName, props = {}) {
        const iconData = DataMaLightIconsNew[iconName];
        if (!iconData) {
            console.warn('Icon not found:', iconName);
            return null;
        }
        return createSVG(iconData, props);
    },
    replace: replace,
    toSvg: toSvg,
    getIcon: getIcon,
    getIconNames: getIconNames,
    getAvailableIcons: function() {
        return Object.keys(DataMaLightIconsNew);
    },
    getIconData: function(iconName) {
        return DataMaLightIconsNew[iconName];
    },
    searchByTag: function(tag) {
        return Object.keys(DataMaLightIconsNew).filter(iconName => 
            DataMaLightIconsNew[iconName].tags && 
            DataMaLightIconsNew[iconName].tags.includes(tag)
        );
    }
};

// ES6 Modules exports
export { DataMaIconsNew };
export { DataMaLightIconsNew };
export { replace };
export { toSvg };
export { getIcon };
export { getIconNames };
export default DataMaIconsNew;
`;
  
  fs.writeFileSync(path.join(distDir, 'DataMaIconsNew.esm.js'), es6Module);
  
  console.log('✅ Generated main distribution files');
}

/**
 * Generate README files
 */
function generateReadme(iconData) {
  const rootDir = process.cwd();
  const iconCount = Object.keys(iconData).length;
  const iconNames = Object.keys(iconData).sort();
  
  const readmeContent = `# @datama/icons

DataMa icon library with ${iconCount} icons, available as Vue 2 components and JSON data.

## Installation

\`\`\`bash
npm install @datama/icons
\`\`\`

## Usage

### As JSON data (for vanilla JS projects)

\`\`\`javascript
import { DataMaLightIcons } from '@datama/icons';
// or
const { DataMaLightIcons } = require('@datama/icons');

// Use icon data
const checkIcon = DataMaLightIcons.check;
console.log(checkIcon.path); // SVG path data
\`\`\`

### As Vue 2 components

\`\`\`javascript
import Vue from 'vue';
import DatamaIcons from '@datama/icons/vue';

Vue.use(DatamaIcons);
\`\`\`

\`\`\`vue
<template>
  <div>
    <!-- Using specific icon component -->
    <IconCheck :size="24" fill="blue" />
    
    <!-- Using generic icon component -->
    <IconGeneric name="check" :size="24" fill="blue" />
  </div>
</template>
\`\`\`

### Available props for Vue components

- \`size\`: Number or string (default: 24)
- \`width\`: Number or string (overrides size)
- \`height\`: Number or string (overrides size)  
- \`fill\`: String (default: 'currentColor')
- \`stroke\`: String (default: 'none')
- \`strokeWidth\`: Number or string (default: 0)
- \`class\`: String, object, or array for additional CSS classes

## Available Icons (${iconCount})

| Nom de l'icône | Aperçu |
|:-------------- |:------:|
${iconNames.map(name => {
  // Remove -svg suffix if present and construct proper path
  const cleanName = name.replace(/-svg$/, '');
  
  // Get the category from icon data to build correct path
  const iconInfo = iconData[name];
  const category = iconInfo?.category || '';
  
  // Construct the proper path based on category
  let iconPath;
  if (category) {
    iconPath = `icons/${category}/${cleanName}.svg`;
  } else {
    iconPath = `icons/${cleanName}.svg`;
  }
  
  return `| \`${name}\` | <img src="${iconPath}" width="32" height="32" alt="${cleanName}" /> |`;
}).join('\n')}

## Icon Data Format

Each icon contains:

\`\`\`typescript
interface IconData {
  height: number;        // SVG height (usually 1024)
  path: string;         // SVG path data
  tags: string[];       // Search tags
  ratio?: {             // Aspect ratio (optional)
    width: number;
    height: number;
  };
}
\`\`\`

## Development

This package is auto-generated from SVG files. To contribute:

1. Add your SVG files to the root directory
2. Run \`npm run build:all\` to regenerate the package
3. The CI/CD pipeline will automatically create a new release

## License

Copyright (c) ${new Date().getFullYear()} DATAMA SAS, All rights reserved.
`;

  fs.writeFileSync(path.join(rootDir, 'README.md'), readmeContent);
  
  // Generate Vue-specific README
  const vueReadmeContent = `# @datama/icons Vue Components

Vue 2 components for DataMa icons.

## Installation

\`\`\`bash
npm install @datama/icons
\`\`\`

## Usage

\`\`\`javascript
import Vue from 'vue';
import DatamaIcons from '@datama/icons/vue';

Vue.use(DatamaIcons);
\`\`\`

This package contains ${iconCount} icon components ready to use in your Vue 2 application.

See main package README for full documentation.
`;

  const vueDir = path.join(rootDir, 'dist', 'vue');
  fs.writeFileSync(path.join(vueDir, 'README.md'), vueReadmeContent);
  
  console.log('✅ Generated README files');
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting DataMa Icons build process...\n');
  
  try {
    // Step 1: Process SVG files
    console.log('📝 Step 1: Processing SVG files...');
    const svgData = buildSvgData();
    
    if (!svgData || Object.keys(svgData).length === 0) {
      console.error('❌ No SVG data generated. Build failed.');
      process.exit(1);
    }
    
    // Step 2: Generate JSON files
    console.log('\n📦 Step 2: Generating JSON files...');
    const iconData = buildJson();
    
    // Step 3: Generate Vue components
    console.log('\n🏗️ Step 3: Generating Vue components...');
    buildVue();
    
    // Step 4: Create distribution packages
    console.log('\n📚 Step 4: Creating distribution packages...');
    createDistPackages(iconData);
    
    // Step 5: Generate documentation
    console.log('\n📖 Step 5: Generating documentation...');
    generateReadme(iconData);
    
    console.log('\n✅ Build completed successfully!');
    console.log(`📊 Generated ${Object.keys(iconData).length} icons`);
    console.log('📁 Output files:');
    console.log('   - icons.js (ES module export)');
    console.log('   - icons.json (JSON data)');
    console.log('   - dist/vue/ (Vue 2 components)');
    console.log('   - dist/index.js (CommonJS)');
    console.log('   - dist/index.esm.js (ES modules)');
    console.log('   - dist/index.d.ts (TypeScript definitions)');
    console.log('   - dist/DataMaIconsNew.js (Vanilla JavaScript API NEW VERSION)');
    console.log('   - dist/DataMaIconsNew.esm.js (ES6 Module API NEW VERSION)');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  build();
}

module.exports = { build, generateTypeScriptDefinitions }; 