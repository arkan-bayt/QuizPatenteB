'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getSubtopicsForChapter, getQuestionsBySubtopic, getQuestionsByChapters } from '@/data/quizData';
import { useChapterProgress } from './hooks';

export default function ChapterScreen() {
  const store = useStore();
  const { activeChapterId, allQuestions, chapters, user } = store;
  const username = user?.username || '';
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

  const handleStartAll = () => {
    const unanswered = allChapterQs.filter((q) => !chapterProgress.answeredIds.includes(q.id));
    const qs = unanswered.length > 0 ? unanswered : allChapterQs;
    store.startQuiz(qs, 'chapter');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => store.goHome()} className="text-[var(--t2)] hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">Cap. {chapter.id}: {chapter.name}</h1>
            <p className="text-[11px] text-[var(--t3)]">{answeredCount}/{totalQ} completate</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
        {/* Progress card */}
        <div className="card p-4 anim-up">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <p className="text-lg font-bold text-green-300 tabular-nums">{correctCount}</p>
              <p className="text-[10px] text-[var(--t3)]">Corrette</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-300 tabular-nums">{wrongCount}</p>
              <p className="text-[10px] text-[var(--t3)]">Sbagliate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--t1)] tabular-nums">{pct}%</p>
              <p className="text-[10px] text-[var(--t3)]">Progresso</p>
            </div>
          </div>
          <div className="pbar mb-3">
            <div className="pfill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--indigo)' }} />
          </div>
          <button onClick={handleStartAll} className="btn-indigo w-full text-sm">
            {answeredCount === 0 ? 'Inizia Capitolo' : answeredCount >= totalQ ? 'Ripeti Capitolo' : `Continua (${totalQ - answeredCount} rimaste)`}
          </button>
        </div>

        {/* Subtopics */}
        <div className="space-y-1.5">
          <p className="text-xs text-[var(--t3)] font-semibold uppercase tracking-widest px-1 mb-2">Sottotemi ({subtopics.length})</p>
          {subtopics.map((st, i) => {
            const stQs = getQuestionsBySubtopic(allQuestions, chapter.id, st);
            const stAnswered = stQs.filter((q) => chapterProgress.answeredIds.includes(q.id)).length;
            const stPct = stQs.length > 0 ? Math.round((stAnswered / stQs.length) * 100) : 0;
            const stLabel = st.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            return (
              <button key={st} onClick={() => store.openSubtopic(chapter.id, st)} className="card-hover w-full text-left p-3.5 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{stLabel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 pbar">
                      <div className="pfill" style={{ width: `${stPct}%` }} />
                    </div>
                    <span className="text-[10px] text-[var(--t3)] tabular-nums">{stAnswered}/{stQs.length}</span>
                  </div>
                </div>
                <span className="text-[11px] text-[var(--t3)]">{stQs.length} Q</span>
                <svg className="w-4 h-4 text-[var(--t3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
