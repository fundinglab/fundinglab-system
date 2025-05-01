export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;

  console.log('Webhook empfangen:', event.event);

  if (event.event === 'subscription.started') {
    console.log('Abonnement gestartet für:', event.data.user_email);
  } else if (event.event === 'subscription.cancelled' || event.event === 'subscription.expired') {
    console.log('Abonnement beendet für:', event.data.user_email);
  }

  res.status(200).json({ success: true });
}
