import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const CARDS = [
  {
    title: "Cómo trabajamos",
    icon: "🗺️",
    items: ["Mapeo de procesos críticos y riesgos", "Roadmap por hitos con supuestos explícitos", "Entregas quincenales con demos y métricas", "Comunicación transparente y trazabilidad total"],
  },
  {
    title: "Diferenciadores",
    icon: "⚡",
    items: ["Interoperabilidad por APIs y estándares", "Gobierno de datos: catálogo, calidad y auditoría", "Seguridad desde el diseño (IAM, hardening, DRP)", "Optimización de costos con telemetría"],
  },
  {
    title: "Garantías de servicio",
    icon: "🛡️",
    items: ["SLAs por severidad y ventanas de mantenimiento", "Versionado semántico y gestión de cambios", "Pruebas automatizadas y monitoreo continuo", "Plan de reversa y contingencia"],
  },
  {
    title: "Entregables típicos",
    icon: "📦",
    items: ["Arquitectura de referencia y diagramas de dominio", "Backlog priorizado y reportes ejecutivos", "Playbooks de despliegue y observabilidad", "Guías de seguridad y gobierno de datos"],
  },
];

export default function ProposalSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="propuesta" className="py-24"
      style={{ background: "linear-gradient(180deg, #fff 0%, #f5f3ff 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#6B4EFF] text-xs font-bold uppercase tracking-[0.15em] mb-2">Propuesta</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#151431] mb-3">Arquitectura abierta, valor medible</h2>
          <p className="text-[#151431]/60 max-w-xl">
            Alineamos tecnología y negocio desde el inicio con seguridad, datos y observabilidad como ciudadanos de primera clase.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-[#e7e4ff]
                shadow-[0_4px_18px_rgba(107,78,255,0.05)]
                hover:-translate-y-1 hover:border-[#6B4EFF]/30
                hover:shadow-[0_12px_30px_rgba(107,78,255,0.12)]
                transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="font-bold text-[#151431]">{c.title}</h3>
              </div>
              <ul className="space-y-2">
                {c.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#151431]/65">
                    <span className="text-[#6B4EFF] mt-0.5 text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
