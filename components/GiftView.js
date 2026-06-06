'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

// ─── SAFE IMAGE WITH ICON FALLBACK ──────────────────────────────────────────
const SafeImage = React.memo(({ src, alt, icon, className, iconColor = 'text-[#B65B46]/60', iconSize = 'text-2xl' }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-stone-100/50 w-full h-full">
        <i className={`fa-solid ${icon} ${iconColor} ${iconSize}`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
});
SafeImage.displayName = 'SafeImage';

// ─── PHYSICAL ITEMS ──────────────────────────────────────────────────────────
const PHYSICAL_ITEMS = [
  { id: 'torradeira',       name: 'Torradeira / Misto Quente',       icon: 'fa-bread-slice',    image: '/gifts/torradeira.png' },
  { id: 'forno-eletrico',   name: 'Forno Elétrico',                  icon: 'fa-fire-burner',    image: '/gifts/forno-eletrico.png' },
  { id: 'cafeteira',        name: 'Cafeteira',                       icon: 'fa-mug-hot',        image: '/gifts/cafeteira.png' },
  { id: 'panela-eletrica',  name: 'Panela Elétrica',                 icon: 'fa-bowl-food',      image: '/gifts/panela-eletrica.png' },
  { id: 'frigideira',       name: 'Frigideira Antiaderente',         icon: 'fa-kitchen-set',    image: '/gifts/frigideira.png' },
  { id: 'potes-hermeticos', name: 'Conjunto de Potes Herméticos',    icon: 'fa-boxes-stacked',  image: '/gifts/potes-hermeticos.png' },
  { id: 'porta-condimento', name: 'Porta Condimento Giratório',      icon: 'fa-arrows-spin',    image: '/gifts/porta-condimento.png' },
  { id: 'robo-aspirador',   name: 'Robô Aspirador',                  icon: 'fa-robot',          image: '/gifts/robo-aspirador.png' },
  { id: 'jogo-cama',        name: 'Jogo de Cama (King)',             icon: 'fa-bed',            image: '/gifts/jogo-cama.png' },
  { id: 'jogo-toalha',      name: 'Jogo de Toalha',                  icon: 'fa-shower',         image: '/gifts/jogo-toalha.png' },
  { id: 'manta-sofa',       name: 'Manta para Sofá',                 icon: 'fa-couch',          image: '/gifts/manta-sofa.png' },
  { id: 'abajour',          name: 'Abajour',                         icon: 'fa-lightbulb',      image: '/gifts/abajour.png' },
  { id: 'ventilador',       name: 'Ventilador de Chão',              icon: 'fa-fan',            image: '/gifts/ventilador.png' },
];

// ─── QUOTA ITEMS ─────────────────────────────────────────────────────────────
const QUOTA_ITEMS = [
  { id: 'geladeira',       name: 'Geladeira Nova',       icon: 'fa-snowflake',    price: 100, image: '/gifts/geladeira.png',     description: 'Ajude a refrigerar nosso novo lar com amor ❄️' },
  { id: 'guarda-roupa',    name: 'Guarda-Roupa',         icon: 'fa-shirt',        price: 100, image: '/gifts/guarda-roupa.png',   description: 'Para organizar tudo com estilo no novo apartamento 👗' },
  { id: 'armario-cozinha', name: 'Armário de Cozinha',   icon: 'fa-door-closed',  price: 100, image: '/gifts/armario-cozinha.png', description: 'Panelas, mantimentos e muita organização 🍳' },
];

// ─── FUN / SPECIAL ───────────────────────────────────────────────────────────
const FUN_ITEMS = [
  { id: 'buque-direto', name: 'Taxa do Buquê Direto em Você', icon: 'fa-hand-holding-heart', price: 80, image: '/gifts/buque-direto.png', description: 'Garanta que o buquê venha certinho na sua direção! 💐', multi: true },
];

// ─── HONEYMOON ───────────────────────────────────────────────────────────────
const HONEYMOON = {
  id: 'lua-de-mel',
  name: 'Ajuda para a Lua de Mel',
  icon: 'fa-plane',
  image: '/gifts/lua-de-mel.png',
  description: 'Qualquer valor nos ajuda a realizar esse sonho juntos ✈️💕',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(val) {
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
}

// ─── PHYSICAL CARD ───────────────────────────────────────────────────────────
const PhysicalCard = React.memo(({ item, claimedBy, onSelect }) => {
  const claimed = !!claimedBy;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        claimed
          ? 'bg-stone-100 border-stone-200 opacity-80'
          : 'bg-white border-[#B65B46]/10 hover:border-[#B65B46]/30 hover:shadow-md cursor-pointer'
      }`}
      onClick={() => !claimed && onSelect({ ...item, type: 'physical' })}
    >
      {/* Claimed overlay ribbon */}
      {claimed && (
        <div className="absolute top-3 right-3 z-10 bg-[#4A3B32] text-white text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <i className="fa-solid fa-check" />
          Escolhido
        </div>
      )}

      <div className="flex items-center gap-4 p-4">
        {/* Image / Icon */}
        <div className={`w-20 h-20 rounded-xl shrink-0 overflow-hidden border relative ${claimed ? 'border-stone-200 grayscale' : 'border-[#B65B46]/10'}`}>
          <SafeImage
            src={item.image}
            alt={item.name}
            icon={item.icon}
            className="w-full h-full object-cover"
            iconColor="text-[#B65B46]/60"
            iconSize="text-2xl"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm leading-tight mb-1.5 ${claimed ? 'text-stone-400 line-through' : 'text-[#4A3B32]'}`}>
            {item.name}
          </h4>
          {claimed ? (
            <p className="text-xs text-stone-400 font-semibold flex items-center gap-1">
              <i className="fa-solid fa-heart text-[10px]" />
              {claimedBy}
            </p>
          ) : (
            <p className="text-xs text-[#4A3B32]/60 font-medium">Disponível • Toque para presentear</p>
          )}
        </div>

        {/* CTA */}
        {!claimed && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect({ ...item, type: 'physical' }); }}
            className="w-9 h-9 bg-[#4A3B32] text-white rounded-full flex items-center justify-center hover:bg-[#B65B46] transition-colors shrink-0 shadow-sm"
          >
            <i className="fa-solid fa-gift text-sm" />
          </button>
        )}
      </div>
    </div>
  );
});
PhysicalCard.displayName = 'PhysicalCard';

