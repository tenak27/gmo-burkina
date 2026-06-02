import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order } = await req.json();

    // Create order with pending_pdg_approval status
    const createdOrder = await base44.entities.Order.create({
      ...order,
      approval_status: 'pending_pdg_approval'
    });

    // Create receivable for the order
    await base44.entities.Receivable.create({
      client_id: createdOrder.client_id,
      client_name: createdOrder.client_name,
      order_id: createdOrder.id,
      original_amount: createdOrder.total_amount,
      paid_amount: 0,
      remaining_amount: createdOrder.total_amount,
      due_date: createdOrder.estimated_delivery,
      status: 'en_cours'
    });

    // Update client balance
    const client = await base44.entities.Client.filter({ name: createdOrder.client_name }, '', 1);
    if (client && client.length > 0) {
      await base44.entities.Client.update(client[0].id, {
        balance: (client[0].balance || 0) + createdOrder.total_amount
      });
    }

    // Get company settings for PDG email
    const settings = await base44.entities.CompanySettings.list('', 1);
    const pdgEmail = settings && settings.length > 0 ? settings[0].email : null;

    // Send approval email to PDG
    if (pdgEmail) {
      const approvalLink = `${req.headers.get('origin')}/approve-reseller-order?order_id=${createdOrder.id}`;
      const rejectLink = `${req.headers.get('origin')}/reject-reseller-order?order_id=${createdOrder.id}`;

      await base44.integrations.Core.SendEmail({
        to: pdgEmail,
        subject: `Approbation requise - Commande revendeur ${createdOrder.order_number}`,
        body: `
Nouvelle demande de commande revendeur:
- Client: ${createdOrder.client_name}
- Montant: ${createdOrder.total_amount} FCFA
- Date: ${new Date().toLocaleDateString('fr-FR')}

Approuver: ${approvalLink}
Rejeter: ${rejectLink}
        `
      });
    }

    return Response.json({ 
      success: true, 
      order_id: createdOrder.id,
      message: 'Commande créée et approuvée en attente du PDG'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});