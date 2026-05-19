let fabricasGlobal = [];

const fabricaActiva = Number(localStorage.getItem("fabrica")) || 1;

document.addEventListener('DOMContentLoaded', async () => {

  try {
    // ✅ cargar fábricas
    const resFab = await fetch('/api/fabricas', {
      credentials: 'include'
    });

    if (!resFab.ok) throw new Error('Error cargando fábricas');

    const fabricas = await resFab.json();

    const fabrica = fabricas.find(f => f.id === fabricaActiva);

    const el = document.getElementById("nombreFabrica");
    if (el) {
      el.innerText = fabrica ? fabrica.nombre : `Fábrica ${fabricaActiva}`;
    }

    // ✅ cargar historial inicial
    cargarHistorialGlobal();

  } catch (err) {
    console.error(err);
    alert('Error inicializando historial');
  }

});

/* ======================================================
   📊 CARGAR HISTORIAL GLOBAL (fecha + tipo opcional)
====================================================== */
async function cargarHistorialGlobal(desde = '', hasta = '', tipo = '') {
  try {
    const params = [`fabrica=${fabricaActiva}`];

    if (desde && hasta) {
      params.push(`desde=${desde}`);
      params.push(`hasta=${hasta}`);
    }

    if (tipo) {
      params.push(`tipo=${tipo}`);
    }

    let url = `/api/movimientos?${params.join('&')}`;

    const res = await fetch(url, { credentials: 'include' });

    if (!res.ok) throw new Error('Error cargando historial');

    const movimientos = await res.json();

    pintarFilas(movimientos);

  } catch (err) {
    console.error(err);
    alert('Error cargando historial');
  }
}


/* ======================================================
   🖊️ PINTAR FILAS DE LA TABLA
====================================================== */
function pintarFilas(movimientos) {
  const tbody = document.getElementById('tablaHistorialGlobal');
  tbody.innerHTML = '';

  if (movimientos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-4 text-center text-gray-400">
          No hay movimientos para los filtros seleccionados
        </td>
      </tr>
    `;
    return;
  }

  movimientos.forEach(m => {
    const fila = document.createElement('tr');

    const esAjusteManual = m.tipo === 'AJUSTE_MANUAL';
    const esEliminado = m.tipo === 'ELIMINADO';

    fila.innerHTML = `
    <td class="p-2">
      ${new Date(m.fecha).toLocaleString()}
    </td>

    <td class="p-2 font-bold">
      ${m.producto}
    </td>

    <td class="p-2 font-bold ${m.tipo === 'INCREMENTO'
        ? 'text-green-400'
        : m.tipo === 'DECREMENTO'
          ? 'text-red-400'
          : esAjusteManual
            ? 'text-yellow-400'
            : 'text-gray-400'
      }">
      ${esEliminado
        ? 'PRODUCTO ELIMINADO'
        : esAjusteManual
          ? 'AJUSTE MANUAL'
          : m.tipo
      }
    </td>

    <td class="p-2 text-right">
      ${esEliminado ? '-' : m.cantidad}
    </td>

    <td class="p-2 text-right">
      ${esEliminado ? '-' : m.stock_anterior}
    </td>

    <td class="p-2 text-right">
      ${esEliminado ? '-' : m.stock_nuevo}
    </td>

    <td class="p-2">
      ${m.usuario}
    </td>
  `;

    if (esEliminado) {
      fila.classList.add('bg-gray-800/60');
    }

    tbody.appendChild(fila);
  });
}

/* ======================================================
   📅 FILTROS (FECHA + TIPO)
====================================================== */
function aplicarFiltroFechas() {
  const desde = document.getElementById('filtroDesde').value;
  const hasta = document.getElementById('filtroHasta').value;
  const tipo = document.getElementById('filtroTipo').value;

  // Sin filtros → todo
  if (!desde && !hasta && !tipo) {
    cargarHistorialGlobal();
    return;
  }

  // Validación fechas
  if ((desde && !hasta) || (!desde && hasta)) {
    alert('Selecciona ambas fechas');
    return;
  }

  cargarHistorialGlobal(desde, hasta, tipo);
}

function limpiarFiltroFechas() {
  document.getElementById('filtroDesde').value = '';
  document.getElementById('filtroHasta').value = '';
  document.getElementById('filtroTipo').value = '';
  cargarHistorialGlobal();
}
``