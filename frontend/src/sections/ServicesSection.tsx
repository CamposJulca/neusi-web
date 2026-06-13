import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const SERVICES = [
  {
    icon: "{ }",
    color: "#6B4EFF",
    title: "Desarrollo de Software",
    desc: "Web, móvil y APIs para procesos críticos. Arquitectura modular, seguridad y CI/CD.",
    outcome: "Lanza productos digitales más rápido y reduce errores en producción.",
    tags: ["Django", "React", "FastAPI", "PostgreSQL"],
  },
  {
    icon: "🧠",
    color: "#FFB347",
    title: "Datos e IA",
    desc: "Del dato a la decisión: pipelines, dashboards y modelos predictivos con valor medible.",
    outcome: "Toma decisiones con datos confiables y anticipa resultados.",
    tags: ["ETL", "NLP", "Predicción", "BI"],
  },
  {
    icon: "📡",
    color: "#00CFFF",
    title: "IoT y Automatización",
    desc: "Sensores, edge computing y reglas de negocio para operación segura y trazable.",
    outcome: "Reduce costos operativos y reacciona en tiempo real ante incidentes.",
    tags: ["MQTT", "ThingsBoard", "Edge", "Alertas"],
  },
  {
    icon: "☁️",
    color: "#8e86ff",
    title: "DevOps & Infra",
    desc: "Despliegues reproducibles, observabilidad y costos optimizados.",
    outcome: "Más disponibilidad del servicio y menor gasto en infraestructura.",
    tags: ["Docker", "K8s", "IaC", "CI/CD"],
  },
  {
    icon: "🗺️",
    color: "#FF8C42",
    title: "Consultoría & Arquitectura",
    desc: "Diagnóstico técnico y roadmap de modernización con foco en interoperabilidad.",
    outcome: "Moderniza tu tecnología con un plan claro y menos riesgo.",
    tags: ["ADR", "DDD", "Seguridad", "Gobierno"],
  },
  {
    icon: "🔬",
    color: "#6B4EFF",
    title: "I+D+i",
    desc: "Prototipos y pilotos con métricas claras: IA generativa, RPA y tecnologías emergentes.",
    outcome: "Valida nuevas ideas con riesgo controlado antes de invertir a escala.",
    tags: ["POC", "Gen-AI", "RPA", "Spin-off"],
  },
];

export default function ServicesSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="servicios" className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d0c26 0%, #07061A 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(107,78,255,0.06), transparent)" }}
      />
      <div className="max-w-6xl mx-auto px-4 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#8e86ff] text-xs font-bold uppercase tracking-[0.15em] mb-2">Servicios</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Lo que construimos</h2>
          <p className="text-white/60 max-w-xl">
            Soluciones modulares de alto impacto: desde productos digitales y APIs hasta analítica e IoT.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]
                hover:-translate-y-1.5 hover:border-[#6B4EFF]/40
                hover:shadow-[0_12px_32px_rgba(107,78,255,0.18)]
                transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black mb-4"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                {s.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-3">{s.desc}</p>

              {/* Resultado de negocio */}
              <div
                className="flex items-start gap-2 mb-4 px-3 py-2 rounded-lg"
                style={{ background: `${s.color}1f` }}
              >
                <span className="text-xs mt-0.5" style={{ color: s.color }}>↗</span>
                <p className="text-xs font-semibold text-white/80 leading-snug">{s.outcome}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: `${s.color}14`, color: s.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Hover accent bar */}
              <div
                className="h-0.5 w-0 group-hover:w-full mt-4 rounded-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
