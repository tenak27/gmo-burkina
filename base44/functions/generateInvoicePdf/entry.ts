import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

function generateQrCodeData(invoiceId, invoiceNumber, total) {
  return `GMO-VERIFY:${invoiceId}:${invoiceNumber}:${total}:${Date.now()}`;
}

// Simple QR code as visual grid (no external dependency)
function drawSimpleQR(doc, x, y, size, data) {
  // Draw border box
  doc.setDrawColor(26, 122, 46);
  doc.setLineWidth(0.5);
  doc.rect(x, y, size, size);
  
  // Draw QR-like pattern (simplified visual indicator)
  const cell = size / 10;
  doc.setFillColor(26, 122, 46);
  
  // Top-left finder pattern
  doc.rect(x + cell, y + cell, cell * 3, cell * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cell * 1.5, y + cell * 1.5, cell * 2, cell * 2, 'F');
  doc.setFillColor(26, 122, 46);
  doc.rect(x + cell * 2, y + cell * 2, cell, cell, 'F');
  
  // Top-right finder pattern
  doc.rect(x + cell * 6, y + cell, cell * 3, cell * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cell * 6.5, y + cell * 1.5, cell * 2, cell * 2, 'F');
  doc.setFillColor(26, 122, 46);
  doc.rect(x + cell * 7, y + cell * 2, cell, cell, 'F');
  
  // Bottom-left finder pattern
  doc.rect(x + cell, y + cell * 6, cell * 3, cell * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cell * 1.5, y + cell * 6.5, cell * 2, cell * 2, 'F');
  doc.setFillColor(26, 122, 46);
  doc.rect(x + cell * 2, y + cell * 7, cell, cell, 'F');
  
  // Data text below QR
  doc.setFontSize(5);
  doc.setTextColor(100, 100, 100);
  doc.text("VÉRIFIER SUR: gmobfaso.com/verify", x, y + size + 4);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { invoiceId } = await req.json();
    if (!invoiceId) return Response.json({ error: "invoiceId requis" }, { status: 400 });

    const invoice = await base44.asServiceRole.entities.Invoice.filter({ id: invoiceId });
    const inv = invoice?.[0];
    if (!inv) return Response.json({ error: "Facture introuvable" }, { status: 404 });

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, H = 297;

    // ── HEADER ──
    doc.setFillColor(26, 122, 46);
    doc.rect(0, 0, W, 40, 'F');
    doc.setFillColor(204, 23, 23);
    doc.rect(0, 40, W, 2, 'F');

    // Logo area (white box)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 7, 52, 26, 2, 2, 'F');
    doc.setTextColor(26, 122, 46);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("GMO BURKINA", 38, 21, { align: "center" });
    doc.setFontSize(6.5);
    doc.setTextColor(100, 150, 100);
    doc.text("Groupe Madina Oumarou", 38, 28, { align: "center" });

    // Doc type
    const typeLabel = { facture: "FACTURE", proforma: "PROFORMA", devis: "DEVIS" }[inv.type] || "DOCUMENT";
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(typeLabel, W - 14, 18, { align: "right" });
    doc.setFontSize(11);
    doc.text(inv.number || "—", W - 14, 28, { align: "right" });

    // ── COMPANY INFO ──
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    let y = 52;
    const companyLines = [
      "Quartier Dapoya, Parcelle 05, Lot 29, Section BI",
      "01 BP 3370 · Ouagadougou, Burkina Faso",
      "Tél: +226 25 33 19 00 · WhatsApp: +226 76 21 16 33",
      "Email: infos@gmoburkina.com · www.gmobfaso.com",
    ];
    companyLines.forEach(l => { doc.text(l, 14, y); y += 5; });

    // ── CLIENT BOX ──
    doc.setFillColor(246, 248, 250);
    doc.roundedRect(110, 48, 86, 36, 3, 3, 'F');
    doc.setDrawColor(210, 220, 210);
    doc.setLineWidth(0.3);
    doc.roundedRect(110, 48, 86, 36, 3, 3, 'S');

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURER À", 118, 55);
    doc.setTextColor(26, 122, 46);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text(inv.client_name || "—", 118, 63);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    if (inv.date) doc.text(`Émis le: ${new Date(inv.date).toLocaleDateString("fr-FR")}`, 118, 70);
    if (inv.due_date) doc.text(`Échéance: ${new Date(inv.due_date).toLocaleDateString("fr-FR")}`, 118, 76);

    // ── STATUS BADGE ──
    const statusColors = { paye:[26,122,46], envoye:[59,130,246], brouillon:[150,150,150], partiel:[245,158,11], annule:[204,23,23] };
    const sc = statusColors[inv.status] || [150,150,150];
    doc.setFillColor(...sc);
    doc.roundedRect(14, 90, 28, 8, 2, 2, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(7);
    doc.setFont("helvetica","bold");
    const statusLbl = {paye:"PAYÉ",envoye:"ENVOYÉ",brouillon:"BROUILLON",partiel:"PARTIEL",annule:"ANNULÉ"}[inv.status]||inv.status;
    doc.text(statusLbl, 28, 95.5, { align:"center" });

    y = 108;

    // ── TABLE HEADER ──
    doc.setFillColor(30, 30, 30);
    doc.rect(14, y, W - 28, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 18, y + 6);
    doc.text("QTÉ", 120, y + 6, { align: "right" });
    doc.text("P.U. FCFA", 150, y + 6, { align: "right" });
    doc.text("TOTAL FCFA", W - 16, y + 6, { align: "right" });
    y += 9;

    // ── TABLE ROWS ──
    const items = inv.items || [];
    if (items.length === 0) {
      items.push({ name: "Prestation / Produit", qty: 1, unit_price: inv.subtotal || inv.total });
    }

    items.forEach((item, idx) => {
      const rowBg = idx % 2 === 0;
      if (rowBg) { doc.setFillColor(250, 252, 250); doc.rect(14, y, W - 28, 9, 'F'); }
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(String(item.name || item.description || "—"), 18, y + 6);
      doc.text(String(item.qty || item.quantity || 1), 120, y + 6, { align: "right" });
      doc.text(Number(item.unit_price || 0).toLocaleString("fr-FR"), 150, y + 6, { align: "right" });
      const lineTotal = (item.qty || item.quantity || 1) * (item.unit_price || 0);
      doc.text(Number(lineTotal || 0).toLocaleString("fr-FR"), W - 16, y + 6, { align: "right" });
      y += 9;
    });

    // ── TOTALS ──
    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(W - 80, y, W - 14, y);

    const totals = [
      ["Sous-total HT", Number(inv.subtotal || 0).toLocaleString("fr-FR") + " FCFA"],
      [`TVA (${inv.tax_rate || 18}%)`, Number(inv.tax_amount || 0).toLocaleString("fr-FR") + " FCFA"],
      ["TOTAL TTC", Number(inv.total || 0).toLocaleString("fr-FR") + " FCFA"],
    ];
    y += 7;
    totals.forEach(([label, val], i) => {
      doc.setFontSize(i === 2 ? 11 : 8.5);
      doc.setFont("helvetica", i === 2 ? "bold" : "normal");
      doc.setTextColor(i === 2 ? 26 : 80, i === 2 ? 122 : 80, i === 2 ? 46 : 80);
      doc.text(label, W - 80, y);
      doc.text(val, W - 14, y, { align: "right" });
      y += i === 2 ? 0 : 7;
    });

    if (inv.paid_amount > 0) {
      y += 10;
      doc.setFontSize(9);
      doc.setTextColor(26, 122, 46);
      doc.setFont("helvetica", "bold");
      doc.text(`Montant payé: ${Number(inv.paid_amount).toLocaleString("fr-FR")} FCFA`, W - 14, y, { align: "right" });
      const reste = (inv.total || 0) - (inv.paid_amount || 0);
      if (reste > 0) {
        y += 7;
        doc.setTextColor(204, 23, 23);
        doc.text(`Reste à payer: ${Number(reste).toLocaleString("fr-FR")} FCFA`, W - 14, y, { align: "right" });
      }
    }

    // ── NOTES ──
    if (inv.notes) {
      y += 15;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(14, y, 120, 20, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES:", 18, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(inv.notes.substring(0, 120), 18, y + 13);
    }

    // ── QR CODE ──
    const qrX = 155, qrY = y > 220 ? y : 220;
    drawSimpleQR(doc, qrX, qrY, 30, generateQrCodeData(inv.id, inv.number, inv.total));

    // ── FOOTER ──
    doc.setFillColor(26, 122, 46);
    doc.rect(0, H - 18, W, 18, 'F');
    doc.setFillColor(204, 23, 23);
    doc.rect(0, H - 20, W, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text("Groupe Madina Oumarou — RCCM: BF-OUA-XXXX — IFU: XXXXXXXXXX", W / 2, H - 11, { align: "center" });
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255, 0.7);
    doc.text("Ce document est généré automatiquement par le système GMO ERP · IAM TECHNOLOGY", W / 2, H - 5.5, { align: "center" });

    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=GMO-${inv.number || inv.type}-${inv.client_name}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});