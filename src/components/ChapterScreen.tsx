'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getSubtopicsForChapter, getQuestionsBySubtopic, getQuestionsByChapters } from '@/data/quizData';
import { useChapterProgress } from './hooks';

export default function ChapterScreen() {
  const store = useStore();
  const { activeChapterId, allQuestions, chapters, user } = store;
  const chapter = chapters.find((c) => c.id === activeChapterId);
  const subtopics = useMemo(() => activeChapterId ? getSubtopicsForChapter(allQuestions, activeChapterId) : [], [allQuestions, activeChapterId]);
  const chapterProgress = useChapterProgress(activeChapterId || 0);
  const allChapterQs = activeChapterId ? getQuestionsByChapters(allQuestions, [activeChapterId]) : [];

  if (!chapter) return null;

  const answeredCount = chapterProgress.answeredIds.length;
  const correctCount = chapterProgress.correctIds.length;
  const wrongCount = chapterProgress.wrongIds.length;
  const totalQ = chapter.questionCount;
  const pct = totalQ > 0 ? Math.round((answeredCount / totalQ) * 100) : 0;
  const isComplete = pct === 100;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleStartAll = () => {
    const unanswered = allChapterQs.filter((q) => !chapterProgress.answeredIds.includes(q.id));
    const qs = unanswered.length > 0 ? unanswered : allChapterQs;
    store.startQuiz(qs, 'chapter');
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.goHome()} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>Cap. {chapter.id}: {chapter.name}</h1>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{answeredCount}/{totalQ} completate</p>
          </div>
          {isComplete && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'var(--success-100)', border: '1px solid var(--success-150)' }}>
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--success)' }}>Completato</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Progress Card */}
        <div className="glass p-6 anim-up" style={{ boxShadow: isComplete ? 'var(--glow-success)' : 'var(--shadow-lg)' }}>
          {/* Circular progress + stats */}
          <div className="flex items-center gap-6 mb-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={isComplete ? 'var(--success)' : 'url(#chGradient)'} strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: isComplete ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))' : 'none' }}
                />
                <defs>
                  <linearGradient id="chGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold tabular-nums" style={{ color: isComplete ? 'var(--success)' : 'var(--text-primary)' }}>{pct}%</span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{answeredCount}/{totalQ}</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--success)' }}>{correctCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Corrette</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--danger)' }}>{wrongCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Sbagliate</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--primary-light)' }}>{accuracy}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Precisione</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar mb-5">
            <div className={isComplete ? 'progress-fill-green' : 'progress-fill'} style={{ width: `${pct}%` }} />
          </div>

          {/* Action button */}
          <div className="flex gap-3">
            <button onClick={handleStartAll} className={`flex-1 ${isComplete ? 'btn-success' : 'btn-primary'}`}>
              {answeredCount === 0 ? 'Inizia Capitolo' : answeredCount >= totalQ ? 'Ripeti Capitolo' : `Continua (${totalQ - answeredCount} rimaste)`}
            </button>
          </div>
        </div>

        {/* Subtopics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1 mb-3">
            <div className="icon-box icon-box-purple w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--purple)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>Sottotemi ({subtopics.length})</h2>
          </div>

          {subtopics.map((st, i) => {
            const stQs = getQuestionsBySubtopic(allQuestions, chapter.id, st);
            const stAnswered = stQs.filter((q) => chapterProgress.answeredIds.includes(q.id)).length;
            const stPct = stQs.length > 0 ? Math.round((stAnswered / stQs.length) * 100) : 0;
            const stLabel = st.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const stComplete = stPct === 100;

            return (
              <button key={st} onClick={() => store.openSubtopic(chapter.id, st)}
                className="glass-hover w-full text-left p-4 flex items-center gap-4 anim-up"
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: stComplete ? 'var(--success-100)' : 'var(--bg-tertiary)', border: `1px solid ${stComplete ? 'var(--success-150)' : 'var(--border)'}` }}>
                  {stComplete
                    ? <svg className="w-5 h-5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    : <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{stLabel}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 progress-bar" style={{ height: '3px' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${stPct}%`, background: stComplete ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--primary-light))' }} />
                    </div>
                    <span className="text-[10px] tabular-nums font-medium" style={{ color: 'var(--text-muted)' }}>{stAnswered}/{stQs.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge-modern text-[10px]">{stQs.length} Q</span>
                </div>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
