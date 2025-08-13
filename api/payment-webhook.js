// api/payment-webhook.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { payment_id, status, amount, customer_phone } = req.body;

    console.log("Received webhook:", req.body);

    // Only send confirmation if payment is successful
    if (status === 'SUCCESS') {
      const wapiUrl = 'https://wapi.flaxxa.com/api/v1/sendmessage';
      const token = process.env.FLAXXA_WAPI_TOKEN; // Stored securely in Vercel
      const phone = customer_phone; // Should be full phone number with country code

      const message = `✅ Payment Received!\n\nAmount: ₹${amount / 100}\nPayment ID: ${payment_id}\n\nThank you for your booking at Hakuna Matata Gaming Cafe! 🎮`;

      const wapiResponse = await fetch(wapiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          phone,
          message
        })
      });

      const result = await wapiResponse.json();
      console.log("WAPI Response:", result);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
