from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

@deconstructible
class MaxFileSizeValidator:
    def __init__(self, max_size):
        self.max_size = max_size  

    def __call__(self, value):
        if value.size > self.max_size:
            raise ValidationError(f'El archivo no puede superar {self.max_size/1024/1024}MB.')

    def __eq__(self, other):
        return self.max_size == other.max_size

class Gestion(models.Model):
    descripcion = models.TextField('Descripción')
    archivo_adjunto = models.FileField(
        'Archivo adjunto',
        upload_to='gestiones/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'jpg']),
            MaxFileSizeValidator(5*1024*1024)
        ]
    )
    fecha = models.DateTimeField('Fecha de creación', auto_now_add=True)
    acta = models.ForeignKey(
        'actas.Acta',
        on_delete=models.CASCADE,
        related_name='gestiones'
    )
    creador = models.ForeignKey(
        'usuarios.Usuario',  
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return f"Gestión #{self.id} - {self.acta.titulo}"

    def save(self, *args, **kwargs):
        if self.creador.rol == 'BASE' and self.acta.creador != self.creador:
            raise ValidationError("No tienes permiso para crear una gestión para este acta.")
        super().save(*args, **kwargs)