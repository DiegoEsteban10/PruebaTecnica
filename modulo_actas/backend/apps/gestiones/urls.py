from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GestionViewSet

router = DefaultRouter()
router.register(r'', GestionViewSet, basename='gestiones')

urlpatterns = router.urls