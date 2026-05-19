import { db } from '../db.js';

export const obtenerProductos = (fabricaId) => {
  return new Promise((resolve, reject) => {

    let sql = 'SELECT * FROM productos WHERE activo = 1';
    let params = [];

    if (fabricaId) {
      sql += ' AND fabrica_id = ?';
      params.push(fabricaId);
    }

    db.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });

  });
};



export default {
  obtenerProductos
};
