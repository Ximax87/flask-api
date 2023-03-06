function cargarMovimientos() {
  console.log('Has llamado a la función cargarMovimientos()');
}

window.onload = function () {
  console.log('Función anónima al finalizar la carga de la ventana');
  const boton = document.querySelector('#boton-recarga');
  boton.addEventListener('click', cargarMovimientos);
};