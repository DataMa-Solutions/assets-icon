# 🔧 DataMa Icons - Light Project Integration Guide

Complete guide to integrate DataMa icons in the `light/` project and dataviz extensions (Looker Studio, Power BI, Tableau, Qlik).

## 🎯 Overview

The `light/` project uses a **self-hosted** approach without external dependencies to ensure compatibility with all dataviz platforms.

### Architecture

```
light/
├── src/
│   ├── resources/
│   │   └── components/
│   │       ├── DataMaIcons.js          # Old version (maintained)
│   │       └── DataMaIconsNew.esm.js   # New version (recommended for ES6 modules)
│   └── assets/
│       └── icons/
│           └── icons.json              # Icon data (optional)
```

## 🚀 Quick Start

### 1. Import in your components

```javascript
// ✅ Recommended: New version (ES6 module)
import { DataMaIconsNew } from "./DataMaIconsNew.esm.js";

// ✅ Compatible: Old version (maintained for compatibility)
// import { DataMaIcons } from "./DataMaIcons.js";

// Usage with new API
const icon = DataMaIconsNew.get('cog-svg', { 
    size: 24, 
    fill: '#28a745' 
});
```

### 2. Parallel Usage with Import Aliases

```javascript
// Import both versions with aliases for parallel usage
import { DataMaIcons as DataMaIconsOld } from "./DataMaIcons.js";
import { DataMaIconsNew } from "./DataMaIconsNew.esm.js";

// Use old version for existing code
const oldIcon = DataMaIconsOld.get('home-svg', { size: 24 });

// Use new version for new features  
const newIcon = DataMaIconsNew.get('home-svg', { size: 24 });

// Both APIs are compatible - seamless transition
console.log('Old API compatible:', typeof DataMaIconsOld.get === 'function');
console.log('New API compatible:', typeof DataMaIconsNew.get === 'function');

// Gradual migration: switch to new version
const DataMaIcons = DataMaIconsNew; // Use new version (recommended)
// const DataMaIcons = DataMaIconsOld; // Keep old version
```

### 3. DOM Integration

```javascript
// Create and add an icon with new API
const checkIcon = DataMaIconsNew.get('check-svg', { 
    size: 24, 
    fill: '#28a745',
    className: 'my-check-icon'
});

document.getElementById('container').appendChild(checkIcon);

// Or replace existing elements
const elements = document.querySelectorAll('[data-datama]');
DataMaIconsNew.replace();
```

## 🎨 Usage Patterns

### Basic Icon Usage

```javascript
// Simple icon
const homeIcon = DataMaIconsNew.get('home-svg');
document.body.appendChild(homeIcon);

// With properties
const settingsIcon = DataMaIconsNew.get('cog-svg', {
    size: 32,
    fill: '#007acc',
    stroke: '#333',
    strokeWidth: 1
});

// With class name for styling
const userIcon = DataMaIconsNew.get('profile-svg', {
    className: 'user-profile-icon',
    size: 20,
    fill: 'currentColor'
});
```

### Navigation Icons

```javascript
// Navigation icons
const navIcons = {
    home: DataMaIconsNew.get('home-svg', { size: 20 }),
    settings: DataMaIconsNew.get('settings-svg', { size: 20 }),
    profile: DataMaIconsNew.get('user-svg', { size: 20 }),
    logout: DataMaIconsNew.get('log-out-svg', { size: 20 })
};

// Add to navigation
Object.values(navIcons).forEach(icon => {
    navContainer.appendChild(icon);
});
```

### Action Icons

```javascript
// Action icons for buttons
const actionIcons = {
    add: DataMaIconsNew.get('plus-svg', { size: 16 }),
    edit: DataMaIconsNew.get('edit-svg', { size: 16 }),
    delete: DataMaIconsNew.get('trash-svg', { size: 16 }),
    download: DataMaIconsNew.get('download-svg', { size: 16 }),
    upload: DataMaIconsNew.get('upload-svg', { size: 16 })
};

// Create buttons with icons
function createActionButton(iconName, text, onClick) {
    const button = document.createElement('button');
    const icon = actionIcons[iconName];
    
    button.appendChild(icon);
    button.appendChild(document.createTextNode(text));
    button.addEventListener('click', onClick);
    
    return button;
}
```

### Status Icons

```javascript
// Status icons with colors
const statusIcons = {
    success: DataMaIconsNew.get('check-svg', { 
        size: 24, 
        fill: '#28a745' 
    }),
    warning: DataMaIconsNew.get('alert-triangle-svg', { 
        size: 24, 
        fill: '#ffc107' 
    }),
    error: DataMaIconsNew.get('alert-circle-svg', { 
        size: 24, 
        fill: '#dc3545' 
    }),
    info: DataMaIconsNew.get('info-svg', { 
        size: 24, 
        fill: '#17a2b8' 
    })
};

// Show appropriate status
function showStatus(status) {
    const statusContainer = document.getElementById('status');
    statusContainer.innerHTML = '';
    statusContainer.appendChild(statusIcons[status]);
}
```

