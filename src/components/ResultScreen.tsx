'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';

export default function ResultScreen() {
  const store = useStore();
  const { correctCount, wrongCount, quizQuestions, quizMode, autoAdvance, examPassed, user } = store;
  const total = correctCount + wrongCount;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isExam = quizMode === 'exam';
  const passed = isExam ? correctCount >= 21 : pct >= 60;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (pct / 100) * circumference;

  const title = pct >= 90 ? 'Eccellente!' : pct >= 70 ? 'Ottimo!' : pct >= 60 ? 'Buono!' : pct >= 40 ? 'Insufficiente' : 'Da ripassare';
  const sub = isExam
    ? (passed ? 'Esame superato! Servono almeno 21/30.' : 'Esame non superato. Riprova!')
    : (pct >= 60 ? 'Ottimo lavoro!' : 'Ripassa e riprova.');

  const titleColor = passed ? 'text-green-300' : 'text-red-300';
  const ringColor = passed ? '#22c55e' : '#ef4444';

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background effects */}
      {passed && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-500/5 blur-3xl anim-float" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-green-500/5 blur-3xl anim-float" style={{ animationDelay: '1.5s' }} />
          </div>
        </>
      )}

      <div className="w-full max-w-sm relative z-10 anim-scale">
        {/* Score Ring */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
              <circle cx="50" cy="50" r="45" fill="none"
                stroke={ringColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="score-ring-circle"
                style={{ filter: `drop-shadow(0 0 8px ${ringColor}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-4xl font-extrabold tabular-nums ${titleColor}`}>{pct}%</p>
              <p className="text-[var(--text-muted)] text-[11px] font-medium mt-1">{isExam ? `${correctCount}/30` : 'Punteggio'}</p>
            </div>
          </div>

          {/* Confetti-like dots for passed */}
          {passed && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-green-400 anim-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-extrabold text-center mb-2 ${titleColor}`}>{title}</h1>
        <p className="text-[var(--text-secondary)] text-sm text-center mb-8">{sub}</p>

        {/* Stats Card */}
        <div className="glass p-6 mb-5" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}>
          <div className="grid grid-cols-3 gap-4 text-center mb-5">
            <div>
              <p className="text-2xl font-extrabold text-white tabular-nums">{total}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mt-1">Totali</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-green-300 tabular-nums">{correctCount}</p>
              <p className="text-[10px] text-green-400/60 font-semibold uppercase tracking-wider mt-1">Corrette</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-red-300 tabular-nums">{wrongCount}</p>
              <p className="text-[10px] text-red-400/60 font-semibold uppercase tracking-wider mt-1">Sbagliate</p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="flex h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out rounded-l-full" style={{ width: `${pct}%` }} />
            <div className="bg-red-500/30 flex-1 rounded-r-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={() => { store.startQuiz(quizQuestions, quizMode); }} className="btn-warning w-full flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356l-3.182 3.182" /></svg>
            Riprova
          </button>
          <button onClick={() => { store.goHome(); }} className="btn-primary w-full flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            Torna alla Home
          </button>
          <button onClick={() => { store.setAutoAdvance(!autoAdvance); }}
            className="btn-ghost w-full text-xs flex items-center justify-center gap-2 py-3">
            <div className={`w-2 h-2 rounded-full ${autoAdvance ? 'bg-green-400' : 'bg-red-400'}`} />
            Avanzamento auto: <span className={`font-bold ${autoAdvance ? 'text-green-300' : 'text-red-300'}`}>{autoAdvance ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
