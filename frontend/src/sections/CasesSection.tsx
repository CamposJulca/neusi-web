import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const CASES = [
  {
    color: "#6B4EFF",
    tag: "Sector Público",
    title: "Plataforma de Contratación",
    problem: "Procesos de contratación con reprocesos, documentos dispersos y poca trazabilidad.",
    solution: "Flujos CPS por ciclos, documentos en GridFS, auditoría completa y automatización SIPSE.",
    result: "SLAs ≥ 90% y reducción de reprocesos con trazabilidad total por proceso.",
    metric: "SLA 90%+",
  },
  {
    color: "#FFB347",
    tag: "Finanzas",
    title: "FinanzApp",
    problem: "Cierres financieros manuales y reportes lentos para la junta directiva.",
    solution: "KPIs financieros, ETL y tableros ejecutivos con exportables a Excel listos para presentar.",
    result: "Información consolidada multiempresa en tiempo real y decisiones más ágiles.",
    metric: "ETL en tiempo real",
  },
  {
    color: "#00CFFF",
    tag: "Smart City",
    title: "IoT Urbano",
    problem: "Activos urbanos sin monitoreo, con fallas detectadas tarde y mantenimientos reactivos.",
    solution: "Monitoreo con edge computing, reglas y alertas automáticas y mantenimiento predictivo.",
    result: "Menos fallas no planificadas y reportes de cumplimiento automáticos.",
    metric: "Edge + MQTT",
  },
];

const STEPS = [
  { key: "problem"  as const, label: "Problema",  icon: "✕" },
  { key: "solution" as const, label: "Solución",  icon: "→" },
  { key: "result"   as const, label: "Resultado", icon: "✓" },
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

              <h3 className="text-lg font-black text-[#151431] mb-4">{c.title}</h3>

              {/* Estructura Problema → Solución → Resultado */}
              <div className="space-y-3 mb-5">
                {STEPS.map((s) => (
                  <div key={s.key} className="flex items-start gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                      style={{ background: `${c.color}18`, color: c.color }}
                    >
                      {s.icon}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: c.color }}>{s.label}</p>
                      <p className="text-sm text-[#151431]/70 leading-snug">{c[s.key]}</p>
                    </div>
                  </div>
                ))}
              </div>

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
