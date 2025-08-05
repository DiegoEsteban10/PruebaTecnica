from django.db import models

# Create your models here.
class Compromiso(models.Model):
    descripcion = models.TextField()
    fecha_limite = models.DateField()
    acta = models.ForeignKey('actas.Acta', on_delete=models.CASCADE, related_name='compromisos')
    
    def __str__(self):
        return f"Compromiso: {self.descripcion[:50]}..."