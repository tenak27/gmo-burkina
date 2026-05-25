# Guide d'Export - Vitrine GMO Burkina

## 📁 Fichiers à Exporter

### Pages Principales
```
pages/Home.jsx                    → Page d'accueil
pages/Careers.jsx                 → Page Carrières
```

### Composants Landing
```
components/landing/Navbar.jsx
components/landing/HeroSection.jsx
components/landing/ServicesSection.jsx
components/landing/AboutSection.jsx
components/landing/ProductsSection.jsx
components/landing/GMOFootSection.jsx
components/landing/GallerySection.jsx
components/landing/PartnersSection.jsx
components/landing/PartnersCarousel.jsx
components/landing/StatsSection.jsx
components/landing/ContactSection.jsx
components/landing/Footer.jsx
components/landing/CoverageMap.jsx
components/landing/PresenceSection.jsx
components/landing/CatalogSection.jsx
components/landing/ProjectsSection.jsx
components/landing/TestimonialsSection.jsx
components/landing/TeamSection.jsx
components/landing/MediaSection.jsx
components/landing/RSESection.jsx
components/landing/BlogSection.jsx
components/landing/NewsletterSection.jsx
components/landing/JourneyBanner.jsx
components/landing/LogisticsPartnersSection.jsx
```

### Composants Auth
```
components/auth/RoleGuard.jsx     → Garder uniquement si besoin de login
```

### Fichiers de Configuration
```
index.html                        → Structure HTML
index.css                         → Styles globaux
tailwind.config.js                → Configuration Tailwind
App.jsx                           → Routeur (garder uniquement Home et Careers)
```

---

## 🔧 Modifications Requises

### 1. Supprimer les imports Base44
Dans TOUS les fichiers, supprimer :
```javascript
import { base44 } from "@/api/base44Client";
```

### 2. Remplacer les URLs media.base44.com
Remplacer toutes les URLs :
```
https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/...
```
Par :
```
https://gmobfaso.com/assets/img/...
```

### 3. Désactiver les appels API Base44

**Navbar.jsx** - Remplacer la récupération dynamique des catégories :
```javascript
// AVANT
useEffect(() => {
  base44.entities.Product.list("name", 200).then(data => {
    const products = (data || []).filter(p => p.show_on_vitrine && p.is_active !== false);
    const cats = new Set();
    products.forEach(p => cats.add(getCategoryForProduct(p.name)));
    setCategories(["Tous", ...Array.from(cats)]);
  }).catch(() => {});
}, []);

// APRÈS
useEffect(() => {
  setCategories(["Tous", "Cigarettes", "Alimentaire", "Hygiène", "Embauche"]);
}, []);
```

**ProductsSection.jsx** - Produits statiques :
```javascript
// AVANT
useEffect(() => {
  base44.entities.Product.list("name", 200).then(data => {
    setDbProducts((data || []).filter(p => p.show_on_vitrine && p.is_active !== false));
  });
}, []);

// APRÈS - Définir les produits en dur
const STATIC_PRODUCTS = [
  {
    name: "Hamilton Light",
    category: "Cigarettes",
    brand: "Hamilton",
    description: "Cigarettes de qualité supérieure",
    details: ["Pack 20 cigarettes", "Fabriqué localement"],
    image: "https://gmobfaso.com/assets/img/products/hamilton.jpg",
  },
  // ... autres produits
];

useEffect(() => {
  setDbProducts(STATIC_PRODUCTS);
}, []);
```

**ContactSection.jsx** - Formulaire de contact :
```javascript
// AVANT
const handleSubmit = async (e) => {
  e.preventDefault();
  setSending(true);
  await base44.integrations.Core.SendEmail({
    to: "infos@gmoburkina.com",
    subject: `[Contact Site] ${form.subject} — ${form.name}`,
    body: `...`,
    from_name: "GMO Burkina — Site Web",
  });
  setSending(false);
  toast.success("Message envoyé !");
  setForm({ ... });
};

// APRÈS - Utiliser un service tiers ou formsubmit.co
const handleSubmit = async (e) => {
  e.preventDefault();
  setSending(true);
  
  // Option 1: Utiliser FormSubmit (gratuit)
  await fetch("https://formsubmit.co/ajax/infos@gmoburkina.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: `Nouveau contact - ${form.subject}`,
      message: form.message,
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
    }),
  });
  
  setSending(false);
  toast.success("Message envoyé !");
  setForm({ ... });
};
```

