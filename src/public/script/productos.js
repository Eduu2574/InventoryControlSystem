const modal = document.getElementById('modalProducto');
const btnCrear = document.getElementById('crearProductoBtn');
const cerrarModal = document.getElementById('cerrarModal');
const form = document.getElementById('formProducto');

window.fabricaActiva = Number(localStorage.getItem("fabrica")) || 1;
document.addEventListener('DOMContentLoaded', async () => {

  const btn = document.getElementById("botonFabrica");
  const select = document.getElementById("selectorFabrica");

  // ✅ abrir selector
  if (btn && select) {
    btn.addEventListener("click", () => {
      select.classList.remove("hidden");
    });
  }

  // ✅ sincronizar valor
  if (select) {
    select.value = window.fabricaActiva;
  }

  // ✅ asegurar fábrica
  if (!localStorage.getItem("fabrica")) {
    localStorage.setItem("fabrica", 1);
  }

  // ✅ nombre fábrica
  try {
    const res = await fetch('/api/fabricas', { credentials: 'include' });
    const fabricas = await res.json();

    const fabrica = fabricas.find(f => f.id === window.fabricaActiva);

    const el = document.getElementById("nombreFabricaBtn");

    if (el) {
      el.innerText = fabrica ? fabrica.nombre : `Fábrica ${window.fabricaActiva}`;
    }

  } catch (err) {
    console.error(err);
  }

  cargarProductos();

});

// 🧠 evita duplicar notificaciones en cada refresh
let alertados = new Set();


/* ======================================================
   📦 CARGAR PRODUCTOS
====================================================== */
async function cargarProductos() {

  try {
    const response = await fetch(`/api/productos?fabrica=${window.fabricaActiva}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const productos = await response.json();
    window.productosGlobal = productos;

    // CALCULAR ESTADO
    let criticos = 0;
    let riesgo = 0;
    let optimos = 0;

    productos.forEach(p => {
      const stockActual = Number(p.stock_actual);
      const stockMinimo = Number(p.stock_minimo) || 1;

      if (stockActual <= stockMinimo) criticos++;
      else if (stockActual <= stockMinimo * 1.5) riesgo++;
      else optimos++;
    });

    // ✅ DASHBOARD
    animarNumero('totalCriticos', criticos);
    animarNumero('totalRiesgo', riesgo);
    animarNumero('totalOptimos', optimos);
    animarNumero('totalProductos', productos.length);


    // ✅ RECOMENDACIONES
    let texto = '';

    if (criticos > 0) {
      texto += `🔴 Tienes ${criticos} productos en estado crítico<br>`;
    }

    if (riesgo > 0) {
      texto += `🟡 ${riesgo} productos están en riesgo`;
    }

    document.getElementById('recomendacionTexto').innerHTML = texto;

    // ✅ NOTIFICACIONES
    const nuevasNotificaciones = [];

    productos.forEach(p => {
      if (p.stock_actual <= p.stock_minimo) {
        nuevasNotificaciones.push({
          type: "CRITICO",
          message: `CRÍTICO: ${p.nombre}`
        });
      } else if (p.stock_actual <= p.stock_minimo * 1.5) {
        nuevasNotificaciones.push({
          type: "LOW",
          message: `STOCK BAJO: ${p.nombre}`
        });
      }
    });

    renderNotifications(nuevasNotificaciones);
    if (nuevasNotificaciones.length > 0) {
      animarCampana();
    }

    // ✅ RENDER PRINCIPAL
    renderProductos(productos);

    // ✅ GRÁFICO
    renderGrafico(productos);

    // ✅ ORDEN
    ordenarProductos();

  } catch (error) {
    console.error('❌ ERROR FINAL:', error);
  }
}

// Cambiar fabrica activa

window.cambiarFabrica = async function () {
  const id = Number(document.getElementById('selectorFabrica').value);

  window.fabricaActiva = id;
  localStorage.setItem("fabrica", id);

  // Actualizar nombre fábrica en botón
  try {
    const res = await fetch('/api/fabricas', {
      credentials: 'include'
    });

    const fabricas = await res.json();

    const fabrica = fabricas.find(f => f.id === id);

    const el = document.getElementById("nombreFabricaBtn");

    if (el) {
      el.innerText = fabrica ? fabrica.nombre : `Fábrica ${id}`;
    }

  } catch (err) {
    console.error("Error actualizando fábrica", err);
  }

  // cerrar selector
  document.getElementById("selectorFabrica").classList.add("hidden");

  // recargar productos
  cargarProductos();
};




/* ======================================================
   ➕➖ MODIFICAR STOCK
====================================================== */
async function cambiarStock(id, cambio) {
  try {
    const res = await fetch(`/api/productos/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cambio })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarNotificacion(data.error || 'Error modificando stock');
      return;
    }

    alertados.clear();
    cargarProductos();

  } catch (err) {
    console.error(err);
  }
}
/* ======================================================
   ➕➖ ELIMINAR PRODUCTO
====================================================== */
async function eliminarProducto(id, nombre) {
  const confirmar = confirm(
    `¿Seguro que quieres eliminar el producto "${nombre}"?`
  );

  if (!confirmar) return;

  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await res.json();


    if (!res.ok) {
      // ✅ TOAST error
      mostrarNotificacion(
        `❌ Error eliminando ${nombre}: ${data.error || 'Error desconocido'}`,
        "error"
      );
      return;
    }


    // ✅ TOAST éxito
    mostrarNotificacion(
      `✅ Producto eliminado: ${nombre}`,
      "ok"
    );

    alertados.clear();
    cargarProductos();

  } catch (err) {
    console.error(err);

    // ✅ TOAST error conexión
    mostrarNotificacion("❌ Error de conexión", "error");
  }
}


