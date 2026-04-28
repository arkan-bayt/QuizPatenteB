'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Chapter, getUniqueTopics, getChaptersByTopic, getQuestionsByChapters, getRandomQuestions } from '@/data/quizData';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';
import { clearSession } from '@/logic/authEngine';

const TOPIC_META: Record<string, { icon: string; gradient: string }> = {
  'Conoscenze generali': { icon: '📖', gradient: 'from-slate-500/15 to-slate-600/5' },
  'Segnali stradali': { icon: '🚦', gradient: 'from-blue-500/15 to-blue-600/5' },
  'Norme di circolazione': { icon: '🛣️', gradient: 'from-amber-500/15 to-amber-600/5' },
  'Equipaggiamento e sicurezza': { icon: '🦺', gradient: 'from-orange-500/15 to-orange-600/5' },
  'Documenti e norme': { icon: '📄', gradient: 'from-purple-500/15 to-purple-600/5' },
};

export default function HomeScreen() {
  const store = useStore();
  const { user, chapters, allQuestions, selectedChapterIds } = store;
  const { totalAnswered, totalCorrect, chapterStats } = useOverallStats();
  const stats = useUserStats();
  const wrong = useWrongAnswers();
  const topics = useMemo(() => getUniqueTopics(chapters), [chapters]);
  const isAdmin = user?.role === 'admin';
  const username = user?.username || '';
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const handleExamMode = () => {
    const ids = selectedChapterIds.length > 0 ? selectedChapterIds : chapters.map((c) => c.id);
    const qs = getQuestionsByChapters(allQuestions, ids);
    const examQs = getRandomQuestions(qs, 30);
    if (examQs.length < 30) return;
    store.startQuiz(examQs, 'exam');
  };

  const handleWrongRetry = () => {
    if (wrong.questions.length === 0) return;
    store.startQuiz(wrong.questions, 'wrong');
  };

  const handleLogout = () => {
    clearSession();
    store.setUser(null);
    store.setScreen('login');
  };

  return (
    <div className="min-h-screen bg-mesh pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)]" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.15)' }}>
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-white tracking-tight">Quiz Patente B</h1>
              <p className="text-[var(--text-muted)] text-[11px] mt-0.5 font-medium">Ciao, <span className="text-[var(--text-secondary)]">{username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => store.setScreen('admin')} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5" style={{ borderRadius: 12 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            )}
            <button onClick={handleLogout} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5" style={{ borderRadius: 12 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Esci
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="📋" value={totalAnswered} label="Risposte" glow="stat-glow-blue" color="text-indigo-300" />
          <StatCard icon="✅" value={totalCorrect} label="Corrette" glow="stat-glow-green" color="text-green-300" />
          <StatCard icon="❌" value={totalAnswered - totalCorrect} label="Sbagliate" glow="stat-glow-red" color="text-red-300" />
          <StatCard icon="🔥" value={stats.streak} label="Serie" glow="stat-glow-amber" color="text-amber-300" />
        </div>

        {/* Overall Progress */}
        <div className="glass p-5 anim-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-white">Progresso globale</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white tabular-nums">{Math.min(100, Math.round((totalAnswered / allQuestions.length) * 100))}%</span>
              <p className="text-[10px] text-[var(--text-muted)]">{totalAnswered} / {allQuestions.length}</p>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((totalAnswered / allQuestions.length) * 100))}%` }} />
          </div>
          {accuracy > 0 && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[11px] text-[var(--text-muted)]">Accuratezza: <span className="text-green-300 font-semibold">{accuracy}%</span></span>
              </div>
              {stats.examsPassed > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">🏆</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Esami superati: <span className="text-amber-300 font-semibold">{stats.examsPassed}</span></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleExamMode} className="glass-hover p-5 text-left anim-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))', border: '1px solid rgba(245,158,11,0.12)' }}>
                📝
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">Esame</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">30 domande casuali</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: stats.examsPassed > 0 ? '100%' : '0%' }} />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">{stats.examsPassed} passati</span>
            </div>
          </button>

          <button onClick={handleWrongRetry} className={`glass-hover p-5 text-left anim-up transition-opacity ${wrong.total === 0 ? 'opacity-40 pointer-events-none' : ''}`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))', border: '1px solid rgba(239,68,68,0.12)' }}>
                🔄
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">Ripeti Errori</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{wrong.total} da ripassare</p>
              </div>
            </div>
            {wrong.total > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.04]">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: `${Math.min(100, wrong.total * 3)}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">{wrong.total} Q</span>
              </div>
            )}
          </button>
        </div>

        {/* Chapters by Topic */}
        {topics.map((topic, ti) => {
          const tm = TOPIC_META[topic] || { icon: '📚', gradient: 'from-slate-500/15 to-slate-600/5' };
          const topicChapters = getChaptersByTopic(chapters, topic);
          const topicTotal = topicChapters.reduce((s, c) => s + c.questionCount, 0);
          const topicAnswered = topicChapters.reduce((s, c) => { const cs = chapterStats.find((x) => x.id === c.id); return s + (cs?.answered || 0); }, 0);
          const topicPct = topicTotal > 0 ? Math.round((topicAnswered / topicTotal) * 100) : 0;

          return (
            <div key={topic} className="anim-up" style={{ animationDelay: `${(ti * 60) + 200}ms` }}>
              {/* Topic Header */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tm.gradient} flex items-center justify-center text-sm border border-white/[0.05]`}>
                  {tm.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.12em]">{topic}</h2>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">{topicChapters.length} cap.</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-1 rounded-full bg-white/[0.04]">
                      <div className="h-full rounded-full bg-indigo-500/60 transition-all duration-700" style={{ width: `${topicPct}%` }} />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">{topicAnswered}/{topicTotal}</span>
                  </div>
                </div>
              </div>

              {/* Chapter List */}
              <div className="space-y-2">
                {topicChapters.map((ch, ci) => {
                  const cs = chapterStats.find((x) => x.id === ch.id);
                  const answered = cs?.answered || 0;
                  const totalQ = ch.questionCount;
                  const pctVal = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;
                  const isComplete = pctVal === 100;

                  return (
                    <button key={ch.id} onClick={() => store.openChapter(ch.id)}
                      className="glass-hover w-full text-left p-4 flex items-center gap-4 anim-up"
                      style={{ animationDelay: `${(ti * 60) + (ci * 30) + 250}ms` }}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isComplete ? 'bg-green-500/15' : 'bg-white/[0.04]'}`}
                        style={{ border: `1px solid ${isComplete ? 'rgba(34,197,94,0.2)' : 'var(--border)'}` }}>
                        {isComplete
                          ? <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          : <span className="text-[13px] font-bold text-[var(--text-secondary)] tabular-nums">{ch.id}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{ch.name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 progress-bar" style={{ height: '3px' }}>
                            <div className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-green-400' : ''}`}
                              style={{ width: `${pctVal}%`, background: isComplete ? undefined : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)] tabular-nums font-medium w-16 text-right">{answered}/{totalQ}</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, glow, color }: { icon: string; value: number; label: string; glow: string; color: string }) {
  return (
    <div className={`glass ${glow} p-4 text-center transition-all duration-300 hover:scale-[1.02]`}>
      <span className="text-lg mb-1 block">{icon}</span>
      <p className={`text-xl font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}
