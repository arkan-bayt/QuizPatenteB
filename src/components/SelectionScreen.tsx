// ============================================================
// UI LAYER - Selection Screen Component
// ============================================================

'use client';

import React, { useEffect, useMemo } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CHAPTERS, getUniqueTopics, getChaptersByTopic, getQuestionsByChapters } from '@/data/quizData';
import { hasResumableProgress, loadProgress, clearProgress, SavedProgress } from '@/logic/resumeEngine';

export default function SelectionScreen() {
  const {
    selectedChapterIds,
    toggleChapter,
    selectAllChapters,
    deselectAllChapters,
    startQuiz,
    setScreen,
    showResumePopup,
    setShowResumePopup,
  } = useQuizStore();

  const { logout } = useAuthStore();

  const topics = useMemo(() => getUniqueTopics(), []);
  const allChapterIds = useMemo(() => CHAPTERS.map((ch) => ch.id), []);

  const selectedCount = selectedChapterIds.length;
  const totalQuestions = useMemo(() => {
    return getQuestionsByChapters(selectedChapterIds).length;
  }, [selectedChapterIds]);

  // Check for resumable progress on mount
  useEffect(() => {
    if (hasResumableProgress()) {
      setShowResumePopup(true);
    }
  }, [setShowResumePopup]);

  const handleStartQuiz = () => {
    if (selectedChapterIds.length === 0) return;
    const questions = getQuestionsByChapters(selectedChapterIds);
    if (questions.length === 0) return;
    startQuiz(questions);
  };

  const handleContinueProgress = () => {
    const progress = loadProgress();
    if (progress) {
      // Import here to avoid circular dependency
      const { ALL_QUESTIONS } = require('@/data/quizData');
      const questions = ALL_QUESTIONS.filter((q: { id: number }) =>
        progress.questionIds.includes(q.id)
      );
      if (questions.length > 0) {
        startQuiz(questions);
        // Restore progress state
        useQuizStore.setState({
          correctCount: progress.correctCount,
          totalAnswered: progress.totalAnswered,
        });
      }
    }
    setShowResumePopup(false);
  };

  const handleStartFresh = () => {
    clearProgress();
    setShowResumePopup(false);
  };

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz_admin_session');
    }
    setScreen('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Quiz Patente B</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Esci
        </button>
      </div>

      {/* Selection Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
        <h2 className="text-lg font-semibold text-white mb-1">
          Seleziona gli argomenti
        </h2>
        <p className="text-blue-200 text-sm">
          Scegli i capitoli su cui vuoi esercitarti
        </p>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => selectAllChapters(allChapterIds)}
            className="text-xs px-3 py-1.5 bg-yellow-400/20 text-yellow-300 rounded-lg hover:bg-yellow-400/30 transition-colors"
          >
            Seleziona tutti
          </button>
          <button
            onClick={deselectAllChapters}
            className="text-xs px-3 py-1.5 bg-white/10 text-blue-200 rounded-lg hover:bg-white/20 transition-colors"
          >
            Deseleziona tutti
          </button>
        </div>
      </div>

      {/* Topics and Chapters */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const chapters = getChaptersByTopic(topic);
          if (chapters.length === 0) return null;
          return (
            <div key={topic} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-yellow-300 mb-3 uppercase tracking-wide">
                {topic}
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter) => {
                  const isSelected = selectedChapterIds.includes(chapter.id);
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => toggleChapter(chapter.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-yellow-400/20 border border-yellow-400/40 text-white'
                          : 'bg-white/5 border border-white/10 text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'border-blue-400/40'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Cap. {chapter.id}: {chapter.name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-blue-300/60 bg-white/5 px-2 py-1 rounded-lg">
                        {chapter.questionCount} domande
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-900/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-blue-200">
              <span className="font-bold text-white">{selectedCount}</span> capitoli selezionati
              {' '}&middot;{' '}
              <span className="font-bold text-white">{totalQuestions}</span> domande
            </p>
          </div>
          <button
            onClick={handleStartQuiz}
            disabled={selectedCount === 0}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
          >
            Inizia il Quiz
          </button>
        </div>
      </div>

      {/* Resume Popup */}
      {showResumePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-blue-800 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Riprendere il quiz?
            </h3>
            <p className="text-blue-200 text-sm mb-6">
              Hai un quiz in corso. Vuoi continuare da dove hai lasciato o ricominciare?
            </p>
            <div className="space-y-3">
              <button
                onClick={handleContinueProgress}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all"
              >
                Continua
              </button>
              <button
                onClick={handleStartFresh}
                className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
              >
                Ricomincia da capo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
