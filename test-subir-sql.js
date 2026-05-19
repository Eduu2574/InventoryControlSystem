import 'dotenv/config'; // ✅ también aquí, por seguridad
import fs from 'fs';
import { subirArchivoLocal } from './src/routes/engagement/bucket.js';

async function test() {
  const ruta = '/tmp';

  const archivo = fs
    .readdirSync(ruta)
    .filter(f => f.startsWith('sle_backup_') && f.endsWith('.sql'))
    .sort()
    .pop();

  if (!archivo) {
    throw new Error('No se encontró ningún backup .sql');
  }

  const rutaCompleta = `${ruta}/${archivo}`;

  console.log('📦 Subiendo:', rutaCompleta);

  const destino = await subirArchivoLocal(rutaCompleta);

  console.log('✅ Subido a GCP:', destino);
}

test().catch(err => {
  console.error('❌ Error:', err);
});
