let spinner;
const peticion = new XMLHttpRequest();
console.log("Empiezo a ejecutar JS");

function cargarMovimientos() {
  console.log('Has llamado a la función cargarMovimientos()');
  spinner.classList.remove('off');

  peticion.open('GET', 'http://127.0.0.1:5000//api/v1/movimientos', true);
  peticion.send();

  console.log('FIN de la función cargarMovimientos()');
};

function borrarMovimiento(event) {
  const target = event.target;
  const id = target.getAttribute("data-id");
  fetch(`http://127.0.0.1:5000//api/v1/movimientos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (response.status === 204) {
        alert(`El movimientoi ha sido eliminado correctamente.`);
        cargarMovimientos();
      } else {
        alert(`ERROR: La eliminación dle movimiento ha fallado`);
      }
    })
    .catch(
      (error) => alert(`Error desconocido al borrar el movimiento (API)`)
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
      const fechaFormateada = fecha.toLocaleDateString()


      // Ajustar los decimales de la cantidad
      const opciones = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      const formateador = new Intl.NumberFormat("es-ES", opciones);
      const cantidad = formateador.format(mov.cantidad);

      // TODO: Incluir los botones de acciones

      html = html + `
        <tr>
          <td>${fechaFormateada}</td>
          <td>${mov.concepto}</td>
          <td>${mov.tipo}</td>
          <td class="numero">${cantidad}</td>
          <td class="acciones">
            <a class="link-icon btn-delete">
            <i class=fa-solid fa-trash" data-id="${mov.id}></i>

            <a href="/modificar/${mov.id}" class="link-icon">
            <i class=fa-solid fa-pen-to-square"></i>
          
          </td>
        </tr>
      `;
    }

    const tabla = document.querySelector('#cuerpo-tabla');
    tabla.innerHTML = html;

    const botonesBorrar = document.querySelectorAll(".btn-delete");
    botonesBorrar.forEach((btn) => {
      btn.addEventListener("click", borrarMovimiento);
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
  const boton = document.querySelector('#boton-recarga');
  boton.addEventListener('click', cargarMovimientos);
  spinner = document.querySelector('#spinner');

  cargarMovimientos();
  peticion.onload = mostrarMovimientos;
};