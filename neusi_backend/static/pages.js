// pages.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== Scroll reveal =====
  const revealed = new WeakSet();
  const revIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        revealed.add(e.target);
        revIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

  document.querySelectorAll(".reveal").forEach(el => revIO.observe(el));

  // ===== Métricas: contador (0 -> objetivo) =====
  const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic
  function animateCount(el){
    const target = Number(el.dataset.target || "0");
    const duration = Number(el.dataset.duration || "1200");
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals || "0");
    const start = performance.now();

    function frame(now){
      const p = Math.min(1, (now - start) / duration);
      const val = target * easeOut(p);
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const metIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("revealed");
        const span = e.target.querySelector(".metric-count");
        if(span && !span.dataset.done){
          span.dataset.done = "1";
          animateCount(span);
        }
        metIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll(".metric").forEach(m => metIO.observe(m));

  // ===== Icon spin suave al hover ya está en CSS (ver .pill:hover i)
});
// ==== Contadores animados (0 -> data-count) ==== //
(function () {
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const raw = (el.dataset.count || "");
    const decimals = (raw.split(".")[1] || "").length;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = parseInt(el.dataset.duration || "1300", 10);

    const startVal = 0;
    const startTime = performance.now();

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const value = startVal + (target - startVal) * easeOutCubic(t);

      let text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
      // Quitar ceros innecesarios tipo 12.0 -> 12
      if (decimals > 0) text = text.replace(/(\.\d*?[1-9])0+$/,'$1').replace(/\.0+$/, '');

      el.textContent = `${prefix}${text}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
      else {
        // Asegurar cierre exacto en el destino
        let finalText = decimals > 0 ? target.toFixed(decimals) : target.toString();
        finalText = finalText.replace(/(\.\d*?[1-9])0+$/,'$1').replace(/\.0+$/, '');
        el.textContent = `${prefix}${finalText}${suffix}`;
      }
    }

    el.classList.add('count-done');
    requestAnimationFrame(frame);
  }

  // Iniciar todos los .count cuando aparezcan
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains('count-done')) animateCount(el);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.count').forEach(el => {
    // Inicial en 0 con formato correcto (respeta decimales)
    const raw = (el.dataset.count || "");
    const decimals = (raw.split(".")[1] || "").length;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const zero = decimals > 0 ? (0).toFixed(decimals).replace(/\.0+$/, '') : "0";
    el.textContent = `${prefix}${zero}${suffix}`;
    io.observe(el);
  });
})();


