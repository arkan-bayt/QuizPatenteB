'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { speakText, stopSpeech, isSpeaking } from '@/logic/ttsEngine';

// ============================================================
// LESSON INDEX - 30 lessons from the official theory book
// "Manuale di Teoria per le patenti A1, A e B"
// by Valerio Platia & Roberto Mastri
// ============================================================

interface BookLesson {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  hasImages: boolean;
}

const LESSONS: BookLesson[] = [
  { id: 1, title: 'Definizioni Stradali e di Traffico', shortTitle: 'تعريفات الطرق', icon: '📖', hasImages: false },
  { id: 2, title: 'Segnali di Pericolo', shortTitle: 'إشارات الخطر', icon: '⚠️', hasImages: true },
  { id: 3, title: 'Segnali di Precedenza', shortTitle: 'إشارات الأسبقية', icon: '🔻', hasImages: true },
  { id: 4, title: 'Segnali di Divieto', shortTitle: 'إشارات المنع', icon: '🚫', hasImages: true },
  { id: 5, title: 'Segnali di Obbligo', shortTitle: 'إشارات الإلزام', icon: '🔵', hasImages: true },
  { id: 6, title: 'Segnali di Indicazione', shortTitle: 'إشارات الدلالة', icon: '📋', hasImages: true },
  { id: 7, title: 'Segnali Temporanei e di Cantiere', shortTitle: 'إشارات مؤقتة', icon: '🚧', hasImages: true },
  { id: 8, title: 'Segnali Complementari', shortTitle: 'إشارات مكملة', icon: '📌', hasImages: true },
  { id: 9, title: 'Pannelli Integrativi dei Segnali', shortTitle: 'لوحات تكميلية', icon: '🏷️', hasImages: true },
  { id: 10, title: 'Semafori e Segnali degli Agenti', shortTitle: 'إشارات المرور', icon: '🚦', hasImages: true },
  { id: 11, title: 'Segnaletica Orizzontale', shortTitle: 'الشارات الأفقية', icon: '➖', hasImages: true },
  { id: 12, title: 'Pericolo, Intralcio e Velocita', shortTitle: 'الخطر والسرعة', icon: '⚡', hasImages: false },
  { id: 13, title: 'Posizione dei Veicoli sulla Carreggiata', shortTitle: 'موقع المركبات', icon: '🚗', hasImages: false },
  { id: 14, title: 'Norme sulla Precedenza (Incroci)', shortTitle: 'قواعد الأسبقية', icon: '↔️', hasImages: true },
  { id: 15, title: 'Sorpasso', shortTitle: 'التجاوز', icon: '🔄', hasImages: false },
  { id: 16, title: 'Fermata e Sosta', shortTitle: 'التوقف والانتظار', icon: '🅿️', hasImages: true },
  { id: 17, title: 'Ingombro della Carreggiata', shortTitle: 'سد الطريق', icon: '🚷', hasImages: false },
  { id: 18, title: 'Circolazione sulle Strade Extraurbane', shortTitle: 'الطرق الخارجية', icon: '🛣️', hasImages: false },
  { id: 19, title: 'Dispositivi di Equipaggiamento', shortTitle: 'أجهزة المركبات', icon: '💡', hasImages: true },
  { id: 20, title: 'Spie e Simboli sui Comandi', shortTitle: 'مؤشرات القيادة', icon: '🎛️', hasImages: true },
  { id: 21, title: 'Cinture di Sicurezza e Airbag', shortTitle: 'الأحزمة والأكياس الهوائية', icon: '🛡️', hasImages: false },
  { id: 22, title: 'Trasporto di Persone e Carico', shortTitle: 'نقل الأشخاص والأحمال', icon: '📦', hasImages: true },
  { id: 23, title: 'Patenti di Guida', shortTitle: 'رخص القيادة', icon: '🪪', hasImages: false },
  { id: 24, title: 'Obblighi e Documenti di Guida', shortTitle: 'وثائق القيادة', icon: '📋', hasImages: false },
  { id: 25, title: 'Cause di Incidenti Stradali', shortTitle: 'أسباب الحوادث', icon: '💥', hasImages: false },
  { id: 26, title: 'Comportamento in Caso di Incidente', shortTitle: 'التصرف عند الحوادث', icon: '🚑', hasImages: false },
  { id: 27, title: 'Stato Fisico ed Effetti dell\'Alcool', shortTitle: 'الكحول والقيادة', icon: '🍺', hasImages: false },
  { id: 28, title: 'Consumi e Inquinamento', shortTitle: 'الاستهلاك والتلوث', icon: '🌱', hasImages: false },
  { id: 29, title: 'Elementi Costitutivi del Veicolo', shortTitle: 'أجزاء المركبة', icon: '🔧', hasImages: false },
  { id: 30, title: 'Stabilita e Tenuta di Strada', shortTitle: 'ثبات المركبة', icon: '🎯', hasImages: false },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TheoryBookScreen() {
  const store = useStore();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [arabicTranslation, setArabicTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showArabic, setShowArabic] = useState(false);
  const [playing, setPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load lesson content when selected
  useEffect(() => {
    if (selectedLesson === null) {
      setLessonContent(null);
      setArabicTranslation(null);
      return;
    }

    setLoading(true);
    setArabicTranslation(null);
    setShowArabic(false);
    stopSpeech();
    setPlaying(false);

    fetch('/bookLessons.json').then(r => r.json()).then((lessons) => {
        const lesson = (lessons as any[]).find((l: any) => l.id === selectedLesson);
        if (lesson) {
          setLessonContent(lesson.content);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [selectedLesson]);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedLesson]);

  // TTS handler
  const handleSpeak = useCallback(async () => {
    if (!lessonContent) return;
    if (isSpeaking() && playing) {
      stopSpeech();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // Split long text into chunks for TTS (max 200 chars each)
    const sentences = lessonContent.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + ' ' + s).length > 200) {
        if (current) chunks.push(current);
        current = s;
      } else {
        current = current ? current + ' ' + s : s;
      }
    }
    if (current) chunks.push(current);

    for (const chunk of chunks) {
      if (!isSpeaking()) break;
      await speakText(chunk, 'it-IT');
    }
    setPlaying(false);
  }, [lessonContent, playing]);

  // Arabic translation handler
  const handleTranslate = useCallback(async () => {
    if (!lessonContent || arabicTranslation) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: lessonContent.substring(0, 5000),
          target_lang: 'ar',
        }),
      });
      const data = await res.json();
      if (data.translation) {
        setArabicTranslation(data.translation);
        setShowArabic(true);
      }
    } catch (e) {
      console.error('Translation error:', e);
    }
    setTranslating(false);
  }, [lessonContent, arabicTranslation]);

  // ============================================================
  // LESSON LIST VIEW
  // ============================================================
  if (selectedLesson === null) {
    return (
      <div className="min-h-screen bg-mesh pb-8">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-header">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
            <button onClick={() => store.goHome()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Indietro
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Libro di Teoria
              </span>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* Book Info */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5">
          <div className="card p-5 mb-5 anim-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                📘
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Manuale di Teoria
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Patenti A1, A e B — Valerio Platia & Roberto Mastri
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span>30 Lezioni</span>
              <span>128 Pagine</span>
              <span>327 Figure</span>
            </div>
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LESSONS.map((lesson, idx) => (
              <button key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className="card p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] anim-up"
                style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' }}>
                        {lesson.id}
                      </span>
                      {lesson.hasImages && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                          FIGURE
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}
                      dir="ltr">
                      {lesson.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }} dir="rtl">
                      {lesson.shortTitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LESSON DETAIL VIEW
  // ============================================================
  const lesson = LESSONS.find(l => l.id === selectedLesson)!;
  const prevLesson = selectedLesson > 1 ? selectedLesson - 1 : null;
  const nextLesson = selectedLesson < 30 ? selectedLesson + 1 : null;

  return (
    <div className="min-h-screen bg-mesh pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => { setSelectedLesson(null); stopSpeech(); setPlaying(false); }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Lezioni
          </button>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-bold" style={{ color: '#4F46E5' }}>
              Lezione {lesson.id}/30
            </span>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }} dir="ltr">
              {lesson.title}
            </p>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {/* Lesson title card */}
        <div className="card p-5 anim-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
              {lesson.icon}
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }} dir="ltr">
                Lezione {lesson.id}. {lesson.title}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }} dir="rtl">
                {lesson.shortTitle}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSpeak} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                background: playing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                border: `1px solid ${playing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(79, 70, 229, 0.2)'}`,
                color: playing ? '#EF4444' : '#4F46E5',
              }}>
              {playing ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
              {playing ? 'Ferma' : 'Ascolta'}
            </button>

            <button onClick={handleTranslate} disabled={loading || translating || !!arabicTranslation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                background: arabicTranslation ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                border: `1px solid ${arabicTranslation ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)'}`,
                color: arabicTranslation ? '#059669' : '#4F46E5',
              }}>
              {translating ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              )}
              {arabicTranslation ? 'مترجم ✓' : 'ترجمة عربي'}
            </button>

            {arabicTranslation && (
              <button onClick={() => setShowArabic(!showArabic)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: showArabic ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                  border: `1px solid ${showArabic ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                  color: showArabic ? '#059669' : 'var(--text-secondary)',
                }}>
                {showArabic ? 'إخفاء' : 'عرض'} الترجمة
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="card p-8 flex flex-col items-center gap-3">
            <svg className="w-6 h-6 animate-spin" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Caricamento lezione...</span>
          </div>
        )}

        {/* Italian content */}
        {!loading && lessonContent && (
          <div className="card p-5 anim-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#4F46E5' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4F46E5' }}>
                Testo Italiano
              </span>
            </div>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-primary)' }} dir="ltr">
              {lessonContent.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                <p key={idx} className="text-[13px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Arabic translation */}
        {!loading && showArabic && arabicTranslation && (
          <div className="card p-5 anim-up" style={{
            animationDelay: '200ms',
            background: 'rgba(79, 70, 229, 0.03)',
            border: '1px solid rgba(79, 70, 229, 0.1)',
          }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>
                الترجمة العربية
              </span>
            </div>
            <div className="text-sm leading-relaxed space-y-3" dir="rtl">
              {arabicTranslation.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                <p key={idx} className="text-[13px] leading-[2]" style={{ color: 'var(--text-secondary)' }}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Navigation between lessons */}
        {!loading && (
          <div className="flex justify-between items-center pt-4 pb-2">
            {prevLesson ? (
              <button onClick={() => setSelectedLesson(prevLesson)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: '#4F46E5', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Lezione {prevLesson}
              </button>
            ) : <div />}
            {nextLesson && (
              <button onClick={() => setSelectedLesson(nextLesson)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: '#4F46E5', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                Lezione {nextLesson}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
