import pool from '../../../../db.js';

export const obtenerProductos = async (fabricaId) => {
  try {
    let sql = 'SELECT * FROM productos WHERE activo = TRUE';
    const params = [];

    if (fabricaId) {
      sql += ' AND fabrica_id = $1';
      params.push(fabricaId);
    }

    const result = await pool.query(sql, params);
    return result.rows;

  } catch (err) {
    throw err;
  }
};

export default {
  obtenerProductos
};