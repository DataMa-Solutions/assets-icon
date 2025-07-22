const fs = require('fs');
const path = require('path');

// Charger les données générées
const iconsData = require('./dist/icons.json');

// Icônes à tester
const problematicIcons = [
  'email-svg',
  'excel-svg',
  'google-sheets-svg',
  'power-bi-svg',
  'redshift-svg'
];

console.log('=== TEST DES ICÔNES PROBLÉMATIQUES ===\n');

function extractImportantParts(content, iconName) {
  if (!content) return "N/A";
  
  if (iconName === 'email-svg') {
    // Trouver les deux paths principaux pour email
    const matches = content.match(/<path[^>]*>/g);
    return matches ? matches.join('\n') : "Pas de paths trouvés";
  } else if (iconName === 'excel-svg' || iconName === 'google-sheets-svg') {
    // Extraire les chemins blancs
    const whitePathsMatches = content.match(/<path[^>]*fill="(?:#fff|#FFFFFF|white)"[^>]*>/g);
    const currentColorPaths = content.match(/<path[^>]*fill="currentColor"[^>]*>/g);
    
    return `Chemins blancs: ${whitePathsMatches ? whitePathsMatches.length : 0}\n` +
           `Chemins currentColor: ${currentColorPaths ? currentColorPaths.length : 0}`;
  } else if (iconName === 'power-bi-svg') {
    // Extraire les stops de gradient
    const gradientStops = content.match(/<stop[^>]*>/g);
    // Extraire les éléments use pour vérifier les filtres
    const useElements = content.match(/<use[^>]*>/g);
    
    let result = '';
    if (gradientStops) {
      result += "Gradient stops:\n";
      result += gradientStops.join('\n');
    }
    
    if (useElements) {
      result += "\n\nUse elements:\n";
      result += useElements.join('\n');
    }
    
    return result;
  }
  
  return "Analyse spécifique non disponible";
}

problematicIcons.forEach(iconName => {
  const icon = iconsData[iconName];
  if (!icon) {
    console.log(`⚠️ Icône ${iconName} non trouvée!`);
    return;
  }
  
  console.log(`### ${iconName.toUpperCase()} ###`);
  console.log(`- isComplex: ${icon.isComplex}`);
  
  if (icon.selectiveFillContent) {
    console.log('- selectiveFillContent présent ✓');
    
    // Vérifier si l'icône email a correctement séparé les paths
    if (iconName === 'email-svg') {
      const backgroundPathFound = icon.selectiveFillContent.includes('M0 0h24v24H0V0z');
      console.log(`- Path de fond séparé: ${backgroundPathFound ? '✓' : '❌'}`);
      
      const contentPathFound = icon.selectiveFillContent.includes('fill="currentColor"');
      console.log(`- Path de contenu avec currentColor: ${contentPathFound ? '✓' : '❌'}`);
    }
    
    // Vérifier les éléments blancs dans Google Sheets et Excel
    if (iconName === 'excel-svg' || iconName === 'google-sheets-svg') {
      const whitePathsRemoved = !icon.selectiveFillContent.includes('fill="#fff"') && 
                               !icon.selectiveFillContent.includes('fill="#FFFFFF"') &&
                               !icon.selectiveFillContent.includes('fill="white"');
      console.log(`- Chemins blancs supprimés: ${whitePathsRemoved ? '✓' : '❌'}`);
    }
    
    // Vérifier PowerBI pour les arrêts de gradient
    if (iconName === 'power-bi-svg') {
      const gradientStopsConverted = icon.selectiveFillContent.includes('stop-color="currentColor"');
      console.log(`- Arrêts de gradient avec currentColor: ${gradientStopsConverted ? '✓' : '❌'}`);
      
      // Vérifier si le use du filtre est problématique
      const usesFilterBlack = icon.selectiveFillContent.includes('fill="black"') && 
                              icon.selectiveFillContent.includes('filter="url(#filter-4)"');
      console.log(`- Utilise filtre noir: ${usesFilterBlack ? '⚠️' : '✓'}`);
    }
    
    // Vérifier Redshift pour l'image bitmap
    if (iconName === 'redshift-svg') {
      console.log('- Image bitmap intégrée: Ne peut pas être colorée avec fill ℹ️');
    }
    
    console.log('\nExtraits importants:');
    console.log('--------------------');
    console.log(extractImportantParts(icon.selectiveFillContent, iconName));
    console.log('--------------------');
  } else {
    console.log('- ⚠️ Pas de selectiveFillContent!');
    
    // Pour Redshift, vérifier s'il y a une image base64
    if (iconName === 'redshift-svg' && icon.content) {
      const hasBase64Image = icon.content.includes('data:image/png;base64');
      console.log(`- Contient une image base64: ${hasBase64Image ? '✓' : '❌'}`);
    }
  }
  
  console.log(''); // Ligne vide entre les icônes
});

console.log('=== FIN DU TEST ==='); 