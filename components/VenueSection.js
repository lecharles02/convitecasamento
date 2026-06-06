export default function VenueSection() {
  return (
    <section className="py-10 px-6 relative">
      <div className="flex flex-col gap-12 relative z-10">

        {/* Igreja */}
        <div className="bg-[#FAF6F0] rounded-t-[140px] rounded-b-[40px] p-2 shadow-[0_18px_40px_rgba(74,59,50,0.12),_0_6px_18px_rgba(0,0,0,0.06)] border border-[#E9A088]/35 text-center relative mx-1 mt-6">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#D48C79]/50 shadow-sm z-20">
            <i className="fa-solid fa-church text-[#D48C79] text-xl" />
          </div>
          <div className="border border-dashed border-[#D48C79]/50 rounded-t-[130px] rounded-b-[32px] p-6 pt-10 h-full flex flex-col items-center w-full relative bg-white">
            <h3 className="font-serif text-3xl text-[#4A3B32] mb-3 italic">Cerimônia</h3>
            <svg width="60" height="10" viewBox="0 0 160 40" className="mx-auto mb-6 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M80 16C78 12 73 10 68 12C63 14 62 19 64 23C66 27 71 29 76 27C81 25 82 20 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C82 12 87 10 92 12C97 14 98 19 96 23C94 27 89 29 84 27C79 25 78 20 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C78 20 73 22 68 20C63 18 62 13 64 9C66 5 71 3 76 5C81 7 82 12 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C82 20 87 22 92 20C97 18 98 13 96 9C94 5 89 3 84 5C79 7 78 12 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <circle cx="80" cy="16" r="3" fill="#D48C79"/>
              <path d="M20 16 Q50 16 76 16" stroke="#D48C79" strokeWidth="1" fill="none"/>
              <path d="M140 16 Q110 16 84 16" stroke="#D48C79" strokeWidth="1" fill="none"/>
            </svg>
            <p className="font-bold text-sm text-[#4A3B32] tracking-[0.15em] uppercase">Basílica de N. Sra. da Penha</p>

            <div className="w-full mt-5 mb-4 rounded-2xl overflow-hidden border border-[#E9A088]/25 bg-stone-50 relative group shadow-[0_12px_28px_rgba(74,59,50,0.22),_0_5px_10px_rgba(0,0,0,0.08)] hover:translate-y-[-3px] hover:shadow-[0_20px_38px_rgba(74,59,50,0.32)] transition-all duration-300">
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10 border border-[#D48C79]/20">
                <span className="text-xs uppercase tracking-wider text-[#4A3B32] font-bold">Ver no Maps</span>
              </div>
              <iframe
                src="https://maps.google.com/maps?q=Bas%C3%ADlica+de+Nossa+Senhora+da+Penha,+Largo+da+Penha,+19&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="140"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] contrast-[95%] opacity-90 transition-opacity group-hover:opacity-100 object-cover"
              />
            </div>

            <p className="text-xs text-[#4A3B32]/75 leading-relaxed uppercase tracking-widest px-2">
              Largo da Penha, 19 - Penha, RJ
            </p>

            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-2 mb-4 max-w-[240px]">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider leading-relaxed text-center">
                <i className="fa-solid fa-square-parking mr-1" /> Estacionamento gratuito na igreja
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Basílica+de+Nossa+Senhora+da+Penha,+Largo+da+Penha,+19"
              target="_blank"
              rel="noreferrer"
              className="btn-premium-rsvp w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
            >
              <i className="fa-solid fa-location-arrow text-[#FAF6F0]/90" />
              <span>Abrir no GPS</span>
            </a>
          </div>
        </div>

        {/* Festa */}
        <div className="bg-[#FAF6F0] rounded-t-[140px] rounded-b-[40px] p-2 shadow-[0_18px_40px_rgba(74,59,50,0.12),_0_6px_18px_rgba(0,0,0,0.06)] border border-[#E9A088]/35 text-center relative mx-1 mt-6">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#D48C79]/50 shadow-sm z-20">
            <i className="fa-solid fa-champagne-glasses text-[#D48C79] text-xl" />
          </div>
          <div className="border border-dashed border-[#D48C79]/50 rounded-t-[130px] rounded-b-[32px] p-6 pt-10 h-full flex flex-col items-center w-full relative bg-white">
            <h3 className="font-serif text-3xl text-[#4A3B32] mb-3 italic">Recepção</h3>
            <svg width="60" height="10" viewBox="0 0 160 40" className="mx-auto mb-4 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M80 16C78 12 73 10 68 12C63 14 62 19 64 23C66 27 71 29 76 27C81 25 82 20 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C82 12 87 10 92 12C97 14 98 19 96 23C94 27 89 29 84 27C79 25 78 20 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C78 20 73 22 68 20C63 18 62 13 64 9C66 5 71 3 76 5C81 7 82 12 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <path d="M80 16C82 20 87 22 92 20C97 18 98 13 96 9C94 5 89 3 84 5C79 7 78 12 80 16Z" fill="#D48C79" fillOpacity="0.8"/>
              <circle cx="80" cy="16" r="3" fill="#D48C79"/>
              <path d="M20 16 Q50 16 76 16" stroke="#D48C79" strokeWidth="1" fill="none"/>
              <path d="M140 16 Q110 16 84 16" stroke="#D48C79" strokeWidth="1" fill="none"/>
            </svg>

            <div className="bg-[#B65B46]/5 rounded-xl px-4 py-2 mb-4 border border-[#B65B46]/10 max-w-[240px]">
              <p className="text-xs text-[#B65B46] font-semibold uppercase tracking-wider leading-relaxed">
                <i className="fa-solid fa-location-dot mr-1" /> Após a cerimônia,<br />bem pertinho da igreja!
              </p>
            </div>

            <p className="font-bold text-sm text-[#4A3B32] tracking-[0.15em] uppercase">Espaço Encaza</p>

            <div className="w-full mt-4 mb-4 rounded-2xl overflow-hidden border border-[#E9A088]/25 bg-stone-50 relative group shadow-[0_12px_28px_rgba(74,59,50,0.22),_0_5px_10px_rgba(0,0,0,0.08)] hover:translate-y-[-3px] hover:shadow-[0_20px_38px_rgba(74,59,50,0.32)] transition-all duration-300">
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10 border border-[#D48C79]/20">
                <span className="text-xs uppercase tracking-wider text-[#4A3B32] font-bold">Ver no Maps</span>
              </div>
              <iframe
                src="https://maps.google.com/maps?q=Rua+Tom%C3%A1s+Ribeiro,+15+Penha+Rio+de+Janeiro&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="140"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] contrast-[95%] opacity-90 transition-opacity group-hover:opacity-100 object-cover"
              />
            </div>

            <p className="text-xs text-[#4A3B32]/75 leading-relaxed mb-6 uppercase tracking-widest px-2">
              Rua Tomás Ribeiro, 15 - Penha, RJ
            </p>
            <a
              href="https://maps.google.com/?q=Rua+Tomás+Ribeiro,+15+Penha+Rio+de+Janeiro"
              target="_blank"
              rel="noreferrer"
              className="btn-premium-rsvp w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
            >
              <i className="fa-solid fa-location-arrow text-[#FAF6F0]/90" />
              <span>Abrir no GPS</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-16 opacity-40">
        <div className="w-12 h-px bg-[#4A3B32]" />
        <div className="w-2 h-2 rotate-45 border border-[#4A3B32]" />
        <div className="w-12 h-px bg-[#4A3B32]" />
      </div>
    </section>
  );
}
