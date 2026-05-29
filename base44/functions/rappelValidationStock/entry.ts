import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Appelé toutes les 5 minutes par un scheduled automation
// Cherche les stocks en attente de validation vendeur depuis plus de 30 min sans rappel
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Récupérer tous les stocks en attente de validation vendeur
    const stocks = await base44.asServiceRole.entities.StockVendeur.filter({
      status: "en_attente_validation"
    });

    const now = Date.now();
    const TRENTE_MIN = 30 * 60 * 1000;
    let rappelsSent = 0;

    for (const stock of stocks) {
      // Doit avoir été validé par le magasinier mais pas encore par le vendeur
      if (!stock.valide_par_magasinier || stock.valide_par_vendeur) continue;
      if (stock.rappel_envoye) continue;

      const dateRef = stock.date_validation_magasinier || stock.date_assignation;
      if (!dateRef) continue;

      const elapsed = now - new Date(dateRef).getTime();
      if (elapsed >= TRENTE_MIN) {
        // Marquer rappel envoyé
        await base44.asServiceRole.entities.StockVendeur.update(stock.id, {
          rappel_envoye: true
        });

        // Envoyer une notification via InvokeLLM (log seulement ici - SMS via sendSmsNotification si téléphone disponible)
        console.log(`[RAPPEL] Stock ${stock.id} — Vendeur ${stock.vendeur_nom} — ${stock.produit_nom} — pas validé depuis ${Math.round(elapsed/60000)} min`);

        // Optionnel: envoyer SMS si téléphone vendeur disponible
        // On pourrait appeler sendSmsNotification ici

        rappelsSent++;
      }
    }

    return Response.json({
      success: true,
      checked: stocks.length,
      rappels_sent: rappelsSent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});