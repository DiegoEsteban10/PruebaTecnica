from rest_framework import viewsets, permissions
from apps.actas.models import Acta
from apps.compromisos.models import Compromiso
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .serializers import ActaSerializer
from rest_framework.decorators import action
from apps.actas.serializers import ActaSerializer
from apps.compromisos.serializers import CompromisoSerializer
from rest_framework.views import APIView
from django.http import Http404, FileResponse
# Create your views here.


class ActaViewSet(viewsets.ModelViewSet):
    serializer_class = ActaSerializer
    queryset = Acta.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol == 'ADMIN':
            return Acta.objects.all()
        return Acta.objects.filter(creador=usuario)
    
    @action(detail=False, methods=['get'])
    def pdf(sefl,request, pk=None):
        acta =  sefl.get_object()
        return FileResponse(open(acta.archivo_pdf.path, 'rb'))
                            
    def perform_create(self, serializer):
        serializer.save(creador=self.request.user)
        
class ActaFileview(APIView):
    permissions_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            Acta = Acta.objects.get(pk=pk)
            file_path = Acta.archivo_pdf.path
            return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
        except (Acta.DoesNotExist, FileNotFoundError):
            raise Http404
        
class CompromisoViewSet(viewsets.ModelViewSet):
    serializer_class = CompromisoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Compromiso.objects.filter(acta__creador=self.request.user)
    
    def perform_create(self, serializer):
        acta = serializer.validated_data['acta']
        if acta.creador != self.request.user:
            raise PermissionDenied("No tienes permiso para crear compromisos en esta acta.")
        serializer.save()   