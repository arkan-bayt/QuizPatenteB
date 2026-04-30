'use client';
import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { SIGNAL_CATEGORIES, type SignalCategory, type SignalInfo } from '@/data/signalsData';
import SignIcon from './SignIcon';

export default function SignalsGuideScreen() {
  const store = useStore();
  const [activeCategory, setActiveCategory] = useState<string>(SIGNAL_CATEGORIES[0]?.id || 'pericolo');
  const [search, setSearch] = useState('');
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);

  const category = useMemo(() => {
    return SIGNAL_CATEGORIES.find((c) => c.id === activeCategory);
  }, [activeCategory]);

  // Search across all categories
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase().trim();
    const results: { signal: SignalInfo; category: SignalCategory }[] = [];
    for (const cat of SIGNAL_CATEGORIES) {
      for (const sig of cat.signals) {
        if (
          sig.nameIt.toLowerCase().includes(q) ||
          sig.nameAr.includes(q) ||
          sig.descriptionIt.toLowerCase().includes(q) ||
          sig.descriptionAr.includes(q) ||
          sig.shape.toLowerCase().includes(q)
        ) {
          results.push({ signal: sig, category: cat });
        }
      }
    }
    return results;
  }, [search]);

  const displaySignals = search.trim() ? (searchResults || []) : (category?.signals || []).map((s) => ({ signal: s, category: category! }));

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.setScreen('explanations')} className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Atlante dei Segnali</h1>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>أطلس الإشارات</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)' }}>
            <span className="text-base">🚦</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Search Bar */}
        <div className="anim-up relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca segnale..."
            className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-subtle)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--primary-light)' }}>
              ✕
            </button>
          )}
        </div>

        {/* Category Tabs - Only show when not searching */}
        {!search.trim() && (
          <div className="anim-up" style={{ animationDelay: '60ms' }}>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              {SIGNAL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setExpandedSignal(null); }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      background: isActive ? cat.color : 'var(--bg-card)',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      border: isActive ? 'none' : '1.5px solid var(--border-subtle)',
                      boxShadow: isActive ? `0 2px 10px ${cat.color}40` : 'none',
                    }}>
                    <span className="text-sm">{cat.icon}</span>
                    {cat.nameIt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Description */}
        {!search.trim() && category && (
          <div className="glass p-4 anim-up" style={{ animationDelay: '80ms', borderLeft: `3px solid ${category.color}` }}>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{category.descriptionIt}</p>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{category.descriptionAr}</p>
          </div>
        )}

        {/* Search Results Info */}
        {search.trim() && (
          <div className="anim-up flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              {displaySignals.length} {displaySignals.length === 1 ? 'risultato' : 'risultati'}
            </span>
          </div>
        )}

        {/* Signal Cards */}
        <div className="space-y-3">
          {displaySignals.map(({ signal, category: sigCat }, si) => {
            const key = signal.id;
            const isOpen = expandedSignal === key;
            return (
              <div
                key={key}
                className="glass overflow-hidden anim-up transition-all duration-300"
                style={{ animationDelay: `${(si * 40) + 100}ms`, borderLeft: `3px solid ${sigCat.color}` }}>
                {/* Signal Header */}
                <button
                  onClick={() => setExpandedSignal(isOpen ? null : key)}
                  className="w-full px-4 py-4 text-left">
                  <div className="flex items-start gap-4">
                    {/* Signal Visual Icon */}
                    <div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center flex-shrink-0 p-1.5"
                      style={{ background: `${sigCat.color}08`, border: `1.5px solid ${sigCat.color}20` }}>
                      <SignIcon signalId={signal.id} categoryId={sigCat.id} size={58} />
                    </div>

                    {/* Signal Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{signal.nameIt}</p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{signal.nameAr}</p>
                      {/* Shape Badge */}
                      <div className="mt-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${sigCat.color}12`, color: sigCat.color }}>
                          {signal.shape}
                        </span>
                      </div>
                    </div>

                    {/* Expand Arrow */}
                    <svg
                      className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-muted)' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="anim-fade" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    {/* Large Signal Image */}
                    <div className="flex items-center justify-center py-5" style={{ background: 'linear-gradient(180deg, var(--bg-tertiary), transparent)' }}>
                      <div className="relative">
                        <div className="absolute -inset-3 rounded-full" style={{ background: `${sigCat.color}08`, filter: 'blur(8px)' }} />
                        <SignIcon signalId={signal.id} categoryId={sigCat.id} size={120} className="relative" />
                      </div>
                    </div>

                    <div className="px-4 pb-5 space-y-4">
                      {/* Description */}
                      <div>
                        <p className="text-[12px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Descrizione / الوصف</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{signal.descriptionIt}</p>
                        <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{signal.descriptionAr}</p>
                      </div>

                      {/* When to Obey */}
                      <div className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-[11px] font-bold" style={{ color: 'var(--success)' }}>Quando rispettare / متى تلتزم</p>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{signal.whenToObeyIt}</p>
                      </div>

                      {/* What happens if ignored */}
                      <div className="p-3" style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 'var(--radius-lg)', borderLeft: `2px solid var(--danger)` }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg className="w-3.5 h-3.5" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <p className="text-[11px] font-bold" style={{ color: 'var(--danger)' }}>Se ignorato / في حالة التجاهل</p>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{signal.whatHappensIfIgnored}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {displaySignals.length === 0 && (
            <div className="glass p-8 text-center anim-fade">
              <span className="text-3xl block mb-3">🔍</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessun segnale trovato</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Prova con un termine diverso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
