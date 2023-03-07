from flask_wtf import FlaskForm
from wtforms import DateField, FloatField, HiddenField, RadioField, StringField, SubmitField
from wtforms.validators import DataRequired


class MovimientoForm(FlaskForm):
    id = HiddenField()
    fecha = DateField('Fecha', validators=[DataRequired(
        message="Debes introducir una fecha")])
    concepto = StringField('Concepto', validators=[
                           DataRequired(message="Debes especificar un concepto")])
    tipo = RadioField(
        choices=[('I', 'Ingreso'), ('G', 'Gasto')], validators=[DataRequired()])
    cantidad = FloatField('Cantidad', validators=[DataRequired(
        message="La cantidad debe tener un valor")])

    submit = SubmitField('Guardar')