async function verHistorial(productoId) {
  try {
    const res = await fetch(`/api/productos/${productoId}/movimientos`, {
      credentials: 'include'
    });

    if (!res.ok) {
      mostrarNotificacion('Error cargando historial');
      return;
    }

    const movimientos = await res.json();
    const tbody = document.getElementById('tablaHistorial');

    tbody.innerHTML = '';

    if (movimientos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="p-4 text-center text-gray-400">
            No hay movimientos registrados
          </td>
        </tr>
      `;
    } else {
      movimientos.forEach(m => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td class="p-2">${new Date(m.fecha).toLocaleString()}</td>
          <td class="p-2 font-bold ${m.tipo === 'INCREMENTO'
            ? 'text-green-400'
            : m.tipo === 'DECREMENTO'
              ? 'text-red-400'
              : 'text-yellow-400'
          }">${m.tipo}</td>
          <td class="p-2 text-right">${m.cantidad}</td>
          <td class="p-2 text-right">${m.stock_anterior}</td>
          <td class="p-2 text-right">${m.stock_nuevo}</td>
          <td class="p-2">${m.usuario}</td>
        `;

        tbody.appendChild(fila);
      });
    }

    document.getElementById('modalHistorial').classList.remove('hidden');

  } catch (err) {
    console.error(err);
    mostrarNotificacion('Error de conexión');
  }
}
function cerrarModalHistorial() {
  document.getElementById('modalHistorial').classList.add('hidden');
}


/* ======================================================
   📊 GRÁFICO
====================================================== */
function renderGrafico(productos) {

  const ctx = document.getElementById('graficoStock');
  if (!ctx) return;

  if (window.miGrafico) window.miGrafico.destroy();

  // ✅ ORDENAR POR STOCK MÍNIMO
  productos.sort((a, b) => a.stock_minimo - b.stock_minimo);

  window.miGrafico = new Chart(ctx, {
    data: {
      labels: productos.map(p => p.nombre),

      datasets: [

        {
          type: 'bar',
          label: 'Ver stock actual',

          data: productos.map(p => p.stock_actual),

          backgroundColor: productos.map(p => {
            if (p.stock_actual <= p.stock_minimo) return '#dc2626';
            if (p.stock_actual <= p.stock_minimo * 1.5) return '#f59e0b';
            return '#22c55e';
          }),

        },
        {
          type: 'line',
          label: 'Stock crítico',
          data: productos.map(p => p.stock_minimo),

          backgroundColor: '#dc2626',

        },
        {
          type: 'line',
          label: 'Stock en riesgo',
          data: productos.map(p => p.stock_minimo),

          borderWidth: 2,
          backgroundColor: '#f59e0b',

        },
        {
          type: 'line',
          label: 'Stock optimo',
          data: productos.map(p => p.stock_minimo),

          borderWidth: 2,
          backgroundColor: '#00d82f',
        },
        {
          type: 'line',
          label: 'Stock mínimo',
          data: productos.map(p => p.stock_minimo),

          borderWidth: 2,
          backgroundColor: '#0d72ff',
          pointRadius: 4,
          tension: 0.3
        }
      ]
    },

    options: {
      responsive: true,

      interaction: {
        mode: 'index',
        intersect: false
      },

      plugins: {
        tooltip: {
          filter: function (tooltipItem) {
            return (
              tooltipItem.dataset.label === 'Ver stock actual' ||
              tooltipItem.dataset.label === 'Stock mínimo'
            );
          },

          callbacks: {
            afterBody: function (items) {
              const p = productos[items[0].dataIndex];

              let estado = "Óptimo";
              if (p.stock_actual <= p.stock_minimo) estado = "Crítico";
              else if (p.stock_actual <= p.stock_minimo * 1.5) estado = "En riesgo";

              return [`Estado: ${estado}`];
            }
          }
        }

      }
    }
  });
}

