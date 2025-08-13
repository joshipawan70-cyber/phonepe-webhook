// api/payment-webhook.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body; // PhonePe webhook payload

    console.log("📩 Incoming webhook:", JSON.stringify(event));

    // ✅ Check if payment is successful
    if (event.code === "PAYMENT_SUCCESS" || event.transactionStatus === "SUCCESS") {
      const customerName = event.customerName || "Customer";
      const customerPhone = event.customerPhone; // must be in international format (e.g., "919876543210")
      const amount = (event.amount / 100).toFixed(2); // convert from paise to INR if needed

      // ✅ Send WhatsApp confirmation via Flaxxa WAPI
      const WAPI_TOKEN = process.env.FLAXXA_WAPI_TOKEN; // store in Vercel env variables
      const WAPI_URL = "https://api.flaxxa.com/sendMessage";

      if (!customerPhone) {
        console.error("❌ No customer phone number in webhook.");
      } else {
        const message = `✅ Hello ${customerName}, your payment of ₹${amount} was successful. Your booking at Hakuna Matata Gaming Cafe is confirmed! 🎮`;

        const wapiResponse = await fetch(WAPI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${WAPI_TOKEN}`
          },
          body: JSON.stringify({
            to: customerPhone,
            message: message
          })
        });

        const wapiResult = await wapiResponse.json();
        console.log("📤 WAPI response:", wapiResult);
      }
    } else {
      console.log("ℹ️ Payment not successful. Ignoring.");
