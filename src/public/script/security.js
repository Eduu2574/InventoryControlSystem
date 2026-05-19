async function opcionSeguridad() {
  try {
    const resp = await fetch('/api/security/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await resp.json();

  alert('Backup de seguridad generado');

    if (!resp.ok) {
      throw new Error(data.error || 'Error desconocido');
    }

    alert('✅ Backup de seguridad generado correctamente');
    console.log('Archivo:', data.archivo);
  } catch (err) {
    console.error(err);
    alert('❌ Error al generar la copia de seguridad');
  }
}