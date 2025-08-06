from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):
    ROLES = [
        ('ADMIN', 'Administrador'),
        ('BASE', 'usuario base')
    ]
    correo = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='user')
    
    password = models.CharField('contraseña', max_length=128)

USERNAME_FIELD = 'correo'
REQUIRED_FIELDS = ['username']

def __str__(self):
    return self.correo