export default function DressCodeSection() {
  return (
    <section className="py-12 px-8 text-center relative">
      <i className="fa-solid fa-user-tie text-2xl text-[#B65B46] mb-5" />
      <h3 className="font-serif text-2xl text-[#4A3B32] mb-3 italic">Vestimenta</h3>
      <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#4A3B32] mb-4">Traje Esporte Fino</p>
      <p className="text-[11px] text-[#4A3B32]/80 leading-relaxed max-w-[280px] mx-auto mb-6">
        Sugerimos o traje esporte fino para o nosso grande dia.
        Pedimos gentilmente que evitem as cores abaixo, que são exclusivas da noiva.
      </p>
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10" />
            <div className="w-14 h-0.5 bg-red-500 rotate-45 absolute opacity-80" />
          </div>
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#4A3B32]/60">Branco</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#F5F2EC] border border-stone-200 shadow-sm flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10" />
            <div className="w-14 h-0.5 bg-red-500 rotate-45 absolute opacity-80" />
          </div>
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#4A3B32]/60">Off-white</span>
        </div>
      </div>
    </section>
  );
}
