'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

function StepSearch({ onFound }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const showToast = useToast();

  async function handleSearch() {
    if (!input.trim()) {
      showToast('Por favor, digite um nome de busca (ex: charles).');
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const { data, error: err } = await supabase
        .from('guests')
        .select('*')
        .eq('search_key', input.toLowerCase().trim());

      if (err) throw err;

      if (data && data.length > 0) {
        onFound(data);
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
      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#4A3B32] mb-2 ml-4">
        Nome no Convite
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Ex: Jaqueline"
        className="w-full bg-white border border-[#B65B46]/20 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-[#B65B46] shadow-sm mb-4"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-[#4A3B32] text-white uppercase tracking-widest text-[10px] font-bold py-4 px-6 rounded-full btn-elegant flex justify-center items-center gap-2"
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

function StepFamily({ family, onSuccess }) {
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(family.map((m) => [m.id, !m.confirmed]))
  );
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const toggle = (id, disabled) => {
    if (disabled) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function handleConfirm() {
    const toConfirm = family
      .filter((m) => !m.confirmed && checked[m.id])
      .map((m) => m.id);

    const hasDisabled = family.some((m) => m.confirmed);
    if (toConfirm.length === 0 && !hasDisabled) {
      showToast('Por favor, selecione ao menos um membro para confirmar.');
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
      onSuccess();
    } catch {
      showToast('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-lg text-[#4A3B32] mb-2 text-center border-b border-[#B65B46]/20 pb-4">
        Convite encontrado!
      </h3>
      <p className="text-xs text-[#4A3B32]/70 text-center mb-4">
        Por favor, marque quem poderá comparecer:
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {family.map((member) => (
          <label
            key={member.id}
            onClick={() => toggle(member.id, member.confirmed)}
            className={`flex items-center justify-between bg-white border ${
              member.confirmed ? 'border-[#B65B46]/50 bg-[#B65B46]/5' : 'border-[#B65B46]/20'
            } p-4 rounded-xl cursor-pointer hover:border-[#B65B46] shadow-sm transition-colors`}
          >
            <span className="font-medium text-[#4A3B32] text-sm">
              {member.name}{' '}
              {member.confirmed && (
                <span className="text-[9px] uppercase tracking-widest text-[#B65B46] font-bold ml-1">
                  (Já Confirmado)
                </span>
              )}
            </span>
            <input
              type="checkbox"
              checked={member.confirmed ? true : !!checked[member.id]}
              disabled={member.confirmed}
              readOnly
              className="w-5 h-5 cursor-pointer accent-[#B65B46]"
            />
          </label>
        ))}
      </div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-[#B65B46] text-white uppercase tracking-widest text-[10px] font-bold py-4 px-6 rounded-full shadow-lg btn-elegant"
      >
        {loading ? 'Enviando...' : 'Enviar Confirmação'}
      </button>
    </div>
  );
}

function StepSuccess({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <i className="fa-solid fa-check text-2xl text-green-600" />
      </div>
      <h3 className="font-serif text-2xl text-[#4A3B32] mb-2">Muito Obrigado!</h3>
      <p className="text-sm text-[#4A3B32]/80 mb-8">
        Sua confirmação foi registrada com sucesso. Mal podemos esperar para celebrar com você!
      </p>
      <button
        onClick={onClose}
        className="border border-[#4A3B32] text-[#4A3B32] uppercase tracking-widest text-[10px] font-bold py-3 px-8 rounded-full btn-elegant"
      >
        Voltar ao Início
      </button>
    </div>
  );
}

export default function RsvpView({ onClose }) {
  const [step, setStep] = useState('search'); // 'search' | 'family' | 'success'
  const [family, setFamily] = useState([]);

  function handleReset() {
    setStep('search');
    setFamily([]);
  }

  return (
    <div className="mobile-container bg-paper-texture fixed inset-0 z-50 overflow-y-auto slide-up-enter flex flex-col">
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
            <StepSearch onFound={(data) => { setFamily(data); setStep('family'); }} />
          </>
        )}
        {step === 'family' && (
          <StepFamily family={family} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && (
          <StepSuccess onClose={() => { handleReset(); onClose(); }} />
        )}
      </div>
    </div>
  );
}
