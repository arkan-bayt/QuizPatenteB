'use client';

import React, { useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { QuizQuestion } from '@/data/quizData';
import { getUniqueTopics, getChaptersByTopic, getQuestionsByChapters } from '@/data/quizData';
import { loadProgress, clearProgress } from '@/logic/resumeEngine';

export default function SelectionScreen() {
  const store = useAppStore();
  const { chapters, allQuestions, selectedChapterIds, showResumePopup } = store;

  const topics = useMemo(() => getUniqueTopics(chapters), [chapters]);
  const selectedQCount = useMemo(() => getQuestionsByChapters(allQuestions, selectedChapterIds).length, [allQuestions, selectedChapterIds]);
  const allSelected = selectedChapterIds.length === chapters.length;

  useEffect(() => {
    const p = loadProgress();
    if (p) store.setShowResumePopup(true);
  }, []);

  const handleStart = () => {
    if (selectedChapterIds.length === 0) return;
    const qs = getQuestionsByChapters(allQuestions, selectedChapterIds);
    store.startQuiz(qs);
  };

  const handleResume = () => {
    const p = loadProgress();
    if (!p) { store.setShowResumePopup(false); return; }
    const qs = allQuestions.filter((q) => p.questionIds.includes(q.id)) as QuizQuestion[];
    if (qs.length > 0) store.startQuiz(qs, p.currentIndex, p.correctCount, p.totalAnswered - p.correctCount);
    store.setShowResumePopup(false);
  };

  const handleStartFresh = () => {
    clearProgress();
    store.setShowResumePopup(false);
  };

  const handleLogout = () => {
    store.logout();
    if (typeof window !== 'undefined') localStorage.removeItem('quiz_admin_session');
  };

  const TOPIC_ICONS: Record<string, string> = {
    'Conoscenze generali': '📖',
    'Segnali stradali': '🚦',
    'Norme di circolazione': '🛣️',
    'Equipaggiamento e sicurezza': '🦺',
    'Documenti e norme': '📄',
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Seleziona Argomenti</h1>
            <p className="text-slate-500 text-xs mt-0.5">{chapters.length} capitoli &middot; {allQuestions.length} domande totali</p>
          </div>
          <button onClick={handleLogout} className="btn-ghost text-xs">Esci</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Quick select bar */}
        <div className="glass-card p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">
              {allSelected ? 'Tutti selezionati' : `${selectedChapterIds.length} capitoli`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{selectedQCount} domande selezionate</p>
          </div>
          <div className="flex gap-2">
            {!allSelected && (
              <button onClick={() => store.selectAll()} className="badge bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 transition-colors cursor-pointer">
                Seleziona tutti
              </button>
            )}
            {selectedChapterIds.length > 0 && (
              <button onClick={() => store.deselectAll()} className="badge bg-white/[0.06] text-slate-400 hover:bg-white/[0.1] transition-colors cursor-pointer">
                Deseleziona
              </button>
            )}
          </div>
        </div>

        {/* Chapters by topic */}
        <div className="space-y-6">
          {topics.map((topic) => {
            const topicChapters = getChaptersByTopic(chapters, topic);
            const topicIcon = TOPIC_ICONS[topic] || '📚';
            return (
              <div key={topic} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="text-base">{topicIcon}</span>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{topic}</h2>
                  <span className="text-xs text-slate-600">({topicChapters.reduce((a, c) => a + c.questionCount, 0)})</span>
                </div>
                <div className="space-y-1.5">
                  {topicChapters.map((ch) => {
                    const sel = selectedChapterIds.includes(ch.id);
                    return (
                      <button key={ch.id} onClick={() => store.toggleChapter(ch.id)} className={`chapter-item w-full text-left ${sel ? 'chapter-item-active' : 'chapter-item-inactive'}`}>
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${sel ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                          {sel && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            <span className="text-slate-500 mr-1.5">Cap. {ch.id}</span>
                            {ch.name}
                          </p>
                        </div>
                        {/* Count */}
                        <span className={`badge flex-shrink-0 ${sel ? 'bg-blue-500/20 text-blue-300' : 'bg-white/[0.04] text-slate-500'}`}>
                          {ch.questionCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-400">
              <span className="text-white font-semibold">{selectedChapterIds.length}</span> capitoli &middot;{' '}
              <span className="text-white font-semibold">{selectedQCount}</span> domande
            </p>
          </div>
          <button onClick={handleStart} disabled={selectedChapterIds.length === 0} className="btn-accent w-full text-base">
            Inizia Quiz
          </button>
        </div>
      </div>

      {/* Resume Popup */}
      {showResumePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in">
          <div className="glass-card p-7 max-w-xs w-full text-center animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Quiz in corso</h3>
            <p className="text-slate-400 text-sm mb-6">Vuoi continuare da dove hai lasciato o ricominciare?</p>
            <div className="space-y-2.5">
              <button onClick={handleResume} className="btn-accent w-full">Continua</button>
              <button onClick={handleStartFresh} className="btn-ghost w-full border border-white/[0.08] rounded-xl">Ricomincia da capo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
