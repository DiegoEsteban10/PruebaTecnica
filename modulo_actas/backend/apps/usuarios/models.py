from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager

# Create your models here.
class CustomUserManager(UserManager):
    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})

class Usuario(AbstractUser):
    ROLES = [
        ('ADMIN', 'Administrador'),
        ('BASE', 'usuario base')
    ]
    correo = models.EmailField('correo',unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='BASE')
    
    password = models.CharField('contraseña', max_length=128)

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['username']

    objects = models.Manager()

def __str__(self):
    return self.correo