import { db } from '../db.js';

export function getMe(req, res) {
  const userId = req.userId;

  db.query(
    'SELECT username, email FROM usuarios WHERE id = ? LIMIT 1',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error getMe:', err);
        return res.status(500).json({ error: 'Error interno' });
      }

      if (!results.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = results[0];

      return res.json({
        username: user.username,
        email: user.email
      });
    }
  );
}