'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

const ITEMS = [
  { id: 'geladeira', name: 'Upgrade: Geladeira Inverter', price: 100, isQuota: true, goal: 4500, icon: 'fa-temperature-arrow-down', description: 'Cotas para a nossa geladeira dos sonhos.' },
  { id: 'ventilador', name: 'Ventilador de Teto', price: 250, icon: 'fa-fan' },
  { id: 'kit-pos-festa', name: 'Kit Pós-Festa', price: 80, icon: 'fa-pizza-slice', description: 'Pizza e remédio pra ressaca' },
  { id: 'date', name: '1º Date de Casados', price: 300, icon: 'fa-wine-glass', description: 'Jantar romântico na lua de mel' },
  { id: 'livre', name: 'Valor Livre', price: 0, isCustom: true, icon: 'fa-money-bill-wave', description: 'Contribua com quanto quiser' },
];

function GiftCard({ item, totalCollected, onSelect }) {
  if (item.isQuota) {
    const pct = Math.min((totalCollected / item.goal) * 100, 100).toFixed(1);
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#B65B46]/10 relative overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-[#4A3B32] text-sm">{item.name}</h3>
            <p className="text-[11px] text-[#4A3B32]/60 mt-1">{item.description}</p>
          </div>
          <i className={`fa-solid ${item.icon} text-[#B65B46] text-xl bg-[#B65B46]/10 p-2.5 rounded-lg`} />
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
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#B65B46]/10 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#B65B46]/10 rounded-xl flex items-center justify-center shrink-0">
        <i className={`fa-solid ${item.icon} text-[#B65B46] text-lg`} />
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
  const finalPrice = item.isCustom ? parseFloat(customPrice) : item.price;

  function handleClose() {
    if (isDirty && step !== 'success') {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  }

  function handleProceed() {
    if (!name.trim()) { setNameError(true); return; }
    if (item.isCustom) {
      const val = parseFloat(customPrice);
      if (isNaN(val) || val <= 0) { showToast('Insira um valor maior que R$ 0,00.'); return; }
    }
    setNameError(false);
    setStep('payment');
  }

  function copyPix() {
    navigator.clipboard.writeText('contato@danieleonardo.com.br')
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
              {item.isCustom ? 'A definir' : `R$ ${item.price.toFixed(2).replace('.', ',')}`}
            </span>
          </div>

          {/* Step: Form */}
          {step === 'form' && (
            <div>
              {item.isCustom && (
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
                <h4 className="font-bold text-[#4A3B32] mb-1 text-sm">Chave PIX</h4>
                <p className="text-[10px] text-[#4A3B32]/70 mb-3">Copia e cola. Rápido e direto.</p>
                <div className="bg-stone-100 rounded-lg p-3 flex items-center justify-between mb-4 border border-stone-200">
                  <span className="text-xs font-mono text-[#4A3B32]/80 truncate mr-2">contato@danieleonardo.com.br</span>
                  <button onClick={copyPix} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-200 transition-colors shrink-0">Copiar</button>
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

  const homeItems = ITEMS.filter((i) => !i.isCustom && !i.isQuota && i.icon !== 'fa-wine-glass' && i.icon !== 'fa-pizza-slice');
  const quotaItems = ITEMS.filter((i) => i.isQuota);
  const mimosItems = ITEMS.filter((i) => !i.isQuota && (i.icon === 'fa-pizza-slice' || i.icon === 'fa-wine-glass' || i.isCustom));

  return (
    <div className="mobile-container bg-paper-texture fixed inset-0 z-50 overflow-y-auto slide-up-enter">
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-md z-40 px-6 py-4 flex items-center border-b border-[#B65B46]/10">
        <button onClick={onClose} className="text-[#4A3B32] hover:text-[#B65B46] p-2 transition-colors">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h2 className="font-serif text-xl text-[#4A3B32] ml-4 italic">Lista de Presentes</h2>
      </div>

      <div className="p-6 pb-24">
        <div className="text-center mb-8 mt-4">
          <i className="fa-solid fa-house-chimney-heart text-3xl text-[#B65B46] mb-4" />
          <p className="text-xs text-[#4A3B32]/80 leading-relaxed mb-3">
            Já moramos juntos e, após a nossa mudança, estamos com a nossa casinha praticamente montada!
          </p>
          <p className="text-xs text-[#4A3B32]/80 leading-relaxed font-semibold">
            Para evitar presentes repetidos, criamos esta lista apenas com itens pontuais que queremos fazer um upgrade e experiências para curtirmos juntos!
          </p>
        </div>

        {/* Para o lar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#B65B46]/20" />
          <h3 className="font-serif text-base text-[#4A3B32] italic">Para o nosso Lar</h3>
          <div className="flex-1 h-px bg-[#B65B46]/20" />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {quotaItems.map((item) => (
            <GiftCard key={item.id} item={item} totalCollected={totalCollected} onSelect={setSelectedItem} />
          ))}
          {homeItems.map((item) => (
            <GiftCard key={item.id} item={item} totalCollected={0} onSelect={setSelectedItem} />
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