// ─── QUOTA CARD ──────────────────────────────────────────────────────────────
const QuotaCard = React.memo(({ item, quotasBought, onSelect }) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#B65B46]/10 bg-white hover:border-[#B65B46]/30 hover:shadow-md transition-all duration-300">
      {/* Top image strip */}
      <div className="relative h-28 overflow-hidden">
        <SafeImage
          src={item.image}
          alt={item.name}
          icon={item.icon}
          className="w-full h-full object-cover"
          iconColor="text-[#B65B46]"
          iconSize="text-4xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      <div className="p-5">
          <h4 className="font-bold text-[#4A3B32] text-sm mb-1">{item.name}</h4>
          <p className="text-xs text-[#4A3B32]/60 mb-4 leading-relaxed">{item.description}</p>
  
          {quotasBought > 0 && (
            <p className="text-xs text-[#B65B46] font-bold mb-4 flex items-center gap-1">
              <i className="fa-solid fa-heart text-[10px]" />
              {quotasBought} {quotasBought === 1 ? 'pessoa contribuiu' : 'pessoas contribuíram'}
            </p>
          )}
  
          <button
            onClick={() => onSelect({ ...item, type: 'quota' })}
            className="w-full bg-[#B65B46] text-white uppercase tracking-widest text-xs font-bold py-4 rounded-xl hover:bg-[#D48C79] transition-colors shadow-sm"
          >
            Contribuir — {fmt(item.price)} por cota
          </button>
        </div>
    </div>
  );
});
QuotaCard.displayName = 'QuotaCard';

