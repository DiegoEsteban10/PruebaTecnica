from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'correo', 'rol', 'username', 'contraseña'] 
        extra_kwargs = {
            'password': {'write_only': True, 'label': 'Contraseña'}, 
            'contraseña': {'source': 'password'}  
        }