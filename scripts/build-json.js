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
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  
  // Load SVG data
  const svgDataPath = path.join(distDir, 'svg-data.json');
  if (!fs.existsSync(svgDataPath)) {
    console.log('⚠️  No SVG data found. Run build:svg first.');
    return;
  }

  const svgData = JSON.parse(fs.readFileSync(svgDataPath, 'utf8'));
  const iconNames = Object.keys(svgData);
  const complexIcons = iconNames.filter(name => svgData[name].isComplex);
  const simpleIcons = iconNames.filter(name => !svgData[name].isComplex);

  console.log(`📄 Building JSON files for ${iconNames.length} icons from SVG data only...`);
  console.log(`📊 Complex SVGs: ${complexIcons.length}, Simple SVGs: ${simpleIcons.length}`);

  // Load categories if available
  const categoriesPath = path.join(distDir, 'categories.json');
  let categories = {};
  if (fs.existsSync(categoriesPath)) {
    categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    console.log(`📁 Categories: ${Object.keys(categories).join(', ')}`);
  }

  // Generate icons.js file (ESM version)
  const header = generateHeader(iconNames.length, complexIcons.length, simpleIcons.length);
  const jsContent = `${header}export const DataMaLightIcons = ${JSON.stringify(svgData, null, 2)};

export default DataMaLightIcons;
`;

  const distJsPath = path.join(distDir, 'icons.js');
  fs.writeFileSync(distJsPath, jsContent);

  // Generate icons.json file (only in dist)
  const distJsonPath = path.join(distDir, 'icons.json');
  fs.writeFileSync(distJsonPath, JSON.stringify(svgData, null, 2));

  // Generate categories.js export (only in dist)
  if (Object.keys(categories).length > 0) {
    const categoriesJs = `/**
 * DataMa Icons Categories
 * Generated on ${new Date().toISOString()}
 */

export const iconCategories = ${JSON.stringify(categories, null, 2)};

export default iconCategories;
`;
    
    const distCategoriesJsPath = path.join(distDir, 'categories.js');
    fs.writeFileSync(distCategoriesJsPath, categoriesJs);
  }

  console.log(`✅ Generated icons.js (${(fs.statSync(distJsPath).size / 1024).toFixed(2)} KB)`);
  console.log(`✅ Generated icons.json (${(fs.statSync(distJsonPath).size / 1024).toFixed(2)} KB)`);
  
  if (Object.keys(categories).length > 0) {
    console.log(`✅ Generated categories.js`);
  }
  
  console.log(`📊 Total icons: ${iconNames.length}`);

  if (complexIcons.length > 0) {
    console.log(`\n🎨 Complex icons: ${complexIcons.join(', ')}`);
    console.log(`💡 Complex icons use 'content' property instead of 'path'`);
  }

  return svgData;
}

module.exports = { buildJson }; 