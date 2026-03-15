export default function FooterSection() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 text-center"
      style={{ background: "linear-gradient(180deg, #05041A, #03020F)" }}
    >
      <p className="font-black text-lg mb-1">
        <span className="text-[#8e86ff]">NEU</span>
        <span className="text-[#FFB347]">SI</span>
        <span className="text-white/40 font-normal text-sm ml-2">Solutions</span>
      </p>
      <p className="text-white/25 text-xs mt-1 mb-4">
        <span className="text-[#8e86ff]/60">NEU</span> neural · inteligencia&nbsp;&nbsp;✦&nbsp;&nbsp;
        <span className="text-[#FFB347]/60">WASI</span> hogar en quechua
      </p>
      <div className="flex justify-center gap-6 text-xs text-white/30 mb-4">
        <a href="/privacidad/" className="hover:text-white/60 transition">Privacidad</a>
        <a href="/terminos/"   className="hover:text-white/60 transition">Términos</a>
        <a href="#contacto" onClick={(e) => { e.preventDefault(); document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }); }}
          className="hover:text-white/60 transition">Contacto</a>
      </div>
      <p className="text-white/18 text-xs">© {year} NEUSI Solutions. Todos los derechos reservados.</p>
    </footer>
  );
}
