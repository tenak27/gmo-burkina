import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const products = [
      {
        name: "Tourteaux de Bétail Coton",
        category: "alimentaire",
        description: "Tourteaux de bétail à base de coton. Sac de 50kg. Complément alimentaire riche en protéines pour l'élevage.",
        unit: "sac 50kg",
        unit_price: 12500,
        wholesale_price: 11500,
        stock_quantity: 220,
        stock_alert: 22,
        is_active: true,
        show_on_vitrine: true,
        image_url: "https://images.unsplash.com/photo-1574518611849-7cb6881fcc2e?w=600&q=80"
      },
      {
        name: "Tourteaux de Bétail Soja",
        category: "alimentaire",
        description: "Tourteaux de bétail à base de soja. Sac de 50kg. Aliment premium pour bovins, ovins et caprins.",
        unit: "sac 50kg",
        unit_price: 13500,
        wholesale_price: 12500,
        stock_quantity: 240,
        stock_alert: 24,
        is_active: true,
        show_on_vitrine: true,
        image_url: "https://images.unsplash.com/photo-1574518611849-7cb6881fcc2e?w=600&q=80"
      }
    ];

    const created = await base44.asServiceRole.entities.Product.bulkCreate(products);
    
    return Response.json({ 
      success: true, 
      message: "2 produits créés avec succès",
      products: created 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});