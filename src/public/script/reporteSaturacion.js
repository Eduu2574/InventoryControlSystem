let productosGlobal = [];
let fabricasGlobal = [];

const fabricaActiva = Number(localStorage.getItem("fabrica")) || 1;

document.addEventListener('DOMContentLoaded', async () => {

  try {
    // ✅ cargar fábricas
    const resFabricas = await fetch('/api/fabricas', {
      credentials: 'include'
    });

    if (!resFabricas.ok) throw new Error('Error cargando fábricas');

    fabricasGlobal = await resFabricas.json();

    const fabrica = fabricasGlobal.find(f => f.id === fabricaActiva);

    const el = document.getElementById("nombreFabrica");

    if (el) {
      el.innerText = fabrica ? fabrica.nombre : `Fábrica ${fabricaActiva}`;
    }

    // ✅ cargar productos
    const res = await fetch(`/api/productos?fabrica=${fabricaActiva}`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Error cargando productos');

    productosGlobal = await res.json();

    const datos = calcularSaturacion(productosGlobal);

    pintarResumen(datos, productosGlobal.length);
    pintarLista(productosGlobal);

  } catch (err) {
    console.error(err);
    alert('Error cargando el reporte de saturación');
  }

});

// ✅ FUNCIÓN CALCULAR SATURACIÓN (SOLO UNA VEZ)
function calcularSaturacion(productos) {
  let optimos = 0;
  let riesgo = 0;
  let criticos = 0;

  productos.forEach(p => {
    if (!p.stock_minimo) return;

    if (p.stock_actual <= p.stock_minimo) {
      criticos++;
    } else if (p.stock_actual <= p.stock_minimo * 1.5) {
      riesgo++;
    } else {
      optimos++;
    }
  });

  return { optimos, riesgo, criticos };
}


// ✅ RESUMEN
function pintarResumen({ optimos, riesgo, criticos }, total) {
  const cont = document.getElementById('resumenSaturacion');

  cont.innerHTML = `
    <!-- FILA 1 -->
    <div class="bg-green-700 p-4 rounded">
      <p class="text-xl font-bold">${optimos}</p>
      <p>Óptimos</p>
    </div>

    <div class="bg-yellow-600 p-4 rounded">
      <p class="text-xl font-bold">${riesgo}</p>
      <p>Riesgo</p>
    </div>

    <div class="bg-red-700 p-4 rounded">
      <p class="text-xl font-bold">${criticos}</p>
      <p>Críticos</p>
    </div>

    <!-- FILA 2 -->
    <div class="col-span-3 bg-indigo-700 p-4 rounded">
      <p class="text-2xl font-bold">${total}</p>
      <p>Total productos en stock en tiempo real</p>
    </div>
  `;
}


// ✅ LISTA DE PRODUCTOS
function pintarLista(productos) {
  const tbody = document.getElementById('tablaSaturacion');
  tbody.innerHTML = '';

  if (productos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="p-4 text-center text-gray-400">
          No hay datos disponibles
        </td>
      </tr>
    `;
    return;
  }

  productos.forEach(p => {
    let estado = '';
    let color = '';

    if (!p.stock_minimo) {
      estado = 'SIN MÍNIMO';
      color = 'text-gray-400';
    } else if (p.stock_actual <= p.stock_minimo) {
      estado = 'CRÍTICO';
      color = 'text-red-400';
    } else if (p.stock_actual <= p.stock_minimo * 1.5) {
      estado = 'RIESGO';
      color = 'text-yellow-400';
    } else {
      estado = 'ÓPTIMO';
      color = 'text-green-400';
    }

    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td class="p-2 font-bold">
        ${p.nombre}
      </td>

      <td class="p-2 text-left">
        ${p.stock_actual}
      </td>

      <td class="p-2 text-left">
        ${p.stock_minimo || '-'}
      </td>

      <td class="p-2 font-bold ${color}">
        ${estado}
      </td>
    `;

    tbody.appendChild(fila);
  });
}

function aplicarFiltroEstado() {
  const estado = document.getElementById('filtroEstado').value;

  if (!estado) {
    pintarLista(productosGlobal);
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

  pintarLista(filtrados);
}

function limpiarFiltroEstado() {
  document.getElementById('filtroEstado').value = '';
  pintarLista(productosGlobal);
}