from django.db import models

# Create your models here.

class Acta (models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado')
    ]
    
    titulo = models.CharField(max_length=100)
    fecha = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADOS, default='pendiente')
    creador = models.ForeignKey('usuarios.Usuarios', on_delete=models.CASCADE, related_name='actas_creadas')
    archivo_pdf = models.FileField(upload_to='actas/')
    
    def __str__(self):
        return self.titulo