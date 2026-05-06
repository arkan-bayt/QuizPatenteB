'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { speakContinuous, stopSpeech, isSpeaking } from '@/logic/ttsEngine';

// ============================================================
// SIGNAL IMAGE MAPPING - Book headings → clean sign images from /img_sign/
// ============================================================
const HEADING_SIGN_IMAGE: Record<string, string> = {
  // Lesson 2: Segnali di Pericolo
  'STRADA DEFORMATA': '/img_sign/1.png',
  'DOSSO': '/img_sign/2.png',
  'CUNETTA': '/img_sign/3.png',
  'CURVA A DESTRA': '/img_sign/4.png',
  'CURVA A SINISTRA': '/img_sign/5.png',
  'DOPPIA CURVA, LA PRIMA A DESTRA': '/img_sign/6.png',
  'DOPPIA CURVA, LA PRIMA A SINISTRA': '/img_sign/7.png',
  'PASSAGGIO A LIVELLO CON BARRIERE O SEMIBARRIERE': '/img_sign/8.png',
  'PASSAGGIO A LIVELLO SENZA BARRIERE': '/img_sign/9.png',
  'INCROCIO': '/img_sign/10.png',
  'GALLERIA': '/img_sign/12.png',
  'LAVORI': '/img_sign/13.png',
  'ATTRAVERSAMENTO TRANVIARIO': '/img_sign/14.png',
  'ATTRAVERSAMENTO PEDONALE': '/img_sign/15.png',
  'ATTRAVERSAMENTO CICLABILE': '/img_sign/16.png',
  'DISCESA PERICOLOSA CON PENDENZA DEL 10 %': '/img_sign/17.png',
  'SALITA RIPIDA CON PENDENZA DEL 10 %': '/img_sign/18.png',
  'STRETTOIA SIMMETRICA': '/img_sign/19.png',
  'STRETTOIA ASIMMETRICA A SINISTRA': '/img_sign/20.png',
  'STRETTOIA ASIMMETRICA A DESTRA': '/img_sign/21.png',
  'PONTE MOBILE': '/img_sign/22.png',
  'BANCHINA PERICOLOSA': '/img_sign/23.png',
  'STRADA SDRUCCIOLEVOLE': '/img_sign/24.png',
  'ATTENZIONE AI BAMBINI': '/img_sign/25.png',
  'ATTENZIONE AGLI ANIMALI DOMESTICI VAGANTI (LIBERI)': '/img_sign/26.png',
  'ATTENZIONE AGLI ANIMALI SELVATICI VAGANTI (LIBERI)': '/img_sign/27.png',
  'DOPPIO SENSO DI CIRCOLAZIONE': '/img_sign/28.png',
  'ROTATORIA': '/img_sign/29.png',
  'SBOCCO SU MOLO O SU ARGINE': '/img_sign/30.png',
  'PIETRISCO': '/img_sign/31.png',
  'CADUTA MASSI DA SINISTRA': '/img_sign/32.png',
  'CADUTA MASSI DA DESTRA': '/img_sign/33.png',
  'AEROMOBILI A BASSA QUOTA': '/img_sign/36.png',
  'FORTE VENTO LATERALE': '/img_sign/37.png',
  'PERICOLO DI INCENDIO': '/img_sign/38.png',
  'ALTRI PERICOLI': '/img_sign/39.png',
  'PREAVVISO DI SEMAFORO VERTICALE': '/img_sign/34.png',
  'PREAVVISO DI SEMAFORO ORIZZONTALE': '/img_sign/35.png',
  // Lesson 3: Segnali di Precedenza
  'DARE PRECEDENZA': '/img_sign/40.png',
  'PREAVVISO DI DARE PRECEDENZA': '/img_sign/42.png',
  'FERMARSI E DARE PRECEDENZA (STOP)': '/img_sign/41.png',
  'PREAVVISO DI FERMARSI E DARE PRECEDENZA (STOP)': '/img_sign/43.png',
  'INTERSEZIONE CON PRECEDENZA A DESTRA': '/img_sign/44.png',
  'INTERSEZIONE CON DIRITTO DI PRECEDENZA': '/img_sign/44.png',
  'DIRETTO DI PRECEDENZA': '/img_sign/52.png',
  'FINE DEL DIRITTO DI PRECEDENZA': '/img_sign/46.png',
  'DARE PRECEDENZA NEI SENSI UNICI ALTERNATI': '/img_sign/45.png',
  // Lesson 4: Segnali di Divieto
  'DIVIETO DI TRANSITO': '/img_sign/54.png',
  'SENSO VIETATO': '/img_sign/55.png',
  'DIVIETO DI SORPASSO': '/img_sign/56.png',
  'FINE DEL DIVIETO DI SORPASSO': '/img_sign/82.png',
  'DIVIETO DI SEGNALAZIONI ACUSTICHE': '/img_sign/59.png',
  'DIVIETO DI SOSTA': '/img_sign/84.png',
  'DIVIETO DI FERMATA': '/img_sign/85.png',
  'PARCHEGGIO': '/img_sign/86.png',
  'VIA LIBERA': '/img_sign/80.png',
  'LIMITE MASSIMO DI VELOCITÀ DI 80 KM/H': '/img_sign/58.png',
  'FINE DEL LIMITE MASSIMO DI VELOCITÀ DI 50 KM/H': '/img_sign/81.png',
  'DIVIETO DI TRANSITO AI PEDONI': '/img_sign/62.png',
  'DIVIETO DI TRANSITO AI VEICOLI A BRACCIA': '/img_sign/65.png',
  'DIVIETO DI TRANSITO AI VELOCIPEDI (BICICLETTE)': '/img_sign/63.png',
  'DIVIETO DI TRANSITO AI MOTOCICLI': '/img_sign/64.png',
  'DIVIETO DI TRANSITO AGLI AUTOBUS': '/img_sign/67.png',
  'DIVIETO DI INVERSIONE DEL SENSO DI MARCIA': '/img_sign/57.png',
  'DIVIETO DI RETROMARCIA': '/img_sign/61.png',
  // Lesson 5: Segnali di Obbligo
  'DIREZIONE OBBLIGATORIA DIRITTO': '/img_sign/93.png',
  'DIREZIONE OBBLIGATORIA A SINISTRA': '/img_sign/94.png',
  'DIREZIONE OBBLIGATORIA A DESTRA': '/img_sign/95.png',
  'DIREZIONI CONSENTITE DESTRA E SINISTRA': '/img_sign/98.png',
  'DIREZIONI CONSENTITE DIRITTO E DESTRA': '/img_sign/99.png',
  'DIREZIONI CONSENTITE DIRITTO E SINISTRA': '/img_sign/100.png',
  'PASSAGGIO OBBLIGATORIO A SINISTRA': '/img_sign/101.png',
  'PASSAGGIO OBBLIGATORIO A DESTRA': '/img_sign/102.png',
  'PASSAGGI CONSENTITI': '/img_sign/103.png',
  'CATENE DA NEVE OBBLIGATORIE': '/img_sign/107.png',
  'LIMITE MINIMO DI VELOCITÀ DI 30 KM/H': '/img_sign/105.png',
  'PERCORSO PEDONALE': '/img_sign/108.png',
  'PISTA CICLABILE': '/img_sign/112.png',
  'PISTA CICLABILE CONTIGUA (ACCANTO) AL MARCIAPIEDE': '/img_sign/113.png',
  'PERCORSO UNICO PEDONALE E CICLABILE': '/img_sign/113.png',
};

