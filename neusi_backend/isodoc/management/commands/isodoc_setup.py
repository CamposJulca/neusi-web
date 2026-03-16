"""
python manage.py isodoc_setup

Crea:
  - Los 3 grupos de ISODOC (Administrador, Editor, Lector)
  - Las 8 categorías documentales iniciales
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from isodoc.models import Categoria
from isodoc.permissions import GRUPO_ADMIN, GRUPO_EDITOR, GRUPO_LECTOR


CATEGORIAS = [
    ('Dirección',       'office-building', 0),
    ('Administración',  'chart-bar',       1),
    ('Legal',           'shield',          2),
    ('Contabilidad',    'currency-dollar', 3),
    ('Tecnología',      'code',            4),
    ('Proyectos',       'briefcase',       5),
    ('Procedimientos',  'document-text',   6),
    ('Contratos',       'folder',          7),
]


class Command(BaseCommand):
    help = 'Inicializa grupos y categorías de ISODOC'

    def handle(self, *args, **options):
        # Grupos
        for nombre in [GRUPO_ADMIN, GRUPO_EDITOR, GRUPO_LECTOR]:
            grupo, creado = Group.objects.get_or_create(name=nombre)
            if creado:
                self.stdout.write(self.style.SUCCESS(f'  Grupo creado: {nombre}'))
            else:
                self.stdout.write(f'  Grupo ya existe: {nombre}')

        # Categorías
        for nombre, icono, orden in CATEGORIAS:
            cat, creada = Categoria.objects.get_or_create(
                nombre=nombre,
                defaults={'icono': icono, 'orden': orden}
            )
            if creada:
                self.stdout.write(self.style.SUCCESS(f'  Categoría creada: {nombre}'))
            else:
                self.stdout.write(f'  Categoría ya existe: {nombre}')

        self.stdout.write(self.style.SUCCESS('\nISSDOC configurado correctamente.'))
        self.stdout.write(
            'Ahora asigna usuarios a los grupos desde el panel de administración:\n'
            '  /admin/auth/group/'
        )
