from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action

# Create your views here.

from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                email=serializer.validated_data['correo'],
                password=serializer.validated_data['password']
            )
            if not user:
            # Depuración adicional
                print(f"Usuario no autenticado: {serializer.validated_data['correo']}")
                return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

            token, _ = TokenAuthentication.objects.get_or_create(user=user)

            return Response({
                'status': 'Login exitoso',
                'user_id': user.id,
                'correo': user.correo,
                'rol': user.rol,
                'token': token.key
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['get'])
    def me (self, request):
        return Response({
            'id': request.user.id,
            'correo': request.user.correo,
            'rol': request.user.rol
        })
        
    def get_permissions(self):
        
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]  
        return [permissions.IsAuthenticated()]