## 🔧 Advanced Usage

### Icon Replacement System

```javascript
// Automatically replace all elements with data-datama
document.addEventListener('DOMContentLoaded', () => {
    DataMaIconsNew.replace();
});

// Or with global options
DataMaIconsNew.replace({
    size: 24,
    fill: 'currentColor'
});
```

### Dynamic Icon Creation

```javascript
// Create icons dynamically
function createIcon(iconName, options = {}) {
    const defaultOptions = {
        size: 24,
        fill: 'currentColor',
        stroke: 'none',
        strokeWidth: 0
    };
    
    return DataMaIconsNew.get(iconName, { ...defaultOptions, ...options });
}

// Usage
const icons = [
    createIcon('home-svg', { size: 20 }),
    createIcon('settings-svg', { size: 20, fill: '#007acc' }),
    createIcon('user-svg', { size: 20, fill: '#28a745' })
];
```

### Icon Search and Discovery

```javascript
// Get all available icon names
const allIconNames = DataMaIconsNew.getIconNames();
console.log('Available icons:', allIconNames);

// Search by tag
const searchResults = DataMaIconsNew.searchByTag('navigation');
console.log('Navigation icons:', searchResults);

// Get icon data
const iconData = DataMaIconsNew.getIconData('check-svg');
console.log('Icon data:', iconData);
```

## 📊 Dataviz Platform Compatibility

### Looker Studio

```javascript
// Compatible with Looker Studio restrictions
const icon = DataMaIconsNew.get('chart-svg', { 
    size: 32,
    fill: '#4285f4'  // Google color
});

// Add to Looker Studio container
google.script.run.withSuccessHandler(function(result) {
    const container = document.getElementById('chart-container');
    container.appendChild(icon);
});
```

### Power BI

```javascript
// Compatible with Power BI restrictions
const icon = DataMaIconsNew.get('data-svg', { 
    size: 24,
    fill: '#f2c811'  // Power BI color
});

// Integration in Power BI visual
powerbi.extensibility.visual.createVisual((options) => {
    const container = options.element;
    container.appendChild(icon);
});
```

### Tableau

```javascript
// Compatible with Tableau restrictions
const icon = DataMaIconsNew.get('analytics-svg', { 
    size: 20,
    fill: '#e8743b'  // Tableau color
});

// Integration in Tableau extension
window.tableau.extensions.initializeAsync().then(() => {
    const container = document.getElementById('tableau-container');
    container.appendChild(icon);
});
```

### Qlik

```javascript
// Compatible with Qlik restrictions
const icon = DataMaIconsNew.get('dashboard-svg', { 
    size: 28,
    fill: '#007acc'  // Qlik color
});

// Integration in Qlik extension
qlik.setOnData((data) => {
    const container = document.getElementById('qlik-container');
    container.appendChild(icon);
});
```

## 🎨 Styling and Customization

### CSS Integration

```css
/* Base styles for icons */
.datama-icon {
    display: inline-block;
    vertical-align: middle;
    transition: all 0.2s ease;
}

/* Icons in buttons */
.btn .datama-icon {
    margin-right: 6px;
    vertical-align: text-bottom;
}

/* Navigation icons */
.nav-icon {
    width: 20px;
    height: 20px;
    margin: 0 8px;
}

/* Icons with hover effects */
.icon-hover:hover {
    transform: scale(1.1);
    opacity: 0.8;
}

/* Icons with badges */
.icon-with-badge {
    position: relative;
}

.icon-with-badge::after {
    content: attr(data-count);
    position: absolute;
    top: -8px;
    right: -8px;
    background: red;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### JavaScript Styling

```javascript
// Apply styles programmatically
function styleIcon(icon, options = {}) {
    const {
        size = 24,
        color = 'currentColor',
        hoverColor = null,
        className = ''
    } = options;
    
    // Apply properties
    icon.style.width = `${size}px`;
    icon.style.height = `${size}px`;
    icon.style.color = color;
    
    if (className) {
        icon.classList.add(className);
    }
    
    // Add hover effect if specified
    if (hoverColor) {
        icon.addEventListener('mouseenter', () => {
            icon.style.color = hoverColor;
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.color = color;
        });
    }
    
    return icon;
}

// Usage
const styledIcon = styleIcon(
    DataMaIconsNew.get('settings-svg'),
    {
        size: 32,
        color: '#007acc',
        hoverColor: '#0056b3',
        className: 'settings-icon'
    }
);
```

## 🔄 Migration Strategy

### Phase 1: Test Parallel Usage

```javascript
// Import both versions with aliases
import { DataMaIcons as DataMaIconsOld } from "./DataMaIcons.js";
import { DataMaIcons as DataMaIconsNew } from "./DataMaIconsNew.js";

// Test compatibility
const oldIcon = DataMaIconsOld.get('check-svg', { size: 24 });
const newIcon = DataMaIconsNew.get('check-svg', { size: 24 });

