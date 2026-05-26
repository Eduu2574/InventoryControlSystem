document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('modalCrearFabrica');
  const btnCrear = document.getElementById('crearFabricaBtn');
  const cerrarModal = document.getElementById("cerrarModalCrearFabrica");
  const form = document.getElementById('formCrearFabrica');

  // ✅ comprobar que existen
  console.log(btnCrear, modal, form);

  btnCrear.addEventListener('click', () => {
    console.log("CLICK CREAR FABRICA ✅");
    modal.classList.remove('hidden');
  });

  cerrarModal.addEventListener('click', () => modal.classList.add('hidden'));

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nombre = document.getElementById("nombreFabrica").value;

    console.log("Enviando fábrica:", nombre);

    const res = await fetch('/api/fabricas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre })
    });

    if (res.ok) {
      modal.classList.add('hidden');
      form.reset();
      cargarFabricas();
    } else {
      console.error("Error creando fábrica");
    }
  });
  

});

async function cargarFabricas() {
  try {
    const res = await fetch('/api/fabricas', {
      credentials: 'include'
    });

    const fabricas = await res.json();

    const select = document.getElementById('selectorFabrica');

    select.innerHTML = ''; // limpiar

    fabricas.forEach(f => {
      const option = document.createElement('option');
      option.value = f.id;
      option.textContent = f.nombre;
      select.appendChild(option);
    });

    // ✅ opcional: seleccionar la primera
    if (fabricas.length > 0) {
      window.fabricaActiva = fabricas[0].id;
      actualizarNombreFabrica(fabricas[0].nombre);
    }

  } catch (err) {
    console.error("Error cargando fábricas:", err);
  }
}
