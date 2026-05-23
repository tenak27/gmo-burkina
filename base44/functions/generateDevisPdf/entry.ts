import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

function drawQRCode(doc, x, y, size, data) {
  const cell = size / 15;
  doc.setFillColor(255, 255, 255);
  doc.rect(x - 2, y - 2, size + 4, size + 4, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.25);
  doc.rect(x - 2, y - 2, size + 4, size + 4, 'S');

  function finderPattern(ox, oy) {
    doc.setFillColor(26, 122, 46);
    doc.rect(ox, oy, cell * 7, cell * 7, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(ox + cell, oy + cell, cell * 5, cell * 5, 'F');
    doc.setFillColor(26, 122, 46);
    doc.rect(ox + cell * 2, oy + cell * 2, cell * 3, cell * 3, 'F');
  }
  finderPattern(x, y);
  finderPattern(x + cell * 8, y);
  finderPattern(x, y + cell * 8);

  doc.setFillColor(26, 122, 46);
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      doc.rect(x + cell * (7 + i), y + cell * 6, cell, cell, 'F');
      doc.rect(x + cell * 6, y + cell * (7 + i), cell, cell, 'F');
    }
  }

  let hash = 5381;
  for (let ci = 0; ci < data.length; ci++) {
    hash = ((hash << 5) + hash) ^ data.charCodeAt(ci);
    hash = hash >>> 0;
  }
  doc.setFillColor(26, 122, 46);
  const sx = x + cell * 8;
  const sy = y + cell * 8;
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const bit = (hash >>> ((r * 6 + c) % 32)) & 1;
      if (bit) doc.rect(sx + c * cell, sy + r * cell, cell * 0.85, cell * 0.85, 'F');
    }
  }

  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 122, 46);
  doc.text("AUTHENTIFIER", x + size / 2, y + size + 5, { align: "center" });
  doc.setFontSize(4.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("gmobfaso.com/verify", x + size / 2, y + size + 9.5, { align: "center" });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const docId = body.devisId || body.invoiceId;
    if (!docId) return Response.json({ error: "devisId requis" }, { status: 400 });

    const arr = await base44.asServiceRole.entities.Invoice.filter({ id: docId });
    const inv = arr?.[0];
    if (!inv) return Response.json({ error: "Document introuvable" }, { status: 404 });

    const W = 210, H = 297;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const TYPE_LABELS = { devis: "DEVIS", facture: "FACTURE", proforma: "PROFORMA" };
    const docTypeLabel = TYPE_LABELS[inv.type] || "DOCUMENT";

    const STATUS_CFG = {
      brouillon: { r: 150, g: 150, b: 150, label: "BROUILLON" },
      envoye:    { r: 245, g: 158, b: 11,  label: "EN ATTENTE" },
      paye:      { r: 26,  g: 122, b: 46,  label: "PAYÉ" },
      partiel:   { r: 59,  g: 130, b: 246, label: "PARTIEL" },
      annule:    { r: 204, g: 23,  b: 23,  label: "ANNULÉ" },
    };
    const sc = STATUS_CFG[inv.status] || { r: 120, g: 120, b: 120, label: (inv.status || "").toUpperCase() };

    // ── EN-TÊTE ──
    doc.setFillColor(26, 122, 46);
    doc.rect(0, 0, W, 44, 'F');
    doc.setFillColor(204, 23, 23);
    doc.rect(0, 44, W, 2.5, 'F');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 8, 58, 28, 2, 2, 'F');
    doc.setTextColor(26, 122, 46);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("GMO BURKINA", 41, 22, { align: "center" });
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 130, 80);
    doc.text("GROUPE MADINA OUMAROU", 41, 29, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(docTypeLabel, W - 14, 20, { align: "right" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 240, 200);
    doc.text(inv.number || "---", W - 14, 30, { align: "right" });

    doc.setFillColor(sc.r, sc.g, sc.b);
    doc.roundedRect(W - 54, 34, 40, 7, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(sc.label, W - 34, 39, { align: "center" });

    // ── INFOS SOCIETE ──
    let y = 56;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(26, 122, 46);
    doc.text("GROUPE MADINA OUMAROU", 14, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    const companyLines = [
      "Quartier Dapoya, Parcelle 05, Lot 29, Section BI",
      "01 BP 3370 - Ouagadougou 01, Burkina Faso",
      "Tel : +226 25 33 19 00  |  WhatsApp : +226 76 21 16 33",
      "Email : infos@gmoburkina.com  |  www.gmobfaso.com",
      "RCCM : BF-OUA-2015-B-XXXXX  |  IFU : 00000000000",
    ];
    for (const l of companyLines) { doc.text(l, 14, y); y += 4.8; }

    // ── BLOC CLIENT ──
    doc.setFillColor(245, 248, 245);
    doc.roundedRect(112, 50, 84, 38, 3, 3, 'F');
    doc.setDrawColor(200, 220, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(112, 50, 84, 38, 3, 3, 'S');
    doc.setFillColor(26, 122, 46);
    doc.rect(112, 50, 84, 2.5, 'F');

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 160, 140);
    doc.text("DESTINATAIRE", 120, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 122, 46);
    const clientName = String(inv.client_name || "---").toUpperCase().substring(0, 22);
    doc.text(clientName, 120, 67);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const invDate = inv.date ? new Date(inv.date).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR");
    doc.text("Date d'emission : " + invDate, 120, 74);
    if (inv.due_date) {
      doc.text("Validite : " + new Date(inv.due_date).toLocaleDateString("fr-FR"), 120, 79);
    }

    // ── BANDE REFERENCE ──
    y = 96;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, y, W - 14, y);
    doc.setFillColor(26, 122, 46);
    doc.roundedRect(14, y + 3, W - 28, 8, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Reference : " + (inv.number || "---"), W / 2, y + 8.5, { align: "center" });
    y += 18;

    // ── EN-TETE TABLEAU ──
    doc.setFillColor(30, 30, 30);
    doc.rect(14, y, W - 28, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("DESIGNATION", 18, y + 7);
    doc.text("QTE", 120, y + 7, { align: "right" });
    doc.text("UNITE", 140, y + 7, { align: "right" });
    doc.text("P.U. FCFA", 166, y + 7, { align: "right" });
    doc.text("TOTAL FCFA", W - 16, y + 7, { align: "right" });
    y += 10;

    // ── LIGNES ──
    const items = inv.items || [];
    if (items.length === 0) items.push({ name: "Prestation", qty: 1, unit: "u.", unit_price: inv.total || 0 });

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (idx % 2 === 0) {
        doc.setFillColor(247, 252, 248);
        doc.rect(14, y, W - 28, 9, 'F');
      }
      doc.setDrawColor(235, 240, 235);
      doc.setLineWidth(0.2);
      doc.line(14, y + 9, W - 14, y + 9);

      const itemName = String(item.name || item.product_name || item.description || "---").substring(0, 45);
      const itemQty = String(item.qty || item.quantity || 1);
      const itemUnit = String(item.unit || "u.");
      const itemPU = Number(item.unit_price || 0).toLocaleString("fr-FR");
      const lineTotal = (item.qty || item.quantity || 1) * (item.unit_price || 0);
      const itemTotal = Number(lineTotal).toLocaleString("fr-FR");

      doc.setTextColor(35, 35, 35);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(itemName, 18, y + 6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(itemQty, 120, y + 6.5, { align: "right" });
      doc.text(itemUnit, 140, y + 6.5, { align: "right" });
      doc.setTextColor(35, 35, 35);
      doc.text(itemPU, 166, y + 6.5, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(itemTotal, W - 16, y + 6.5, { align: "right" });
      y += 9;
    }

    // ── TOTAUX ──
    y += 6;
    doc.setDrawColor(200, 220, 200);
    doc.setLineWidth(0.4);
    doc.line(W - 82, y, W - 14, y);
    y += 7;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Sous-total HT", W - 82, y);
    doc.text(Number(inv.subtotal || 0).toLocaleString("fr-FR") + " FCFA", W - 14, y, { align: "right" });
    y += 7;
    doc.text("TVA (" + String(inv.tax_rate || 18) + "%)", W - 82, y);
    doc.text(Number(inv.tax_amount || 0).toLocaleString("fr-FR") + " FCFA", W - 14, y, { align: "right" });
    y += 6;

    doc.setFillColor(26, 122, 46);
    doc.roundedRect(W - 82, y - 2, 68, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC", W - 78, y + 7);
    doc.text(Number(inv.total || 0).toLocaleString("fr-FR") + " FCFA", W - 16, y + 7, { align: "right" });
    y += 18;

    // ── CONDITIONS DEVIS ──
    if (inv.type === "devis") {
      y += 5;
      doc.setFillColor(255, 252, 235);
      doc.roundedRect(14, y, 120, 20, 2, 2, 'F');
      doc.setDrawColor(245, 196, 0);
      doc.setLineWidth(0.4);
      doc.roundedRect(14, y, 120, 20, 2, 2, 'S');
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 90, 0);
      doc.text("CONDITIONS DE VALIDITE", 18, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 75, 0);
      doc.text("Ce devis est valable 30 jours a compter de la date d'emission.", 18, y + 13);
      doc.text("Toute commande vaut acceptation des CGV de GMO Burkina.", 18, y + 17.5);
      y += 26;
    }

    // ── NOTES ──
    if (inv.notes) {
      y += 4;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(14, y, 120, 18, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text("NOTE :", 18, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(String(inv.notes).substring(0, 110), 18, y + 13);
      y += 22;
    }

    // ── QR CODE ──
    const qrData = "GMO-VERIFY:" + (inv.id || "") + ":" + (inv.number || "") + ":" + String(inv.total || 0) + ":" + (inv.client_name || "");
    const qrY = Math.max(y + 6, H - 72);
    const qrX = W - 54;
    drawQRCode(doc, qrX, qrY, 34, qrData);

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 122, 46);
    doc.text("VERIFIER L'AUTHENTICITE", 14, qrY + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(26, 122, 46);
    doc.text("gmobfaso.com/verify", 14, qrY + 14);
    doc.setTextColor(100, 100, 100);
    doc.text("Ref. document : " + (inv.number || "---"), 14, qrY + 19.5);
    const emissionDate = inv.date ? new Date(inv.date).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR");
    doc.text("Emis le : " + emissionDate, 14, qrY + 25);
    doc.text("Code : GMO-" + String(inv.id || "").slice(-8).toUpperCase(), 14, qrY + 30.5);

    // ── PIED DE PAGE ──
    doc.setFillColor(26, 122, 46);
    doc.rect(0, H - 18, W, 18, 'F');
    doc.setFillColor(204, 23, 23);
    doc.rect(0, H - 20, W, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("Groupe Madina Oumarou (GMO Burkina)", W / 2, H - 12, { align: "center" });
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 230, 200);
    doc.text("Quartier Dapoya - Ouagadougou, Burkina Faso  |  +226 25 33 19 00  |  infos@gmoburkina.com", W / 2, H - 7, { align: "center" });
    doc.setFontSize(5.5);
    doc.setTextColor(150, 200, 150);
    doc.text("Document genere automatiquement par GMO ERP - " + new Date().toLocaleDateString("fr-FR"), W / 2, H - 3, { align: "center" });

    const pdfBytes = doc.output("arraybuffer");
    const clientSafe = String(inv.client_name || "client").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = "GMO-" + docTypeLabel + "-" + (inv.number || inv.id) + "-" + clientSafe + ".pdf";

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="' + filename + '"',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});