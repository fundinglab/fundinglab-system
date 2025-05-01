export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;

  console.log('Webhook empfangen:', event.event || 'Kein Event');

  res.status(200).json({ message: "Webhook funktioniert!", received: event });
}
