from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Seguridad ──────────────────────────────────────────────
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-ss1q0!$yc89k+^7wsht4c7sijq+rk^@jl*q@ec=f6aaxu-v65n')
DEBUG      = os.getenv('DJANGO_DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "192.168.0.101",
    "neusi-web.ngrok.io",
]

CSRF_TRUSTED_ORIGINS = [
    "https://neusi-web.ngrok.io",
]

# ── Apps ───────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'web',
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
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
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

# ── Email (Office365 / SMTP) ───────────────────────────────
EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST          = 'smtp.office365.com'
EMAIL_PORT          = 587
EMAIL_USE_TLS       = True
EMAIL_HOST_USER     = os.getenv('SMTP_USER')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_PASS')
DEFAULT_FROM_EMAIL  = EMAIL_HOST_USER
EMAIL_TIMEOUT       = 20
