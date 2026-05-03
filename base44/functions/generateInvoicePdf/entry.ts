import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';
import QRCode from 'npm:qrcode@1.5.3';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const body = await req.json();
    const { invoiceId, orderId } = body;

    let doc_data = null;
    let doc_type = 'facture';

    if (invoiceId) {
      const invoices = await base44.asServiceRole.entities.Invoice.filter({ id: invoiceId });
      doc_data = invoices?.[0];
      doc_type = doc_data?.type || 'facture';
    } else if (orderId) {
      const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
      const order = orders?.[0];
      if (!order) return Response.json({ error: 'Commande introuvable' }, { status: 404 });
      // Build invoice data from order
      doc_data = {
        number: order.order_number || `FAC-${orderId.slice(-6)}`,
        type: 'facture',
        client_name: order.client_name || order.client_email,
        date: order.created_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        items: order.items || [],
        subtotal: order.total_amount || 0,
        tax_rate: 18,
        total: order.total_amount || 0,
        status: order.status,
        notes: order.notes || '',
        delivery_city: order.delivery_city || '',
      };
      doc_type = 'facture';
    }

    if (!doc_data) {
      return Response.json({ error: 'Document introuvable' }, { status: 404 });
    }

    // QR Code content
    const verifyUrl = `https://gmoburkina.com/verifier?doc=${doc_data.number || 'N/A'}&date=${doc_data.date || ''}&total=${doc_data.total || 0}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 80, margin: 1, color: { dark: '#1C1C1E', light: '#FFFFFF' } });

    // Build PDF
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const M = 15; // margin

    // ─── HEADER ───
    pdf.setFillColor(28, 28, 30); // obsidian
    pdf.rect(0, 0, W, 45, 'F');

    // Logo text (no image loading in Deno)
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('GMO BURKINA', M, 18);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(160, 160, 160);
    pdf.text('GROUPE MADINA OUMAROU · Ouagadougou, Burkina Faso', M, 24);
    pdf.text('+226 25 33 19 00 · infos@gmoburkina.com', M, 29);

    // Doc type badge
    const typeLabel = { facture: 'FACTURE', proforma: 'PROFORMA', devis: 'DEVIS' }[doc_type] || 'DOCUMENT';
    const badgeColor = doc_type === 'facture' ? [26, 122, 46] : doc_type === 'proforma' ? [37, 99, 235] : [245, 196, 0];
    pdf.setFillColor(...badgeColor);
    pdf.roundedRect(W - M - 35, 8, 35, 12, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(typeLabel, W - M - 17.5, 16, { align: 'center' });

    // ─── DOC INFO BOX ───
    pdf.setFillColor(245, 196, 0); // gold accent line
    pdf.rect(M, 52, 0.8, 28, 'F');

    pdf.setTextColor(28, 28, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(`N° ${doc_data.number || '—'}`, M + 4, 60);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date : ${doc_data.date || '—'}`, M + 4, 67);
    if (doc_data.due_date) pdf.text(`Échéance : ${doc_data.due_date}`, M + 4, 73);

    // ─── CLIENT BLOCK ───
    pdf.setFillColor(248, 248, 246);
    pdf.roundedRect(W / 2 + 5, 50, W / 2 - M - 5, 35, 3, 3, 'F');
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESTINATAIRE', W / 2 + 10, 58);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(28, 28, 30);
    pdf.text(doc_data.client_name || '—', W / 2 + 10, 65);
    if (doc_data.delivery_city) {
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(doc_data.delivery_city, W / 2 + 10, 71);
    }

    // ─── ITEMS TABLE ───
    const tableY = 93;
    // Header
    pdf.setFillColor(28, 28, 30);
    pdf.rect(M, tableY, W - 2 * M, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    const cols = { desc: M + 3, qty: 115, up: 140, total: 165 };
    pdf.text('DÉSIGNATION', cols.desc, tableY + 5.2);
    pdf.text('QTÉ', cols.qty, tableY + 5.2, { align: 'center' });
    pdf.text('PRIX U.', cols.up, tableY + 5.2, { align: 'center' });
    pdf.text('MONTANT', cols.total, tableY + 5.2, { align: 'center' });

    const items = Array.isArray(doc_data.items) && doc_data.items.length > 0
      ? doc_data.items
      : [{ name: doc_data.client_name ? 'Prestation / Commande' : '—', qty: 1, unit_price: doc_data.subtotal || doc_data.total || 0 }];

    let rowY = tableY + 8;
    pdf.setTextColor(28, 28, 30);
    items.forEach((item, i) => {
      if (i % 2 === 1) {
        pdf.setFillColor(248, 248, 246);
        pdf.rect(M, rowY, W - 2 * M, 8, 'F');
      }
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(String(item.name || item.product_name || `Article ${i + 1}`).slice(0, 50), cols.desc, rowY + 5.2);
      pdf.text(String(item.qty || item.quantity || 1), cols.qty, rowY + 5.2, { align: 'center' });
      const up = item.unit_price || item.wholesale_price || 0;
      pdf.text(`${Number(up).toLocaleString('fr-FR')} FCFA`, cols.up, rowY + 5.2, { align: 'center' });
      const lineTotal = (item.qty || item.quantity || 1) * up;
      pdf.text(`${Number(lineTotal).toLocaleString('fr-FR')} FCFA`, cols.total, rowY + 5.2, { align: 'center' });
      rowY += 8;
    });

    // Separator
    pdf.setDrawColor(230, 230, 230);
    pdf.line(M, rowY + 2, W - M, rowY + 2);

    // ─── TOTALS ───
    const totY = rowY + 8;
    const sub = doc_data.subtotal || doc_data.total || 0;
    const tax = doc_data.tax_rate || 18;
    const taxAmt = doc_data.tax_amount || Math.round(sub * tax / 100);
    const total = doc_data.total || sub;

    [
      { label: 'Sous-total HT', value: `${Number(sub).toLocaleString('fr-FR')} FCFA`, bold: false },
      { label: `TVA (${tax}%)`, value: `${Number(taxAmt).toLocaleString('fr-FR')} FCFA`, bold: false },
    ].forEach((row, i) => {
      pdf.setFont('helvetica', row.bold ? 'bold' : 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 100, 100);
      pdf.text(row.label, W - M - 55, totY + i * 7);
      pdf.text(row.value, W - M, totY + i * 7, { align: 'right' });
    });

    // Total TTC box
    pdf.setFillColor(26, 122, 46);
    pdf.roundedRect(W - M - 60, totY + 15, 60, 12, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('TOTAL TTC', W - M - 55, totY + 22.5);
    pdf.setFontSize(10);
    pdf.text(`${Number(total).toLocaleString('fr-FR')} FCFA`, W - M - 2, totY + 22.5, { align: 'right' });

    // ─── QR CODE ───
    const qrY = totY + 33;
    try {
      const qrBase64 = qrDataUrl.split(',')[1];
      pdf.addImage(qrBase64, 'PNG', M, qrY, 22, 22);
    } catch (_) {}
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('Scannez pour vérifier', M, qrY + 24);
    pdf.text("l'authenticité du document", M, qrY + 28);

    // Notes
    if (doc_data.notes) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(7.5);
      pdf.setTextColor(130, 130, 130);
      pdf.text(`Note : ${doc_data.notes}`, M + 28, qrY + 5);
    }

    // ─── FOOTER ───
    const footY = 272;
    pdf.setFillColor(248, 248, 246);
    pdf.rect(0, footY, W, 25, 'F');
    pdf.setDrawColor(230, 230, 230);
    pdf.line(0, footY, W, footY);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('Groupe Madina Oumarou · SARL · RCCM : BF-OUA-2005-B-2247 · NIF : 00023456X', W / 2, footY + 7, { align: 'center' });
    pdf.text('Quartier Dapoya, 01 BP 3370, Ouagadougou · +226 25 33 19 00 · infos@gmoburkina.com', W / 2, footY + 13, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 122, 46);
    pdf.text('Conçu par IAM TECHNOLOGY · Armand Olivier KONATE', W / 2, footY + 20, { align: 'center' });

    const pdfBytes = pdf.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${typeLabel}-${doc_data.number || 'GMO'}.pdf"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});