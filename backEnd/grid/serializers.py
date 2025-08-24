from rest_framework import serializers
from .models import TransformationCenter, Sectionalizer
from django.contrib.contenttypes.models import ContentType

# Serializer simple para listar/crear/editar usando IDs
class SectionalizerSerializer(serializers.ModelSerializer):
    source_content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False, allow_null=True)
    destination_content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Sectionalizer
        fields = '__all__'

class TransformationCenterSerializer(serializers.ModelSerializer):
    connected_centers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=TransformationCenter.objects.all(),
        required=False
    )
    connected_sectionalizers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Sectionalizer.objects.all(),
        required=False
    )

    class Meta:
        model = TransformationCenter
        fields = '__all__'

# Serializers de detalle para mostrar relaciones completas
class SectionalizerDetailSerializer(serializers.ModelSerializer):
    source_content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False, allow_null=True)
    destination_content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Sectionalizer
        fields = '__all__'

class TransformationCenterDetailSerializer(serializers.ModelSerializer):
    connected_centers = TransformationCenterSerializer(many=True, read_only=True)
    connected_sectionalizers = SectionalizerSerializer(many=True, read_only=True)

    class Meta:
        model = TransformationCenter
        fields = '__all__'
