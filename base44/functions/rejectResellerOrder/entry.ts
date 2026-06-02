import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'pdg') {
      return Response.json({ error: 'Only PDG can reject orders' }, { status: 403 });
    }

    const { order_id, rejection_reason } = await req.json();

    // Get the order
    const order = await base44.entities.Order.filter({ id: order_id }, '', 1);
    if (!order || order.length === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = order[0];

    // Update order approval status
    await base44.entities.Order.update(orderData.id, {
      approval_status: 'rejected',
      status: 'annulee'
    });

    // Delete associated receivable
    const receivables = await base44.entities.Receivable.filter({ order_id: orderData.id }, '', 1);
    if (receivables && receivables.length > 0) {
      await base44.entities.Receivable.delete(receivables[0].id);
    }

    // Revert client balance
    const client = await base44.entities.Client.filter({ name: orderData.client_name }, '', 1);
    if (client && client.length > 0) {
      await base44.entities.Client.update(client[0].id, {
        balance: Math.max(0, (client[0].balance || 0) - orderData.total_amount)
      });
    }

    // Send rejection email to reseller
    await base44.integrations.Core.SendEmail({
      to: orderData.client_email,
      subject: `Commande rejetée - ${orderData.order_number}`,
      body: `
Votre commande a été rejetée.

N° Commande: ${orderData.order_number}
Raison: ${rejection_reason || 'Aucune raison fournie'}

Veuillez contacter l'administration pour plus d'informations.
      `
    });

    return Response.json({ 
      success: true,
      order_id: orderData.id,
      message: 'Commande rejetée et créance supprimée'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});