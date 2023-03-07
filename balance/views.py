from flask import jsonify, render_template

from . import app
from .forms import MovimientoForm
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

# TODO: crear un movimiento
# TODO: actualizar movimiento por ID


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/nuevo')
def form_nuevo():
    formulario = MovimientoForm()
    return render_template('form_movimiento.html', form=formulario, accion='/nuevo')


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


@app.route('/api/v1/movimientos/<int:id>', methods=['DELETE'])
def eliminar_movimiento(id):
    """
    Instanciar DBManager
    Comprobar si existe el movimiento con ese ID
    Si existe:
        Preparar sql de la consulta de eliminación
        Ejecutar la consulta de eliminación
        si se ha borrado:
            resultado = ok
        si no:
            resultado = ko
            mensaje = error al borrar
    si no existe:
        resultado = ko
        mensaje = No existe
    """
    try:
        db = DBManager(RUTA)
        mov = db.obtenerMovimiento(id)
        if mov:
            sql = 'DELETE FROM movimientos WHERE id=?'
            esta_borrado = db.consultaConParametros(sql, (id,))
            if esta_borrado:
                resultado = {
                    'status': 'success'
                }
                status_code = 204
            else:
                resultado = {
                    'status': 'error',
                    'message': f'No se ha eliminado el movimiento con ID={id}'
                }
                status_code = 500
        else:
            resultado = {
                'status': 'error',
                'message': f'No existe un movimiento con ID={id} para eliminar'
            }
            status_code = 404
    except:
        resultado = {
            'status': 'error',
            'message': 'Error desconocido en el servidor'
        }
        status_code = 500

    return jsonify(resultado), status_code
