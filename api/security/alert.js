export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { event, attempts, targetPhone, timestamp } = req.body || {};
  const alertMsg = `🚨 *ALERTE INTRUSION — MARGINGUARD VAULT*\n\n⚠️ *${attempts || 3} Tentatives de mot de passe erronées détectées !*\n\n⏰ *Horodatage :* ${timestamp || new Date().toISOString()}\n🔒 *Action :* Coffre-fort verrouillé.\n📱 *Cible :* ${targetPhone || '+225 05 84 89 98 98'}\n\n👉 [Ouvrir le Portail](https://marginguard-vitrine.vercel.app)`;

  // 1. Telegram Dispatch
  try {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || "process.env.TELEGRAM_BOT_TOKEN";
    const chatId = process.env.TELEGRAM_CHAT_ID || "7561160994";
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: alertMsg,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.error("Telegram alert error:", err);
  }

  return res.status(200).json({ ok: true, message: "Security alert dispatched successfully" });
}

