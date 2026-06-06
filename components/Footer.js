export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="py-16 px-8 text-center bg-[#4A3B32] text-[#FAF6F0] relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <span className="font-script text-[180px] leading-none">DL</span>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="font-serif italic text-base mb-4 text-[#FAF6F0]/90 leading-relaxed max-w-[250px]">
          "Acima de tudo, porém, revistam-se do amor, que é o elo perfeito."
        </p>
        <span className="uppercase tracking-[0.3em] text-xs font-semibold text-[#D48C79]">
          Colossenses 3:14
        </span>

        <div className="mt-10 w-12 h-px bg-[#D48C79]/20" />

        <p className="mt-6 text-[11px] tracking-[0.3em] text-[#FAF6F0]/50 uppercase mb-6">
          Danielly e Leonardo • 2026
        </p>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FAF6F0]/40 hover:text-[#FAF6F0] transition-colors py-2.5 px-4 rounded-lg hover:bg-white/5"
        >
          <i className="fa-solid fa-lock" /> Área dos Noivos
        </button>
      </div>
    </footer>
  );
}
