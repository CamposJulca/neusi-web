import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const NeuralNetwork3D = lazy(() => import("../components/NeuralNetwork3D"));

const CHIPS = [
  { icon: "🧠", text: "Redes neuronales & IA" },
  { icon: "🏠", text: "Hogar tecnológico" },
  { icon: "🔒", text: "Seguridad & auditoría" },
];

/** Genera props de animación fade-up con delay escalonado */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 28 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.65, delay },
  };
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, #1a1060 0%, #05041A 60%)" }}
    >
      {/* ── Red neuronal 3D ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralNetwork3D />
        </Suspense>
      </div>

      {/* ── Radial glow central ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107,78,255,0.12), transparent 70%)" }}
      />

      {/* ── Contenido ── */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        {/* Badge etimología */}
        <motion.div {...fadeUp(0.1)} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-sm font-semibold
            bg-white/[0.07] border border-white/[0.15] backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="font-black text-[#8e86ff] tracking-widest text-base">NEU</span>
              <span className="text-white/55 text-xs">neural · inteligencia</span>
            </span>
            <span className="text-white/25 text-xs">✦</span>
            <span className="flex items-center gap-1.5">
              <span className="font-black text-[#FFB347] tracking-widest text-base">WASI</span>
              <span className="text-white/55 text-xs">hogar en quechua</span>
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.22)}
          className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight"
        >
          <span className="block text-white mb-1">Tu</span>
          <span className="block bg-gradient-to-r from-[#a89fff] via-[#6B4EFF] to-[#00CFFF]
            bg-clip-text text-transparent pb-1">
            hogar de innovación
          </span>
          <span className="block text-white">impulsado por</span>
          <span className="block bg-gradient-to-r from-[#FFD54D] via-[#FFB347] to-[#FF8C42]
            bg-clip-text text-transparent">
            inteligencia
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          {...fadeUp(0.36)}
          className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          Donde las <strong className="text-white/90">redes neuronales</strong> y la{" "}
          <strong className="text-white/90">calidez del hogar</strong> se unen para resolver
          los problemas reales de hoy: software, datos/IA e IoT.
        </motion.p>

        {/* Chips */}
        <motion.div {...fadeUp(0.48)} className="mt-6 flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <span key={c.text}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-white/[0.08] border border-white/[0.15] text-white/80 text-sm font-medium backdrop-blur-sm">
              <span>{c.icon}</span> {c.text}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.60)} className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#servicios"
            onClick={(e) => { e.preventDefault(); document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-7 py-3 rounded-full font-bold text-white text-base
              bg-gradient-to-r from-[#6B4EFF] to-[#8e86ff]
              shadow-[0_4px_24px_rgba(107,78,255,0.5)]
              hover:shadow-[0_4px_36px_rgba(107,78,255,0.7)]
              hover:-translate-y-0.5 transition-all duration-200"
          >
            Ver servicios
          </a>
          <a
            href="#nosotros"
            onClick={(e) => { e.preventDefault(); document.querySelector("#nosotros")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-7 py-3 rounded-full font-bold text-white/80 text-base
              border border-white/25 hover:border-white/50 hover:text-white
              hover:-translate-y-0.5 transition-all duration-200"
          >
            Conoce NEUSI
          </a>
        </motion.div>

        <motion.p {...fadeUp(0.72)} className="mt-6 text-xs text-white/35 tracking-wide">
          On-prem o nube&nbsp;•&nbsp;CI/CD&nbsp;•&nbsp;BI / ERP / SECOP / ETL
        </motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-0.5 h-6 bg-gradient-to-b from-[#6B4EFF] to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
