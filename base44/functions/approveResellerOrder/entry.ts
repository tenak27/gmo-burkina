import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'pdg') {
      return Response.json({ error: 'Only PDG can approve orders' }, { status: 403 });
    }

    const { order_id } = await req.json();

    // Get the order
    const order = await base44.entities.Order.filter({ id: order_id }, '', 1);
    if (!order || order.length === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = order[0];

    // Update order approval status
    await base44.entities.Order.update(orderData.id, {
      approval_status: 'approved',
      status: 'confirmee'
    });

    // Generate delivery note (bon d'enlèvement)
    const deliveryNote = await base44.entities.DeliveryNote.create({
      type: 'bon_enlevement',
      client_name: orderData.client_name,
      client_id: orderData.client_id,
      date: new Date().toISOString().split('T')[0],
      items: orderData.items || [],
      notes: `Bon d'enlèvement pour commande ${orderData.order_number}`
    });

    // Send confirmation email to reseller
    await base44.integrations.Core.SendEmail({
      to: orderData.client_email,
      subject: `Commande approuvée - ${orderData.order_number}`,
      body: `
Votre commande a été approuvée!

N° Commande: ${orderData.order_number}
Montant: ${orderData.total_amount} FCFA
N° Bon d'enlèvement: ${deliveryNote.id}

Vous pouvez télécharger votre bon d'enlèvement depuis votre espace client.
      `
    });

    return Response.json({ 
      success: true,
      order_id: orderData.id,
      delivery_note_id: deliveryNote.id,
      message: 'Commande approuvée et bon d\'enlèvement généré'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});