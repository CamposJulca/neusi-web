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
