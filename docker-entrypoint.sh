#!/bin/sh
# ──────────────────────────────────────────────────────────────────────────
# Entrypoint del contenedor web.
# Aplica migraciones sobre la BD MONTADA EN EL VOLUMEN (que debe sembrarse
# con el db.sqlite3 existente ANTES del primer `up` — ver README.docker.md).
# `migrate` es idempotente: solo aplica migraciones pendientes, NUNCA borra
# datos ni recrea la BD si ya está poblada.
# Luego ejecuta el CMD (Gunicorn).
# ──────────────────────────────────────────────────────────────────────────
set -e

echo "[entrypoint] Aplicando migraciones pendientes (migrate --noinput)..."
python manage.py migrate --noinput

echo "[entrypoint] Migraciones OK. Arrancando: $*"
exec "$@"
