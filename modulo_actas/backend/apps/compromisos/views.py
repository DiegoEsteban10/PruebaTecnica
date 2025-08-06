from rest_framework import viewsets
from .models import Compromiso
from .serializers import CompromisoSerializer

# Create your views here.

class CompromisoViewSet(viewsets.ModelViewSet):
    queryset = Compromiso.objects.all()
    serializer_class = CompromisoSerializer