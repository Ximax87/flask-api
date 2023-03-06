from . import app


@app.route('/')
def inicio():
    return 'Vamos a crear una API'
