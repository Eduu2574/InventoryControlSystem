import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import path from 'path';

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

if (!bucketName) {
  console.log("⚠️ GOOGLE_CLOUD_BUCKET_NAME no definido");
}

let storage;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // ✅ Render (usa JSON en env)
  console.log("✅ Usando credenciales GCP desde ENV JSON");

  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  });

} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // ✅ Local (usa archivo)
  console.log("✅ Usando credenciales GCP desde archivo local");

  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

} else {
  console.log("⚠️ GCP no configurado");
  storage = null;
}

const bucket = storage
  ? storage.bucket(bucketName)
  : null;

export async function subirArchivoLocal(rutaLocal) {
  if (!bucket) {
    console.log("⚠️ Backup omitido (sin GCP)");
    return null;
  }

  const nombre = path.basename(rutaLocal);
  const destino = `backups/${nombre}`;

  await bucket.upload(rutaLocal, {
    destination: destino,
  });

  return destino;
}