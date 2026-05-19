import { db } from '../db.js';

export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // 👈 AQUÍ ESTÁ LA CLAVE
      }
    );
  });
}