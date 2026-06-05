'use client';
import { useEffect, useState } from 'react';

export default function HeroSection({ onOpenRsvp, onOpenGift }) {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = 'https://iili.io/CK4MAZB.jpg';
  }, []);

  return (
    <header className="relative w-full h-[100vh] h-[100dvh] flex flex-col items-center justify-between pb-12 pt-10 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 z-0"
        style={{
          backgroundImage: bgLoaded ? "url('https://iili.io/CK4MAZB.jpg')" : 'none',
          opacity: bgLoaded ? 1 : 0,
        }}
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

      <div className="relative z-30 flex flex-col items-center justify-center w-full px-6 h-full mt-1 fade-in">
        <div className="flex flex-col items-center justify-center mb-10">
          <p className="text-white/95 text-[11px] tracking-[0.35em] uppercase font-light text-center leading-relaxed max-w-[320px] drop-shadow-md">
            Com a bênção de Deus<br />
            e de seus pais
          </p>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-white font-script text-[5.25rem] leading-[0.75] text-floating-shadow">
            Danielly<br />
            <span className="text-3xl text-white font-serif italic inline-block my-2 drop-shadow-sm">&</span><br />
            Leonardo
          </h1>
        </div>

        <p className="text-white/80 text-[10px] uppercase tracking-widest font-light mb-8 text-center max-w-[260px] leading-relaxed drop-shadow-md">
          Têm a alegria de convidar para celebrar a cerimônia de seu casamento
        </p>

        <div className="w-px h-10 bg-gradient-to-b from-[#B65B46]/0 via-[#B65B46] to-[#B65B46]/0 mb-6" />

        <div className="bg-black/22 backdrop-blur-md border border-white/12 rounded-2xl px-6 py-3.5 flex flex-col items-center gap-2 mb-10 w-full max-w-[280px] shadow-lg">
          <div className="flex items-center gap-3 text-white text-base tracking-[0.2em] font-light drop-shadow-sm">
            <span className="font-pt-serif">23</span>
            <span className="text-[#B65B46] text-sm font-serif">•</span>
            <span className="font-serif">Agosto</span>
            <span className="text-[#B65B46] text-sm font-serif">•</span>
            <span className="font-pt-serif">2026</span>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="uppercase tracking-[0.25em] text-[10px] text-[#D48C79] font-semibold drop-shadow-sm flex items-center justify-center gap-1.5">
            <i className="fa-regular fa-clock text-[9px]" /> Domingo • às 16h00
          </div>
        </div>

        <div className="flex flex-col gap-3.5 w-full max-w-[300px] mt-auto">
          <button
            onClick={onOpenRsvp}
            className="btn-premium-rsvp w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-[11px] font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
          >
            <i className="fa-solid fa-envelope text-base text-[#FAF6F0]/90" />
            <span>Confirmar Presença</span>
          </button>
          <button
            onClick={onOpenGift}
            className="btn-premium-gift w-full text-[#FAF6F0] uppercase tracking-[0.22em] text-[11px] font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-3 cursor-pointer"
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
