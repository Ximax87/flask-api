const peticion = new XMLHttpRequest();
console.log("Empiezo a ejecutar JS");

function cargarMovimientos() {
  console.log('Has llamado a la función cargarMovimientos()');

  peticion.open('GET', 'http://localhost:5000/api/v1/movimientos', false);
  peticion.send();
  console.log(peticion.responseText);
};

window.onload = function () {
  console.log('Función anónima al finalizar la carga de la ventana');
  const boton = document.querySelector('#boton-recarga');
  boton.addEventListener('click', cargarMovimientos);
};