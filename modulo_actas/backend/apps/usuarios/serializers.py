from rest_framework import serializers
from .models import Usuario

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
class UsuarioSerializer(serializers.ModelSerializer):
    contraseña = serializers.CharField(
        write_only=True,  
        style={'input_type': 'password'}  
    )

    class Meta:
        model = Usuario
        fields = ['id', 'correo', 'contraseña', 'rol']  # Incluye todos los campos necesarios
        extra_kwargs = {
            'password': {'write_only': True}  # Campo real en el modelo
        }

    def create(self, validated_data):
        password = validated_data.pop('contraseña', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
