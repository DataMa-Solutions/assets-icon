/**
 * DataMa Icons Font Builder
 * 
 * This script generates a font family "Datama Assets" from SVG icons,
 * similar to Font Awesome or Material Design Icons.
 * 
 * Usage:
 *   node scripts/build-font.js
 * 
 * Output:
 *   - dist/fonts/datama-assets.woff2
 *   - dist/fonts/datama-assets.woff
 *   - dist/fonts/datama-assets.ttf
 *   - dist/css/datama-assets.css
 *   - dist/fonts/datama-assets.html (demo file)
 */

const fs = require('fs');
const path = require('path');
const webfont = require('webfont').default;
const cheerio = require('cheerio');

/**
 * Configuration
 */
const CONFIG = {
  fontName: 'datama-assets',
  fontFamily: 'Datama Assets',
  classNamePrefix: 'datama-icon',
  defaultFontSize: '16px',
  fontBaseSize: 512, // Base size for font generation (should match SVG viewBox)
  startUnicode: 0xE000, // Private Use Area start (E000-EFFF)
  outputDir: {
    fonts: path.join(__dirname, '../dist/fonts')
  }
};

/**
 * Load SVG data from build process
 */
function loadSvgData() {
  const rootDir = process.cwd();
  const svgDataPath = path.join(rootDir, 'dist', 'svg-data.json');
  
  if (!fs.existsSync(svgDataPath)) {
    console.error('❌ No SVG data found. Please run "npm run build:svg" first.');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(svgDataPath, 'utf8'));
}

/**
 * Check if a rect element is a background (covers entire viewBox)
 */
function isBackgroundRect($rect, viewBox) {
  const width = parseFloat($rect.attr('width') || '0');
  const height = parseFloat($rect.attr('height') || '0');
  const x = parseFloat($rect.attr('x') || '0');
  const y = parseFloat($rect.attr('y') || '0');
  const fill = $rect.attr('fill') || '';
  
  // Parse viewBox
  const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
  
  // More lenient tolerance for dimensions and position
  // Allow rectangles that are close to viewBox size (within 2 units)
  const dimensionTolerance = 2;
  const positionTolerance = 2;
  
  // Check if rect dimensions are close to viewBox dimensions
  const widthClose = Math.abs(width - vbWidth) < dimensionTolerance || 
                     (width >= vbWidth * 0.9 && width <= vbWidth * 1.1);
  const heightClose = Math.abs(height - vbHeight) < dimensionTolerance || 
                      (height >= vbHeight * 0.9 && height <= vbHeight * 1.1);
  
  // Check if position is close to viewBox origin (allow small offsets)
  const xClose = Math.abs(x - vbX) < positionTolerance || x <= vbX + 1;
  const yClose = Math.abs(y - vbY) < positionTolerance || y <= vbY + 1;
  
  // Check if it covers most of the viewBox area (at least 80%)
  const rectArea = width * height;
  const viewBoxArea = vbWidth * vbHeight;
  const coverageRatio = rectArea / viewBoxArea;
  
  // Also check if it's a solid color fill (not transparent/none)
  const isSolidFill = fill && fill !== 'none' && fill !== 'transparent';
  
  // Check if it's in a mask (common pattern for background rects)
  const isInMask = $rect.closest('mask').length > 0;
  
  // If it's in a mask and covers most of the viewBox, it's likely a background
  if (isInMask && coverageRatio > 0.8 && isSolidFill) {
    return true;
  }
  
  // If it covers the viewBox (with tolerance) and has a solid fill, it's likely a background
  if (widthClose && heightClose && xClose && yClose && isSolidFill) {
    return true;
  }
  
  // Also check for rectangles that are exactly or almost exactly the viewBox size
  // (common pattern: 24x24 in a 24x24 or 25x25 viewBox)
  if (isInMask && 
      ((Math.abs(width - 24) < 0.5 && Math.abs(height - 24) < 0.5) ||
       (Math.abs(width - vbWidth) < 1 && Math.abs(height - vbHeight) < 1))) {
    return true;
  }
  
  // Special case: rectangles that are 24x24 (common background size)
  // even if viewBox is slightly different (like 24x25 or 25x25)
  if (isInMask && 
      Math.abs(width - 24) < 0.5 && 
      Math.abs(height - 24) < 0.5 && 
      isSolidFill) {
    return true;
  }
  
  // If rectangle is in a mask and covers at least 90% of the area, it's likely a background
  if (isInMask && coverageRatio > 0.9 && isSolidFill) {
    return true;
  }
  
  return false;
}

