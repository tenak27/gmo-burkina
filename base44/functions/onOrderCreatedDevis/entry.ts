/**
 * onOrderCreatedDevis
 * Triggered by entity automation when an Order is created (client_type = "detaillant").
 * 1. Crée un Devis (Invoice type=devis) lié à la commande
 * 2. Envoie un email au détaillant avec le devis et un lien de validation
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { event, data } = body;

    // Only for detaillant orders on create
    if (data?.client_type !== 'detaillant') {
      return Response.json({ skipped: true, reason: 'not a detaillant order' });
    }
    if (event?.type !== 'create') {
      return Response.json({ skipped: true, reason: 'not a create event' });
    }

    const order = data;
    const orderNumber = order.order_number || order.id?.slice(-8).toUpperCase();
    const devisNumber = `DEV-${Date.now().toString().slice(-8)}`;

    // Build items from order
    const items = (order.items || []).map(it => ({
      product_id: it.product_id || '',
      name: it.name || '',
      qty: it.qty || 1,
      unit_price: it.unit_price || 0,
    }));

    const subtotal = items.reduce((s, it) => s + (it.qty * it.unit_price), 0);
    const taxRate = 18;
    const taxAmount = Math.round(subtotal * taxRate / 100);
    const total = subtotal + taxAmount;

    // Create Devis (Invoice type=devis)
    const devis = await base44.asServiceRole.entities.Invoice.create({
      type: 'devis',
      number: devisNumber,
      client_name: order.client_name,
      client_id: order.client_id || '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      paid_amount: 0,
      status: 'envoye',
      notes: `Commande N° ${orderNumber} — Mode: ${order.delivery_mode === 'enlevement' ? 'Enlèvement au dépôt' : 'Livraison'}\nAdresse: ${order.delivery_address || '—'}`,
    });

    // Validation token = devisId (simple, can be enhanced)
    const validationUrl = `https://gmo-bf.com/devis-validation?devis_id=${devis.id}&order_id=${order.id}`;

    // Build items HTML for email
    const itemsHtml = items.map(it =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333">${it.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:center;color:#555">${it.qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;color:#555">${Number(it.unit_price).toLocaleString('fr-FR')} FCFA</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;font-weight:bold;color:#1A7A2E">${Number(it.qty * it.unit_price).toLocaleString('fr-FR')} FCFA</td>
      </tr>`
    ).join('');

    const emailBody = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

<!-- Header -->
<tr>
  <td style="background:#1A7A2E;padding:28px 36px">
    <table width="100%">
      <tr>
        <td>
          <div style="background:#fff;display:inline-block;padding:8px 16px;border-radius:8px">
            <span style="color:#1A7A2E;font-size:18px;font-weight:900">GMO BURKINA</span>
          </div>
          <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:4px">Groupe Madina Oumarou</div>
        </td>
        <td align="right">
          <div style="color:#fff;font-size:13px;font-weight:bold">DEVIS</div>
          <div style="color:rgba(255,255,255,0.7);font-size:18px;font-weight:900">${devisNumber}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr><td style="background:#CC1717;height:3px"></td></tr>

<!-- Body -->
<tr>
  <td style="padding:32px 36px">
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#1A7A2E">📋 Votre devis est prêt !</p>
    <p style="margin:0 0 24px;font-size:14px;color:#666">Bonjour <strong style="color:#111">${order.client_name}</strong>, veuillez trouver ci-dessous le devis correspondant à votre commande.</p>

    <!-- Devis info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf8;border:1px solid #d4ecd9;border-radius:12px;margin-bottom:24px">
      <tr><td style="padding:16px 20px">
        <table width="100%">
          <tr>
            <td style="font-size:12px;color:#888;padding-bottom:4px">N° Devis</td>
            <td align="right" style="font-size:14px;font-weight:900;color:#1A7A2E">${devisNumber}</td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#888;padding-bottom:4px">Commande liée</td>
            <td align="right" style="font-size:13px;color:#333">${orderNumber}</td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#888;padding-bottom:4px">Mode de livraison</td>
            <td align="right" style="font-size:13px;color:#333">${order.delivery_mode === 'enlevement' ? 'Enlèvement au dépôt' : 'Livraison à domicile'}</td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#888">Valable jusqu'au</td>
            <td align="right" style="font-size:13px;color:#333">${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Articles -->
    <p style="font-size:12px;font-weight:700;color:#888;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px">Articles</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:16px">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#888;font-weight:700">Article</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:#888;font-weight:700">Qté</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;font-weight:700">Prix u.</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;font-weight:700">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Totaux -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#666">Sous-total HT</td>
        <td align="right" style="font-size:13px;color:#333;font-weight:600">${Number(subtotal).toLocaleString('fr-FR')} FCFA</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#666">TVA (${taxRate}%)</td>
        <td align="right" style="font-size:13px;color:#333;font-weight:600">${Number(taxAmount).toLocaleString('fr-FR')} FCFA</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A7A2E;border-radius:10px;margin-bottom:28px">
      <tr>
        <td style="padding:14px 20px;color:rgba(255,255,255,0.8);font-size:13px">TOTAL TTC</td>
        <td align="right" style="padding:14px 20px;color:#fff;font-size:20px;font-weight:900">${Number(total).toLocaleString('fr-FR')} FCFA</td>
      </tr>
    </table>

    <!-- Bouton validation -->
    <div style="text-align:center;margin-bottom:28px">
      <a href="${validationUrl}"
        style="display:inline-block;background:#F5A623;color:#fff;font-size:15px;font-weight:800;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.02em">
        ✅ Valider ce devis
      </a>
      <p style="font-size:11px;color:#aaa;margin-top:10px">Ce lien est valable 7 jours. Une fois validé, votre commande sera traitée après réception du paiement.</p>
    </div>

    <p style="font-size:13px;color:#555;margin:0">Pour toute question: <strong style="color:#1A7A2E">+226 25 33 19 00</strong> ou WhatsApp <strong style="color:#1A7A2E">+226 76 21 16 33</strong></p>
  </td>
</tr>

<!-- Footer -->
<tr>
  <td style="background:#1A7A2E;padding:18px 36px;text-align:center">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.7)">Groupe Madina Oumarou · Ouagadougou, Burkina Faso</p>
    <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.4)">gmobfaso.com · infos@gmoburkina.com</p>
  </td>
</tr>
<tr><td style="background:#CC1717;height:3px"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    if (order.client_email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: order.client_email,
        subject: `📋 Devis ${devisNumber} — GMO Burkina · Commande ${orderNumber}`,
        body: emailBody,
        from_name: 'GMO Burkina',
      });
    }

    return Response.json({ success: true, devis_id: devis.id, devis_number: devisNumber });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});