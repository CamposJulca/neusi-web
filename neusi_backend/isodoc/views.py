import mimetypes
from pathlib import Path

from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator
from django.http import FileResponse, Http404, HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .forms import DocumentoForm, SubirVersionForm
from .models import Categoria, Documento, HistorialAcceso, VersionDocumento
from .permissions import (
    admin_required, editor_required, isodoc_required,
    puede_administrar, puede_editar, puede_ver_documento,
)


# ── Autenticación ────────────────────────────────────────────────────────────

def vista_login(request):
    if request.user.is_authenticated:
        return redirect('isodoc:dashboard')
    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST' and form.is_valid():
        login(request, form.get_user())
        return redirect(request.GET.get('next', 'isodoc:dashboard'))
    return render(request, 'isodoc/login.html', {'form': form})


def vista_logout(request):
    logout(request)
    return redirect('/')


# ── Portal de aplicaciones ───────────────────────────────────────────────────

@isodoc_required
def portal(request):
    """Lanzador principal de la intranet NEUSI."""
    APPS = [
        {
            'nombre':      'ISODOC',
            'descripcion': 'Gestión documental corporativa — control de versiones, categorías y visor PDF seguro.',
            'url':         'isodoc:dashboard',
            'icono':       'document',
            'color':       'cyan',
            'estado':      'activo',
        },
        # Próximas apps — placeholder
        {
            'nombre':      'Proyectos',
            'descripcion': 'Seguimiento y gestión de proyectos internos.',
            'url':         None,
            'icono':       'briefcase',
            'color':       'purple',
            'estado':      'proximamente',
        },
        {
            'nombre':      'Dashboard BI',
            'descripcion': 'Indicadores y métricas operacionales en tiempo real.',
            'url':         None,
            'icono':       'chart',
            'color':       'amber',
            'estado':      'proximamente',
        },
        {
            'nombre':      'Talento Humano',
            'descripcion': 'Gestión de personal, nómina y evaluaciones.',
            'url':         None,
            'icono':       'users',
            'color':       'emerald',
            'estado':      'proximamente',
        },
    ]
    return render(request, 'isodoc/portal.html', {
        'apps':         APPS,
        'puede_admin':  puede_administrar(request.user),
    })


# ── Dashboard ────────────────────────────────────────────────────────────────

@isodoc_required
def dashboard(request):
    categorias  = Categoria.objects.filter(activa=True).prefetch_related('documentos')
    total_docs  = Documento.objects.count()
    total_vers  = VersionDocumento.objects.count()
    recientes   = VersionDocumento.objects.select_related('documento', 'usuario').order_by('-fecha_subida')[:8]
    ctx = {
        'categorias':  categorias,
        'total_docs':  total_docs,
        'total_vers':  total_vers,
        'recientes':   recientes,
        'puede_editar': puede_editar(request.user),
        'puede_admin':  puede_administrar(request.user),
    }
    return render(request, 'isodoc/dashboard.html', ctx)


# ── Documentos ───────────────────────────────────────────────────────────────

@isodoc_required
def lista_documentos(request):
    qs = Documento.objects.select_related('categoria', 'usuario_creador').prefetch_related('versiones')

    # Filtros
    categoria_id = request.GET.get('categoria')
    estado       = request.GET.get('estado')
    busqueda     = request.GET.get('q', '').strip()

    if categoria_id:
        qs = qs.filter(categoria_id=categoria_id)
    if estado:
        qs = qs.filter(estado=estado)
    if busqueda:
        qs = qs.filter(nombre__icontains=busqueda) | qs.filter(descripcion__icontains=busqueda)

    paginator = Paginator(qs, 20)
    page      = paginator.get_page(request.GET.get('page'))

    ctx = {
        'page_obj':     page,
        'categorias':   Categoria.objects.filter(activa=True),
        'estados':      Documento.ESTADO_CHOICES,
        'busqueda':     busqueda,
        'cat_sel':      categoria_id,
        'estado_sel':   estado,
        'puede_editar': puede_editar(request.user),
    }
    return render(request, 'isodoc/documento_lista.html', ctx)


@editor_required
def crear_documento(request):
    form = DocumentoForm(request.POST or None)
    version_form = SubirVersionForm(request.POST or None, request.FILES or None)

    if request.method == 'POST' and form.is_valid() and version_form.is_valid():
        doc = form.save(commit=False)
        doc.usuario_creador = request.user
        doc.save()
        form.save_m2m()

        version = version_form.save(commit=False)
        version.documento = doc
        version.usuario   = request.user
        version.es_vigente = True
        version.save()

        messages.success(request, f'Documento "{doc.nombre}" creado correctamente.')
        return redirect('isodoc:documento_detalle', pk=doc.pk)

    return render(request, 'isodoc/documento_form.html', {
        'form':         form,
        'version_form': version_form,
        'titulo':       'Nuevo Documento',
    })


