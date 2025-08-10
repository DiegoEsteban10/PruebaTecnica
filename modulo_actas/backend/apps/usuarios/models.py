from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager

# Create your models here.
class CustomUserManager(UserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        extra_fields.setdefault('username', correo)
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'ADMIN')
        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractUser):
    ROLES = [
        ('ADMIN', 'Administrador'),
        ('BASE', 'usuario base')
    ]
    correo = models.EmailField('correo',unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='BASE')
    
    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.correo