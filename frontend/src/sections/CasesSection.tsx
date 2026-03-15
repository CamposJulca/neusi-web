import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const CASES = [
  {
    color: "#6B4EFF",
    tag: "Sector Público",
    title: "Plataforma de Contratación",
    desc: "Flujos CPS por ciclos, documentos en GridFS y auditoría completa. Reducción de reprocesos y SLAs ≥ 90%.",
    highlights: ["Trazabilidad por proceso y notificaciones", "Evaluaciones, asignaciones y reportes", "Automatización de documentos SIPSE"],
    metric: "SLA 90%+",
  },
  {
    color: "#FFB347",
    tag: "Finanzas",
    title: "FinanzApp",
    desc: "KPIs financieros, ETL y tableros ejecutivos con exportables a Excel listos para junta directiva.",
    highlights: ["Proyecciones y alertas", "Multiempresa y centros de costo", "Seguridad y auditoría"],
    metric: "ETL en tiempo real",
  },
  {
    color: "#00CFFF",
    tag: "Smart City",
    title: "IoT Urbano",
    desc: "Monitoreo de activos con edge computing y acciones automáticas: mantenimiento predictivo.",
    highlights: ["Telemetría en tiempo real", "Reglas y alertas automáticas", "Reportes de cumplimiento"],
    metric: "Edge + MQTT",
  },
];

export default function CasesSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="casos" className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #fff 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#6B4EFF] text-xs font-bold uppercase tracking-[0.15em] mb-2">Casos de uso</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#151431]">Historias de impacto</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative p-6 rounded-2xl bg-white border border-[#e7e4ff]
                shadow-[0_4px_18px_rgba(107,78,255,0.06)]
                hover:-translate-y-2
                hover:shadow-[0_16px_40px_rgba(107,78,255,0.16)]
                transition-all duration-300 overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-1 w-full rounded-full mb-5" style={{ background: c.color }} />

              {/* Tag */}
              <span className="px-2.5 py-1 rounded-full text-xs font-bold mb-3 inline-block"
                style={{ background: `${c.color}14`, color: c.color }}>
                {c.tag}
              </span>

              <h3 className="text-lg font-black text-[#151431] mb-2">{c.title}</h3>
              <p className="text-sm text-[#151431]/60 leading-relaxed mb-4">{c.desc}</p>

              <ul className="space-y-1.5 mb-5">
                {c.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-[#151431]/70">
                    <span className="mt-0.5 text-xs" style={{ color: c.color }}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* Metric badge */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#e7e4ff]">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: `${c.color}12`, color: c.color }}>
                  {c.metric}
                </span>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}08, transparent 60%)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
