import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Inicio",    href: "#home" },
  { label: "Servicios", href: "#servicios" },
  { label: "Propuesta", href: "#propuesta" },
  { label: "Casos",     href: "#casos" },
  { label: "Equipo",    href: "#equipo" },
  { label: "Nosotros",  href: "#nosotros" },
  { label: "Contacto",  href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open,     setOpen]       = useState(false);
  const [active,   setActive]     = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setActive(href);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#05041A]/90 backdrop-blur-md shadow-[0_0_24px_rgba(107,78,255,0.15)]"
                 : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => go("#home")} className="flex items-center gap-2 focus:outline-none">
          <span className="font-black text-xl tracking-tight">
            <span className="text-[#8e86ff]">NEU</span>
            <span className="text-[#FFB347]">SI</span>
          </span>
          <span className="text-xs text-white/40 hidden sm:block font-medium">Solutions</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                active === l.href
                  ? "text-[#FFB347] bg-[#FFB347]/10"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("#contacto")}
            className="ml-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B4EFF] to-[#8e86ff] text-white text-sm font-bold shadow-[0_4px_16px_rgba(107,78,255,0.4)] hover:shadow-[0_4px_24px_rgba(107,78,255,0.6)] transition-all hover:-translate-y-0.5"
          >
            Hablemos
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          <div className={`w-5 h-0.5 bg-white mb-1.5 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 bg-white mb-1.5 transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#07061A]/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/8 transition-all"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
