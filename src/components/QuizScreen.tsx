// ============================================================
// UI LAYER - Quiz Screen Component
// ============================================================

'use client';

import React, { useEffect, useCallback } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/useAuthStore';
import { speakText, stopSpeech, preloadVoices } from '@/logic/ttsEngine';
import { saveProgress } from '@/logic/resumeEngine';

export default function QuizScreen() {
  const {
    questions,
    currentIndex,
    correctCount,
    totalAnswered,
    selectedAnswer,
    showFeedback,
    submitAnswer,
    nextQuestion,
    setScreen,
    getCurrentQuestion,
    getScore,
  } = useQuizStore();

  const { logout } = useAuthStore();

  // Preload TTS voices
  useEffect(() => {
    preloadVoices();
  }, []);

  // Save progress on every answer
  const saveCurrentProgress = useCallback(() => {
    const state = useQuizStore.getState();
    saveProgress({
      chapterIds: state.selectedChapterIds,
      questionIds: state.questions.map((q) => q.id),
      currentIndex: state.currentIndex,
      correctCount: state.correctCount,
      totalAnswered: state.totalAnswered,
      timestamp: Date.now(),
    });
  }, []);

  // Save progress when totalAnswered changes
  useEffect(() => {
    if (totalAnswered > 0) {
      saveCurrentProgress();
    }
  }, [totalAnswered, saveCurrentProgress]);

  // Clean up TTS on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const question = getCurrentQuestion();
  const score = getScore();

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-lg">Nessuna domanda disponibile</p>
      </div>
    );
  }

  const handleAnswer = (answer: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    submitAnswer(answer);
  };

  const handleNext = () => {
    if (!showFeedback) return;
    nextQuestion();
  };

  const handleSpeak = () => {
    if (showFeedback) return;
    stopSpeech();
    speakText(question.question, 'it-IT');
  };

  const handleRestart = () => {
    stopSpeech();
    useQuizStore.getState().restartQuiz();
  };

  const handleExit = () => {
    stopSpeech();
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz_admin_session');
    }
    setScreen('login');
  };

  const isCorrect = selectedAnswer === question.answer;
  const progressPercent = questions.length > 0
    ? Math.round(((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-blue-950/50 border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleRestart}
              className="text-xs text-blue-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Indietro
            </button>
            <span className="text-sm text-blue-200 font-medium">
              {currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={handleExit}
              className="text-xs text-blue-300 hover:text-white transition-colors"
            >
              Esci
            </button>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Score Badges */}
      <div className="px-4 py-2 flex justify-center gap-4">
        <div className="bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-1">
          <span className="text-green-300 text-xs font-medium">Corrette: {correctCount}</span>
        </div>
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-1">
          <span className="text-red-300 text-xs font-medium">Sbagliate: {totalAnswered - correctCount}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Chapter Badge */}
          <div className="mb-3">
            <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full">
              Cap. {question.chapter}: {question.chapterName}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-white text-lg font-medium leading-relaxed flex-1">
                {question.question}
              </p>
              <button
                onClick={handleSpeak}
                className="flex-shrink-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/20"
                title="Ascolta la domanda"
              >
                <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
                </svg>
              </button>
            </div>

            {/* Answer Buttons */}
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleAnswer(true)}
                  className="py-4 bg-green-500/20 border-2 border-green-400/40 text-green-300 font-bold rounded-xl hover:bg-green-500/30 hover:border-green-400 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  VERO
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="py-4 bg-red-500/20 border-2 border-red-400/40 text-red-300 font-bold rounded-xl hover:bg-red-500/30 hover:border-red-400 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  FALSO
                </button>
              </div>
            ) : (
              <div className="mt-6">
                {/* Feedback */}
                <div className={`p-4 rounded-xl mb-4 ${
                  isCorrect
                    ? 'bg-green-500/20 border border-green-400/30'
                    : 'bg-red-500/20 border border-red-400/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {isCorrect ? 'Corretto!' : 'Sbagliato!'}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    La risposta corretta era: <span className="font-bold text-white">{question.answer ? 'VERO' : 'FALSO'}</span>
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {question.explanation}
                  </p>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {currentIndex < questions.length - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
