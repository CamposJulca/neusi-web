# ──────────────────────────────────────────────────────────────────────────
# NEUSI Web — Imagen multietapa (monolito Django + build de React)
#   Stage 1 (frontend): compila el SPA de React con Vite.
#   Stage 2 (final):     Django + Gunicorn, con el build de React ya integrado.
# La imagen final NO contiene Node ni node_modules.
# ──────────────────────────────────────────────────────────────────────────

# Imagen de Node parametrizable: por defecto alpine (liviana). Si el build de
# React falla por dependencias nativas con musl (esbuild / three.js), reconstruir
# con:  docker compose build --build-arg NODE_IMAGE=node:22-slim
ARG NODE_IMAGE=node:22-alpine

# ── Stage 1: build del frontend ───────────────────────────────────────────
FROM ${NODE_IMAGE} AS frontend
WORKDIR /app/frontend

# Instala dependencias con lockfile reproducible
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copia el código del frontend y compila.
# vite.config.ts tiene outDir '../neusi_backend/static/react', por eso replicamos
# el layout: el build queda en /app/neusi_backend/static/react.
COPY frontend/ ./
RUN npm run build

# ── Stage 2: imagen final Django + Gunicorn ───────────────────────────────
FROM python:3.12-slim AS final

# Buenas prácticas de runtime Python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_SETTINGS_MODULE=neusi_backend.settings

WORKDIR /app

# Dependencias de Python primero (capa cacheable)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Código del backend Django
COPY neusi_backend/ ./neusi_backend/

# Build de React desde el stage 1 → árbol estático de Django
COPY --from=frontend /app/neusi_backend/static/react ./neusi_backend/static/react

# Entrypoint (corre migrate y luego exec del CMD)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# A partir de aquí trabajamos dentro del proyecto Django (donde está manage.py)
WORKDIR /app/neusi_backend

# collectstatic en BUILD TIME (no necesita BD). Reúne admin + static/react en
# STATIC_ROOT (staticfiles/), que WhiteNoise servirá en producción.
RUN python manage.py collectstatic --noinput

EXPOSE 8070

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["gunicorn", "neusi_backend.wsgi:application", \
     "--bind", "0.0.0.0:8070", \
     "--workers", "3", \
     "--timeout", "60", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