/**
 * Remove background rectangles from SVG content
 */
function removeBackgroundRects(svgContent, viewBox) {
  const $ = cheerio.load(svgContent, { xmlMode: true });
  
  // First pass: Remove all rects in masks that look like backgrounds
  // Be more aggressive with masks - if a rect in a mask is large, remove it
  $('mask rect').each((i, element) => {
    const $rect = $(element);
    const width = parseFloat($rect.attr('width') || '0');
    const height = parseFloat($rect.attr('height') || '0');
    const fill = $rect.attr('fill') || '';
    
    // Parse viewBox
    const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
    
    // If rect in mask is large (>= 20x20 or >= 80% of viewBox) and has solid fill, remove it
    const isLarge = (width >= 20 && height >= 20) || 
                    (width >= vbWidth * 0.8 && height >= vbHeight * 0.8);
    const isSolidFill = fill && fill !== 'none' && fill !== 'transparent';
    
    if (isLarge && isSolidFill) {
      $rect.remove();
    }
  });
  
  // Second pass: Remove rect elements that cover the entire viewBox (anywhere)
  $('rect').each((i, element) => {
    const $rect = $(element);
    if (isBackgroundRect($rect, viewBox)) {
      $rect.remove();
    }
  });
  
  // Also remove empty masks after removing their content
  $('mask').each((i, element) => {
    const $mask = $(element);
    // Remove mask if it's empty or only contains removed rects
    const hasContent = $mask.children().length > 0 && 
                      $mask.find('rect, path, circle, ellipse, polygon, polyline, g').length > 0;
    if (!hasContent) {
      const maskId = $mask.attr('id');
      // Remove mask attribute from elements that reference this mask
      if (maskId) {
        $(`[mask*="${maskId}"]`).removeAttr('mask');
      }
      $mask.remove();
    }
  });
  
  // Remove mask attributes from groups if mask was removed
  $('g[mask]').each((i, element) => {
    const $g = $(element);
    const maskUrl = $g.attr('mask');
    if (maskUrl) {
      const maskId = maskUrl.replace('url(#', '').replace(')', '');
      if ($(`#${maskId}`).length === 0) {
        // Mask doesn't exist, remove the mask attribute
        $g.removeAttr('mask');
      }
    }
  });
  
  return $.html();
}

/**
 * Convert icon data to SVG file for font generation
 */
function createSvgFileForIcon(iconName, iconData, tempDir) {
  const svgContent = iconData.isComplex ? iconData.content : iconData.path;
  const viewBox = iconData.viewBox || '0 0 24 24';
  
  // Create SVG wrapper
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`;
  
  if (iconData.isComplex) {
    // For complex icons, remove background rects before using content
    const cleanedContent = removeBackgroundRects(svgContent, viewBox);
    svg += cleanedContent;
  } else {
    // For simple icons, wrap path in SVG
    svg += `<path d="${svgContent}" fill="currentColor"/>`;
  }
  
  svg += '</svg>';
  
  // Parse and clean the final SVG to remove any remaining background rects
  const $ = cheerio.load(svg, { xmlMode: true });
  const $svg = $('svg');
  
  // First pass: Aggressively remove large rects in masks
  $svg.find('mask rect').each((i, element) => {
    const $rect = $(element);
    const width = parseFloat($rect.attr('width') || '0');
    const height = parseFloat($rect.attr('height') || '0');
    const fill = $rect.attr('fill') || '';
    
    // Parse viewBox
    const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
    
    // If rect in mask is large (>= 20x20 or >= 80% of viewBox) and has solid fill, remove it
    const isLarge = (width >= 20 && height >= 20) || 
                    (width >= vbWidth * 0.8 && height >= vbHeight * 0.8);
    const isSolidFill = fill && fill !== 'none' && fill !== 'transparent';
    
    if (isLarge && isSolidFill) {
      $rect.remove();
    }
  });
  
  // Second pass: Remove background rects from anywhere in the SVG (including defs, masks, etc.)
  $svg.find('rect').each((i, element) => {
    const $rect = $(element);
    if (isBackgroundRect($rect, viewBox)) {
      $rect.remove();
    }
  });
  
  // Remove empty masks and defs
  $svg.find('mask').each((i, element) => {
    const $mask = $(element);
    const hasContent = $mask.children().length > 0 && 
                      $mask.find('rect, path, circle, ellipse, polygon, polyline, g').length > 0;
    if (!hasContent) {
      const maskId = $mask.attr('id');
      // Remove mask attribute from elements that reference this mask
      if (maskId) {
        $svg.find(`[mask*="${maskId}"]`).removeAttr('mask');
      }
      $mask.remove();
    }
  });
  
  // Remove empty defs
  $svg.find('defs').each((i, element) => {
    const $defs = $(element);
    if ($defs.children().length === 0) {
      $defs.remove();
    }
  });
  
  // Remove mask attributes from groups if mask was removed
  $svg.find('g[mask]').each((i, element) => {
    const $g = $(element);
    const maskUrl = $g.attr('mask');
    if (maskUrl) {
      const maskId = maskUrl.replace('url(#', '').replace(')', '');
      if ($svg.find(`#${maskId}`).length === 0) {
        $g.removeAttr('mask');
      }
    }
  });
  
  svg = $.html();
  
  // Write temporary SVG file
  const svgPath = path.join(tempDir, `${iconName}.svg`);
  fs.writeFileSync(svgPath, svg);
  
  return svgPath;
}

