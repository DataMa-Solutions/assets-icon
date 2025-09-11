# Changelog - DataMa Icons

## [1.0.6] - 2025-01-XX

### ✨ Nouvelles fonctionnalités
- **Mode invert pour les icônes**: Nouvelle option pour inverser les couleurs des icônes (fix: upgraded invert mode)
- **Nouvelles icônes**: Ajout de 4 nouvelles icônes pour les bases de données (csv-outline, csv-outline-2, excel-outline, excel-outline-2, mariadb, mysql, openai, postgresql)

### 🎨 Améliorations des icônes
- **Refonte upload**: Amélioration des icônes `upload-svg` et `upload-1-svg` pour une meilleure cohérence visuelle
- **Refonte journey**: Redesign complet de l'icône `journey-svg` pour une meilleure lisibilité
- **Correction Redshift**: Amélioration de l'icône `redshift-svg`

### 🛠️ Améliorations techniques
- **Suppression des backgrounds**: Nettoyage des arrière-plans parasites sur certaines icônes
- **Correction d'erreurs console**: Résolution de plusieurs erreurs JavaScript dans le traitement des icônes
- **Amélioration du script de build**: Optimisation du processus de génération

### 📊 Statistiques
- **150 icônes** organisées en **8 catégories** (mise à jour du chiffre)
- Support complet du mode invert
- Nouvelles icônes de bases de données

### 🔄 Commits inclus
- `feat:` Mode invert pour les icônes
- `feat:` Ajout de 4 nouvelles icônes et amélioration de redshift
- `feat:` Ajout de nouvelles icônes et amélioration du script de build
- `fix:` Amélioration du mode invert
- `fix:` Suppression des backgrounds parasites
- `fix:` Correction des icônes non fonctionnelles
- `fix:` Résolution d'erreurs console
- `fix:` Correction de l'icône journey
- `fix:` Correction de l'icône redshift

### 🔄 Compatibilité
- Aucune rupture de compatibilité - l'API reste identique
- Nouvelles options disponibles sans impact sur l'existant

---

## [1.0.5] - 2025-01-27

### ✨ Nouvelles fonctionnalités
- **Gestion unifiée des couleurs de fill**: Simplification de la logique de coloration des icônes
- **Remplacement des gradients par fill**: Les références `url(#gradient)` sont maintenant remplacées par la couleur de fill personnalisée
- **Logique à deux états**: Soit on applique une couleur personnalisée (remplace tout), soit on conserve l'apparence originale

### 🛠️ Améliorations techniques
- **Selective fill étendu**: Le contenu `selectiveFillContent` remplace maintenant à la fois les couleurs solides ET les références URL
- **Code simplifié**: Suppression de la triple logique (original/selective/url-replaced) au profit d'une logique binaire plus claire
- **Meilleure customisation**: Les icônes avec gradients sont maintenant entièrement personnalisables

### 📖 Documentation
- **Scripts de build**: Documentation mise à jour pour expliquer la nouvelle logique unifiée
- **Commentaires de code**: Amélioration des commentaires explicatifs dans les scripts

### 🔄 Compatibilité
- Aucune rupture de compatibilité - l'API reste identique
- Amélioration du comportement existant sans changement d'interface


## [1.0.4] - 2025-01-27

### 🐛 Bug Fixes
- **Fixed JavaScript error**: Resolved "Expected moveto path command" error in complex icons
- **Improved error handling**: Added robust error handling in DataMaIconsNew.js for SVG path processing
- **Enhanced icon rendering**: Better handling of complex SVG paths and stroke elements