// ─── FUN CARD ────────────────────────────────────────────────────────────────
const FunCard = React.memo(({ item, count, onSelect }) => {
  return (
    <div
      className="bg-white rounded-2xl border border-[#C5A059]/20 overflow-hidden hover:border-[#C5A059]/50 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onSelect({ ...item, type: 'fun' })}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden border border-[#C5A059]/20 relative">
          <SafeImage
            src={item.image}
            alt={item.name}
            icon={item.icon}
            className="w-full h-full object-cover"
            iconColor="text-[#C5A059]"
            iconSize="text-xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#4A3B32] text-sm leading-tight mb-1">{item.name}</h4>
          <p className="text-xs text-[#4A3B32]/60 leading-normal mb-1.5">{item.description}</p>
          {count > 0 && (
            <span className="text-xs text-[#C5A059] font-bold flex items-center gap-1">
              <i className="fa-solid fa-users text-[10px]" />{count} {count === 1 ? 'pessoa participou' : 'pessoas participaram'}
            </span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[#B65B46] font-bold text-sm">{fmt(item.price)}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect({ ...item, type: 'fun' }); }}
            className="mt-1.5 bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold px-3.5 py-2 rounded-full hover:bg-[#B65B46] transition-colors cursor-pointer"
          >
            Quero!
          </button>
        </div>
      </div>
    </div>
  );
});
FunCard.displayName = 'FunCard';

// ─── HONEYMOON CARD ──────────────────────────────────────────────────────────
const HoneymoonCard = React.memo(({ collected, onSelect }) => {
  function handleClick() {
    onSelect({ ...HONEYMOON, type: 'honeymoon', isCustom: true, price: 0 });
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
      onClick={handleClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A3B32] via-[#7a5c4d] to-[#B65B46]" />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-4 right-4 text-white text-6xl">✈️</div>
        <div className="absolute bottom-4 left-4 text-white text-4xl">🌊</div>
      </div>

      <div className="relative p-6 flex flex-col items-center text-center text-white pointer-events-none">
        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
          <i className="fa-solid fa-plane text-2xl text-white" />
        </div>
        <h4 className="font-serif text-2xl italic mb-1.5">Lua de Mel</h4>
        <p className="text-xs text-white/90 leading-relaxed mb-5 max-w-[280px]">
          {HONEYMOON.description}
        </p>
        {collected > 0 && (
          <p className="text-xs text-white/70 mb-4 flex items-center gap-1.5">
            <i className="fa-solid fa-heart text-[10px]" />
            Já arrecadamos {fmt(collected)} para nossa viagem!
          </p>
        )}
        <div className="bg-white/20 backdrop-blur border border-white/30 text-white uppercase tracking-widest text-xs font-bold py-3.5 px-8 rounded-full hover:bg-white/30 transition-colors w-full max-w-[250px]">
          Contribuir com qualquer valor
        </div>
      </div>
    </div>
  );
});
HoneymoonCard.displayName = 'HoneymoonCard';

// ─── PAYMENT MODAL ───────────────────────────────────────────────────────────
function PaymentModal({ item, onClose, onSuccess }) {
  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [quotaQty, setQuotaQty] = useState(1);
  const [nameError, setNameError] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showPhysicalConfirm, setShowPhysicalConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const isCustom = item.isCustom || item.type === 'honeymoon';
  const isQuota = item.type === 'quota';
  const isPhysical = item.type === 'physical';

  const basePrice = isCustom
    ? parseFloat(customPrice) || 0
    : isQuota
    ? item.price * quotaQty
    : item.price;

  const isDirty = name || message || customPrice || quotaQty > 1;

  function handleClose() {
    if (isDirty && step !== 'success') {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  }

  function handleProceed() {
    if (!name.trim()) { setNameError(true); return; }
    if (isCustom) {
      const val = parseFloat(customPrice);
      if (isNaN(val) || val <= 0) { showToast('Insira um valor maior que R$ 0,00.'); return; }
    }
    setNameError(false);
    if (isPhysical) {
      setShowPhysicalConfirm(true);
    } else {
      setStep('payment');
    }
  }

  function copyPix() {
    navigator.clipboard.writeText('64587589000159')
      .then(() => showToast('Chave PIX copiada!', 'success'))
      .catch(() => showToast('Não foi possível copiar automaticamente.'));
  }

  async function handleFinalize() {
    setLoading(true);
    try {
      const payload = {
        gifter_name: name.trim(),
        item_name: isQuota ? `${item.name} (${quotaQty}x cota)` : item.name,
        price: basePrice,
        message: message.trim() || null,
      };
      const { error } = await supabase.from('gifts').insert([payload]);
      if (error) throw error;
      onSuccess(item);
      setStep('success');
    } catch {
      showToast('Erro ao registrar o presente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
      <div className="bg-[#FAF6F0] w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[92vh] shadow-2xl relative overflow-hidden">

        {/* Close Confirm */}
        {showCloseConfirm && (
          <div className="absolute inset-0 z-[70] bg-[#FAF6F0]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <i className="fa-solid fa-triangle-exclamation text-5xl text-[#B65B46] mb-4" />
            <h4 className="font-serif text-2xl text-[#4A3B32] mb-2.5 italic">Cancelar presente?</h4>
            <p className="text-xs sm:text-sm text-[#4A3B32]/85 mb-8 leading-relaxed max-w-[280px]">
              Você já preencheu alguns dados. Tem certeza que deseja fechar?
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowCloseConfirm(false)} className="flex-1 py-3.5 text-xs uppercase tracking-widest font-bold text-[#4A3B32] border border-[#4A3B32]/30 rounded-xl hover:bg-[#4A3B32]/5 transition-colors">Voltar</button>
              <button onClick={onClose} className="flex-1 py-3.5 text-xs uppercase tracking-widest font-bold bg-[#B65B46] text-white rounded-xl shadow-md hover:bg-[#D48C79] transition-colors">Sim, Fechar</button>
            </div>
          </div>
        )}

        {/* Physical Confirm Popup */}
        {showPhysicalConfirm && (
          <div className="absolute inset-0 z-[70] bg-[#FAF6F0]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-[#B65B46]/10 rounded-full flex items-center justify-center mx-auto text-[#B65B46] mb-4">
              <i className="fa-solid fa-gift text-2xl" />
            </div>
            <h4 className="font-serif text-2xl text-[#4A3B32] mb-2.5 italic">Confirmar Escolha?</h4>
            <p className="text-xs sm:text-sm text-[#4A3B32]/85 mb-8 leading-relaxed max-w-[280px] mx-auto">
              Ao confirmar, este item será **marcado como escolhido** e sairá da lista para outros convidados. Tem certeza?
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowPhysicalConfirm(false)} 
                className="flex-1 py-3.5 text-xs uppercase tracking-widest font-bold text-[#4A3B32] border border-[#4A3B32]/30 rounded-xl hover:bg-[#4A3B32]/5 transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  setShowPhysicalConfirm(false);
                  handleFinalize();
                }} 
                className="flex-1 py-3.5 text-xs uppercase tracking-widest font-bold bg-[#B65B46] text-white rounded-xl shadow-md hover:bg-[#D48C79] transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#B65B46]/10 shrink-0">
          <div>
            <h3 className="font-serif text-xl text-[#4A3B32] italic">Presentear</h3>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full text-[#4A3B32] hover:bg-black/10">
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Item summary */}
          <div className="bg-white border border-[#B65B46]/20 rounded-2xl p-4.5 mb-6 flex justify-between items-center shadow-sm">
            <div className="flex-1 min-w-0 pr-3">
              <span className="text-[11px] uppercase tracking-wider text-[#4A3B32]/60 font-bold block mb-1">Presente Selecionado</span>
              <span className="font-bold text-[#4A3B32] text-base leading-tight block">{item.name}</span>
              {isQuota && (
                <span className="text-xs text-[#4A3B32]/70 font-medium block mt-0.5">{quotaQty} cota{quotaQty > 1 ? 's' : ''}</span>
              )}
            </div>
            {!isPhysical && (
              <span className="text-[#B65B46] font-serif text-lg shrink-0 font-medium">
                {isCustom
                  ? (customPrice ? fmt(parseFloat(customPrice)) : 'A definir')
                  : fmt(basePrice)}
              </span>
            )}
          </div>

          {/* Quota quantity selector */}
          {isQuota && step === 'form' && (
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#4A3B32] mb-3 ml-1">
                Quantas cotas deseja contribuir?
              </label>
              <div className="flex items-center gap-3 bg-white border border-[#B65B46]/20 rounded-2xl p-3">
                <button
                  onClick={() => setQuotaQty(Math.max(1, quotaQty - 1))}
                  className="w-11 h-11 bg-[#B65B46]/10 rounded-xl flex items-center justify-center text-[#B65B46] hover:bg-[#B65B46]/20 transition-colors font-bold text-xl"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-[#4A3B32]">{quotaQty}</p>
                  <p className="text-xs text-[#4A3B32]/50 font-medium mt-0.5">{quotaQty === 1 ? 'cota' : 'cotas'} × {fmt(item.price)}</p>
                </div>
                <button
                  onClick={() => setQuotaQty(Math.min(20, quotaQty + 1))}
                  className="w-11 h-11 bg-[#B65B46]/10 rounded-xl flex items-center justify-center text-[#B65B46] hover:bg-[#B65B46]/20 transition-colors font-bold text-xl"
                >
                  +
                </button>
              </div>
              <p className="text-center text-xs text-[#4A3B32]/70 mt-2.5 font-medium">
                Total: <span className="font-bold text-[#B65B46]">{fmt(basePrice)}</span>
              </p>
            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <div>
              {isCustom && (
                <div className="mb-4.5">
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#4A3B32] mb-2 ml-1">Valor da Contribuição (R$) *</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="Ex: 200"
                    className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46]"
                  />
                </div>
              )}
              <div className="mb-4.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-[#4A3B32] mb-2 ml-1">Seu Nome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(false); }}
                  placeholder="Como devemos agradecer?"
                  className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46]"
                />
                {nameError && <p className="text-red-500 text-xs mt-1 ml-2 font-medium">Por favor, preencha seu nome.</p>}
              </div>
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider font-bold text-[#4A3B32] mb-2 ml-1">Mensagem aos Noivos (Opcional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Deixe um recadinho carinhoso..."
                  className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46] resize-none"
                />
              </div>
              <button
                onClick={handleProceed}
                disabled={loading}
                className="w-full bg-[#4A3B32] text-white uppercase tracking-wider text-xs font-bold py-4 rounded-xl shadow-md hover:bg-[#B65B46] transition-colors flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <span>{isPhysical ? 'Confirmar Presente' : 'Continuar'}</span>
                    {!isPhysical && <i className="fa-solid fa-arrow-right" />}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-center text-[#4A3B32]/85 leading-relaxed">
                Obrigado, <span className="font-bold">{name}</span>! Escolha como prefere nos presentear:
              </p>

              {/* PIX */}
              <div className="bg-white border-2 border-emerald-500/20 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-50" />
                <i className="fa-brands fa-pix text-3xl text-emerald-500 mb-2" />
                <h4 className="font-bold text-[#4A3B32] mb-1 text-sm">Chave PIX (CNPJ)</h4>
                <p className="text-xs text-[#4A3B32]/70 mb-4">Aponte a câmera do seu banco para o QR Code ou copie a chave.</p>
                <div className="w-44 h-44 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-200/80 p-2 shadow-sm">
                  <img src="/pix_qrcode.png" alt="QR Code PIX" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div className="bg-stone-100 rounded-2xl p-4 flex flex-col items-center gap-2.5 mb-4 border border-stone-200">
                  <span className="text-base font-mono font-bold text-[#4A3B32] tracking-wider select-all">64587589000159</span>
                  <button onClick={copyPix} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full max-w-[150px]">
                    Copiar Chave
                  </button>
                </div>
                <button onClick={handleFinalize} disabled={loading} className="w-full bg-emerald-600 text-white uppercase tracking-wider text-xs font-bold py-4 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors">
                  {loading ? 'Registrando...' : 'Confirmar Envio do Presente'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#B65B46]/20" />
                <span className="text-xs uppercase font-bold text-[#4A3B32]/40 tracking-wider">OU</span>
                <div className="flex-1 h-px bg-[#B65B46]/20" />
              </div>

              {/* Card */}
              <div className="bg-white border border-[#B65B46]/10 rounded-2xl p-5 text-center">
                <i className="fa-regular fa-credit-card text-xl text-[#B65B46] mb-2" />
                <h4 className="font-bold text-[#4A3B32] text-sm mb-2">Cartão de Crédito</h4>
                <button onClick={handleFinalize} disabled={loading} className="w-full border border-[#4A3B32] text-[#4A3B32] uppercase tracking-wider text-xs font-bold py-3.5 rounded-xl hover:bg-[#4A3B32] hover:text-white transition-colors mt-1">
                  {loading ? 'Registrando...' : 'Pagar com Cartão'}
                </button>
              </div>

              <button onClick={() => setStep('form')} className="text-xs text-[#4A3B32]/60 underline text-center font-medium">
                Voltar e alterar dados
              </button>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 bg-[#B65B46]/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <i className="fa-solid fa-heart text-3xl text-[#B65B46]" />
              </div>
              <h3 className="font-serif text-3xl text-[#4A3B32] mb-2.5">Muito Obrigado!</h3>
              <p className="text-sm sm:text-base text-[#4A3B32]/85 mb-8 leading-relaxed max-w-[280px]">
                {isPhysical
                  ? 'Você escolheu presentear com este item! Agradecemos de coração. 💕'
                  : 'Sua contribuição e mensagem foram enviadas para o painel dos noivos. Com muito amor! 💕'}
              </p>
              <button onClick={onClose} className="border border-[#4A3B32] text-[#4A3B32] uppercase tracking-wider text-xs font-bold py-3.5 px-8 rounded-full hover:bg-[#4A3B32] hover:text-white transition-colors">
                Voltar à Lista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── SECTION DIVIDER ─────────────────────────────────────────────────────────
const SectionDivider = React.memo(({ icon, label }) => {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-[#B65B46]/15" />
      <div className="flex items-center gap-2 text-[#B65B46]">
        <i className={`fa-solid ${icon} text-xs`} />
        <span className="font-serif italic text-base text-[#4A3B32]">{label}</span>
        <i className={`fa-solid ${icon} text-xs`} />
      </div>
      <div className="flex-1 h-px bg-[#B65B46]/15" />
    </div>
  );
});
SectionDivider.displayName = 'SectionDivider';

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function GiftView({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimedPhysical, setClaimedPhysical] = useState({}); // { itemId: 'Name' }
  const [quotaCollected, setQuotaCollected] = useState({}); // { itemId: amount }
  const [honeymoonCollected, setHoneymoonCollected] = useState(0);
  const [funCounts, setFunCounts] = useState({}); // { itemId: count }
  const [animationClass, setAnimationClass] = useState('slide-up-enter');

  // Handle device/browser back button for the payment modal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (selectedItem) {
        setSelectedItem(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedItem]);

  const handleSelectGift = (item) => {
    setSelectedItem(item);
    if (typeof window !== 'undefined') {
      window.history.pushState({ modalOpen: true }, '');
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    if (typeof window !== 'undefined' && window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  async function refreshData() {
    try {
      const { data } = await supabase.from('gifts').select('item_name, price, gifter_name');
      if (!data) return;

      const newClaimed = {};
      const newQuota = {};
      const newFun = {};
      let honeymoon = 0;

      for (const row of data) {
        const name = row.item_name || '';
        const price = parseFloat(row.price) || 0;

        // Physical items
        const physMatch = PHYSICAL_ITEMS.find(i => name.toLowerCase().includes(i.name.toLowerCase()) || name.toLowerCase().includes(i.id));
        if (physMatch && !name.includes('cota')) {
          newClaimed[physMatch.id] = row.gifter_name || 'Alguém especial';
        }

        // Quota items
        const quotaMatch = QUOTA_ITEMS.find(i => name.toLowerCase().includes(i.name.toLowerCase()) || name.toLowerCase().includes(i.id));
        if (quotaMatch) {
          newQuota[quotaMatch.id] = (newQuota[quotaMatch.id] || 0) + price;
        }

        // Honeymoon
        if (name.toLowerCase().includes('lua de mel') || name.toLowerCase().includes('honeymoon')) {
          honeymoon += price;
        }

        // Fun items
        const funMatch = FUN_ITEMS.find(i => name.toLowerCase().includes(i.name.toLowerCase()) || name.toLowerCase().includes(i.id));
        if (funMatch) {
          newFun[funMatch.id] = (newFun[funMatch.id] || 0) + 1;
        }
      }

      setClaimedPhysical(newClaimed);
      setQuotaCollected(newQuota);
      setHoneymoonCollected(honeymoon);
      setFunCounts(newFun);
    } catch (e) {
      // silently fail
    }
  }

  useEffect(() => {
    refreshData();
    window.scrollTo(0, 0);
  }, []);

  function handleSuccess(item) {
    refreshData();
  }

  return (
    <div
      className={`mobile-container bg-paper-texture fixed inset-0 z-50 overflow-y-auto ${animationClass}`}
      onAnimationEnd={() => setAnimationClass('')}
      ref={(el) => { if (el) el.scrollTop = 0; }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-md z-40 px-6 py-4 flex items-center border-b border-[#B65B46]/10">
        <button onClick={onClose} className="text-[#4A3B32] hover:text-[#B65B46] p-2 transition-colors">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h2 className="font-serif italic text-[#4A3B32] text-base mx-auto pr-10">Presentes</h2>
      </div>

      <div className="p-6 pb-24">

        <div className="text-center mb-6 mt-2">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#4A3B32] italic mb-2.5">Sua presença é o nosso maior presente</h1>
          <p className="text-sm sm:text-base text-[#4A3B32]/75 leading-relaxed max-w-[340px] mx-auto font-medium">
            Como já moramos juntos, já temos a maior parte das coisas em nossa casa. Com a nossa mudança, precisamos apenas de alguns itens pontuais para o novo lar. Organizamos esta lista para sugerir cotas e presentes que realmente nos ajudarão nessa nova fase, evitando itens que já possuímos.
          </p>
        </div>

        {/* ── SECTION 1: LUA DE MEL (hero — emocional, valor livre) ── */}
        <HoneymoonCard
          collected={honeymoonCollected}
          onSelect={handleSelectGift}
        />

        {/* ── SECTION 2: COTAS PARA O LAR ── */}
        <SectionDivider icon="fa-home" label="Cotas para o Novo Lar" />
        <p className="text-sm sm:text-base text-[#4A3B32]/80 text-center mb-3 max-w-[360px] mx-auto leading-relaxed font-medium">
          As cotas são contribuições simbólicas em dinheiro (via Pix ou Cartão) que nos ajudam a equipar a nossa casa. Cada cota equivale a R$ 100,00.
        </p>
        <p className="text-xs text-[#B65B46] font-bold text-center mb-5 uppercase tracking-wider">
          Escolha quantas cotas deseja contribuir
        </p>
        <div className="grid grid-cols-1 gap-4 mb-2">
          {QUOTA_ITEMS.map((item) => (
            <QuotaCard
              key={item.id}
              item={item}
              quotasBought={Math.floor((quotaCollected[item.id] || 0) / item.price)}
              onSelect={handleSelectGift}
            />
          ))}
        </div>

        {/* ── SECTION 3: BUQUÊ (divertido, impulso) ── */}
        <SectionDivider icon="fa-face-laugh-wink" label="Brincadeiras" />
        <div className="grid grid-cols-1 gap-3 mb-2">
          {FUN_ITEMS.map((item) => (
            <FunCard
              key={item.id}
              item={item}
              count={funCounts[item.id] || 0}
              onSelect={handleSelectGift}
            />
          ))}
        </div>

        {/* ── SECTION 4: PRODUTOS FÍSICOS (final) ── */}
        <SectionDivider icon="fa-box-open" label="Presentes Físicos" />
        <p className="text-sm sm:text-base text-[#4A3B32]/80 text-center mb-3 max-w-[360px] mx-auto leading-relaxed font-medium">
          Prefere nos dar um presente físico tradicional? Escolha um item abaixo e <strong>marque-o como escolhido</strong> para reservá-lo (isso é essencial para evitar presentes repetidos). Depois, você pode comprá-lo na loja de sua preferência e nos entregar pessoalmente.
        </p>
        <p className="text-xs text-[#B65B46] font-bold text-center mb-5 uppercase tracking-wider">
          Os itens já escolhidos aparecem marcados
        </p>
        <div className="grid grid-cols-1 gap-3">
          {PHYSICAL_ITEMS.map((item) => (
            <PhysicalCard
              key={item.id}
              item={item}
              claimedBy={claimedPhysical[item.id]}
              onSelect={handleSelectGift}
            />
          ))}
        </div>

      </div>

      {selectedItem && (
        <PaymentModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
