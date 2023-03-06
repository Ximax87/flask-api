from . import app


"""
Verbos y formato de endpoints

GET /movimientos ----------> LISTAR movimientos
POST /movimientos ---------> CREAR un movimiento nuevo

GET /movimientos/1 --------> LEER el movimiento con ID=1
POST /movimientos/1 -------> ACTUALIZAR el movimiento con ID=1 (sobreescribe todo el objeto)
PUT /movimientos/1 --------> ACTUALIZAR el movimiento con ID=1 (sobreescribe parcialmente)
DELETE /movimientos/1 -----> ELIMINAR el movimiento con ID=1

IMPORTANTE!!!
Versionar los endpoint (son un contrato)
/api/v1/...


"""


@app.route('/')
def inicio():
    return (f'La ruta del archivo de datos es: {app.config["RUTA"]}<br>'
            f'Secret key: {app.config["SECRET_KEY"]}')
