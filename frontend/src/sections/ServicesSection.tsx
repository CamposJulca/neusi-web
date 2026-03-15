import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const SERVICES = [
  {
    icon: "{ }",
    color: "#6B4EFF",
    title: "Desarrollo de Software",
    desc: "Web, móvil y APIs para procesos críticos. Arquitectura modular, seguridad y CI/CD.",
    tags: ["Django", "React", "FastAPI", "PostgreSQL"],
  },
  {
    icon: "🧠",
    color: "#FFB347",
    title: "Datos e IA",
    desc: "Del dato a la decisión: pipelines, dashboards y modelos predictivos con valor medible.",
    tags: ["ETL", "NLP", "Predicción", "BI"],
  },
  {
    icon: "📡",
    color: "#00CFFF",
    title: "IoT y Automatización",
    desc: "Sensores, edge computing y reglas de negocio para operación segura y trazable.",
    tags: ["MQTT", "ThingsBoard", "Edge", "Alertas"],
  },
  {
    icon: "☁️",
    color: "#8e86ff",
    title: "DevOps & Infra",
    desc: "Despliegues reproducibles, observabilidad y costos optimizados.",
    tags: ["Docker", "K8s", "IaC", "CI/CD"],
  },
  {
    icon: "🗺️",
    color: "#FF8C42",
    title: "Consultoría & Arquitectura",
    desc: "Diagnóstico técnico y roadmap de modernización con foco en interoperabilidad.",
    tags: ["ADR", "DDD", "Seguridad", "Gobierno"],
  },
  {
    icon: "🔬",
    color: "#6B4EFF",
    title: "I+D+i",
    desc: "Prototipos y pilotos con métricas claras: IA generativa, RPA y tecnologías emergentes.",
    tags: ["POC", "Gen-AI", "RPA", "Spin-off"],
  },
];

export default function ServicesSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#6B4EFF] text-xs font-bold uppercase tracking-[0.15em] mb-2">Servicios</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#151431] mb-3">Lo que construimos</h2>
          <p className="text-[#151431]/60 max-w-xl">
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
              className="group p-6 rounded-2xl bg-white border border-[#e7e4ff]
                shadow-[0_4px_18px_rgba(107,78,255,0.06)]
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
              <h3 className="text-base font-bold text-[#151431] mb-2">{s.title}</h3>
              <p className="text-sm text-[#151431]/60 leading-relaxed mb-4">{s.desc}</p>

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
