'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';
import { useChapterProgress } from './hooks';
import { getSubtopicsForChapter, getQuestionsBySubtopic } from '@/data/quizData';

interface AIAnalysis {
  level: string;
  levelEmoji: string;
  levelTitle: string;
  overallScore: number;
  summary: string;
  strengths: { chapter: string; text: string }[];
  weaknesses: { chapter: string; text: string }[];
  recommendations: string[];
  tips: string[];
  motivation: string;
  fallback?: boolean;
}

export default function AIAnalysisScreen() {
  const store = useStore();
  const { user, chapters, allQuestions } = store;
  const username = user?.username || '';
  const { totalAnswered, totalCorrect, totalWrong, chapterStats } = useOverallStats();
  const stats = useUserStats();
  const wrong = useWrongAnswers();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || chapters.length === 0) return;

    // Get wrong topics
    const wrongTopics: string[] = [];
    const topicCounts: Record<string, number> = {};
    for (const q of wrong.questions) {
      if (q.subtopic) {
        topicCounts[q.subtopic] = (topicCounts[q.subtopic] || 0) + 1;
      }
    }
    Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([topic]) => wrongTopics.push(topic));

    const body = {
      action: 'analyze',
      username,
      stats: {
        totalAnswered,
        totalCorrect,
        totalWrong,
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
      wrongTopics,
    };

    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore del server');
        return res.json();
      })
      .then(data => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Errore durante l\'analisi');
        setLoading(false);
      });
  }, [username, chapters, totalAnswered, totalCorrect, totalWrong, stats, wrong.questions, chapterStats]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'principiante': return { gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' };
      case 'intermedio': return { gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', bg: '#DBEAFE', border: '#BFDBFE', text: '#1E40AF' };
      case 'avanzato': return { gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', bg: '#EDE9FE', border: '#DDD6FE', text: '#5B21B6' };
      case 'esperto': return { gradient: 'linear-gradient(135deg, #10B981, #059669)', bg: '#D1FAE5', border: '#A7F3D0', text: '#065F46' };
      default: return { gradient: 'linear-gradient(135deg, #6B7280, #4B5563)', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' };
    }
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
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)' }}>
              🤖
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white animate-spin"
              style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)' }} />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>Analisi IA in corso...</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>L&apos;intelligenza artificiale sta analizzando il tuo livello e le tue prestazioni</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary-light)', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
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
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error || 'Errore durante l\'analisi'}</p>
          <button onClick={() => store.setScreen('home')} className="btn-primary px-6 py-3">Torna alla Home</button>
        </div>
      </div>
    );
  }

  const levelColors = getLevelColor(analysis.level);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

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
            <span className="text-[11px] px-3 py-1.5 rounded-full font-semibold" style={{ background: levelColors.bg, color: levelColors.text, border: `1px solid ${levelColors.border}` }}>
              Analisi IA
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Level Card */}
        <div className="anim-up relative overflow-hidden p-6 rounded-3xl text-white"
          style={{ background: levelColors.gradient, boxShadow: `0 8px 32px ${levelColors.text}33` }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-2">{analysis.levelEmoji}</div>
                <h1 className="text-[22px] font-extrabold">{analysis.levelTitle}</h1>
                <p className="text-sm mt-1 opacity-90">Livello: {analysis.level.charAt(0).toUpperCase() + analysis.level.slice(1)}</p>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(analysis.overallScore / 100) * 213.6} 213.6`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-extrabold">{analysis.overallScore}</span>
                  </div>
                </div>
                <p className="text-[10px] mt-1 opacity-80">Punteggio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass p-5 anim-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: levelColors.bg }}>
              <svg className="w-4 h-4" style={{ color: levelColors.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Riepilogo</h2>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{analysis.summary}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <p className="text-lg font-extrabold" style={{ color: 'var(--primary-light)' }}>{totalAnswered}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Risposte</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <p className="text-lg font-extrabold" style={{ color: 'var(--success)' }}>{accuracy}%</p>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Accuratezza</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <p className="text-lg font-extrabold" style={{ color: 'var(--accent)' }}>{stats.bestStreak}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Serie migliore</p>
            </div>
          </div>
        </div>

        {/* Strengths */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <div className="anim-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">💪</span>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Punti di Forza</h2>
            </div>
            <div className="space-y-2.5">
              {analysis.strengths.map((s, i) => (
                <div key={i} className="glass p-4 flex items-start gap-3 transition-all duration-200 hover:scale-[1.01]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-100)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--success)' }}>{s.chapter}</p>
                    <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {analysis.weaknesses && analysis.weaknesses.length > 0 && (
          <div className="anim-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">🎯</span>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Aree da Migliorare</h2>
            </div>
            <div className="space-y-2.5">
              {analysis.weaknesses.map((w, i) => (
                <div key={i} className="glass p-4 flex items-start gap-3 transition-all duration-200 hover:scale-[1.01]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--danger-100)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--danger)' }}>{w.chapter}</p>
                    <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="anim-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">📋</span>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Raccomandazioni</h2>
            </div>
            <div className="glass p-5 space-y-3">
              {analysis.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--primary-100)' }}>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--primary-light)' }}>{i + 1}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {analysis.tips && analysis.tips.length > 0 && (
          <div className="anim-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">💡</span>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Consigli Pratici</h2>
            </div>
            <div className="glass p-5 space-y-3">
              {analysis.tips.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--accent-100)' }}>
                    <svg className="w-3 h-3" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189" />
                    </svg>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivation */}
        <div className="anim-up" style={{ animationDelay: '300ms' }}>
          <div className="glass p-5 text-center" style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--bg-card))' }}>
            <div className="text-2xl mb-2">✨</div>
            <p className="text-[14px] font-semibold italic" style={{ color: 'var(--primary-light)' }}>&ldquo;{analysis.motivation}&rdquo;</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 anim-up" style={{ animationDelay: '350ms' }}>
          <button onClick={() => store.setScreen('home')}
            className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 4px 20px rgba(30, 58, 138, 0.25)' }}>
            <div className="text-xl mb-1">📚</div>
            <p className="text-[13px] font-bold text-white">Continua a Studiare</p>
          </button>
          {wrong.total > 0 && (
            <button onClick={() => {
              if (wrong.questions.length > 0) {
                store.startQuiz(wrong.questions, 'wrong');
              }
            }}
              className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
              <div className="text-xl mb-1">🔄</div>
              <p className="text-[13px] font-bold text-white">Ripeti Errori ({wrong.total})</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
