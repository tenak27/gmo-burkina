/**
 * onOrderConfirmed — Triggered when an Order status changes to "confirmee".
 * Automatically:
 *  1. Decrements stock_quantity for each product in the order
 *  2. Creates a StockMovement record (sortie) per line item
 *  3. Sends a confirmation email to the client
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data, old_data } = body;

    const newStatus = data?.status;
    const oldStatus = old_data?.status;
    const eventType = event?.type; // "create" | "update"

    // Only act when status is "confirmee"
    // - on update: status just changed to "confirmee" (not from "confirmee" already)
    // - on create: order was created directly with status "confirmee"
    if (newStatus !== "confirmee") {
      return Response.json({ skipped: true, reason: "status not confirmee" });
    }
    // Avoid double-decrement: if already "confirmee" before (update from confirmee to confirmee)
    if (eventType === "update" && oldStatus === "confirmee") {
      return Response.json({ skipped: true, reason: "already confirmee — no change" });
    }

    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ skipped: true, reason: "no items" });
    }

    const results = [];

    for (const item of items) {
      const { product_id, name, qty, unit_price } = item;
      const quantity = parseFloat(qty) || 0;
      if (!product_id || quantity <= 0) continue;

      // Fetch current product
      const products = await base44.asServiceRole.entities.Product.filter({ id: product_id });
      const product = products?.[0];
      if (!product) continue;

      const newStock = Math.max(0, (product.stock_quantity || 0) - quantity);

      // Decrement stock
      await base44.asServiceRole.entities.Product.update(product_id, {
        stock_quantity: newStock,
      });

      // Record StockMovement
      await base44.asServiceRole.entities.StockMovement.create({
        type: "sortie",
        product_id,
        product_name: name || product.name,
        quantity,
        unit_cost: unit_price || product.unit_price || 0,
        reference: data.order_number || data.id,
        reason: `Commande ${data.order_number || ""} — client: ${data.client_name || ""}`,
        date: new Date().toISOString().split("T")[0],
      });

      results.push({ product_id, name: product.name, decremented: quantity, new_stock: newStock });
    }

    // ── SEND CONFIRMATION EMAIL TO CLIENT ──
    const clientEmail = data.client_email;
    if (clientEmail) {
      const orderNumber = data.order_number || data.id?.slice(-8).toUpperCase();
      const clientName = data.client_name || "Client";
      const total = Number(data.total_amount || 0).toLocaleString("fr-FR");
      const deliveryMode = data.delivery_mode === "enlevement" ? "Enlèvement en magasin" : "Livraison à domicile";
      const paymentMethod = {
        especes: "Espèces", cheque: "Chèque", mobile_money: "Mobile Money",
        virement: "Virement bancaire", credit: "Crédit", partiel: "Paiement partiel"
      }[data.payment_method] || data.payment_method || "—";

      const itemsHtml = (data.items || []).map(it =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333">${it.name || "—"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center">${it.qty || 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:right">${Number(it.unit_price || 0).toLocaleString("fr-FR")} FCFA</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:bold;color:#1A7A2E;text-align:right">${Number((it.qty || 1) * (it.unit_price || 0)).toLocaleString("fr-FR")} FCFA</td>
        </tr>`
      ).join("");

      const emailBody = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        
        <!-- Header -->
        <tr>
          <td style="background:#1A7A2E;padding:28px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="background:#fff;display:inline-block;padding:8px 16px;border-radius:8px">
                    <span style="color:#1A7A2E;font-size:18px;font-weight:900;letter-spacing:-0.5px">GMO BURKINA</span>
                  </div>
                  <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:4px">Groupe Madina Oumarou</div>
                </td>
                <td align="right">
                  <div style="color:#fff;font-size:13px;font-weight:bold;opacity:0.9">CONFIRMATION</div>
                  <div style="color:#fff;font-size:11px;opacity:0.6">de commande</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="background:#CC1717;height:3px"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px">
            <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#1A7A2E">✅ Commande confirmée !</p>
            <p style="margin:0 0 24px;font-size:14px;color:#666">Bonjour <strong style="color:#111">${clientName}</strong>, votre commande a bien été confirmée.</p>

            <!-- Order info box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf8;border:1px solid #d4ecd9;border-radius:12px;margin-bottom:24px">
              <tr>
                <td style="padding:16px 20px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:12px;color:#888;padding-bottom:4px">N° de commande</td>
                      <td align="right" style="font-size:14px;font-weight:900;color:#1A7A2E">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size:12px;color:#888;padding-bottom:4px">Mode de livraison</td>
                      <td align="right" style="font-size:13px;color:#333">${deliveryMode}</td>
                    </tr>
                    <tr>
                      <td style="font-size:12px;color:#888">Mode de paiement</td>
                      <td align="right" style="font-size:13px;color:#333">${paymentMethod}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Items table -->
            <p style="font-size:12px;font-weight:700;color:#888;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px">Récapitulatif articles</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:20px">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;color:#888;font-weight:700;text-transform:uppercase">Article</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;color:#888;font-weight:700;text-transform:uppercase">Qté</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;font-weight:700;text-transform:uppercase">Prix u.</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;font-weight:700;text-transform:uppercase">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A7A2E;border-radius:10px;margin-bottom:28px">
              <tr>
                <td style="padding:14px 20px;color:rgba(255,255,255,0.8);font-size:13px">MONTANT TOTAL</td>
                <td align="right" style="padding:14px 20px;color:#fff;font-size:20px;font-weight:900">${total} FCFA</td>
              </tr>
            </table>

            ${data.notes ? `<p style="font-size:12px;color:#888;background:#f9f9f9;border-left:3px solid #1A7A2E;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:24px"><strong>Note :</strong> ${data.notes}</p>` : ""}

            <p style="font-size:13px;color:#555;margin:0">Pour toute question, contactez-nous au <strong style="color:#1A7A2E">+226 25 33 19 00</strong> ou par WhatsApp au <strong style="color:#1A7A2E">+226 76 21 16 33</strong>.</p>
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

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: clientEmail,
        subject: `✅ Commande ${orderNumber} confirmée — GMO Burkina`,
        body: emailBody,
        from_name: "GMO Burkina",
      });
    }

    return Response.json({ success: true, updated: results, email_sent: !!clientEmail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});