/**
 * Generate CSS file for the font
 */
function generateCSS(fontName, fontFamily, classNamePrefix, iconMap, fontBaseSize) {
  const css = `/**
 * Datama Assets Icon Font
 * Generated automatically - do not edit manually
 */

@font-face {
  font-family: '${fontFamily}';
  src: url('${fontName}.woff2') format('woff2'),
       url('${fontName}.woff') format('woff'),
       url('${fontName}.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.${classNamePrefix} {
  font-family: '${fontFamily}';
  font-weight: normal;
  font-style: normal;
  font-size: ${CONFIG.defaultFontSize};
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

/* Individual icon classes */
${Object.entries(iconMap)
  .map(([iconName, unicode]) => {
    const className = iconName.replace(/-/g, '-');
    const unicodeHex = typeof unicode === 'number' 
      ? unicode.toString(16).toUpperCase().padStart(4, '0')
      : unicode;
    return `.${classNamePrefix}-${className}:before { content: '\\${unicodeHex}'; }`;
  })
  .join('\n')}

/* Icon sizes */
.${classNamePrefix}-xs { font-size: 0.75em; }
.${classNamePrefix}-sm { font-size: 0.875em; }
.${classNamePrefix}-lg { font-size: 1.333em; }
.${classNamePrefix}-xl { font-size: 1.5em; }
.${classNamePrefix}-2x { font-size: 2em; }
.${classNamePrefix}-3x { font-size: 3em; }
.${classNamePrefix}-4x { font-size: 4em; }
.${classNamePrefix}-5x { font-size: 5em; }

/* Fixed width icons */
.${classNamePrefix}-fw {
  text-align: center;
  width: 1.25em;
}
`;

  return css;
}

/**
 * Generate HTML demo file
 */
