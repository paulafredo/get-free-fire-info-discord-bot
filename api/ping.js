export default function handler(req, res) {
  // Vérifie la méthode de la requête
  if (req.method === 'GET' || req.method === 'HEAD') {
    // Répond avec le message "Bot is online"
    res.status(200).json({ message: 'Bot is online' });
  } else {
    // Méthode non autorisée
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
