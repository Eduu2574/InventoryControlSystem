import { db } from '../db.js';

export function registrarMovimiento({
  producto_id,
  userId,
  tipo,
  cantidad,
  stock_anterior,
  stock_nuevo
}) {
  // 1️⃣ Obtener username desde la BD
  db.query(
    'SELECT username FROM usuarios WHERE id = ? LIMIT 1',
    [userId],
    (err, results) => {
      // Fallback de seguridad
      const usuario =
        err || !results.length ? 'sistema' : results[0].username;

      // 2️⃣ Guardar movimiento
      db.query(
        `
        INSERT INTO movimientos_stock
        (producto_id, usuario, tipo, cantidad, stock_anterior, stock_nuevo)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          producto_id,
          usuario,
          tipo,
          cantidad,
          stock_anterior,
          stock_nuevo
        ]
      );
    }
  );
}