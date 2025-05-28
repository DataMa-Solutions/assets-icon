const fs = require('fs');
const path = require('path');

/**
 * Generate the main DataMa Icons library similar to Feather Icons
 * @param {object} iconData - All icon data
 * @returns {string} - JavaScript library code
 */
function generateDataMaLibrary(iconData) {
  const iconNames = Object.keys(iconData).sort();
  
  // Create icon objects with toSvg methods
  const iconObjects = iconNames.map(iconName => {
    const icon = iconData[iconName];
    return `  '${iconName}': {
    name: '${iconName}',
    contents: '${icon.isComplex ? icon.content : icon.path}',
    tags: ${JSON.stringify(icon.tags)},
    attrs: {
      height: ${icon.height},
      width: ${icon.width || icon.height},
      viewBox: '${icon.viewBox || `0 0 ${icon.width || icon.height} ${icon.height}`}',
      isComplex: ${icon.isComplex || false},
      category: '${icon.category || ''}',
      ratio: ${JSON.stringify(icon.ratio || { width: 1, height: 1 })}
    },
    toSvg: function(attrs = {}) {
      return datama.toSvg('${iconName}', attrs);
    }
  }`;
  }).join(',\n');

  return `/**
 * DataMa Icons - Vue 2 compatible library
 * Similar to Feather Icons but for DataMa
 * 
 * Usage:
 * // HTML with data attribute
 * <i data-datama="check"></i>
 * 
 * // Vue plugin
 * Vue.use(DataMaIcons);
 * 
 * // Manual replacement
 * datama.replace();
 * 
 * // Direct SVG generation
 * datama.icons['check'].toSvg({ size: 24 });
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.datama = {}));
}(this, (function (exports) { 'use strict';

  // Default attributes for SVG elements
  const defaultAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  };

  // Icon data will be injected here
  const iconData = ICON_DATA_PLACEHOLDER;

  // Create icon objects
  const icons = {
${iconObjects}
  };

  /**
   * Create an SVG string
   * @param {string} name - Icon name
   * @param {object} attrs - Additional attributes
   * @returns {string} - SVG string
   */
  function toSvg(name, attrs = {}) {
    const icon = iconData[name];
    if (!icon) {
      throw new Error('Icon "' + name + '" not found');
    }

    const ratio = icon.ratio || { width: 1, height: 1 };
    const baseHeight = icon.height || 24;
    const baseWidth = icon.width || baseHeight;
    
    // Calculate final dimensions
    let finalWidth, finalHeight;
    
    if (attrs.width && attrs.height) {
      finalWidth = attrs.width;
      finalHeight = attrs.height;
    } else if (attrs.width) {
      finalWidth = attrs.width;
      finalHeight = Math.round(attrs.width / ratio.width);
    } else if (attrs.height) {
      finalHeight = attrs.height;
      finalWidth = Math.round(attrs.height * ratio.width);
    } else if (attrs.size) {
      finalWidth = Math.round(attrs.size * ratio.width);
      finalHeight = attrs.size;
    } else {
      finalWidth = Math.round(24 * ratio.width);
      finalHeight = 24;
    }
    
    // Calculate proper viewBox
    const vbWidth = baseWidth;
    const vbHeight = baseHeight;
    const viewBox = icon.viewBox || '0 0 ' + vbWidth + ' ' + vbHeight;
    
    // Merge attributes
    const mergedAttrs = {
      ...defaultAttrs,
      width: finalWidth,
      height: finalHeight,
      viewBox: viewBox,
      class: 'datama datama-' + name + (icon.category ? ' datama-category-' + icon.category : ''),
      ...attrs
    };

    // Remove size attribute if it exists (it's not a valid SVG attribute)
    delete mergedAttrs.size;

    // Build attributes string
    const attrsString = Object.keys(mergedAttrs)
      .map(key => key + '="' + mergedAttrs[key] + '"')
      .join(' ');

    // Generate SVG content
    let svgContent;
    if (icon.isComplex) {
      // For complex SVGs, use the full content
      svgContent = icon.content;
    } else {
      // For simple SVGs, use path
      svgContent = '<path d="' + icon.path + '" />';
    }

    return '<svg ' + attrsString + '>' + svgContent + '</svg>';
  }

  /**
   * Replace all elements with data-datama attribute
   * @param {object} attrs - Additional attributes for all icons
   */
  function replace(attrs = {}) {
    if (typeof document === 'undefined') {
      throw new Error('datama.replace() only works in a browser environment');
    }

    const elementsToReplace = document.querySelectorAll('[data-datama]');
    
    Array.from(elementsToReplace).forEach(element => {
      const iconName = element.getAttribute('data-datama');
      
      if (!iconData[iconName]) {
        console.warn('DataMa icon "' + iconName + '" not found');
        return;
      }

      // Get existing attributes from the element
      const existingAttrs = {};
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'data-datama') {
          existingAttrs[attr.name] = attr.value;
        }
      });

      // Generate SVG
      const svgString = toSvg(iconName, { ...attrs, ...existingAttrs });
      
      // Replace element
      element.outerHTML = svgString;
    });
  }

  // Vue 2 plugin
  const VuePlugin = {
    install(Vue, options = {}) {
      // Add global property for icon data
      Vue.prototype.$datama = {
        icons: iconData,
        toSvg: toSvg,
        replace: replace
      };

      // Add global directive v-datama
      Vue.directive('datama', {
        bind(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName && iconData[iconName]) {
            const attrs = binding.modifiers || {};
            el.innerHTML = toSvg(iconName, attrs);
          }
        },
        update(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName && iconData[iconName]) {
            const attrs = binding.modifiers || {};
            el.innerHTML = toSvg(iconName, attrs);
          }
        }
      });

      // Auto-replace on mount if enabled
      if (options.autoReplace !== false) {
        Vue.mixin({
          mounted() {
            this.$nextTick(() => {
              if (this.$el && this.$el.querySelectorAll) {
                const elements = this.$el.querySelectorAll('[data-datama]');
                if (elements.length > 0) {
                  replace();
                }
              }
            });
          }
        });
      }
    }
  };

  // Export everything
  exports.icons = icons;
  exports.toSvg = toSvg;
  exports.replace = replace;
  exports.VuePlugin = VuePlugin;
  exports.default = VuePlugin;

  // Auto-install for Vue if available
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePlugin);
    console.log('DataMa Icons Vue plugin auto-installed');
  }
  
  // Also expose on window for direct access
  if (typeof window !== 'undefined') {
    window.datama = exports;
  }

})));
`;
}

