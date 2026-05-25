import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import jsPDF from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const { format, language = 'fr' } = await req.json();

    // Récupérer les paramètres de l'entreprise
    const settings = await base44.entities.CompanySettings.list();
    const company = settings[0] || {};

    // Récupérer les produits vitrine
    const products = await base44.entities.Product.filter({ 
      is_active: true, 
      show_on_vitrine: true 
    }, 'display_order');

    // Récupérer galerie photos
    const galerie = await base44.entities.Category.filter({ code: 'GALERIE' });
    
    // Récupérer partenaires
    const partenaires = await base44.entities.Category.filter({ code: 'PARTENAIRE' });
    
    // Récupérer actualités
    const actualites = await base44.entities.Category.filter({ code: 'actualite', is_active: true });
    
    // Récupérer offres d'emploi
    const offres = await base44.entities.Category.filter({ code: 'OFFRE_EMPLOI', is_active: true });

    // Traductions
    const translations = {
      fr: {
        title: 'Groupe Madina Oumarou',
        subtitle: 'Distribution & Logistique au Burkina Faso',
        products: 'Nos Produits',
        contact: 'Contact',
        address: 'Adresse',
        phone: 'Téléphone',
        email: 'Email',
        website: 'Site Web',
        generated: 'Généré le',
        catalog: 'Catalogue Produits',
        category: 'Catégorie',
        price: 'Prix',
        unit: 'Unité',
        stock: 'Stock',
        description: 'Description',
        services: 'Nos Services',
        about: 'À Propos',
        team: 'Notre Équipe',
        footer: '© 2026 Groupe Madina Oumarou. Tous droits réservés.',
      },
      en: {
        title: 'Groupe Madina Oumarou',
        subtitle: 'Distribution & Logistics in Burkina Faso',
        products: 'Our Products',
        contact: 'Contact',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        website: 'Website',
        generated: 'Generated on',
        catalog: 'Product Catalog',
        category: 'Category',
        price: 'Price',
        unit: 'Unit',
        stock: 'Stock',
        description: 'Description',
        services: 'Our Services',
        about: 'About Us',
        team: 'Our Team',
        footer: '© 2026 Groupe Madina Oumarou. All rights reserved.',
      },
      es: {
        title: 'Groupe Madina Oumarou',
        subtitle: 'Distribución y Logística en Burkina Faso',
        products: 'Nuestros Productos',
        contact: 'Contacto',
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Email',
        website: 'Sitio Web',
        generated: 'Generado el',
        catalog: 'Catálogo de Productos',
        category: 'Categoría',
        price: 'Precio',
        unit: 'Unidad',
        stock: 'Stock',
        description: 'Descripción',
        services: 'Nuestros Servicios',
        about: 'Sobre Nosotros',
        team: 'Nuestro Equipo',
        footer: '© 2026 Groupe Madina Oumarou. Todos los derechos reservados.',
      },
      de: {
        title: 'Groupe Madina Oumarou',
        subtitle: 'Vertrieb & Logistik in Burkina Faso',
        products: 'Unsere Produkte',
        contact: 'Kontakt',
        address: 'Adresse',
        phone: 'Telefon',
        email: 'E-Mail',
        website: 'Website',
        generated: 'Erstellt am',
        catalog: 'Produktkatalog',
        category: 'Kategorie',
        price: 'Preis',
        unit: 'Einheit',
        stock: 'Lager',
        description: 'Beschreibung',
        services: 'Unsere Dienstleistungen',
        about: 'Über Uns',
        team: 'Unser Team',
        footer: '© 2026 Groupe Madina Oumarou. Alle Rechte vorbehalten.',
      },
    };

    const t = translations[language] || translations.fr;

    if (format === 'html') {
      // Génération HTML complet de TOUT le site vitrine
      const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${t.subtitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Space Grotesk', 'Segoe UI', sans-serif; line-height: 1.6; color: #1C1C1E; background: #F8F8F6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    
    /* Hero Section */
    .hero { background: linear-gradient(135deg, #1A7A2E 0%, #0d3d17 100%); color: white; padding: 100px 20px; text-align: center; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
    .hero h1 { font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 900; margin-bottom: 20px; text-shadow: 0 2px 20px rgba(0,0,0,0.3); }
    .hero p { font-size: 1.3rem; opacity: 0.95; max-width: 700px; margin: 0 auto; }
    .hero-cta { margin-top: 40px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    .btn { padding: 15px 35px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.3s; }
    .btn-primary { background: #1A7A2E; color: white; border: 2px solid #1A7A2E; }
    .btn-primary:hover { background: #0d3d17; transform: translateY(-2px); }
    .btn-secondary { background: transparent; color: white; border: 2px solid white; }
    .btn-secondary:hover { background: white; color: #1A7A2E; }
    
    /* Sections */
    .section { padding: 80px 20px; }
    .section-alt { background: white; }
    .section-dark { background: #1C1C1E; color: white; }
    .section-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 20px; color: #1A7A2E; }
    .section-dark .section-title { color: #1A7A2E; }
    .section-subtitle { font-size: 1.1rem; opacity: 0.7; max-width: 600px; margin-bottom: 50px; }
    
    /* Services Grid */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .service-card { background: white; padding: 35px; border-radius: 15px; border: 2px solid #1C1C1E; transition: all 0.3s; }
    .service-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
    .service-icon { width: 60px; height: 60px; background: #1A7A2E; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .service-icon span { font-size: 28px; }
    .service-card h3 { font-size: 1.4rem; margin-bottom: 12px; color: #1C1C1E; }
    .service-card p { color: #666; line-height: 1.7; }
    
    /* Products */
    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
    .product-card { background: white; border: 2px solid #1C1C1E; border-radius: 12px; overflow: hidden; transition: all 0.3s; }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
    .product-image { width: 100%; height: 220px; object-fit: cover; background: #f0f0f0; }
    .product-content { padding: 25px; }
    .product-category { font-size: 0.75rem; text-transform: uppercase; color: #CC1717; font-weight: 800; margin-bottom: 8px; letter-spacing: 1px; }
    .product-name { font-size: 1.3rem; font-weight: 800; margin-bottom: 10px; color: #1C1C1E; }
    .product-description { font-size: 0.9rem; color: #666; margin-bottom: 15px; line-height: 1.6; }
    .product-details { font-size: 0.85rem; color: #555; }
    .product-details li { margin-bottom: 6px; list-style: none; }
    .product-details li::before { content: "• "; color: #1A7A2E; font-weight: bold; }
    
    /* Gallery */
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .gallery-item { border-radius: 12px; overflow: hidden; position: relative; }
    .gallery-item img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.3s; }
    .gallery-item:hover img { transform: scale(1.05); }
    
    /* Partners */
    .partners-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 25px; align-items: center; }
    .partner-card { background: white; padding: 25px; border-radius: 12px; border: 2px solid #E5E7EB; display: flex; align-items: center; justify-content: center; }
    .partner-card img { max-width: 100%; max-height: 80px; object-fit: contain; }
    
    /* Team */
    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .team-card { background: white; border-radius: 15px; overflow: hidden; border: 2px solid #1C1C1E; }
    .team-image { width: 100%; height: 300px; object-fit: cover; }
    .team-content { padding: 25px; }
    .team-name { font-size: 1.4rem; font-weight: 800; margin-bottom: 5px; }
    .team-role { color: #1A7A2E; font-weight: 700; margin-bottom: 12px; }
    .team-desc { color: #666; line-height: 1.7; }
    
    /* Jobs */
    .job-card { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E5E7EB; margin-bottom: 20px; }
    .job-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; }
    .job-meta { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; }
    .job-tag { font-size: 0.8rem; padding: 5px 12px; border-radius: 20px; font-weight: 700; }
    .job-tag-cdi { background: #DCFCE7; color: #166534; }
    .job-tag-cdd { background: #DBEAFE; color: #1E40AF; }
    .job-tag-stage { background: #FEF3C7; color: #92400E; }
    .job-desc { color: #666; line-height: 1.7; }
    
    /* Contact */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
    .contact-info { background: white; padding: 35px; border-radius: 12px; border-left: 5px solid #1A7A2E; }
    .contact-item { margin-bottom: 20px; }
    .contact-label { font-weight: 800; color: #1A7A2E; display: block; margin-bottom: 5px; }
    .contact-form { background: white; padding: 35px; border-radius: 12px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 700; margin-bottom: 8px; color: #1C1C1E; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-family: inherit; }
    .form-group textarea { min-height: 120px; resize: vertical; }
    
    /* Footer */
    footer { background: #1C1C1E; color: white; text-align: center; padding: 50px 20px; }
    footer p { opacity: 0.7; }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 60px 15px; min-height: 60vh; }
      .hero h1 { font-size: 2.5rem; }
      .section { padding: 50px 15px; }
      .section-title { font-size: 2rem; }
      .contact-grid { grid-template-columns: 1fr; }
      .services-grid, .products-grid, .team-grid { grid-template-columns: 1fr; }
    }
    
    @media print { .product-card, .service-card, .team-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero">
    <div>
      <h1>${t.title}</h1>
      <p>${t.subtitle}</p>
      <div class="hero-cta">
        <a href="#services" class="btn btn-primary">${t.services}</a>
        <a href="#contact" class="btn btn-secondary">${t.contact}</a>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="section section-alt">
    <div class="container">
      <h2 class="section-title">${t.services}</h2>
      <p class="section-subtitle">Une gamme complète de services pour répondre à vos besoins</p>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon"><span>🚚</span></div>
          <h3>Distribution Nationale</h3>
          <p>Livraison de produits dans tout le Burkina Faso avec une flotte moderne et une équipe expérimentée.</p>
        </div>
        <div class="service-card">
          <div class="service-icon"><span>📦</span></div>
          <h3>Logistique & Stockage</h3>
          <p>Entrepôts sécurisés et gestion optimisée des stocks pour garantir la disponibilité des produits.</p>
        </div>
        <div class="service-card">
          <div class="service-icon"><span>🌍</span></div>
          <h3>Import-Export</h3>
          <p>Distribution internationale vers la Côte d'Ivoire, le Mali et le Niger.</p>
        </div>
        <div class="service-card">
          <div class="service-icon"><span>✅</span></div>
          <h3>Qualité Garantie</h3>
          <p>Produits locaux certifiés et respect des normes de qualité internationales.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Products Section -->
  <section id="produits" class="section">
    <div class="container">
      <h2 class="section-title">${t.products}</h2>
      <p class="section-subtitle">Découvrez notre gamme complète de produits de qualité</p>
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-card">
            <img src="${p.image_url || 'https://images.unsplash.com/photo-1574080532925-1d5e8daf2d13?w=400&h=300&fit=crop'}" alt="${p.name}" class="product-image" onerror="this.style.background='#e0e0e0'">
            <div class="product-content">
              <div class="product-category">${p.category}</div>
              <div class="product-name">${p.name}</div>
              <div class="product-description">${p.description || ''}</div>
              <ul class="product-details">
                ${p.unit ? `<li>${t.unit}: ${p.unit}</li>` : ''}
                ${p.unit_price ? `<li>${t.price}: ${p.unit_price.toLocaleString()} FCFA</li>` : ''}
                ${p.stock_quantity !== undefined ? `<li>${t.stock}: ${p.stock_quantity}</li>` : ''}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Gallery Section -->
  ${galerie.length > 0 ? `
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Galerie Photos</h2>
      <p class="section-subtitle">Quelques images de nos installations et activités</p>
      <div class="gallery-grid">
        ${galerie.map(item => `
          <div class="gallery-item">
            <img src="${item.description || ''}" alt="${item.name}" onerror="this.style.display='none'">
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Partners Section -->
  ${partenaires.length > 0 ? `
  <section class="section">
    <div class="container">
      <h2 class="section-title">Nos Partenaires</h2>
      <p class="section-subtitle">Ils nous font confiance</p>
      <div class="partners-grid">
        ${partenaires.map(p => `
          <div class="partner-card">
            ${p.description ? `<img src="${p.description}" alt="${p.name}">` : `<p style="font-weight:700;color:#666;">${p.name}</p>`}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Team Section -->
  <section class="section section-dark">
    <div class="container">
      <h2 class="section-title">${t.team}</h2>
      <p class="section-subtitle">Une équipe expérimentée à votre service</p>
      <div class="team-grid">
        <div class="team-card">
          <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg" alt="PDG" class="team-image">
          <div class="team-content">
            <h3 class="team-name">Hama TRAORE</h3>
            <p class="team-role">Président Directeur Général</p>
            <p class="team-desc">Fondateur et visionnaire du Groupe Madina Oumarou, plus de 40 ans d'expertise en distribution.</p>
          </div>
        </div>
        <div class="team-card">
          <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg" alt="Responsable Commercial" class="team-image">
          <div class="team-content">
            <h3 class="team-name">Responsable Commercial</h3>
            <p class="team-role">Responsable Commercial</p>
            <p class="team-desc">En charge du développement des ventes et de l'expansion du réseau de distribution.</p>
          </div>
        </div>
        <div class="team-card">
          <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg" alt="Équipe" class="team-image">
          <div class="team-content">
            <h3 class="team-name">Équipe Logistique</h3>
            <p class="team-role">Transport & Livraison</p>
            <p class="team-desc">Plus de 30 chauffeurs et coordinateurs logistiques pour vous servir chaque jour.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Jobs Section -->
  ${offres.length > 0 ? `
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Offres d'Emploi</h2>
      <p class="section-subtitle">Rejoignez notre équipe dynamique</p>
      ${offres.map(o => {
        const jobData = JSON.parse(o.description || '{}');
        return `
          <div class="job-card">
            <h3 class="job-title">${o.name}</h3>
            <div class="job-meta">
              <span class="job-tag job-tag-${(jobData.contract || 'cdi').toLowerCase()}">${jobData.contract || 'CDI'}</span>
              <span>📍 ${jobData.location || 'Ouagadougou'}</span>
              <span>🏢 ${jobData.department || 'Tous départements'}</span>
            </div>
            <p class="job-desc">${jobData.description || o.description || ''}</p>
          </div>
        `;
      }).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Contact Section -->
  <section id="contact" class="section">
    <div class="container">
      <h2 class="section-title">${t.contact}</h2>
      <p class="section-subtitle">Notre équipe est à votre disposition</p>
      <div class="contact-grid">
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-label">${t.address}</span>
            <p>${company.address || 'Dapoya, Ouagadougou, Burkina Faso'}</p>
          </div>
          <div class="contact-item">
            <span class="contact-label">${t.phone}</span>
            <p>${company.phone || '+226 25 33 19 00'}</p>
          </div>
          <div class="contact-item">
            <span class="contact-label">${t.email}</span>
            <p>${company.email || 'contact@gmobfaso.com'}</p>
          </div>
          ${company.website ? `
          <div class="contact-item">
            <span class="contact-label">${t.website}</span>
            <p>${company.website}</p>
          </div>
          ` : ''}
          <div class="contact-item">
            <span class="contact-label">Horaires</span>
            <p>Lundi - Vendredi: 7h30 - 17h30</p>
            <p>Samedi: 8h00 - 12h00</p>
          </div>
        </div>
        <div class="contact-form">
          <h3 style="margin-bottom:20px;font-size:1.3rem;">Envoyez-nous un message</h3>
          <div class="form-group">
            <label>Nom complet</label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="votre@email.com" />
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea placeholder="Votre message..."></textarea>
          </div>
          <button class="btn btn-primary" style="width:100%;">Envoyer</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>${t.footer}</p>
      <p style="margin-top:15px;font-size:0.85rem;">${t.generated}: ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'de-DE')}</p>
    </div>
  </footer>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=utf-8',
          'Content-Disposition': `attachment; filename="catalogue_gmo_${language}.${format}"`,
        },
      });
    }

    if (format === 'pdf') {
      // Génération PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(26, 122, 46);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text(t.title, pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(t.subtitle, pageWidth / 2, 30, { align: 'center' });

      let y = 55;

      // Products
      doc.setTextColor(26, 122, 46);
      doc.setFontSize(18);
      doc.text(t.products, 20, y);
      y += 10;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      products.forEach((product, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Product card
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(28, 28, 30);
        doc.setLineWidth(0.5);
        doc.rect(20, y, pageWidth - 40, 35);

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(product.name, 25, y + 8);

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(204, 23, 23);
        doc.text(product.category, 25, y + 14);

        doc.setTextColor(0, 0, 0);
        if (product.unit_price) {
          doc.text(`${t.price}: ${product.unit_price.toLocaleString()} FCFA`, 25, y + 20);
        }
        if (product.unit) {
          doc.text(`${t.unit}: ${product.unit}`, 25, y + 25);
        }
        if (product.stock_quantity !== undefined) {
          doc.text(`${t.stock}: ${product.stock_quantity}`, 120, y + 20);
        }

        y += 40;
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`${t.footer} - ${t.generated}: ${new Date().toLocaleDateString()}`, pageWidth / 2, 290, { align: 'center' });
      }

      const pdfBytes = doc.output('arraybuffer');

      return new Response(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="catalogue_gmo_${language}.pdf"`,
        },
      });
    }

    if (format === 'json') {
      // Export JSON structuré
      const exportData = {
        metadata: {
          generated_at: new Date().toISOString(),
          language,
          version: '1.0',
        },
        company: {
          name: t.title,
          subtitle: t.subtitle,
          ...company,
        },
        products: products.map(p => ({
          name: p.name,
          category: p.category,
          description: p.description,
          unit_price: p.unit_price,
          wholesale_price: p.wholesale_price,
          unit: p.unit,
          stock_quantity: p.stock_quantity,
          image_url: p.image_url,
        })),
        translations: t,
      };

      return Response.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="catalogue_gmo_${language}.json"`,
        },
      });
    }

    if (format === 'csv') {
      // Export CSV
      const headers = ['Name', 'Category', 'Description', 'Unit Price', 'Wholesale Price', 'Unit', 'Stock', 'Image URL'];
      const rows = products.map(p => [
        p.name,
        p.category,
        p.description || '',
        p.unit_price || '',
        p.wholesale_price || '',
        p.unit || '',
        p.stock_quantity !== undefined ? p.stock_quantity : '',
        p.image_url || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
          'Content-Disposition': `attachment; filename="catalogue_gmo_${language}.csv"`,
        },
      });
    }

    return Response.json({ error: 'Format non supporté. Formats disponibles: html, pdf, json, csv' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});