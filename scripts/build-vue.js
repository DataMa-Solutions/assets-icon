/*
 * DATAMA SAS
 * --------------
 * NOTICE:  All information contained herein is, and remains
 * the property of DataMa SAS and/or some open source packages used
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to DataMa SAS
 * and its suppliers and may be covered by French and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from DataMa SAS.
 * Notice created by Django <django@datama.fr>, Wazhabits <anatole@datama.fr> updated by Anatole Piveteau
 * Copyright (c) 2025 DATAMA SAS, All rights reserved.
 * Generated for file : build-vue.js project project-deep-sky
 */

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
 * Vue.use(DataMaPicto);
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

    // Generate SVG content based on fill options
    let svgContent;
    if (icon.isComplex) {
      // For complex SVGs, check if selective fill is enabled
      if (attrs.fill && attrs.fill !== 'original' && attrs.fill !== 'none' && attrs.fill !== 'currentColor' && icon.selectiveFillContent) {
        // Use selective fill version (includes URL replacement) when custom fill is provided
        svgContent = icon.selectiveFillContent;
        // Replace currentColor with actual fill color
        svgContent = svgContent.replace(/fill="currentColor"/g, 'fill="' + attrs.fill + '"');
        svgContent = svgContent.replace(/stroke="currentColor"/g, 'stroke="' + attrs.fill + '"');
      } else {
        // Use original content with all original colors and gradients
        svgContent = icon.content;
      }
    } else {
      // For simple SVGs
      if (attrs.fill && attrs.fill !== 'original' && attrs.fill !== 'none' && attrs.fill !== 'currentColor' && icon.selectiveFillContent) {
        // Use selective fill version (includes URL replacement) when custom fill is provided
        svgContent = icon.selectiveFillContent;
        // Replace currentColor with actual fill color
        svgContent = svgContent.replace(/fill="currentColor"/g, 'fill="' + attrs.fill + '"');
        svgContent = svgContent.replace(/stroke="currentColor"/g, 'stroke="' + attrs.fill + '"');
      } else if (attrs.fill && attrs.fill !== 'original' && attrs.fill !== 'none' && attrs.fill !== 'currentColor') {
        // Simple path with fill
        svgContent = '<path d="' + icon.path + '" fill="' + attrs.fill + '" />';
      } else {
        // Original simple path without fill
        svgContent = '<path d="' + icon.path + '" />';
      }
    }

    let svgString = '<svg ' + attrsString + '>' + svgContent + '</svg>';

    return svgString;
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
 * Generate CDN-style library for Vue.js (like Font Awesome)
 */
