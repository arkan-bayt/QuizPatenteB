'use client';
import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getChapterExplanation, TOPICS_INFO } from '@/data/explanationsData';
import SignIcon from './SignIcon';

// Map chapter IDs to representative traffic sign previews
const CHAPTER_SIGNS: Record<number, { signalId: string; categoryId: string }[]> = {
  2: [
    { signalId: 'curva-sinistra', categoryId: 'pericolo' },
    { signalId: 'pedoni', categoryId: 'pericolo' },
    { signalId: 'incrocio', categoryId: 'pericolo' },
    { signalId: 'galleria', categoryId: 'pericolo' },
  ],
  3: [
    { signalId: 'divieto-accesso', categoryId: 'divieto' },
    { signalId: 'limite-velocita', categoryId: 'divieto' },
    { signalId: 'divieto-sosta', categoryId: 'divieto' },
    { signalId: 'divieto-sorpasso', categoryId: 'divieto' },
  ],
  4: [
    { signalId: 'sens-unico', categoryId: 'obbligo' },
    { signalId: 'pista-ciclabile', categoryId: 'obbligo' },
    { signalId: 'dritto', categoryId: 'obbligo' },
    { signalId: 'catene-neve', categoryId: 'obbligo' },
  ],
  5: [
    { signalId: 'dare-precedenza', categoryId: 'precedenza' },
    { signalId: 'stop', categoryId: 'precedenza' },
    { signalId: 'strada-prioritaria', categoryId: 'precedenza' },
    { signalId: 'fine-prioritaria', categoryId: 'precedenza' },
  ],
  7: [
    { signalId: 'stop', categoryId: 'precedenza' },
  ],
  8: [
    { signalId: 'autostrada', categoryId: 'indicazione' },
    { signalId: 'parcheggio', categoryId: 'indicazione' },
    { signalId: 'ospedale', categoryId: 'indicazione' },
    { signalId: 'area-servizio', categoryId: 'indicazione' },
  ],
  9: [
    { signalId: 'pannello-distanza', categoryId: 'pannelli' },
    { signalId: 'pannello-direzione', categoryId: 'pannelli' },
  ],
  10: [
    { signalId: 'pannello-distanza', categoryId: 'pannelli' },
    { signalId: 'pannello-validita', categoryId: 'pannelli' },
  ],
};

export default function ChapterExplanationScreen() {
  const store = useStore();
  const { activeChapterId } = store;
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const chapter = useMemo(() => {
    if (!activeChapterId) return undefined;
    return getChapterExplanation(activeChapterId);
  }, [activeChapterId]);

  const topicInfo = useMemo(() => {
    if (!chapter) return undefined;
    return TOPICS_INFO.find((t) => t.nameIt === chapter.topicIt);
  }, [chapter]);

  if (!chapter || !topicInfo) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Capitolo non trovato</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.setScreen('explanationTopic')} className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[14px] font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>Cap. {chapter.id} &mdash; {chapter.titleIt}</h1>
            <p className="text-[11px] mt-0.5 font-medium truncate" style={{ color: 'var(--text-muted)' }}>{chapter.titleAr}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Chapter Header Card */}
        <div className="anim-up relative overflow-hidden" style={{ borderRadius: 'var(--radius-xl)', boxShadow: `0 4px 20px ${topicInfo.color}30` }}>
          <div className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${chapter.color}, ${topicInfo.color})` }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
                {chapter.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    Capitolo {chapter.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                    {topicInfo.icon} {topicInfo.nameIt}
                  </span>
                </div>
                <p className="text-[16px] font-bold text-white">{chapter.titleIt}</p>
                <p className="text-[12px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{chapter.titleAr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Signs Preview - for signal-related chapters */}
        {CHAPTER_SIGNS[chapter.id] && (
          <div className="glass p-5 anim-up" style={{ animationDelay: '40ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${chapter.color}15` }}>
                <svg className="w-4 h-4" style={{ color: chapter.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Esempi di segnali / أمثلة على الإشارات</h3>
            </div>
            <div className="flex items-center justify-start gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              {CHAPTER_SIGNS[chapter.id].map((sign, si) => (
                <div key={si} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center p-1 transition-transform duration-200 hover:scale-110"
                    style={{ background: 'var(--bg-tertiary)', border: `1.5px solid var(--border-subtle)` }}>
                    <SignIcon signalId={sign.signalId} categoryId={sign.categoryId} size={52} />
                  </div>
                  <span className="text-[9px] font-medium text-center max-w-[64px] truncate" style={{ color: 'var(--text-muted)' }}>
                    {sign.signalId.replace(/-/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <button
                onClick={() => store.setScreen('signalsGuide')}
                className="text-[11px] font-semibold" style={{ color: 'var(--primary-light)' }}>
                Vedi tutti i segnali nell&apos;Atlante / شاهد جميع الإشارات في الأطلس
              </button>
            </div>
          </div>
        )}

        {/* Overview Section */}
        <div className="glass p-5 anim-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="icon-box icon-box-primary w-8 h-8">
              <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Panoramica / نظرة عامة</h3>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{chapter.overview.it}</p>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{chapter.overview.ar}</p>
          </div>
        </div>

        {/* Key Points Accordion */}
        <div className="space-y-3 anim-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${chapter.color}15` }}>
              <svg className="w-4 h-4" style={{ color: chapter.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Punti Chiave / النقاط الرئيسية</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${chapter.color}15`, color: chapter.color }}>
              {chapter.keyPoints.length}
            </span>
          </div>

          {chapter.keyPoints.map((kp, i) => {
            const key = `kp-${i}`;
            const isOpen = expandedKey === key;
            return (
              <div key={i} className="glass overflow-hidden transition-all duration-300" style={{ animationDelay: `${(i * 40) + 150}ms` }}>
                <button
                  onClick={() => setExpandedKey(isOpen ? null : key)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${chapter.color}12` }}>
                    <span className="text-xs font-bold" style={{ color: chapter.color }}>{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{kp.titleIt}</p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{kp.titleAr}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-muted)' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 anim-fade">
                    <div className="pl-11">
                      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{kp.descIt}</p>
                      <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{kp.descAr}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Common Mistakes */}
        {chapter.commonMistakes.length > 0 && (
          <div className="glass p-5 anim-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Errori Comuni / الأخطاء الشائعة</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                {chapter.commonMistakes.length}
              </span>
            </div>
            <div className="space-y-3">
              {chapter.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg className="w-3 h-3" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mistake.it}</p>
                    <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{mistake.ar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memory Tips */}
        {chapter.memoryTips.length > 0 && (
          <div className="glass p-5 anim-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Suggerimenti Mnemonici / نصائح للحفظ</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent)' }}>
                {chapter.memoryTips.length}
              </span>
            </div>
            <div className="space-y-3">
              {chapter.memoryTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <span className="text-[10px]">💡</span>
                  </div>
                  <div>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.it}</p>
                    <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{tip.ar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