// Try to get clean sign image for a section heading
function getSignImage(heading: string): string | null {
  if (!heading) return null;
  // Exact match first
  if (HEADING_SIGN_IMAGE[heading]) return HEADING_SIGN_IMAGE[heading];
  // Partial match (for headings with extra text)
  const upper = heading.toUpperCase();
  for (const [key, img] of Object.entries(HEADING_SIGN_IMAGE)) {
    if (upper.includes(key) || key.includes(upper)) return img;
  }
  return null;
}

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

interface Section {
  heading: string | null;
  paragraphs: string[];
  images: string[];
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
  { id: 27, title: "Stato Fisico ed Effetti dell'Alcool", shortTitle: 'الكحول والقيادة', icon: '🍺', hasImages: false },
  { id: 28, title: 'Consumi e Inquinamento', shortTitle: 'الاستهلاك والتلوث', icon: '🌱', hasImages: false },
  { id: 29, title: 'Elementi Costitutivi del Veicolo', shortTitle: 'أجزاء المركبة', icon: '🔧', hasImages: false },
  { id: 30, title: 'Stabilita e Tenuta di Strada', shortTitle: 'ثبات المركبة', icon: '🎯', hasImages: false },
];

// ============================================================
// COLORS per lesson category (signs vs theory)
// ============================================================
function getLessonColor(lessonId: number): string {
  if (lessonId >= 2 && lessonId <= 9) return '#EF4444';    // Signs: red
  if (lessonId >= 10 && lessonId <= 11) return '#F59E0B';   // Traffic lights, horizontal: amber
  if (lessonId >= 12 && lessonId <= 18) return '#3B82F6';   // Driving rules: blue
  if (lessonId >= 19 && lessonId <= 20) return '#8B5CF6';   // Vehicle equipment: purple
  if (lessonId >= 21 && lessonId <= 22) return '#059669';   // Safety: green
  if (lessonId >= 23 && lessonId <= 24) return '#6366F1';   // License/docs: indigo
  if (lessonId >= 25 && lessonId <= 28) return '#EC4899';   // Incidents: pink
  return '#4F46E5'; // Definitions, vehicle parts: default indigo
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TheoryBookScreen() {
  const store = useStore();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  // Per-section translations: secIdx -> translation string
  const [arabicTranslations, setArabicTranslations] = useState<Record<number, string>>({});
  const [translatingSection, setTranslatingSection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  // Per-section visibility of translation
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [playingSection, setPlayingSection] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(false);
  const cancelTokenRef = useRef({ cancelled: false });

  // Load lesson content when selected
  useEffect(() => {
    if (selectedLesson === null) {
      setSections([]);
      setArabicTranslations({});
      return;
    }

    setLoading(true);
    setArabicTranslations({});
    setVisibleTranslations(new Set());
    setTranslationError(null);
    stopSpeech();
    setPlayingSection(null);

    fetch('/bookLessonsStructured.json')
      .then(r => r.json())
      .then((lessons) => {
        const lesson = (lessons as any[]).find((l: any) => l.id === selectedLesson);
        if (lesson && lesson.sections) {
          setSections(lesson.sections);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to old format
        fetch('/bookLessons.json')
          .then(r => r.json())
          .then((lessons) => {
            const lesson = (lessons as any[]).find((l: any) => l.id === selectedLesson);
            if (lesson) {
              const fallbackSections: Section[] = [{
                heading: null,
                paragraphs: lesson.content.split('\n').filter((p: string) => p.trim()),
                images: lesson.images || [],
              }];
              setSections(fallbackSections);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [selectedLesson]);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedLesson]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => { stopSpeech(); };
  }, []);

  // ============================================================
  // TTS - speak a full section (chunked sequential playback)
  // FIX: Removed the broken isSpeaking() check between chunks
  // ============================================================
  const handleSpeakSection = useCallback(async (sectionIdx: number) => {
    const section = sections[sectionIdx];
    if (!section) return;

    const text = [
      ...(section.heading ? [section.heading] : []),
      ...section.paragraphs,
    ].join('. ');

    if (!text.trim()) return;

    // Toggle if already playing this section
    if (playingSection === sectionIdx) {
      cancelTokenRef.current.cancelled = true;
      stopSpeech();
      setPlayingSection(null);
      return;
    }

    stopSpeech();
    stopRef.current = false;
    cancelTokenRef.current.cancelled = false;
    setPlayingSection(sectionIdx);

    // Use speakContinuous - Web Speech only, no voice switching
    await speakContinuous(text, 'it-IT', cancelTokenRef.current);
    setPlayingSection(null);
  }, [sections, playingSection]);

  // Stop all speech
  const handleStopAll = useCallback(() => {
    cancelTokenRef.current.cancelled = true;
    stopSpeech();
    setPlayingSection(null);
  }, []);

  // ============================================================
  // PER-SECTION TRANSLATION
  // ============================================================
  const handleTranslateSection = useCallback(async (sectionIdx: number) => {
    // If already translated, toggle visibility
    if (arabicTranslations[sectionIdx]) {
      setVisibleTranslations(prev => {
        const next = new Set(prev);
        if (next.has(sectionIdx)) {
          next.delete(sectionIdx);
        } else {
          next.add(sectionIdx);
        }
        return next;
      });
      return;
    }

    const section = sections[sectionIdx];
    if (!section) return;

    const text = [
      ...(section.heading ? [section.heading] : []),
      ...section.paragraphs,
    ].join('\n');

    if (text.length < 20) return;

    setTranslatingSection(sectionIdx);
    setTranslationError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translateText',
          text: text.substring(0, 3000),
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setTranslationError('خطأ في الاتصال بالخادم');
        return;
      }
      
      const data = await res.json();
      if (data.translation && data.translation.length > 5) {
        setArabicTranslations(prev => ({ ...prev, [sectionIdx]: data.translation }));
        setVisibleTranslations(prev => {
          const next = new Set(prev);
          next.add(sectionIdx);
          return next;
        });
      } else if (data.error) {
        setTranslationError('حدث خطأ في الترجمة، حاول مرة أخرى');
      } else {
        setTranslationError('لم يتم الحصول على ترجمة، حاول مرة أخرى');
      }
    } catch (e) {
      console.error('Translation error for section', sectionIdx, ':', e);
      setTranslationError('فشل الاتصال، تحقق من الإنترنت وحاول مرة أخرى');
    }

    setTranslatingSection(null);
  }, [sections, arabicTranslations]);

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
  const lessonColor = getLessonColor(selectedLesson);

  return (
    <div className="min-h-screen bg-mesh pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => { setSelectedLesson(null); handleStopAll(); }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Lezioni
          </button>
          <div className="flex-1 min-w-0 text-center">
            <span className="text-[10px] font-bold block" style={{ color: lessonColor }}>
              Lezione {lesson.id}/30
            </span>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }} dir="ltr">
              {lesson.title}
            </p>
          </div>
          {playingSection !== null && (
            <button onClick={handleStopAll}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </button>
          )}
          <div className="w-12" />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5">

        {/* Lesson Title Card */}
        <div className="card p-5 anim-up" style={{ borderColor: `${lessonColor}22` }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${lessonColor}15`, border: `2px solid ${lessonColor}30` }}>
              {lesson.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }} dir="ltr">
                Lezione {lesson.id}. {lesson.title}
              </h1>
              <p className="text-sm font-semibold mt-0.5" style={{ color: lessonColor }} dir="rtl">
                {lesson.shortTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="card p-8 flex flex-col items-center gap-3">
            <svg className="w-6 h-6 animate-spin" style={{ color: lessonColor }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Caricamento lezione...</span>
          </div>
        )}

        {/* Sections */}
        {!loading && sections.map((section, secIdx) => {
          const isIntroSection = !section.heading;
          const isPlaying = playingSection === secIdx;
          const hasTranslation = !!arabicTranslations[secIdx];
          const showTranslation = visibleTranslations.has(secIdx);
          const isTranslatingThis = translatingSection === secIdx;

          return (
            <div key={secIdx} className="anim-up" style={{ animationDelay: `${Math.min(secIdx * 50, 300)}ms` }}>
              <div className="card overflow-hidden" style={{
                borderColor: section.heading ? `${lessonColor}22` : undefined,
              }}>

                {/* ─── SIGN / TOPIC HEADER (large, prominent) ─── */}
                {section.heading && (
                  <div
                    className="px-5 py-4"
                    style={{
                      background: `linear-gradient(135deg, ${lessonColor}12 0%, ${lessonColor}05 100%)`,
                      borderBottom: `2px solid ${lessonColor}20`,
                    }}>
                    {/* Main heading + image */}
                    <div className="flex items-start gap-4">
                      {/* Large sign image - use clean sign from /img_sign/ first, fallback to book scan */}
                      {(() => {
                        const signImg = getSignImage(section.heading || '');
                        const bookImg = section.images.length > 0 ? `/img_book/${section.images[0]}` : null;
                        const imgSrc = signImg || bookImg;
                        if (!imgSrc) return null;
                        return (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-white"
                            style={{ borderColor: `${lessonColor}30` }}>
                            <img
                              src={imgSrc}
                              alt={section.heading || ''}
                              className="w-full h-full object-contain p-1.5"
                              loading="lazy"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                // If sign image fails, try book scan image
                                if (signImg && bookImg && el.src.includes('/img_sign/')) {
                                  el.src = bookImg;
                                } else {
                                  el.style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        );
                      })()}

                      {/* Heading text - LARGE & BOLD like the book */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ background: `${lessonColor}18`, color: lessonColor }}>
                            {secIdx + 1}
                          </span>
                          {section.images.length > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                              {section.images.length} صور
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight"
                          style={{ color: lessonColor }}
                          dir="ltr">
                          {section.heading}
                        </h2>
                      </div>
                    </div>

                    {/* Action buttons row: Play + Translate */}
                    <div className="flex items-center gap-2 mt-3">
                      {/* TTS Play button */}
                      <button
                        onClick={() => handleSpeakSection(secIdx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: isPlaying ? 'rgba(239, 68, 68, 0.12)' : `${lessonColor}15`,
                          border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.25)' : `${lessonColor}25`}`,
                          color: isPlaying ? '#EF4444' : lessonColor,
                        }}>
                        {isPlaying ? (
                          <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        )}
                        {isPlaying ? 'إيقاف' : 'استمع 🇮🇹'}
                      </button>

                      {/* Translate button */}
                      <button
                        onClick={() => handleTranslateSection(secIdx)}
                        disabled={isTranslatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                        style={{
                          background: hasTranslation
                            ? (showTranslation ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)')
                            : 'rgba(79, 70, 229, 0.1)',
                          border: `1px solid ${hasTranslation
                            ? (showTranslation ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)')
                            : 'rgba(79, 70, 229, 0.2)'}`,
                          color: hasTranslation ? '#059669' : '#4F46E5',
                        }}>
                        {isTranslatingThis ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                          </svg>
                        )}
                        {isTranslatingThis
                          ? 'جاري الترجمة...'
                          : hasTranslation
                            ? (showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة')
                            : 'ترجمة عربي'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── ADDITIONAL BOOK SCAN IMAGES (gallery) ─── */}
                {section.heading && section.images.length > 0 && (
                  <div className="px-5 py-3 flex gap-2 overflow-x-auto"
                    style={{ background: 'rgba(249, 250, 251, 0.5)', borderBottom: `1px solid ${lessonColor}10` }}>
                    {/* If we used sign image as primary, show ALL book scans in gallery */}
                    {/* If no sign image, skip first (already shown as primary) */}
                    {(getSignImage(section.heading || '') ? section.images : section.images.slice(1)).map((img, imgIdx) => (
                      <div key={imgIdx} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-white"
                        style={{ borderColor: `${lessonColor}18` }}>
                        <img
                          src={`/img_book/${img}`}
                          alt={`${section.heading} - صورة ${imgIdx + 1}`}
                          className="w-full h-full object-contain p-1.5"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── SECTION CONTENT (paragraphs) ─── */}
                {section.paragraphs.length > 0 && (
                  <div className="p-5 space-y-3" dir="ltr">
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-[13px] leading-[1.9]" style={{ color: 'var(--text-secondary)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* ─── INTRO SECTION: Play button for text without heading ─── */}
                {isIntroSection && section.paragraphs.length > 0 && (
                  <div className="px-5 pb-4">
                    <button
                      onClick={() => handleSpeakSection(secIdx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: isPlaying ? 'rgba(239, 68, 68, 0.12)' : `${lessonColor}15`,
                        border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.25)' : `${lessonColor}25`}`,
                        color: isPlaying ? '#EF4444' : lessonColor,
                      }}>
                      {isPlaying ? (
                        <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                      )}
                      {isPlaying ? 'إيقاف' : 'استمع 🇮🇹'}
                    </button>

                    {/* Translate button for intro */}
                    <button
                      onClick={() => handleTranslateSection(secIdx)}
                      disabled={translatingSection === secIdx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 ml-2"
                      style={{
                        background: arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)')
                          : 'rgba(79, 70, 229, 0.1)',
                        border: `1px solid ${arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)')
                          : 'rgba(79, 70, 229, 0.2)'}`,
                        color: arabicTranslations[secIdx] ? '#059669' : '#4F46E5',
                      }}>
                      {translatingSection === secIdx ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                        </svg>
                      )}
                      {translatingSection === secIdx
                        ? 'جاري الترجمة...'
                        : arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'إخفاء الترجمة' : 'عرض الترجمة')
                          : 'ترجمة عربي'}
                    </button>
                  </div>
                )}

                {/* ─── TRANSLATION ERROR ─── */}
                {translationError && translatingSection === null && !arabicTranslations[secIdx] && (
                  <div className="px-5 pb-3">
                    <div className="text-[11px] font-medium px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                      {translationError}
                    </div>
                  </div>
                )}

                {/* ─── ARABIC TRANSLATION (per section) ─── */}
                {showTranslation && arabicTranslations[secIdx] && (
                  <div className="px-5 pb-5" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0.01) 100%)',
                    borderTop: `2px dashed rgba(16, 185, 129, 0.2)`,
                  }}>
                    <div className="flex items-center gap-2 pt-4 mb-3">
                      <span className="text-sm">🇸🇦</span>
                      <span className="text-[11px] font-bold" style={{ color: '#059669' }}>
                        الترجمة العربية
                      </span>
                    </div>
                    <div className="text-[13px] leading-[2.2] font-medium" dir="rtl" style={{ color: 'var(--text-primary)' }}>
                      {arabicTranslations[secIdx].split('\n').filter(p => p.trim()).map((para, pIdx) => (
                        <p key={pIdx} className="mb-2">{para.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Navigation between lessons */}
        {!loading && (
          <div className="flex justify-between items-center pt-4 pb-2">
            {prevLesson ? (
              <button onClick={() => { setSelectedLesson(prevLesson); handleStopAll(); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: lessonColor, background: `${lessonColor}10`, border: `1px solid ${lessonColor}20` }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Lezione {prevLesson}
              </button>
            ) : <div />}
            {nextLesson && (
              <button onClick={() => { setSelectedLesson(nextLesson); handleStopAll(); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: lessonColor, background: `${lessonColor}10`, border: `1px solid ${lessonColor}20` }}>
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
