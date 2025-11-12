// include-partials.js
document.addEventListener("DOMContentLoaded", async () => {
  const slots = Array.from(document.querySelectorAll("[data-include]"));

  for (const slot of slots) {
    const url = slot.getAttribute("data-include");
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();

      // Inserta TODO el HTML del parcial (no solo el primer elemento)
      slot.insertAdjacentHTML("beforebegin", html);
      slot.remove();
    } catch (e) {
      console.error("No se pudo incluir:", url, e);
    }
  }

  // Año dinámico del footer (si existe)
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Marca nav activo
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("#mainNav .nav-link").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isActive = href === current || (current === "index.html" && (href === "" || href.endsWith("index.html")));
    a.classList.toggle("active", isActive);
  });

  // Evento para otros scripts
  document.dispatchEvent(new Event("partials:loaded"));
});
