from . import app


@app.route('/')
def inicio():
    return (f'La ruta del archivo de datos es: {app.config["RUTA"]}<br>'
            f'Secret key: {app.config["SECRET_KEY"]}')
