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
      // Génération HTML complet
      const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${t.catalog}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1C1C1E; background: #F8F8F6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: linear-gradient(135deg, #1A7A2E 0%, #0d3d17 100%); color: white; padding: 60px 20px; text-align: center; }
    header h1 { font-size: 3em; margin-bottom: 10px; }
    header p { font-size: 1.2em; opacity: 0.9; }
    .section { margin: 40px 0; }
    .section-title { font-size: 2em; color: #1A7A2E; margin-bottom: 20px; border-bottom: 3px solid #CC1717; padding-bottom: 10px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .product-card { background: white; border: 2px solid #1C1C1E; border-radius: 8px; overflow: hidden; transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
    .product-image { width: 100%; height: 200px; object-fit: cover; background: #f0f0f0; }
    .product-content { padding: 20px; }
    .product-category { font-size: 0.75em; text-transform: uppercase; color: #CC1717; font-weight: bold; margin-bottom: 8px; }
    .product-name { font-size: 1.3em; font-weight: bold; margin-bottom: 10px; color: #1C1C1E; }
    .product-description { font-size: 0.9em; color: #666; margin-bottom: 15px; }
    .product-details { font-size: 0.85em; color: #555; }
    .product-details li { margin-bottom: 5px; }
    .contact-info { background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #1A7A2E; }
    .contact-item { margin-bottom: 15px; }
    .contact-label { font-weight: bold; color: #1A7A2E; }
    footer { background: #1C1C1E; color: white; text-align: center; padding: 30px; margin-top: 60px; }
    @media print { .product-card { break-inside: avoid; } }
    @media (max-width: 768px) { .products-grid { grid-template-columns: 1fr; } header h1 { font-size: 2em; } }
  </style>
</head>
<body>
  <header>
    <h1>${t.title}</h1>
    <p>${t.subtitle}</p>
  </header>

  <div class="container">
    <div class="section">
      <h2 class="section-title">${t.products}</h2>
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-card">
            <img src="${p.image_url || 'https://images.unsplash.com/photo-1574080532925-1d5e8daf2d13?w=400&h=300&fit=crop'}" alt="${p.name}" class="product-image" onerror="this.style.background='#e0e0e0'">
            <div class="product-content">
              <div class="product-category">${p.category}</div>
              <div class="product-name">${p.name}</div>
              <div class="product-description">${p.description || ''}</div>
              <ul class="product-details">
                ${p.unit ? `<li><strong>${t.unit}:</strong> ${p.unit}</li>` : ''}
                ${p.unit_price ? `<li><strong>${t.price}:</strong> ${p.unit_price.toLocaleString()} FCFA</li>` : ''}
                ${p.stock_quantity !== undefined ? `<li><strong>${t.stock}:</strong> ${p.stock_quantity}</li>` : ''}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">${t.contact}</h2>
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-label">${t.address}:</span> ${company.address || 'Dapoya, Ouagadougou'}
        </div>
        <div class="contact-item">
          <span class="contact-label">${t.phone}:</span> ${company.phone || '+226 25 33 19 00'}
        </div>
        <div class="contact-item">
          <span class="contact-label">${t.email}:</span> ${company.email || 'contact@gmobfaso.com'}
        </div>
        ${company.website ? `<div class="contact-item"><span class="contact-label">${t.website}:</span> ${company.website}</div>` : ''}
      </div>
    </div>
  </div>

  <footer>
    <p>${t.footer}</p>
    <p style="font-size: 0.85em; margin-top: 10px; opacity: 0.7;">${t.generated}: ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'de-DE')}</p>
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