'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { TOPICS_INFO } from '@/data/explanationsData';
import { getChaptersByTopic } from '@/data/quizData';
import { useOverallStats } from './hooks';
import SignIcon from './SignIcon';

const TOPIC_GRADIENTS: Record<string, string> = {
  'Conoscenze generali': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  'Segnali stradali': 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
  'Norme di circolazione': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'Equipaggiamento e sicurezza': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'Documenti e norme': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  'Altro': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
};

const TOPIC_SHADOWS: Record<string, string> = {
  'Conoscenze generali': '0 4px 20px rgba(59,130,246,0.3)',
  'Segnali stradali': '0 4px 20px rgba(239,68,68,0.3)',
  'Norme di circolazione': '0 4px 20px rgba(16,185,129,0.3)',
  'Equipaggiamento e sicurezza': '0 4px 20px rgba(245,158,11,0.3)',
  'Documenti e norme': '0 4px 20px rgba(139,92,246,0.3)',
  'Altro': '0 4px 20px rgba(99,102,241,0.3)',
};

export default function ExplanationScreen() {
  const store = useStore();
  const { chapters } = store;
  const { chapterStats } = useOverallStats();

  const topicData = useMemo(() => {
    return TOPICS_INFO.map((topic) => {
      const topicChapters = getChaptersByTopic(chapters, topic.nameIt);
      const topicTotal = topicChapters.reduce((s, c) => s + c.questionCount, 0);
      const topicAnswered = topicChapters.reduce((s, c) => {
        const cs = chapterStats.find((x) => x.id === c.id);
        return s + (cs?.answered || 0);
      }, 0);
      const pct = topicTotal > 0 ? Math.round((topicAnswered / topicTotal) * 100) : 0;
      return {
        ...topic,
        chapterCount: topicChapters.length,
        totalQuestions: topicTotal,
        answeredQuestions: topicAnswered,
        pct,
      };
    });
  }, [chapters, chapterStats]);

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.setScreen('home')} className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Spiegazioni</h1>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Guida completa alla patente B</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}>
            <span className="text-base">📚</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-4">
        {/* Title */}
        <div className="anim-up">
          <h2 className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Scegli un argomento</h2>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Approfondisci ogni capitolo con spiegazioni dettagliate.</p>
        </div>

        {/* Signals Guide Card */}
        <button
          onClick={() => store.setScreen('signalsGuide')}
          className="relative overflow-hidden p-5 text-left w-full anim-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{ animationDelay: '50ms', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            {/* Preview traffic signs */}
            <div className="flex items-center -space-x-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <SignIcon signalId="curva-sinistra" categoryId="pericolo" size={42} />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <SignIcon signalId="stop" categoryId="precedenza" size={42} />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <SignIcon signalId="limite-velocita" categoryId="divieto" size={42} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white">Atlante dei Segnali</p>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>أطلس الإشارات</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>6 categorie &middot; Guida completa ai segnali stradali</p>
            </div>
            <svg className="w-5 h-5 text-white opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* Topic Cards */}
        {topicData.map((topic, ti) => {
          const gradient = TOPIC_GRADIENTS[topic.nameIt] || TOPIC_GRADIENTS['Altro'];
          const shadow = TOPIC_SHADOWS[topic.nameIt] || TOPIC_SHADOWS['Altro'];

          return (
            <button
              key={topic.nameIt}
              onClick={() => {
                store.setScreen('explanationTopic');
                useStore.setState({ activeExplanationTopic: topic.nameIt });
              }}
              className="relative overflow-hidden text-left w-full anim-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ animationDelay: `${(ti * 60) + 100}ms`, borderRadius: 'var(--radius-xl)', boxShadow: shadow }}>
              {/* Top colored header */}
              <div className="px-5 pt-5 pb-4" style={{ background: gradient }}>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-white">{topic.nameIt}</p>
                    <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{topic.nameAr}</p>
                  </div>
                  <svg className="w-5 h-5 text-white opacity-60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>

              {/* Content area */}
              <div className="px-5 py-4" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{topic.descriptionIt}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>📖 {topic.chapterCount} capitoli</span>
                  </div>
                  {topic.totalQuestions > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>📋 {topic.totalQuestions} domande</span>
                    </div>
                  )}
                </div>
                {/* Progress bar */}
                {topic.totalQuestions > 0 && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topic.pct}%`, background: gradient }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{topic.answeredQuestions} risposte</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{topic.pct}%</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
