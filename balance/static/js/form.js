console.log('--- Iniciamos ejecución de form.js ---');

// const form = document.querySelector('#mov-form');
const form = document.getElementById('mov-form');
form.addEventListener('submit', sendForm);

function sendForm(event) {
    console.log('Formulario enviado', event);
    event.preventDefault();

    // recoger los datos del formulario
    const formData = new FormData(form);
    console.log('formData', formData);
    // for value,key in formData:
    //   print(key, value)
    const jsonData = {};
    formData.forEach((value, key) => jsonData[key] = value);
    console.log('1. JSON', jsonData);


    // function(param1, param2) {
    //   console.log("Hola mundo")
    // }
    // (param1, param2) => {
    //   console.log("Hola mundo")
    // }

    // function() { console.log("Hola"); }
    // () => console.log("Hola");

    // enviar la petición con los datos a la API
    fetch('http://localhost:5000/api/v1/movimientos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
        // JavaScript Object Notation
    })
        .then(
            (response) => {
                console.log('2.', response);
                return response.json();
            }
        )
        .then((data) => {
            console.log('3.', data);
            if (data.status === 'error') {
                // TODO: mostrar los errores en la página
                // 1. mensaje global encima del formulario ---
                // 2: mensaje en cada campo con error --------
                // 2.1: el mensaje debe desaparecer tras unos segundos (5)
                // 3. color rojo en los campos con error -----
                alert(`ERROR:\n${data.message}`);
            } else {
                // A ELEGIR
                // TODO: redireccionar a la página de inicio
                // TODO: mostrar mensaje de OK y vaciar el formulario (para poder insertar otro movimiento)
                // TODO: el mensaje debe desaparecer tras unos segundos (5)
                alert('Se ha insertado el movimiento');
            }
        })
        .catch(
            (error) => console.error('4. ERROR!', 'No se ha podido acceder a la API')
        );
    console.log('5. He hecho la petición');
    // esperar el resultado
}