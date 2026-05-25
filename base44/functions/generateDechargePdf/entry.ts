import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

function numberToWords(n) {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

  if (n === 0) return 'zéro';
  if (n < 20) return units[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (t === 7) return 'soixante-' + units[10 + u];
    if (t === 9) return 'quatre-vingt-' + units[u === 0 ? 0 : u];
    return tens[t] + (u ? '-' + units[u] : (t === 8 ? 's' : ''));
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (h === 1 ? 'cent' : units[h] + ' cent') + (r ? ' ' + numberToWords(r) : (h > 1 ? 's' : ''));
  }
  if (n < 1000000) {
    const k = Math.floor(n / 1000);
    const r = n % 1000;
    return (k === 1 ? 'mille' : numberToWords(k) + ' mille') + (r ? ' ' + numberToWords(r) : '');
  }
  return n.toString();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { expenseId } = await req.json();

    const expenses = await base44.entities.CashExpense.filter({ id: expenseId }, '', 1);
    if (!expenses || expenses.length === 0) {
      return Response.json({ error: 'Dépense introuvable' }, { status: 404 });
    }
    const exp = expenses[0];

    const settings = await base44.entities.CompanySettings.list('', 1);
    const company = settings?.[0] || {};

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210;
    const margin = 18;
    let y = 15;

    // ─── HEADER ───
    doc.setFillColor(26, 122, 46);
    doc.rect(0, 0, W, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(company.raison_sociale || 'GMO BURKINA', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 240, 210);
    const subLine = [company.sigle, company.address, company.city].filter(Boolean).join(' · ');
    doc.text(subLine || 'Ouagadougou, Burkina Faso', margin, 17);
    const contact = [company.phone, company.ifu ? `IFU: ${company.ifu}` : ''].filter(Boolean).join(' · ');
    if (contact) doc.text(contact, margin, 22);

    y = 35;

    // ─── APPROVAL BADGE ───
    if (exp.status === 'valide') {
      doc.setFillColor(230, 255, 235);
      doc.setDrawColor(26, 122, 46);
      doc.roundedRect(margin, y, W - margin * 2, 10, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(26, 122, 46);
      const approvedText = `✓ APPROUVÉ PAR LE PDG${exp.approved_at ? ' LE ' + new Date(exp.approved_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}`;
      doc.text(approvedText, W / 2, y + 6.5, { align: 'center' });
      y += 14;
    }

    // ─── TITLE ───
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('DÉCHARGE DE DÉPENSE', W / 2, y + 7, { align: 'center' });
    doc.setDrawColor(26, 122, 46);
    doc.setLineWidth(0.6);
    doc.line(margin + 20, y + 9, W - margin - 20, y + 9);
    y += 16;

    // Ref + Date line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Réf: ${exp.reference || `DCH-${exp.id?.slice(-6)?.toUpperCase()}`}`, margin, y);
    const dateStr = exp.date ? new Date(exp.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    doc.text(`Ouagadougou, le ${dateStr}`, W - margin, y, { align: 'right' });
    y += 10;

    // ─── SECTION: BÉNÉFICIAIRE ───
    const drawSectionHeader = (title, yPos) => {
      doc.setFillColor(245, 248, 245);
      doc.rect(margin, yPos, W - margin * 2, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 122, 46);
      doc.text(title, margin + 3, yPos + 5);
      return yPos + 10;
    };

    const drawField = (label, value, xPos, yPos, colWidth) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(label.toUpperCase(), xPos, yPos);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(value || '—', xPos, yPos + 5);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(xPos, yPos + 6.5, xPos + colWidth - 4, yPos + 6.5);
    };

    y = drawSectionHeader('INFORMATIONS DU BÉNÉFICIAIRE', y);

    const colW = (W - margin * 2) / 3;
    drawField('NOM', exp.beneficiary_nom, margin, y, colW);
    drawField('PRÉNOM(S)', exp.beneficiary_prenom, margin + colW, y, colW);
    drawField('TÉLÉPHONE', exp.beneficiary_phone, margin + colW * 2, y, colW);
    y += 14;
    drawField('CNIB N°', exp.beneficiary_id_number, margin, y, colW);
    drawField('DATE DE DÉLIVRANCE', exp.beneficiary_id_date ? new Date(exp.beneficiary_id_date).toLocaleDateString('fr-FR') : '', margin + colW, y, colW);
    y += 16;

    // ─── SECTION: DÉPENSE ───
    y = drawSectionHeader('DÉTAILS DE LA DÉPENSE', y);
    drawField('CATÉGORIE', exp.category, margin, y, colW);
    drawField('MODE DE PAIEMENT', exp.payment_method, margin + colW, y, colW);
    drawField('DATE', dateStr, margin + colW * 2, y, colW);
    y += 14;
    drawField('MOTIF / OBJET', exp.motif, margin, y, W - margin * 2);
    y += 16;

    // ─── AMOUNT BOX ───
    doc.setFillColor(248, 252, 248);
    doc.setDrawColor(26, 122, 46);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin + 20, y, W - margin * 2 - 40, 22, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 122, 46);
    doc.text(`${Number(exp.amount).toLocaleString('fr-FR')} FCFA`, W / 2, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const words = numberToWords(Math.round(exp.amount));
    doc.text(`Arrêté la présente somme à : ${words} francs CFA`, W / 2, y + 18, { align: 'center' });
    y += 28;

    // ─── IMPUTATION COMPTABLE ───
    doc.setFillColor(248, 248, 248);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, W - margin * 2, 30, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text('IMPUTATION COMPTABLE (SYSCOHADA)', margin + 3, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text('N° Compte', margin + 3, y + 12);
    doc.text('Libellé', margin + 30, y + 12);
    doc.text('Débit', W - margin - 30, y + 12, { align: 'right' });
    doc.text('Crédit', W - margin - 3, y + 12, { align: 'right' });
    doc.setDrawColor(200, 200, 200);
    doc.line(margin + 3, y + 14, W - margin - 3, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text('625', margin + 3, y + 20);
    doc.text(exp.motif?.substring(0, 50) || '', margin + 30, y + 20);
    doc.setTextColor(26, 122, 46);
    doc.text(`${Number(exp.amount).toLocaleString('fr-FR')}`, W - margin - 30, y + 20, { align: 'right' });
    doc.setTextColor(120, 120, 120);
    doc.text('—', W - margin - 3, y + 20, { align: 'right' });

    doc.text('571', margin + 3, y + 26);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Caisse / Banque', margin + 30, y + 26);
    doc.text('—', W - margin - 30, y + 26, { align: 'right' });
    doc.setTextColor(26, 122, 46);
    doc.setFont('helvetica', 'bold');
    doc.text(`${Number(exp.amount).toLocaleString('fr-FR')}`, W - margin - 3, y + 26, { align: 'right' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Journal : CA · Réf: ${exp.reference || exp.id?.slice(-6)?.toUpperCase()}`, margin + 3, y + 31);
    y += 36;

    // ─── DECLARATION TEXT ───
    const benef = `${exp.beneficiary_nom || ''} ${exp.beneficiary_prenom || ''}`.trim() || 'Le bénéficiaire';
    const idNum = exp.beneficiary_id_number || '—';
    const co = company.raison_sociale || 'GMO BURKINA';
    const declarText = `Je soussigné(e) ${benef}, titulaire du ${exp.beneficiary_id_type || 'CNIB'} N° ${idNum}, reconnaît avoir reçu de ${co} la somme de ${Number(exp.amount).toLocaleString('fr-FR')} FCFA (${words} francs CFA) à titre de : ${exp.motif}.`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(declarText, W - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 10;

    // ─── SIGNATURES ───
    const sigCols = [margin, W / 2 - 25, W - margin - 55];
    const sigLabels = ['LE RESPONSABLE COMPTABLE', 'LE DIRECTEUR GÉNÉRAL', 'LE BÉNÉFICIAIRE'];
    const sigSubs = ['Signature & Cachet', 'Visa', `${benef}\nSignature précédée de "Lu et approuvé"`];

    sigCols.forEach((x, i) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(sigLabels[i], x, y);
      if (i === 2) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(80, 80, 80);
        doc.text(benef, x, y + 5);
      }
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(x, y + 25, x + 52, y + 25);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(i < 2 ? sigSubs[i] : 'Signature précédée de "Lu et approuvé"', x, y + 29);
    });

    y += 36;

    // ─── FOOTER ───
    doc.setFillColor(240, 245, 240);
    doc.rect(0, 283, W, 14, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 130, 100);
    doc.text(`${co} · Service Comptabilité · Réf: ${exp.reference || exp.id?.slice(-6)?.toUpperCase()} · Généré le ${new Date().toLocaleDateString('fr-FR')}`, W / 2, 290, { align: 'center' });

    // Watermark if approved
    if (exp.status === 'valide') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(52);
      doc.setTextColor(26, 122, 46);
      doc.setGState(doc.GState({ opacity: 0.07 }));
      doc.text('ACCEPTÉ', W / 2, 180, { align: 'center', angle: 35 });
      doc.setGState(doc.GState({ opacity: 1 }));
    }

    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Decharge-${exp.reference || exp.id}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});