import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const docId = body.devisId || body.invoiceId;
    if (!docId) return Response.json({ error: "devisId requis" }, { status: 400 });

    const arr = await base44.asServiceRole.entities.Invoice.filter({ id: docId });
    const inv = arr?.[0];
    if (!inv) return Response.json({ error: "Document introuvable" }, { status: 404 });

    // Always return JSON with the invoice data for frontend HTML rendering
    return Response.json({ invoice: inv });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});