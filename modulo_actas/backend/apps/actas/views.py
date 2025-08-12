from django.conf import settings
from rest_framework import viewsets, permissions
from apps.actas.models import Acta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from .serializers import ActaSerializer
from rest_framework.decorators import action
from django.http import Http404, FileResponse
import os


class ProtectedMediaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, path):
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        if not os.path.exists(file_path):
            raise Http404("Archivo no encontrado.")
        return FileResponse(open(file_path, 'rb'))
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

    @action(detail=True, methods=['get'], url_path='pdf')
    def pdf(self, request, pk=None):
        """Devuelve el PDF asociado a un acta."""
        acta = self.get_object()

        if not acta.archivo_pdf:
            raise Http404("El acta no tiene archivo PDF asociado.")

        try:
            response = FileResponse(
                open(acta.archivo_pdf.path, 'rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'inline; filename="{acta.titulo}.pdf"'
            return response
        except FileNotFoundError:
            raise Http404("El archivo PDF no existe en el servidor.")

    def perform_create(self, serializer):
        serializer.save(creador=self.request.user)
