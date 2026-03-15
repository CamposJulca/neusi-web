/* =============================================================
   NEUSI NEURAL CANVAS
   Animación de red neuronal para el hero:
   nodos flotantes (neuronas) + líneas de conexión (sinapsis)
   + señales/pulsos viajando en dorado/cyan (neural signals)
   ============================================================= */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], pulses = [], raf, resizeTimer;

  const C = {
    get count()   { return W < 768 ? 40 : 70; },
    get maxDist() { return W < 768 ? 105 : 140; },
    speed:       0.32,
    pulseProb:   0.00085,
    maxPulses:   40,
    nodePrimary: '#6B4EFF',
    nodeMid:     '#8e86ff',
    lineColor:   'rgba(107,78,255,',
    pulseColors: ['#FFB347','#FFB347','#00CFFF','#b89eff'],  /* 50% dorado, 25% cyan, 25% púrpura */
  };

  class Node {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      const a = Math.random() * Math.PI * 2;
      const s = (0.15 + Math.random() * 0.5) * C.speed;
      this.vx = Math.cos(a) * s;
      this.vy = Math.sin(a) * s;
      this.r  = 1.2 + Math.random() * 1.4;
      this.bright = Math.random();
      this.phase  = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.phase += 0.018;
      if (this.x < -8)   this.x = W + 8;
      if (this.x > W + 8) this.x = -8;
      if (this.y < -8)   this.y = H + 8;
      if (this.y > H + 8) this.y = -8;
    }
  }

  class Pulse {
    constructor(a, b) {
      this.a = a; this.b = b; this.t = 0;
      this.speed = 0.005 + Math.random() * 0.009;
      this.color = C.pulseColors[Math.floor(Math.random() * C.pulseColors.length)];
      this.size  = 2 + Math.random() * 1.2;
    }
    update() { this.t += this.speed; return this.t <= 1; }
    get x() { return this.a.x + (this.b.x - this.a.x) * this.t; }
    get y() { return this.a.y + (this.b.y - this.a.y) * this.t; }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
    const target = C.count;
    while (nodes.length < target) nodes.push(new Node());
    if (nodes.length > target) nodes.length = target;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => n.update());

    /* Conexiones */
    const maxD2 = C.maxDist * C.maxDist;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d2 = dx*dx + dy*dy;
        if (d2 < maxD2) {
          const alpha = (1 - Math.sqrt(d2) / C.maxDist) * 0.32;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = C.lineColor + alpha + ')';
          ctx.lineWidth = 0.65;
          ctx.stroke();
          if (Math.random() < C.pulseProb && pulses.length < C.maxPulses)
            pulses.push(new Pulse(nodes[i], nodes[j]));
        }
      }
    }

    /* Nodos */
    nodes.forEach(n => {
      const glow = 0.55 + Math.sin(n.phase) * 0.25;
      ctx.globalAlpha = glow;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.bright > 0.65 ? C.nodeMid : C.nodePrimary;
      ctx.fill();
      if (n.bright > 0.82) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(142,134,255,0.09)';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    /* Pulsos (señales sinápticas) */
    pulses = pulses.filter(p => {
      if (!p.update()) return false;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      return true;
    });

    raf = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 160);
  });

  resize();
  draw();
})();

// Año dinámico + ScrollSpy activo y marca de nav
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Bootstrap ScrollSpy (si está disponible)
  const spyHost = document.querySelector('[data-bs-spy="scroll"]');
  if (spyHost && window.bootstrap?.ScrollSpy) {
    const spy = bootstrap.ScrollSpy.getInstance(spyHost) || new bootstrap.ScrollSpy(spyHost, { target: "#mainNav", offset: 90 });
    setTimeout(() => spy.refresh(), 300);
  }

  // Marcar nav-link activa según hash
  function markActive() {
    const hash = location.hash || "#home";
    document.querySelectorAll("#mainNav .nav-link").forEach(a => {
      const href = a.getAttribute("href");
      if (href === hash || (hash === "#home" && (href === "#home" || href === "index.html"))) a.classList.add("active");
      else a.classList.remove("active");
    });
  }
  window.addEventListener("hashchange", markActive);
  markActive();

  // IntersectionObserver para .reveal
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

  els.forEach(el => io.observe(el));
});

