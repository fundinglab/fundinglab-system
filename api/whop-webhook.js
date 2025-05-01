export const config = {
  api: {
    bodyParser: false, // wichtig für Webhooks!
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let body = '';

  try {
    for await (const chunk of req) {
      body += chunk;
    }

    const parsed = JSON.parse(body);

    console.log('✅ Webhook empfangen:', parsed?.event || 'Kein Event');

    return res.status(200).json({
      message: 'Webhook funktioniert!',
      received: parsed
    });
  } catch (err) {
    console.error('❌ Fehler beim Parsen:', err.message);
    return res.status(400).json({ error: 'Ungültiger JSON-Body' });
  }
}
