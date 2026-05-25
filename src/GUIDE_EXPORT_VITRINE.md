# 📦 Export Site Vitrine - Groupe Madina Oumarou

Guide complet pour exporter le site vitrine sans dépendances Base44.

---

## 🎯 Fichiers à Exporter

### Structure du dossier `export-vitrine/`

```
export-vitrine/
├── index.html                    # Page d'accueil
├── css/
│   └── styles.css               # Styles personnalisés
├── js/
│   └── main.js                  # Scripts (navigation, animations)
├── assets/
│   ├── images/                  # Toutes les images
│   └── logo/                    # Logos GMO
└── README.md                    # Instructions de déploiement
```

---

## 📄 Fichiers Sources à Copier

### 1. Composants Landing (100% statiques)

Ces composants sont **purs** et ne nécessitent aucune modification :

- ✅ `components/landing/ServicesSection`
- ✅ `components/landing/StatsSection`
- ✅ `components/landing/AboutSection`
- ✅ `components/landing/TeamSection`
- ✅ `components/landing/PartnersCarousel`
- ✅ `components/landing/PresenceSection`
- ✅ `components/landing/CoverageMap` *(enlever la carte Leaflet si besoin)*
- ✅ `components/landing/RSESection`
- ✅ `components/landing/ProjectsSection`
- ✅ `components/landing/TestimonialsSection`
- ✅ `components/landing/GallerySection`
- ✅ `components/landing/JourneyBanner`
- ✅ `components/landing/LogisticsPartnersSection`
- ✅ `components/landing/MediaSection`
- ✅ `components/landing/BlogSection`
- ✅ `components/landing/GMOFootSection`
- ✅ `components/landing/CareersSection`
- ✅ `components/landing/NewsletterSection`
- ✅ `components/landing/ContactSection`
- ✅ `components/landing/Footer`

### 2. Composants à Adapter

#### ❌ `components/landing/HeroSection`
**Problème** : Utilise `useAuth` et `base44.auth.redirectToLogin`

**Solution** : Remplacer la section de connexion par un simple bouton "Espace Client" statique

#### ❌ `components/landing/Navbar`
**Problème** : Utilise `useAuth`, `base44`, et fetch des produits

**Solution** : 
- Supprimer toute logique d'authentification
- Remplacer par navigation statique
- Hardcoder les catégories de produits

#### ❌ `components/landing/ProductsSection`
**Problème** : Fetch des produits depuis Base44

**Solution** : 
- Créer un fichier `data/produits.json` avec les produits en dur
- Modifier pour lire depuis ce fichier JSON

#### ❌ `components/landing/CatalogSection`
**Problème** : Fetch des produits depuis Base44

**Solution** : 
- Utiliser le même `data/produits.json`
- Filtrer localement

#### ❌ `components/landing/ContactSection`
**Problème** : Utilise `base44.integrations.Core.SendEmail`

**Solution** : 
- Remplacer le formulaire par un lien `mailto:` ou formulaire Formspree
- Ou garder statique avec bouton "Nous contacter"

---

## 🔧 Modifications Requises

### A. Navbar (Supprimer Auth)

**Fichier** : `components/landing/Navbar`

**Remplacer** :
```jsx
// ❌ SUPPRIMER
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
const { user, isAuthenticated, logout } = useAuth();

// ❌ SUPPRIMER tout le bloc de connexion
{isAuthenticated ? (...) : (...)}

// ✅ REMPLACER PAR
<a 
  href="/client" 
  className="inline-flex items-center gap-1.5 bg-gmo-green/10 text-gmo-green font-heading text-xs font-bold px-3.5 py-2 rounded-xl"
>
  <User className="w-3.5 h-3.5" />
  Espace Client
</a>
```

**Pour les catégories** :
```jsx
// ❌ SUPPRIMER
useEffect(() => {
  base44.entities.Product.list(...).then(...)
}, []);

// ✅ REMPLACER PAR
const categories = ["Tous", "Cigarettes", "Alimentaire", "Hygiène", "Embauche"];
```

---

### B. HeroSection (Supprimer Auth)

**Fichier** : `components/landing/HeroSection`

**Remplacer** :
```jsx
// ❌ SUPPRIMER
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
const { user, isAuthenticated, logout } = useAuth();

// ❌ SUPPRIMER la logique de dashboard
const getDashboardLink = () => {...}

// ✅ REMPLACER LE BOUTON DE CONNEXION PAR
<a
  href="/client"
  className="flex items-center gap-2 text-white/65 font-heading font-bold text-sm border border-white/20 px-4 py-2 rounded-lg hover:border-white/50 hover:text-white hover:bg-white/8 transition-all"
>
  <LogIn className="w-3.5 h-3.5" />
  Connexion
</a>
```

---

### C. ProductsSection (Données en dur)

**Fichier** : `components/landing/ProductsSection`