// Demo de envío del formulario (placeholder)
function fakeSubmit(form){
  const btn = form.querySelector('button');
  const original = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = 'Enviando...';
  setTimeout(()=>{ btn.innerHTML = '¡Listo!'; }, 600);
  setTimeout(()=>{ btn.disabled = false; btn.innerHTML = original; form.reset(); }, 1300);
}

// === NAVBAR AUTO ACTIVO ===
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    // Coincidencia directa o default (index.html o vacío)
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});


/* =========================
   Fondo YouTube en bucle (hero)
   Requiere: iframe con id="bgPlayer" y enablejsapi=1
   ========================= */
(function initYTLoop() {
  // ID del video (el que ya usas en el iframe)
  const VIDEO_ID = "-9oyHPZKikA";
  const iframe = document.getElementById("bgPlayer");
  if (!iframe) return; // no hay hero con video en esta página

  // Asegura que el src tenga enablejsapi=1 y playlist para loop
  try {
    const url = new URL(iframe.src);
    url.searchParams.set("enablejsapi", "1");
    url.searchParams.set("controls", "0");
    url.searchParams.set("mute", "1");
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("loop", "1");
    url.searchParams.set("playlist", VIDEO_ID);
    url.searchParams.set("modestbranding", "1");
    url.searchParams.set("rel", "0");
    url.searchParams.set("playsinline", "1");
    iframe.src = url.toString();
  } catch {}

  // Carga liviana de la API de Iframe de YouTube
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  // Fallback por si bloquean la API (evita pantalla negra)
  let apiOk = false;
  const fallbackTimer = setTimeout(() => {
    if (!apiOk) document.body.classList.add("yt-fallback"); // úsalo para ocultar el video si quieres
  }, 3000);

  // YT API global hook
  window.onYouTubeIframeAPIReady = function () {
    apiOk = true;
    clearTimeout(fallbackTimer);

    // Crea el player y fuerza el loop
    new YT.Player("bgPlayer", {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        playlist: VIDEO_ID,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (e) => {
          try {
            e.target.mute();
            e.target.playVideo();
          } catch {}
        },
        onStateChange: (e) => {
          // Si por alguna razón se detiene, lo relanzamos
          if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.PAUSED) {
            try { e.target.playVideo(); } catch {}
          }
        },
      },
    });
  };
})();
/* =========================
   Fondo YouTube en bucle (hero)
   Crea el reproductor con la IFrame API (sin iframe manual)
   ========================= */
(function initYTLoop() {
  const VIDEO_ID = "-9oyHPZKikA";              // tu video
  const mountId  = "bgPlayer";                 // contenedor en el HTML
  const mount    = document.getElementById(mountId);
  if (!mount) return;

  // Carga la API de YouTube
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  // URL de origen para la API (evita error 153/403)
  const ORIGIN = `${location.protocol}//${location.host}`;

  // Fallback si algo bloquea la API
  let apiOk = false;
  const fallbackTimer = setTimeout(() => {
    if (!apiOk) document.body.classList.add("yt-fallback");
  }, 4000);

  // Función global requerida por la API
  window.onYouTubeIframeAPIReady = function () {
    apiOk = true;
    clearTimeout(fallbackTimer);

    new YT.Player(mountId, {
      videoId: VIDEO_ID,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        playlist: VIDEO_ID,     // necesario para loop
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: ORIGIN,         // ← clave para evitar bloqueo
      },
      events: {
        onReady: (ev) => {
          try { ev.target.mute(); ev.target.playVideo(); } catch {}
        },
        onStateChange: (ev) => {
          // reintentar si pausa o termina
          if (ev.data === YT.PlayerState.ENDED || ev.data === YT.PlayerState.PAUSED) {
            try { ev.target.playVideo(); } catch {}
          }
        }
      }
    });
  };
})();
