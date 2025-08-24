from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import TransformationCenter, Sectionalizer
from .serializers import (
    TransformationCenterSerializer,
    TransformationCenterDetailSerializer,
    SectionalizerSerializer,
    SectionalizerDetailSerializer
)
from django.contrib.contenttypes.models import ContentType

# Endpoint para obtener los IDs de ContentType
@api_view(['GET'])
def contenttype_ids(request):
    tc_ct = ContentType.objects.get(app_label='grid', model='transformationcenter')
    sec_ct = ContentType.objects.get(app_label='grid', model='sectionalizer')
    return Response({
        'transformationcenter': tc_ct.id,
        'sectionalizer': sec_ct.id
    })

class TransformationCenterViewSet(viewsets.ModelViewSet):
    queryset = TransformationCenter.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TransformationCenterDetailSerializer
        return TransformationCenterSerializer

    @action(detail=True, methods=['get'])
    def sectionalizers(self, request, pk=None):
        tc = self.get_object()
        sectionalizers = Sectionalizer.objects.filter(destination=tc)
        serializer = SectionalizerSerializer(sectionalizers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connected_centers(self, request, pk=None):
        tc = self.get_object()
        serializer = TransformationCenterSerializer(tc.connected_centers.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connected_sectionalizers(self, request, pk=None):
        tc = self.get_object()
        serializer = SectionalizerSerializer(tc.connected_sectionalizers.all(), many=True)
        return Response(serializer.data)

class SectionalizerViewSet(viewsets.ModelViewSet):
    queryset = Sectionalizer.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SectionalizerDetailSerializer
        return SectionalizerSerializer

    @action(detail=True, methods=['get'])
    def outputs(self, request, pk=None):
        s = self.get_object()
        serializer = SectionalizerSerializer(s.salidas.all(), many=True)
        return Response(serializer.data)
