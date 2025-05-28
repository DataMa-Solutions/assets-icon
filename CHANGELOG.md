# Changelog - DataMa Icons

## [1.0.1] - 2024-12-19

### 🐛 Corrections

#### Icônes Complexes Multi-Couleurs
- **Problème résolu**: Les icônes avec plusieurs couleurs (comme `illustration-anonymous.svg`) étaient incorrectement traitées comme "simples" et perdaient leurs couleurs
- **Cause**: La logique de détection des SVG complexes ne vérifiait que certains éléments (`mask`, `filter`, `defs`, etc.) mais ignorait les SVG avec plusieurs `<path>` ayant des attributs `fill` différents
- **Solution**: Amélioration de la détection pour identifier comme "complexes" les SVG avec :
  - Plusieurs couleurs (`fill` ou `stroke` différents)
  - Structures imbriquées (`g` dans `g`)
  - Attributs de règles complexes (`fill-rule`, `clip-rule`)

#### Détails Techniques
```javascript
// Avant: Détection limitée
const isComplex = complexElements.length > 0;

// Après: Détection complète
const isComplex = complexElements.length > 0 || 
                  hasMultipleColors || 
                  hasNestedStructure || 
                  hasComplexPaths;
```

#### Impact
- ✅ **59 icônes** maintenant correctement détectées comme complexes
- ✅ **Couleurs préservées** dans toutes les icônes multi-couleurs
- ✅ **Compatibilité maintenue** avec les icônes simples existantes
- ✅ **Performance optimisée** pour les icônes simples (path unique)

### 🎨 Icônes Affectées
Les icônes suivantes conservent maintenant leurs couleurs originales :
- `illustration-anonymous-svg` (vert #16D0B4 + noir #00484A)
- `illustration-analyze-svg`
- `illustration-compare-svg`
- `illustration-data-svg`
- `datama-logo-svg`
- `logo-looker-studio-svg`
- `logo-power-bi-svg`
- `logo-tableau-svg`
- Et 51 autres icônes complexes...

### 📦 Workflow CI/CD
- **Nouveau déclenchement**: Release uniquement sur les tags (au lieu de chaque push)
- **Déploiement GCS**: Ajout du déploiement automatique sur Google Cloud Storage
- **Scripts de release**: Nouveaux scripts pour faciliter la création de versions

### 🧪 Tests
- Ajout de `test-complex-icons.html` pour vérifier l'affichage des icônes complexes
- Tests de tailles multiples pour validation visuelle

---

## [1.0.0] - 2024-12-18

### 🚀 Version Initiale
- 65 icônes SVG converties
- Support Vue 2 et JSON
- Pipeline CI/CD automatisée
- Documentation complète
