'use client';
import { useEffect, useState } from 'react';

const Unit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-5xl font-pt-serif font-light text-[#4A3B32] mb-1.5">{value}</span>
    <span className="text-xs uppercase tracking-[0.25em] text-[#4A3B32]/75 font-medium">{label}</span>
  </div>
);

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const target = new Date('Aug 23, 2026 16:00:00').getTime();
    const tick = () => {
      const distance = target - Date.now();
      if (distance <= 0) return;
      setTimeLeft({
        days:    String(Math.floor(distance / 86400000)).padStart(2, '0'),
        hours:   String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0'),
        minutes: String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0'),
        seconds: String(Math.floor((distance % 60000) / 1000)).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 px-6 relative flex flex-col items-center">
      <h2 className="font-script text-[42px] text-center text-[#B65B46] mb-3">Contagem Regressiva</h2>
      
      {/* Floral Leaf Divider */}
      <div className="flex items-center justify-center mb-6 w-full max-w-[160px] mx-auto">
        <div className="flex-1 h-[0.5px] bg-[#D48C79]/30" />
        <svg width="70" height="18" viewBox="0 0 100 24" className="mx-1.5 opacity-55" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Center dot */}
          <circle cx="50" cy="12" r="1.5" fill="#D48C79" />
          
          {/* Left Branch */}
          <path d="M46 12 C36 12 26 8 16 10" stroke="#D48C79" strokeWidth="1" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M38 11.5 C36 8, 32 7, 29 9 C32 10.5, 36 11, 38 11.5 Z" fill="#D48C79" />
          <path d="M28 10 C26 6.5, 22 5.5, 19 7.5 C22 9, 26 9.5, 28 10 Z" fill="#D48C79" />
          <path d="M18 9.5 C16 6, 12 5, 9 7 C12 8.5, 16 9, 18 9.5 Z" fill="#D48C79" />
          {/* Under leaves */}
          <path d="M35 12.5 C33 16, 29 17, 26 15 C29 13.5, 33 13, 35 12.5 Z" fill="#D48C79" />
          <path d="M25 11.5 C23 15, 19 16, 16 14 C19 12.5, 23 12, 25 11.5 Z" fill="#D48C79" />

          {/* Right Branch */}
          <path d="M54 12 C64 12 74 8 84 10" stroke="#D48C79" strokeWidth="1" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M62 11.5 C64 8, 68 7, 71 9 C68 10.5, 64 11, 62 11.5 Z" fill="#D48C79" />
          <path d="M72 10 C74 6.5, 78 5.5, 81 7.5 C78 9, 74 9.5, 72 10 Z" fill="#D48C79" />
          <path d="M82 9.5 C84 6, 88 5, 91 7 C88 8.5, 84 9, 82 9.5 Z" fill="#D48C79" />
          {/* Under leaves */}
          <path d="M65 12.5 C67 16, 71 17, 74 15 C71 13.5, 67 13, 65 12.5 Z" fill="#D48C79" />
          <path d="M75 11.5 C77 15, 81 16, 84 14 C81 12.5, 77 12, 75 11.5 Z" fill="#D48C79" />
        </svg>
        <div className="flex-1 h-[0.5px] bg-[#D48C79]/30" />
      </div>

      <div className="flex justify-center gap-4 max-w-[320px] mx-auto">
        <Unit value={timeLeft.days}    label="Dias" />
        <div className="text-3xl text-[#4A3B32]/30 font-light mt-1.5">:</div>
        <Unit value={timeLeft.hours}   label="Hrs" />
        <div className="text-3xl text-[#4A3B32]/30 font-light mt-1.5">:</div>
        <Unit value={timeLeft.minutes} label="Min" />
        <div className="text-3xl text-[#4A3B32]/30 font-light mt-1.5">:</div>
        <Unit value={timeLeft.seconds} label="Seg" />
      </div>

      <div className="flex items-center justify-center gap-3 mt-14">
        <div className="w-16 h-[0.5px] bg-[#D48C79]/30" />
        <i className="fa-regular fa-heart text-[#D48C79]/60 text-[9px]" />
        <div className="w-16 h-[0.5px] bg-[#D48C79]/30" />
      </div>
    </section>
  );
}
