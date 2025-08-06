from django.db import models
from apps.actas.models import Acta

# Create your models here.
class Compromiso(models.Model):
    descripcion = models.TextField('Descripción')
    fecha_limite = models.DateField('Fecha límite')
    acta = models.ForeignKey('actas.Acta', on_delete=models.CASCADE, related_name='compromisos')
    
    def __str__(self):
        return f"Compromiso: {self.descripcion[:50]}..."