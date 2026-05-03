'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { authenticatedFetch } from '@/lib/api';
import { useOverallStats, useUserStats } from './hooks';

interface StudyPlanItem {
  day: string;
  chapterId: number;
  chapterName: string;
  reason: string;
  questionCount: number;
}

interface StudyPlanData {
  plan: StudyPlanItem[];
  summary: string;
  accuracy: number;
  totalAnswered: number;
}

export default function StudyPlanScreen() {
  const store = useStore();
  const { user, chapters } = store;
  const username = user?.username || '';
  const { totalAnswered, totalCorrect, chapterStats } = useOverallStats();
  const stats = useUserStats();
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<StudyPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || chapters.length === 0) return;

    const body = {
      action: 'studyPlan',
      username,
      stats: {
        totalAnswered,
        totalCorrect,
        totalWrong: totalAnswered - totalCorrect,
        streak: stats.streak,
        bestStreak: stats.bestStreak,
        examsPassed: stats.examsPassed,
        examsFailed: stats.examsFailed,
      },
      chapters: chapterStats.map(cs => {
        const ch = chapters.find(c => c.id === cs.id);
        return {
          id: cs.id,
          name: ch?.name || `Capitolo ${cs.id}`,
          answered: cs.answered,
          correct: cs.correct,
          wrong: cs.wrong,
          total: cs.total,
          pct: cs.pct,
        };
      }),
      wrongTopics: [],
    };

    authenticatedFetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore del server');
        return res.json();
      })
      .then(data => {
        setPlanData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Errore durante la generazione');
        setLoading(false);
      });
  }, [username, chapters, totalAnswered, totalCorrect, stats, chapterStats]);

  const openChapter = (chapterId: number) => {
    store.openChapter(chapterId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="glass-header px-5 py-4 sticky top-0 z-20">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => store.setScreen('home')}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Indietro
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}>
              📋
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white animate-spin"
              style={{ borderColor: 'var(--success-150)', borderTopColor: 'var(--success)' }} />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>Generazione piano di studio...</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>L&apos;IA sta analizzando le tue performance</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--success)', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="glass-header px-5 py-4 sticky top-0 z-20">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => store.setScreen('home')}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Indietro
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'var(--danger-100)' }}>
            ⚠️
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error || 'Errore'}</p>
          <button onClick={() => store.setScreen('home')} className="btn-primary px-6 py-3">Torna alla Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="glass-header px-5 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => store.setScreen('home')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Indietro
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'var(--success-100)', color: 'var(--success)', border: '1px solid var(--success-150)' }}>
              Piano IA
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Summary Card */}
        <div className="anim-up relative overflow-hidden p-6 rounded-3xl text-white"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.25)' }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📋</div>
              <div>
                <h1 className="text-[18px] font-extrabold">Piano di Studio Personalizzato</h1>
                <p className="text-[12px] opacity-90">{planData.plan.length} capitoli da studiare</p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed opacity-95">{planData.summary}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 anim-up" style={{ animationDelay: '50ms' }}>
          <div className="glass p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: 'var(--primary-light)' }}>{accuracy}%</p>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Accuratezza</p>
          </div>
          <div className="glass p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: 'var(--success)' }}>{totalAnswered}</p>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Risposte</p>
          </div>
          <div className="glass p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: 'var(--accent)' }}>{stats.bestStreak}</p>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Serie Migliore</p>
          </div>
        </div>

        {/* Study Plan Items */}
        {planData.plan.map((item, i) => {
          const priorityColors = [
            { bg: 'var(--danger-50)', border: 'var(--danger-100)', label: 'Alta', labelColor: 'var(--danger)', icon: '🔴' },
            { bg: 'var(--accent-50)', border: 'var(--accent-100)', label: 'Media', labelColor: 'var(--accent)', icon: '🟡' },
            { bg: 'var(--primary-50)', border: 'var(--primary-100)', label: 'Normale', labelColor: 'var(--primary-light)', icon: '🔵' },
            { bg: 'var(--bg-tertiary)', border: 'var(--border)', label: 'Base', labelColor: 'var(--text-muted)', icon: '⚪' },
          ];
          const priority = priorityColors[i] || priorityColors[3];

          return (
            <button key={`${item.chapterId}-${item.day}`}
              onClick={() => openChapter(item.chapterId)}
              className="glass p-4 text-left w-full anim-up transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ animationDelay: `${(i * 80) + 100}ms` }}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: priority.bg, border: `1px solid ${priority.border}` }}>
                  <span className="text-lg font-bold" style={{ color: priority.labelColor }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.chapterName}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: priority.bg, color: priority.labelColor, border: `1px solid ${priority.border}` }}>
                      {priority.label} priorita
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{item.reason}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">📅</span>
                      <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{item.day}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">❓</span>
                      <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{item.questionCount} domande</span>
                    </div>
                  </div>
                </div>
                <svg className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          );
        })}

        {planData.plan.length === 0 && (
          <div className="glass p-8 text-center anim-up">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-[15px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Ottimo lavoro!</p>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Non hai errori da correggere al momento. Continua cosi!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 anim-up" style={{ animationDelay: '400ms' }}>
          <button onClick={() => store.setScreen('home')}
            className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 4px 20px rgba(30, 58, 138, 0.25)' }}>
            <div className="text-xl mb-1">📚</div>
            <p className="text-[13px] font-bold text-white">Torna a Studiare</p>
          </button>
          <button onClick={() => store.setScreen('aiAnalysis')}
            className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)' }}>
            <div className="text-xl mb-1">🤖</div>
            <p className="text-[13px] font-bold text-white">Analisi IA</p>
          </button>
        </div>
      </div>
    </div>
  );
}
