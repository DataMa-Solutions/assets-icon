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
  
  let normalizedViewBox = viewBox;
  let normalizedWidth = 24;
  let normalizedHeight = 24;
  
  if (viewBox) {
    const [x, y, w, h] = viewBox.split(' ').map(parseFloat);
    
    // Determine target size - prefer 24x24, but respect aspect ratio
    const aspectRatio = w / h;
    
    if (aspectRatio > 1) {
      // Wider than tall
      normalizedWidth = 24;
      normalizedHeight = Math.round(24 / aspectRatio);
    } else if (aspectRatio < 1) {
      // Taller than wide  
      normalizedHeight = 24;
      normalizedWidth = Math.round(24 * aspectRatio);
    } else {
      // Square
      normalizedWidth = normalizedHeight = 24;
    }
    
    // Center the content in a 24x24 space
    const offsetX = (24 - normalizedWidth) / 2;
    const offsetY = (24 - normalizedHeight) / 2;
    
    normalizedViewBox = `${-offsetX} ${-offsetY} 24 24`;
  } else {
    // No viewBox, create one based on width/height
    const aspectRatio = width / height;
    
    if (aspectRatio > 1) {
      normalizedWidth = 24;
      normalizedHeight = Math.round(24 / aspectRatio);
    } else if (aspectRatio < 1) {
      normalizedHeight = 24;
      normalizedWidth = Math.round(24 * aspectRatio);
    }
    
    normalizedViewBox = '0 0 24 24';
  }
  
  return {
    width: normalizedWidth,
    height: normalizedHeight,
    viewBox: normalizedViewBox,
    originalWidth: width,
    originalHeight: height
  };
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
    // Load SVG with cheerio
    const $ = cheerio.load(svgContent, { xmlMode: true });
    const $svg = $('svg');
    
    if ($svg.length === 0) {
      throw new Error('No SVG element found');
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
      
      // Consider fills and strokes (ignore 'none', null, and currentColor)
      if (fill && fill !== 'none' && fill !== 'currentColor') {
        colors.add(fill);
      }
      if (stroke && stroke !== 'none' && stroke !== 'currentColor') {
        colors.add(stroke);
      }
    });
    
    hasMultipleColors = colors.size > 1;
    
    // Check for nested groups or complex structure
    const nestedGroups = $svg.find('g g');
    const hasNestedStructure = nestedGroups.length > 0;
    
    // Check for fill-rule or clip-rule attributes (indicates complex path operations)
    const complexPaths = $svg.find('[fill-rule], [clip-rule]');
    const hasComplexPaths = complexPaths.length > 0;
    
    const isComplex = complexElements.length > 0 || hasMultipleColors || hasNestedStructure || hasComplexPaths;
    
    let processedContent;
    
    if (isComplex) {
      // For complex SVGs, keep the entire inner content
      $svg.attr('viewBox', dimensions.viewBox);
      $svg.attr('width', dimensions.width);
      $svg.attr('height', dimensions.height);
      
      processedContent = $svg.html();
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
    } else {
      iconData.path = processedContent;
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

module.exports = { buildSvgData, extractSvgData }; 