# 📦 Using in your JavaScript Extension

## 🚀 Download and Integration

### Direct Download URLs

Once GitHub Actions has completed (in a few minutes), you can download the files from:

```bash
# Recommended main file (3.6KB)
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-simple.js

# Other options
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-data.js
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-helper.min.js
```

## 💻 Integration in your extension

### Option 1: Direct Inclusion

```html
<!DOCTYPE html>
<html>
<head>
    <title>My DataMa Extension</title>
</head>
<body>
    <!-- Your icons with data-datama attribute -->
    <button>
        <i data-datama="check-svg" data-size="16"></i>
        Validate
    </button>
    
    <div>
        <i data-datama="settings-svg" data-size="24" data-fill="#007acc"></i>
        <span>Settings</span>
    </div>

    <!-- Include the DataMa script -->
    <script src="path/to/datama-icons-simple.js"></script>
    
    <script>
        // Icons are automatically replaced!
        console.log('DataMa Icons loaded:', DataMaIcons.getIconNames().length, 'icons available');
    </script>
</body>
</html>
```

### Option 2: Manual JS Usage

```javascript
// Method 1: Get icons directly
const homeIcon = DataMaIcons.get('home-svg', {
    size: 24,
    fill: '#007acc'
});

// Method 2: Replace existing elements
const container = document.getElementById('my-container');
container.appendChild(homeIcon);

// Method 3: CSS-style insertion
const iconHtml = DataMaIcons.getHtml('settings-svg', {
    size: 20,
    fill: 'currentColor'
});
document.querySelector('.my-element').innerHTML = iconHtml;
```

## 🔧 Extension-specific Options

### For Power BI Extensions

```javascript
// Power BI compatible format
class MyPowerBIVisual {
    constructor(options) {
        // ... your initialization
        
        // Load DataMa Icons
        const toolbarElement = this.target.append('div')
            .classed('toolbar', true);
            
        // Add icons to toolbar
        ['settings-svg', 'refresh-svg', 'export-svg'].forEach(iconName => {
            const button = toolbarElement.append('div')
                .classed('toolbar-button', true)
                .on('click', () => this.handleAction(iconName));
                
            const icon = DataMaIcons.get(iconName, { size: 20 });
            button.node().appendChild(icon);
        });
    }
}
```

### For Tableau Extensions

```javascript
// Tableau extension integration
tableau.extensions.initializeAsync().then(() => {
    // Initialize UI with DataMa icons
    initializeUI();
});

function initializeUI() {
    const toolbar = document.getElementById('toolbar');
    
    // Create action buttons with icons
    const actions = [
        { name: 'analyze-svg', action: 'analyze', label: 'Analyze' },
        { name: 'settings-svg', action: 'configure', label: 'Configure' },
        { name: 'help-svg', action: 'help', label: 'Help' }
    ];
    
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-button';
        button.onclick = () => handleAction(action.action);
        
        const icon = DataMaIcons.get(action.name, { size: 18 });
        button.appendChild(icon);
        button.appendChild(document.createTextNode(action.label));
        
        toolbar.appendChild(button);
    });
}
```

### For Looker Studio Connectors

```javascript
// Looker Studio connector with DataMa icons
function getConfig() {
    const config = {
        configParams: [
            {
                type: 'INFO',
                name: 'intro',
                text: 'Configure your DataMa analysis'
            }
            // ... other config params
        ]
    };
    
    // Add visual icons to enhance UX
    document.addEventListener('DOMContentLoaded', () => {
        addIconsToConfig();
    });
    
    return config;
}

function addIconsToConfig() {
    // Add icons to configuration sections
    const sections = document.querySelectorAll('.config-section');
    sections.forEach((section, index) => {
        const iconNames = ['settings-svg', 'data-svg', 'chart-svg'];
        const icon = DataMaIcons.get(iconNames[index] || 'settings-svg', { 
            size: 16, 
            fill: '#4285f4' 
        });
        section.prepend(icon);
    });
}
```

## 🎨 Styling and Customization

### CSS Classes for Consistency

```css
/* Base icon styling */
.datama-icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
}

/* Size variants */
.datama-icon--small { /* 16px icons */ }
.datama-icon--medium { /* 24px icons */ }
.datama-icon--large { /* 32px icons */ }

/* Color themes */
.datama-icon--primary { fill: #007acc; }
.datama-icon--success { fill: #28a745; }
.datama-icon--warning { fill: #ffc107; }
.datama-icon--danger { fill: #dc3545; }

/* Interactive states */
.datama-icon:hover {
    opacity: 0.7;
    transition: opacity 0.2s;
}
```

### Dynamic Color Adaptation

```javascript
// Function to adapt icon colors to current theme
function adaptIconsToTheme(theme) {
    const colorMap = {
        light: '#333333',
        dark: '#ffffff',
        blue: '#007acc',
        purple: '#6f42c1'
    };
    
    const fill = colorMap[theme] || '#333333';
    
    // Update all simple icons with new color
    document.querySelectorAll('.datama-icon[data-type="simple"]').forEach(iconEl => {
        const iconName = iconEl.dataset.icon;
        const newIcon = DataMaIcons.get(iconName, { 
            size: iconEl.dataset.size || 24,
            fill: fill 
        });
        iconEl.replaceWith(newIcon);
    });
}
```

