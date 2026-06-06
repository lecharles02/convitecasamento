'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

export default function AdminView({ onClose }) {
  const [allGuests, setAllGuests] = useState([]);
  const [confirmedGuests, setConfirmedGuests] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'gifts'
  
  // Search and edit states
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSearchKey, setEditSearchKey] = useState('');

  // Bulk add states
  const [newAlias, setNewAlias] = useState('');
  const [newFamily, setNewFamily] = useState('');

  // Drag and drop states
  const [dragOverFamily, setDragOverFamily] = useState(null);
  const [emptyFamilies, setEmptyFamilies] = useState([]);
  const [emptyFamilyInput, setEmptyFamilyInput] = useState('');

  // Expand/Collapse and Filter states
  const [collapsedFamilies, setCollapsedFamilies] = useState({});
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'confirmed' | 'pending' | 'empty'
  const [giftSearchTerm, setGiftSearchTerm] = useState('');
  const [giftSortBy, setGiftSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'
  const [addingToFamily, setAddingToFamily] = useState(null);
  const [inlineGuestName, setInlineGuestName] = useState('');
  
  const showToast = useToast();

  useEffect(() => { loadData(); }, []);

  function addEmptyFamily() {
    const key = emptyFamilyInput.trim().toLowerCase();
    if (!key) {
      showToast('Digite uma chave de busca válida.');
      return;
    }
    const existsInDB = allGuests.some(g => g.search_key === key);
    if (existsInDB || emptyFamilies.includes(key)) {
      showToast('Esta família já existe.');
      return;
    }
    setEmptyFamilies(prev => [...prev, key]);
    setEmptyFamilyInput('');
    showToast(`Família "${key}" criada! Arraste convidados para ela.`, 'success');
  }

  useEffect(() => {
    if (allGuests.length > 0 && emptyFamilies.length > 0) {
      const keysWithMembers = new Set(allGuests.map(g => g.search_key));
      setEmptyFamilies(prev => prev.filter(key => !keysWithMembers.has(key)));
    }
  }, [allGuests, emptyFamilies]);

  // Expand/Collapse helper functions
  function toggleFamilyCollapse(key) {
    setCollapsedFamilies(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function expandAllFamilies() {
    const next = {};
    familyList.forEach(key => {
      next[key] = false;
    });
    setCollapsedFamilies(next);
  }

  function collapseAllFamilies() {
    const next = {};
    familyList.forEach(key => {
      next[key] = true;
    });
    setCollapsedFamilies(next);
  }

  async function saveInlineGuest(familyKey) {
    if (!inlineGuestName.trim()) {
      showToast('O nome do convidado não pode ficar vazio.');
      return;
    }
    const { error } = await supabase.from('guests').insert({
      name: inlineGuestName.trim(),
      search_key: familyKey.toLowerCase().trim(),
      confirmed: false
    });

    if (error) {
      showToast('Erro ao adicionar convidado.');
    } else {
      showToast(`${inlineGuestName} adicionado à família "${familyKey}"!`, 'success');
      setAddingToFamily(null);
      setInlineGuestName('');
      loadData();
    }
  }

  async function loadData() {
    const { data: guests } = await supabase
      .from('guests')
      .select('*')
      .order('search_key', { ascending: true })
      .order('name', { ascending: true });
      
    const { data: gifts } = await supabase
      .from('gifts')
      .select('*')
      .order('created_at', { ascending: false });

    if (guests) {
      setAllGuests(guests);
      setConfirmedGuests(guests.filter(g => g.confirmed));
    }
    if (gifts) {
      setReceivedGifts(gifts);
      setTotalMoney(gifts.reduce((a, b) => a + parseFloat(b.price), 0));
    }
  }

  async function saveEditGuest(id) {
    if (!editName.trim() || !editSearchKey.trim()) {
      showToast('Nome e Chave de Busca não podem ficar vazios.');
      return;
    }
    const { error } = await supabase.from('guests')
      .update({
        name: editName.trim(),
        search_key: editSearchKey.toLowerCase().trim()
      })
      .eq('id', id);
    
    if (error) { 
      showToast('Erro ao atualizar convidado.'); 
      return; 
    }
    showToast('Convidado atualizado!', 'success');
    setEditingGuestId(null);
    loadData();
  }

  async function deleteGuest(id, name) {
    if (confirm(`Tem certeza que deseja excluir ${name}?`)) {
      const originalAllGuests = allGuests;
      const originalConfirmedGuests = confirmedGuests;

      setAllGuests((prev) => prev.filter((g) => g.id !== id));
      setConfirmedGuests((prev) => prev.filter((g) => g.id !== id));
      
      try {
        const { count, error } = await supabase
          .from('guests')
          .delete({ count: 'exact' })
          .eq('id', id);
        
        if (error || !count || count === 0) {
          showToast('Erro no banco: a exclusão está bloqueada.', 'error');
          setAllGuests(originalAllGuests);
          setConfirmedGuests(originalConfirmedGuests);
        } else {
          showToast('Convidado excluído com sucesso.', 'success');
          loadData();
        }
      } catch (err) {
        showToast('Erro ao excluir convidado.');
        setAllGuests(originalAllGuests);
        setConfirmedGuests(originalConfirmedGuests);
      }
    }
  }

  async function deleteGift(id, gifterName, itemName) {
    if (confirm(`Tem certeza que deseja excluir o presente de ${gifterName} (${itemName})?`)) {
      const originalGifts = receivedGifts;
      const originalTotal = totalMoney;

      setReceivedGifts(prev => prev.filter(g => g.id !== id));
      const removedGift = receivedGifts.find(g => g.id === id);
      if (removedGift) {
        setTotalMoney(prev => prev - parseFloat(removedGift.price));
      }

      try {
        const { count, error } = await supabase
          .from('gifts')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (error || !count || count === 0) {
          showToast('Erro no banco: a exclusão está bloqueada. Abra o arquivo INSTRUCOES_BANCO.sql na raiz do projeto para ver como liberar.', 'error');
          setReceivedGifts(originalGifts);
          setTotalMoney(originalTotal);
        } else {
          showToast('Presente excluído com sucesso.', 'success');
          loadData();
        }
      } catch (err) {
        showToast('Erro ao excluir presente.');
        setReceivedGifts(originalGifts);
        setTotalMoney(originalTotal);
      }
    }
  }

  async function toggleConfirmation(guest) {
    const newConfirmed = !guest.confirmed;
    const { error } = await supabase.from('guests')
      .update({
        confirmed: newConfirmed,
        confirmed_at: newConfirmed ? new Date().toISOString() : null
      })
      .eq('id', guest.id);
    
    if (error) { 
      showToast('Erro ao atualizar confirmação.'); 
      return; 
    }
    showToast(newConfirmed ? 'Presença confirmada!' : 'Confirmação cancelada.', 'success');
    loadData();
  }

  async function handleMoveGuest(guestId, targetFamilyKey) {
    if (!guestId || !targetFamilyKey) return;
    const guest = allGuests.find(g => g.id === guestId);
    if (!guest) return;
    
    if (guest.search_key === targetFamilyKey) return;

    const { error } = await supabase.from('guests')
      .update({ search_key: targetFamilyKey.toLowerCase().trim() })
      .eq('id', guestId);
      
    if (error) {
      showToast('Erro ao mover convidado.');
    } else {
      showToast(`${guest.name} movido para a família "${targetFamilyKey}"!`, 'success');
      loadData();
    }
  }

  async function registerFamily() {
    if (!newAlias.trim() || !newFamily.trim()) {
      showToast('Preencha a Chave de Busca e os nomes da Família.');
      return;
    }
    const members = newFamily.split('\n').map((n) => n.trim()).filter(Boolean);
    const rows = members.map((name) => ({ 
      name, 
      search_key: newAlias.toLowerCase().trim(), 
      confirmed: false 
    }));
    const { error } = await supabase.from('guests').insert(rows);
    if (error) { showToast('Erro ao cadastrar família.'); return; }
    showToast(`Família "${newAlias}" cadastrada!`, 'success');
    setNewAlias(''); setNewFamily('');
    loadData();
  }

  const filteredFamilies = useMemo(() => {
    const families = {};
    allGuests.forEach((guest) => {
      const key = guest.search_key || 'sem-familia';
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.toLowerCase().includes(searchTerm.toLowerCase());
        
      if (searchTerm === '' || matchesSearch) {
        if (!families[key]) {
          families[key] = [];
        }
        families[key].push(guest);
      }
    });

    emptyFamilies.forEach((key) => {
      const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase());
      if (searchTerm === '' || matchesSearch) {
        if (!families[key]) {
          families[key] = [];
        }
      }
    });
    return families;
  }, [allGuests, emptyFamilies, searchTerm]);

  const familyList = useMemo(() => {
    return Object.keys(filteredFamilies).sort();
  }, [filteredFamilies]);
  
  const filteredFamilyList = useMemo(() => {
    return familyList.filter(familyKey => {
      const members = filteredFamilies[familyKey] || [];
      if (statusFilter === 'all') return true;
      if (statusFilter === 'empty') return members.length === 0;
      if (statusFilter === 'confirmed') {
        return members.length > 0 && members.some(m => m.confirmed);
      }
      if (statusFilter === 'pending') {
        return members.length > 0 && members.some(m => !m.confirmed);
      }
      return true;
    });
  }, [familyList, filteredFamilies, statusFilter]);

  const pct = useMemo(() => {
    return Math.min((totalMoney / 4500) * 100, 100).toFixed(1);
  }, [totalMoney]);

  const moneyRemaining = useMemo(() => {
    return Math.max(4500 - totalMoney, 0);
  }, [totalMoney]);

  const filteredGifts = useMemo(() => {
    const term = giftSearchTerm.toLowerCase();
    return receivedGifts.filter(gift => {
      return (
        gift.gifter_name.toLowerCase().includes(term) ||
        gift.item_name.toLowerCase().includes(term) ||
        (gift.message && gift.message.toLowerCase().includes(term))
      );
    });
  }, [receivedGifts, giftSearchTerm]);

  const sortedGifts = useMemo(() => {
    return [...filteredGifts].sort((a, b) => {
      if (giftSortBy === 'date_desc') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (giftSortBy === 'date_asc') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (giftSortBy === 'price_desc') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      if (giftSortBy === 'price_asc') {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      return 0;
    });
  }, [filteredGifts, giftSortBy]);

  return (
    <div className="bg-stone-100 fixed inset-0 z-[70] overflow-y-auto slide-up-enter flex flex-col w-full h-full">
      {/* Header */}
      <div className="sticky top-0 bg-[#4A3B32] text-[#FAF6F0] z-40 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4 sm:px-6">
          <div className="flex items-center">
            <button onClick={onClose} className="p-2 hover:text-[#D48C79] transition-colors">
              <i className="fa-solid fa-arrow-left" />
            </button>
            <h2 className="font-serif text-xl ml-4">Painel dos Noivos</h2>
          </div>
          <i className="fa-solid fa-crown text-[#D48C79]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 z-30 sticky top-[60px]">
        <div className="max-w-7xl mx-auto flex text-center w-full px-4 sm:px-6">
          <button 
            onClick={() => setActiveTab('guests')}
            className={`flex-1 py-3.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
              activeTab === 'guests' 
                ? 'border-[#B65B46] text-[#B65B46]' 
                : 'border-transparent text-stone-500 hover:text-[#B65B46]'
            }`}
          >
            <i className="fa-solid fa-users mr-1.5" /> Convidados ({allGuests.length})
          </button>
          <button 
            onClick={() => setActiveTab('gifts')}
            className={`flex-1 py-3.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
              activeTab === 'gifts' 
                ? 'border-[#B65B46] text-[#B65B46]' 
                : 'border-transparent text-stone-500 hover:text-[#B65B46]'
            }`}
          >
            <i className="fa-solid fa-gift mr-1.5" /> Presentes &amp; Recados ({receivedGifts.length})
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 flex-1 pb-24 max-w-7xl mx-auto w-full px-4 sm:px-6 space-y-6">
        
        {/* Global Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#4A3B32]/70 shrink-0">
              <i className="fa-solid fa-users text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Total Convidados</p>
              <p className="text-xl font-serif text-[#4A3B32]">{allGuests.length}</p>
              <p className="text-[9px] text-stone-400 font-semibold">{familyList.length} famílias</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <i className="fa-solid fa-circle-check text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Confirmados</p>
              <p className="text-xl font-serif text-emerald-600">
                {confirmedGuests.length} <span className="text-xs text-stone-400 font-sans font-normal">/ {allGuests.length}</span>
              </p>
              <p className="text-[9px] text-emerald-700 font-semibold">
                {allGuests.length > 0 ? ((confirmedGuests.length / allGuests.length) * 100).toFixed(0) : 0}% de presença
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#B65B46] shrink-0">
              <i className="fa-solid fa-gift text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Presentes</p>
              <p className="text-xl font-serif text-[#B65B46]">{receivedGifts.length}</p>
              <p className="text-[9px] text-orange-800 font-semibold">Itens comprados</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <i className="fa-solid fa-hand-holding-dollar text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Arrecadado</p>
              <p className="text-lg font-serif text-teal-600">R$ {totalMoney.toFixed(2).replace('.', ',')}</p>
              <p className="text-[9px] text-teal-700 font-semibold">Geladeira: {pct}%</p>
            </div>
          </div>
        </div>
        
        {/* Tab CONTENT: Guests */}
        {activeTab === 'guests' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (Sticky Sidebar on Desktop) */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[140px]">
              {/* Quick Search */}
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Buscar por nome ou família..." 
                  className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3.5 pl-11 text-xs focus:outline-none focus:border-[#B65B46] shadow-xs"
                />
                <i className="fa-solid fa-magnifying-glass text-stone-400 absolute left-4.5 top-1/2 -translate-y-1/2 text-sm" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#B65B46]">
                    <i className="fa-solid fa-circle-xmark text-sm" />
                  </button>
                )}
              </div>

              {/* Register Family */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div>
                  <h3 className="font-serif text-base text-[#4A3B32] border-b pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-plus-circle text-[#B65B46]" />
                    <span>Cadastrar Família</span>
                  </h3>
                  <p className="text-[10px] text-[#4A3B32]/60 leading-relaxed mb-3 mt-1">
                    Adicione um ou mais convidados vinculados a uma chave de busca familiar (ex: charles).
                  </p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={newAlias} 
                      onChange={(e) => setNewAlias(e.target.value)} 
                      placeholder="Chave de Busca (Ex: fernandes)" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#B65B46]" 
                    />
                    <textarea 
                      value={newFamily} 
                      onChange={(e) => setNewFamily(e.target.value)} 
                      placeholder="Nomes dos membros (um por linha)" 
                      rows={4} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none focus:border-[#B65B46]" 
                    />
                    <button 
                      onClick={registerFamily} 
                      className="w-full bg-[#B65B46] text-white uppercase text-[9px] tracking-widest py-2.5 rounded-lg font-bold hover:bg-[#D48C79] transition-colors"
                    >
                      Salvar no Banco
                    </button>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#4A3B32]/80 font-bold mb-1.5">Criar Família Vazia</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={emptyFamilyInput} 
                      onChange={(e) => setEmptyFamilyInput(e.target.value)} 
                      placeholder="Chave da nova família (ex: silva)" 
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#B65B46]" 
                    />
                    <button 
                      onClick={addEmptyFamily} 
                      className="bg-[#4A3B32] text-white uppercase text-[9px] tracking-widest px-4 rounded-lg font-bold hover:bg-stone-700 transition-colors shrink-0"
                    >
                      Criar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Scrollable Families List) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                <h3 className="font-serif text-base text-[#4A3B32] flex items-center gap-2">
                  Famílias Cadastradas
                  <span className="text-[10px] bg-[#B65B46]/15 text-[#B65B46] px-2 py-0.5 rounded-full font-bold">
                    Filtradas: {filteredFamilyList.length} de {familyList.length}
                  </span>
                </h3>
                
                {/* Actions and Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Expand/Collapse */}
                  <div className="flex bg-white rounded-lg border border-stone-200 p-0.5 shadow-sm text-[10px] font-bold">
                    <button 
                      onClick={expandAllFamilies}
                      className="px-2.5 py-1 text-stone-600 hover:text-[#B65B46] hover:bg-stone-50 rounded transition-colors"
                      title="Expandir todas as famílias"
                    >
                      <i className="fa-solid fa-angles-down mr-1" /> Expandir
                    </button>
                    <div className="w-px bg-stone-200 my-1" />
                    <button 
                      onClick={collapseAllFamilies}
                      className="px-2.5 py-1 text-stone-600 hover:text-[#B65B46] hover:bg-stone-50 rounded transition-colors"
                      title="Recolher todas as famílias"
                    >
                      <i className="fa-solid fa-angles-up mr-1" /> Recolher
                    </button>
                  </div>

                  {/* Filter Select */}
                  <div className="flex bg-white rounded-lg border border-stone-200 p-0.5 shadow-sm text-[10px] font-bold">
                    <button 
                      onClick={() => setStatusFilter('all')}
                      className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'all' ? 'bg-[#B65B46] text-white' : 'text-stone-600 hover:text-[#B65B46]'}`}
                    >
                      Todos
                    </button>
                    <button 
                      onClick={() => setStatusFilter('confirmed')}
                      className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'confirmed' ? 'bg-emerald-600 text-white' : 'text-stone-600 hover:text-emerald-600'}`}
                    >
                      Confirmados
                    </button>
                    <button 
                      onClick={() => setStatusFilter('pending')}
                      className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-amber-600'}`}
                    >
                      Pendentes
                    </button>
                    <button 
                      onClick={() => setStatusFilter('empty')}
                      className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'empty' ? 'bg-[#4A3B32] text-white' : 'text-stone-600 hover:text-[#4A3B32]'}`}
                    >
                      Vazias
                    </button>
                  </div>
                </div>
              </div>
              
              {filteredFamilyList.length === 0 ? (
                <p className="text-xs text-[#4A3B32]/50 italic text-center py-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  Nenhum convidado ou família encontrada para os filtros selecionados.
                </p>
              ) : filteredFamilyList.map((familyKey) => {
                const members = filteredFamilies[familyKey] || [];
                const isEmpty = members.length === 0;
                const isCollapsed = collapsedFamilies[familyKey];
                
                return (
                  <div 
                    key={familyKey} 
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setDragOverFamily(familyKey)}
                    onDragLeave={() => setDragOverFamily(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverFamily(null);
                      const guestId = e.dataTransfer.getData('text/plain');
                      handleMoveGuest(guestId, familyKey);
                    }}
                    className={`bg-white rounded-2xl p-4 border shadow-xs transition-all duration-200 ${
                      dragOverFamily === familyKey 
                        ? 'border-[#B65B46] bg-[#B65B46]/5 scale-[1.01] ring-2 ring-[#B65B46]/20' 
                        : isEmpty
                          ? 'border-dashed border-stone-300 bg-stone-50/50'
                          : 'border-stone-200 hover:border-[#B65B46]/25'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b pb-2 border-stone-100">
                      <div className="flex items-center gap-2">
                        {!isEmpty && (
                          <button 
                            onClick={() => toggleFamilyCollapse(familyKey)}
                            className="text-stone-400 hover:text-[#B65B46] transition-colors p-1"
                          >
                            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'} text-xs`} />
                          </button>
                        )}
                        <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-[#B65B46] bg-[#B65B46]/10 px-2 py-0.5 rounded-md">
                          Chave: {familyKey}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">
                          {isEmpty ? '(vazia)' : `(${members.length} ${members.length === 1 ? 'membro' : 'membros'})`}
                        </span>
                        {!isEmpty && isCollapsed && (
                          <div className="flex gap-1 items-center ml-2">
                            {members.every(m => m.confirmed) ? (
                              <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-bold border border-green-200">Confirmados</span>
                            ) : members.every(m => !m.confirmed) ? (
                              <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold border border-amber-200">Pendentes</span>
                            ) : (
                              <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-full font-bold border border-stone-200">
                                {members.filter(m => m.confirmed).length} c / {members.length}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            setAddingToFamily(familyKey);
                            setInlineGuestName('');
                          }}
                          className="text-[9px] uppercase font-bold text-[#B65B46] hover:underline"
                        >
                          + Convidado
                        </button>
                        {isEmpty && (
                          <>
                            <span className="text-stone-300">|</span>
                            <button 
                              onClick={() => setEmptyFamilies(prev => prev.filter(k => k !== familyKey))}
                              className="text-[9px] uppercase font-bold text-red-500 hover:underline"
                            >
                              Remover
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {addingToFamily === familyKey && (
                      <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 space-y-2 mt-2">
                        <p className="text-[10px] font-bold text-[#4A3B32]">Adicionar membro à família "{familyKey}"</p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={inlineGuestName} 
                            onChange={(e) => setInlineGuestName(e.target.value)} 
                            placeholder="Nome Completo" 
                            className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#B65B46]"
                            onKeyDown={(e) => e.key === 'Enter' && saveInlineGuest(familyKey)}
                            autoFocus
                          />
                          <button 
                            onClick={() => saveInlineGuest(familyKey)}
                            className="bg-[#B65B46] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#D48C79] transition-colors shrink-0"
                          >
                            Salvar
                          </button>
                          <button 
                            onClick={() => setAddingToFamily(null)}
                            className="bg-white border border-stone-200 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors shrink-0"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {!isCollapsed && (
                      <div className="divide-y divide-stone-100 mt-2">
                        {isEmpty && addingToFamily !== familyKey ? (
                          <p className="text-[11px] text-stone-400 italic text-center py-4">
                            <i className="fa-solid fa-arrows-up-down-left-right mr-1.5" />
                            Arraste convidados aqui para preencher
                          </p>
                        ) :
                          (addingToFamily === familyKey && isEmpty) ? null :
                          members.map((member) => (
                            <div 
                              key={member.id} 
                              draggable={editingGuestId !== member.id}
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', member.id);
                              }}
                              className={`py-2.5 flex items-center justify-between gap-2 hover:bg-stone-50/50 px-1.5 rounded-lg transition-colors ${
                                editingGuestId !== member.id ? 'cursor-grab active:cursor-grabbing' : ''
                              }`}
                            >
                              {editingGuestId === member.id ? (
                                // Edit Mode
                                <div className="flex flex-col gap-2 flex-1 pt-1">
                                  <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)} 
                                    placeholder="Nome" 
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#B65B46]" 
                                  />
                                  <input 
                                    type="text" 
                                    value={editSearchKey} 
                                    onChange={(e) => setEditSearchKey(e.target.value)} 
                                    placeholder="Família (chave)" 
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#B65B46]" 
                                  />
                                  <div className="flex gap-2 justify-end mt-1">
                                    <button onClick={() => setEditingGuestId(null)} className="px-3 py-1 text-[9px] uppercase tracking-wider border border-stone-300 text-stone-600 rounded-lg font-bold hover:bg-stone-50">Cancelar</button>
                                    <button onClick={() => saveEditGuest(member.id)} className="px-3 py-1 text-[9px] uppercase tracking-wider bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">Salvar</button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <>
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <i className="fa-solid fa-grip-vertical text-stone-300 text-[10px] cursor-grab shrink-0 mr-1.5" />
                                    <button 
                                      onClick={() => toggleConfirmation(member)}
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                        member.confirmed 
                                          ? 'bg-green-500 border-green-500 text-white' 
                                          : 'border-stone-300 text-transparent hover:border-green-500'
                                      }`}
                                    >
                                      <i className="fa-solid fa-check text-[10px]" />
                                    </button>
                                    <div className="flex flex-col min-w-0">
                                      <span className={`text-xs font-semibold truncate ${member.confirmed ? 'text-[#4A3B32]' : 'text-stone-500 font-medium'}`}>
                                        {member.name}
                                      </span>
                                      <span className="text-[9px] text-stone-400">
                                        {member.confirmed 
                                          ? `Confirmado em ${new Date(member.confirmed_at).toLocaleDateString('pt-BR')}`
                                          : 'Pendente'
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button 
                                      onClick={() => {
                                        setEditingGuestId(member.id);
                                        setEditName(member.name);
                                        setEditSearchKey(member.search_key);
                                      }} 
                                      className="text-stone-400 hover:text-[#B65B46] hover:bg-[#B65B46]/5 p-2 rounded-lg transition-all"
                                      title="Editar"
                                    >
                                      <i className="fa-solid fa-pen text-[10px]" />
                                    </button>
                                    <button 
                                      onClick={() => deleteGuest(member.id, member.name)} 
                                      className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                      title="Excluir"
                                    >
                                      <i className="fa-solid fa-trash-can text-[10px]" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab CONTENT: Gifts */}
        {activeTab === 'gifts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (Sticky Sidebar on Desktop) */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[140px]">
              {/* Fridge progress */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-2">
                  <i className="fa-solid fa-bullseye text-[#B65B46] text-lg" />
                  <h4 className="font-serif text-sm text-[#4A3B32] font-semibold">Meta de Arrecadação</h4>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#4A3B32]/60 font-bold mb-1">Meta: Geladeira Inverter</p>
                  <div className="flex justify-between text-xs font-bold text-[#4A3B32] mb-1">
                    <span>R$ {totalMoney.toFixed(2).replace('.', ',')}</span>
                    <span>R$ 4.500,00</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#B65B46] h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="bg-[#B65B46]/5 rounded-xl p-3 border border-[#B65B46]/10 text-center">
                  {moneyRemaining > 0 ? (
                    <p className="text-[11px] text-[#4A3B32] font-medium">
                      Faltam <span className="font-bold text-[#B65B46]">R$ {moneyRemaining.toFixed(2).replace('.', ',')}</span> para atingirmos a meta!
                    </p>
                  ) : (
                    <p className="text-[11px] text-green-700 font-bold">
                      🎉 Parabéns! A meta da geladeira foi atingida!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Gifts List) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                <h3 className="font-serif text-base text-[#4A3B32] flex items-center gap-2">
                  Lista de Presentes &amp; Recados
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                    Total: {sortedGifts.length}
                  </span>
                </h3>

                {/* Gift filters and search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={giftSearchTerm} 
                      onChange={(e) => setGiftSearchTerm(e.target.value)} 
                      placeholder="Filtrar presentes..." 
                      className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 pl-8 text-[11px] focus:outline-none focus:border-[#B65B46] shadow-xs w-44"
                    />
                    <i className="fa-solid fa-magnifying-glass text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px]" />
                    {giftSearchTerm && (
                      <button onClick={() => setGiftSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#B65B46]">
                        <i className="fa-solid fa-circle-xmark text-xs" />
                      </button>
                    )}
                  </div>

                  <select 
                    value={giftSortBy} 
                    onChange={(e) => setGiftSortBy(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-stone-700 focus:outline-none focus:border-[#B65B46] shadow-xs cursor-pointer"
                  >
                    <option value="date_desc">Mais recentes</option>
                    <option value="date_asc">Mais antigos</option>
                    <option value="price_desc">Maior valor</option>
                    <option value="price_asc">Menor valor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 bg-white rounded-2xl p-4 border border-stone-200 shadow-xs min-h-[200px]">
                {sortedGifts.length === 0 ? (
                  <p className="text-xs text-[#4A3B32]/50 italic text-center py-8">Nenhum presente encontrado.</p>
                ) : sortedGifts.map((gift) => (
                  <div key={gift.id} className="bg-stone-50 rounded-xl p-4 border border-stone-200/50 hover:border-[#B65B46]/30 transition-all hover:bg-stone-100/30 flex flex-col md:flex-row md:items-start justify-between gap-3 shadow-xs">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#4A3B32]">{gift.gifter_name}</span>
                        <span className="text-[9px] uppercase tracking-widest text-[#4A3B32]/60 font-bold bg-stone-200/50 px-2 py-0.5 rounded">
                          {gift.item_name}
                        </span>
                      </div>
                      {gift.message && (
                        <p className="text-xs text-stone-600 italic mt-2 border-l-2 border-[#B65B46]/30 pl-2">
                          "{gift.message}"
                        </p>
                      )}
                      <p className="text-[9px] text-stone-400">
                        Pago em {new Date(gift.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 self-end md:self-start">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg shadow-sm border border-emerald-100">
                        R$ {parseFloat(gift.price).toFixed(2).replace('.', ',')}
                      </span>
                      <button 
                        onClick={() => deleteGift(gift.id, gift.gifter_name, gift.item_name)} 
                        className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all cursor-pointer"
                        title="Excluir presente"
                      >
                        <i className="fa-solid fa-trash-can text-[10px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
