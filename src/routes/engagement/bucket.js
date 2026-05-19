import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import path from 'path';

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  throw new Error('GOOGLE_CLOUD_BUCKET_NAME no está definido');
}

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(bucketName);

export async function subirArchivoLocal(rutaLocal) {
  const nombre = path.basename(rutaLocal); // ✅ ahora path existe
  const destino = `backups/${nombre}`;

  await bucket.upload(rutaLocal, {
    destination: destino,
  });

  return destino;
}