/* ======================================================
   🟢 MODAL CREAR PRODUCTO
====================================================== */
btnCrear.addEventListener('click', () => modal.classList.remove('hidden'));
cerrarModal.addEventListener('click', () => modal.classList.add('hidden'));

form.addEventListener('submit', async e => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const stock = document.getElementById('stock').value;
  const securityStock = document.getElementById('securityStock').value;
  const fabrica_id = window.fabricaActiva;

  const res = await
    fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        nombre,
        descripcion,
        stock,
        securityStock,
        fabrica_id // 
      })
    });

  if (res.ok) {
    modal.classList.add('hidden');
    form.reset();
    alertados.clear();
    cargarProductos();
  } else {
    mostrarNotificacion('Error al crear producto');
  }
});

/* ======================================================
   ✏️ EDITAR PRODUCTO
====================================================== */
function abrirEdicionProducto(producto) {
  document.getElementById('edit_id').value = producto.id;
  document.getElementById('edit_nombre').value = producto.nombre;
  document.getElementById('edit_descripcion').value = producto.descripcion || '';
  document.getElementById('edit_stock').value = producto.stock_actual;
  document.getElementById('edit_stock_minimo').value = producto.stock_minimo || '';

  document
    .getElementById('modalEditarProducto')
    .classList.remove('hidden');
}

function cerrarModalEdicion() {
  document
    .getElementById('modalEditarProducto')
    .classList.add('hidden');
}


document.getElementById('btnPDF').addEventListener('click', generarPDF);
async function loadImageAsDataURL(url) {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('No se pudo cargar la imagen');
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error leyendo la imagen'));
    reader.readAsDataURL(blob);
  });
}


