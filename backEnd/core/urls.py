from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from grid.views import TransformationCenterViewSet, SectionalizerViewSet

router = DefaultRouter()
router.register(r'transformation-centers', TransformationCenterViewSet)
router.register(r'sectionalizers', SectionalizerViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # todas las rutas de la API
]
