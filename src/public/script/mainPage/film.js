document.addEventListener('DOMContentLoaded', cargarUsuario);

async function cargarUsuario() {
  try {
    const res = await fetch('/api/me', {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('No autenticado');

    const user = await res.json();
    console.log("👤 Usuario recibido:", user);

    const nombreEl = document.getElementById('nombre_usuario');

    const nombreCo = document.getElementById('nombre_email');

    if (nombreEl && user.username) {
      nombreEl.innerText = user.username;
    }
    if (nombreCo && user.email) {
      nombreCo.innerText = user.email;
    }

  } catch (err) {
    console.error('❌ Error cargando usuario:', err);
  }
}

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

const bellBtn = document.getElementById("bellBtn");
const panel = document.getElementById("notificationPanel");
const badge = document.getElementById("badgeCount");

// EJEMPLO (luego lo conectas a tus datos reales)
let notifications = [];

// TOGGLE PANEL
bellBtn.addEventListener("click", () => {
  panel.classList.toggle("hidden");
});

// RENDER NOTIFICACIONES
function renderNotifications(data) {
  notifications = data;

  // Actualizar contador
  if (notifications.length > 0) {
    badge.textContent = notifications.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  // Limpiar panel
  panel.innerHTML = "";

  if (notifications.length === 0) {
    panel.innerHTML = "<p class='text-gray-400'>No hay notificaciones</p>";
    return;
  }

  // Pintar cada notificación
  notifications.forEach(n => {
    const div = document.createElement("div");

    div.className =
      "p-2 mb-2 rounded text-white text-sm " +
      (n.type === "CRITICO"
        ? "bg-red-600"
        : n.type === "LOW"
        ? "bg-yellow-500 text-black"
        : "bg-gray-600");

    div.textContent = n.message;

    panel.appendChild(div);
  });
}

// FUNCIÓN MOSTRAR FECHA Y HORA EN TIEMPO REAL
function actualizarFechaHora() {
  const ahora = new Date();

  // ✅ FECHA (pequeña)
  const fecha = ahora.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // ✅ HORA (grande)
  const hora = ahora.toLocaleTimeString('es-ES');

  const fechaEl = document.getElementById('fecha');
  const horaEl = document.getElementById('hora');

  if (fechaEl) fechaEl.textContent = fecha;
  if (horaEl) horaEl.textContent = hora;
}

// Ejecutar una vez
actualizarFechaHora();

// Actualizar cada segundo
setInterval(actualizarFechaHora, 1000);


function calcularSaturacion(productos) {
  let optimos = 0;
  let riesgo = 0;
  let criticos = 0;

  productos.forEach(p => {
    const ratio = p.stock_actual / (p.stock_minimo || 1);

    if (p.stock_actual <= p.stock_minimo) {
      criticos++;
    } else if (ratio <= 1.5) {
      riesgo++;
    } else {
      optimos++;
    }
  });

  return { optimos, riesgo, criticos };
}
