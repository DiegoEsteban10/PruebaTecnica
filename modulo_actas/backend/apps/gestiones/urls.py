from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GestionViewSet

router = DefaultRouter()
router.register(r'gestiones', GestionViewSet)

urlpatterns = router.urls