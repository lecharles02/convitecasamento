'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './ToastProvider';

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  async function handleSubmit() {
    if (!pwd.trim()) {
      showToast('Por favor, digite a senha.');
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(true);
      }
    } catch {
      showToast('Erro ao validar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative slide-up-enter">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#4A3B32]/50 hover:text-[#4A3B32]">
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="text-center mb-6">
          <i className="fa-solid fa-lock text-3xl text-[#4A3B32] mb-3" />
          <h3 className="font-serif text-xl text-[#4A3B32]">Acesso dos Noivos</h3>
          <p className="text-xs text-[#4A3B32]/70 mt-1">Digite a senha para acessar o painel</p>
        </div>
        <input
          type="password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Senha"
          className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-[#B65B46] mb-2"
        />
        {error && <p className="text-red-500 text-xs text-center mb-4">Senha incorreta.</p>}
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full mt-2 bg-[#4A3B32] text-white uppercase tracking-widest text-xs font-bold py-3.5 rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin" />
              <span>Validando...</span>
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </div>
    </div>,
    document.body
  );
}
