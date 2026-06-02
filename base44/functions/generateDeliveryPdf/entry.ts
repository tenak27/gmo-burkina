import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { deliveryId } = await req.json();
    if (!deliveryId) return Response.json({ error: "deliveryId requis" }, { status: 400 });

    const results = await base44.asServiceRole.entities.DeliveryNote.filter({ id: deliveryId });
    const bon = results?.[0];
    if (!bon) return Response.json({ error: "Bon introuvable" }, { status: 404 });

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, H = 297;

    // ── HEADER ──
    doc.setFillColor(26, 122, 46);
    doc.rect(0, 0, W, 38, 'F');
    doc.setFillColor(204, 23, 23);
    doc.rect(0, 38, W, 2, 'F');

    // Logo / Company name
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 7, 52, 24, 2, 2, 'F');
    doc.setTextColor(26, 122, 46);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GMO BURKINA", 38, 20, { align: "center" });
    doc.setFontSize(6.5);
    doc.setTextColor(100, 150, 100);
    doc.text("Groupe Madina Oumarou", 38, 27, { align: "center" });

    // Doc type title
    const typeLabel = {
      bon_livraison: "BON DE LIVRAISON",
      bon_enlevement: "BON D'ENLÈVEMENT",
      bon_commande: "BON DE COMMANDE",
    }[bon.type] || "BON DE TRANSPORT";

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(typeLabel, W - 14, 18, { align: "right" });
    doc.setFontSize(10);
    doc.text(bon.number || "—", W - 14, 28, { align: "right" });

    // ── INFO BLOCK ──
    let y = 50;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const infoLeft = [
      "Quartier Dapoya, Parcelle 05, Lot 29",
      "01 BP 3370 · Ouagadougou, Burkina Faso",
      "Tél: +226 25 33 19 00",
    ];
    infoLeft.forEach(l => { doc.text(l, 14, y); y += 5; });

    // Right: client / date info
    doc.setFillColor(246, 248, 250);
    doc.roundedRect(110, 46, 86, 30, 3, 3, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(110, 46, 86, 30, 3, 3, 'S');

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("DESTINATAIRE / CLIENT", 118, 53);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.text(bon.client_name || bon.supplier_name || "—", 118, 61);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    if (bon.date) doc.text(`Date: ${new Date(bon.date).toLocaleDateString("fr-FR")}`, 118, 69);

    y = 86;

    // ── LOGISTICS INFO ──
    const logistics = [
      ["Chauffeur", bon.driver || "—"],
      ["Véhicule / Immat.", bon.vehicle || "—"],
      ["Entrepôt", bon.warehouse_name || "—"],
    ];

    doc.setFillColor(26, 122, 46);
    doc.rect(14, y, W - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS LOGISTIQUES", 18, y + 5.5);
    y += 8;

    logistics.forEach(([label, val]) => {
      doc.setFillColor(250, 252, 250);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(14, y + 8, W - 14, y + 8);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(label, 18, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(val), 80, y + 5.5);
      y += 8;
    });

    y += 8;

    // ── ITEMS TABLE ──
    doc.setFillColor(30, 30, 30);
    doc.rect(14, y, W - 28, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("DÉSIGNATION", 18, y + 6);
    doc.text("QTÉ", 130, y + 6, { align: "right" });
    doc.text("UNITÉ", 160, y + 6, { align: "right" });
    doc.text("OBSERVATIONS", W - 16, y + 6, { align: "right" });
    y += 9;

    const items = bon.items || [];
    if (items.length === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(14, y, W - 28, 9, 'F');
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("Aucun article renseigné", 18, y + 6);
      y += 9;
    } else {
      items.forEach((item, idx) => {
        if (idx % 2 === 0) { doc.setFillColor(250, 252, 250); doc.rect(14, y, W - 28, 9, 'F'); }
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(String(item.name || item.description || "—"), 18, y + 6);
        doc.text(String(item.qty || item.quantity || "—"), 130, y + 6, { align: "right" });
        doc.text(String(item.unit || "u."), 160, y + 6, { align: "right" });
        doc.text(String(item.notes || ""), W - 16, y + 6, { align: "right" });
        y += 9;
      });
    }

    // ── STATUS ──
    y += 6;
    const statusColors = { brouillon: [150,150,150], valide: [59,130,246], livre: [26,122,46], annule: [204,23,23] };
    const sc = statusColors[bon.status] || [150,150,150];
    doc.setFillColor(...sc);
    doc.roundedRect(14, y, 32, 8, 2, 2, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(7);
    doc.setFont("helvetica","bold");
    const statusLbl = { brouillon:"BROUILLON", valide:"VALIDÉ", livre:"LIVRÉ", annule:"ANNULÉ" }[bon.status] || bon.status;
    doc.text(statusLbl, 30, y + 5.5, { align: "center" });

    // ── NOTES ──
    if (bon.notes) {
      y += 16;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(14, y, 130, 18, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES:", 18, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(bon.notes.substring(0, 140), 18, y + 13);
    }

    // ── QR CODE ──
    const qrX2 = 157, qrY2 = Math.max(y + 20, 210);
    const qrData = `GMO-VERIFY:${bon.id}:${bon.number}:BON:${Date.now()}`;
    // Draw QR Code
    (function drawBonQR(doc, x, y2, size, data, ref) {
      const cell = size / 14;
      doc.setFillColor(255, 255, 255);
      doc.rect(x - 1, y2 - 1, size + 2, size + 2, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.rect(x - 1, y2 - 1, size + 2, size + 2, 'S');
      function fp(ox, oy) {
        doc.setFillColor(26, 122, 46);
        doc.rect(ox, oy, cell * 7, cell * 7, 'F');
        doc.setFillColor(255, 255, 255);
        doc.rect(ox + cell, oy + cell, cell * 5, cell * 5, 'F');
        doc.setFillColor(26, 122, 46);
        doc.rect(ox + cell * 2, oy + cell * 2, cell * 3, cell * 3, 'F');
      }
      fp(x, y2); fp(x + cell * 7, y2); fp(x, y2 + cell * 7);
      doc.setFillColor(26, 122, 46);
      for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
          doc.rect(x + cell * (7 + i), y2 + cell * 6, cell, cell, 'F');
          doc.rect(x + cell * 6, y2 + cell * (7 + i), cell, cell, 'F');
        }
      }
      let hash = 0;
      for (let ci = 0; ci < data.length; ci++) hash = ((hash << 5) - hash) + data.charCodeAt(ci);
      hash = Math.abs(hash);
      const dsX = x + cell * 8, dsY = y2 + cell * 8;
      doc.setFillColor(26, 122, 46);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
        if ((hash >> ((r * 5 + c) % 32)) & 1) doc.rect(dsX + c * cell, dsY + r * cell, cell * 0.9, cell * 0.9, 'F');
      }
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(26, 122, 46);
      doc.text("VÉRIFIER", x + size / 2, y2 + size + 4, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 130, 130);
      doc.setFontSize(4.5);
      doc.text("gmobfaso.com/verify", x + size / 2, y2 + size + 8, { align: "center" });
      doc.text(`Réf: ${ref || '—'}`, x + size / 2, y2 + size + 11.5, { align: "center" });
    })(doc, qrX2, qrY2, 32, qrData, bon.number);

    // ── SIGNATURE BOXES ──
    const sigY = Math.max(y + 30, 230);
    const boxes = [
      { label: "Signature Expéditeur", x: 14 },
      { label: "Signature Chauffeur", x: 80 },
      { label: "Signature Récepteur", x: 146 },
    ];
    boxes.forEach(b => {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.4);
      doc.rect(b.x, sigY, 56, 24);
      doc.setFontSize(7);
      doc.setTextColor(130, 130, 130);
      doc.setFont("helvetica", "normal");
      doc.text(b.label, b.x + 28, sigY + 29, { align: "center" });
    });

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
    doc.text("Document officiel GMO ERP · IAM TECHNOLOGY · gmobfaso.com", W / 2, H - 5.5, { align: "center" });

    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=GMO-BON-${bon.number || bon.id}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});