from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Compromiso
from .serializers import CompromisoSerializer
from apps.actas.models import Acta
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class CompromisoViewSet(viewsets.ModelViewSet):
    queryset = Compromiso.objects.all()
    serializer_class = CompromisoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtra compromisos: admin ve todo, usuario BASE solo los suyos"""
        user = self.request.user
        if user.rol == 'ADMIN':
            return Compromiso.objects.all()
        return Compromiso.objects.filter(acta__creador=user)

    def perform_create(self, serializer):
        """Valida que el usuario pueda añadir compromisos al acta"""
        acta = serializer.validated_data['acta']
        if self.request.user.rol == 'BASE' and acta.creador != self.request.user:
            raise PermissionDenied("No puedes añadir compromisos a actas ajenas")
        serializer.save()

    @action(detail=True, methods=['patch'])
    def marcar_completado(self, request, pk=None):
        """Endpoint personalizado para cambiar estado"""
        compromiso = self.get_object()
        compromiso.estado = 'COMPLETADO'
        compromiso.save()
        return Response({'status': 'Compromiso completado'})

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Compromisos pendientes del usuario logueado"""
        queryset = self.get_queryset().filter(estado='PENDIENTE')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)