import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const VALUES = [
  { icon: "💡", title: "Innovación aplicada", desc: "Tecnologías emergentes con métricas claras." },
  { icon: "🤝", title: "Transparencia total", desc: "Comunicación directa y trazabilidad en cada entrega." },
  { icon: "🏠", title: "Hogar de trabajo", desc: "Un espacio donde los problemas encuentran soluciones con calidez." },
  { icon: "📊", title: "Datos como citizens", desc: "Gobierno, calidad y observabilidad desde el diseño." },
];

export default function AboutSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="nosotros" className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d0c26 0%, #07061A 100%)" }}
    >
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 15% 50%, rgba(255,179,71,0.05), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 50%, rgba(107,78,255,0.08), transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left: texto */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#8e86ff] text-xs font-bold uppercase tracking-[0.15em] mb-2"
            >Nosotros</motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -20 }} animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-black text-white mb-5"
            >
              Ingeniería con propósito
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4 text-white/65 leading-relaxed text-sm"
            >
              <p>
                <strong className="text-[#8e86ff]">NEU</strong> viene de <em>neural</em> — inteligencia,
                datos y conexiones que aprenden.{" "}
                <strong className="text-[#FFB347]">WASI</strong> es el quechua para <em>hogar</em> —
                un lugar de pertenencia y calidez.
              </p>
              <p>
                Juntos somos el <strong className="text-white">hogar tecnológico</strong> donde los problemas
                reales encuentran soluciones inteligentes. Desarrollamos ecosistemas digitales que integran
                software, datos/IA e IoT con arquitectura abierta y sostenible.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-white/4 border border-white/8">
                <p className="font-bold text-white text-sm mb-1">Misión</p>
                <p>Desarrollar soluciones inteligentes, seguras y escalables que impulsen la transformación digital con enfoque ágil y sostenible.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <p className="font-bold text-white text-sm mb-1">Visión 2027</p>
                <p>Ser referente en Latinoamérica en ecosistemas digitales que integran IA e IoT con soluciones interoperables y de alto desempeño.</p>
              </div>
            </motion.div>
          </div>

          {/* Right: valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="p-5 rounded-2xl bg-white/4 border border-white/8
                  hover:border-[#6B4EFF]/35 hover:-translate-y-1
                  hover:shadow-[0_8px_24px_rgba(107,78,255,0.12)]
                  transition-all duration-300"
              >
                <span className="text-2xl mb-3 block">{v.icon}</span>
                <p className="font-bold text-white text-sm mb-1">{v.title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
