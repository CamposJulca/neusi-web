/**
 * TeamSection — "Neural Node Profiles"
 * Cada miembro del equipo es un nodo de la red neuronal NEUSI.
 * Líneas SVG animadas los conectan como sinapsis.
 */
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

/* ── Datos del equipo ─────────────────────────────── */
// BASE_URL = "/static/react/" en producción, "/" en dev
const BASE = import.meta.env.BASE_URL;

const TEAM = [
  {
    id:      "daniel",
    name:    "Daniel",
    role:    "CEO & Fundador",
    area:    "Liderazgo estratégico",
    color:   "#6B4EFF",
    glow:    "rgba(107,78,255,0.55)",
    initial: "D",
    nodeId:  "NODE-001",
    tags:    ["Arquitectura", "Estrategia", "DevOps"],
    photo:   `${BASE}team/daniel.jpg`,
  },
  {
    id:      "diana",
    name:    "Diana",
    role:    "Administradora",
    area:    "Gestión & Operaciones",
    color:   "#FFB347",
    glow:    "rgba(255,179,71,0.55)",
    initial: "D",
    nodeId:  "NODE-002",
    tags:    ["Gestión", "Finanzas", "Procesos"],
    photo:   `${BASE}team/diana.jpg`,
  },
  {
    id:      "juan",
    name:    "Juan",
    role:    "Developer",
    area:    "Desarrollo de Software",
    color:   "#00CFFF",
    glow:    "rgba(0,207,255,0.55)",
    initial: "J",
    nodeId:  "NODE-003",
    tags:    ["React", "Django", "APIs"],
    photo:   `${BASE}team/juan.jpg`,
  },
  {
    id:      "andres",
    name:    "Andrés",
    role:    "Especialista en Datos",
    area:    "Datos & Machine Learning",
    color:   "#19c37d",
    glow:    "rgba(25,195,125,0.55)",
    initial: "A",
    nodeId:  "NODE-004",
    tags:    ["ETL", "ML", "Visualización"],
    photo:   `${BASE}team/andres.jpg`,
  },
];

