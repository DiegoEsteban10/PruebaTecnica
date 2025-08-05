from rest_framework import serializers
from actas.models import actas, compromisos, gestiones, usuarios

class usuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = usuarios
        fields = ['id', 'correo', 'rol']
        
class compromisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = compromisos
        fields = '__all__'
        
        
class gestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = gestiones
        fields = '__all__'
        extra_kwargs = {'creador': {'read_only': True}, 'archivo_adjunto': {'required': True}}
        

class ActaSerializer(serializers.ModelSerializer):
    compromisos = compromisoSerializer(many=True, read_only=True)
    gestiones = gestionSerializer(many=True, read_only=True)
    creador = usuarioSerializer(read_only=True)
    class Meta:
        model = actas
        fields = '__all__'