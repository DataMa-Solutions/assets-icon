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
 * Generated for file : dev.js project project-deep-sky
 */

const fs = require('fs');
const path = require('path');
const { buildSvgData } = require('./build-svg');
const { buildJson } = require('./build-json');
const { buildVue } = require('./build-vue');

/**
 * Development helper to test the build process
 */
function devBuild() {
  console.log('🚀 Development Build for DataMa Icons\n');
  
  const rootDir = process.cwd();
  
  // Count current SVG files
  const svgFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.svg'));
  console.log(`📁 Found ${svgFiles.length} SVG files in root directory:`);
  svgFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log('\n📝 Processing SVG files...');
  const svgData = buildSvgData();
  
  if (!svgData || Object.keys(svgData).length === 0) {
    console.error('❌ No SVG data generated');
    return;
  }
  
  console.log('\n📦 Building JSON files...');
  const iconData = buildJson();
  
  console.log('\n🏗️ Building Vue components...');
  buildVue();
  
  // Display results
  console.log('\n📊 Build Results:');
  console.log(`   • Total icons processed: ${Object.keys(iconData).length}`);
  console.log(`   • Icons with custom ratios: ${Object.values(iconData).filter(i => i.ratio).length}`);
  
  // Show some icon examples
  const iconNames = Object.keys(iconData).slice(0, 5);
  console.log('\n🎨 Sample icons:');
  iconNames.forEach(name => {
    const icon = iconData[name];
    console.log(`   • ${name}: ${icon.height}px height, ${icon.tags.length} tags [${icon.tags.join(', ')}]`);
  });
  
  // Check output files
  console.log('\n📁 Generated files:');
  const outputFiles = [
    'icons.js',
    'icons.json',
    'dist/index.js',
    'dist/index.esm.js',
    'dist/index.d.ts',
    'dist/vue/index.js',
    'dist/vue/package.json',
    'dist/manifest.json'
  ];
  
  outputFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${file} (${size} KB)`);
    } else {
      console.log(`   ❌ ${file} (missing)`);
    }
  });
  
  // Check Vue components
  const vueComponentsDir = path.join(rootDir, 'dist', 'vue', 'components');
  if (fs.existsSync(vueComponentsDir)) {
    const vueFiles = fs.readdirSync(vueComponentsDir);
    console.log(`   ✅ Vue components: ${vueFiles.length} files`);
  }
  
  console.log('\n🎯 Usage Examples:');
  console.log('\n   📦 NPM package usage:');
  console.log('   ```bash');
  console.log('   npm install @datama/icons');
  console.log('   ```');
  
  console.log('\n   🔧 Vanilla JS usage:');
  console.log('   ```javascript');
  console.log('   import { DataMaLightIcons } from "@datama/icons";');
  console.log('   const checkIcon = DataMaLightIcons.check;');
  console.log('   ```');
  
  console.log('\n   ⚡ Vue 2 usage:');
  console.log('   ```javascript');
  console.log('   import DataMaPicto from "@datama/icons/vue";');
  console.log('   Vue.use(DataMaPicto);');
  console.log('   ```');
  console.log('   ```vue');
  console.log('   <IconCheck :size="24" fill="blue" />');
  console.log('   <IconGeneric name="check" :size="24" />');
  console.log('   ```');
  
  console.log('\n✅ Development build completed!');
}

// Run if called directly
if (require.main === module) {
  devBuild();
}

module.exports = { devBuild }; 