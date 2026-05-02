'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { translateWord } from '@/logic/translationCache';
import { speakWord } from '@/logic/ttsEngine';

interface WordTranslatorProps {
  word: string;
  position: { x: number; y: number };
  onClose: (translation: string) => void;
}

export default function WordTranslator({ word, position, onClose }: WordTranslatorProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(true);
  const [playingIt, setPlayingIt] = useState(false);
  const [playingAr, setPlayingAr] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  // Fetch translation
  useEffect(() => {
    let cancelled = false;
    setTranslating(true);
    setTranslation(null);

    translateWord(word).then((tr) => {
      if (!cancelled) {
        setTranslation(tr);
        setTranslating(false);
      }
    });

    return () => { cancelled = true; };
  }, [word]);

  // Adjust position to stay within viewport
  useEffect(() => {
    if (!popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    let x = position.x;
    let y = position.y;

    // Horizontal bounds
    if (x + 280 > vw) x = Math.max(8, vw - 288);
    if (x < 8) x = 8;

    // Vertical bounds - prefer showing above the tap point
    if (y + 180 > vh) y = Math.max(8, y - 190);
    if (y < 60) y = 60;

    setAdjustedPos({ x, y });
  }, [position]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(translation || '');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handlePlayIt = useCallback(() => {
    setPlayingIt(true);
    speakWord(word, 'it');
    setTimeout(() => setPlayingIt(false), 1500);
  }, [word]);

  const handlePlayAr = useCallback(() => {
    if (!translation) return;
    setPlayingAr(true);
    speakWord(translation, 'ar');
    setTimeout(() => setPlayingAr(false), 1500);
  }, [translation]);

  const handleClose = useCallback(() => {
    onClose(translation || '');
  }, [translation, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        onTouchStart={handleClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed z-50 anim-fade"
        style={{
          left: adjustedPos.x,
          top: adjustedPos.y,
          minWidth: '240px',
          maxWidth: '280px',
        }}
      >
        <div
          className="rounded-2xl p-4 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(30, 58, 138, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Header: Close button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(79, 70, 229, 0.08)' }}
              >
                <svg className="w-3 h-3" style={{ color: '#4F46E5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold" style={{ color: '#4F46E5' }}>ترجمة</span>
            </div>
            <button
              onClick={handleClose}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
            >
              <svg className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Italian word */}
          <div className="mb-2.5">
            <p
              className="text-[16px] font-bold"
              dir="ltr"
              style={{ color: '#111827' }}
            >
              {word}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 flex-shrink-0" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>

          {/* Arabic translation */}
          <div className="mb-3 min-h-[28px]">
            {translating ? (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[12px]" style={{ color: '#6B7280' }}>جاري الترجمة...</span>
              </div>
            ) : translation ? (
              <p
                className="text-[18px] font-extrabold leading-relaxed"
                dir="rtl"
                style={{ color: '#4F46E5' }}
              >
                {translation}
              </p>
            ) : (
              <p className="text-[12px]" dir="rtl" style={{ color: '#6B7280', fontStyle: 'italic' }}>
                لم يتم العثور على ترجمة
              </p>
            )}
          </div>

          {/* Pronunciation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayIt}
              disabled={playingIt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                background: '#F3F4F6',
                border: '1px solid #E5E7EB',
                color: '#374151',
              }}
            >
              {playingIt ? (
                <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.22l-7.5 6.002c-.97.776-.97 2.274 0 3.05l7.5 6.002c.944.785 2.56.116 2.56-1.22V4.06z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
              Ascolta
            </button>

            {translation && (
              <button
                onClick={handlePlayAr}
                disabled={playingAr}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'rgba(79, 70, 229, 0.08)',
                  border: '1px solid rgba(79, 70, 229, 0.16)',
                  color: '#4F46E5',
                }}
              >
                {playingAr ? (
                  <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.22l-7.5 6.002c-.97.776-.97 2.274 0 3.05l7.5 6.002c.944.785 2.56.116 2.56-1.22V4.06z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
                استمع
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