## 📊 Performance Considerations

### Lazy Loading for Large Extensions

```javascript
// Load icons only when needed
class IconManager {
    constructor() {
        this.loadedIcons = new Set();
        this.iconCache = new Map();
    }
    
    async getIcon(iconName, options = {}) {
        const cacheKey = `${iconName}-${JSON.stringify(options)}`;
        
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }
        
        const icon = DataMaIcons.get(iconName, options);
        this.iconCache.set(cacheKey, icon);
        this.loadedIcons.add(iconName);
        
        return icon;
    }
    
    preloadIcons(iconNames) {
        iconNames.forEach(name => {
            this.getIcon(name, { size: 24 });
        });
    }
}

// Usage
const iconManager = new IconManager();
iconManager.preloadIcons(['settings-svg', 'home-svg', 'chart-svg']);
```

### Bundle Size Optimization

```javascript
// Only load icons you actually use
const REQUIRED_ICONS = [
    'settings-svg',
    'chart-svg', 
    'export-svg',
    'refresh-svg'
];

// Validate that all required icons are available
function validateRequiredIcons() {
    const availableIcons = DataMaIcons.getIconNames();
    const missingIcons = REQUIRED_ICONS.filter(icon => 
        !availableIcons.includes(icon)
    );
    
    if (missingIcons.length > 0) {
        console.warn('Missing required icons:', missingIcons);
    }
    
    return missingIcons.length === 0;
}
```

## 🐛 Debugging and Troubleshooting

### Debug Mode

```javascript
// Enable debug mode to see icon loading details
DataMaIcons.debug = true;

// Test icon loading
console.log('Available icons:', DataMaIcons.getIconNames());
console.log('Icon count:', DataMaIcons.getIconNames().length);

// Test specific icon
const testIcon = DataMaIcons.get('settings-svg', { size: 24 });
console.log('Test icon created:', testIcon ? 'Success' : 'Failed');
```

### Error Handling

```javascript
function safeGetIcon(iconName, options = {}, fallback = null) {
    try {
        return DataMaIcons.get(iconName, options);
    } catch (error) {
        console.warn(`Failed to load icon ${iconName}:`, error);
        
        if (fallback) {
            return safeGetIcon(fallback, options);
        }
        
        // Return a simple placeholder
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: ${options.size || 24}px;
            height: ${options.size || 24}px;
            background: #f0f0f0;
            border: 1px dashed #ccc;
            display: inline-block;
        `;
        return placeholder;
    }
}

// Usage with fallback
const icon = safeGetIcon('non-existent-svg', { size: 20 }, 'settings-svg');
```

## 📋 Icon Reference Quick Guide

### Most Common Icons for Extensions

```javascript
// UI Controls
'settings-svg'      // Configuration
'home-svg'          // Home/Dashboard
'search-svg'        // Search functionality
'filter-svg'        // Data filtering
'refresh-svg'       // Reload/Update
'export-svg'        // Export data

// Actions
'edit-svg'          // Edit mode
'save-svg'          // Save changes
'delete-svg'        // Delete items
'add-svg'           // Add new items
'copy-svg'          // Copy to clipboard
'download-svg'      // Download file

// Navigation
'arrow-left-svg'    // Back navigation
'arrow-right-svg'   // Forward navigation
'chevron-up-svg'    // Expand/Collapse
'chevron-down-svg'  // Expand/Collapse

// Status/Feedback
'check-svg'         // Success state
'x-svg'             // Error/Close
'alert-circle-svg'  // Warning
'help-circle-svg'   // Help/Info
```

## 🔄 Version Compatibility

### Checking Library Version

```javascript
// Check if the library supports features you need
if (DataMaIcons.version && DataMaIcons.version >= '1.1.0') {
    // Use newer features like forceComplexColor
    const icon = DataMaIcons.get('logo-svg', { 
        fill: '#007acc',
        forceComplexColor: true 
    });
} else {
    // Fallback for older versions
    const icon = DataMaIcons.get('logo-svg', { size: 24 });
}
```

### Future-Proof Integration

```javascript
// Defensive coding for library updates
function createDataMaIcon(iconName, options = {}) {
    // Check if DataMaIcons is available
    if (typeof DataMaIcons === 'undefined') {
        console.error('DataMa Icons library not loaded');
        return null;
    }
    
    // Check if icon exists
    if (!DataMaIcons.getIconNames().includes(iconName)) {
        console.warn(`Icon ${iconName} not found in library`);
        return null;
    }
    
    // Create icon with error handling
    try {
        return DataMaIcons.get(iconName, options);
    } catch (error) {
        console.error(`Error creating icon ${iconName}:`, error);
        return null;
    }
}
```

This completes the integration guide for using DataMa Icons in your JavaScript extensions! 