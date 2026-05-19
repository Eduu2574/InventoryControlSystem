let productosGlobal = [];
let fabricasGlobal = [];

const fabricaActiva = Number(localStorage.getItem("fabrica")) || 1;

document.addEventListener("DOMContentLoaded", async () => {

  try {
    // ✅ cargar fábricas (CLAVE)
    const resFab = await fetch('/api/fabricas', {
      credentials: 'include'
    });

    if (!resFab.ok) throw new Error('Error cargando fábricas');

    fabricasGlobal = await resFab.json();

    // ✅ encontrar fábrica activa
    const fabrica = fabricasGlobal.find(f => f.id === fabricaActiva);

    const el = document.getElementById("nombreFabrica");

    if (el) {
      el.innerText = fabrica ? fabrica.nombre : `Fábrica ${fabricaActiva}`;
    }

    // ✅ sincronizar selector (si existe)
    const select = document.getElementById("selectorFabrica");
    if (select) {
      select.value = fabricaActiva;
    }

    // ✅ cargar productos
    const res = await fetch(`/api/productos?fabrica=${fabricaActiva}`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Error cargando productos');

    productosGlobal = await res.json();

    abrirExpedicion();

  } catch (err) {
    console.error(err);
    alert('Error cargando datos');
  }

});



// ======================================================
// 🧾 PINTAR LISTA DE EXPEDICIÓN (UI)
// ======================================================
function abrirExpedicion() {

  if (!productosGlobal || productosGlobal.length === 0) {
    alert('No hay productos cargados');
    return;
  }

  const cont = document.getElementById('listaExpedicion');
  cont.innerHTML = '';

  productosGlobal.forEach(p => {
    cont.innerHTML += `
      <div class="grid grid-cols-4 items-center bg-gray-800 p-3 rounded hover:bg-gray-700 transition">

        <div class="text-center">
          <input type="checkbox" data-id="${p.id}" class="scale-125">
        </div>

        <div class="font-bold">
          ${p.nombre}
        </div>

        <div class="text-center text-gray-400">
          ${p.stock_actual}
        </div>

        <div class="text-center">
          <input 
            type="number"
            min="1"
            max="${p.stock_actual}"
            class="w-20 text-center bg-gray-900 p-1 rounded border border-gray-600"
            data-cantidad="${p.id}"
            oninput="calcularTotal()">
        </div>

      </div>
    `;
  });

  calcularTotal(); // inicializa en 0
}


// ======================================================
// 🔢 CALCULAR TOTAL DINÁMICO
// ======================================================
function calcularTotal() {
  const inputs = document.querySelectorAll('#listaExpedicion input[data-cantidad]');
  let total = 0;

  inputs.forEach(input => {
    const value = Number(input.value);
    if (value > 0) total += value;
  });

  const totalEl = document.getElementById('totalExpedicion');
  if (totalEl) totalEl.innerText = total;
}


// ======================================================
// ✅ CONFIRMAR EXPEDICIÓN
// ======================================================
async function confirmarExpedicion() {

  const checks = document.querySelectorAll('#listaExpedicion input[type="checkbox"]:checked');

  let total = 0;
  const operaciones = [];

  for (const chk of checks) {
    const id = chk.dataset.id;

    const producto = productosGlobal.find(p => p.id == id);
    const cantidadInput = document.querySelector(`[data-cantidad="${id}"]`);

    const cantidad = Number(cantidadInput.value);

    // ✅ validaciones
    if (!cantidad || cantidad <= 0) continue;

    if (cantidad > producto.stock_actual) {
      alert(`❌ No puedes expedir más de ${producto.stock_actual} en ${producto.nombre}`);
      return;
    }

    if (producto.fabrica_id != fabricaActiva) {
      alert("❌ Producto no pertenece a la fábrica activa");
      return;
    }


    total += cantidad;
    operaciones.push({ id, cantidad, nombre: producto.nombre });
  }

  if (operaciones.length === 0) {
    alert('Selecciona productos con cantidad válida');
    return;
  }

  const confirmado = confirm(`¿Seguro que quieres expedir ${total} productos en total?`);

  if (!confirmado) return;

  try {

    for (const op of operaciones) {
      await fetch(`/api/productos/${op.id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cambio: -op.cantidad
        })
      });
    }

    alert('✅ Expedición realizada correctamente');

    location.reload();

  } catch (err) {
    console.error(err);
    alert('Error al expedir productos');
  }
}


// ======================================================
// 🔄 FILTRO POR ESTADO
// ======================================================
function aplicarFiltroEstado() {
  const estado = document.getElementById('filtroEstado').value;

  if (!estado) {
    abrirExpedicion();
    return;
  }

  const filtrados = productosGlobal.filter(p => {
    if (!p.stock_minimo) return false;

    if (estado === 'CRITICO') {
      return p.stock_actual <= p.stock_minimo;
    }

    if (estado === 'RIESGO') {
      return (
        p.stock_actual > p.stock_minimo &&
        p.stock_actual <= p.stock_minimo * 1.5
      );
    }

    if (estado === 'OPTIMO') {
      return p.stock_actual > p.stock_minimo * 1.5;
    }
  });

  pintarFiltrados(filtrados);
}


// ======================================================
// 🧾 PINTAR FILTRADOS
// ======================================================
function pintarFiltrados(productos) {
  const cont = document.getElementById('listaExpedicion');
  cont.innerHTML = '';

  productos.forEach(p => {
    cont.innerHTML += `
      <div class="grid grid-cols-4 items-center bg-gray-800 p-3 rounded hover:bg-gray-700 transition">

        <div class="text-center">
          <input type="checkbox" data-id="${p.id}">
        </div>

        <div class="font-bold">
          ${p.nombre}
        </div>

        <div class="text-center text-gray-400">
          ${p.stock_actual}
        </div>

        <div class="text-center">
          <input 
            type="number"
            min="1"
            max="${p.stock_actual}"
            class="w-20 text-center bg-gray-900 p-1 rounded"
            data-cantidad="${p.id}"
            oninput="calcularTotal()">
        </div>

      </div>
    `;
  });

  calcularTotal();
}


// ======================================================
// 🧹 LIMPIAR FILTRO
// ======================================================
function limpiarFiltroEstado() {
  document.getElementById('filtroEstado').value = '';
  abrirExpedicion();
}