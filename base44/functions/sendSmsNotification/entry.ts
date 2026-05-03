import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SMS_API_KEY = Deno.env.get("AFRICAS_TALKING_API_KEY");
const SMS_USERNAME = Deno.env.get("AFRICAS_TALKING_USERNAME") || "sandbox";
const SMS_SENDER = Deno.env.get("AFRICAS_TALKING_SENDER_ID") || "GMO-BF";

const STATUS_MESSAGES = {
  confirmee: "Votre commande {order_number} a été confirmée. Nous la préparons pour vous. - GMO Burkina",
  en_preparation: "Votre commande {order_number} est en cours de préparation. - GMO Burkina",
  en_livraison: "Votre commande {order_number} est en route ! Notre livreur est parti vous rejoindre. - GMO Burkina",
  livree: "Votre commande {order_number} a été livrée avec succès. Merci de votre confiance ! - GMO Burkina",
  annulee: "Votre commande {order_number} a été annulée. Contactez-nous au +226 25 33 19 00 pour plus d'info. - GMO Burkina",
};

async function sendSms(phone, message) {
  if (!SMS_API_KEY) {
    console.log(`[SMS MOCK] → ${phone}: ${message}`);
    return { success: true, mock: true };
  }

  const formatted = phone.startsWith("+") ? phone : `+226${phone.replace(/\s/g, "")}`;
  
  const res = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "apiKey": SMS_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      username: SMS_USERNAME,
      to: formatted,
      message: message,
      from: SMS_SENDER,
    }),
  });

  const data = await res.json();
  return { success: res.ok, data };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { phone, order_number, status, client_name } = await req.json();
    
    if (!phone || !status) {
      return Response.json({ error: "phone and status are required" }, { status: 400 });
    }

    const template = STATUS_MESSAGES[status];
    if (!template) {
      return Response.json({ error: `No template for status: ${status}` }, { status: 400 });
    }

    const message = template.replace("{order_number}", order_number || "votre commande");
    const result = await sendSms(phone, message);
    
    return Response.json({ success: true, result, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});