// Verify APIs are identical
console.log('APIs compatible:', 
    typeof DataMaIconsOld.get === typeof DataMaIconsNew.get
);
```

### Phase 2: Gradual Migration

```javascript
// Gradually change imports
// In each file, replace:
// import { DataMaIcons } from "./DataMaIcons.js";
// with:
import { DataMaIconsNew } from "./DataMaIconsNew.esm.js";

// Usage with new API (note the different variable name)
const icon = DataMaIconsNew.get('home-svg', { size: 24 });
```

### Phase 3: Cleanup

```javascript
// Once migration is complete, remove old file
// and keep only:
import { DataMaIconsNew } from "./DataMaIconsNew.esm.js";

// Note: The new API uses DataMaIconsNew (not DataMaIcons)
const icon = DataMaIconsNew.get('home-svg', { size: 24 });
```

## 🚀 Performance Optimization

### Icon Caching

```javascript
// Cache frequently used icons
const iconCache = new Map();

function getCachedIcon(iconName, options = {}) {
    const cacheKey = `${iconName}-${JSON.stringify(options)}`;
    
    if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey).cloneNode(true);
    }
    
    const icon = DataMaIconsNew.get(iconName, options);
    iconCache.set(cacheKey, icon);
    
    return icon.cloneNode(true);
}

// Usage
const checkIcon1 = getCachedIcon('check-svg', { size: 24 });
const checkIcon2 = getCachedIcon('check-svg', { size: 24 }); // From cache
```

### Lazy Loading

```javascript
// Load icons only when needed
function lazyLoadIcon(iconName, container, options = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const icon = DataMaIconsNew.get(iconName, options);
                entry.target.appendChild(icon);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(container);
}

// Usage
lazyLoadIcon('chart-svg', document.getElementById('chart-container'), {
    size: 32,
    fill: '#007acc'
});
```

## 🐛 Troubleshooting

### Common Issues

**Icon not displaying:**
```javascript
// Check if DataMaIconsNew is loaded
if (typeof DataMaIconsNew !== 'undefined') {
    console.log('✅ DataMaIconsNew loaded');
} else {
    console.error('❌ DataMaIconsNew not loaded');
}

// Check icon name
const availableIcons = DataMaIconsNew.getIconNames();
console.log('Available icons:', availableIcons);
```

**Size issue:**
```javascript
// Force size with CSS
const icon = DataMaIconsNew.get('check-svg', { size: 24 });
icon.style.width = '32px';
icon.style.height = '32px';
```

**Color issue:**
```javascript
// Force color with CSS
const icon = DataMaIconsNew.get('check-svg');
icon.style.fill = '#28a745';
icon.style.color = '#28a745';
```

### Debug Mode

```javascript
// Get detailed information
const iconData = DataMaIconsNew.getIconData('check-svg');
console.log('Icon details:', iconData);

// List all available methods
console.log('Available methods:', Object.keys(DataMaIconsNew));
```

## 📚 Complete Example

### Component Integration

```javascript
// data-ma-icon-component.js
export class DataMaIconComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 24,
            fill: 'currentColor',
            stroke: 'none',
            strokeWidth: 0,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Load DataMaIconsNew if not already done
        if (typeof DataMaIconsNew === 'undefined') {
            this.loadDataMaIconsNew();
        } else {
            this.setupIcon();
        }
    }
    
    loadDataMaIconsNew() {
        // Load dynamically if needed
        const script = document.createElement('script');
        script.src = './DataMaIconsNew.js'; // Vanilla JS version for dynamic loading
        script.onload = () => this.setupIcon();
        document.head.appendChild(script);
    }
    
    setupIcon() {
        const { iconName, ...iconOptions } = this.options;
        
        if (!iconName) {
            console.error('Icon name is required');
            return;
        }
        
        const icon = DataMaIconsNew.get(iconName, {
            size: this.options.size,
            fill: this.options.fill,
            stroke: this.options.stroke,
            strokeWidth: this.options.strokeWidth,
            ...iconOptions
        });
        
        this.container.innerHTML = '';
        this.container.appendChild(icon);
    }
    
    updateIcon(iconName, newOptions = {}) {
        this.options = { ...this.options, iconName, ...newOptions };
        this.setupIcon();
    }
    
    setSize(size) {
        this.updateIcon(this.options.iconName, { size });
    }
    
    setColor(color) {
        this.updateIcon(this.options.iconName, { fill: color });
    }
}

// Usage
const iconContainer = document.getElementById('my-icon');
const iconComponent = new DataMaIconComponent(iconContainer, {
    iconName: 'check-svg',
    size: 32,
    fill: '#28a745'
});

// Update dynamically
iconComponent.setSize(48);
iconComponent.setColor('#007acc');
```

---

## 📞 Support

- **Complete documentation** : [README.md](../README.md)
- **Migration guide** : [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)
- **Build process** : [scripts/build.js](../scripts/build.js)

---

*DataMa Icons - Light Project Integration Guide v1.0.1* 