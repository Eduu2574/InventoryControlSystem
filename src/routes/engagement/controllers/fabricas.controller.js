import { db } from '../db.js';

export const getFabricas = (req, res) => {
  db.query('SELECT * FROM fabricas', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error obteniendo fábricas' });
    }

    res.json(rows);
  });
};