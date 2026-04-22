/**
 * DataMa Icons SVG Processing Script
 * 
 * This script processes SVG files and creates two versions for different use cases:
 * 
 * 1. Original content: Preserves all original colors, gradients, and URL references
 * 2. Selective fill content: Replaces both solid colors AND URL references (gradients/patterns) 
 *    with currentColor for complete color customization
 * 
 * FEATURE: Unified Fill Logic  
 * - When a custom fill color is provided (not 'currentColor', 'original', or 'none'):
 *   Uses selectiveFillContent to replace ALL color references (solid colors + gradients) with the custom color
 * - When fill is 'none', 'original', or undefined: Uses original content to preserve all original styling
 * 
 * This provides a simple two-state system: either fully customizable colors or original appearance.
 */

const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const cheerio = require('cheerio');

// Configuration SVGO pour optimiser les SVG
const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
          removeDesc: false,
        },
      },
    },
    'removeXMLNS',
    'removeDimensions',
    'sortAttrs',
    'convertStyleToAttrs',
  ],
};

/**
 * Normalize SVG viewBox to standard sizes
 * @param {object} $svg - Cheerio SVG element
 * @returns {object} - Normalized dimensions and viewBox
 */
function normalizeSvgViewBox($svg) {
  const viewBox = $svg.attr('viewBox');
  const width = parseFloat($svg.attr('width')) || 24;
  const height = parseFloat($svg.attr('height')) || 24;
  
  let normalizedViewBox = '0 0 24 24';
  let normalizedWidth = 24;
  let normalizedHeight = 24;
  let scaleTransform = null;
  
  if (viewBox) {
    const [x, y, w, h] = viewBox.split(' ').map(parseFloat);
    
    // Always normalize to 24x24 viewBox for consistency
    // Calculate scale to fit content within 24x24 while preserving aspect ratio
    const scaleX = 24 / w;
    const scaleY = 24 / h;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate translation to center the scaled content
    const scaledWidth = w * scale;
    const scaledHeight = h * scale;
    const translateX = (24 - scaledWidth) / 2 - (x * scale);
    const translateY = (24 - scaledHeight) / 2 - (y * scale);
    
    scaleTransform = `translate(${translateX}, ${translateY}) scale(${scale})`;
  } else {
    // No viewBox, create transformation based on width/height
    const scaleX = 24 / width;
    const scaleY = 24 / height;
    const scale = Math.min(scaleX, scaleY);
    
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const translateX = (24 - scaledWidth) / 2;
    const translateY = (24 - scaledHeight) / 2;
    
    scaleTransform = `translate(${translateX}, ${translateY}) scale(${scale})`;
  }
  
  return {
    width: normalizedWidth,
    height: normalizedHeight,
    viewBox: normalizedViewBox,
    originalWidth: width,
    originalHeight: height,
    scaleTransform: scaleTransform
  };
}


/**
 * Convert style attributes to direct attributes (style="fill: #XXX" to fill="#XXX")
 * @param {string} svgContent - Raw SVG content
 * @returns {string} - SVG content with style attributes converted
 */
function convertStyleToDirectAttributes(svgContent) {
  const $ = cheerio.load(svgContent, { xmlMode: true });
  
  // Find all elements with style attributes
  $('[style]').each((i, element) => {
    const $element = $(element);
    const styleAttr = $element.attr('style');
    
    if (!styleAttr) return;
    
    // Parse style attribute and extract individual properties
    const styles = {};
    const declarations = styleAttr.split(';').filter(decl => decl.trim());
    
    declarations.forEach(declaration => {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex === -1) return;
      
      const property = declaration.substring(0, colonIndex).trim().toLowerCase();
      const value = declaration.substring(colonIndex + 1).trim();
      
      if (value) {
        styles[property] = value;
      }
    });
    
    // Convert specific style properties to direct attributes
    const propertiesToConvert = ['fill', 'stroke', 'opacity', 'fill-opacity', 'stroke-opacity', 'stroke-width'];
    let modifiedStyle = styleAttr;
    
    propertiesToConvert.forEach(property => {
      if (styles[property]) {
        // Only set as direct attribute if not already present
        if (!$element.attr(property)) {
          $element.attr(property, styles[property]);
        }
        
        // Remove from style attribute
        const regex = new RegExp(`\\s*${property.replace('-', '\\-')}\\s*:\\s*[^;]+;?`, 'gi');
        modifiedStyle = modifiedStyle.replace(regex, '');
      }
    });
    
    // Clean up style attribute
    modifiedStyle = modifiedStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
    
    if (modifiedStyle) {
      $element.attr('style', modifiedStyle);
    } else {
      $element.removeAttr('style');
    }
  });
  
  return $.html();
}

/**
 * Extract color from CSS style string
 * @param {string} styleString - Style attribute value
 * @param {string} property - CSS property to extract (fill or stroke)
 * @returns {string|null} - Color value or null if not found
 */