**Careers.jsx** - Candidatures :
```javascript
// AVANT
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  await base44.entities.Application.create({ ... });
  await base44.integrations.Core.SendEmail({ ... });
  setSubmitting(false);
  setDone(true);
};

// APRÈS - Email direct ou service tiers
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  // Envoyer par email via FormSubmit ou EmailJS
  await fetch("https://formsubmit.co/ajax/rh@gmoburkina.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: `Candidature - ${job?.title || "Spontanée"}`,
      message: `Nom: ${form.name}\nEmail: ${form.email}\nTéléphone: ${form.phone}\nMessage: ${form.message}`,
      // Le CV doit être géré séparément (upload sur Google Drive, Dropbox, etc.)
    }),
  });
  
  setSubmitting(false);
  setDone(true);
};
```

### 4. Nettoyer le Routeur (App.jsx)

Garder uniquement les routes pour la vitrine :
```javascript
// App.jsx - Nettoyé
function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrieres" element={<Careers />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}
```

### 5. Mettre à jour les URLs d'images

Mapper les images Base44 vers gmobfaso.com :

| Base44 URL | Remplacement |
|------------|--------------|
| `.../c6a35848c_Capturedcran2026-05-25112724AM.png` | `/assets/img/logo-gmo.png` |
| `.../c7662a636_logo-gmo2x.png` | `/assets/img/logo-gmo-white.png` |
| `.../9e31bba75_home-innovation-pdg.jpg` | `/assets/img/a-propos/a-propos-1.jpg` |
| `.../1a49d0a18_generated_1a2588b5.png` | `/assets/img/slides/slide-1.jpg` |
| `.../7fb80f92d_generated_bc5a0082.png` | `/assets/img/a-propos/a-propos-2.jpg` |
| `.../b71c07b21_generated_f4cdf466.png` | `/assets/img/a-propos/a-propos-3.jpg` |
| `.../1e2be0905_generated_51987d61.png` | `/assets/img/slides/slide-2.jpg` |
| `.../c233f6983_generated_cd287a08.png` | `/assets/img/slides/slide-3.jpg` |
| `.../5bc285315_generated_35f6c974.png` | `/assets/img/a-propos/a-propos-5.jpg` |

---

## 📦 Procédure d'Export

### Étape 1: Créer l'archive
```bash
# Dans le dossier du projet
mkdir gmo-vitrine
cd gmo-vitrine

# Copier les fichiers nécessaires
cp -r ../pages/Home.jsx ./
cp -r ../pages/Careers.jsx ./
cp -r ../components/landing ./
cp -r ../components/auth ./
cp -r ../components/ui ./
cp -r ../lib ./
cp ../App.jsx ./
cp ../index.html ./
cp ../index.css ./
cp ../tailwind.config.js ./
cp -r ../public ./
cp ../package.json ./
```

### Étape 2: Nettoyer les dépendances
Dans `package.json`, garder uniquement :
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.16.4",
    "lucide-react": "^0.475.0",
    "tailwindcss": "^3.4.0",
    "sonner": "^2.0.1",
    "@tanstack/react-query": "^5.84.1"
  }
}
```

### Étape 3: Modifier App.jsx
```javascript
// Supprimer AuthProvider et RoleGuard
// Garder uniquement :
import { Home } from './pages/Home';
import { Careers } from './pages/Careers';
```

### Étape 4: Tester en local
```bash
npm install
npm run dev
```

---

## 🚀 Déploiement

### Option 1: Vercel / Netlify
1. Pousser le code sur GitHub
2. Connecter le repo à Vercel/Netlify
3. Déploiement automatique

### Option 2: Hébergement mutualisé
1. Builder le projet : `npm run build`
2. Uploader le dossier `dist/` via FTP
3. Configurer le serveur web (Apache/Nginx)

### Option 3: GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

---

## ✅ Checklist Finale

- [ ] Supprimé tous les imports `base44`
- [ ] Remplacé toutes les URLs `media.base44.com`
- [ ] Désactivé les appels API Base44
- [ ] Configuré les produits statiques
- [ ] Configuré le formulaire de contact (FormSubmit ou autre)
- [ ] Configuré les candidatures (email direct)
- [ ] Nettoyé App.jsx (routes inutiles)
- [ ] Testé en local
- [ ] Vérifié responsive mobile
- [ ] Validé les performances (Lighthouse)

---

## 📞 Support

Pour toute question sur l'export ou le déploiement, contacter :
- **IAM TECHNOLOGY** - Armand Olivier KONATE
- Email: support@iamtechnology.bf