'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

const ITEMS = [
  // Para o Lar -> Cozinha & Eletros
  { id: 'torradeira', name: 'Torradeira/misto quente', category: 'lar', subcategory: 'cozinha', icon: 'fa-bread-slice', image: '/gifts/torradeira.jpg' },
  { id: 'forno-eletrico', name: 'Forno elétrico', category: 'lar', subcategory: 'cozinha', icon: 'fa-fire-burner', image: '/gifts/forno-eletrico.jpg' },
  { id: 'cafeteira', name: 'Cafeteira', category: 'lar', subcategory: 'cozinha', icon: 'fa-mug-hot', image: '/gifts/cafeteira.jpg' },
  { id: 'panela-eletrica', name: 'Panela elétrica', category: 'lar', subcategory: 'cozinha', icon: 'fa-bowl-food', image: '/gifts/panela-eletrica.jpg' },
  { id: 'frigideira', name: 'Frigideira Antiaderente', category: 'lar', subcategory: 'cozinha', icon: 'fa-kitchen-set', image: '/gifts/frigideira.jpg' },
  { id: 'potes-hermeticos', name: 'Conjunto de potes herméticos', category: 'lar', subcategory: 'cozinha', icon: 'fa-boxes-stacked', image: '/gifts/potes-hermeticos.jpg' },
  { id: 'porta-condimento', name: 'Porta condimento giratório', category: 'lar', subcategory: 'cozinha', icon: 'fa-arrows-spin', image: '/gifts/porta-condimento.jpg' },

  // Para o Lar -> Cama, Banho & Decoração
  { id: 'robo-aspirador', name: 'Robô aspirador', category: 'lar', subcategory: 'casa', icon: 'fa-robot', image: '/gifts/robo-aspirador.jpg' },
  { id: 'jogo-cama', name: 'Jogo de cama (cama king)', category: 'lar', subcategory: 'casa', icon: 'fa-bed', image: '/gifts/jogo-cama.jpg' },
  { id: 'jogo-toalha', name: 'Jogo de toalha', category: 'lar', subcategory: 'casa', icon: 'fa-shower', image: '/gifts/jogo-toalha.jpg' },
  { id: 'manta-sofa', name: 'Manta para sofá', category: 'lar', subcategory: 'casa', icon: 'fa-couch', image: '/gifts/manta-sofa.jpg' },
  { id: 'abajour', name: 'Abajour', category: 'lar', subcategory: 'casa', icon: 'fa-lightbulb', image: '/gifts/abajour.jpg' },

  // Cotas
  { id: 'geladeira', name: 'Cota pra geladeira', price: 100, isQuota: true, goal: 4500, category: 'cota', icon: 'fa-snowflake', description: 'Ajude-nos a equipar nossa cozinha (cotas de R$ 100)', image: '/gifts/geladeira.jpg' },
  { id: 'ar-condicionado', name: 'Cota pra um ar condicionado', price: 150, category: 'cota', icon: 'fa-wind', description: 'Para aliviar os dias de calor no novo lar', image: '/gifts/ar-condicionado.jpg' },
  { id: 'armario-cozinha', name: 'Cota pra um armário de cozinha', price: 200, category: 'cota', icon: 'fa-door-closed', description: 'Ajude-nos na organização das panelas e mantimentos', image: '/gifts/armario-cozinha.jpg' },
  { id: 'ventilador', name: 'Ventilador', price: 120, category: 'cota', icon: 'fa-fan', image: '/gifts/ventilador.jpg' },
  { id: 'lua-de-mel', name: 'Ajuda para a viagem de lua de mel', price: 300, category: 'cota', icon: 'fa-plane', description: 'Contribuição para a nossa viagem de casados', image: '/gifts/lua-de-mel.jpg' },

  // Mimos & Brincadeiras
  { id: 'marcelinho', name: 'Ajuda pra custear os luxos do Marcelinho', price: 50, category: 'mimos', icon: 'fa-dog', description: 'Porque o nosso reizinho merece todo o conforto', image: '/gifts/marcelinho.jpg' },
  { id: 'buque-direto', name: 'Taxa pra jogar o buquê diretamente pra você', price: 80, category: 'mimos', icon: 'fa-hand-holding-heart', description: 'Garanta que o buquê venha na sua direção!', image: '/gifts/buque-direto.jpg' },
  { id: 'buque-namorada', name: 'Taxa pra noiva não jogar o buque na sua namorada', price: 100, category: 'mimos', icon: 'fa-shield-halved', description: 'Segurança extra e paz no relacionamento', image: '/gifts/buque-namorada.jpg' },
  { id: 'livre', name: 'Valor Livre', price: 0, isCustom: true, category: 'mimos', icon: 'fa-money-bill-wave', description: 'Contribua com quanto quiser', image: '/gifts/livre.jpg' },
];


