from rest_framework import viewsets, permissions
from apps.actas.models import Acta
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from .serializers import ActaSerializer
from rest_framework.decorators import action
from apps.actas.serializers import ActaSerializer
from rest_framework.views import APIView
from django.http import Http404, FileResponse
from django.shortcuts import get_object_or_404
# Create your views here.


class ActaViewSet(viewsets.ModelViewSet):
    serializer_class = ActaSerializer
    queryset = Acta.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [JSONRenderer]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol == 'ADMIN':
            return Acta.objects.all()
        return Acta.objects.filter(creador=usuario)
    
    @action(detail=True, methods=['get'])
    def pdf(self,request, pk=None):
        acta =  self.get_object()
        response = FileResponse(open(acta.archivo_pdf.path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{acta.titulo}.pdf"'
        return response
                            
    def perform_create(self, serializer):
        serializer.save(creador=self.request.user)
        
class ActaFileview(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        acta = get_object_or_404(Acta, pk=pk)

        if not acta.archivo_pdf:
            raise Http404("El acta no tiene archivo PDF asociado.")

        try:
            return FileResponse(open(acta.archivo_pdf.path, 'rb'), content_type='application/pdf')
        except FileNotFoundError:
            raise Http404("El archivo PDF no existe en el servidor.")
