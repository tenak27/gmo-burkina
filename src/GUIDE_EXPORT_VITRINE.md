# Guide d'Export - Site Vitrine GMO

## ⚠️ Important

Le site vitrine est une **application React dynamique** (SPA - Single Page Application) et ne peut pas être simplement exporté en un fichier HTML statique unique. Voici pourquoi :

### Pourquoi pas un HTML statique ?

1. **Architecture React** : Le site utilise React, Tailwind CSS et des composants dynamiques
2. **Données en temps réel** : Les produits sont chargés depuis la base de données Base44
3. **Routing dynamique** : Navigation via React Router
4. **Interactivité** : Formulaires, filtres, animations Framer Motion

---

## ✅ Solutions pour obtenir un site statique

### Option 1 : Export PDF (Recommandé pour présentation)

**Pour quoi faire** : Présenter le catalogue à des clients/investisseurs

**Comment** :
1. Ouvrir le site : `https://gmobf.base44.app`
2. Naviguer vers chaque section (Accueil, Services, Produits, Contact)
3. Utiliser `Ctrl+P` → "Enregistrer au format PDF"
4. Cocher "Graphiques d'arrière-plan" pour les couleurs

**Outils recommandés** :
- **Chrome/Edge** : Ctrl+P → "Enregistrer au format PDF"
- **extension GoFullPage** : Capture toute la page en un clic
- **Adobe Acrobat** : Export haute qualité

---

### Option 2 : Capture d'écran complète

**Outils** :
- **GoFullPage** (extension Chrome) : Capture scrollable complète
- **Fireshot** : Export PNG/PDF
- **Nimbus Screenshot** : Capture + annotations

**Procédure** :
1. Installer l'extension GoFullPage
2. Ouvrir chaque section du site
3. Cliquer sur l'extension → Capture complète
4. Exporter en PNG ou PDF

---

### Option 3 : Site statique généré (Pour hébergement externe)

**Outil recommandé** : [Prerender.io](https://prerender.io/) ou [Rendertron](https://github.com/GoogleChrome/rendertron)

**Étapes** :
```bash
# 1. Installer puppeteer
npm install puppeteer

# 2. Script de prerendu (exemple)
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Pages à exporter
  const urls = ['/', '/#services', '/#produits', '/#contact'];
  
  for (const url of urls) {
    await page.goto(`https://gmobf.base44.app${url}`, { waitUntil: 'networkidle0' });
    const html = await page.content();
    fs.writeFileSync(`export${url === '/' ? '/index' : url}.html`, html);
  }
  
  await browser.close();
})();
```

**Limites** :
- Les données produits seront figées à la date d'export
- Les formulaires ne fonctionneront pas
- Les animations peuvent être perdues

---

### Option 4 : Version imprimable (Catalogue produits)

**Usage** : Catalogue papier pour clients

**Procédure** :
1. Ouvrir la section **Produits**
2. Filtrer par catégorie si nécessaire
3. `Ctrl+P` → Format PDF
4. Ajuster :
   - Marges : "Aucunes"
   - Échelle : "Ajuster à la page"
   - Cocher "Graphiques d'arrière-plan"

---

## 📦 Fichiers sources du site

Si vous voulez **modifier le design** avant export :

### Structure du projet
```
src/
├── pages/
│   └── Home.jsx                    # Page principale
├── components/landing/
│   ├── HeroSection.jsx             # Bannière accueil
│   ├── ServicesSection.jsx         # Section services
│   ├── ProductsSection.jsx         # Catalogue produits
│   ├── AboutSection.jsx            # À propos
│   ├── TeamSection.jsx             # Équipe
│   ├── ContactSection.jsx          # Formulaire contact
│   ├── Footer.jsx                  # Pied de page
│   └── ...
├── index.css                       # Styles globaux
└── tailwind.config.js              # Configuration Tailwind
```

### Modifier les couleurs
```css
/* index.css */
:root {
  --primary: 142 72% 29%;    /* Vert GMO */
  --accent: 0 85% 40%;       /* Rouge GMO */
}
```

### Modifier les produits
Les produits viennent de la base de données **Product** entity.
Pour modifier : Dashboard Admin → Produits → Modifier `show_on_vitrine`

---

## 🎯 Recommandation

**Pour un catalogue client** :
- ✅ **Option 1 (PDF)** : Rapide, propre, professionnel
- Pages recommandées : Accueil + Produits + Contact
- Qualité : 300 DPI pour impression

**Pour hébergement statique** :
- ⚠️ **Option 3 (Prerender)** : Technique, nécessite développement
- Coût : ~$20/mois pour Prerender.io
- Alternative gratuite : Rendertron (self-hosted)

**Pour présentation interne** :
- ✅ **Option 2 (Screenshots)** : Simple, suffit pour slides

---

## 📞 Besoin d'aide ?

Pour exporter le site ou créer une version statique personnalisée, contactez l'équipe technique GMO ou utilisez les outils mentionnés ci-dessus.

**Dernière mise à jour** : Mai 2026
**Version du site** : 1.0