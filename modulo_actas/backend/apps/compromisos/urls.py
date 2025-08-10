from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompromisoViewSet

router = DefaultRouter()
router.register(r'compromisos', CompromisoViewSet, basename='compromisos')

urlpatterns = [
    path('', include(router.urls)),
]