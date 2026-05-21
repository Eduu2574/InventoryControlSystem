import pool from '../../../../db.js';

export const getFabricas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fabricas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo fábricas' });
  }
};