function GiftCard({ item, totalCollected, onSelect }) {
  if (item.isQuota) {
    const pct = Math.min((totalCollected / item.goal) * 100, 100).toFixed(1);
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#B65B46]/10 relative overflow-hidden">
        <div className="flex items-start justify-between mb-2 gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-[#4A3B32] text-sm">{item.name}</h3>
            {item.description && <p className="text-[11px] text-[#4A3B32]/60 mt-1">{item.description}</p>}
          </div>
          <div className="w-20 h-20 bg-[#B65B46]/5 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#B65B46]/10 relative group">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`flex items-center justify-center w-full h-full absolute inset-0 ${item.image ? 'hidden' : 'flex'}`}>
              <i className={`fa-solid ${item.icon} text-[#B65B46] text-2xl`} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-bold text-[#4A3B32] mb-1">
            <span>Arrecadado: R$ {totalCollected.toFixed(2).replace('.', ',')}</span>
            <span>Meta: R$ {item.goal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-[#B65B46] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          onClick={() => onSelect(item)}
          className="w-full border border-[#B65B46] text-[#B65B46] uppercase tracking-widest text-[9px] font-bold py-3 rounded-full hover:bg-[#B65B46] hover:text-white transition-colors btn-elegant"
        >
          Presentear Cota (R$ {item.price})
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#B65B46]/10 flex items-center gap-4 hover:border-[#B65B46]/20 transition-all duration-300">
      <div className="w-24 h-24 bg-[#B65B46]/5 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#B65B46]/10 relative group">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`flex items-center justify-center w-full h-full absolute inset-0 ${item.image ? 'hidden' : 'flex'}`}>
          <i className={`fa-solid ${item.icon || 'fa-image'} text-[#B65B46]/60 text-2xl`} />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-[#4A3B32] text-xs leading-tight">{item.name}</h3>
        {item.description && <p className="text-[10px] text-[#4A3B32]/60 mt-0.5">{item.description}</p>}
        {item.price > 0 && <p className="text-[#B65B46] font-semibold text-xs mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>}
      </div>
      <button
        onClick={() => onSelect(item)}
        className="bg-[#4A3B32] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#B65B46] transition-colors shrink-0 shadow-sm"
      >
        <i className="fa-solid fa-gift text-sm" />
      </button>
    </div>
  );
}

function PaymentModal({ item, totalCollected, onClose, onSuccess }) {
  const [step, setStep] = useState('form'); // 'form' | 'payment' | 'success'
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [nameError, setNameError] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const isDirty = name || message || customPrice;
  const isCustomValue = item.isCustom || !item.price;
  const finalPrice = isCustomValue ? parseFloat(customPrice) : item.price;

  function handleClose() {
    if (isDirty && step !== 'success') {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  }

  function handleProceed() {
    if (!name.trim()) { setNameError(true); return; }
    if (isCustomValue) {
      const val = parseFloat(customPrice);
      if (isNaN(val) || val <= 0) { showToast('Insira um valor maior que R$ 0,00.'); return; }
    }
    setNameError(false);
    setStep('payment');
  }

  function copyPix() {
    navigator.clipboard.writeText('64587589000159')
      .then(() => showToast('Chave PIX copiada!', 'success'))
      .catch(() => showToast('Não foi possível copiar automaticamente.'));
  }

  async function handleFinalize() {
    setLoading(true);
    try {
      const { error } = await supabase.from('gifts').insert([{
        gifter_name: name.trim(),
        item_name: item.name,
        price: finalPrice,
        message: message.trim() || null,
      }]);
      if (error) throw error;
      onSuccess();
      setStep('success');
    } catch {
      showToast('Erro ao registrar o presente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
      <div className="bg-[#FAF6F0] w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] slide-up-enter shadow-2xl relative overflow-hidden">

        {/* Close Confirm Overlay */}
        {showCloseConfirm && (
          <div className="absolute inset-0 z-[70] bg-[#FAF6F0]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <i className="fa-solid fa-triangle-exclamation text-5xl text-[#B65B46] mb-4" />
            <h4 className="font-serif text-xl text-[#4A3B32] mb-2 italic">Cancelar presente?</h4>
            <p className="text-xs text-[#4A3B32]/80 mb-8 leading-relaxed">
              Você já preencheu alguns dados. Tem certeza que deseja fechar? As informações serão perdidas.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowCloseConfirm(false)} className="flex-1 py-3.5 text-[10px] uppercase tracking-widest font-bold text-[#4A3B32] border border-[#4A3B32]/30 rounded-xl hover:bg-[#4A3B32]/5 transition-colors">Voltar</button>
              <button onClick={onClose} className="flex-1 py-3.5 text-[10px] uppercase tracking-widest font-bold bg-[#B65B46] text-white rounded-xl shadow-md hover:bg-[#D48C79] transition-colors">Sim, Fechar</button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#B65B46]/10">
          <h3 className="font-serif text-lg text-[#4A3B32] italic">Presentear</h3>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full text-[#4A3B32] hover:bg-black/10">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Item summary */}
          <div className="bg-white border border-[#B65B46]/20 rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#4A3B32]/60 font-bold block mb-0.5">Item Selecionado</span>
              <span className="font-bold text-[#4A3B32] text-sm">{item.name}</span>
            </div>
            <span className="text-[#B65B46] font-serif text-base">
              {isCustomValue 
                ? (customPrice ? `R$ ${parseFloat(customPrice).toFixed(2).replace('.', ',')}` : 'A definir') 
                : `R$ ${item.price.toFixed(2).replace('.', ',')}`}
            </span>
          </div>

          {/* Step: Form */}
          {step === 'form' && (
            <div>
              {isCustomValue && (
                <div className="mb-4">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#4A3B32] mb-2 ml-2">Valor do Presente (R$) *</label>
                  <input type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} placeholder="Ex: 150" className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46]" />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#4A3B32] mb-2 ml-2">Seu Nome *</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setNameError(false); }} placeholder="Como devemos agradecer?" className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46]" />
                {nameError && <p className="text-red-500 text-xs mt-1 ml-2">Por favor, preencha seu nome.</p>}
              </div>
              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#4A3B32] mb-2 ml-2">Mensagem aos Noivos (Opcional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Deixe um recadinho carinhoso para nós..." className="w-full bg-white border border-[#B65B46]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B65B46] resize-none" />
              </div>
              <button onClick={handleProceed} className="w-full bg-[#4A3B32] text-white uppercase tracking-widest text-[10px] font-bold py-4 rounded-xl shadow-md hover:bg-[#B65B46] transition-colors flex justify-center items-center btn-elegant">
                Continuar <i className="fa-solid fa-arrow-right ml-2" />
              </button>
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-center text-[#4A3B32]/80">
                Obrigado, <span className="font-bold">{name}</span>! Escolha como prefere nos presentear:
              </p>

              {/* PIX */}
              <div className="bg-white border-2 border-emerald-500/20 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <i className="fa-brands fa-pix text-3xl text-emerald-500 mb-2" />
                <h4 className="font-bold text-[#4A3B32] mb-1 text-sm">Chave PIX (CNPJ)</h4>
                <p className="text-[10px] text-[#4A3B32]/70 mb-4">Aponte a câmera do seu banco para o QR Code ou copie e cole a chave.</p>
                
                {/* QR Code Image */}
                <div className="w-44 h-44 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-200/80 p-2 shadow-sm">
                  <img 
                    src="/pix_qrcode.png" 
                    alt="QR Code PIX" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="bg-stone-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 mb-4 border border-stone-200 shadow-xs">
                  <span className="text-base font-mono font-bold text-[#4A3B32] tracking-wider select-all">
                    64587589000159
                  </span>
                  <button 
                    onClick={copyPix} 
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer w-full max-w-[150px]"
                  >
                    Copiar Chave
                  </button>
                </div>
                <button onClick={handleFinalize} disabled={loading} className="w-full bg-emerald-600 text-white uppercase tracking-widest text-[10px] font-bold py-3.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors btn-elegant">
                  {loading ? 'Registrando...' : 'Confirmar Envio do Presente'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#B65B46]/20" />
                <span className="text-[9px] uppercase font-bold text-[#4A3B32]/40 tracking-widest">OU</span>
                <div className="flex-1 h-px bg-[#B65B46]/20" />
              </div>

              {/* Card */}
              <div className="bg-white border border-[#B65B46]/10 rounded-2xl p-4 text-center">
                <i className="fa-regular fa-credit-card text-xl text-[#B65B46] mb-2" />
                <h4 className="font-bold text-[#4A3B32] text-xs mb-1">Cartão de Crédito</h4>
                <button onClick={handleFinalize} disabled={loading} className="w-full border border-[#4A3B32] text-[#4A3B32] uppercase tracking-widest text-[9px] font-bold py-3 rounded-xl hover:bg-[#4A3B32] hover:text-white transition-colors mt-2 btn-elegant">
                  {loading ? 'Registrando...' : 'Pagar com Cartão'}
                </button>
              </div>

              <button onClick={() => setStep('form')} className="text-[10px] text-[#4A3B32]/60 underline text-center mt-2">
                Voltar e alterar dados
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-[#B65B46]/10 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-heart text-2xl text-[#B65B46]" />
              </div>
              <h3 className="font-serif text-2xl text-[#4A3B32] mb-2">Muito Obrigado!</h3>
              <p className="text-sm text-[#4A3B32]/80 mb-8">Sua contribuição e mensagem foram enviadas para o painel dos noivos.</p>
              <button onClick={onClose} className="border border-[#4A3B32] text-[#4A3B32] uppercase tracking-widest text-[10px] font-bold py-3 px-8 rounded-full btn-elegant">
                Voltar à Lista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GiftView({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalCollected, setTotalCollected] = useState(850);

  async function refreshTotal() {
    const { data } = await supabase.from('gifts').select('price');
    if (data) {
      const sum = data.reduce((a, b) => a + parseFloat(b.price), 0);
      setTotalCollected(sum);
    }
  }

  useEffect(() => {
    refreshTotal();
  }, []);

  const homeItems = ITEMS.filter((i) => i.category === 'lar');
  const cotasItems = ITEMS.filter((i) => i.category === 'cota');
  const mimosItems = ITEMS.filter((i) => i.category === 'mimos');

  return (
    <div className="mobile-container bg-paper-texture fixed inset-0 z-50 overflow-y-auto slide-up-enter">
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-md z-40 px-6 py-4 flex items-center border-b border-[#B65B46]/10">
        <button onClick={onClose} className="text-[#4A3B32] hover:text-[#B65B46] p-2 transition-colors">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
      </div>

      <div className="p-6 pb-24">
        <div className="text-center mb-8 mt-2 flex flex-col items-center">
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

          <h2 className="font-serif text-3xl text-[#4A3B32] mb-1.5 italic tracking-wide">Lista de Presentes</h2>
          <h3 className="uppercase tracking-[0.22em] text-[9px] font-bold text-[#B65B46] mb-3">
            SUA PRESENÇA É O NOSSO MAIOR PRESENTE!
          </h3>

          {/* Heart Divider */}
          <div className="flex items-center justify-center gap-3 mb-6 opacity-60">
            <div className="w-10 h-px bg-[#C5A059]/50" />
            <i className="fa-solid fa-heart text-[6px] text-[#C5A059]" />
            <div className="w-10 h-px bg-[#C5A059]/50" />
          </div>
          <p className="text-xs text-[#4A3B32]/80 leading-relaxed mb-6 max-w-[320px] mx-auto">
            Para evitar presentes que já temos em nossa casa, separamos algumas sugestões para aqueles que desejarem nos presentear. Com a nossa mudança, precisamos apenas de alguns itens pontuais para o novo lar.
          </p>
        </div>

        {/* Para o lar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#B65B46]/20" />
          <h3 className="font-serif text-base text-[#4A3B32] italic">Para o nosso Lar</h3>
          <div className="flex-1 h-px bg-[#B65B46]/20" />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {homeItems.map((item) => (
            <GiftCard key={item.id} item={item} totalCollected={0} onSelect={setSelectedItem} />
          ))}
        </div>

        {/* Cotas */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#B65B46]/20" />
          <h3 className="font-serif text-base text-[#4A3B32] italic">Cotas</h3>
          <div className="flex-1 h-px bg-[#B65B46]/20" />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {cotasItems.map((item) => (
            <GiftCard key={item.id} item={item} totalCollected={totalCollected} onSelect={setSelectedItem} />
          ))}
        </div>

        {/* Mimos */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#B65B46]/20" />
          <h3 className="font-serif text-base text-[#4A3B32] italic">Mimos &amp; Brincadeiras</h3>
          <div className="flex-1 h-px bg-[#B65B46]/20" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {mimosItems.map((item) => (
            <GiftCard key={item.id} item={item} totalCollected={0} onSelect={setSelectedItem} />
          ))}
        </div>
      </div>

      {selectedItem && (
        <PaymentModal
          item={selectedItem}
          totalCollected={totalCollected}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => { refreshTotal(); }}
        />
      )}
    </div>
  );
}
