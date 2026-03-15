import json
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect, render
from django.core.mail import EmailMessage


# ── SPA React ─────────────────────────────────────────────
def index(request):
    """
    Sirve el build de React si existe.
    Fallback: template Django clásico.
    """
    react_index = Path(settings.BASE_DIR) / 'static' / 'react' / 'index.html'
    if react_index.exists():
        return HttpResponse(react_index.read_text(encoding='utf-8'), content_type='text/html; charset=utf-8')
    return render(request, 'web/index.html')


# ── Páginas Django (fallback si se accede directo) ────────
def servicios(request):  return render(request, 'web/servicios.html')
def propuesta(request):  return render(request, 'web/propuesta.html')
def casos(request):      return render(request, 'web/casos.html')
def nosotros(request):   return render(request, 'web/nosotros.html')
def contacto(request):   return render(request, 'web/contacto.html')
def gracias(request):    return render(request, 'web/gracias.html')
def privacidad(request): return render(request, 'web/privacidad.html')
def terminos(request):   return render(request, 'web/terminos.html')


# ── Contacto (acepta form-data Y JSON) ────────────────────
def contacto_enviar(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Método no permitido')

    is_json = request.content_type and 'application/json' in request.content_type

    if is_json:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'ok': False, 'error': 'JSON inválido'}, status=400)
        name       = data.get('name', '').strip()
        email      = data.get('email', '').strip()
        message    = data.get('message', '').strip()
        source_url = data.get('source_url', '')
    else:
        name       = request.POST.get('name', '').strip()
        email      = request.POST.get('email', '').strip()
        message    = request.POST.get('message', '').strip()
        source_url = request.POST.get('source_url', '')

    if not (name and email and message):
        if is_json or request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': False, 'error': 'Faltan campos'}, status=400)
        return redirect('contacto')

    subject = 'Nuevo contacto desde NEUSI Web'
    body    = f'Nombre: {name}\nEmail: {email}\nURL origen: {source_url}\n\nMensaje:\n{message}'
    email_msg = EmailMessage(subject, body, to=['auxiliar.visualizacion@neusisolutions.com'], reply_to=[email])

    try:
        email_msg.send(fail_silently=False)
        if is_json or request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': True})
        return redirect('gracias')
    except Exception as e:
        if is_json or request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': False, 'error': str(e)}, status=500)
        return redirect('contacto')
