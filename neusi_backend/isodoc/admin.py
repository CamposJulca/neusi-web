from django.contrib import admin
from .models import Categoria, Documento, VersionDocumento, HistorialAcceso


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display  = ('nombre', 'icono', 'orden', 'activa')
    list_editable = ('orden', 'activa')
    search_fields = ('nombre',)


class VersionDocumentoInline(admin.TabularInline):
    model      = VersionDocumento
    extra      = 0
    readonly_fields = ('fecha_subida', 'usuario')
    fields     = ('version', 'archivo', 'es_vigente', 'comentario', 'fecha_subida', 'usuario')


@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display   = ('nombre', 'categoria', 'estado', 'version_vigente', 'total_versiones', 'fecha_creacion')
    list_filter    = ('estado', 'categoria')
    search_fields  = ('nombre', 'descripcion')
    readonly_fields = ('fecha_creacion', 'usuario_creador')
    inlines        = [VersionDocumentoInline]
    filter_horizontal = ('grupos_acceso',)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.usuario_creador = request.user
        super().save_model(request, obj, form, change)


@admin.register(VersionDocumento)
class VersionDocumentoAdmin(admin.ModelAdmin):
    list_display  = ('documento', 'version', 'es_vigente', 'usuario', 'fecha_subida')
    list_filter   = ('es_vigente', 'documento__categoria')
    search_fields = ('documento__nombre', 'version', 'comentario')
    readonly_fields = ('fecha_subida',)


@admin.register(HistorialAcceso)
class HistorialAccesoAdmin(admin.ModelAdmin):
    list_display  = ('usuario', 'version', 'accion', 'fecha')
    list_filter   = ('accion',)
    readonly_fields = ('usuario', 'version', 'accion', 'fecha')

    def has_add_permission(self, request):
        return False
