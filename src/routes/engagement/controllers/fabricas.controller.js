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

/* ======================================================
   ➕ CREAR FÁBRICA
====================================================== */
export const crearFabrica = async (req, res) => {
  try {
    const { nombre} = req.body;

    await pool.query(
      `INSERT INTO fabricas (nombre)
       VALUES ($1)`,
      [nombre]
    );

    res.status(201).json({ ok: true });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear fábrica');
  }
};


export default {
  getFabricas,
  crearFabrica
};
