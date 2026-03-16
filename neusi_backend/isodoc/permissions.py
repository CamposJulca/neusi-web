"""
Helpers de permisos para ISODOC.

Roles (Django Groups):
  ISODOC Administrador  → CRUD completo
  ISODOC Editor         → subir versiones, crear documentos
  ISODOC Lector         → solo visualizar
"""
from functools import wraps
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import Group


GRUPO_ADMIN  = 'ISODOC Administrador'
GRUPO_EDITOR = 'ISODOC Editor'
GRUPO_LECTOR = 'ISODOC Lector'

GRUPOS_ISODOC = [GRUPO_ADMIN, GRUPO_EDITOR, GRUPO_LECTOR]


def en_grupo(*grupos):
    """Devuelve True si el usuario pertenece a alguno de los grupos dados."""
    def check(user):
        return user.is_superuser or user.groups.filter(name__in=grupos).exists()
    return check


def puede_editar(user):
    return user.is_superuser or user.groups.filter(name__in=[GRUPO_ADMIN, GRUPO_EDITOR]).exists()


def puede_administrar(user):
    return user.is_superuser or user.groups.filter(name=GRUPO_ADMIN).exists()


def puede_ver_documento(user, documento):
    """
    Lógica de acceso al documento:
    - Si documento.grupos_acceso está vacío → todos los autenticados pueden ver.
    - Si tiene grupos → el usuario debe pertenecer a uno de ellos (o ser superuser/admin).
    """
    if user.is_superuser or puede_administrar(user):
        return True
    grupos_doc = documento.grupos_acceso.all()
    if not grupos_doc.exists():
        return True
    return user.groups.filter(pk__in=grupos_doc).exists()


def isodoc_required(view_func):
    """Require login + pertenencia a algún grupo ISODOC (o superuser)."""
    @wraps(view_func)
    @login_required
    def _wrapped(request, *args, **kwargs):
        user = request.user
        if user.is_superuser or user.groups.filter(name__in=GRUPOS_ISODOC).exists():
            return view_func(request, *args, **kwargs)
        raise PermissionDenied
    return _wrapped


def editor_required(view_func):
    @wraps(view_func)
    @login_required
    def _wrapped(request, *args, **kwargs):
        if puede_editar(request.user):
            return view_func(request, *args, **kwargs)
        raise PermissionDenied
    return _wrapped


def admin_required(view_func):
    @wraps(view_func)
    @login_required
    def _wrapped(request, *args, **kwargs):
        if puede_administrar(request.user):
            return view_func(request, *args, **kwargs)
        raise PermissionDenied
    return _wrapped
