# Despliegue — NEUSI Web (Docker + Cloudflare Tunnel)

Despliegue reproducible del monolito Django + React con un túnel de Cloudflare
como sidecar. Reemplaza al flujo manual (`npm run build` → `collectstatic` →
`systemctl restart`) y a ngrok.

---

## ⚠️ Paso 0 — Backup de la base de datos (OBLIGATORIO)

`neusi_backend/db.sqlite3` contiene **datos reales de la intranet isodoc**. Antes de
cualquier `docker compose up`, haz una copia de seguridad:

```bash
cp neusi_backend/db.sqlite3 db.sqlite3.bak
```

> El `.bak` está en `.gitignore`, no se sube al repo.

---

## 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa: `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`,
`DJANGO_CSRF_TRUSTED_ORIGINS`, `SMTP_USER`, `SMTP_PASS` y el `TUNNEL_TOKEN`
(ver paso 4).

---

## 2. Sembrar la BD existente en el volumen (antes del primer arranque)

El servicio `web` usa la BD desde el volumen persistente `neusi_db` (montado en
`/data`). En el **primer despliegue** hay que copiar el `db.sqlite3` actual dentro
de ese volumen para **no arrancar con una BD vacía**:

```bash
# Crea el volumen y copia la BD real dentro de él
docker volume create neusi_db
docker run --rm \
  -v neusi_db:/data \
  -v "$(pwd)/neusi_backend:/backup:ro" \
  alpine cp /backup/db.sqlite3 /data/db.sqlite3

# Verifica que quedó dentro del volumen
docker run --rm -v neusi_db:/data alpine ls -la /data
```

> `migrate --noinput` (que corre el entrypoint al arrancar) se aplicará **sobre
> esta BD ya poblada**: es idempotente y solo añade migraciones pendientes, nunca
> borra ni recrea datos.

---

## 3. Construir y levantar (despliegue de un solo comando)

```bash
docker compose up -d --build
```

Esto:
1. Compila el frontend (Vite) en el stage de Node.
2. Construye la imagen final de Django (con `collectstatic` en build time).
3. Levanta `web` (Gunicorn en `:8070`, solo red interna) y `cloudflared` (túnel).

Ver logs:

```bash
docker compose logs -f web
docker compose logs -f cloudflared
```

### Fallback de Node (si el build de React falla en alpine)

Si el stage de frontend falla por dependencias nativas con musl (esbuild / three.js):

```bash
docker compose build --build-arg NODE_IMAGE=node:22-slim
docker compose up -d
```

(o fija `NODE_IMAGE=node:22-slim` en el `.env`).

---

## 4. Token del túnel de Cloudflare

La creación del túnel se hace **manualmente** en el dashboard:

1. Cloudflare **Zero Trust → Networks → Tunnels → Create a tunnel** (tipo *Cloudflared*).
2. En **Install connector**, copia el **token** (cadena larga que sigue a
   `--token`) y pégalo en `.env` como `TUNNEL_TOKEN=...`.
3. En **Public Hostnames** del túnel, añade:
   - `neusisolutions.com` → Service: `http://web:8070`
   - `www.neusisolutions.com` → Service: `http://web:8070`

   (El nombre `web` resuelve por la red interna del compose.)
4. Reinicia el sidecar si ya estaba arriba: `docker compose up -d cloudflared`.

---

## 5. ✅ Verificación post-despliegue (no dar por bueno sin esto)

1. **Landing pública** responde:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://neusisolutions.com/
   ```
2. **Intranet isodoc CONSERVA SUS DOCUMENTOS** — paso crítico:
   - Entra a `https://neusisolutions.com/intranet/`, inicia sesión y confirma que
     **la lista de documentos isodoc sigue mostrando los registros previos**.
   - Alternativa por consola (cuenta de documentos en la BD del volumen):
     ```bash
     docker compose exec web python manage.py shell -c \
       "from isodoc.models import Documento; print('Documentos:', Documento.objects.count())"
     ```
   - El número debe coincidir con el de antes de migrar. Si es 0 o falla, **NO
     continúes**: restaura desde `db.sqlite3.bak` y revisa el paso 2.

---

## Operación

```bash
docker compose ps              # estado
docker compose restart web     # reiniciar app
docker compose down            # detener (los volúmenes neusi_db/neusi_media PERSISTEN)
docker compose up -d --build   # redeploy tras cambios de código
```

Backups periódicos de la BD del volumen:

```bash
docker run --rm -v neusi_db:/data -v "$(pwd):/out" alpine \
  cp /data/db.sqlite3 /out/db.sqlite3.$(date +%F).bak
```

---

## Nota — migración futura a PostgreSQL (no implementado)

Hoy se usa **SQLite** (en el volumen `neusi_db`). Para migrar a Postgres más
adelante, sin reescribir la app:

1. Añadir servicio `db: postgres:16` al compose con su propio volumen.
2. `pip install psycopg[binary]` en `requirements.txt`.
3. En `settings.py`, cambiar `DATABASES['default']` a leer `DATABASE_URL` /
   variables `POSTGRES_*` (el bloque está marcado con un comentario en el código).
4. Migrar los datos: `dumpdata` desde SQLite → `loaddata` en Postgres
   (o `pgloader`).

No hacer este cambio hasta que se solicite explícitamente.
