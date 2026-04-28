// ============================================================
// UI LAYER - Result Screen Component
// ============================================================

'use client';

import React from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { clearProgress } from '@/logic/resumeEngine';

export default function ResultScreen() {
  const {
    correctCount,
    totalAnswered,
    selectedChapterIds,
    questions,
    restartQuiz,
    setScreen,
  } = useQuizStore();

  const percentage = totalAnswered > 0
    ? Math.round((correctCount / totalAnswered) * 100)
    : 0;

  const passed = percentage >= 60; // Patente B exam pass threshold is typically higher, but using 60% for practice

  const handleRestart = () => {
    clearProgress();
    restartQuiz();
  };

  const handleNewQuiz = () => {
    clearProgress();
    setScreen('select');
  };

  // Determine message based on score
  const getMessage = () => {
    if (percentage >= 90) return { title: 'Eccellente!', subtitle: 'Sei pronto per l\'esame!' };
    if (percentage >= 70) return { title: 'Ottimo!', subtitle: 'Ottimo lavoro, continua cosi!' };
    if (percentage >= 60) return { title: 'Buono!', subtitle: 'Buon risultato, ma puoi migliorare.' };
    if (percentage >= 40) return { title: 'Insufficiente', subtitle: 'Ripassa gli argomenti e riprova.' };
    return { title: 'Da ripassare', subtitle: 'Non scoraggiarti, studia e riprova!' };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Score Circle */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full border-4 ${
            passed ? 'border-green-400 bg-green-500/10' : 'border-red-400 bg-red-500/10'
          }`}>
            <div>
              <p className={`text-4xl font-bold ${passed ? 'text-green-300' : 'text-red-300'}`}>
                {percentage}%
              </p>
              <p className="text-blue-200 text-xs mt-1">Punteggio</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-300' : 'text-red-300'}`}>
          {message.title}
        </h1>
        <p className="text-blue-200 text-sm mb-8">
          {message.subtitle}
        </p>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/20">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-white">{totalAnswered}</p>
              <p className="text-blue-300 text-xs mt-1">Totali</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-300">{correctCount}</p>
              <p className="text-green-300/70 text-xs mt-1">Corrette</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-300">{totalAnswered - correctCount}</p>
              <p className="text-red-300/70 text-xs mt-1">Sbagliate</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-blue-200 text-sm">
              Capitoli studiati: <span className="text-white font-medium">{selectedChapterIds.length}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Riprova stesso quiz
          </button>
          <button
            onClick={handleNewQuiz}
            className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            Nuova selezione argomenti
          </button>
        </div>
      </div>
    </div>
  );
}
