from django.db import models
from apps.actas.models import Acta
from apps.usuarios.models import Usuario
from django.core.validators import FileExtensionValidator , MaxFileSizeValidator
# Create your models here.
class Gestion(models.Model):
    descripcion = models.TextField('Descripción')
    archivo_adjunto = models.FileField('archivo adjunto', upload_to='gestiones/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg']), MaxFileSizeValidator(5*1024*1024)])
    fecha = models.DateField('fecha de creacion',auto_now_add=True)
    acta = models.ForeignKey('actas.Acta', on_delete=models.CASCADE, related_name='gestiones')
    creador = models.ForeignKey('usuarios.Usuarios', on_delete=models.CASCADE)
    
def __str__(self):
    return f"Gestion #{self.id} - {self.acta.titulo}"


def save (self, *args, **kwargs):
    from django.core.exceptions import PermissionDenied
    if self.acta.rol == 'BASE' and self.acta.creador != self.creador:
        raise PermissionDenied ("No tienes permiso para crear una gestión para este acta.")
    super(Gestion, self).save(*args, **kwargs)