async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  try {
    const response = await fetch(`/api/productos?fabrica=${window.fabricaActiva}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Error cargando productos');

    const productos = await response.json();

    const logoDataUrl = await loadImageAsDataURL('assets/stock2.png').catch(() => null);

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 0, 0, 68, 38);
      doc.text('Listado de Productos', 52, 18);
      doc.text(`Fecha: ${new Date().toLocaleString()}`, 52, 26);

    } else {
      doc.setFontSize(28);
      doc.text('Listado de Productos', 14, 20);
      doc.setFontSize(18);
      doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 27);

    }


    // 📊 TABLA
    const body = productos.map(p => {
      let estado = 'OK';
      if (p.stock_actual <= p.stock_minimo) estado = 'CRÍTICO';
      else if (p.stock_actual <= p.stock_minimo * 1.5) estado = 'BAJO';

      return [
        p.nombre,
        p.descripcion || 'Sin descripción',
        p.stock_actual,
        p.stock_minimo,
        estado
      ];
    });

    doc.autoTable({
      startY: 35,
      head: [[
        'NOMBRE',
        'DESCRIPCIÓN',
        'STOCK ACTUAL',
        'STOCK MÍNIMO',
        'ESTADO STOCK'
      ]],
      body,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [30, 64, 175] // azul
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.text[0] === 'OK') {
            data.cell.styles.textColor = [0, 128, 0];
          }
          if (data.cell.text[0] === 'CRÍTICO') {
            data.cell.styles.textColor = [220, 38, 38];
          }
          if (data.cell.text[0] === 'BAJO') {
            data.cell.styles.textColor = [202, 138, 4];
          }
        }
      }
    });

    // 💾 GUARDAR
    doc.save(`productos_${new Date().toISOString().slice(0, 10)}.pdf`);

  } catch (err) {
    console.error(err);
    alert('Error generando el PDF');
  }
}
// ======================================================
// ✏️ EDITAR PRODUCTO
// ====================================================
document
  .getElementById('formEditarProducto')
  .addEventListener('submit', async (e) => {

    e.preventDefault();

    const id = document.getElementById('edit_id').value;

    const body = {
      nombre: document.getElementById('edit_nombre').value,
      descripcion: document.getElementById('edit_descripcion').value,
      stock: document.getElementById('edit_stock').value
    };

    const stockMin = document.getElementById('edit_stock_minimo').value;
    if (stockMin !== '') body.stock_minimo = stockMin;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarNotificacion(data.error || 'Error al editar');
        return;
      }

      cerrarModalEdicion();
      alertados.clear();
      cargarProductos();

    } catch (err) {
      console.error(err);
      mostrarNotificacion('Error de conexión');
    }
  });

/* ======================================================
 🔔 NOTIFICACIONES
====================================================== */
window.mostrarNotificacion = function (mensaje, tipo = "error") {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "999999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  let bg = "#dc2626";
  let color = "#fff";

  if (tipo === "warning") {
    bg = "#eab308";
    color = "#000";
  }
  if (tipo === "ok") bg = "#22c55e";

  toast.innerText = mensaje;
  toast.style.background = bg;
  toast.style.color = color;
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.5)";
  toast.style.fontSize = "14px";

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

window.ordenarProductos = function () {
  const tipo = document.getElementById('ordenProductos').value;

  let productos = [...window.productosGlobal];

  if (tipo === 'nombre-asc') {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (tipo === 'nombre-desc') {
    productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  if (tipo === 'stock-desc') {
    productos.sort((a, b) => Number(b.stock_actual) - Number(a.stock_actual));
  }

  if (tipo === 'stock-asc') {
    productos.sort((a, b) => Number(a.stock_actual) - Number(b.stock_actual));
  }

  // ✅ AHORA SÍ
  renderProductos(productos);
};

function renderProductos(productos) {
  const contenedor = document.getElementById('listaProductos');
  contenedor.innerHTML = '';

  productos.forEach(p => {
    const porcentaje = Math.min(
      (p.stock_actual / p.stock_minimo) * 100,
      100
    );

    let color = 'bg-green-500';
    let estado = 'OK';

    if (p.stock_actual <= p.stock_minimo) {
      color = 'bg-red-500';
      estado = 'CRÍTICO';
    } else if (p.stock_actual <= p.stock_minimo * 1.5) {
      color = 'bg-yellow-500';
      estado = 'BAJO';
    }

    const div = document.createElement('div');
    div.className =
      "bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 cursor-pointer";

    div.onclick = () => abrirEdicionProducto(p);

    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-bold text-white">${p.nombre}</h3>

        <div class="flex items-center gap-2">
          <button
            class="px-2 py-1 bg-red-600 rounded text-white text-xs hover:bg-red-700"
            onclick="event.stopPropagation(); cambiarStock(${p.id}, -1)"
            ${p.stock_actual <= 0 ? 'disabled' : ''}>
            −
          </button>

          <span class="text-sm font-bold">${p.stock_actual}</span>

          <button
            class="px-2 py-1 bg-green-600 rounded text-white text-xs hover:bg-green-700"
            onclick="event.stopPropagation(); cambiarStock(${p.id}, 1)">
            +
          </button>

          <button
            class="ml-2 px-2 py-1 bg-gray-700 hover:bg-red-700 text-white text-xs rounded"
            onclick="event.stopPropagation(); eliminarProducto(${p.id}, '${p.nombre}')">
            🗑️
          </button>
        </div>
      </div>

      <p class="text-gray-400 text-sm mb-3">${p.descripcion || ''}</p>

      <div class="mb-2">
        <div class="flex justify-between text-xs text-gray-400">
          <span>Stock</span>
          <span>${p.stock_actual} / ${p.stock_minimo}</span>
        </div>

        <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div class="${color} h-2 rounded-full"
               style="width: ${porcentaje}%"></div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-3">
        <span class="text-xs text-gray-400">
          Stock: ${p.stock_actual}
        </span>

        <button
          class="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded"
          onclick="event.stopPropagation(); verHistorial(${p.id})">
          VISUALIZAR HISTORIAL
        </button>
      </div>
    `;

    contenedor.appendChild(div);
  });
}

function animarNumero(id, nuevoValor) {
  const el = document.getElementById(id);

  // efecto crecer
  el.classList.add('scale-110');

  setTimeout(() => {
    el.innerText = nuevoValor;
  }, 100);

  setTimeout(() => {
    el.classList.remove('scale-110');
  }, 300);
}

// Animación de agitar al tener notificaciones
function animarCampana() {
  const campana = document.getElementById('bellBtn');

  if (!campana) return;

  campana.classList.add('shake');

  setTimeout(() => {
    campana.classList.remove('shake');
  }, 600);
}
setInterval(() => {
  // probabilidad del 40% de que se active
  if (Math.random() > 0.6) {
    animarCampana();
  }
}, 5000); // cada 5 segundos