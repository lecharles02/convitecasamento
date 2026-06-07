'use client';

import Image from 'next/image';

export default function HeroSection({ onOpenRsvp, onOpenGift }) {
  return (
    <header className="relative w-full h-[100vh] h-[100dvh] flex flex-col items-center justify-between pb-6 pt-0 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ backgroundImage: 'url(/background.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-black/30 to-black/85 z-10" />
      {/* Gold Gradient Frame */}
      <div className="absolute inset-4 z-20 pointer-events-none">
        <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            rx="16" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="0.6"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E7C4" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#C5A059" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FDF0CD" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#D4AF37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A37E3E" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-30 flex flex-col items-center justify-between w-full px-6 h-full py-8">
        {/* Top: bênção */}
        <p className="text-white/95 text-xs tracking-[0.35em] uppercase font-light text-center leading-relaxed">
          Com a bênção de Deus<br />
          e de nossos pais
        </p>

        {/* Center: names + date */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-white font-script text-[4.5rem] leading-[0.8] text-floating-shadow mb-4">
            Danielly<br />
            <span className="text-2xl text-white font-serif italic inline-block my-1">&</span><br />
            Leonardo
          </h1>

          <p className="text-white/80 text-xs uppercase tracking-widest font-light mb-5 text-center max-w-[280px] leading-relaxed drop-shadow-md">
            Têm a alegria de convidar para celebrar a cerimônia de seu casamento
          </p>

          <div className="bg-black/22 backdrop-blur-md border border-white/12 rounded-2xl px-6 py-3 flex flex-col items-center gap-2 w-full max-w-[280px] shadow-lg">
            <div className="flex items-center gap-3 text-white text-base tracking-[0.2em] font-light drop-shadow-sm">
              <span className="font-pt-serif">23</span>
              <span className="text-[#B65B46] text-sm font-serif">•</span>
              <span className="font-serif">Agosto</span>
              <span className="text-[#B65B46] text-sm font-serif">•</span>
              <span className="font-pt-serif">2026</span>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div className="uppercase tracking-[0.25em] text-xs text-[#D48C79] font-semibold drop-shadow-sm flex items-center justify-center gap-1.5">
              <i className="fa-regular fa-clock text-xs" /> Domingo • às 16h00
            </div>
          </div>
        </div>

        {/* Bottom: buttons */}
        <div className="flex flex-col gap-3 w-full max-w-[300px]">
          <button
            onClick={onOpenRsvp}
            className="btn-premium-rsvp w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
          >
            <i className="fa-solid fa-envelope text-base text-[#FAF6F0]/90" />
            <span>Confirmar Presença</span>
          </button>
          <button
            onClick={onOpenGift}
            className="btn-premium-gift w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
          >
            <i className="fa-solid fa-gift text-base text-[#FAF6F0]/90" />
            <span>Lista de Presentes</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 z-30 animate-bounce">
        <i className="fa-solid fa-chevron-down text-white/50 text-sm" />
      </div>
    </header>
  );
}
