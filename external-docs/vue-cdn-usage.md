# 🌟 DataMa Icons - Vue.js CDN Usage Guide

Complete guide to integrate DataMa icons in your Vue.js projects via CDN.

## 🚀 Quick Start

### 1. Include CDN Script

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Production CDN -->
    <script src="https://ressources.datama.io/assets/js/icons/latest/datama-icons-cdn.js"></script>
    
    <!-- Or Staging CDN for testing -->
    <script src="https://ressources2.datama.io/assets/js/icons/latest/datama-icons-cdn.js"></script>
</head>
<body>
    <!-- Your icons here -->
</body>
</html>
```

### 2. Use Font Awesome Style

```html
<!-- Simple icon -->
<i class="datama-icon" data-icon="check-svg"></i>

<!-- With custom size -->
<i class="datama-icon" data-icon="home-svg" data-size="32"></i>

<!-- With custom color -->
<i class="datama-icon" data-icon="download-svg" data-fill="#007acc"></i>

<!-- Combination -->
<i class="datama-icon" data-icon="settings-svg" data-size="24" data-fill="#28a745"></i>
```

## 🎯 Vue.js Integration

### Vue 2 Component

```vue
<template>
  <div>
    <!-- Navigation icons -->
    <nav>
      <i class="datama-icon" data-icon="home-svg" data-size="20"></i>
      <i class="datama-icon" data-icon="settings-svg" data-size="20"></i>
      <i class="datama-icon" data-icon="user-svg" data-size="20"></i>
    </nav>
    
    <!-- Action icons -->
    <div class="actions">
      <button>
        <i class="datama-icon" data-icon="plus-svg" data-size="16"></i>
        Add
      </button>
      <button>
        <i class="datama-icon" data-icon="edit-svg" data-size="16"></i>
        Edit
      </button>
    </div>
    
    <!-- Icons with dynamic colors -->
    <div class="status">
      <i class="datama-icon" data-icon="check-svg" data-size="24" data-fill="green"></i>
      <i class="datama-icon" data-icon="alert-triangle-svg" data-size="24" data-fill="orange"></i>
      <i class="datama-icon" data-icon="x-svg" data-size="24" data-fill="red"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  mounted() {
    // Icons are automatically processed
    console.log('DataMa Icons loaded');
  }
}
</script>

<style scoped>
.datama-icon {
  vertical-align: middle;
  margin-right: 4px;
}

.actions button {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

### Vue 3 Composition API

```vue
<template>
  <div>
    <!-- Reactive icons -->
    <div class="toolbar">
      <i 
        class="datama-icon" 
        :data-icon="currentIcon" 
        :data-size="iconSize"
        :data-fill="iconColor"
      ></i>
    </div>
    
    <!-- Conditional icons -->
    <div class="status-indicators">
      <i 
        v-if="isLoading"
        class="datama-icon" 
        data-icon="loading-svg" 
        data-size="16"
        data-fill="#007acc"
      ></i>
      <i 
        v-else-if="isSuccess"
        class="datama-icon" 
        data-icon="check-svg" 
        data-size="16"
        data-fill="#28a745"
      ></i>
      <i 
        v-else-if="isError"
        class="datama-icon" 
        data-icon="alert-circle-svg" 
        data-size="16"
        data-fill="#dc3545"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)

const currentIcon = ref('home-svg')
const iconSize = ref(24)
const iconColor = ref('#333')

// Function to change icon
const changeIcon = (iconName) => {
  currentIcon.value = iconName
}
</script>
```

## 🎨 Advanced Usage

### Dynamic Icons with JavaScript

```javascript
// Add icon dynamically
function addIcon(iconName, size = 24, color = '#333') {
  const icon = document.createElement('i')
  icon.className = 'datama-icon'
  icon.setAttribute('data-icon', iconName)
  icon.setAttribute('data-size', size)
  icon.setAttribute('data-fill', color)
  
  document.getElementById('container').appendChild(icon)
}

// Usage examples
addIcon('check-svg', 32, '#28a745')
addIcon('download-svg', 24, '#007acc')
addIcon('settings-svg', 20, '#6c757d')
```

### CSS Customization

```css
/* Custom styles for icons */
.datama-icon {
  transition: all 0.2s ease;
  cursor: pointer;
}

.datama-icon:hover {
  transform: scale(1.1);
  opacity: 0.8;
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

## 📋 Available Icons

### Navigation Icons
- `chevron-left-svg`, `chevron-right-svg`, `chevron-up-svg`, `chevron-down-svg`
- `arrow-left-svg`, `arrow-right-svg`, `arrow-top-svg`, `arrow-bottom-svg`
- `drop-down-svg`, `drop-up-svg`, `drop-left-svg`, `drop-right-svg`

### Action Icons
- `plus-svg`, `minus-svg`, `check-svg`, `x-svg`
- `edit-svg`, `delete-svg`, `save-svg`, `download-svg`
- `upload-svg`, `copy-svg`, `share-svg`, `search-svg`

### UI Icons
- `settings-svg`, `cog-svg`, `filter-svg`, `sort-svg`
- `eye-svg`, `lock-svg`, `unlock-svg`, `key-svg`
- `user-svg`, `profile-svg`, `group-svg`, `team-svg`

### Status Icons
- `check-svg`, `alert-circle-svg`, `alert-triangle-svg`
- `info-svg`, `help-svg`, `warning-svg`
- `success-svg`, `error-svg`, `pending-svg`

### Data Icons
- `data-svg`, `chart-svg`, `graph-svg`, `analytics-svg`
- `table-svg`, `list-svg`, `grid-svg`, `dashboard-svg`
- `export-svg`, `import-svg`, `sync-svg`

## 🔧 Configuration

### CDN URLs

| Environment | URL | Usage |
|-------------|-----|-------|
| **Production** | `https://ressources.datama.io/assets/js/icons/latest/` | Production applications |
| **Staging** | `https://ressources2.datama.io/assets/js/icons/latest/` | Testing and development |
| **Versioned** | `https://ressources.datama.io/assets/js/icons/releases/1.0.1/` | Specific versions |

### Attributes Support

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-icon` | String | Required | Icon name (e.g., "check-svg") |
| `data-size` | Number | 24 | Size in pixels |
| `data-fill` | String | "currentColor" | Fill color |
| `data-stroke` | String | "none" | Stroke color |
| `data-stroke-width` | Number | 0 | Stroke width |
| `data-width` | Number | Auto | Custom width |
| `data-height` | Number | Auto | Custom height |

## 🚀 Performance Tips

### 1. Use Specific Versions for Production
```html
<!-- Instead of "latest", use a specific version -->
<script src="https://ressources.datama.io/assets/js/icons/releases/1.0.1/datama-icons-cdn.js"></script>
```

### 2. Preload Critical Icons
```html
<head>
  <!-- Preload for critical icons -->
  <link rel="preload" href="https://ressources.datama.io/assets/js/icons/latest/datama-icons-cdn.js" as="script">
</head>
```

### 3. Lazy Load for Large Lists
```javascript
// For lists with many icons
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('datama-icon')
      entry.target.setAttribute('data-icon', entry.target.dataset.iconName)
    }
  })
})

