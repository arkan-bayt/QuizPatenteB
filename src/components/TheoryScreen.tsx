'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { SIGNAL_CATEGORIES, SignalInfo, SignalCategory } from '@/data/signalsData';
import { getSignalImage } from '@/data/signalImageMap';

// ============================================================
// Helper: Convert hex color to rgba with low opacity
// ============================================================
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================
// TheoryScreen Component
// ============================================================
export default function TheoryScreen() {
  const store = useStore();

  // State
  const [activeCategoryId, setActiveCategoryId] = useState<string>(SIGNAL_CATEGORIES[0]?.id || '');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const tabsRef = useRef<HTMLDivElement>(null);

  // Derived data
  const activeCategory = useMemo(
    () => SIGNAL_CATEGORIES.find((c) => c.id === activeCategoryId),
    [activeCategoryId]
  );

  const signals = activeCategory?.signals || [];

  const selectedSignal = useMemo(
    () => signals.find((s) => s.id === selectedSignalId) || null,
    [signals, selectedSignalId]
  );

  const selectedSignalIndex = useMemo(
    () => signals.findIndex((s) => s.id === selectedSignalId),
    [signals, selectedSignalId]
  );

  const signalImage = useMemo(
    () => (selectedSignalId ? getSignalImage(selectedSignalId) : ''),
    [selectedSignalId]
  );

  // Handlers
  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    setSelectedSignalId(null);
    setView('list');
  };

  const handleSignalSelect = (signalId: string) => {
    setSelectedSignalId(signalId);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedSignalId(null);
    setView('list');
  };

  const handlePrevSignal = () => {
    if (selectedSignalIndex > 0) {
      const prev = signals[selectedSignalIndex - 1];
      setSelectedSignalId(prev.id);
    }
  };

  const handleNextSignal = () => {
    if (selectedSignalIndex < signals.length - 1) {
      const next = signals[selectedSignalIndex + 1];
      setSelectedSignalId(next.id);
    }
  };

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector(`[data-cat="${activeCategoryId}"]`) as HTMLElement | null;
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategoryId]);

  // ============================================================
  // RENDER — Signal Detail View
  // ============================================================
  if (view === 'detail' && selectedSignal && activeCategory) {
    const catColor = activeCategory.color;
    const hasImage = signalImage.length > 0;

    return (
      <div className="min-h-screen bg-mesh pb-8">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-header">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Indietro
            </button>
            <div className="flex-1 text-center">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {activeCategory.icon} {activeCategory.name}
              </span>
            </div>
            {/* Counter */}
            <div
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: catColor, background: hexToRgba(catColor, 0.08) }}
            >
              Segnale {selectedSignalIndex + 1} di {signals.length}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5 anim-up">
          {/* Signal Image */}
          <div className="flex justify-center">
            {hasImage ? (
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: hexToRgba(catColor, 0.04),
                  border: `2px solid ${hexToRgba(catColor, 0.15)}`,
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signalImage}
                  alt={selectedSignal.name}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback hidden by default */}
                <div className="hidden w-full h-full flex-col items-center justify-center gap-2">
                  <span className="text-5xl">{activeCategory.icon}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Nessuna immagine</span>
                </div>
              </div>
            ) : (
              <div
                className="w-44 h-44 rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{
                  background: hexToRgba(catColor, 0.06),
                  border: `2px dashed ${hexToRgba(catColor, 0.25)}`,
                }}
              >
                <span className="text-6xl">{activeCategory.icon}</span>
                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Nessuna immagine</span>
              </div>
            )}
          </div>

          {/* Signal Name */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {selectedSignal.name}
            </h1>
            {/* Shape badge */}
            <div className="flex justify-center mt-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  color: catColor,
                  background: hexToRgba(catColor, 0.08),
                  border: `1px solid ${hexToRgba(catColor, 0.2)}`,
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                </svg>
                {selectedSignal.shape}
              </span>
            </div>
          </div>

          {/* Description Boxes */}
          <div className="space-y-4">
            {/* Italian Description */}
            <div
              className="rounded-2xl overflow-hidden anim-up"
              style={{
                background: hexToRgba(catColor, 0.03),
                border: `1px solid ${hexToRgba(catColor, 0.12)}`,
              }}
            >
              <div
                className="px-4 py-2.5 flex items-center gap-2 border-b"
                style={{ borderColor: hexToRgba(catColor, 0.12) }}
              >
                <span className="text-sm">🇮🇹</span>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  Italiano
                </span>
              </div>
              <div className="px-4 py-3 space-y-3">
                <BulletPoint
                  text={selectedSignal.description}
                  dotColor={catColor}
                  textColor="var(--text-primary)"
                />
                <BulletPoint
                  text={selectedSignal.whenToObeyIt}
                  dotColor={catColor}
                  textColor="var(--text-secondary)"
                />
                <BulletPoint
                  text={selectedSignal.whatHappensIfIgnored}
                  dotColor={catColor}
                  textColor="var(--text-secondary)"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrevSignal}
              disabled={selectedSignalIndex === 0}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: hexToRgba(catColor, 0.08),
                color: catColor,
                border: `1px solid ${hexToRgba(catColor, 0.2)}`,
              }}
            >
              <svg className="w-4 h-4 inline-block ml-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              Precedente
            </button>
            <button
              onClick={handleNextSignal}
              disabled={selectedSignalIndex === signals.length - 1}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: catColor,
              }}
            >
              Successivo
              <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Progress dots */}
          {signals.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1 pb-2">
              {signals.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSignalId(s.id)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === selectedSignalIndex ? 18 : 6,
                    height: 6,
                    background: i === selectedSignalIndex ? catColor : hexToRgba(catColor, 0.2),
                  }}
                  aria-label={`Signal ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Signal List View
  // ============================================================
  return (
    <div className="min-h-screen bg-mesh pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button
            onClick={() => store.goHome()}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Home
          </button>
          <div className="flex-1" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Title */}
        <div className="anim-up">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            📖 Teoria
          </h1>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Guida completa a tutti i segnali e argomenti della patente di guida italiana
          </p>
        </div>

        {/* Category Tabs */}
        <div className="anim-up">
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {SIGNAL_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: isActive ? cat.color : 'var(--bg-secondary)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    border: isActive ? 'none' : '1px solid var(--border)',
                    boxShadow: isActive ? `0 2px 8px ${hexToRgba(cat.color, 0.3)}` : 'none',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Header */}
        {activeCategory && (
          <div className="anim-fade">
            <div
              className="card overflow-hidden"
              style={{ borderTop: `3px solid ${activeCategory.color}` }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: hexToRgba(activeCategory.color, 0.1) }}
                  >
                    {activeCategory.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {activeCategory.name}
                    </h2>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      color: activeCategory.color,
                      background: hexToRgba(activeCategory.color, 0.08),
                    }}
                  >
                    {signals.length} segnali
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeCategory.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Signal Cards */}
        <div className="space-y-2.5">
          {signals.map((signal, idx) => {
            const img = getSignalImage(signal.id);
            const hasImg = img.length > 0;
            const catColor = activeCategory?.color || '#6B7280';

            return (
              <button
                key={signal.id}
                onClick={() => handleSignalSelect(signal.id)}
                className="card card-hover w-full text-right p-3 flex items-center gap-3 anim-up"
                style={{
                  animationDelay: `${idx * 30}ms`,
                  borderRight: `3px solid ${catColor}`,
                }}
              >
                {/* Signal image or icon */}
                <div
                  className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: hexToRgba(catColor, 0.06),
                    border: `1px solid ${hexToRgba(catColor, 0.12)}`,
                  }}
                >
                  {hasImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={signal.name}
                      className="w-11 h-11 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <span
                    className={`${hasImg ? 'hidden' : 'flex'} text-2xl`}
                    style={hasImg ? undefined : { display: 'flex' }}
                  >
                    {activeCategory?.icon}
                  </span>
                </div>

                {/* Signal info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {signal.name}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {signals.length === 0 && (
          <div className="card p-8 text-center anim-fade">
            <span className="text-4xl block mb-3">📭</span>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Nessun segnale in questa sezione
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BulletPoint Sub-component
// ============================================================
function BulletPoint({
  text,
  dotColor,
  textColor,
}: {
  text: string;
  dotColor: string;
  textColor: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 mt-[7px]"
        style={{ background: dotColor }}
      />
      <span
        className="text-[13px] leading-relaxed"
        style={{ color: textColor }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
