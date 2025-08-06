from rest_framework import serializers
from .models import Usuario

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
class UsuarioSerializer(serializers.ModelSerializer):
    # Campo "virtual" para la API (opcional, si quieres mostrar "contraseña" en el frontend)
    contraseña = serializers.CharField(
        write_only=True,  # No se muestra en las respuestas
        style={'input_type': 'password'}  # Para que el frontend lo muestre como campo de contraseña
    )

    class Meta:
        model = Usuario
        fields = ['id', 'correo', 'contraseña', 'rol']  # Incluye todos los campos necesarios
        extra_kwargs = {
            'password': {'write_only': True}  # Campo real en el modelo
        }

    def create(self, validated_data):
        # Extrae la contraseña del campo "virtual" y asígnala al campo real "password"
        password = validated_data.pop('contraseña', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)  # Hashea la contraseña
            user.save()
        return user
    