document.querySelectorAll('[data-icon-name]').forEach(el => {
  observer.observe(el)
})
```

## 🐛 Troubleshooting

### Common Issues

**Icon not displaying:**
```javascript
// Check if script is loaded
if (typeof window.DataMaPicto !== 'undefined') {
  console.log('✅ DataMa Icons loaded')
} else {
  console.error('❌ DataMa Icons not loaded')
}
```

**Wrong icon name:**
```javascript
// Check available names
console.log('Available icons:', window.DataMaPicto?.getIconNames?.())
```

**CORS issue:**
```html
<!-- Use staging version for local testing -->
<script src="https://ressources2.datama.io/assets/js/icons/latest/datama-icons-cdn.js"></script>
```

### Debug Mode

```javascript
// Enable debug mode
if (window.DataMaPicto) {
  window.DataMaPicto.debug = true
  console.log('Debug mode enabled')
}
```

## 📚 Examples

### Complete Vue Component

```vue
<template>
  <div class="icon-demo">
    <h2>DataMa Icons Demo</h2>
    
    <!-- Navigation -->
    <nav class="demo-nav">
      <a href="#" class="nav-item">
        <i class="datama-icon" data-icon="home-svg" data-size="20"></i>
        Home
      </a>
      <a href="#" class="nav-item">
        <i class="datama-icon" data-icon="settings-svg" data-size="20"></i>
        Settings
      </a>
      <a href="#" class="nav-item">
        <i class="datama-icon" data-icon="user-svg" data-size="20"></i>
        Profile
      </a>
    </nav>
    
    <!-- Actions -->
    <div class="demo-actions">
      <button class="btn btn-primary">
        <i class="datama-icon" data-icon="plus-svg" data-size="16"></i>
        Add
      </button>
      <button class="btn btn-secondary">
        <i class="datama-icon" data-icon="edit-svg" data-size="16"></i>
        Edit
      </button>
      <button class="btn btn-danger">
        <i class="datama-icon" data-icon="trash-svg" data-size="16"></i>
        Delete
      </button>
    </div>
    
    <!-- Status -->
    <div class="demo-status">
      <div class="status-item success">
        <i class="datama-icon" data-icon="check-svg" data-size="24" data-fill="#28a745"></i>
        Success
      </div>
      <div class="status-item warning">
        <i class="datama-icon" data-icon="alert-triangle-svg" data-size="24" data-fill="#ffc107"></i>
        Warning
      </div>
      <div class="status-item error">
        <i class="datama-icon" data-icon="alert-circle-svg" data-size="24" data-fill="#dc3545"></i>
        Error
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconDemo',
  mounted() {
    console.log('Icon demo loaded')
  }
}
</script>

<style scoped>
.icon-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.demo-nav {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: #e9ecef;
}

.demo-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.demo-status {
  display: flex;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
}

.datama-icon {
  transition: transform 0.2s;
}

.datama-icon:hover {
  transform: scale(1.1);
}
</style>
```

---

## 📞 Support

- **Complete documentation** : [README.md](../README.md)
- **Online examples** : [example.html](../example.html)
- **Interactive tests** : [test-complex-icons.html](../test-complex-icons.html)
- **Migration guide** : [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)

---

*DataMa Icons - Vue.js CDN Usage Guide v1.0.1* 