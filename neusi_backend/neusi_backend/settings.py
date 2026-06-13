from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def _csv_env(name, default):
    """Lee una variable de entorno separada por comas y la devuelve como lista."""
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


# ── Seguridad (12-Factor: configurable por entorno) ────────
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-ss1q0!$yc89k+^7wsht4c7sijq+rk^@jl*q@ec=f6aaxu-v65n')
DEBUG      = os.getenv('DJANGO_DEBUG', 'False') == 'True'

# Hosts y orígenes CSRF se leen de entorno (coma-separados). Los defaults cubren
# desarrollo local, el túnel ngrok actual y los dominios de producción tras Cloudflare.
ALLOWED_HOSTS = _csv_env(
    'DJANGO_ALLOWED_HOSTS',
    'localhost,127.0.0.1,192.168.0.101,neusi-web.ngrok.io,neusisolutions.com,www.neusisolutions.com',
)

CSRF_TRUSTED_ORIGINS = _csv_env(
    'DJANGO_CSRF_TRUSTED_ORIGINS',
    'https://neusi-web.ngrok.io,https://neusisolutions.com,https://www.neusisolutions.com',
)

# HTTPS es terminado por Cloudflare; Django debe reconocer el esquema reenviado
# para que CSRF, cookies seguras y redirecciones funcionen correctamente.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ── Apps ───────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'web',
    'isodoc',
]

# ── Middleware (WhiteNoise justo después de SecurityMiddleware) ──
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',        # ← sirve /static/ en producción
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'neusi_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'neusi_backend.wsgi.application'

# ── Base de datos ──────────────────────────────────────────
# SQLite. La ruta se lee de entorno (DJANGO_DB_PATH) para poder apuntarla a un
# volumen persistente en Docker (/data/db.sqlite3); por defecto usa BASE_DIR
# para mantener compatibilidad con el despliegue systemd actual.
#
# Migración futura a PostgreSQL (NO implementado): reemplazar este bloque por
# una configuración basada en POSTGRES_* / DATABASE_URL y añadir psycopg al
# requirements. Ver README.docker.md → "migración futura a PostgreSQL".
DJANGO_DB_PATH = os.getenv('DJANGO_DB_PATH', str(BASE_DIR / 'db.sqlite3'))
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DJANGO_DB_PATH,
    }
}

# ── Internacionalización ───────────────────────────────────
LANGUAGE_CODE = 'es-co'
TIME_ZONE     = 'America/Bogota'
USE_I18N      = True
USE_TZ        = True

# ── Archivos estáticos ─────────────────────────────────────
STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'          # destino de collectstatic
STATICFILES_DIRS = [BASE_DIR / 'static']        # fuente en desarrollo

# WhiteNoise: compresión + cache en producción
STORAGES = {
    "staticfiles": {
        # CompressedStaticFilesStorage: comprime con gzip/brotli
        # pero NO renombra los archivos → compatible con React build (Vite ya pone sus propios hashes)
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Media (documentos ISODOC) ──────────────────────────────
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL  = '/media/'   # sólo accesible vía vista autenticada

# ── Autenticación ──────────────────────────────────────────
LOGIN_URL          = '/intranet/login/'
LOGIN_REDIRECT_URL = '/intranet/'
LOGOUT_REDIRECT_URL = '/'

# ── Email (Office365 / SMTP) ───────────────────────────────
EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST          = 'smtp.office365.com'
EMAIL_PORT          = 587
EMAIL_USE_TLS       = True
EMAIL_HOST_USER     = os.getenv('SMTP_USER')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_PASS')
DEFAULT_FROM_EMAIL  = EMAIL_HOST_USER
EMAIL_TIMEOUT       = 20
