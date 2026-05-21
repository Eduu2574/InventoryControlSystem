import express from 'express';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';
import pool from '../../../../db.js';
import { subirArchivoLocal } from '../bucket.js';

const router = express.Router();

router.post('/backup', async (req, res) => {
  try {
    // ✅ Consulta directa
    const result = await pool.query('SELECT * FROM productos');
    const productos = result.rows;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'No hay datos para exportar' });
    }

    // ✅ Convertir a CSV
    const parser = new Parser();
    const csv = parser.parse(productos);

    // ✅ Guardar CSV temporal
    const nombreArchivo = `backup_security_${Date.now()}.csv`;
    const rutaLocal = path.join('/tmp', nombreArchivo);
    fs.writeFileSync(rutaLocal, csv);

    console.log('➡️ CSV creado en:', rutaLocal);
    console.log('☁️ Subiendo CSV a GCP...');

    // ✅ Subir a GCP
    const destino = await subirArchivoLocal(rutaLocal);

    console.log('✅ CSV subido a GCP:', destino);

    // ✅ Respuesta
    res.json({
      ok: true,
      mensaje: 'Backup de seguridad generado correctamente',
      archivo: destino,
    });

  } catch (err) {
    console.error('❌ Error en backup de seguridad:', err);
    res.status(500).json({ error: 'Error generando backup de seguridad' });
  }
});

export default router;