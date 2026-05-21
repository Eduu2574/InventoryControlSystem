import pool from '../../../../db.js';

export async function getMe(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT username, email FROM usuarios WHERE id = $1 LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    return res.json({
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error('Error getMe:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}