import 'dotenv/config';
import path from 'path';

let bucket = null;

if (process.env.GOOGLE_CLOUD_BUCKET_NAME && process.env.GOOGLE_CLOUD_PROJECT_ID) {
  try {
    const { Storage } = await import('@google-cloud/storage');

    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    });

    bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

  } catch (err) {
    console.log("⚠️ GCP no configurado correctamente, backup desactivado");
  }
} else {
  console.log("⚠️ Variables GCP no definidas, backup desactivado");
}

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