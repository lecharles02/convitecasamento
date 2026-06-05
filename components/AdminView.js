'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

export default function AdminView({ onClose }) {
  const [confirmedGuests, setConfirmedGuests] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [manualName, setManualName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newFamily, setNewFamily] = useState('');
  const showToast = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: guests } = await supabase
      .from('guests').select('*').eq('confirmed', true)
      .order('confirmed_at', { ascending: false });
    const { data: gifts } = await supabase
      .from('gifts').select('*').order('created_at', { ascending: false });

    if (guests) setConfirmedGuests(guests);
    if (gifts) {
      setReceivedGifts(gifts);
      setTotalMoney(gifts.reduce((a, b) => a + parseFloat(b.price), 0));
    }
  }

  async function addManualGuest() {
    if (!manualName.trim()) { showToast('Digite o nome do convidado.'); return; }
    const { error } = await supabase.from('guests').insert([{
      name: manualName.trim(), search_key: 'manual',
      confirmed: true, confirmed_at: new Date().toISOString(),
    }]);
    if (error) { showToast('Erro ao adicionar convidado.'); return; }
    setManualName('');
    showToast(`${manualName} adicionado!`, 'success');
    loadData();
  }

  async function removeGuest(id) {
    const { error } = await supabase.from('guests')
      .update({ confirmed: false, confirmed_at: null }).eq('id', id);
    if (error) { showToast('Erro ao remover.'); return; }
    showToast('Presença cancelada.', 'success');
    loadData();
  }

  async function registerFamily() {
    if (!newAlias.trim() || !newFamily.trim()) {
      showToast('Preencha a Chave de Busca e os nomes da Família.');
      return;
    }
    const members = newFamily.split('\n').map((n) => n.trim()).filter(Boolean);
    const rows = members.map((name) => ({ name, search_key: newAlias.toLowerCase().trim(), confirmed: false }));
    const { error } = await supabase.from('guests').insert(rows);
    if (error) { showToast('Erro ao cadastrar família.'); return; }
    showToast(`Família "${newAlias}" cadastrada!`, 'success');
    setNewAlias(''); setNewFamily('');
    loadData();
  }

  const pct = Math.min((totalMoney / 4500) * 100, 100).toFixed(1);

  return (
    <div className="mobile-container bg-stone-100 fixed inset-0 z-[70] overflow-y-auto slide-up-enter flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[#4A3B32] text-[#FAF6F0] z-40 px-6 py-4 flex items-center shadow-md justify-between">
        <div className="flex items-center">
          <button onClick={onClose} className="p-2 hover:text-[#D48C79] transition-colors">
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h2 className="font-serif text-xl ml-4">Painel dos Noivos</h2>
        </div>
        <i className="fa-solid fa-crown text-[#D48C79]" />
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
            <p className="text-[9px] uppercase tracking-widest text-[#4A3B32]/60 font-bold mb-1">Confirmados</p>
            <p className="text-3xl font-serif text-[#B65B46]">{confirmedGuests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
            <p className="text-[9px] uppercase tracking-widest text-[#4A3B32]/60 font-bold mb-1">Arrecadado</p>
            <p className="text-lg font-serif text-emerald-600 mt-1">R$ {totalMoney.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {/* Fridge progress */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#4A3B32]/60 font-bold mb-2">Meta: Geladeira Inverter</p>
          <div className="flex justify-between text-[10px] font-bold text-[#4A3B32] mb-1">
            <span>R$ {totalMoney.toFixed(2).replace('.', ',')}</span>
            <span>R$ 4.500,00</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#B65B46] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Register Family */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
          <h3 className="font-serif text-base text-[#4A3B32] border-b pb-2">
            <i className="fa-solid fa-database mr-1 text-[#B65B46]" /> Cadastrar Família (Busca)
          </h3>
          <p className="text-[10px] text-[#4A3B32]/60 leading-relaxed mb-2">
            Adicione grupos familiares para que eles possam buscar e confirmar presença pelo site.
          </p>
          <div className="space-y-2">
            <input type="text" value={newAlias} onChange={(e) => setNewAlias(e.target.value)} placeholder="Chave de Busca (Ex: charles)" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#B65B46]" />
            <textarea value={newFamily} onChange={(e) => setNewFamily(e.target.value)} placeholder="Nomes dos membros (um por linha)" rows={3} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none focus:border-[#B65B46]" />
            <button onClick={registerFamily} className="w-full bg-[#B65B46] text-white uppercase text-[9px] tracking-widest py-2.5 rounded-lg font-bold hover:bg-[#D48C79] transition-colors">
              Salvar Família no Banco
            </button>
          </div>
        </div>

        {/* Guest list */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
          <h3 className="font-serif text-base text-[#4A3B32] border-b border-stone-200 pb-2 flex justify-between items-center">
            Lista de Confirmados
            <span className="text-xs font-sans bg-[#4A3B32] text-white px-2 py-0.5 rounded-full">{confirmedGuests.length}</span>
          </h3>
          <div className="flex gap-2 mb-3 mt-3">
            <input type="text" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Nome para confirmar manual..." className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#B65B46]" />
            <button onClick={addManualGuest} className="bg-[#4A3B32] text-white px-4 rounded-lg font-bold hover:bg-[#B65B46] transition-colors shadow-sm">
              <i className="fa-solid fa-plus" />
            </button>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto bg-stone-50/50 rounded-xl p-2 border border-stone-100 shadow-inner">
            {confirmedGuests.length === 0 ? (
              <p className="text-xs text-[#4A3B32]/50 italic text-center py-4">Nenhuma confirmação registrada.</p>
            ) : confirmedGuests.map((g) => (
              <div key={g.id} className="flex items-center justify-between border-b border-stone-200 last:border-0 py-2 px-1 hover:bg-stone-100/50 transition-colors rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle text-green-500 text-sm" />
                  <span className="text-xs text-[#4A3B32] font-medium">{g.name}</span>
                </div>
                <button onClick={() => removeGuest(g.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-all shadow-sm">
                  <i className="fa-solid fa-trash-can text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gifts list */}
        <div>
          <h3 className="font-serif text-base text-[#4A3B32] mb-3 border-b border-stone-200 pb-2 flex justify-between items-center">
            Presentes &amp; Recados
            <span className="text-xs font-sans bg-[#B65B46] text-white px-2 py-0.5 rounded-full">{receivedGifts.length}</span>
          </h3>
          <div className="space-y-3 bg-white rounded-xl p-3 border border-stone-200 shadow-inner min-h-[120px]">
            {receivedGifts.length === 0 ? (
              <p className="text-xs text-[#4A3B32]/50 italic text-center py-4">Nenhum presente recebido.</p>
            ) : receivedGifts.map((gift) => (
              <div key={gift.id} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-[#4A3B32]">{gift.gifter_name}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shadow-sm border border-emerald-100">
                    R$ {parseFloat(gift.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-[#4A3B32]/60 mb-1">{gift.item_name}</p>
                {gift.message && (
                  <p className="text-xs text-[#4A3B32]/80 italic mt-2 border-l-2 border-[#B65B46]/30 pl-2">"{gift.message}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
