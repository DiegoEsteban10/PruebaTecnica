from rest_framework import viewsets, permissions
from .models import Gestion
from .serializers import GestionSerializer
from django.core.exceptions import PermissionDenied

# Create your views here.

class GestionViewSet(viewsets.ModelViewSet):
    serializer_class = GestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Gestion.objects.filter(creador=self.request.user)

    def perform_create(self, serializer):
        acta = serializer.validated_data['acta']
        if self.request.user.rol == 'BASE' and acta.creador != self.request.user:
            raise PermissionDenied("Solo puedes crear gestiones en tus actas.")
        serializer.save(creador=self.request.user)