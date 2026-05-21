import pool from '../../../../db.js';

export async function getUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 LIMIT 1',
      [email]
    );

    return result.rows[0] || null;

  } catch (err) {
    throw err;
  }
}