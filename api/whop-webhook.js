import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;

  if (!process.env.METAAPI_TOKEN || !process.env.METAAPI_MASTER_ID) {
    return res.status(500).json({ error: 'Umgebungsvariablen fehlen' });
  }

  try {
    if (event.event === 'subscription.started') {
      const email = event.data.user_email;

      const result = await axios.post(
        'https://trading-api-v1.metaapi.cloud/users/current/copyfactory2/users',
        {
          name: email,
          email: email,
          copyFactoryAccounts: [
            {
              login: 'DEMO_LOGIN',  // ersetzt durch echte Daten vom User
              password: 'INVESTOR_PASSWORD',
              brokerServer: 'BROKER_SERVER',
              platform: 'mt5',
              type: 'subscriber',
              masterAccountId: process.env.METAAPI_MASTER_ID,
              riskManagement: {
                fixedLotSize: 0.1
              }
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.METAAPI_TOKEN}`
          }
        }
      );

      console.log('Subscriber erstellt:', result.data);
      res.status(200).json({ success: true, detail: 'Subscriber erstellt' });

    } else if (event.event === 'subscription.cancelled' || event.event === 'subscription.expired') {
      // Deaktivierungslogik hier ergänzen (z.B. in DB markieren oder MetaApi-Anfrage zum Entfernen senden)
      console.log('Zugriff für Benutzer entfernen:', event.data.user_email);
      res.status(200).json({ success: true, detail: 'Zugriff entfernt' });
    } else {
      res.status(200).json({ status: 'Ereignis ignoriert' });
    }
  } catch (err) {
    console.error('Fehler beim MetaApi-Aufruf:', err.message);
    res.status(500).json({ error: 'Webhook-Fehler', detail: err.message });
  }
}
