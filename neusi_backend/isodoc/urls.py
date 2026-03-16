from django.urls import path
from . import views

app_name = 'isodoc'

urlpatterns = [
    # Auth
    path('login/',  views.vista_login,  name='login'),
    path('logout/', views.vista_logout, name='logout'),

    # Portal de aplicaciones
    path('', views.portal, name='portal'),

    # ISODOC — dashboard del módulo
    path('isodoc/',             views.dashboard,        name='dashboard'),

    # Documentos
    path('isodoc/documentos/',                           views.lista_documentos,   name='lista_documentos'),
    path('isodoc/documentos/nuevo/',                     views.crear_documento,    name='crear_documento'),
    path('isodoc/documentos/<int:pk>/',                  views.detalle_documento,  name='documento_detalle'),
    path('isodoc/documentos/<int:pk>/editar/',           views.editar_documento,   name='editar_documento'),
    path('isodoc/documentos/<int:pk>/eliminar/',         views.eliminar_documento, name='eliminar_documento'),

    # Versiones
    path('isodoc/documentos/<int:doc_pk>/version/subir/', views.subir_version,    name='subir_version'),
    path('isodoc/versiones/<int:pk>/eliminar/',           views.eliminar_version, name='eliminar_version'),

    # Visor PDF
    path('isodoc/ver/<int:version_pk>/', views.visor_documento, name='visor'),
    path('isodoc/pdf/<int:version_pk>/', views.ver_pdf,         name='pdf'),

    # Historial
    path('isodoc/historial/', views.historial, name='historial'),
]