**Créer** : `data/produits.json`
```json
[
  {
    "name": "Hamilton Rouge",
    "category": "tabac",
    "description": "Cigarettes premium",
    "unit_price": 500,
    "image_url": "https://...",
    "show_on_vitrine": true,
    "is_active": true
  },
  // ... autres produits
]
```

**Modifier** :
```jsx
// ❌ SUPPRIMER
const [products, setProducts] = useState([]);
useEffect(() => {
  base44.entities.Product.list(...).then(setProducts);
}, []);

// ✅ REMPLACER PAR
import produits from "../data/produits.json";
const products = produits.filter(p => p.show_on_vitrine && p.is_active !== false);
```

---

### D. CatalogSection (Données en dur)

**Fichier** : `components/landing/CatalogSection`

**Modifier** :
```jsx
// ❌ SUPPRIMER
const [products, setProducts] = useState([]);
useEffect(() => {
  base44.entities.Product.list(...).then(setProducts);
}, []);

// ✅ REMPLACER PAR
import produits from "../data/produits.json";
const products = produits.filter(p => p.show_on_vitrine && p.is_active !== false);
```

---

### E. ContactSection (Formulaire statique)

**Fichier** : `components/landing/ContactSection`

**Option 1 - Formspree (gratuit)** :
```jsx
// ✅ REMPLACER LE FORMULAIRE PAR
<form 
  action="https://formspree.io/f/VOTRE_ID_FORMSPREE" 
  method="POST"
  className="..."
>
  {/* mêmes inputs */}
  <button type="submit" className="...">
    Envoyer
  </button>
</form>
```

**Option 2 - Mailto simple** :
```jsx
// ✅ REMPLACER PAR
<a 
  href="mailto:contact@gmobfaso.com?subject=Demande de devis"
  className="bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 rounded-lg"
>
  Nous contacter
</a>
```

---

## 🎨 Styles et Assets

### CSS

**Fichier** : `index.css`

**Conserver** :
- ✅ Variables CSS (couleurs GMO)
- ✅ Utilities personnalisées (glow, animations)
- ✅ Tailwind directives

**Supprimer** :
- ❌ `@import` fonts Google (les mettre dans `<link>` HTML)
- ❌ Références à `tailwind.config.js`

---

### Images

**Toutes les images à télécharger** :

1. **Héros** :
   - `https://gmobfaso.com/assets/img/slides/slide-1.jpg`
   - `https://gmobfaso.com/assets/img/slides/slide-2.jpg`
   - `https://gmobfaso.com/assets/img/slides/slide-3.jpg`
   - `https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/12a75595c_generated_image.png`

2. **Logo** :
   - `https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png`
   - `https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c6a35848c_Capturedcran2026-05-25112724AM.png`

3. **About/Team** :
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg`
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg`
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg`
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg`
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg`
   - `https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg`

4. **Partners** :
   - Toutes les images dans `components/landing/PartnersCarousel`

5. **Products** :
   - Récupérer depuis `data/produits.json`

---

## 📋 Checklist d'Export

### Étape 1 : Préparation
- [ ] Créer dossier `export-vitrine/`
- [ ] Copier tous les composants listés ci-dessus
- [ ] Télécharger toutes les images dans `assets/images/`

### Étape 2 : Modifications Code
- [ ] Modifier `Navbar` (supprimer auth + base44)
- [ ] Modifier `HeroSection` (supprimer auth)
- [ ] Créer `data/produits.json`
- [ ] Modifier `ProductsSection` (utiliser JSON)
- [ ] Modifier `CatalogSection` (utiliser JSON)
- [ ] Modifier `ContactSection` (formulaire statique)

### Étape 3 : Nettoyage
- [ ] Supprimer tous les `import { base44 }`
- [ ] Supprimer tous les `import { useAuth }`
- [ ] Supprimer `AuthContext` references
- [ ] Supprimer `base44Client` references
- [ ] Vérifier qu'aucune mention "Base44" ne reste

### Étape 4 : Tests
- [ ] Tester navigation mobile
- [ ] Tester filtres produits
- [ ] Tester formulaire contact
- [ ] Vérifier toutes les images s'affichent
- [ ] Tester responsive design

---

## 🚀 Déploiement

### Option 1 : Vercel/Netlify (gratuit)
```bash
cd export-vitrine/
npm install
npm run build
# Déployer le dossier dist/
```

### Option 2 : Hébergement classique
```bash
# Uploader via FTP :
- index.html
- css/styles.css
- js/main.js
- assets/
```

### Option 3 : GitHub Pages
```bash
git init
git add .
git commit -m "Site vitrine GMO"
git push origin main
# Activer GitHub Pages
```

---

## 📞 Support

Pour toute question sur l'export, contacter l'équipe de développement.

**Note** : Cet export est une version statique. Pour les fonctionnalités dynamiques (commandes, authentification), il faudra déployer l'application complète Base44.