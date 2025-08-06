from rest_framework import viewsets, permissions
from .models import Acta
from .serializers import ActaSerializer

# Create your views here.


class ActaViewSet(viewsets.ModelViewSet):
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol == 'ADMIN':
            return Acta.objects.all()
        return Acta.objects.filter(creador=usuario)

    def perform_create(self, serializer):
        serializer.save(creador=self.request.user)