/**
 * Build Vue library
 */
function buildVue() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const vueDir = path.join(distDir, 'vue');
  
  // Ensure directories exist
  if (!fs.existsSync(vueDir)) {
    fs.mkdirSync(vueDir, { recursive: true });
  }

  // Load SVG data
  const svgDataPath = path.join(distDir, 'svg-data.json');
  if (!fs.existsSync(svgDataPath)) {
    console.log('⚠️  No SVG data found. Run build:svg first.');
    return;
  }

  const iconData = JSON.parse(fs.readFileSync(svgDataPath, 'utf8'));
  const iconNames = Object.keys(iconData);
  const complexIcons = iconNames.filter(name => iconData[name].isComplex);
  const simpleIcons = iconNames.filter(name => !iconData[name].isComplex);

  console.log(`🏗️  Building Vue library for ${iconNames.length} icons...`);
  console.log(`📊 Complex SVGs: ${complexIcons.length}, Simple SVGs: ${simpleIcons.length}`);

  // Load categories if available
  const categoriesPath = path.join(distDir, 'categories.json');
  let categories = {};
  if (fs.existsSync(categoriesPath)) {
    categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    console.log(`📁 Categories: ${Object.keys(categories).join(', ')}`);
  }

  // Generate main library file
  let libraryCode = generateDataMaLibrary(iconData);
  
  // Replace the placeholder with actual data
  const iconDataString = JSON.stringify(iconData, null, 2);
  libraryCode = libraryCode.replace('ICON_DATA_PLACEHOLDER', iconDataString);
  
  const libraryPath = path.join(vueDir, 'index.js');
  fs.writeFileSync(libraryPath, libraryCode);

  // Generate package.json for Vue package
  const vuePackageJson = {
    name: '@datama/icons-vue',
    version: require('../package.json').version,
    description: 'DataMa icons as Vue 2 library with Feather-like API',
    main: 'index.js',
    peerDependencies: {
      vue: '^2.6.0 || ^2.7.0'
    },
    keywords: ['vue', 'icons', 'datama', 'svg', 'feather']
  };

  const vuePackagePath = path.join(vueDir, 'package.json');
  fs.writeFileSync(vuePackagePath, JSON.stringify(vuePackageJson, null, 2));

  // Generate TypeScript definitions
  const iconNamesList = iconNames.map(name => `'${name}'`).join(' | ');
  const categoryTypes = Object.keys(categories).map(cat => `'${cat}'`).join(' | ');
  
  const tsDefinitions = `// TypeScript definitions for @datama/icons-vue

declare module '@datama/icons-vue' {
  export interface IconAttributes {
    [key: string]: string | number;
    size?: number | string;
    width?: number | string;
    height?: number | string;
    class?: string;
    stroke?: string;
    fill?: string;
  }

  export interface DataMaIcon {
    name: string;
    contents: string;
    tags: string[];
    attrs: {
      height: number;
      width: number;
      viewBox: string;
      isComplex: boolean;
      category: string;
      ratio: { width: number; height: number };
    };
    toSvg(attrs?: IconAttributes): string;
  }

  export interface DataMaIcons {
    [${iconNamesList}]: DataMaIcon;
  }

  export type IconName = ${iconNamesList};
  export type IconCategory = ${categoryTypes || 'string'};

  export const icons: DataMaIcons;
  export function toSvg(name: IconName, attrs?: IconAttributes): string;
  export function replace(attrs?: IconAttributes): void;
  
  export interface VuePluginOptions {
    autoReplace?: boolean;
  }

  export const VuePlugin: {
    install(Vue: any, options?: VuePluginOptions): void;
  };

  export default VuePlugin;
}

// Vue augmentation
declare module 'vue/types/vue' {
  interface Vue {
    $datama: {
      icons: { [key: string]: any };
      toSvg(name: string, attrs?: any): string;
      replace(attrs?: any): void;
    };
  }
}
`;

  const tsPath = path.join(vueDir, 'index.d.ts');
  fs.writeFileSync(tsPath, tsDefinitions);

  // Generate simple version that loads data dynamically
  const simpleLibraryCode = `/**
 * DataMa Icons - Vue 2 compatible library (Simple version)
 * Loads icon data dynamically to avoid large bundle size
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.datama = {}));
}(this, (function (exports) { 'use strict';

  // Default attributes for SVG elements
  const defaultAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24'
    // Note: pas de fill, stroke par défaut - laissons les icônes avec leurs propres styles
  };

  // Icon data (loaded dynamically)
  let iconData = {};
  let iconDataLoaded = false;

  // Load icon data from JSON
  async function loadIconData() {
    if (iconDataLoaded) return iconData;
    
    try {
      const response = await fetch('dist/icons.json');
      iconData = await response.json();
      iconDataLoaded = true;
      console.log('DataMa Icons: Loaded', Object.keys(iconData).length, 'icons');
      return iconData;
    } catch (error) {
      console.error('DataMa Icons: Failed to load icon data', error);
      return {};
    }
  }

  // Create icon objects (populated after loading)
  const icons = {};

  /**
   * Create an SVG string
   * @param {string} name - Icon name
   * @param {object} attrs - Additional attributes
   * @returns {string} - SVG string
   */
  function toSvg(name, attrs = {}) {
    const icon = iconData[name];
    if (!icon) {
      console.warn('DataMa icon "' + name + '" not found');
      return '<svg></svg>';
    }

    const ratio = icon.ratio || { width: 1, height: 1 };
    const baseHeight = icon.height || 24;
    const baseWidth = icon.width || baseHeight;
    
    // Calculate final dimensions
    let finalWidth, finalHeight;
    
    if (attrs.width && attrs.height) {
      finalWidth = attrs.width;
      finalHeight = attrs.height;
    } else if (attrs.width) {
      finalWidth = attrs.width;
      finalHeight = Math.round(attrs.width / ratio.width);
    } else if (attrs.height) {
      finalHeight = attrs.height;
      finalWidth = Math.round(attrs.height * ratio.width);
    } else if (attrs.size) {
      finalWidth = Math.round(attrs.size * ratio.width);
      finalHeight = attrs.size;
    } else {
      finalWidth = Math.round(24 * ratio.width);
      finalHeight = 24;
    }
    
    // Calculate proper viewBox
    const vbWidth = baseWidth;
    const vbHeight = baseHeight;
    const viewBox = icon.viewBox || '0 0 ' + vbWidth + ' ' + vbHeight;
    
    // Merge attributes
    const mergedAttrs = {
      ...defaultAttrs,
      width: finalWidth,
      height: finalHeight,
      viewBox: viewBox,
      class: 'datama datama-' + name + (icon.category ? ' datama-category-' + icon.category : ''),
      ...attrs
    };

    // Remove size attribute if it exists (it's not a valid SVG attribute)
    delete mergedAttrs.size;

    // Build attributes string
    const attrsString = Object.keys(mergedAttrs)
      .map(key => key + '="' + mergedAttrs[key] + '"')
      .join(' ');

    // Generate SVG content
    let svgContent;
    if (icon.isComplex) {
      // For complex SVGs, use the full content
      svgContent = icon.content;
    } else {
      // For simple SVGs, use path
      svgContent = '<path d="' + icon.path + '" />';
    }

    return '<svg ' + attrsString + '>' + svgContent + '</svg>';
  }

  /**
   * Replace all elements with data-datama attribute
   * @param {object} attrs - Additional attributes for all icons
   */
  function replace(attrs = {}) {
    if (typeof document === 'undefined') {
      console.warn('datama.replace() only works in a browser environment');
      return;
    }

    if (!iconDataLoaded) {
      console.warn('DataMa Icons: Icon data not loaded yet. Call loadIconData() first.');
      return;
    }

    const elementsToReplace = document.querySelectorAll('[data-datama]');
    
    Array.from(elementsToReplace).forEach(element => {
      const iconName = element.getAttribute('data-datama');
      
      if (!iconData[iconName]) {
        console.warn('DataMa icon "' + iconName + '" not found');
        return;
      }

      // Get existing attributes from the element
      const existingAttrs = {};
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'data-datama') {
          existingAttrs[attr.name] = attr.value;
        }
      });

      // Generate SVG
      const svgString = toSvg(iconName, { ...attrs, ...existingAttrs });
      
      // Replace element content but keep the data-datama attribute for future replacements
      element.innerHTML = svgString;
      element.style.display = 'inline-block';
      element.style.lineHeight = '0';
    });
  }

  // Vue 2 plugin
  const VuePlugin = {
    install(Vue, options = {}) {
      // Add global property for icon data
      Vue.prototype.$datama = {
        icons: icons,
        toSvg: toSvg,
        replace: replace,
        loadIconData: loadIconData
      };

      // Add global directive v-datama
      Vue.directive('datama', {
        bind(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName && iconData[iconName]) {
            const attrs = binding.modifiers || {};
            el.innerHTML = toSvg(iconName, attrs);
          } else if (iconName) {
            el.setAttribute('data-datama', iconName);
          }
        },
        update(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName && iconData[iconName]) {
            const attrs = binding.modifiers || {};
            el.innerHTML = toSvg(iconName, attrs);
          }
        }
      });

      // Auto-load data and replace on mount if enabled
      if (options.autoReplace !== false) {
        Vue.mixin({
          async mounted() {
            if (!iconDataLoaded) {
              await loadIconData();
            }
            
            this.$nextTick(() => {
              if (this.$el && this.$el.querySelectorAll) {
                const elements = this.$el.querySelectorAll('[data-datama]');
                if (elements.length > 0) {
                  replace();
                }
              }
            });
          }
        });
      }
    }
  };

  // Export everything
  exports.icons = icons;
  exports.toSvg = toSvg;
  exports.replace = replace;
  exports.loadIconData = loadIconData;
  exports.iconDataLoaded = () => iconDataLoaded;
  exports.getIconData = () => iconData;
  exports.VuePlugin = VuePlugin;
  exports.default = VuePlugin;

  // Auto-install for Vue if available
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePlugin);
    console.log('DataMa Icons Vue plugin auto-installed');
  }
  
  // Also expose on window for direct access
  if (typeof window !== 'undefined') {
    window.datama = exports;
  }

})));`;

  const simpleLibraryPath = path.join(vueDir, 'index-simple.js');
  fs.writeFileSync(simpleLibraryPath, simpleLibraryCode);

  console.log(`✅ Generated Vue library (${(fs.statSync(libraryPath).size / 1024).toFixed(2)} KB)`);
  console.log(`✅ Generated simple Vue library (${(fs.statSync(simpleLibraryPath).size / 1024).toFixed(2)} KB)`);
  console.log(`✅ Generated package.json`);
  console.log(`✅ Generated TypeScript definitions`);
  console.log(`📁 Vue package ready at: ${vueDir}`);

  if (complexIcons.length > 0) {
    console.log(`\n🎨 Complex icons handled: ${complexIcons.join(', ')}`);
  }

  return iconData;
}

module.exports = { buildVue };