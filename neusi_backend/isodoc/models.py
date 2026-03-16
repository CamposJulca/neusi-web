from django.db import models
from django.contrib.auth.models import User, Group


class Categoria(models.Model):
    ICONOS = [
        ('folder', 'Carpeta'),
        ('shield', 'Legal'),
        ('chart-bar', 'Administración'),
        ('code', 'Tecnología'),
        ('briefcase', 'Proyectos'),
        ('document-text', 'Procedimientos'),
        ('currency-dollar', 'Contabilidad'),
        ('office-building', 'Dirección'),
    ]
    nombre      = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    icono       = models.CharField(max_length=30, choices=ICONOS, default='folder')
    orden       = models.PositiveSmallIntegerField(default=0)
    activa      = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden', 'nombre']
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre


class Documento(models.Model):
    ESTADO_CHOICES = [
        ('activo',    'Activo'),
        ('revision',  'En Revisión'),
        ('borrador',  'Borrador'),
        ('obsoleto',  'Obsoleto'),
    ]

    nombre           = models.CharField(max_length=200)
    descripcion      = models.TextField(blank=True)
    categoria        = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='documentos')
    estado           = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')
    fecha_creacion   = models.DateTimeField(auto_now_add=True)
    usuario_creador  = models.ForeignKey(User, on_delete=models.PROTECT, related_name='documentos_creados')
    grupos_acceso    = models.ManyToManyField(Group, blank=True, verbose_name='Grupos con acceso',
                                             help_text='Vacío = todos los usuarios autenticados pueden ver')

    class Meta:
        ordering = ['categoria', 'nombre']
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'

    def __str__(self):
        return self.nombre

    @property
    def version_vigente(self):
        return self.versiones.filter(es_vigente=True).first()

    @property
    def total_versiones(self):
        return self.versiones.count()


def ruta_archivo(instance, filename):
    doc_id = instance.documento_id or 'temp'
    return f'isodoc/doc_{doc_id}/v{instance.version.replace(".", "_")}_{filename}'


class VersionDocumento(models.Model):
    documento    = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='versiones')
    version      = models.CharField(max_length=20)          # ej: "1.0", "2.1"
    archivo      = models.FileField(upload_to=ruta_archivo)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    usuario      = models.ForeignKey(User, on_delete=models.PROTECT, related_name='versiones_subidas')
    comentario   = models.TextField(blank=True)
    es_vigente   = models.BooleanField(default=False)

    class Meta:
        ordering = ['-fecha_subida']
        unique_together = [('documento', 'version')]
        verbose_name = 'Versión de Documento'
        verbose_name_plural = 'Versiones de Documentos'

    def __str__(self):
        return f'{self.documento.nombre} — v{self.version}'

    def save(self, *args, **kwargs):
        # Si se marca como vigente, desmarcar las demás versiones del mismo documento
        if self.es_vigente:
            VersionDocumento.objects.filter(
                documento=self.documento, es_vigente=True
            ).exclude(pk=self.pk).update(es_vigente=False)
        super().save(*args, **kwargs)


class HistorialAcceso(models.Model):
    version   = models.ForeignKey(VersionDocumento, on_delete=models.CASCADE, related_name='accesos')
    usuario   = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha     = models.DateTimeField(auto_now_add=True)
    accion    = models.CharField(max_length=20, choices=[
        ('visualizacion', 'Visualización'),
        ('descarga',      'Descarga'),
    ], default='visualizacion')

    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Historial de Acceso'
        verbose_name_plural = 'Historial de Accesos'

    def __str__(self):
        return f'{self.usuario} — {self.version} — {self.fecha:%d/%m/%Y %H:%M}'
