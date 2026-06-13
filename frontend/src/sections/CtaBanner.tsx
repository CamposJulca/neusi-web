import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

/**
 * CTA intermedio: aparece a mitad de página (tras los casos de impacto)
 * para captar al visitante sin obligarlo a recorrer todo el sitio
 * hasta el formulario de contacto.
 */
export default function CtaBanner() {
  const { ref, visible } = useReveal(0.2);

  const go = () =>
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden py-16"
      style={{ background: "linear-gradient(180deg, #05041A 0%, #0d0c26 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(107,78,255,0.14), transparent 70%)" }}
      />
      <div className="max-w-4xl mx-auto px-4 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6
            p-8 rounded-3xl bg-white/[0.04] border border-white/[0.1]
            shadow-[0_8px_40px_rgba(107,78,255,0.12)]"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
              ¿Tienes un reto que resolver?
            </h3>
            <p className="text-white/60 text-sm">
              Cuéntanos tu problema y te proponemos una solución con resultados medibles.
            </p>
          </div>
          <button
            onClick={go}
            className="shrink-0 px-7 py-3 rounded-full font-bold text-white text-base
              bg-gradient-to-r from-[#6B4EFF] to-[#8e86ff]
              shadow-[0_4px_24px_rgba(107,78,255,0.5)]
              hover:shadow-[0_4px_36px_rgba(107,78,255,0.7)]
              hover:-translate-y-0.5 transition-all duration-200"
          >
            Hablemos de tu proyecto
          </button>
        </motion.div>
      </div>
    </section>
  );
}