### 🎨 UI/UX Improvements
- **Default color behavior**: Changed default fill from blue (#007acc) to transparent
- **Smart color management**: 
  - Complex icons default to transparent (preserve original colors)
  - Simple icons default to black (#000000) for visibility
- **New "None" option**: Added transparent preset with ∅ symbol for testing transparent mode
- **Improved color picker**: Default color picker now shows #000000 instead of blue

### 🔧 Technical Enhancements
- **Dynamic fill logic**: Automatic color selection based on icon complexity
- **Enhanced preview system**: Real-time updates with proper color inheritance
- **Better reset functionality**: Reset now defaults to transparent instead of blue
- **Improved icon centering**: Better positioning for complex icons like database

### 📚 Documentation
- **Updated examples**: All examples now reflect new default behavior
- **Enhanced testing interface**: Better visual feedback for color changes
- **Improved error messages**: More descriptive error handling for developers

### 🔄 Breaking Changes
None - Fully backward compatible

---

## [1.0.3] - 2024-12-19

### ✨ New Features

#### Advanced Color Management
- **New `forceComplexColor` option**: Allows forcing color application on complex icons
- **Intelligent color management**: 
  - Simple icons automatically accept custom colors
  - Complex icons preserve their original colors by default
  - Option to force colors when needed

#### Enhanced API
```javascript
// Simple icon - color applied automatically
DataMaIcons.get('check-svg', { fill: '#007acc' })

// Complex icon - original colors preserved
DataMaIcons.get('datama-svg', { size: 32 })

// Complex icon - forced color when needed
DataMaIcons.get('datama-svg', { 
  fill: '#007acc', 
  forceComplexColor: true 
})
```

#### Enhanced Testing Interface
- **Icon selector** in `example.html` to test each icon individually
- **Checkbox** to enable/disable `forceComplexColor`
- **Real-time preview** of color changes
- **Integrated documentation** with visual examples

#### Complete Documentation
- **"Color Management" section** added to README
- **Icon type reference** (simple vs complex)
- **Best practices** and usage examples
- **Vue.js guide** for color management

### 🔧 Technical Improvements

#### `forceComplexColor` Functionality
- New optional parameter in `createSVG()`
- Selective color application on child elements
- Preservation of elements with `fill="none"` or stroke-only styles
- Compatible with all icon formats (Vue, Vanilla JS, CDN)

#### Advanced Usage Example
```javascript
// Test complex icon with forced color
const complexIcon = DataMaIcons.get('settings-svg', {
  size: 48,
  fill: '#007acc',
  forceComplexColor: true
});

// Simple icon with automatic color
const simpleIcon = DataMaIcons.get('check-svg', {
  size: 24,
  fill: '#28a745'
});
```

#### Icon Classification System
- **59 Simple Icons**: Single-color icons accepting automatic color changes
- **59 Complex Icons**: Multi-element icons with intentional colors and gradients

### 🎨 Icon Examples by Type

#### Simple Icons (Auto-color)
- `check-svg`, `x-svg`, `download-svg`
- `arrow-*-svg`, `chevron-*-svg`
- `plus-svg`, `minus-svg`, `edit-svg`

#### Complex Icons (Original colors)
- `datama-svg` (DataMa logo)
- `illustration-*-svg` (All illustrations)
- `logo-*-svg` (Partner logos)

### 🐛 Bug Fixes
- Fixed incorrect parameter name (using 'fill' instead of 'color')
- Fixed SVG path errors for complex icons
- Fixed search bar overflow issues
- Improved color application logic for complex icons

### 📚 Documentation
- Complete README with color management section
- New COLOR_EXAMPLES.md with practical use cases
- Updated Vue component props documentation
- Added debugging information for developers

### 🔄 Breaking Changes
None - Fully backward compatible

### ⚡ Performance
- Optimized SVG rendering for complex icons
- Improved color application algorithm
- Better caching for icon data

---

## [1.0.0] - 2024-12-18

### 🎉 Initial Release

#### Core Features
- **118 icons** across 7 categories
- **Vue 2 components** with full props support
- **Vanilla JavaScript API** with modern ES6+ syntax
- **JSON data export** for custom implementations

#### Icon Categories
- **Actions** (8 icons): add-folder, assess, compare, detect, etc.
- **Data** (4 icons): data, graph-chart, journey, pivot
- **Illustrations** (12 icons): Various illustrated concepts
- **Light** (52 icons): UI elements and interface icons
- **Logos** (4 icons): DataMa and partner logos
- **Navigation** (5 icons): Dropdown and directional elements
- **UI** (33 icons): User interface components

#### Distribution Formats
- **NPM Package**: Full Vue component library
- **CDN**: Direct browser usage
- **JSON**: Raw icon data for custom implementations

#### Developer Tools
- Comprehensive build system
- Automated testing suite
- Example files for all usage patterns
- TypeScript definitions

#### Vue Integration
```javascript
import Vue from 'vue';
import DatamaIcons from '@datama/icons/vue';
Vue.use(DatamaIcons);
```

#### Vanilla JavaScript Usage
```javascript
import { DataMaIcons } from './DataMaIconsNew.js';
const icon = DataMaIcons.get('check-svg', { size: 24 });
```

### 🏗️ Build System
- Automated SVG processing
- Vue component generation
- JSON data compilation
- Distribution package creation
- GitHub Actions CI/CD integration
