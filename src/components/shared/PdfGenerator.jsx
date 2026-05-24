/**
 * PdfGenerator — Génère et ouvre un PDF via une fenêtre HTML print
 * Beau rendu, compatible impression, pas de problème binaire
 */

function formatMoney(n) {
  return Number(n || 0).toLocaleString("fr-FR") + " FCFA";
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
}

const STATUS_LABELS = {
  brouillon: { label: "BROUILLON", color: "#888" },
  envoye:    { label: "ENVOYÉ",    color: "#F59E0B" },
  paye:      { label: "PAYÉ",      color: "#1A7A2E" },
  partiel:   { label: "PARTIEL",   color: "#3B82F6" },
  annule:    { label: "ANNULÉ",    color: "#CC1717" },
};

const TYPE_LABELS = {
  devis:    "DEVIS",
  facture:  "FACTURE",
  proforma: "PROFORMA",
};

export function generateInvoiceHtml(inv) {
  const typeLabel = TYPE_LABELS[inv.type] || "DOCUMENT";
  const statusCfg = STATUS_LABELS[inv.status] || { label: (inv.status || "").toUpperCase(), color: "#888" };
  const items = inv.items && inv.items.length > 0
    ? inv.items
    : [{ name: "Prestation / Produit", qty: 1, unit: "u.", unit_price: inv.subtotal || inv.total || 0 }];

  const itemRows = items.map((item, i) => {
    const qty = item.qty || item.quantity || 1;
    const pu = item.unit_price || 0;
    const total = qty * pu;
    return `
      <tr style="background:${i % 2 === 0 ? "#f9fbf9" : "#fff"}">
        <td style="padding:8px 10px;font-weight:600;color:#222;border-bottom:1px solid #e8f0e8;">${item.name || item.product_name || item.description || "—"}</td>
        <td style="padding:8px 10px;text-align:center;color:#555;border-bottom:1px solid #e8f0e8;">${qty}</td>
        <td style="padding:8px 10px;text-align:center;color:#555;border-bottom:1px solid #e8f0e8;">${item.unit || "u."}</td>
        <td style="padding:8px 10px;text-align:right;color:#333;border-bottom:1px solid #e8f0e8;">${formatMoney(pu)}</td>
        <td style="padding:8px 10px;text-align:right;font-weight:700;color:#1A7A2E;border-bottom:1px solid #e8f0e8;">${formatMoney(total)}</td>
      </tr>
    `;
  }).join("");

  const paidRow = inv.paid_amount > 0 ? `
    <tr>
      <td colspan="2" style="padding:6px 12px;text-align:right;color:#1A7A2E;font-weight:600;">Montant payé :</td>
      <td style="padding:6px 12px;text-align:right;color:#1A7A2E;font-weight:700;">${formatMoney(inv.paid_amount)}</td>
    </tr>
    ${(inv.total - inv.paid_amount) > 0 ? `<tr>
      <td colspan="2" style="padding:6px 12px;text-align:right;color:#CC1717;font-weight:600;">Reste à payer :</td>
      <td style="padding:6px 12px;text-align:right;color:#CC1717;font-weight:700;">${formatMoney(inv.total - inv.paid_amount)}</td>
    </tr>` : ""}
  ` : "";

  const notesBlock = inv.notes ? `
    <div style="margin-top:18px;background:#f8f8f8;border-left:4px solid #1A7A2E;padding:12px 16px;border-radius:4px;">
      <div style="font-size:9px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Notes</div>
      <div style="font-size:11px;color:#555;line-height:1.5;">${inv.notes}</div>
    </div>
  ` : "";

  const conditionsBlock = inv.type === "devis" ? `
    <div style="margin-top:18px;background:#fffbeb;border:1.5px solid #F5C400;padding:12px 16px;border-radius:6px;">
      <div style="font-size:9px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Conditions de validité</div>
      <div style="font-size:10.5px;color:#78350f;line-height:1.6;">
        Ce devis est valable <strong>30 jours</strong> à compter de la date d'émission.<br>
        Toute commande vaut acceptation des conditions générales de vente de GMO Burkina.
      </div>
    </div>
  ` : "";

  const verifyCode = `GMO-${(inv.id || "").slice(-8).toUpperCase()}`;
  const verifyUrl = `https://gmobfaso.com/verify?code=${verifyCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verifyUrl)}&color=1A7A2E&bgcolor=ffffff`;
  const logoUrl = `https://gmobfaso.com/assets/img/logo.png`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>GMO ${typeLabel} ${inv.number || ""}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;}
    body{font-family:'Inter',sans-serif;background:#fff;color:#222;font-size:12px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;display:flex;flex-direction:column;}
    .page-content{flex:1;}

    /* Header */
    .header{background:#1A7A2E;padding:18px 24px 16px;display:flex;justify-content:space-between;align-items:center;}
    .header-left .logo-box{background:#fff;border-radius:6px;padding:6px 12px;display:inline-flex;align-items:center;gap:10px;}
    .header-left .logo-box img{height:38px;width:auto;object-fit:contain;}
    .header-left .logo-box .logo-text .name{font-size:15px;font-weight:800;color:#1A7A2E;line-height:1.1;}
    .header-left .logo-box .logo-text .sub{font-size:7.5px;color:#888;letter-spacing:1px;text-transform:uppercase;margin-top:2px;}
    .header-red-bar{height:3px;background:#CC1717;}
    .header-right{text-align:right;}
    .header-right .doc-type{font-size:26px;font-weight:800;color:#fff;line-height:1;}
    .header-right .doc-number{font-size:12px;color:rgba(255,255,255,0.75);margin-top:4px;}
    .status-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:9px;font-weight:700;color:#fff;margin-top:8px;letter-spacing:0.5px;}

    /* Info columns */
    .info-row{display:flex;gap:20px;padding:20px 24px 0;}
    .company-col{flex:1;}
    .company-col h3{font-size:10px;font-weight:800;color:#1A7A2E;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
    .company-col p{font-size:10px;color:#555;line-height:1.7;}
    .client-box{width:230px;background:#f5f8f5;border:1.5px solid #d1e8d1;border-radius:8px;overflow:hidden;flex-shrink:0;}
    .client-box-header{background:#1A7A2E;padding:6px 14px;}
    .client-box-header span{font-size:9px;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:1px;text-transform:uppercase;}
    .client-box-body{padding:12px 14px;}
    .client-name{font-size:13px;font-weight:800;color:#1A7A2E;margin-bottom:6px;}
    .client-meta{font-size:10px;color:#666;line-height:1.7;}

    /* Reference band */
    .ref-band{margin:16px 24px 0;background:#1A7A2E;border-radius:6px;padding:8px 16px;text-align:center;}
    .ref-band span{font-size:10px;font-weight:700;color:#fff;letter-spacing:1px;}

    /* Table */
    .table-wrap{margin:16px 24px 0;}
    table{width:100%;border-collapse:collapse;}
    thead tr{background:#1c1c1e;}
    thead th{padding:9px 10px;text-align:left;font-size:9.5px;font-weight:700;color:#fff;letter-spacing:0.5px;text-transform:uppercase;}
    thead th.right{text-align:right;}
    thead th.center{text-align:center;}
    tbody tr:nth-child(odd){background:#f9fbf9;}
    tbody tr:nth-child(even){background:#fff;}
    tbody td{padding:9px 10px;font-size:11px;border-bottom:1px solid #e8f0e8;}

    /* Totals */
    .totals-wrap{display:flex;justify-content:flex-end;margin:16px 24px 0;}
    .totals-table{width:240px;border-collapse:collapse;}
    .totals-table td{padding:6px 10px;font-size:11px;}
    .totals-table .label{color:#666;}
    .totals-table .val{text-align:right;font-weight:600;color:#333;}
    .totals-table .total-row td{background:#1A7A2E;color:#fff;font-size:13px;font-weight:800;padding:9px 10px;}
    .totals-table .total-row .val{text-align:right;}
    .totals-table .divider td{border-top:1.5px solid #d1e8d1;padding:0;}

    /* Content area */
    .content-area{padding:0 24px 24px;}

    /* Verify block */
    .verify-block{display:flex;align-items:center;gap:16px;margin-top:20px;padding:14px 16px;background:#f5f8f5;border:1.5px solid #d1e8d1;border-radius:8px;}
    .verify-block img.qr{width:80px;height:80px;flex-shrink:0;border:1px solid #d1e8d1;border-radius:4px;background:#fff;padding:4px;}
    .verify-text .vt1{font-size:9px;font-weight:800;color:#1A7A2E;text-transform:uppercase;letter-spacing:1px;}
    .verify-text .vt2{font-size:10px;color:#555;margin-top:4px;line-height:1.6;}
    .verify-text .vt3{font-size:9px;color:#888;margin-top:5px;line-height:1.6;}

    /* Footer — ancré en bas de page */
    .footer{background:#1A7A2E;padding:10px 24px 8px;margin-top:auto;}
    .footer-red{height:2px;background:#CC1717;margin-bottom:6px;}
    .footer-content{display:flex;align-items:center;justify-content:space-between;gap:16px;}
    .footer-logo{height:28px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:0.9;}
    .footer-text{text-align:center;flex:1;}
    .footer-text .f1{font-size:9px;font-weight:700;color:#fff;}
    .footer-text .f2{font-size:8px;color:rgba(255,255,255,0.7);margin-top:2px;}

    @media print {
      body{margin:0;}
      .page{width:100%;min-height:100vh;}
      .footer{position:fixed;bottom:0;left:0;right:0;}
      .page-content{padding-bottom:40mm;}
    }
  </style>
</head>
<body>
<div class="page">
<div class="page-content">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <div class="logo-box">
        <img src="${logoUrl}" alt="GMO" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <div class="logo-text" style="display:none;">
          <div class="name">GMO BURKINA</div>
          <div class="sub">Groupe Madina Oumarou</div>
        </div>
        <div class="logo-text">
          <div class="name">GMO BURKINA</div>
          <div class="sub">Groupe Madina Oumarou</div>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-type">${typeLabel}</div>
      <div class="doc-number">${inv.number || "—"}</div>
      <div class="status-badge" style="background:${statusCfg.color};">${statusCfg.label}</div>
    </div>
  </div>
  <div class="header-red-bar"></div>

  <!-- INFO ROW -->
  <div class="info-row">
    <div class="company-col">
      <h3>Groupe Madina Oumarou</h3>
      <p>
        Quartier Dapoya, Parcelle 05, Lot 29, Section BI<br>
        01 BP 3370 — Ouagadougou 01, Burkina Faso<br>
        Tél : +226 25 33 19 00 &nbsp;|&nbsp; WhatsApp : +226 76 21 16 33<br>
        Email : infos@gmoburkina.com &nbsp;|&nbsp; www.gmobfaso.com<br>
        RCCM : BF-OUA-2015-B-XXXXX &nbsp;|&nbsp; IFU : 00000000000
      </p>
    </div>
    <div class="client-box">
      <div class="client-box-header"><span>${inv.type === "devis" ? "Destinataire" : "Facturer à"}</span></div>
      <div class="client-box-body">
        <div class="client-name">${(inv.client_name || "—").toUpperCase()}</div>
        <div class="client-meta">
          Date d'émission : <strong>${formatDate(inv.date)}</strong><br>
          ${inv.due_date ? `${inv.type === "devis" ? "Validité" : "Échéance"} : <strong>${formatDate(inv.due_date)}</strong>` : ""}
        </div>
      </div>
    </div>
  </div>

  <!-- REFERENCE BAND -->
  <div class="ref-band">
    <span>RÉFÉRENCE DOCUMENT : ${inv.number || "—"}</span>
  </div>

  <!-- TABLE -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Désignation</th>
          <th class="center" style="width:60px;">Qté</th>
          <th class="center" style="width:50px;">Unité</th>
          <th class="right" style="width:100px;">P.U. FCFA</th>
          <th class="right" style="width:110px;">Total FCFA</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
  </div>

  <!-- TOTALS -->
  <div class="totals-wrap">
    <table class="totals-table">
      <tr class="divider"><td colspan="2"></td></tr>
      <tr><td class="label">Sous-total HT</td><td class="val">${formatMoney(inv.subtotal)}</td></tr>
      <tr><td class="label">TVA (${inv.tax_rate || 18}%)</td><td class="val">${formatMoney(inv.tax_amount)}</td></tr>
      <tr class="divider"><td colspan="2"></td></tr>
      <tr class="total-row"><td>TOTAL TTC</td><td class="val">${formatMoney(inv.total)}</td></tr>
      ${paidRow}
    </table>
  </div>

  <!-- CONTENT AREA: conditions, notes, verify -->
  <div class="content-area">
    ${conditionsBlock}
    ${notesBlock}
    <!-- VERIFY BLOCK -->
    <div class="verify-block">
      <img src="${qrUrl}" alt="QR Code vérification" class="qr"/>
      <div class="verify-text">
        <div class="vt1">Document authentifié — GMO Burkina</div>
        <div class="vt2">Scannez le QR code ou rendez-vous sur <strong>gmobfaso.com/verify</strong><br>pour vérifier l'authenticité de ce document.</div>
        <div class="vt3">Code : <strong>${verifyCode}</strong> &nbsp;|&nbsp; Réf. : ${inv.number || "—"} &nbsp;|&nbsp; Émis le : ${formatDate(inv.date)}</div>
      </div>
    </div>
  </div>

</div><!-- end page-content -->

  <!-- FOOTER ancré en bas -->
  <div class="footer">
    <div class="footer-red"></div>
    <div class="footer-content">
      <img src="${logoUrl}" alt="GMO" class="footer-logo" onerror="this.style.display='none'"/>
      <div class="footer-text">
        <div class="f1">Groupe Madina Oumarou (GMO Burkina) — Quartier Dapoya, Ouagadougou — Tél : +226 25 33 19 00</div>
        <div class="f2">Document généré automatiquement par GMO ERP · ${new Date().toLocaleDateString("fr-FR")}</div>
      </div>
      <img src="${logoUrl}" alt="" class="footer-logo" style="opacity:0;" aria-hidden="true"/>
    </div>
  </div>

</div>
</body>
</html>`;
}

export function openPdfWindow(inv) {
  const html = generateInvoiceHtml(inv);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
}