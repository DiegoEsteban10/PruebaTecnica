from rest_framework import serializers
from .models import Compromiso

class CompromisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compromiso
        fields = '__all__'