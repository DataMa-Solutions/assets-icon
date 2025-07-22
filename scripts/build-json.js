const fs = require('fs');
const path = require('path');

/**
 * Generate file header with DataMa info
 */
function generateHeader(totalIcons, complexIcons = 0, simpleIcons = 0) {
  const now = new Date();
  return `/**
 * DataMa Icons Library
 * Generated on ${now.toISOString()}
 * Total icons: ${totalIcons}${complexIcons > 0 ? ` (${complexIcons} complex, ${simpleIcons} simple)` : ''}
 * 
 * Usage:
 * import { DataMaLightIcons } from '@datama/icons';
 * const iconData = DataMaLightIcons['icon-name'];
 * 
 * For complex SVGs:
 * const svg = iconData.isComplex ? iconData.content : iconData.path;
 */

`;
}

/**
 * Build JSON files from SVG data only (ignoring existing icons.js)
 */
function buildJson() {
  try {
    console.log();
    console.log('📦 Step 2: Generating JSON files...');
    
    // Load the SVG data
    const svgData = loadSvgData();
    
    // Filter out icons without content or path (these are just category folders)
    const filteredIcons = Object.entries(svgData).filter(([_, data]) => {
      return data.content || data.path;
    }).reduce((acc, [key, data]) => {
      acc[key] = data;
      return acc;
    }, {});
    
    // Process icons for output
    const processedIcons = processIconsForOutput(filteredIcons);
    
    // Count complexIcons (those with content property)
    const complexIcons = Object.values(processedIcons).filter(icon => icon.isComplex).length;
    const simpleIcons = Object.keys(processedIcons).length - complexIcons;
    
    // Get categories
    const categories = [...new Set(Object.values(processedIcons).map(icon => icon.category))].filter(Boolean);
    
    // Create the output directory if it doesn't exist
    const outDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    // Write the JSON file
    const jsonFile = path.join(outDir, 'icons.json');
    fs.writeFileSync(jsonFile, JSON.stringify(processedIcons));
    
    // Write the JavaScript module
    const jsFile = path.join(outDir, 'icons.js');
    const jsContent = `export default ${JSON.stringify(processedIcons)};\n`;
    fs.writeFileSync(jsFile, jsContent);
    
    // Generate a map of categories
    const categoriesMap = {};
    Object.entries(processedIcons).forEach(([iconName, iconData]) => {
      const category = iconData.category || 'other';
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }
      categoriesMap[category].push(iconName);
    });
    
    // Write the categories file
    const categoriesFile = path.join(outDir, 'categories.js');
    const categoriesContent = `export default ${JSON.stringify(categoriesMap)};\n`;
    fs.writeFileSync(categoriesFile, categoriesContent);
    
    // Save SVG data to reuse in Vue component generation
    const svgDataFile = path.join(outDir, 'svg-data.json');
    fs.writeFileSync(svgDataFile, JSON.stringify(processedIcons));
    
    // Output stats
    console.log(`📄 Building JSON files for ${Object.keys(processedIcons).length} icons from SVG data only...`);
    console.log(`📊 Complex SVGs: ${complexIcons}, Simple SVGs: ${simpleIcons}`);
    console.log(`📁 Categories: ${categories.join(', ')}`);
    
    const jsonSize = fs.statSync(jsonFile).size;
    const jsSize = fs.statSync(jsFile).size;
    
    console.log(`✅ Generated icons.js (${(jsSize / 1024).toFixed(2)} KB)`);
    console.log(`✅ Generated icons.json (${(jsonSize / 1024).toFixed(2)} KB)`);
    console.log('✅ Generated categories.js');
    
    console.log(`📊 Total icons: ${Object.keys(processedIcons).length}`);
    
    // Generate list of complex icons for reference
    console.log(`\n🎨 Complex icons: ${Object.entries(processedIcons)
      .filter(([_, data]) => data.isComplex)
      .map(([iconName]) => iconName)
      .join(', ')}`);
    console.log('💡 Complex icons use \'content\' property instead of \'path\'');
    
    return processedIcons;
    
  } catch (error) {
    console.error('Error building JSON files:', error);
    process.exit(1);
  }
}

// Load SVG data from svg-data.json
function loadSvgData() {
  const rootDir = process.cwd();
  const svgDataPath = path.join(rootDir, 'dist', 'svg-data.json');
  
  if (!fs.existsSync(svgDataPath)) {
    console.log('⚠️  No SVG data found. Run build:svg first.');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(svgDataPath, 'utf8'));
}

// Process icons for output in JSON format
function processIconsForOutput(iconsData) {
  // Filter out any unwanted icons or add any special processing
  const processedIcons = {};
  
  Object.entries(iconsData).forEach(([iconName, iconData]) => {
    // Create a new object with only the necessary properties
    const processedIcon = {
      ...iconData,
      // Ensure we have selectiveFillContent when available
      selectiveFillContent: iconData.selectiveFillContent || null,
    };
    
    // Remove any unnecessary properties if needed
    // ...
    
    processedIcons[iconName] = processedIcon;
  });
  
  return processedIcons;
}

module.exports = { buildJson }; 