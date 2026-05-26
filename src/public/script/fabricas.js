document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('modalCrearFabrica');
  const btnCrear = document.getElementById('crearFabricaBtn');
  const form = document.getElementById('formCrearFabrica');
  const inputNombre = document.getElementById('crear_nombre');
  const cerrarModal = document.getElementById("cerrarModalCrearFabrica");
  const select = document.getElementById('selectorFabrica');

  /* ======================================================
     🟢 ABRIR / CERRAR MODAL
  ====================================================== */
  btnCrear.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  cerrarModal.addEventListener('click', () => modal.classList.add('hidden'));


  /* ======================================================
     🟢 CARGAR FÁBRICAS DESDE BD
  ====================================================== */
  async function cargarFabricas() {
    try {
      const res = await fetch('/api/fabricas', {
        credentials: 'include'
      });

      const fabricas = await res.json();

      select.innerHTML = '';

      fabricas.forEach(f => {
        const option = document.createElement('option');
        option.value = f.id;
        option.textContent = f.nombre;
        select.appendChild(option);
      });

      // ✅ establecer fábrica activa
      if (fabricas.length > 0) {
        window.fabricaActiva = fabricas[0].id;
        actualizarNombreFabrica(fabricas[0].nombre);
      }

    } catch (err) {
      console.error("Error cargando fábricas:", err);
    }
  }

  /* ======================================================
     🟢 CAMBIAR FÁBRICA ACTIVA
  ====================================================== */
  window.cambiarFabrica = function () {
    const id = select.value;
    const nombre = select.options[select.selectedIndex].text;

    window.fabricaActiva = id;
    actualizarNombreFabrica(nombre);

    console.log("Fábrica activa:", id);

    // 🔥 recargar productos de esa fábrica
    if (typeof cargarProductos === "function") {
      cargarProductos();
    }
  };

  /* ======================================================
     🟢 ACTUALIZAR TEXTO SUPERIOR
  ====================================================== */
  function actualizarNombreFabrica(nombre) {
    document.getElementById('nombreFabricaBtn').textContent = nombre;
  }

  /* ======================================================
     ➕ CREAR FÁBRICA
  ====================================================== */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreFabrica").value;

    if (!nombre) {
      alert("Introduce un nombre para la fábrica");
      return;
    }

    console.log("Creando fábrica:", nombre);

    try {
      const res = await fetch('/api/fabricas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre })
      });

      if (res.ok) {
        modal.classList.add('hidden');
        form.reset();

        await cargarFabricas(); // ✅ recargar lista dinámica

      } else {
        console.error("Error creando fábrica");
      }

    } catch (err) {
      console.error("Error en fetch:", err);
    }
  });

  /* ======================================================
     🚀 INICIALIZAR
  ====================================================== */
  cargarFabricas();

});