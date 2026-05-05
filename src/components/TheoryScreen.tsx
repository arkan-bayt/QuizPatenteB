'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { SIGNAL_CATEGORIES, SignalInfo, SignalCategory } from '@/data/signalsData';
import { getSignalImage } from '@/data/signalImageMap';
import { signalArabicTranslations } from '@/data/signalArabicTranslations';
import { speakText, stopSpeech, isSpeaking } from '@/logic/ttsEngine';
import SignIcon from '@/components/SignIcon';
import {
  THEORY_TOPICS,
  THEORY_CHAPTERS,
  TheoryChapter,
  getTheoryChapter,
  getChaptersByTopic,
} from '@/data/theoryChapters';

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

  // ── State ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'signals' | 'chapters'>('signals');
  const [view, setView] = useState<'home' | 'signalDetail' | 'chapterDetail'>('home');

  // Signal state
  const [activeCategoryId, setActiveCategoryId] = useState<string>(SIGNAL_CATEGORIES[0]?.id || '');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  // Chapter state
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [playingIt, setPlayingIt] = useState(false);
  const [playingAr, setPlayingAr] = useState(false);

  // Stop speech when signal changes
  useEffect(() => {
    stopSpeech();
    setPlayingIt(false);
    setPlayingAr(false);
  }, [selectedSignalId]);

  // ── Derived: Signals ───────────────────────────────────────
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

  // ── Derived: Chapters ──────────────────────────────────────
  const selectedChapter = useMemo(
    () => (selectedChapterId ? getTheoryChapter(selectedChapterId) : null),
    [selectedChapterId]
  );

  const chaptersByTopic = useMemo(
    () => THEORY_TOPICS.map((topic) => ({
      topic,
      chapters: getChaptersByTopic(topic.name),
    })),
    []
  );

  // ── Handlers: TTS ────────────────────────────────────────
  const handlePlayItalian = useCallback(() => {
    if (!selectedSignal) return;
    setPlayingIt(true);
    stopSpeech();
    const fullText = `${selectedSignal.name}. ${selectedSignal.description}. ${selectedSignal.whenToObeyIt}. ${selectedSignal.whatHappensIfIgnored}`;
    speakText(fullText.substring(0, 200), 'it-IT').finally(() => setPlayingIt(false));
  }, [selectedSignal]);

  const handlePlayArabic = useCallback(() => {
    if (!selectedSignalId) return;
    const ar = signalArabicTranslations[selectedSignalId];
    if (!ar) return;
    setPlayingAr(true);
    stopSpeech();
    const fullText = `${ar.name}. ${ar.description}. ${ar.whenToObeyIt}. ${ar.whatHappensIfIgnored}`;
    speakText(fullText.substring(0, 200), 'ar').finally(() => setPlayingAr(false));
  }, [selectedSignalId]);

  // ── Handlers: Signals ──────────────────────────────────────
  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    setSelectedSignalId(null);
  };

  const handleSignalSelect = (signalId: string) => {
    setSelectedSignalId(signalId);
    setView('signalDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromSignal = () => {
    setSelectedSignalId(null);
    setView('home');
  };

  const handlePrevSignal = () => {
    if (selectedSignalIndex > 0) {
      const prev = signals[selectedSignalIndex - 1];
      setSelectedSignalId(prev.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSignal = () => {
    if (selectedSignalIndex < signals.length - 1) {
      const next = signals[selectedSignalIndex + 1];
      setSelectedSignalId(next.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Handlers: Chapters ─────────────────────────────────────
  const handleChapterSelect = (id: number) => {
    setSelectedChapterId(id);
    setView('chapterDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromChapter = () => {
    setSelectedChapterId(null);
    setView('home');
  };

  // ── Handlers: Navigation ───────────────────────────────────
  const handleTabChange = (tab: 'signals' | 'chapters') => {
    setActiveTab(tab);
    setSelectedSignalId(null);
    setSelectedChapterId(null);
    setView('home');
  };

  const handleGoHome = () => {
    setView('home');
    setSelectedSignalId(null);
    setSelectedChapterId(null);
  };

  // Auto-scroll active category tab into view
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
  if (view === 'signalDetail' && selectedSignal && activeCategory) {
    const catColor = activeCategory.color;
    const hasImage = signalImage.length > 0;

    return (
      <div className="min-h-screen bg-mesh pb-8">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-header">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
            <button
              onClick={handleBackFromSignal}
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
            <div
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: catColor, background: hexToRgba(catColor, 0.08) }}
            >
              Segnale {selectedSignalIndex + 1} di {signals.length}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5 anim-up">
          {/* Signal Image / SVG Icon */}
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
                    const fallback = (e.target as HTMLImageElement).nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
                <div className="w-full h-full hidden flex-col items-center justify-center">
                  <SignIcon signalId={selectedSignal.id} categoryId={activeCategoryId} size={120} />
                </div>
              </div>
            ) : (
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center"
                style={{
                  background: hexToRgba(catColor, 0.06),
                  border: `2px solid ${hexToRgba(catColor, 0.2)}`,
                }}
              >
                <SignIcon signalId={selectedSignal.id} categoryId={activeCategoryId} size={120} />
              </div>
            )}
          </div>

          {/* Signal Name */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {selectedSignal.name}
            </h1>
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
            {/* Italian Section */}
            <div
              className="rounded-2xl overflow-hidden anim-up"
              style={{
                background: hexToRgba(catColor, 0.03),
                border: `1px solid ${hexToRgba(catColor, 0.12)}`,
              }}
            >
              <div
                className="px-4 py-2.5 flex items-center justify-between border-b"
                style={{ borderColor: hexToRgba(catColor, 0.12) }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🇮🇹</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Italiano
                  </span>
                </div>
                <button
                  onClick={handlePlayItalian}
                  disabled={playingIt}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: hexToRgba(catColor, 0.08),
                    color: catColor,
                  }}
                >
                  {playingIt ? (
                    <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.22l-7.5 6.002c-.97.776-.97 2.274 0 3.05l7.5 6.002c.944.785 2.56.116 2.56-1.22V4.06z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  )}
                  Ascolta
                </button>
              </div>
              <div className="px-4 py-3 space-y-3">
                <BulletPoint text={selectedSignal.description} dotColor={catColor} textColor="var(--text-primary)" />
                <BulletPoint text={selectedSignal.whenToObeyIt} dotColor={catColor} textColor="var(--text-secondary)" />
                <BulletPoint text={selectedSignal.whatHappensIfIgnored} dotColor={catColor} textColor="var(--text-secondary)" />
              </div>
            </div>

            {/* Arabic Section */}
            {selectedSignalId && signalArabicTranslations[selectedSignalId] && (
              <div
                className="rounded-2xl overflow-hidden anim-up"
                style={{
                  background: 'rgba(79, 70, 229, 0.03)',
                  border: '1px solid rgba(79, 70, 229, 0.12)',
                }}
              >
                <div
                  className="px-4 py-2.5 flex items-center justify-between border-b"
                  style={{ borderColor: 'rgba(79, 70, 229, 0.12)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇸🇦</span>
                    <span className="text-xs font-bold" style={{ color: '#4F46E5' }}>
                      العربية
                    </span>
                  </div>
                  <button
                    onClick={handlePlayArabic}
                    disabled={playingAr}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'rgba(79, 70, 229, 0.08)',
                      color: '#4F46E5',
                    }}
                  >
                    {playingAr ? (
                      <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.22l-7.5 6.002c-.97.776-.97 2.274 0 3.05l7.5 6.002c.944.785 2.56.116 2.56-1.22V4.06z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                    )}
                    استمع
                  </button>
                </div>
                <div className="px-4 py-3 space-y-3" dir="rtl">
                  <p className="text-sm font-bold leading-relaxed" style={{ color: '#4F46E5' }}>
                    {signalArabicTranslations[selectedSignalId].name}
                  </p>
                  <BulletPoint text={signalArabicTranslations[selectedSignalId].description} dotColor="#4F46E5" textColor="var(--text-primary)" />
                  <BulletPoint text={signalArabicTranslations[selectedSignalId].whenToObeyIt} dotColor="#4F46E5" textColor="var(--text-secondary)" />
                  <BulletPoint text={signalArabicTranslations[selectedSignalId].whatHappensIfIgnored} dotColor="#4F46E5" textColor="var(--text-secondary)" />
                </div>
              </div>
            )}
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
              style={{ background: catColor }}
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
  // RENDER — Chapter Detail View
  // ============================================================
  if (view === 'chapterDetail' && selectedChapter) {
    const ch = selectedChapter;
    const chColor = ch.color;

    return (
      <div className="min-h-screen bg-mesh pb-8">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-header">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
            <button
              onClick={handleBackFromChapter}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Indietro
            </button>
            <div className="flex-1 min-w-0 text-center">
              <span className="text-xs font-bold truncate block" style={{ color: 'var(--text-primary)' }}>
                Capitolo {ch.id}
              </span>
            </div>
            <span
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
              style={{ color: chColor, background: hexToRgba(chColor, 0.08) }}
            >
              {ch.topicGroup}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5 anim-up">
          {/* Chapter Icon & Title */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: hexToRgba(chColor, 0.1),
                border: `2px solid ${hexToRgba(chColor, 0.2)}`,
              }}
            >
              {ch.icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {ch.title}
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {ch.topicGroup}
              </p>
            </div>
          </div>

          {/* ── Overview ────────────────────────────────────── */}
          {ch.overview && (
            <SectionBlock
              icon="📖"
              title="Panoramica"
              color={chColor}
            >
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {ch.overview}
              </p>
            </SectionBlock>
          )}

          {/* ── Key Points ──────────────────────────────────── */}
          {ch.keyPoints.length > 0 && (
            <SectionBlock
              icon="🔑"
              title="Punti chiave"
              color={chColor}
            >
              <div className="space-y-3">
                {ch.keyPoints.map((kp, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-[7px]"
                      style={{ background: chColor }}
                    />
                    <div>
                      <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {kp.title}
                      </p>
                      <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {kp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* ── Rules ───────────────────────────────────────── */}
          {ch.rules.length > 0 && (
            <SectionBlock
              icon="⚖️"
              title="Regole importanti"
              color={chColor}
            >
              <div className="space-y-3">
                {ch.rules.map((rule, i) => (
                  <RuleItem key={i} title={rule.title} description={rule.description} color={chColor} />
                ))}
              </div>
            </SectionBlock>
          )}

          {/* ── Common Mistakes ─────────────────────────────── */}
          {ch.commonMistakes.length > 0 && (
            <SectionBlock
              icon="⚠️"
              title="Errori comuni"
              color="#EF4444"
            >
              <div className="space-y-2">
                {ch.commonMistakes.map((mistake, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: hexToRgba('#EF4444', 0.04),
                      border: `1px solid ${hexToRgba('#EF4444', 0.1)}`,
                    }}
                  >
                    <span className="text-sm flex-shrink-0 mt-px">✕</span>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {mistake}
                    </p>
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* ── Memory Tips ─────────────────────────────────── */}
          {ch.memoryTips.length > 0 && (
            <SectionBlock
              icon="💡"
              title="Trucchi di memoria"
              color="#F59E0B"
            >
              <div className="space-y-2">
                {ch.memoryTips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: hexToRgba('#F59E0B', 0.04),
                      border: `1px solid ${hexToRgba('#F59E0B', 0.1)}`,
                    }}
                  >
                    <span className="text-sm flex-shrink-0 mt-px">💡</span>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* ── Important Numbers ───────────────────────────── */}
          {ch.importantNumbers.length > 0 && (
            <SectionBlock
              icon="🔢"
              title="Numeri importanti"
              color={chColor}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ch.importantNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-3 py-2.5 text-center"
                    style={{
                      background: hexToRgba(chColor, 0.06),
                      border: `1px solid ${hexToRgba(chColor, 0.12)}`,
                    }}
                  >
                    <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                      {num.label}
                    </p>
                    <p className="text-sm font-bold" style={{ color: chColor }}>
                      {num.value}
                    </p>
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Chapter Navigation */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                const prev = THEORY_CHAPTERS.find((c) => c.id === (selectedChapterId || 0) - 1);
                if (prev) {
                  setSelectedChapterId(prev.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={!THEORY_CHAPTERS.find((c) => c.id === (selectedChapterId || 0) - 1)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: hexToRgba(chColor, 0.08),
                color: chColor,
                border: `1px solid ${hexToRgba(chColor, 0.2)}`,
              }}
            >
              <svg className="w-4 h-4 inline-block ml-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              Precedente
            </button>
            <button
              onClick={() => {
                const next = THEORY_CHAPTERS.find((c) => c.id === (selectedChapterId || 0) + 1);
                if (next) {
                  setSelectedChapterId(next.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={!THEORY_CHAPTERS.find((c) => c.id === (selectedChapterId || 0) + 1)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: chColor }}
            >
              Successivo
              <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Chapter progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1 pb-2">
            {THEORY_CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedChapterId(c.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: c.id === selectedChapterId ? 18 : 6,
                  height: 6,
                  background: c.id === selectedChapterId ? chColor : hexToRgba(chColor, 0.2),
                }}
                aria-label={`Capitolo ${c.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Home View
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

        {/* Main Tabs: Segnali / Capitoli */}
        <div className="anim-up">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => handleTabChange('signals')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: activeTab === 'signals' ? '#EF4444' : 'transparent',
                color: activeTab === 'signals' ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: activeTab === 'signals' ? '0 2px 8px rgba(239,68,68,0.3)' : 'none',
              }}
            >
              <span>🚦</span>
              <span>Segnali Stradali</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md"
                style={{
                  background: activeTab === 'signals' ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)',
                  color: activeTab === 'signals' ? '#fff' : 'var(--text-muted)',
                }}
              >
                {SIGNAL_CATEGORIES.reduce((sum, c) => sum + c.signals.length, 0)}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('chapters')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: activeTab === 'chapters' ? '#3B82F6' : 'transparent',
                color: activeTab === 'chapters' ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: activeTab === 'chapters' ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
              }}
            >
              <span>📚</span>
              <span>Capitoli</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md"
                style={{
                  background: activeTab === 'chapters' ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)',
                  color: activeTab === 'chapters' ? '#fff' : 'var(--text-muted)',
                }}
              >
                {THEORY_CHAPTERS.length}
              </span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            SIGNALS TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'signals' && (
          <>
            {/* Category Tabs */}
            <div className="anim-up">
              <div
                ref={tabsRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                    <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
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
                const catId = activeCategory?.id || '';

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
                    <div
                      className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{
                        background: hexToRgba(catColor, 0.06),
                        border: `1px solid ${hexToRgba(catColor, 0.12)}`,
                      }}
                    >
                      {hasImg ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={signal.name}
                            className="w-11 h-11 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fb = target.nextElementSibling;
                              if (fb) (fb as HTMLElement).style.display = 'flex';
                            }}
                          />
                          <div className="w-11 h-11 items-center justify-center" style={{ display: 'none' }}>
                            <SignIcon signalId={signal.id} categoryId={catId} size={40} />
                          </div>
                        </>
                      ) : (
                        <SignIcon signalId={signal.id} categoryId={catId} size={40} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {signal.name}
                      </p>
                    </div>
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
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            CHAPTERS TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            {chaptersByTopic.map(({ topic, chapters }) => (
              <div key={topic.name} className="anim-up">
                {/* Topic Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: hexToRgba(topic.color, 0.1) }}
                  >
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {topic.name}
                    </h2>
                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {topic.description}
                    </p>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{
                      color: topic.color,
                      background: hexToRgba(topic.color, 0.08),
                    }}
                  >
                    {chapters.length} cap.
                  </span>
                </div>

                {/* Chapter Cards */}
                <div className="space-y-2">
                  {chapters.map((chapter, idx) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                      className="card card-hover w-full p-3.5 flex items-center gap-3 anim-up"
                      style={{
                        animationDelay: `${idx * 30}ms`,
                        borderRight: `3px solid ${chapter.color}`,
                      }}
                    >
                      {/* Chapter number */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{
                          background: hexToRgba(chapter.color, 0.1),
                          color: chapter.color,
                        }}
                      >
                        {chapter.id}
                      </div>

                      {/* Chapter icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          background: hexToRgba(chapter.color, 0.06),
                          border: `1px solid ${hexToRgba(chapter.color, 0.1)}`,
                        }}
                      >
                        {chapter.icon}
                      </div>

                      {/* Chapter info */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {chapter.title}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {chapter.keyPoints.length} punti chiave · {chapter.rules.length} regole
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

/** Reusable section wrapper with colored header */
function SectionBlock({
  icon,
  title,
  color,
  children,
}: {
  icon: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden anim-up"
      style={{
        background: hexToRgba(color, 0.03),
        border: `1px solid ${hexToRgba(color, 0.1)}`,
      }}
    >
      <div
        className="px-4 py-2.5 flex items-center gap-2 border-b"
        style={{ borderColor: hexToRgba(color, 0.1) }}
      >
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
      </div>
      <div className="px-4 py-3">
        {children}
      </div>
    </div>
  );
}

/** Rule item with highlighted title */
function RuleItem({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 mt-[7px]"
        style={{ background: color }}
      />
      <div>
        <p className="text-[13px] font-bold leading-snug" style={{ color: color }}>
          {title}
        </p>
        <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/** Bullet point with dot */
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
