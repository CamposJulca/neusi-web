from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.core.mail import EmailMessage
from django.conf import settings

def index(request):
    return render(request, 'web/index.html')

def servicios(request):
    return render(request, 'web/servicios.html')

def propuesta(request):
    return render(request, 'web/propuesta.html')


def casos(request):
    return render(request, 'web/casos.html')

def nosotros(request):
    return render(request, 'web/nosotros.html')

def contacto(request):
    return render(request, 'web/contacto.html')

def gracias(request):
    return render(request, 'web/gracias.html')

def privacidad(request):
    return render(request, 'web/privacidad.html')

def terminos(request):
    return render(request, 'web/terminos.html')

from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect
from django.core.mail import EmailMessage

def contacto_enviar(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Método no permitido')

    name = request.POST.get('name', '').strip()
    email = request.POST.get('email', '').strip()
    message = request.POST.get('message', '').strip()
    source_url = request.POST.get('source_url', '')

    if not (name and email and message):
        if request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': False, 'error': 'Faltan campos'}, status=400)
        return redirect('contacto')

    subject = 'Nuevo contacto desde NEUSI Web'
    body = (
        f'Nombre: {name}\n'
        f'Email: {email}\n'
        f'URL origen: {source_url}\n\n'
        f'Mensaje:\n{message}'
    )

    to = ['auxiliar.visualizacion@neusisolutions.com']
    email_msg = EmailMessage(subject, body, to=to, reply_to=[email])

    try:
        email_msg.send(fail_silently=False)
        if request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': True})
        return redirect('gracias')
    except Exception as e:
        if request.headers.get('Accept') == 'application/json':
            return JsonResponse({'ok': False, 'error': str(e)}, status=500)
        return redirect('contacto')
