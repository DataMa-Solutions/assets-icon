# DataMa Icons - Color Management Examples

Quick guide with practical examples for using colors in DataMa Icons.

## 🎯 Common Use Cases

### 1. Simple Icons (Recommended)
```javascript
// ✅ User interface icons
DataMaPicto.get('check-svg', { fill: '#28a745' })      // Green validation
DataMaPicto.get('x-svg', { fill: '#dc3545' })          // Red close
DataMaPicto.get('download-svg', { fill: '#007acc' })   // Blue action

// ✅ Navigation icons
DataMaPicto.get('arrow-left-svg', { fill: '#6c757d' }) // Gray navigation
DataMaPicto.get('chevron-down-svg', { fill: 'currentColor' }) // Inherits from parent
```

### 2. Complex Icons (Original)
```javascript
// ✅ Logos and illustrations (keep original colors)
DataMaPicto.get('datama-svg')                          // DataMa logo
DataMaPicto.get('illustration-data-svg')               // Complex illustration
DataMaPicto.get('logo-tableau-svg')                    // Partner logo
```

### 3. Complex Icons with Forced Color
```javascript
// ⚠️ Use sparingly - may break design
DataMaPicto.get('settings-svg', { 
  fill: '#ffc107', 
  forceComplexColor: true 
});

// ⚠️ Example: uniform dark theme
DataMaPicto.get('profile-svg', { 
  fill: '#ffffff', 
  forceComplexColor: true 
});
```

## 🎨 Examples by Context

### User Interface
```javascript
// Toolbar
const toolbar = [
  DataMaPicto.get('save-svg', { fill: '#28a745', size: 20 }),
  DataMaPicto.get('edit-svg', { fill: '#007acc', size: 20 }),
  DataMaPicto.get('trash-2-svg', { fill: '#dc3545', size: 20 })
];

// Status indicators
const statusIcons = {
  success: DataMaPicto.get('check-svg', { fill: '#28a745' }),
  warning: DataMaPicto.get('alert-triangle-svg', { fill: '#ffc107' }),
  error: DataMaPicto.get('alert-circle-svg', { fill: '#dc3545' }),
  info: DataMaPicto.get('help-circle-svg', { fill: '#17a2b8' })
};
```

### Dashboard Theme
```javascript
// Light theme
const lightTheme = {
  primary: '#007acc',
  secondary: '#6c757d',
  background: '#ffffff'
};

// Dark theme
const darkTheme = {
  primary: '#66b3ff',
  secondary: '#adb5bd',
  background: '#212529'
};

// Apply theme colors
DataMaPicto.get('datama-svg', { size: 32 }); // Keep original
DataMaPicto.get('gauge-svg', { fill: lightTheme.primary });
```

### Brand Context
```javascript
// Company branding
DataMaPicto.get('datama-svg', { size: 48 }); // Always original colors

// Partner logos
DataMaPicto.get('logo-tableau-svg', { size: 32 }); // Original colors
DataMaPicto.get('logo-power-bi-svg', { size: 32 }); // Original colors

// Generic actions with brand colors
DataMaPicto.get('download-svg', { fill: '#007acc', size: 24 });
```

## 🧪 Testing and Debugging

### Testing Colors
```javascript
// Test if icon accepts colors well
const testIcon = (iconName, color = '#007acc') => {
  const simple = DataMaPicto.get(iconName, { fill: color });
  const forced = DataMaPicto.get(iconName, { 
    fill: color, 
    forceComplexColor: true 
  });
  
  console.log(`${iconName}:`, { simple, forced });
};

// Test multiple icons
['check-svg', 'datama-svg', 'settings-svg'].forEach(icon => {
  testIcon(icon, '#ff6b6b');
});
```

### Debug Mode
```javascript
// Enable debug logging
DataMaPicto.debug = true;

// Test icon creation
const icon = DataMaPicto.get('complex-icon-svg', { 
  fill: '#007acc',
  forceComplexColor: true 
});
// Console will show: "Complex icon, force color applied: complex-icon-svg"
```

## 📋 Quick Reference

### When to Use Each Approach

| Context | Icon Type | Method | Example |
|---------|-----------|--------|---------|
| UI Elements | Simple | Auto-color | `check-svg`, `x-svg` |
| Branding | Complex | Original | `datama-svg`, `logo-*` |
| Illustrations | Complex | Original | `illustration-*` |
| Dark Theme | Mixed | Selective force | Use `forceComplexColor` |
| Monochrome | Simple | Auto-color | All UI icons |

### Color Values
```javascript
// CSS color names
{ fill: 'red' }
{ fill: 'currentColor' }

// Hex values
{ fill: '#007acc' }
{ fill: '#28a745' }

// RGB/RGBA
{ fill: 'rgb(0, 122, 204)' }
{ fill: 'rgba(0, 122, 204, 0.8)' }

// CSS variables
{ fill: 'var(--primary-color)' }
```

## ⚠️ Best Practices

### ✅ Do
- Use simple icons for UI elements that need color changes
- Keep complex icons (logos, illustrations) with original colors
- Test color changes before deploying
- Use consistent color schemes across your app
- Consider accessibility and contrast ratios

### ❌ Don't
- Force colors on brand logos without approval
- Use `forceComplexColor` as default behavior
- Override colors on illustrations without testing
- Ignore the visual impact of color changes
- Mix different color schemes inconsistently

### 🎯 Pro Tips
- Use `currentColor` to inherit text color
- Test icons in both light and dark themes
- Keep a color palette consistent across icons
- Use semantic colors (green = success, red = error)
- Document your color choices for team consistency 