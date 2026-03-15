#!/bin/bash
# ──────────────────────────────────────────────────────────────
# NEUSI Web — Deploy a producción
# Ejecutar con: sudo bash /home/desarrollo/Web/deploy.sh
#
# Arquitectura resultante:
#   ngrok (neusi-web.ngrok.io) → Gunicorn :8070
#   WhiteNoise sirve /static/ dentro del mismo proceso
# ──────────────────────────────────────────────────────────────
set -e

echo "======================================"
echo " NEUSI Web — Deploy producción"
echo "======================================"

echo ""
echo "▶ [1/2] Instalando servicio Gunicorn en :8070 ..."
cp /home/desarrollo/Web/neusiweb.service /etc/systemd/system/neusiweb.service
systemctl daemon-reload
systemctl enable neusiweb.service
systemctl restart neusiweb.service
sleep 2
systemctl is-active --quiet neusiweb.service && echo "   ✓ neusiweb.service activo"

echo ""
echo "▶ [2/2] Verificando respuesta HTTP en :8070 ..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8070/)
echo "   HTTP $STATUS"

echo ""
echo "======================================"
if [ "$STATUS" = "200" ]; then
  echo "✅ Deploy exitoso"
else
  echo "⚠️  Servicio levantado — revisa logs con:"
  echo "   journalctl -u neusiweb.service -n 50"
fi
echo "   URL pública: https://neusi-web.ngrok.io"
echo "   Puerto:      :8070  →  Gunicorn (3 workers)"
echo "   Estáticos:   WhiteNoise sirve /static/ directamente"
echo "======================================"