function generateHTMLDemo(fontName, fontFamily, classNamePrefix, iconMap) {
  const icons = Object.keys(iconMap).sort();
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fontFamily} - Icon Font Demo</title>
  <link rel="stylesheet" href="${fontName}.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .icon-item:hover {
      background: #f9f9f9;
    }
    .icon-item i {
      font-size: 2em;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .icon-name {
      font-size: 0.75rem;
      color: #666;
      text-align: center;
      word-break: break-word;
    }
    .code-example {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 2rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
    }
    .code-example code {
      display: block;
      margin: 0.5rem 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${fontFamily}</h1>
    <p class="subtitle">Icon Font Library - ${icons.length} icons available</p>
    
    <div class="code-example">
      <strong>Usage:</strong>
      <code>&lt;i class="${classNamePrefix} ${classNamePrefix}-check"&gt;&lt;/i&gt;</code>
      <code>&lt;i class="${classNamePrefix} ${classNamePrefix}-home ${classNamePrefix}-lg"&gt;&lt;/i&gt;</code>
      <code>&lt;i class="${classNamePrefix} ${classNamePrefix}-settings ${classNamePrefix}-2x"&gt;&lt;/i&gt;</code>
    </div>
    
    <div class="icon-grid">
      ${icons.map(iconName => {
        const className = iconName.replace(/-/g, '-');
        return `
        <div class="icon-item">
          <i class="${classNamePrefix} ${classNamePrefix}-${className}"></i>
          <span class="icon-name">${iconName}</span>
        </div>`;
      }).join('')}
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Generate icon mapping (icon name to unicode)
 */
function generateIconMap(iconNames) {
  const iconMap = {};
  let currentUnicode = CONFIG.startUnicode;
  
  iconNames.forEach(iconName => {
    iconMap[iconName] = currentUnicode.toString(16).toUpperCase();
    currentUnicode++;
    
    // Prevent overflow of Private Use Area
    if (currentUnicode > 0xEFFF) {
      console.warn('⚠️  Warning: Running out of Unicode Private Use Area codes!');
    }
  });
  
  return iconMap;
}

/**
 * Main build function
 */
async function buildFont() {
  console.log('🚀 Starting Datama Assets font generation...\n');
  
  try {
    // Step 1: Load SVG data
    console.log('📝 Step 1: Loading SVG data...');
    const svgData = loadSvgData();
    const rawIconNames = Object.keys(svgData).sort();
    
    // Remove -svg suffix from icon names
    const iconNames = rawIconNames.map(name => name.replace(/-svg$/, ''));
    
    if (iconNames.length === 0) {
      console.error('❌ No icons found in SVG data.');
      process.exit(1);
    }
    
    console.log(`✅ Loaded ${iconNames.length} icons\n`);
    
    // Step 2: Create temporary directory for SVG files
    console.log('📁 Step 2: Preparing SVG files...');
    const tempDir = path.join(__dirname, '../.temp-font-svgs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Clean temp directory
    let existingFiles = [];
    try {
      existingFiles = fs.readdirSync(tempDir);
      existingFiles.forEach(file => {
        const filePath = path.join(tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (err) {
      // Directory might be empty, that's okay
    }
    
    // Create SVG files for each icon
    const svgFiles = [];
    iconNames.forEach((iconName, index) => {
      // Use original name with -svg suffix to get data from svgData
      const originalIconName = rawIconNames[index];
      const iconData = svgData[originalIconName];
      const svgPath = createSvgFileForIcon(iconName, iconData, tempDir);
      svgFiles.push(svgPath);
    });
    
    console.log(`✅ Prepared ${svgFiles.length} SVG files\n`);
    
    // Step 3: Generate font
    console.log('🔤 Step 3: Generating font files...');
    const result = await webfont({
      files: path.join(tempDir, '*.svg'),
      fontName: CONFIG.fontName,
      formats: ['woff2', 'woff', 'ttf'],
      startUnicode: CONFIG.startUnicode,
      fontHeight: CONFIG.fontBaseSize,
      normalize: true,
      centerHorizontally: true,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fixedWidth: false,
      descent: 0
    });
    
    // Step 4: Create output directories
    console.log('\n📦 Step 4: Saving font files...');
    const fontDir = CONFIG.outputDir.fonts;
    if (!fs.existsSync(fontDir)) {
      fs.mkdirSync(fontDir, { recursive: true });
    }
    
    // Save font files
    if (result.woff2) {
      fs.writeFileSync(path.join(fontDir, `${CONFIG.fontName}.woff2`), result.woff2);
      console.log(`✅ Generated ${CONFIG.fontName}.woff2 (${(result.woff2.length / 1024).toFixed(2)} KB)`);
    }
    if (result.woff) {
      fs.writeFileSync(path.join(fontDir, `${CONFIG.fontName}.woff`), result.woff);
      console.log(`✅ Generated ${CONFIG.fontName}.woff (${(result.woff.length / 1024).toFixed(2)} KB)`);
    }
    if (result.ttf) {
      fs.writeFileSync(path.join(fontDir, `${CONFIG.fontName}.ttf`), result.ttf);
      console.log(`✅ Generated ${CONFIG.fontName}.ttf (${(result.ttf.length / 1024).toFixed(2)} KB)`);
    }
    
    // Step 5: Generate icon mapping
    console.log('\n🗺️  Step 5: Generating icon mapping...');
    const iconMap = {};
    
    // Try to get glyphs data from result
    if (result.glyphsData && Array.isArray(result.glyphsData) && result.glyphsData.length > 0) {
      console.log(`   Found ${result.glyphsData.length} glyphs in result`);
      
      result.glyphsData.forEach((glyph, index) => {
        const iconName = iconNames[index];
        if (!iconName) return;
        
        // Handle different unicode formats
        let unicodeValue = null;
        if (glyph.unicode) {
          if (Array.isArray(glyph.unicode) && glyph.unicode.length > 0) {
            unicodeValue = typeof glyph.unicode[0] === 'string' 
              ? glyph.unicode[0].charCodeAt(0) 
              : glyph.unicode[0];
          } else if (typeof glyph.unicode === 'string') {
            unicodeValue = glyph.unicode.charCodeAt(0);
          } else if (typeof glyph.unicode === 'number') {
            unicodeValue = glyph.unicode;
          }
        }
        
        // If no unicode found, use calculated value
        if (unicodeValue === null) {
          unicodeValue = CONFIG.startUnicode + index;
        }
        
        iconMap[iconName] = unicodeValue;
      });
    } else if (result.glyphs && Array.isArray(result.glyphs) && result.glyphs.length > 0) {
      // Alternative property name
      console.log(`   Found ${result.glyphs.length} glyphs in result.glyphs`);
      result.glyphs.forEach((glyph, index) => {
        const iconName = iconNames[index];
        if (iconName) {
          const unicode = glyph.unicode || (CONFIG.startUnicode + index);
          iconMap[iconName] = typeof unicode === 'string' ? unicode.charCodeAt(0) : unicode;
        }
      });
    } else {
      // Fallback: generate mapping based on startUnicode
      console.log(`   Using fallback: generating mapping for ${iconNames.length} icons`);
      let currentUnicode = CONFIG.startUnicode;
      iconNames.forEach(iconName => {
        iconMap[iconName] = currentUnicode;
        currentUnicode++;
      });
    }
    
    console.log(`   Generated mapping for ${Object.keys(iconMap).length} icons`);
    
    // Step 6: Generate CSS
    console.log('\n🎨 Step 6: Generating CSS file...');
    const css = generateCSS(CONFIG.fontName, CONFIG.fontFamily, CONFIG.classNamePrefix, iconMap, CONFIG.fontBaseSize);
    const cssPath = path.join(fontDir, `${CONFIG.fontName}.css`);
    fs.writeFileSync(cssPath, css);
    console.log(`✅ Generated ${CONFIG.fontName}.css`);
    
    // Step 7: Generate HTML demo
    console.log('\n📄 Step 7: Generating HTML demo...');
    const html = generateHTMLDemo(CONFIG.fontName, CONFIG.fontFamily, CONFIG.classNamePrefix, iconMap);
    const htmlPath = path.join(fontDir, `${CONFIG.fontName}.html`);
    fs.writeFileSync(htmlPath, html);
    console.log(`✅ Generated ${CONFIG.fontName}.html`);
    
    // Step 8: Save icon mapping JSON
    console.log('\n💾 Step 8: Saving icon mapping...');
    const mappingPath = path.join(fontDir, `${CONFIG.fontName}-mapping.json`);
    const mappingCount = Object.keys(iconMap).length;
    if (mappingCount === 0) {
      console.warn('⚠️  Warning: Icon mapping is empty!');
      console.warn(`   iconNames length: ${iconNames.length}`);
      console.warn(`   result keys: ${Object.keys(result).join(', ')}`);
    }
    fs.writeFileSync(mappingPath, JSON.stringify(iconMap, null, 2));
    console.log(`✅ Generated ${CONFIG.fontName}-mapping.json (${mappingCount} icons)`);
    
    // Cleanup temp directory
    console.log('\n🧹 Cleaning up...');
    try {
      const filesToClean = fs.readdirSync(tempDir);
      filesToClean.forEach(file => {
        const filePath = path.join(tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(tempDir);
      console.log('✅ Cleanup complete');
    } catch (err) {
      console.warn('⚠️  Could not clean up temp directory:', err.message);
    }
    
    // Summary
    console.log('\n✅ Font generation completed successfully!');
    console.log(`📊 Generated ${iconNames.length} icons`);
    console.log(`📁 All files in: dist/fonts/`);
    console.log(`   - ${CONFIG.fontName}.woff2`);
    console.log(`   - ${CONFIG.fontName}.woff`);
    console.log(`   - ${CONFIG.fontName}.ttf`);
    console.log(`   - ${CONFIG.fontName}.css`);
    console.log(`   - ${CONFIG.fontName}.html`);
    console.log(`\n💡 Usage: <i class="${CONFIG.classNamePrefix} ${CONFIG.classNamePrefix}-${iconNames[0]}"></i>`);
    
  } catch (error) {
    console.error('❌ Font generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  buildFont();
}

module.exports = { buildFont };
