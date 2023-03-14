let spinner;
const peticion = new XMLHttpRequest();
console.log("Empiezo a ejecutar JS");

function cargarMovimientos() {
  console.log('Has llamado a la función cargarMovimientos()');
  spinner.classList.remove('off');

  peticion.open('GET', 'http://localhost:4000/api/v1/movimientos', true);
  peticion.send();

  console.log('FIN de la función cargarMovimientos()');
};

function borrarMovimiento(event) {
  const target = event.target;
  const id = target.getAttribute('data-id');
  fetch(`http://localhost:4000/api/v1/movimientos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.status === 204) {
        alert(`El movimiento ha sido eliminado correctamente.`);
        cargarMovimientos();
        // FIXME: Simplemente eliminar la línea del movimiento (sin recargarlos todos)
      } else {
        alert('ERROR: La eliminación del movimiento ha fallado.');
      }
    })
    .catch(
      (error) => alert('ERROR DESCONOCIDO al borrar el movimiento (API)')
    );

}

function mostrarMovimientos() {
  console.log('Entramos en la función mostrarMovimientos', this);

  if (this.readyState === 4 && this.status === 200) {
    console.log('---- TODO OK ----');
    const respuesta = JSON.parse(peticion.responseText);
    const movimientos = respuesta.results;

    let html = '';
    for (let i = 0; i < movimientos.length; i = i + 1) {
      const mov = movimientos[i];

      if (mov.tipo === 'G') {
        mov.tipo = 'Gasto';
      } else if (mov.tipo === 'I') {
        mov.tipo = 'Ingreso';
      } else {
        mov.tipo = '---';
      }

      // Fecha en formato ES
      const fecha = new Date(mov.fecha);
      // puedo pasar la cultura es-ES o dejar que use la que tiene por defecto
      const fechaFormateada = fecha.toLocaleDateString();

      // Ajustar los decimales de la cantidad
      const opciones = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      const formateador = new Intl.NumberFormat('es-ES', opciones);
      const cantidad = formateador.format(mov.cantidad);

      // const laCantidad = mov.cantidad.toLocaleString();
      // const laCantidad = mov.cantidad.toFixed(2);

      html = html + `
        <tr>
          <td class="fecha">${fechaFormateada}</td>
          <td>${mov.concepto}</td>
          <td>${mov.tipo}</td>
          <td class="numero">${cantidad}</td>
          <td class="acciones">
            <a class="link-icon btn-delete">
              <i class="fa-solid fa-trash" data-id="${mov.id}"></i>
            </a>
            <a href="/modificar/${mov.id}" class="link-icon">
              <i class="fa-solid fa-pen-to-square"></i>
            </a>
        </td>
        </tr>
      `;
    }

    const tabla = document.querySelector('#cuerpo-tabla');
    tabla.innerHTML = html;

    const botonesBorrar = document.querySelectorAll('.btn-delete');
    // for btn in botonesBorrar:
    botonesBorrar.forEach((btn) => {
      btn.addEventListener('click', borrarMovimiento);
    });

  } else {
    console.error('---- Algo ha ido mal en la petición ----');
    alert('Error al cargar los movimientos');
  }

  spinner.classList.add('off');
  console.log('FIN de la función mostrarMovimientos');
}

window.onload = function () {
  console.log('Función anónima al finalizar la carga de la ventana');
  spinner = document.querySelector('#spinner');

  cargarMovimientos();
  peticion.onload = mostrarMovimientos;
};