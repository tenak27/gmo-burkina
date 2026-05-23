/**
 * validateDevisAndCreateDocs
 * Called when a detaillant validates their devis.
 * 1. Updates devis status to "paye" (validated)
 * 2. Creates a Facture from the devis
 * 3. Creates a Bon de Livraison or Bon d'Enlèvement
 * 4. Sends email confirmation with documents list
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { devis_id, order_id, payment_confirmed } = await req.json();

    if (!devis_id) return Response.json({ error: 'devis_id requis' }, { status: 400 });

    // Fetch the devis
    const devisArr = await base44.asServiceRole.entities.Invoice.filter({ id: devis_id });
    const devis = devisArr?.[0];
    if (!devis) return Response.json({ error: 'Devis introuvable' }, { status: 404 });

    // Fetch the order if provided
    let order = null;
    if (order_id) {
      const orderArr = await base44.asServiceRole.entities.Order.filter({ id: order_id });
      order = orderArr?.[0];
    }

    // Mark devis as validated (envoye -> waiting payment)
    await base44.asServiceRole.entities.Invoice.update(devis_id, { status: 'envoye' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // If payment_confirmed = true → create Facture + Bon
    let facture = null;
    let bon = null;

    if (payment_confirmed) {
      // Mark devis as paid
      await base44.asServiceRole.entities.Invoice.update(devis_id, { status: 'paye' });

      // Create Facture
      const factureNumber = `FAC-${Date.now().toString().slice(-8)}`;
      facture = await base44.asServiceRole.entities.Invoice.create({
        type: 'facture',
        number: factureNumber,
        client_name: devis.client_name,
        client_id: devis.client_id || '',
        date: todayStr,
        due_date: todayStr,
        items: devis.items || [],
        subtotal: devis.subtotal || 0,
        tax_rate: devis.tax_rate || 18,
        tax_amount: devis.tax_amount || 0,
        total: devis.total || 0,
        paid_amount: devis.total || 0,
        status: 'paye',
        notes: `Facture issue du devis ${devis.number} · Paiement confirmé`,
      });

      // Create Bon de Livraison or Bon d'Enlèvement
      const deliveryMode = order?.delivery_mode || 'livraison';
      const bonType = deliveryMode === 'enlevement' ? 'bon_enlevement' : 'bon_livraison';
      const bonNumber = `BON-${Date.now().toString().slice(-8)}`;

      bon = await base44.asServiceRole.entities.DeliveryNote.create({
        type: bonType,
        number: bonNumber,
        client_name: devis.client_name,
        client_id: devis.client_id || '',
        date: todayStr,
        items: (devis.items || []).map(it => ({
          name: it.name,
          qty: it.qty || it.quantity || 1,
          unit: 'carton',
          notes: '',
        })),
        warehouse_name: 'Dépôt Central GMO',
        driver: order?.driver_name || '',
        vehicle: '',
        status: 'valide',
        notes: `Bon issu de la facture ${factureNumber} · Commande ${order?.order_number || ''}`,
      });

      // Update order status
      if (order) {
        await base44.asServiceRole.entities.Order.update(order_id, { status: 'confirmee' });
      }

      // Send confirmation email
      if (order?.client_email || devis.client_email) {
        const email = order?.client_email || devis.client_email;
        const emailBody = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
<tr><td style="background:#1A7A2E;padding:28px 36px">
  <div style="background:#fff;display:inline-block;padding:8px 16px;border-radius:8px">
    <span style="color:#1A7A2E;font-size:18px;font-weight:900">GMO BURKINA</span>
  </div>
</td></tr>
<tr><td style="background:#CC1717;height:3px"></td></tr>
<tr><td style="padding:32px 36px">
  <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#1A7A2E">✅ Paiement confirmé — Documents prêts</p>
  <p style="margin:0 0 24px;font-size:14px;color:#666">Bonjour <strong>${devis.client_name}</strong>, votre paiement a été enregistré. Vos documents sont disponibles dans votre espace détaillant.</p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf8;border:1px solid #d4ecd9;border-radius:12px;margin-bottom:28px">
    <tr><td style="padding:20px">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase">Documents générés</p>
      <table width="100%">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#333">📄 Facture officielle</td>
          <td align="right" style="font-size:13px;font-weight:800;color:#1A7A2E">${factureNumber}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#333">${bonType === 'bon_enlevement' ? '🏪 Bon d\'enlèvement' : '🚚 Bon de livraison'}</td>
          <td align="right" style="font-size:13px;font-weight:800;color:#1A7A2E">${bonNumber}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:12px;border-top:1px solid #d4ecd9">
            <span style="font-size:12px;font-weight:700;color:#888">MONTANT TOTAL PAYÉ</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="font-size:20px;font-weight:900;color:#1A7A2E">${Number(devis.total || 0).toLocaleString('fr-FR')} FCFA</td>
        </tr>
      </table>
    </td></tr>
  </table>

  <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:10px;padding:14px 16px;margin-bottom:20px">
    <p style="margin:0;font-size:13px;color:#92400E"><strong>📥 Accédez à vos documents</strong> en vous connectant à votre espace détaillant sur <a href="https://gmo-bf.com" style="color:#1A7A2E">gmo-bf.com</a></p>
  </div>

  <p style="font-size:13px;color:#555">Questions: <strong style="color:#1A7A2E">+226 25 33 19 00</strong> · WhatsApp <strong style="color:#1A7A2E">+226 76 21 16 33</strong></p>
</td></tr>
<tr><td style="background:#1A7A2E;padding:18px 36px;text-align:center">
  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.7)">Groupe Madina Oumarou · gmobfaso.com · infos@gmoburkina.com</p>
</td></tr>
<tr><td style="background:#CC1717;height:3px"></td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `✅ Paiement confirmé — Facture ${factureNumber} disponible — GMO Burkina`,
          body: emailBody,
          from_name: 'GMO Burkina',
        });
      }
    }

    return Response.json({
      success: true,
      devis_validated: true,
      facture_id: facture?.id || null,
      facture_number: facture?.number || null,
      bon_id: bon?.id || null,
      bon_number: bon?.number || null,
      bon_type: bon?.type || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});