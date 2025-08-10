from rest_framework import serializers
from .models import Compromiso
from django.utils import timezone
from apps.actas.models import Acta

class CompromisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compromiso
        fields = ['id', 'descripcion', 'fecha_limite', 'estado', 'acta']
        extra_kwargs = {
            'acta': {'required': True},
            'estado': {'read_only': True} 
        }

    def validate(self, data):
        """Valida que la fecha límite sea futura"""
        if data['fecha_limite'] < timezone.now().date():
            raise serializers.ValidationError("La fecha límite debe ser futura")
        return data