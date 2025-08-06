from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CompromisoViewSet

router = DefaultRouter()
router.register(r'compromisos', CompromisoViewSet)

urlpatterns = router.urls