from flask import jsonify, render_template

from . import app
from .models import DBManager


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


/api/v1/facturas
/api/v2/movimientos
/api/v1/contatos
/api/v1/usuarios
/api/v1/donaciones
/api/v1/compras

Devuelve un array de objetos JSON o un objeto JSON.

Por ejemplo, un movimiento:

{
  "id": 1,
  "fecha": "2023-02-27",
  "concepto": "Camiseta",
  "tipo": "G",
  "cantidad": 12.35
}
"""

RUTA = app.config.get('RUTA')


# TODO: obtener un movimiento por ID
# TODO: actualizar movimiento por ID
# TODO: eliminar movimiento por ID


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/v1/movimientos')
def listar_movimientos():
    try:
        db = DBManager(RUTA)
        sql = 'SELECT * FROM movimientos'
        movimientos = db.consultaSQL(sql)
        if len(movimientos) > 0:
            resultado = {
                "status": "success",
                "results": movimientos
            }
            status_code = 200
        else:
            resultado = {
                'status': 'error',
                'message': f'No hay movimientos en el sistema'
            }
            status_code = 404

    except Exception as error:
        resultado = {
            "status": "error",
            "message": str(error)
        }
        status_code = 500

    return jsonify(resultado), status_code


@app.route('/api/v1/movimientos/<int:id>')
def get_movimiento(id):
    """
    instanciar DBManager
    preparar la consulta
    ejecutar la consulta
    leer el resultado
    si ok:
      resultado es success / movimiento
    si error:
      resultado es error / mensaje
    devolvemos el resultado
    """

    try:
        db = DBManager(RUTA)
        mov = db.obtenerMovimiento(id)
        if mov:
            resultado = {
                'status': 'success',
                'results': mov
            }
            status_code = 200
        else:
            resultado = {
                'status': 'error',
                'message': f'No he encontrado un movimiento con el ID={id}'
            }
            status_code = 404
    except Exception as error:
        resultado = {
            'status': 'error',
            'message': str(error)
        }
        status_code = 500

    return jsonify(resultado), status_code
