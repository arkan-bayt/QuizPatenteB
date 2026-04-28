'use client';
import React from 'react';
import { useStore } from '@/store/useStore';
import { clearQuizResume } from '@/logic/progressEngine';

export default function ResultScreen() {
  const store = useStore();
  const { correctCount, wrongCount, quizQuestions, quizMode, autoAdvance, examPassed, user } = store;
  const total = correctCount + wrongCount;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isExam = quizMode === 'exam';
  const passed = isExam ? correctCount >= 21 : pct >= 60;

  const title = pct >= 90 ? 'Eccellente!' : pct >= 70 ? 'Ottimo!' : pct >= 60 ? 'Buono!' : pct >= 40 ? 'Insufficiente' : 'Da ripassare';
  const sub = isExam
    ? (passed ? 'Esame superato! Servono almeno 21/30.' : 'Esame non superato. Riprova!')
    : (pct >= 60 ? 'Ottimo lavoro!' : 'Ripassa e riprova.');

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-5">
      <div className="w-full max-w-sm anim-scale">
        {/* Score */}
        <div className="text-center mb-7">
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${passed ? 'border-green-400/40 bg-green-500/8' : 'border-red-400/40 bg-red-500/8'}`}>
            <div>
              <p className={`text-3xl font-bold tabular-nums ${passed ? 'text-green-300' : 'text-red-300'}`}>{pct}%</p>
              <p className="text-[var(--t3)] text-[10px]">{isExam ? `${correctCount}/30` : 'Punteggio'}</p>
            </div>
          </div>
        </div>
        <h1 className={`text-xl font-bold text-center mb-1 ${passed ? 'text-green-300' : 'text-red-300'}`}>{title}</h1>
        <p className="text-[var(--t2)] text-sm text-center mb-7">{sub}</p>

        {/* Stats */}
        <div className="card p-5 mb-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-white tabular-nums">{total}</p>
              <p className="text-[10px] text-[var(--t3)]">Totali</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-300 tabular-nums">{correctCount}</p>
              <p className="text-[10px] text-green-400/60">Corrette</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-300 tabular-nums">{wrongCount}</p>
              <p className="text-[10px] text-red-400/60">Sbagliate</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.04]">
              <div className="bg-green-500 transition-all duration-700" style={{ width: `${pct}%` }} />
              <div className="bg-red-500/40 flex-1" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={() => { store.startQuiz(quizQuestions, quizMode); }} className="btn-amber w-full">Riprova</button>
          <button onClick={() => { store.goHome(); }} className="btn-indigo w-full">Torna alla Home</button>
          <button onClick={() => { store.setAutoAdvance(!autoAdvance); }} className="btn-ghost w-full text-xs border border-[var(--border)] rounded-xl">
            Avanzamento auto: <span className={autoAdvance ? 'text-green-300' : 'text-red-300'}>{autoAdvance ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
