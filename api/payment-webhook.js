export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', req.body);

    // In production, you would verify PhonePe signature here

    // Example response to PhonePe
    res.status(200).json({ success: true, message: 'Webhook received' });
  } else {
    res.status(200).json({ status: 'ok', message: 'PhonePe Webhook is running' });
  }
}