/* ── Avatar con foto o placeholder ───────────────── */
function Avatar({ member, size = 96 }: { member: typeof TEAM[0]; size?: number }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [checked,  setChecked]  = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload  = () => { setHasPhoto(true);  setChecked(true); };
    img.onerror = () => { setHasPhoto(false); setChecked(true); };
    img.src = member.photo;
  }, [member.photo]);

  return (
    <div
      className="relative rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: `${member.color}18`, border: `2px solid ${member.color}40` }}
    >
      {checked && hasPhoto ? (
        <img src={member.photo} alt={member.name}
          className="w-full h-full object-cover" />
      ) : (
        /* Placeholder holográfico con inicial */
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
          style={{ background: `radial-gradient(circle at 35% 35%, ${member.color}40, ${member.color}10)` }}>
          {/* Líneas de escaneo */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${member.color}50 3px, ${member.color}50 4px)` }} />
          <span className="relative z-10 font-black text-white"
            style={{ fontSize: size * 0.38, textShadow: `0 0 20px ${member.color}` }}>
            {member.initial}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Anillo pulsante alrededor del avatar ─────────── */
function PulseRing({ color, glow, active }: { color: string; glow: string; active: boolean }) {
  return (
    <div className="absolute inset-0 rounded-full pointer-events-none">
      {/* Anillo exterior que gira */}
      <motion.div
        className="absolute inset-[-6px] rounded-full"
        style={{ border: `1.5px dashed ${color}60` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Anillo de glow que pulsa */}
      <motion.div
        className="absolute inset-[-3px] rounded-full"
        style={{ border: `2px solid ${color}` }}
        animate={active ? { boxShadow: [`0 0 8px ${glow}`, `0 0 22px ${glow}`, `0 0 8px ${glow}`] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

/* ── Líneas SVG de conexión entre nodos ───────────── */
function NeuralConnections({ visible }: { visible: boolean }) {
  /* Posiciones relativas en la grilla 2×2:
     [0]=TopLeft  [1]=TopRight
     [2]=BotLeft  [3]=BotRight  */
  const lines = [
    { x1: "25%", y1: "25%", x2: "75%", y2: "25%" }, // top horizontal
    { x1: "25%", y1: "75%", x2: "75%", y2: "75%" }, // bot horizontal
    { x1: "25%", y1: "25%", x2: "25%", y2: "75%" }, // left vertical
    { x1: "75%", y1: "25%", x2: "75%", y2: "75%" }, // right vertical
    { x1: "25%", y1: "25%", x2: "75%", y2: "75%" }, // diagonal ↘
    { x1: "75%", y1: "25%", x2: "25%", y2: "75%" }, // diagonal ↙
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden>
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6B4EFF" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#FFB347" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <motion.line key={i} stroke="url(#lineGrad)" strokeWidth="1"
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 + i * 0.15 }}
          strokeDasharray="4 6"
        >
          {/* Pulso viajando por la línea */}
          {visible && (
            <animate attributeName="stroke-dashoffset"
              from="100" to="0" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          )}
        </motion.line>
      ))}
    </svg>
  );
}

/* ── Tarjeta de miembro ──────────────────────────── */
function MemberCard({ member, index, visible }: { member: typeof TEAM[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative z-10 group cursor-default"
    >
      <motion.div
        animate={hovered ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${hovered ? member.color + "60" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered ? `0 20px 48px ${member.glow}, 0 0 0 1px ${member.color}25` : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Barra superior de color */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${member.color}, transparent)` }}
          animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
        />

        {/* Node ID badge */}
        <div className="flex justify-between items-start mb-5">
          <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded"
            style={{ background: `${member.color}15`, color: member.color }}>
            {member.nodeId}
          </span>
          {/* Indicador ACTIVE */}
          <span className="flex items-center gap-1.5 text-[10px] text-white/40">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: member.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            ONLINE
          </span>
        </div>

        {/* Avatar + anillo */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <Avatar member={member} size={96} />
            <PulseRing color={member.color} glow={member.glow} active={hovered} />
          </div>
        </div>

        {/* Nombre y rol */}
        <div className="text-center mb-4">
          <h3 className="text-white font-black text-xl tracking-tight">{member.name}</h3>
          <p className="font-bold text-sm mt-0.5" style={{ color: member.color }}>{member.role}</p>
          <p className="text-white/40 text-xs mt-0.5">{member.area}</p>
        </div>

        {/* Separador neural */}
        <div className="h-px mb-4"
          style={{ background: `linear-gradient(90deg, transparent, ${member.color}50, transparent)` }} />

        {/* Tags de habilidades */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {member.tags.map((tag) => (
            <span key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${member.color}14`, color: member.color }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Fondo glow al hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: `radial-gradient(circle at 50% 0%, ${member.color}08, transparent 70%)` }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Sección principal ───────────────────────────── */
export default function TeamSection() {
  const { ref, visible } = useReveal(0.1);
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section id="equipo" className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #05041A 0%, #0d0c26 100%)" }}
    >
      {/* Glow de fondo */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(107,78,255,0.05), transparent)" }} />

      <div className="max-w-4xl mx-auto px-4" ref={ref}>

        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#8e86ff] text-xs font-bold uppercase tracking-[0.15em] mb-2">Equipo</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Los nodos de <span className="bg-gradient-to-r from-[#8e86ff] to-[#FFB347] bg-clip-text text-transparent">NEUSI</span>
          </h2>
          <p className="text-white/45 text-sm max-w-md mx-auto">
            Cada persona es un nodo en nuestra red. Juntos formamos la inteligencia del hogar.
          </p>
        </motion.div>

        {/* Grid de tarjetas + líneas SVG */}
        <div ref={gridRef} className="relative">
          {/* Líneas de conexión neural (solo desktop) */}
          <div className="absolute inset-0 hidden md:block">
            <NeuralConnections visible={visible} />
          </div>

          {/* Grid 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TEAM.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} visible={visible} />
            ))}
          </div>
        </div>

        {/* Nota de fotos */}
        <motion.p
          initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center text-white/20 text-xs mt-10"
        >
          ✦ Coloca las fotos en{" "}
          <code className="text-[#8e86ff]/60 bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
            /public/team/daniel.jpg
          </code>{" "}
          et al. para reemplazar los avatares.
        </motion.p>
      </div>
    </section>
  );
}
