from django.db import models
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.utils.deconstruct import deconstructible

# Create your models here.

@deconstructible

class MaxFileSizeValidator: 
    def __init__(self, max_size):
        self.max_size = max_size

    def __call__(self, value):
        if value.size > self.max_size:
            raise ValidationError(f"El archivo no debe pesar más de {self.max_size} bytes.")
        
class Gestion(models.Model):
    descripcion = models.TextField()
    archivo_adjunto = models.FileField(upload_to='gestiones/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg']), MaxFileSizeValidator(5 * 1024 * 1024)])
    fecha = models.DateField(auto_now_add=True)
    acta = models.ForeignKey('actas.Acta', on_delete=models.CASCADE, related_name='gestiones')
    creador = models.ForeignKey('usuarios.Usuarios', on_delete=models.CASCADE)
    
def __str__(self):
    return f"Gestion #{self.id} - {self.acta.titulo}"


def save (self, *args, **kwargs):
    from django.core.exceptions import PermissionDenied
    if self.acta.rol == 'BASE' and self.acta.creador != self.creador:
        raise PermissionDenied ("No tienes permiso para crear una gestión para este acta.")
    super(Gestion, self).save(*args, **kwargs)