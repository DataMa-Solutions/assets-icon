# 📦 Utilisation dans votre Extension JavaScript

## 🚀 Téléchargement et intégration

### URLs de téléchargement direct

Une fois que GitHub Actions aura terminé (dans quelques minutes), vous pourrez télécharger les fichiers depuis :

```bash
# Fichier principal recommandé (3.6KB)
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-simple.js

# Autres options
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-data.js
https://github.com/DataMa-Solutions/assets-icon/releases/download/v1.0.0/datama-icons-helper.min.js
```

## 💻 Intégration dans votre extension

### Option 1 : Inclusion directe

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Extension DataMa</title>
</head>
<body>
    <!-- Vos icônes avec l'attribut data-datama -->
    <button>
        <i data-datama="check-svg" data-size="16"></i>
        Valider
    </button>
    
    <div>
        <i data-datama="settings-svg" data-size="24" data-fill="#007acc"></i>
        <span>Paramètres</span>
    </div>

    <!-- Inclure le script DataMa -->
    <script src="path/to/datama-icons-simple.js"></script>
    
    <script>
        // Les icônes sont automatiquement remplacées !
        console.log('DataMa Icons chargées:', DataMaIcons.getIconNames().length, 'icônes disponibles');
    </script>
</body>
</html>
```

### Option 2 : API programmatique

```javascript
// Charger le script DataMa Icons
import('./path/to/datama-icons-simple.js').then(() => {
    
    // Créer des icônes dynamiquement
    function createIconButton(iconName, label, onClick) {
        const button = document.createElement('button');
        button.className = 'datama-icon-btn';
        
        // Générer l'icône SVG
        const iconSvg = DataMaIcons.toSvg(iconName, { 
            size: 16, 
            fill: 'currentColor' 
        });
        
        button.innerHTML = `${iconSvg} <span>${label}</span>`;
        button.addEventListener('click', onClick);
        
        return button;
    }
    
    // Utilisation
    const saveBtn = createIconButton('save-svg', 'Sauvegarder', () => {
        console.log('Sauvegarde...');
    });
    
    const deleteBtn = createIconButton('trash-2-svg', 'Supprimer', () => {
        console.log('Suppression...');
    });
    
    document.body.appendChild(saveBtn);
    document.body.appendChild(deleteBtn);
});
```

### Option 3 : Extension avec popup

```javascript
// popup.js de votre extension
class DataMaExtensionPopup {
    constructor() {
        this.icons = null;
        this.init();
    }
    
    async init() {
        // Charger les icônes DataMa
        await this.loadDataMaIcons();
        this.render();
    }
    
    async loadDataMaIcons() {
        // Si vous avez inclus le fichier localement
        if (window.DataMaIcons) {
            this.icons = window.DataMaIcons;
            return;
        }
        
        // Sinon charger depuis votre bundle
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('js/datama-icons-simple.js');
        document.head.appendChild(script);
        
        return new Promise(resolve => {
            script.onload = () => {
                this.icons = window.DataMaIcons;
                resolve();
            };
        });
    }
    
    render() {
        const container = document.getElementById('popup-container');
        
        container.innerHTML = `
            <div class="header">
                ${this.icons.toSvg('datama-logo-svg', { size: 32 })}
                <h1>DataMa Extension</h1>
            </div>
            
            <div class="actions">
                <button class="btn-primary" data-action="analyze">
                    ${this.icons.toSvg('data-svg', { size: 16 })}
                    Analyser
                </button>
                
                <button class="btn-secondary" data-action="settings">
                    ${this.icons.toSvg('settings-svg', { size: 16 })}
                    Paramètres
                </button>
                
                <button class="btn-danger" data-action="clear">
                    ${this.icons.toSvg('trash-2-svg', { size: 16 })}
                    Effacer
                </button>
            </div>
            
            <div class="status">
                ${this.icons.toSvg('check-svg', { size: 14, fill: '#28a745' })}
                Extension prête
            </div>
        `;
        
        // Ajouter les événements
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action);
            });
        });
    }
    
    handleAction(action) {
        switch(action) {
            case 'analyze':
                this.startAnalysis();
                break;
            case 'settings':
                this.openSettings();
                break;
            case 'clear':
                this.clearData();
                break;
        }
    }
    
    startAnalysis() {
        // Votre logique d'analyse
        console.log('Démarrage de l\'analyse...');
    }
    
    openSettings() {
        // Ouvrir les paramètres
        chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    }
    
    clearData() {
        // Effacer les données
        if (confirm('Êtes-vous sûr de vouloir effacer les données ?')) {
            console.log('Données effacées');
        }
    }
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new DataMaExtensionPopup();
});
```

## 🎨 CSS pour styliser vos icônes

```css
/* Styles pour les boutons avec icônes */
.datama-icon-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.datama-icon-btn:hover {
    background: #f8f9fa;
    border-color: #007acc;
}

.datama-icon-btn svg {
    flex-shrink: 0;
}

/* Styles pour les différents types de boutons */
.btn-primary {
    background: #007acc;
    color: white;
    border-color: #007acc;
}

.btn-primary:hover {
    background: #005a9e;
}

.btn-secondary {
    background: #6c757d;
    color: white;
    border-color: #6c757d;
}

.btn-danger {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

/* Header avec logo */
.header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.header h1 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

/* Status avec icône */
.status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    color: #28a745;
}
```

## 📊 Icônes disponibles par catégorie

### 💼 Actions (8 icônes)
- `add-folder-svg`, `assess-svg`, `compare-svg`, `detect-svg`
- `leave-org-svg`, `update-svg`, `upload-svg`, `upload-1-svg`

### 📊 Data (4 icônes)  
- `pivot-svg`, `data-svg`, `graph-chart-svg`, `journey-svg`

### 💡 Light (69 icônes)
- `check-svg`, `settings-svg`, `trash-2-svg`, `save-svg`
- `download-svg`, `edit-svg`, `filter-svg`, `plus-svg`, etc.

### 🏢 Logos (4 icônes)
- `datama-logo-svg`, `logo-looker-studio-svg`, `logo-power-bi-svg`, `logo-tableau-svg`

### 🧭 Navigation (5 icônes)
- `drop-down-svg`, `drop-up-svg`, `drop-left-svg`, `drop-right-svg`, `drop-down-1-svg`

### 🎛️ UI (25 icônes) 
- `home-svg`, `profile-svg`, `search-svg`, `warning-svg`
- `documentation-svg`, `settings-1-svg`, etc.

### 🎨 Illustrations (13 icônes)
- `illustration-analyze-svg`, `illustration-data-svg`, `illustration-premium-svg`, etc.

## 🔧 Tips et bonnes pratiques

1. **Taille des icônes** : Utilisez `data-size` ou l'option `size` pour contrôler la taille
2. **Couleurs** : Utilisez `data-fill` ou `fill: 'currentColor'` pour hériter de la couleur du texte
3. **Performance** : Le fichier `datama-icons-simple.js` fait seulement 3.6KB
4. **Accessibilité** : Ajoutez des `aria-label` sur vos boutons avec icônes

## 🚀 Déploiement

1. Téléchargez `datama-icons-simple.js` depuis GitHub Releases
2. Incluez-le dans votre extension
3. Ajoutez les permissions nécessaires dans votre `manifest.json`
4. Utilisez les icônes avec l'API ou les attributs `data-datama`

Votre extension est maintenant prête avec les icônes DataMa ! 🎉 