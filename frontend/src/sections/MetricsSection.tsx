import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const METRICS = [
  { icon: "⚡", num: "100", suffix: "%", label: "Proyectos entregados", color: "#FFB347" },
  { icon: "🧠", num: "6",   suffix: "+",  label: "Servicios especializados", color: "#8e86ff" },
  { icon: "🌎", num: "3",   suffix: "+",  label: "Años de experiencia", color: "#00CFFF" },
  { icon: "🏠", num: "LatAm", suffix: "", label: "Alcance regional", color: "#FFB347" },
];

function Counter({ target, suffix, color, active }: { target: string; suffix: string; color: string; active: boolean }) {
  const [display, setDisplay] = useState("0");
  const num = parseFloat(target);
  const isNum = !isNaN(num);

  useEffect(() => {
    if (!active || !isNum) { if (active) setDisplay(target); return; }
    const duration = 1400;
    const start = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(num * ease).toString());
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, target, num, isNum]);

  return (
    <span style={{ color }} className="text-4xl sm:text-5xl font-black">
      {display}{suffix}
    </span>
  );
}

export default function MetricsSection() {
  const { ref, visible } = useReveal(0.2);

  return (
    <section className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #07061A 0%, #0d0c26 100%)" }}
    >
      {/* Neural glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(107,78,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#8e86ff] text-xs font-bold uppercase tracking-[0.15em] mb-2">Impacto real</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Resultados que hablan</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl
                bg-white/4 border border-white/8
                hover:border-[#6B4EFF]/40 hover:-translate-y-1
                hover:shadow-[0_8px_32px_rgba(107,78,255,0.15)]
                transition-all duration-300"
            >
              <span className="text-3xl mb-3">{m.icon}</span>
              <Counter target={m.num} suffix={m.suffix} color={m.color} active={visible} />
              <p className="mt-2 text-white/50 text-sm font-medium">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
