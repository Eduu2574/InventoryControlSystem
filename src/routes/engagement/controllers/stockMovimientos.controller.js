import pool from '../../../../db.js';

export async function registrarMovimiento({
  producto_id,
  userId,
  tipo,
  cantidad,
  stock_anterior,
  stock_nuevo
}) {
  try {
    // 1️⃣ Obtener username
    const userResult = await pool.query(
      'SELECT username FROM usuarios WHERE id = $1 LIMIT 1',
      [userId]
    );

    const usuario =
      userResult.rows.length === 0
        ? 'sistema'
        : userResult.rows[0].username;

    // 2️⃣ Guardar movimiento
    await pool.query(
      `
      INSERT INTO movimientos_stock
      (producto_id, usuario, tipo, cantidad, stock_anterior, stock_nuevo)
      VALUES ($1, $2, $3, $4, $5, $6)
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

  } catch (err) {
    console.error('Error registrarMovimiento:', err);
  }
}