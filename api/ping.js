export default async function handler(req, res) {
    if (req.method === 'GET') {
      console.log('Ping reçu...');
      res.status(200).json({ message: 'Bot actif' });
    } else {
      res.status(405).json({ message: 'Méthode non autorisée' });
    }
  }
  