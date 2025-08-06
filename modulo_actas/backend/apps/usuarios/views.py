from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer

# Create your views here.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer