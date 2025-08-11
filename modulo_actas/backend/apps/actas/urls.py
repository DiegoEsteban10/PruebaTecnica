from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ActaViewSet

router = DefaultRouter()
router.register(r'actas', ActaViewSet, basename='actas')

urlpatterns = router.urls