import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// ✅ usar URL completa directamente
export const db = await mysql.createPool(process.env.MYSQL_PUBLIC_URL);

console.log('Conectando a Railway con URL pública...');
