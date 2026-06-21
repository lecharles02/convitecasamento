'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

function StepSearch({ onSearchResult }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const showToast = useToast();

  async function handleSearch() {
    if (!input.trim()) {
      showToast('Por favor, digite o seu nome (ex: Beatriz ou Gilson).');
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const normalizeText = (str) =>
        str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

      const searchNormalized = normalizeText(input);

      // Fetch all guests to perform accent-insensitive and flexible matching in memory
      const { data: allGuests, error: err1 } = await supabase
        .from('guests')
        .select('*');

      if (err1) throw err1;

      if (allGuests && allGuests.length > 0) {
        // Filter guests matching either search_key or name (accent-insensitive)
        const matchedGuests = allGuests.filter((guest) => {
          const guestSearchKey = normalizeText(guest.search_key);
          const guestName = normalizeText(guest.name);
          return guestSearchKey === searchNormalized || guestName.includes(searchNormalized);
        });

        if (matchedGuests.length > 0) {
          // Get all unique search keys from matched guests
          const searchKeys = [...new Set(matchedGuests.map((g) => g.search_key))];
          
          if (searchKeys.length === 1) {
            // Only one family matches, proceed directly to family confirmation
            const familyMembers = allGuests.filter((g) => g.search_key === searchKeys[0]);
            onSearchResult({ type: 'single', data: familyMembers });
          } else {
            // Multiple families matched
            const familiesList = searchKeys.map((key) => ({
              search_key: key,
              members: allGuests.filter((g) => g.search_key === key)
            }));
            onSearchResult({ type: 'multiple', data: familiesList });
          }
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch {
      showToast('Erro ao buscar convite. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-wider font-bold text-[#4A3B32] mb-3 ml-4">
        Nome no Convite
      </label>
      <div className="relative mb-4.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ex: Jaqueline"
          className="w-full bg-white border border-[#B65B46]/20 rounded-full pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-[#B65B46] shadow-sm"
        />
        <i className="fa-solid fa-magnifying-glass text-[#B65B46]/50 absolute left-5 top-1/2 -translate-y-1/2 text-sm" />
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-[#4A3B32] text-white uppercase tracking-wider text-xs font-bold py-4.5 px-6 rounded-full btn-elegant flex justify-center items-center gap-2"
      >
        <span>{loading ? 'Buscando...' : 'Buscar Convite'}</span>
        {loading && <i className="fa-solid fa-circle-notch fa-spin" />}
      </button>
      {error && (
        <p className="text-red-500 text-xs mt-3 text-center font-medium">
          Convite não encontrado. Tente apenas o primeiro nome.
        </p>
      )}
    </div>
  );
}

function StepSelectFamily({ families, onSelect, onBack }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-lg text-[#4A3B32] mb-2 text-center border-b border-[#B65B46]/20 pb-4">
        Vários convites encontrados!
      </h3>
      <p className="text-xs text-[#4A3B32]/70 text-center mb-4 leading-relaxed">
        Encontramos mais de um convite correspondente. Por favor, selecione o seu grupo familiar:
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {families.map((fam, index) => {
          const names = fam.members.map(m => m.name);
          let formattedNames = "";
          if (names.length === 1) {
            formattedNames = names[0];
          } else if (names.length === 2) {
            formattedNames = `${names[0]} e ${names[1]}`;
          } else {
            formattedNames = `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
          }

          return (
            <div
              key={fam.search_key}
              onClick={() => onSelect(fam.members)}
              className="bg-white border border-[#B65B46]/20 p-5 rounded-2xl cursor-pointer hover:border-[#B65B46] shadow-sm hover:shadow-md hover:bg-stone-50/50 transition-all flex flex-col gap-2 text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B65B46]">
                  Opção {index + 1}
                </span>
                <i className="fa-solid fa-chevron-right text-xs text-[#B65B46]/50" />
              </div>
              <p className="font-serif text-sm sm:text-base text-[#4A3B32] font-semibold leading-relaxed">
                {formattedNames}
              </p>
            </div>
          );
        })}
      </div>
      <button
        onClick={onBack}
        className="w-full border border-[#4A3B32] text-[#4A3B32] uppercase tracking-wider text-xs font-bold py-3.5 px-6 rounded-full btn-elegant"
      >
        Voltar e Pesquisar Novamente
      </button>
    </div>
  );
}

function StepFamily({ family, onSuccess }) {
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(family.map((m) => [m.id, !!m.confirmed]))
  );
  const [loading, setLoading] = useState(false);
  const [cancelConfirmGuest, setCancelConfirmGuest] = useState(null);
  const showToast = useToast();

  const toggle = (id, wasConfirmed) => {
    const isCurrentlyChecked = !!checked[id];
    
    if (wasConfirmed && isCurrentlyChecked) {
      const member = family.find((m) => m.id === id);
      setCancelConfirmGuest(member);
    } else {
      setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  function handleCancelConfirm() {
    if (cancelConfirmGuest) {
      setChecked((prev) => ({ ...prev, [cancelConfirmGuest.id]: false }));
      setCancelConfirmGuest(null);
    }
  }

  async function handleConfirm() {
    const toConfirm = family
      .filter((m) => !m.confirmed && checked[m.id])
      .map((m) => m.id);

    const toCancel = family
      .filter((m) => m.confirmed && !checked[m.id])
      .map((m) => m.id);

    if (toConfirm.length === 0 && toCancel.length === 0) {
      showToast('Nenhuma alteração para salvar.');
      return;
    }

    setLoading(true);
    try {
      if (toConfirm.length > 0) {
        const { error } = await supabase
          .from('guests')
          .update({ confirmed: true, confirmed_at: new Date().toISOString() })
          .in('id', toConfirm);
        if (error) throw error;
      }

      if (toCancel.length > 0) {
        const { error } = await supabase
          .from('guests')
          .update({ confirmed: false, confirmed_at: null })
          .in('id', toCancel);
        if (error) throw error;
      }

      onSuccess();
    } catch {
      showToast('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const hasCancellations = family.some((m) => m.confirmed && !checked[m.id]);
  const buttonText = loading 
    ? 'Enviando...' 
    : hasCancellations 
      ? 'Salvar Alterações' 
      : 'Enviar Confirmação';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-lg text-[#4A3B32] mb-2 text-center border-b border-[#B65B46]/20 pb-4">
        Convite encontrado!
      </h3>
      <p className="text-xs text-[#4A3B32]/70 text-center mb-4">
        Por favor, marque quem poderá comparecer:
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {family.map((member) => {
          const isChecked = !!checked[member.id];
          return (
            <div
              key={member.id}
              onClick={() => toggle(member.id, member.confirmed)}
              className={`flex items-center justify-between bg-white border ${
                isChecked ? 'border-[#B65B46]/50 bg-[#B65B46]/5' : 'border-[#B65B46]/20'
              } p-4 rounded-xl cursor-pointer hover:border-[#B65B46] shadow-sm transition-all`}
            >
              <span className="font-medium text-[#4A3B32] text-sm">
                {member.name}{' '}
                {member.confirmed && isChecked && (
                  <span className="text-[11px] uppercase tracking-wider text-[#B65B46] font-bold ml-1.5">
                    (Já Confirmado)
                  </span>
                )}
                {member.confirmed && !isChecked && (
                  <span className="text-[11px] uppercase tracking-wider text-red-500 font-bold ml-1.5">
                    (Cancelar Presença)
                  </span>
                )}
              </span>
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="w-5 h-5 cursor-pointer accent-[#B65B46]"
              />
            </div>
          );
        })}
      </div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-[#B65B46] text-white uppercase tracking-wider text-xs font-bold py-4.5 px-6 rounded-full shadow-lg btn-elegant"
      >
        {buttonText}
      </button>

      {/* Custom Confirmation Modal */}
      {cancelConfirmGuest && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-[92vw] max-w-[360px] sm:max-w-sm text-center border border-[#B65B46]/10 space-y-4 slide-up-enter overflow-hidden">
            <div className="w-16 h-16 bg-[#B65B46]/10 rounded-full flex items-center justify-center mx-auto text-[#B65B46]">
              <i className="fa-solid fa-circle-exclamation text-2xl" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-serif text-xl text-[#4A3B32] font-bold">Cancelar Presença?</h4>
              <p className="text-sm text-[#4A3B32]/80 leading-relaxed px-2">
                Tem certeza que deseja cancelar a confirmação de presença de <span className="font-bold text-[#4A3B32]">{cancelConfirmGuest.name}</span>?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setCancelConfirmGuest(null)}
                className="flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4A3B32] border border-stone-200 rounded-xl hover:bg-stone-50 transition-all cursor-pointer"
              >
                Manter
              </button>
              <button 
                onClick={handleCancelConfirm}
                className="flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#B65B46] rounded-xl shadow-sm hover:bg-[#D48C79] transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function StepSuccess({ onClose, onOpenGifts }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <i className="fa-solid fa-check text-2xl text-green-600" />
      </div>
      <h3 className="font-serif text-2xl text-[#4A3B32] mb-2">Muito Obrigado!</h3>
      <p className="text-sm text-[#4A3B32]/80 mb-8 max-w-[280px] mx-auto leading-relaxed">
        Sua confirmação foi registrada com sucesso. Mal podemos esperar para celebrar com você!
      </p>
      
      <div className="flex flex-col gap-3.5 w-full max-w-[250px] mx-auto">
        <button
          onClick={onOpenGifts}
          className="w-full bg-[#B65B46] text-white uppercase tracking-wider text-xs font-bold py-4.5 px-6 rounded-full shadow-lg hover:bg-[#D48C79] transition-all duration-300 btn-elegant flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-gift" />
          <span>Ver Lista de Presentes</span>
        </button>
        
        <button
          onClick={onClose}
          className="w-full border border-[#4A3B32] text-[#4A3B32] uppercase tracking-wider text-xs font-bold py-3.5 px-6 rounded-full btn-elegant"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}

export default function RsvpView({ onClose, onOpenGifts }) {
  const [step, setStep] = useState('search'); // 'search' | 'select-family' | 'family' | 'success'
  const [family, setFamily] = useState([]);
  const [multipleFamilies, setMultipleFamilies] = useState([]);
  const [animationClass, setAnimationClass] = useState('slide-up-enter');

  function handleReset() {
    setStep('search');
    setFamily([]);
    setMultipleFamilies([]);
  }

  return (
    <div
      className={`mobile-container bg-paper-texture fixed inset-0 z-50 overflow-y-auto ${animationClass} flex flex-col`}
      onAnimationEnd={() => setAnimationClass('')}
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-md z-40 px-6 py-4 flex items-center border-b border-[#B65B46]/10">
        <button onClick={onClose} className="text-[#4A3B32] hover:text-[#B65B46] p-2">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h2 className="font-serif text-xl text-[#4A3B32] ml-4 italic">Confirmação</h2>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {step === 'search' && (
          <>
            <div className="text-center mb-8">
              <i className="fa-solid fa-envelope-open-text text-4xl text-[#B65B46] mb-4" />
              <p className="text-sm text-[#4A3B32]/80">
                Digite seu nome abaixo para buscar seu convite e confirmar quem da sua família estará presente.
              </p>
            </div>
            <StepSearch onSearchResult={(result) => {
              if (result.type === 'single') {
                setFamily(result.data);
                setStep('family');
              } else {
                setMultipleFamilies(result.data);
                setStep('select-family');
              }
            }} />
          </>
        )}
        {step === 'select-family' && (
          <StepSelectFamily
            families={multipleFamilies}
            onSelect={(selectedFamily) => {
              setFamily(selectedFamily);
              setStep('family');
            }}
            onBack={handleReset}
          />
        )}
        {step === 'family' && (
          <StepFamily family={family} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && (
          <StepSuccess 
            onClose={() => { handleReset(); onClose(); }} 
            onOpenGifts={() => { handleReset(); onOpenGifts(); }} 
          />
        )}
      </div>
    </div>
  );
}
