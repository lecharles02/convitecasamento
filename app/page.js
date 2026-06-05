'use client';
import { useState } from 'react';
import { ToastProvider } from '@/components/ToastProvider';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import VenueSection from '@/components/VenueSection';
import DressCodeSection from '@/components/DressCodeSection';
import Footer from '@/components/Footer';
import RsvpView from '@/components/RsvpView';
import GiftView from '@/components/GiftView';
import AdminLoginModal from '@/components/AdminLoginModal';
import AdminView from '@/components/AdminView';

export default function Home() {
  const [view, setView] = useState('main'); // 'main' | 'rsvp' | 'gift' | 'admin'
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <ToastProvider>
      {/* Main View */}
      {view === 'main' && (
        <div className="mobile-container bg-paper-texture pb-8">
          <HeroSection
            onOpenRsvp={() => setView('rsvp')}
            onOpenGift={() => setView('gift')}
          />
          <Countdown />
          <VenueSection />
          <DressCodeSection />

          {/* Gift Call-to-action */}
          <section className="py-14 px-8 text-center border-t border-[#B65B46]/10 relative bg-white/40">
            <i className="fa-solid fa-gift text-3xl text-[#B65B46] mb-5" />
            <h2 className="font-serif text-3xl text-[#4A3B32] mb-3 italic">Lista de Presentes</h2>
            <p className="text-[11px] text-[#4A3B32]/80 leading-relaxed mb-6 max-w-[280px] mx-auto">
              Optamos por não fazer uma lista de presentes tradicional de loja. Como já moramos juntos,
              montamos uma lista virtual super especial com cotas e mimos para a nossa nova fase.
            </p>
            <button
              onClick={() => setView('gift')}
              className="w-full max-w-[250px] bg-[#B65B46] text-white uppercase tracking-[0.2em] text-[10px] font-bold py-4 px-6 rounded-full shadow-lg hover:bg-[#D48C79] transition-all duration-300 mx-auto block"
            >
              Ver Lista de Presentes
            </button>
          </section>

          <Footer onOpenAdmin={() => setShowAdminLogin(true)} />
        </div>
      )}

      {/* RSVP View */}
      {view === 'rsvp' && (
        <RsvpView onClose={() => setView('main')} />
      )}

      {/* Gift View */}
      {view === 'gift' && (
        <GiftView onClose={() => setView('main')} />
      )}

      {/* Admin View */}
      {view === 'admin' && (
        <AdminView onClose={() => setView('main')} />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => { setShowAdminLogin(false); setView('admin'); }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </ToastProvider>
  );
}