@isodoc_required
def detalle_documento(request, pk):
    doc = get_object_or_404(Documento.objects.select_related('categoria', 'usuario_creador'), pk=pk)

    if not puede_ver_documento(request.user, doc):
        raise PermissionDenied

    versiones = doc.versiones.select_related('usuario').order_by('-fecha_subida')
    ctx = {
        'doc':          doc,
        'versiones':    versiones,
        'version_vigente': doc.version_vigente,
        'puede_editar': puede_editar(request.user),
        'puede_admin':  puede_administrar(request.user),
    }
    return render(request, 'isodoc/documento_detalle.html', ctx)


@editor_required
def editar_documento(request, pk):
    doc  = get_object_or_404(Documento, pk=pk)
    form = DocumentoForm(request.POST or None, instance=doc)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Documento actualizado.')
        return redirect('isodoc:documento_detalle', pk=doc.pk)
    return render(request, 'isodoc/documento_form.html', {
        'form':   form,
        'doc':    doc,
        'titulo': f'Editar — {doc.nombre}',
    })


@admin_required
@require_POST
def eliminar_documento(request, pk):
    doc = get_object_or_404(Documento, pk=pk)
    nombre = doc.nombre
    doc.delete()
    messages.success(request, f'Documento "{nombre}" eliminado.')
    return redirect('isodoc:lista_documentos')


# ── Versiones ────────────────────────────────────────────────────────────────

@editor_required
def subir_version(request, doc_pk):
    doc  = get_object_or_404(Documento, pk=doc_pk)
    form = SubirVersionForm(request.POST or None, request.FILES or None)

    if request.method == 'POST' and form.is_valid():
        version           = form.save(commit=False)
        version.documento = doc
        version.usuario   = request.user
        version.save()
        messages.success(request, f'Versión {version.version} subida correctamente.')
        return redirect('isodoc:documento_detalle', pk=doc.pk)

    return render(request, 'isodoc/version_form.html', {
        'form': form,
        'doc':  doc,
    })


@admin_required
@require_POST
def eliminar_version(request, pk):
    version = get_object_or_404(VersionDocumento, pk=pk)
    doc_pk  = version.documento_id
    if version.es_vigente:
        messages.error(request, 'No se puede eliminar la versión vigente.')
    else:
        version.archivo.delete(save=False)
        version.delete()
        messages.success(request, 'Versión eliminada.')
    return redirect('isodoc:documento_detalle', pk=doc_pk)


# ── Visor seguro de PDF ──────────────────────────────────────────────────────

@isodoc_required
def ver_pdf(request, version_pk):
    version = get_object_or_404(
        VersionDocumento.objects.select_related('documento'),
        pk=version_pk
    )

    if not puede_ver_documento(request.user, version.documento):
        return HttpResponseForbidden('No tienes acceso a este documento.')

    archivo_path = Path(version.archivo.path)
    if not archivo_path.exists():
        raise Http404('Archivo no encontrado.')

    # Registrar acceso
    HistorialAcceso.objects.create(
        version=version,
        usuario=request.user,
        accion='visualizacion',
    )

    response = FileResponse(
        open(archivo_path, 'rb'),
        content_type='application/pdf',
    )
    # Inline: el navegador muestra el PDF en lugar de descargarlo
    response['Content-Disposition'] = f'inline; filename="{archivo_path.name}"'
    # Evitar que el navegador almacene el PDF en caché
    response['X-Frame-Options'] = 'SAMEORIGIN'
    response['Cache-Control']   = 'no-store'
    return response


@isodoc_required
def visor_documento(request, version_pk):
    """Página con el visor embebido (PDF.js)."""
    version = get_object_or_404(
        VersionDocumento.objects.select_related('documento__categoria'),
        pk=version_pk
    )
    if not puede_ver_documento(request.user, version.documento):
        raise PermissionDenied

    return render(request, 'isodoc/visor.html', {
        'version': version,
        'doc':     version.documento,
    })


# ── Historial ────────────────────────────────────────────────────────────────

@isodoc_required
def historial(request):
    qs = HistorialAcceso.objects.select_related('version__documento', 'usuario').order_by('-fecha')

    doc_id  = request.GET.get('doc')
    usuario = request.GET.get('usuario')
    if doc_id:
        qs = qs.filter(version__documento_id=doc_id)
    if usuario:
        qs = qs.filter(usuario__username__icontains=usuario)

    paginator = Paginator(qs, 30)
    page = paginator.get_page(request.GET.get('page'))

    return render(request, 'isodoc/historial.html', {
        'page_obj':  page,
        'puede_admin': puede_administrar(request.user),
    })
