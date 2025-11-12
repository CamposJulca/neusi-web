from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('servicios/', views.servicios, name='servicios'),
    path('propuesta/', views.propuesta, name='propuesta'),
    path('casos/', views.casos, name='casos'),
    path('contacto/', views.contacto, name='contacto'),

    path('contacto/enviar/', views.contacto_enviar, name='contacto_enviar'),
    path('gracias/', views.gracias, name='gracias'),
    path('nosotros/', views.nosotros, name='nosotros'),
    path('privacidad/', views.privacidad, name='privacidad'),
    path('terminos/', views.terminos, name='terminos'),
]
