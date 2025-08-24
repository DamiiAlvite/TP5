from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class TransformationCenter(models.Model):
    TYPE_CHOICES = [
        ('NIVEL', 'A nivel'),
        ('SUBT', 'Subterránea'),
        ('POZO', 'Pozo'),
        ('PLAT', 'Plataforma'),
    ]
    def save(self, *args, **kwargs):
        if self.prefix == "PT":
            self.type = "PLAT"
        super().save(*args, **kwargs)

    cod = models.CharField(max_length=7, unique=True)
    PREFIX_CHOICES = [
        ("CT", "CT"),
        ("PT", "PT"),
    ]
    prefix = models.CharField(max_length=2, choices=PREFIX_CHOICES, default="CT")
    name = models.CharField(max_length=100, blank=True, null=True)
    rem_ctrl = models.BooleanField(default=False)
    type = models.CharField(max_length=5, choices=TYPE_CHOICES)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    connected_centers = models.ManyToManyField(
        'self', 
        blank=True, 
        symmetrical=False,
        related_name='source_centers',
        verbose_name='Centros de transformación conectados'
    )
    connected_sectionalizers = models.ManyToManyField(
        'Sectionalizer',
        blank=True,
        related_name='connected_to_centers',
        verbose_name='Sectionalizers conectados'
    )

    def __str__(self):
        return f"{self.prefix} {self.cod} ({self.name or ''})"


class Sectionalizer(models.Model):
    PREFIX_CHOICES = [
        ('FV', 'FV'),
        ('FVC', 'FVC'),
        ('B', 'B'),
        ('BC', 'BC'),
        ('Q', 'Q'),
        ('QC', 'QC'),
        ('A', 'A'),
        ('AC', 'AC'),
        ('AV', 'AV'),
        ('AVC', 'AVC'),
    ]

    prefix = models.CharField(max_length=4, choices=PREFIX_CHOICES)
    num = models.PositiveIntegerField()
    location = models.CharField(max_length=255, blank=True, null=True)
    source_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    source_object_id = models.PositiveIntegerField(null=True, blank=True)
    source = GenericForeignKey('source_content_type', 'source_object_id')

    destination_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    destination_object_id = models.PositiveIntegerField(null=True, blank=True)
    destination = GenericForeignKey('destination_content_type', 'destination_object_id')

    def __str__(self):
        return f"{self.prefix} {self.num}"
