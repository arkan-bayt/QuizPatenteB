'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Chapter, getUniqueTopics, getChaptersByTopic, getQuestionsByChapters, getRandomQuestions } from '@/data/quizData';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';

const TOPIC_LABELS: Record<string, { icon: string; color: string }> = {
  'Conoscenze generali': { icon: '📖', color: 'text-slate-300' },
  'Segnali stradali': { icon: '🚦', color: 'text-blue-300' },
  'Norme di circolazione': { icon: '🛣️', color: 'text-amber-300' },
  'Equipaggiamento e sicurezza': { icon: '🦺', color: 'text-orange-300' },
  'Documenti e norme': { icon: '📄', color: 'text-purple-300' },
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

  const handleExamMode = () => {
    if (selectedChapterIds.length === 0) { store.selectAllChapters(); }
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

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">Quiz Patente B</h1>
            <p className="text-[var(--t3)] text-[11px] mt-0.5">Ciao, <span className="text-[var(--t2)]">{username}</span></p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => store.setScreen('admin')} className="btn-ghost text-xs px-3 py-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            )}
            <button onClick={() => { useStore.getState().setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('qp_session'); }} className="btn-ghost text-xs px-3 py-1.5">Esci</button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2.5 anim-up">
          <StatCard label="Risposte" value={totalAnswered} color="text-indigo-300" />
          <StatCard label="Corrette" value={totalCorrect} color="text-green-300" />
          <StatCard label="Sbagliate" value={totalAnswered - totalCorrect} color="text-red-300" />
          <StatCard label="Serie" value={stats.streak} color="text-amber-300" icon="🔥" />
        </div>

        {/* Overall progress */}
        <div className="card p-4 anim-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--t2)] font-medium">Progresso globale</span>
            <span className="text-xs text-[var(--t1)] font-semibold tabular-nums">
              {totalAnswered} / {allQuestions.length} ({Math.round((totalAnswered / allQuestions.length) * 100)}%)
            </span>
          </div>
          <div className="pbar">
            <div className="pfill" style={{ width: `${Math.min(100, Math.round((totalAnswered / allQuestions.length) * 100))}%` }} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={handleExamMode} className="card-hover p-4 text-left anim-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><span className="text-lg">📝</span></div>
              <div>
                <p className="text-sm font-semibold text-white">Esame</p>
                <p className="text-[11px] text-[var(--t3)]">30 domande casuali</p>
              </div>
            </div>
          </button>
          <button onClick={handleWrongRetry} className={`card-hover p-4 text-left anim-up ${wrong.total === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><span className="text-lg">❌</span></div>
              <div>
                <p className="text-sm font-semibold text-white">Sbagliate</p>
                <p className="text-[11px] text-[var(--t3)]">{wrong.total} da ripetere</p>
              </div>
            </div>
          </button>
        </div>

        {/* Chapters */}
        {topics.map((topic, ti) => {
          const tl = TOPIC_LABELS[topic] || { icon: '📚', color: 'text-slate-300' };
          const topicChapters = getChaptersByTopic(chapters, topic);
          return (
            <div key={topic} className="anim-up" style={{ animationDelay: `${ti * 50}ms` }}>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span>{tl.icon}</span>
                <h2 className="text-xs font-semibold text-[var(--t3)] uppercase tracking-widest">{topic}</h2>
              </div>
              <div className="space-y-1.5">
                {topicChapters.map((ch) => {
                  const cs = chapterStats.find((x) => x.id === ch.id);
                  const answered = cs?.answered || 0;
                  const totalQ = ch.questionCount;
                  const pctVal = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;
                  return (
                    <button key={ch.id} onClick={() => store.openChapter(ch.id)} className="card-hover w-full text-left p-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] text-[var(--t3)] font-medium tabular-nums">Cap. {ch.id}</span>
                          <p className="text-sm font-medium text-white truncate">{ch.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 pbar">
                            <div className="pfill" style={{ width: `${pctVal}%`, background: pctVal === 100 ? 'var(--green)' : 'var(--indigo)' }} />
                          </div>
                          <span className="text-[11px] text-[var(--t3)] tabular-nums w-16 text-right">{answered}/{totalQ}</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[var(--t3)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon?: string }) {
  return (
    <div className="card p-3 text-center">
      {icon && <span className="text-sm">{icon}</span>}
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-[var(--t3)] mt-0.5">{label}</p>
    </div>
  );
}
