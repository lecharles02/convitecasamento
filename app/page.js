'use client';
import { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ToastProvider';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import VenueSection from '@/components/VenueSection';
import DressCodeSection from '@/components/DressCodeSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const RsvpView = dynamic(() => import('@/components/RsvpView'), { ssr: false });
const GiftView = dynamic(() => import('@/components/GiftView'), { ssr: false });
const AdminView = dynamic(() => import('@/components/AdminView'), { ssr: false });
const AdminLoginModal = dynamic(() => import('@/components/AdminLoginModal'), { ssr: false });

export default function Home() {
  const [view, setView] = useState('main'); // 'main' | 'rsvp' | 'gift' | 'admin'
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Helper to navigate and update hash
  const navigateTo = (newView) => {
    if (typeof window === 'undefined') return;
    if (newView === 'rsvp') {
      window.location.hash = '#rsvp';
    } else if (newView === 'gift') {
      window.location.hash = '#presentes';
    } else if (newView === 'admin') {
      window.location.hash = '#admin';
    } else if (newView === 'admin-login') {
      window.location.hash = '#noivos';
    } else {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
      setView('main');
      setShowAdminLogin(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      
      if (hash !== '#noivos') {
        setShowAdminLogin(false);
      }

      if (params.get('admin') === 'true' || hash === '#admin') {
        setView('admin');
      } else if (hash === '#rsvp') {
        setView('rsvp');
      } else if (hash === '#presentes') {
        setView('gift');
      } else if (hash === '#noivos') {
        setShowAdminLogin(true);
      } else {
        setView('main');
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ToastProvider>
      {/* Main View */}
      {view === 'main' && (
        <div className="mobile-container bg-paper-texture pb-8">
          <HeroSection
            onOpenRsvp={() => navigateTo('rsvp')}
            onOpenGift={() => navigateTo('gift')}
          />
          <Countdown />
          <VenueSection />
          <DressCodeSection />

          {/* Gift Call-to-action */}
          <section className="py-14 px-8 text-center border-t border-[#B65B46]/10 relative bg-white/40 flex flex-col items-center">
            {/* Enlarged Clean Gift Logo */}
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 select-none">
              <circle cx="48" cy="48" r="38" stroke="#C5A059" strokeWidth="1.2" fill="#FAF6F0"/>
              <g transform="translate(31, 28)">
                <path d="M 17 6 C 14.5 1, 9.5 1, 13 7.5 C 14.5 9, 17 10, 17 10" stroke="#B65B46" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M 17 6 C 19.5 1, 24.5 1, 21 7.5 C 19.5 9, 17 10, 17 10" stroke="#B65B46" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="2" y="10" width="30" height="6" rx="1.8" fill="#B65B46"/>
                <path d="M 5 17 L 5 31 C 5 33.5 7 34 9 34 L 25 34 C 27 34 29 33.5 29 31 L 29 17 Z" fill="#B65B46"/>
                <line x1="17" y1="10" x2="17" y2="34" stroke="#FAF6F0" strokeWidth="2"/>
                <line x1="5" y1="24" x2="29" y2="24" stroke="#FAF6F0" strokeWidth="1.5"/>
              </g>
            </svg>

            <h1 className="font-serif text-3xl text-[#4A3B32] mb-1.5 italic tracking-wide">Lista de Presentes</h1>
            <h2 className="uppercase tracking-[0.22em] text-xs font-bold text-[#B65B46] mb-3">
              SUA PRESENÇA É O NOSSO MAIOR PRESENTE!
            </h2>

            {/* Heart Divider */}
            <div className="flex items-center justify-center gap-3 mb-6 opacity-60">
              <div className="w-10 h-px bg-[#C5A059]/50" />
              <i className="fa-solid fa-heart text-[6px] text-[#C5A059]" />
              <div className="w-10 h-px bg-[#C5A059]/50" />
            </div>
            <p className="text-sm text-[#4A3B32]/80 leading-relaxed mb-6 max-w-[280px] mx-auto">
              Para evitar presentes que já temos em nossa casa, separamos algumas sugestões para aqueles que desejarem nos presentear. Com a nossa mudança, precisamos apenas de alguns itens pontuais para o novo lar.
            </p>
            <button
              onClick={() => navigateTo('gift')}
              className="w-full max-w-[250px] bg-[#B65B46] text-white uppercase tracking-[0.2em] text-xs font-bold py-4 px-6 rounded-full shadow-lg hover:bg-[#D48C79] transition-all duration-300 mx-auto block"
            >
              Ver Lista de Presentes
            </button>
          </section>

          <Footer onOpenAdmin={() => navigateTo('admin-login')} />
        </div>
      )}

      {/* RSVP View */}
      {view === 'rsvp' && (
        <RsvpView onClose={() => navigateTo('main')} onOpenGifts={() => navigateTo('gift')} />
      )}

      {/* Gift View */}
      {view === 'gift' && (
        <GiftView onClose={() => navigateTo('main')} />
      )}

      {/* Admin View */}
      {view === 'admin' && (
        <AdminView onClose={() => navigateTo('main')} />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => navigateTo('admin')}
          onClose={() => navigateTo('main')}
        />
      )}
    </ToastProvider>
  );
}
