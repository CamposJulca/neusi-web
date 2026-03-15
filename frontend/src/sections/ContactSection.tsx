import { useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const CHANNELS = [
  { icon: "📱", label: "WhatsApp", href: "https://wa.me/573028583772", value: "+57 302 858 3772" },
  { icon: "📧", label: "Email", href: "mailto:auxiliar.visualizacion@neusisolutions.com", value: "neusisolutions.com" },
  { icon: "📸", label: "Instagram", href: "https://www.instagram.com/neusi_solutions_col/", value: "@neusi_solutions_col" },
  { icon: "🎵", label: "TikTok", href: "https://www.tiktok.com/@neusi_solutions_col", value: "@neusi_solutions_col" },
];

export default function ContactSection() {
  const { ref, visible } = useReveal(0.1);
  const [form,   setForm]   = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/contacto/enviar/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };

  return (
    <section id="contacto" className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #07061A 0%, #05041A 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(255,179,71,0.05), transparent)" }}
      />

      <div className="max-w-5xl mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#FFB347] text-xs font-bold uppercase tracking-[0.15em] mb-2">Contacto</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Hablemos de tu proyecto</h2>
          <p className="text-white/55 max-w-lg mx-auto">
            Cuéntanos qué problema quieres resolver. Nuestro hogar tecnológico está listo para ti.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Channels */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-white/50 text-sm mb-6">Conéctate por el canal que prefieras:</p>
            {CHANNELS.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener"
                className="flex items-center gap-4 p-4 rounded-xl
                  bg-white/4 border border-white/8
                  hover:border-[#6B4EFF]/40 hover:bg-white/6
                  hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(107,78,255,0.12)]
                  transition-all duration-200 group"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold group-hover:text-[#FFB347] transition-colors">{c.label}</p>
                  <p className="text-white/45 text-xs">{c.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 24 }} animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="p-6 rounded-2xl bg-white/4 border border-white/10 space-y-4"
          >
            <input
              required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30
                focus:outline-none focus:border-[#6B4EFF]/60 focus:bg-white/10 transition text-sm"
            />
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Tu email"
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30
                focus:outline-none focus:border-[#6B4EFF]/60 focus:bg-white/10 transition text-sm"
            />
            <textarea
              required rows={4} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="¿Qué problema quieres resolver?"
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30
                focus:outline-none focus:border-[#6B4EFF]/60 focus:bg-white/10 transition text-sm resize-none"
            />
            <button
              type="submit" disabled={status === "loading"}
              className="w-full py-3 rounded-xl font-bold text-white text-sm
                bg-gradient-to-r from-[#6B4EFF] to-[#8e86ff]
                shadow-[0_4px_20px_rgba(107,78,255,0.4)]
                hover:shadow-[0_4px_28px_rgba(107,78,255,0.6)]
                disabled:opacity-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              {status === "loading" ? "Enviando..." : "Enviar mensaje 🚀"}
            </button>
            {status === "ok"    && <p className="text-green-400 text-sm text-center">¡Mensaje enviado! Te contactamos pronto.</p>}
            {status === "error" && <p className="text-red-400 text-sm text-center">Hubo un error. Escríbenos directamente.</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function getCookie(name: string) {
  return document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith(name + "="))?.split("=")[1] ?? "";
}
