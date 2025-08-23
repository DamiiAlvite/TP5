from django.db import models

class TransformationCenter(models.Model):
    TYPE_CHOICES = [
        ('NIVEL', 'A nivel'),
        ('SUBT', 'Subterránea'),
        ('POZO', 'Pozo'),
    ]

    cod = models.CharField(max_length=7, unique=True)
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
        return f"CT {self.cod} ({self.name or ''})"


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
    source = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="salidas")
    destination = models.ForeignKey(TransformationCenter, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.prefix} {self.num}"