function extractColorFromStyle(styleString, property) {
  if (!styleString) return null;
  
  // Handle both semicolon-separated and space-separated CSS
  const regex = new RegExp(`${property}\\s*:\\s*([^;\\s]+)`, 'i');
  const match = styleString.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Check if a color should be skipped (white, transparent, shadows)
 * @param {string} color - Color value
 * @param {number} opacity - Opacity value (0-1)
 * @returns {boolean} - True if should be skipped
 */
function shouldSkipColor(color, opacity = 1) {
  if (!color) return false; // undefined/null colors should be processed
  
  // Skip transparent colors
  if (color === 'none' || color === 'transparent') {
    return true;
  }
  
  // Skip shadow colors (very low opacity)
  if (opacity < 0.1) {
    return true;
  }
  
  // Skip pure white colors (backgrounds/decorations) - more comprehensive check
  const lowerColor = color.toLowerCase().trim();
  if (lowerColor === '#ffffff' || 
      lowerColor === '#fff' || 
      lowerColor === 'white' ||
      lowerColor === 'rgb(255,255,255)' ||
      lowerColor === 'rgb(255, 255, 255)') {
    return true;
  }
  
  // Do NOT skip pure black colors - make them colorable with currentColor
  // Commented out to allow black to be replaced with currentColor
  /*
  if (lowerColor === '#000000' || 
      lowerColor === '#000' || 
      lowerColor === 'black' ||
      lowerColor === 'rgb(0,0,0)' ||
      lowerColor === 'rgb(0, 0, 0)') {
    return true;
  }
  */
  
  // URL references will be handled separately, don't skip them in shouldSkipColor
  // if (color.startsWith('url(')) {
  //   return true;
  // }
  
  return false;
}



/**
 * Fix malformed SVG path data - DISABLED for now
 * @param {string} pathData - SVG path data
 * @returns {string} - Fixed path data
 */
function fixMalformedPath(pathData) {
  // DISABLE ALL FIXES FOR NOW - they were too aggressive
  return pathData;
}

/**
 * Fix malformed paths in HTML content - DISABLED for now
 * @param {string} content - HTML content with SVG paths
 * @returns {string} - Fixed content
 */
function fixMalformedPathsInContent(content) {
  // DISABLE ALL FIXES FOR NOW - they were too aggressive
  return content;
}

/**
 * Create inverted fill version of complex SVG (white becomes colored, colored becomes white)
 * @param {string} svgContent - Raw SVG content
 * @param {object} dimensions - Normalized dimensions
 * @param {boolean} isOutlineIcon - Whether this is an outline-style icon
 * @returns {string} - Processed content with inverted fill logic
 */
function createInvertFillVersion(svgContent, dimensions, isOutlineIcon = false) {
  // Convert style attributes to direct attributes before processing
  svgContent = convertStyleToDirectAttributes(svgContent);
  
  const $ = cheerio.load(svgContent, { xmlMode: true });
  const $svg = $('svg');
  
  $svg.attr('viewBox', dimensions.viewBox);
  $svg.attr('width', dimensions.width);  
  $svg.attr('height', dimensions.height);
  
  // Remove style tags and class-based styling
  $svg.find('style').remove();
  
  // Handle gradients in invert mode - replace gradients with currentColor
  $svg.find('defs linearGradient, defs radialGradient').each((i, gradientElement) => {
    const $gradient = $(gradientElement);
    const gradientId = $gradient.attr('id');
    
    if (gradientId) {
      // Find all elements using this gradient and replace with currentColor
      $svg.find(`[fill="url(#${gradientId})"], [stroke="url(#${gradientId})"]`).each((j, element) => {
        const $element = $(element);
        if ($element.attr('fill') && $element.attr('fill').includes(gradientId)) {
          $element.attr('fill', 'currentColor');
        }
        if ($element.attr('stroke') && $element.attr('stroke').includes(gradientId)) {
          $element.attr('stroke', 'currentColor');
        }
      });
    }
  });
  
  // Use the passed isOutlineIcon parameter (no need to re-detect)
  
  // Process all relevant elements for invert logic
  $svg.find('path, rect, circle, ellipse, polygon, polyline, use, g').each((i, element) => {
    const $element = $(element);
    const fill = $element.attr('fill');
    const stroke = $element.attr('stroke');
    const style = $element.attr('style');
    const fillOpacity = parseFloat($element.attr('fill-opacity') || '1');
    const tagName = element.tagName.toLowerCase();
    
    // Remove class attribute since we removed the styles
    $element.removeAttr('class');
    
    // Extract colors from style attribute
    const styleFill = extractColorFromStyle(style, 'fill');
    const styleStroke = extractColorFromStyle(style, 'stroke');
    
    // Determine final fill and stroke values
    const finalFill = fill || styleFill;
    const finalStroke = stroke || styleStroke;
    
    // Special handling for gradients (url() references) in invert mode
    if (finalFill && finalFill.startsWith('url(')) {
      // In invert mode, gradients (which are typically colored content) become white
      $element.attr('fill', 'white');
      if (style && styleFill && styleFill.startsWith('url(')) {
        let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
        newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
        if (newStyle) {
          $element.attr('style', newStyle);
        } else {
          $element.removeAttr('style');
        }
      }
      return; // Skip normal processing for gradient elements
    }
    
    // ADAPTIVE INVERT LOGIC: Different logic for outline icons vs colored icons
    if (isOutlineIcon) {
      // For outline icons: treat missing fill as black, invert both black and white
      if (isWhiteColor(finalFill)) {
        $element.attr('fill', 'currentColor');
        if (style && styleFill && isWhiteColor(styleFill)) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (!finalFill || isBlackColor(finalFill)) {
        // No fill (defaults to black) OR explicit black fill -> becomes white
        // For outline icons, explicitly set white fill for elements without fill
        $element.attr('fill', 'white');
        if (style && styleFill && isBlackColor(styleFill)) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (finalFill && !isWhiteColor(finalFill) && !isBlackColor(finalFill)) {
        // For outline icons, any other color becomes white
        $element.attr('fill', 'white');
        if (style && styleFill) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      }
    } else {
      // For colored icons: white becomes colored, all other colors become white
      if (isWhiteColor(finalFill)) {
        $element.attr('fill', 'currentColor');
        if (style && styleFill && isWhiteColor(styleFill)) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (finalFill && finalFill !== 'none' && finalFill !== 'transparent' && !finalFill.startsWith('url(')) {
        $element.attr('fill', 'white');
        if (style && styleFill) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      }
    }
    
    // Handle stroke with same adaptive logic
    if (isOutlineIcon) {
      // For outline icons: invert both black and white strokes
      if (isWhiteColor(finalStroke)) {
        $element.attr('stroke', 'currentColor');
        if (style && styleStroke && isWhiteColor(styleStroke)) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (!finalStroke || isBlackColor(finalStroke)) {
        $element.attr('stroke', 'white');
        if (style && styleStroke && isBlackColor(styleStroke)) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (finalStroke && !isWhiteColor(finalStroke) && !isBlackColor(finalStroke)) {
        // For outline icons, any other stroke color becomes white
        $element.attr('stroke', 'white');
        if (style && styleStroke) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      }
    } else {
      // For colored icons: white becomes colored, all other colors become white
      if (isWhiteColor(finalStroke)) {
        $element.attr('stroke', 'currentColor');
        if (style && styleStroke && isWhiteColor(styleStroke)) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (finalStroke && finalStroke !== 'none' && finalStroke !== 'transparent' && !finalStroke.startsWith('url(')) {
        $element.attr('stroke', 'white');
        if (style && styleStroke) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      }
    }
  });
  
  let content = $svg.html();
  if (dimensions.scaleTransform) {
    content = `<g transform="${dimensions.scaleTransform}">${content}</g>`;
  }
  
  return content;
}

/**
 * Check if a color is white
 * @param {string} color - Color value
 * @returns {boolean} - True if color is white
 */
function isWhiteColor(color) {
  if (!color) return false;
  
  const lowerColor = color.toLowerCase().trim();
  return (lowerColor === '#ffffff' || 
          lowerColor === '#fff' || 
          lowerColor === 'white' ||
          lowerColor === 'rgb(255,255,255)' ||
          lowerColor === 'rgb(255, 255, 255)');
}

/**
 * Check if a color is black
 * @param {string} color - Color value
 * @returns {boolean} - True if color is black
 */
function isBlackColor(color) {
  if (!color) return false;
  
  const lowerColor = color.toLowerCase().trim();
  return (lowerColor === '#000000' || 
          lowerColor === '#000' || 
          lowerColor === 'black' ||
          lowerColor === 'rgb(0,0,0)' ||
          lowerColor === 'rgb(0, 0, 0)');
}

/**
 * Create selective fill version of complex SVG
 * @param {string} svgContent - Raw SVG content
 * @param {object} dimensions - Normalized dimensions
 * @returns {string} - Processed content with selective fill logic
 */
function createSelectiveFillVersion(svgContent, dimensions) {
  // Convert style attributes to direct attributes before processing
  svgContent = convertStyleToDirectAttributes(svgContent);
  
  const $ = cheerio.load(svgContent, { xmlMode: true });
  const $svg = $('svg');
  
  $svg.attr('viewBox', dimensions.viewBox);
  $svg.attr('width', dimensions.width);  
  $svg.attr('height', dimensions.height);
  
  // Remove style tags and class-based styling, but preserve defs for gradients
  $svg.find('style').remove();
  
  // First, process gradients in defs to make them colorable
  $svg.find('defs linearGradient stop, defs radialGradient stop').each((i, element) => {
    const $stop = $(element);
    const stopColor = $stop.attr('stop-color');
    const stopOpacity = parseFloat($stop.attr('stop-opacity') || '1');
    
    // Skip colors that shouldn't be changed
    if (shouldSkipColor(stopColor, stopOpacity)) {
      return;
    }
    
    // Replace all other colors with currentColor for main gradient stops
    if (stopColor && stopColor !== 'currentColor') {
      $stop.attr('stop-color', 'currentColor');
    }
  });
  
  // Special handling for PowerBI - convert filter usages to use currentColor
  // Look for the black fill + filter pattern typical in PowerBI icon
  $svg.find('use').each((i, element) => {
    const $use = $(element);
    const fill = $use.attr('fill');
    const filter = $use.attr('filter');
    
    // Check if this is the PowerBI filter pattern
    if ((fill === 'black' || fill === '#000' || fill === '#000000') && filter && filter.includes('filter-')) {
      $use.attr('fill', 'currentColor');
      $use.attr('fill-opacity', '0.8'); // Maintain some transparency
    }
    
    // Also handle fills with url references in PowerBI
    if (fill && fill.startsWith('url(#linearGradient-')) {
      // Keep this as is, since the linearGradients are already processed to use currentColor
    }
  });
  
  // Process all rectangles in PowerBI to ensure they're colorable
  $svg.find('rect').each((i, element) => {
    const $rect = $(element);
    const fill = $rect.attr('fill');
    
    if (fill && fill.startsWith('url(#linearGradient-')) {
      // Keep this as is, since the linearGradients are already processed to use currentColor
    }
  });
  
  // Apply selective fill logic to all relevant elements, including those in defs
  $svg.find('path, rect, circle, ellipse, polygon, polyline, use, g').each((i, element) => {
    const $element = $(element);
    const fill = $element.attr('fill');
    const stroke = $element.attr('stroke');
    const style = $element.attr('style');
    const d = $element.attr('d');
    const fillOpacity = parseFloat($element.attr('fill-opacity') || '1');
    const tagName = element.tagName.toLowerCase();
    const preserveWhite = $element.attr('data-preserve-white') === 'true';
    
    // If this element is marked to preserve white, keep its original fill
    if (preserveWhite) {
      return;
    }
    
    // Remove class attribute since we removed the styles
    $element.removeAttr('class');
    $element.removeAttr('data-preserve-white'); // Clean up our custom attribute
    
    // Extract colors from style attribute
    const styleFill = extractColorFromStyle(style, 'fill');
    const styleStroke = extractColorFromStyle(style, 'stroke');
    
    // Determine final fill and stroke values
    const finalFill = fill || styleFill;
    const finalStroke = stroke || styleStroke;
    
    // Skip background paths that are explicitly transparent (like email background)
    if (d && isBackgroundPath(d) && (!finalFill || finalFill === 'none' || finalFill === 'transparent')) {
      return;
    }
    
    // Special handling for paths with d attribute and fill="none" - these should stay transparent
    if (tagName === 'path' && d && finalFill === 'none') {
      return;
    }
    
    // Check if this is a specific background rect (email first path)
    if (tagName === 'path' && d && d.startsWith('M0 0h24v24H0V0z')) {
      $element.attr('fill', 'none'); // Ensure email background is explicitly none
      return; // Skip email background rectangle
    }
    
    // Handle gradients and patterns FIRST - REPLACE URL REFERENCES with currentColor for fill customization
    if (finalFill && finalFill.startsWith('url(')) {
      $element.attr('fill', 'currentColor');
      // Remove conflicting style
      if (style && styleFill && styleFill.startsWith('url(')) {
        let newStyle = style.replace(/fill\s*:\s*url\([^)]+\)/gi, 'fill: currentColor');
        newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
        if (newStyle) {
          $element.attr('style', newStyle);
        } else {
          $element.removeAttr('style');
        }
      }
      // Continue processing for other attributes
    }
    
    // Handle stroke URL references too
    if (finalStroke && finalStroke.startsWith('url(')) {
      $element.attr('stroke', 'currentColor');
      // Remove conflicting style
      if (style && styleStroke && styleStroke.startsWith('url(')) {
        let newStyle = style.replace(/stroke\s*:\s*url\([^)]+\)/gi, 'stroke: currentColor');
        newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
        if (newStyle) {
          $element.attr('style', newStyle);
        } else {
          $element.removeAttr('style');
        }
      }
    }
    
    // Skip colors that shouldn't be changed, but still clean up styles (after URL processing)
    if (shouldSkipColor(finalFill, fillOpacity) && !finalFill.startsWith('url(')) {
      // Clean up style attributes that contain fills we want to skip
      if (style && styleFill && shouldSkipColor(styleFill, fillOpacity) && !styleFill.startsWith('url(')) {
        let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
        // Clean up any remaining semicolons or spaces
        newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
        if (newStyle) {
          $element.attr('style', newStyle);
        } else {
          $element.removeAttr('style');
        }
      }
      return;
    }
    
    // Special handling for <use> elements - check if they have structural colors first
    if (tagName === 'use') {
      if (finalFill && shouldSkipColor(finalFill)) {
        // Don't change structural colors like black shadows, but clean up styles
        if (style && styleFill && shouldSkipColor(styleFill, fillOpacity)) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
        return;
      } else if (finalFill && finalFill !== 'currentColor' && !shouldSkipColor(finalFill)) {
        $element.attr('fill', 'currentColor');
        // Remove conflicting style
        if (style && styleFill) {
          let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      } else if (!finalFill) {
        $element.attr('fill', 'currentColor');
      }
      return;
    }
    
    // For all other elements (colored paths, shapes), make them fillable
    if (finalFill && finalFill !== 'currentColor' && !shouldSkipColor(finalFill)) {
      $element.attr('fill', 'currentColor');
      // Remove conflicting style
      if (style && styleFill) {
        let newStyle = style.replace(/fill\s*:\s*[^;]+;?/gi, '');
        newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
        if (newStyle) {
          $element.attr('style', newStyle);
        } else {
          $element.removeAttr('style');
        }
      }
    } else if (!finalFill && tagName !== 'g') {
      // Elements without fill get currentColor for selective fill (except groups)
      // Paths need fill for visual content
      if (tagName === 'path' && d) {
        $element.attr('fill', 'currentColor');
      } else if (tagName !== 'path') {
        $element.attr('fill', 'currentColor');
      }
    }
    
    // Also handle stroke for line elements (non-URL references, URL are handled above)
    if (finalStroke && finalStroke !== 'none' && finalStroke !== 'transparent' && !finalStroke.startsWith('url(')) {
      if (finalStroke !== 'currentColor' && !shouldSkipColor(finalStroke)) {
        $element.attr('stroke', 'currentColor');
        // Remove conflicting style
        if (style && styleStroke) {
          let newStyle = style.replace(/stroke\s*:\s*[^;]+;?/gi, '');
          newStyle = newStyle.replace(/;+/g, ';').replace(/^\s*;\s*/, '').replace(/\s*;\s*$/, '').trim();
          if (newStyle) {
            $element.attr('style', newStyle);
          } else {
            $element.removeAttr('style');
          }
        }
      }
    }
  });
  
  let content = $svg.html();
  if (dimensions.scaleTransform) {
    content = `<g transform="${dimensions.scaleTransform}">${content}</g>`;
  }
  
  // Fix any malformed paths in the selective fill content
  content = fixMalformedPathsInContent(content);
  
  return content;
}

/**
 * Check if a path is likely a background/container path
 * @param {string} d - Path data
 * @returns {boolean}
 */
function isBackgroundPath(d) {
  if (!d) return false;
  
  const cleanPath = d.replace(/\s+/g, ' ').trim();
  
  // Common patterns for background rectangles that cover entire viewport
  const backgroundPatterns = [
    /^M0\s+0h24v24H0V?0z?$/i,        // M0 0h24v24H0V0z or M0 0h24v24H0z
    /^M0,?0h24v24H0V?0z?$/i,         // M0,0h24v24H0V0z variations
    /^M0\s+0L24\s+0L24\s+24L0\s+24z?$/i, // Rectangle with L commands
    // Email background pattern - more flexible
    /^M24\s+\d+(\.\d+)?V\d+(\.\d+)?C24\s+\d+(\.\d+)?.*H\d+(\.\d+)?C\d+(\.\d+)?\s+24\s+0\s+\d+(\.\d+)?\s+0\s+\d+(\.\d+)?V\d+(\.\d+)?C0\s+\d+(\.\d+)?.*Z$/i,
    // Generic large rectangle patterns that likely cover most of the viewport
    /^M0\s+0[hH]\d+[vV]\d+[hH]-?\d+[vV]?-?\d*[zZ]?$/i,
    // Another common background pattern
    /^M\d+\s+\d+[hH]\d+[vV]\d+[hH]-?\d+[zZ]?$/i,
    // Basic rectangle pattern
    /^M\d+\s+\d+[hH]\d+[vV]\d+[hH]-?\d+[vV]-?\d+[zZ]?$/i,
    // Specific email background pattern
    /^M0\s+0h24v24H0V0z\s+M/i
  ];
  
  return backgroundPatterns.some(pattern => pattern.test(cleanPath));
}


/**
 * Extract SVG data from SVG content, handling both simple and complex SVGs
 * @param {string} svgContent - Raw SVG content
 * @param {string} filename - Original filename
 * @param {string} category - Category folder name
 * @returns {object} - Processed icon data
 */
function extractSvgData(svgContent, filename, category = '') {
  try {
    // Convert style attributes to direct attributes before processing
    svgContent = convertStyleToDirectAttributes(svgContent);
    
    // Load SVG with cheerio
    const $ = cheerio.load(svgContent, { xmlMode: true });
    const $svg = $('svg');
    
    if ($svg.length === 0) {
      throw new Error('No SVG element found');
    }

    // Special handling for Excel and Google Sheets icons to preserve white elements
    if (filename.toLowerCase().includes('excel') || filename.toLowerCase().includes('sheets')) {
      // Find white path elements and mark them with a special attribute
      $svg.find('[fill="#fff"], [fill="#ffffff"], [fill="white"]').each((i, element) => {
        const $element = $(element);
        $element.attr('data-preserve-white', 'true');
      });
      
      // Also check for white fills in style attribute
      $svg.find('[style*="fill:#fff"], [style*="fill: #fff"], [style*="fill:#ffffff"], [style*="fill: #ffffff"], [style*="fill:white"], [style*="fill: white"]').each((i, element) => {
        const $element = $(element);
        $element.attr('data-preserve-white', 'true');
      });
    }

    // Normalize dimensions and viewBox
    const dimensions = normalizeSvgViewBox($svg);
    
    // Check if SVG is complex (has more than just paths/basic shapes)
    const complexElements = $svg.find('mask, filter, linearGradient, radialGradient, pattern, clipPath, defs, g[filter], g[mask]');
    
    // Also check for multi-colored content (multiple paths/elements with different fill/stroke colors)
    const allElements = $svg.find('path, rect, circle, ellipse, polygon, polyline, g');
    const colors = new Set();
    let hasMultipleColors = false;
    
    allElements.each((i, element) => {
      const $element = $(element);
      const fill = $element.attr('fill');
      const stroke = $element.attr('stroke');
      const style = $element.attr('style');
      
      // Extract colors from style attributes as well
      const styleFill = extractColorFromStyle(style, 'fill');
      const styleStroke = extractColorFromStyle(style, 'stroke');
      
      // Consider fills and strokes (ignore 'none', null, and currentColor)
      const finalFill = fill || styleFill;
      const finalStroke = stroke || styleStroke;
      
      if (finalFill && finalFill !== 'none' && finalFill !== 'currentColor') {
        colors.add(finalFill);
      }
      if (finalStroke && finalStroke !== 'none' && finalStroke !== 'currentColor') {
        colors.add(finalStroke);
      }
    });
    
    hasMultipleColors = colors.size > 1;
    
    // Check for nested groups or complex structure (including groups with transforms)
    const nestedGroups = $svg.find('g g');
    const hasNestedStructure = nestedGroups.length > 0;
    
    // Check for any groups with transform attributes (these should be treated as complex)
    const transformGroups = $svg.find('g[transform]');
    const hasTransformGroups = transformGroups.length > 0;
    
    // Check for malformed path data (sequences like "q-.448-.407-.931-.774" without proper spacing)
    let hasMalformedPaths = false;
    $svg.find('path').each((i, element) => {
      const $path = $(element);
      const d = $path.attr('d');
      if (d) {
        // Look for patterns like letter followed by multiple negative numbers without spaces
        // e.g., "q-.448-.407-.931" or "t-.651-1.452q-.217"
        const malformedPattern = /[a-zA-Z]-\d+\.\d*-\d+\.\d*-\d+|[a-zA-Z]-\d+-\d+-\d+|[qQtTlLhHvVcCsSaAzZ]-[\d\.-]+[qQtTlLhHvVcCsSaAzZ]/;
        if (malformedPattern.test(d)) {
          hasMalformedPaths = true;
          return false; // Break out of each loop
        }
      }
    });
    
    // Check for fill-rule or clip-rule attributes (indicates complex path operations)
    const complexPaths = $svg.find('[fill-rule], [clip-rule]');
    const hasComplexPaths = complexPaths.length > 0;
    
    // Check for patterns with embedded images (very complex, leave as-is)
    const hasEmbeddedImages = $svg.find('image, pattern image').length > 0;
    
    // Check if viewBox needs scaling (not standard 24x24 or similar)
    let needsScaling = false;
    const currentViewBox = $svg.attr('viewBox');
    if (currentViewBox) {
      const [x, y, w, h] = currentViewBox.split(' ').map(parseFloat);
      needsScaling = (w !== 24 || h !== 24 || x !== 0 || y !== 0);
    } else {
      const currentWidth = parseFloat($svg.attr('width')) || 24;
      const currentHeight = parseFloat($svg.attr('height')) || 24;
      needsScaling = (currentWidth !== 24 || currentHeight !== 24);
    }
    
    const isComplex = complexElements.length > 0 || hasMultipleColors || hasNestedStructure || hasComplexPaths || needsScaling || hasEmbeddedImages || hasTransformGroups || hasMalformedPaths;
    
    // Detect if this is an outline-style icon (only black/white colors)
    const explicitColors = [];
    $svg.find('path, rect, circle, ellipse, polygon, polyline').each((i, element) => {
      const $element = $(element);
      const fill = $element.attr('fill');
      const stroke = $element.attr('stroke');
      const style = $element.attr('style');
      const styleFill = extractColorFromStyle(style, 'fill');
      const styleStroke = extractColorFromStyle(style, 'stroke');
      const finalFill = fill || styleFill;
      const finalStroke = stroke || styleStroke;
      
      // Count explicit colors (ignore elements without color - they default to black)
      // Skip url() gradients for outline detection
      if (finalFill && finalFill !== 'none' && finalFill !== 'transparent' && !finalFill.startsWith('url(')) {
        explicitColors.push(finalFill.toLowerCase());
      }
      if (finalStroke && finalStroke !== 'none' && finalStroke !== 'transparent' && !finalStroke.startsWith('url(')) {
        explicitColors.push(finalStroke.toLowerCase());
      }
    });
    
    const uniqueExplicitColors = [...new Set(explicitColors)];
    const isOutlineIcon = uniqueExplicitColors.length <= 2 && 
      (uniqueExplicitColors.length === 0 || // No explicit colors (all black by default)
       uniqueExplicitColors.every(color => isWhiteColor(color)) || // Only white colors
       uniqueExplicitColors.every(color => isWhiteColor(color) || isBlackColor(color))); // Only white and/or black colors
    
    let processedContent;
    
    if (isComplex) {
      // For complex SVGs, keep the entire inner content but wrap in transform group if needed
      $svg.attr('viewBox', dimensions.viewBox);
      $svg.attr('width', dimensions.width);
      $svg.attr('height', dimensions.height);
      
      if (dimensions.scaleTransform) {
        // Wrap content in a group with scale transform
        let originalContent = $svg.html();
        // Fix any malformed paths in the content
        originalContent = fixMalformedPathsInContent(originalContent);
        processedContent = `<g transform="${dimensions.scaleTransform}">${originalContent}</g>`;
      } else {
        let originalContent = $svg.html();
        // Fix any malformed paths in the content
        originalContent = fixMalformedPathsInContent(originalContent);
        processedContent = originalContent;
      }
    } else {
      // For simple SVGs, preserve the order by processing elements in document order
      const paths = [];
      
      // Process all elements in document order to preserve structure
      $svg.children().each((i, element) => {
        const $element = $(element);
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'path') {
          const d = $element.attr('d');
          
          if (d) {
            paths.push(d);
          }
        } else if (['rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'].includes(tagName)) {
          const pathData = convertElementToPath($element);
          if (pathData) {
            paths.push(pathData);
          }
        } else {
          // If there are other elements, treat as complex
          processedContent = $svg.html();
          return false; // Break out of each loop
        }
      });

      if (processedContent === undefined) {
        if (paths.length === 0) {
          // No paths found, treat as complex
          processedContent = $svg.html();
        } else {
          // Combine all paths into one, preserving order
          processedContent = paths.join(' ');
        }
      }
    }

    // Generate icon name and tags
    const iconName = generateIconName(filename);
    const tags = generateTags(filename, category);

    const iconData = {
      height: dimensions.height,
      width: dimensions.width,
      viewBox: dimensions.viewBox,
      isComplex: isComplex,
      category: category || 'misc',
      originalDimensions: {
        width: dimensions.originalWidth,
        height: dimensions.originalHeight
      },
      tags: tags
    };

    // Add appropriate content property
    if (isComplex) {
      iconData.content = processedContent;
      
      // Create selective fill version for complex icons, but skip those with embedded images
      if (!hasEmbeddedImages) {
        iconData.selectiveFillContent = createSelectiveFillVersion(svgContent, dimensions);
        // Also create invert fill version for all complex icons
        iconData.invertFillContent = createInvertFillVersion(svgContent, dimensions, isOutlineIcon);
      }
    } else {
      iconData.path = processedContent;
      
      // Special handling for Email icon to prevent merging paths
      if (filename.toLowerCase().includes('email')) {
        // For email icons, we want to preserve the separate paths
        const $ = cheerio.load(svgContent, { xmlMode: true });
        const $svg = $('svg');
        
        // Set the viewBox and dimensions
        $svg.attr('viewBox', dimensions.viewBox);
        $svg.attr('width', dimensions.width);
        $svg.attr('height', dimensions.height);
        
        // Find the background path and content path
        $svg.find('path').each((i, element) => {
          const $path = $(element);
          const d = $path.attr('d');
          
          // Ensure the background path is explicitly none
          if (d && d.includes('M0 0h24v24H0V0z')) {
            $path.attr('fill', 'none');
          } else {
            // This is the content path
            $path.attr('fill', 'currentColor');
          }
        });
        
        iconData.selectiveFillContent = $svg.html();
        iconData.invertFillContent = createInvertFillVersion(svgContent, dimensions, isOutlineIcon);
      }
      // Create selective fill version for simple icons that have colors or are in sources category
      else if (category === 'sources' || hasMultipleColors || colors.size > 0) {
        iconData.selectiveFillContent = createSelectiveFillVersion(svgContent, dimensions);
        iconData.invertFillContent = createInvertFillVersion(svgContent, dimensions, isOutlineIcon);
      }
    }

    console.log(`✓ Processed: ${filename} → ${iconName}${isComplex ? ' (complex)' : ''}`);
    
    return { [iconName]: iconData };

  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
    return null;
  }
}

/**
 * Convert simple SVG elements to path data
 */
function convertElementToPath($element) {
  const tagName = $element[0].tagName.toLowerCase();
  
  switch (tagName) {
    case 'circle':
      const cx = parseFloat($element.attr('cx')) || 0;
      const cy = parseFloat($element.attr('cy')) || 0;
      const r = parseFloat($element.attr('r')) || 0;
      return `M ${cx-r} ${cy} A ${r} ${r} 0 1 0 ${cx+r} ${cy} A ${r} ${r} 0 1 0 ${cx-r} ${cy}`;
      
    case 'rect':
      const x = parseFloat($element.attr('x')) || 0;
      const y = parseFloat($element.attr('y')) || 0;
      const w = parseFloat($element.attr('width')) || 0;
      const h = parseFloat($element.attr('height')) || 0;
      return `M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h} L ${x} ${y+h} Z`;
      
    case 'polygon':
    case 'polyline':
      const points = $element.attr('points') || '';
      return convertPolygonToPath(points, tagName === 'polygon');
      
    default:
      return '';
  }
}

/**
 * Convert polygon points to path data
 */
function convertPolygonToPath(points, closePath = true) {
  if (!points.trim()) return '';
  
  const coords = points.trim().split(/[\s,]+/).map(Number);
  if (coords.length < 4) return '';
  
  let pathData = `M ${coords[0]} ${coords[1]}`;
  for (let i = 2; i < coords.length; i += 2) {
    pathData += ` L ${coords[i]} ${coords[i + 1]}`;
  }
  
  if (closePath) {
    pathData += ' Z';
  }
  
  return pathData;
}

/**
 * Generate icon name from filename
 */
function generateIconName(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate tags from filename and category
 */
function generateTags(filename, category) {
  const tags = [];
  
  // Add category as tag
  if (category) {
    tags.push(category);
  }
  
  // Split filename into words
  const words = filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 1);
  
  tags.push(...words);
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Recursively find all SVG files in directories
 */
function findSvgFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      files.push(...findSvgFiles(fullPath, baseDir));
    } else if (item.endsWith('.svg')) {
      // Calculate relative path for category
      const relativePath = path.relative(baseDir, fullPath);
      const category = path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath);
      files.push({
        fullPath,
        relativePath,
        category,
        filename: item
      });
    }
  }
  
  return files;
}

/**
 * Build SVG data from icons directory
 */
function buildSvgData() {
  const rootDir = process.cwd();
  const iconsDir = path.join(rootDir, 'icons');
  const distDir = path.join(rootDir, 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Check if icons directory exists
  if (!fs.existsSync(iconsDir)) {
    console.log('⚠️  Icons directory not found. Please create an "icons" folder and add SVG files.');
    return;
  }

  // Find all SVG files recursively
  const svgFiles = findSvgFiles(iconsDir);
  
  if (svgFiles.length === 0) {
    console.log('⚠️  No SVG files found in icons directory.');
    return;
  }

  console.log(`🎨 Processing ${svgFiles.length} SVG files from icons directory...`);

  const iconData = {};
  const categories = {};
  let processedCount = 0;
  let complexCount = 0;

  svgFiles.forEach(({ fullPath, category, filename }) => {
    const svgContent = fs.readFileSync(fullPath, 'utf8');
    
    const result = extractSvgData(svgContent, filename, category);
    if (result) {
      // result is now { [iconName]: iconData }
      const iconName = Object.keys(result)[0];
      const iconDataItem = result[iconName];
      
      iconData[iconName] = iconDataItem;
      
      if (iconDataItem.isComplex) {
        complexCount++;
      }
      
      // Track categories
      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(iconName);
      }
      
      processedCount++;
    }
  });

  // Save processed data to intermediate file
  const outputPath = path.join(distDir, 'svg-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(iconData, null, 2));

  // Save categories information
  const categoriesPath = path.join(distDir, 'categories.json');
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

  console.log(`✅ Successfully processed ${processedCount}/${svgFiles.length} icons`);
  console.log(`📊 Complex SVGs: ${complexCount}, Simple SVGs: ${processedCount - complexCount}`);
  console.log(`📁 Categories: ${Object.keys(categories).join(', ')}`);
  console.log(`📁 SVG data saved to: ${outputPath}`);

  return iconData;
}

// Run if called directly
if (require.main === module) {
  buildSvgData();
}

module.exports = { buildSvgData, extractSvgData }; 