function generateCdnVueLibrary(iconData) {
  const iconNames = Object.keys(iconData).sort();
  
  return `/**
 * DataMa Icons - CDN Vue.js Library (Font Awesome style)
 * Usage: Include this script and use <i class="datama-icon" data-icon="icon-name-svg"></i> or <i class="datama datama-icon-name"></i>
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.DataMaPicto = {}));
}(this, function(exports) {
  'use strict';

  // Icon data
  const iconData = ${JSON.stringify(iconData, null, 2)};

  /**
   * Convert class-based or data-icon to SVG
   */
  function convertClassIconToSvg(element) {
    const classList = Array.from(element.classList);
    let iconName;
    
    // Check for data-icon attribute first (new format)
    if (element.hasAttribute('data-icon')) {
      iconName = element.getAttribute('data-icon');
      // Ensure it ends with -svg
      if (!iconName.endsWith('-svg')) {
        iconName += '-svg';
      }
    } else {
      // Fallback to class-based format (legacy)
      const iconClass = classList.find(cls => cls.startsWith('datama-') && cls !== 'datama');
      if (!iconClass) return;
      iconName = iconClass.replace('datama-', '') + '-svg';
    }
    
    const icon = iconData[iconName];
    
    if (!icon) {
      console.warn('DataMa Icons: Icon not found:', iconName);
      return;
    }
    
    // Get size from class or data attributes
    let size = 16; // default size
    if (element.hasAttribute('data-size')) {
      size = parseInt(element.getAttribute('data-size')) || size;
    } else {
      const sizeClass = classList.find(cls => cls.match(/^size-\\d+$/));
      if (sizeClass) {
        size = parseInt(sizeClass.replace('size-', ''));
      }
    }
    
    // Get fill color from data-fill attribute
    const fillColor = element.getAttribute('data-fill') || 'currentColor';
    
    // Smart fill: if a custom fill is provided, use selective fill automatically
    const useSmartFill = fillColor !== 'currentColor' && fillColor !== 'original';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const ratio = icon.ratio || { width: 1, height: 1 };
    const width = Math.round(size * ratio.width);
    const height = size;
    
    svg.setAttribute('viewBox', icon.viewBox || '0 0 24 24');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('fill', fillColor);
    svg.setAttribute('class', 'datama-svg ' + classList.filter(cls => !cls.startsWith('datama-') || cls === 'datama').join(' '));
    
    // Smart fill logic: automatically use selective fill when custom color is provided
    if (icon.isComplex && icon.content) {
      // For complex icons with custom fill, use selective fill content (includes URL replacement) if available
      if (useSmartFill && icon.selectiveFillContent) {
        let content = icon.selectiveFillContent;
        // Replace currentColor with the actual fill color
        content = content.replace(/fill="currentColor"/g, 'fill="' + fillColor + '"');
        content = content.replace(/stroke="currentColor"/g, 'stroke="' + fillColor + '"');
        svg.innerHTML = content;
      } else {
        // Use original content (preserve original colors or use currentColor)
        svg.innerHTML = icon.content;
      }
    } else if (icon.path) {
      if (icon.path.trim().startsWith('<')) {
        // For simple icons with custom fill, use selective fill content (includes URL replacement) if available
        if (useSmartFill && icon.selectiveFillContent) {
          let content = icon.selectiveFillContent;
          content = content.replace(/fill="currentColor"/g, 'fill="' + fillColor + '"');
          content = content.replace(/stroke="currentColor"/g, 'stroke="' + fillColor + '"');
          svg.innerHTML = content;
        } else {
          svg.innerHTML = icon.path;
        }
      } else {
        // Simple path: always apply the fill color
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.path);
        path.setAttribute('fill', fillColor);
        svg.appendChild(path);
      }
    }
    
    // Replace the <i> element with the SVG
    if (element.parentNode) {
      element.parentNode.replaceChild(svg, element);
    }
  }

  /**
   * Process all datama icons on the page
   */
  function processDataMaPicto() {
    const elements = document.querySelectorAll('i.datama, i.datama-icon[data-icon]');
    elements.forEach(convertClassIconToSvg);
  }

  /**
   * Auto-process icons when DOM is ready
   */
  function autoProcess() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', processDataMaPicto);
    } else {
      processDataMaPicto();
    }
    
    // Watch for dynamically added icons
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              // Check if the added node is a datama icon
              if (node.matches && node.matches('i.datama, i.datama-icon[data-icon]')) {
                convertClassIconToSvg(node);
              }
              // Check for datama icons in the added subtree
              const icons = node.querySelectorAll && node.querySelectorAll('i.datama, i.datama-icon[data-icon]');
              if (icons) {
                icons.forEach(convertClassIconToSvg);
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Vue.js Plugin
   */
  const VuePlugin = {
    install(Vue, options = {}) {
      // Add global method
      Vue.prototype.$DataMaPicto = {
        process: processDataMaPicto,
        iconData: iconData
      };
      
      // Add global directive v-datama-icon
      Vue.directive('datama-icon', {
        bind(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName) {
            // Add classes to element to trigger icon processing
            el.classList.add('datama', 'datama-' + iconName.replace('-svg', ''));
            convertClassIconToSvg(el);
          }
        },
        update(el, binding) {
          const iconName = binding.value || binding.arg;
          if (iconName) {
            // Re-process icon if value changed
            el.classList.add('datama', 'datama-' + iconName.replace('-svg', ''));
            convertClassIconToSvg(el);
          }
        }
      });
      
      // Auto-process on component mount if enabled
      if (options.autoProcess !== false) {
        Vue.mixin({
          mounted() {
            this.$nextTick(() => {
              if (this.$el && this.$el.querySelectorAll) {
                const icons = this.$el.querySelectorAll('i.datama, i.datama-icon[data-icon]');
                icons.forEach(convertClassIconToSvg);
              }
            });
          }
        });
      }
    }
  };

  // Export everything
  exports.processDataMaPicto = processDataMaPicto;
  exports.iconData = iconData;
  exports.VuePlugin = VuePlugin;
  exports.default = VuePlugin;

  // Auto-install for Vue if available
  if (typeof window !== 'undefined') {
    if (window.Vue) {
      window.Vue.use(VuePlugin);
    }
    
    // Make available globally
    window.DataMaPicto = exports;
    
    // Auto-process icons
    autoProcess();
  }

  console.log('DataMa Icons CDN library loaded');
  console.log('Usage: <i class="datama-icon" data-icon="home-svg"></i> or <i class="datama datama-home"></i>');
  console.log('Available icons:', ${iconNames.length});
}));
`;
}

/**
 * Ensure currentColor is preserved in Vue components
 */
function createVueComponent(iconName, iconData) {
  // Format the SVG template
  const template = iconData.selectiveFillContent || iconData.content || `<path d="${iconData.path}"/>`;
  
  const width = iconData.width || 24;
  const height = iconData.height || 24;
  
  const componentDef = `
export default {
  name: "${iconName}",
  props: {
    size: {
      type: Number,
      default: 24
    },
    fill: {
      type: String,
      default: "currentColor"
    },
    stroke: {
      type: String,
      default: "none"
    },
    strokeWidth: {
      type: Number,
      default: 0
    }
  },
  render(h) {
    const viewBox = "${iconData.viewBox || `0 0 ${width} ${height}`}";
    const scale = iconData.transform ? iconData.transform.scale || 1 : 1;
    const translateX = iconData.transform ? iconData.transform.x || 0 : 0;
    const translateY = iconData.transform ? iconData.transform.y || 0 : 0;
    
    return h('svg', {
      attrs: {
        viewBox,
        width: this.size,
        height: this.size,
        fill: this.fill,
        stroke: this.stroke,
        'stroke-width': this.strokeWidth
      },
      class: ['datama-icon', 'datama-icon-${iconName}']
    }, [
      ${iconData.transform ? `h('g', { attrs: { transform: 'translate(${translateX}, ${translateY}) scale(${scale})' } }, [ this.$slots.default ])` : `this.$slots.default`}
    ]);
  }
};
  `;
  
  return componentDef;
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

  // Generate CDN library (Font Awesome style)
  const cdnLibraryCode = generateCdnVueLibrary(iconData);
  const cdnLibraryPath = path.join(distDir, 'datama-icons-cdn.js');
  fs.writeFileSync(cdnLibraryPath, cdnLibraryCode);

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

  export interface DataMaPicto {
    [${iconNamesList}]: DataMaIcon;
  }

  export type IconName = ${iconNamesList};
  export type IconCategory = ${categoryTypes || 'string'};

  export const icons: DataMaPicto;
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