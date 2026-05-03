/**
 * onOrderConfirmed — Triggered when an Order status changes to "confirmee" or "livree".
 * Automatically:
 *  1. Decrements stock_quantity for each product in the order
 *  2. Creates a StockMovement record (sortie) per line item
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

    return Response.json({ success: true, updated: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});