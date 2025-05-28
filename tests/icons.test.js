const fs = require('fs');
const path = require('path');
const { extractSvgData } = require('../scripts/build-svg');

describe('Icons Structure', () => {
  test('should have valid icon data structure', () => {
    const distPath = path.join(__dirname, '..', 'dist', 'svg-data.json');
    
    if (fs.existsSync(distPath)) {
      const data = JSON.parse(fs.readFileSync(distPath, 'utf8'));
      const icons = Object.values(data);
      
      expect(icons.length).toBeGreaterThan(0);
      
      icons.forEach(icon => {
        // Required properties for all icons
        expect(icon).toHaveProperty('height');
        expect(icon).toHaveProperty('width');
        expect(icon).toHaveProperty('viewBox');
        expect(icon).toHaveProperty('tags');
        expect(icon).toHaveProperty('isComplex');
        expect(icon).toHaveProperty('category');
        expect(icon).toHaveProperty('originalDimensions');
        
        // Type validation
        expect(typeof icon.height).toBe('number');
        expect(typeof icon.width).toBe('number');
        expect(typeof icon.viewBox).toBe('string');
        expect(Array.isArray(icon.tags)).toBe(true);
        expect(typeof icon.isComplex).toBe('boolean');
        expect(typeof icon.category).toBe('string');
        expect(typeof icon.originalDimensions).toBe('object');
        
        // Content validation based on complexity
        if (icon.isComplex) {
          expect(icon).toHaveProperty('content');
          expect(typeof icon.content).toBe('string');
          expect(icon.content.length).toBeGreaterThan(0);
        } else {
          expect(icon).toHaveProperty('path');
          expect(typeof icon.path).toBe('string');
          expect(icon.path.length).toBeGreaterThan(0);
        }
        
        // ViewBox should be valid
        const viewBoxParts = icon.viewBox.split(' ');
        expect(viewBoxParts.length).toBe(4);
        viewBoxParts.forEach(part => {
          expect(isNaN(parseFloat(part))).toBe(false);
        });
        
        // Tags should not be empty
        expect(icon.tags.length).toBeGreaterThan(0);
        
        // Original dimensions should be valid
        expect(icon.originalDimensions).toHaveProperty('width');
        expect(icon.originalDimensions).toHaveProperty('height');
        expect(typeof icon.originalDimensions.width).toBe('number');
        expect(typeof icon.originalDimensions.height).toBe('number');
      });
    } else {
      console.warn('SVG data file not found, run build first');
    }
  });

  test('should have consistent icon naming', () => {
    const distPath = path.join(__dirname, '..', 'dist', 'svg-data.json');
    
    if (fs.existsSync(distPath)) {
      const data = JSON.parse(fs.readFileSync(distPath, 'utf8'));
      const iconNames = Object.keys(data);
      
      iconNames.forEach(name => {
        // Icon names should be kebab-case and end with -svg
        expect(name).toMatch(/^[a-z0-9-]+(-svg)$/);
        expect(name).not.toContain('_');
        expect(name).not.toContain(' ');
      });
    }
  });

  test('should extract SVG data correctly', () => {
    const testSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      </svg>
    `;
    
    const result = extractSvgData(testSvg, 'test-icon.svg', 'test');
    
    expect(result).toBeTruthy();
    const iconName = Object.keys(result)[0];
    const iconData = result[iconName];
    
    expect(iconName).toBe('test-icon-svg');
    expect(iconData.height).toBe(24);
    expect(iconData.width).toBe(24);
    expect(iconData.viewBox).toBe('0 0 24 24');
    expect(iconData.category).toBe('test');
    expect(iconData.isComplex).toBe(false);
    expect(iconData.path).toContain('M12 2');
    expect(iconData.tags).toEqual(['test', 'icon', 'svg']);
  });

  test('should handle complex SVGs with masks and filters', () => {
    const complexSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="mask0" maskUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#D9D9D9"/>
          </mask>
        </defs>
        <g mask="url(#mask0)">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
        </g>
      </svg>
    `;
    
    const result = extractSvgData(complexSvg, 'complex-test.svg', 'test');
    
    expect(result).toBeTruthy();
    const iconName = Object.keys(result)[0];
    const iconData = result[iconName];
    
    expect(iconName).toBe('complex-test-svg');
    expect(iconData.isComplex).toBe(true);
    expect(iconData).toHaveProperty('content');
    expect(iconData.content).toContain('mask');
    expect(iconData.content).toContain('path');
  });
});

describe('SVG Files', () => {
  test('should have SVG files in icons directory', () => {
    const iconsDir = path.join(__dirname, '..', 'icons');
    expect(fs.existsSync(iconsDir)).toBe(true);
    
    // Check recursively for SVG files
    function findSvgFiles(dir) {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findSvgFiles(fullPath));
        } else if (item.endsWith('.svg')) {
          files.push(fullPath);
        }
      }
      return files;
    }
    
    const svgFiles = findSvgFiles(iconsDir);
    expect(svgFiles.length).toBeGreaterThan(0);
  });

  test('SVG files should be valid', () => {
    const iconsDir = path.join(__dirname, '..', 'icons');
    
    function findSvgFiles(dir) {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findSvgFiles(fullPath));
        } else if (item.endsWith('.svg')) {
          files.push(fullPath);
        }
      }
      return files;
    }
    
    const svgFiles = findSvgFiles(iconsDir);

    svgFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Basic SVG validation
      expect(content).toContain('<svg');
      expect(content).toContain('</svg>');
      
      // Should have valid XML structure
      expect(content.split('<svg').length - 1).toBe(1); // Only one <svg tag
      expect(content.split('</svg>').length - 1).toBe(1); // Only one </svg tag
    });
  });

  test('should have valid category structure', () => {
    const iconsDir = path.join(__dirname, '..', 'icons');
    const items = fs.readdirSync(iconsDir);
    
    // Check that we have category directories
    const directories = items.filter(item => {
      const fullPath = path.join(iconsDir, item);
      return fs.statSync(fullPath).isDirectory();
    });
    
    expect(directories.length).toBeGreaterThan(0);
    
    // Check that each category has SVG files
    directories.forEach(dir => {
      const dirPath = path.join(iconsDir, dir);
      const files = fs.readdirSync(dirPath);
      const svgFiles = files.filter(file => file.endsWith('.svg'));
      expect(svgFiles.length).toBeGreaterThan(0);
    });
  });
});

describe('Package Structure', () => {
  test('should have required package.json fields', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    expect(packageJson).toHaveProperty('name');
    expect(packageJson).toHaveProperty('version');
    expect(packageJson).toHaveProperty('scripts');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test');
  });

  test('should have generated dist files after build', () => {
    const distDir = path.join(__dirname, '..', 'dist');
    
    if (fs.existsSync(distDir)) {
      const distFiles = fs.readdirSync(distDir);
      
      // Should have main files
      expect(distFiles).toContain('svg-data.json');
      
      // Should have Vue directory
      if (distFiles.includes('vue')) {
        const vueDir = path.join(distDir, 'vue');
        const vueFiles = fs.readdirSync(vueDir);
        expect(vueFiles).toContain('index.js');
        expect(vueFiles).toContain('index.d.ts');
        expect(vueFiles).toContain('package.json');
      }
    } else {
      console.warn('Dist directory not found, run build first');
    }
  });
}); 