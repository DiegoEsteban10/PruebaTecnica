from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ActaViewSet
from .views import CompromisoViewSet

router = DefaultRouter()
router.register(r'actas', ActaViewSet, basename='actas')
router.register(r'compromisos', CompromisoViewSet, basename='compromisos')

urlpatterns = router.urls