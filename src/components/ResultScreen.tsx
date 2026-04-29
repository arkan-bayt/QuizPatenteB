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

  const titleColor = passed ? 'var(--success)' : 'var(--danger)';
  const ringColor = passed ? '#10B981' : '#EF4444';

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background effects */}
      {passed && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full anim-float" style={{ background: 'var(--success-100)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full anim-float" style={{ background: 'var(--success-100)', filter: 'blur(60px)', animationDelay: '1.5s' }} />
        </div>
      )}

      <div className="w-full max-w-sm relative z-10 anim-scale">
        {/* Score Ring */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
              <circle cx="50" cy="50" r="45" fill="none"
                stroke={ringColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="score-ring-circle"
                style={{ filter: `drop-shadow(0 0 10px ${ringColor}50)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[44px] font-extrabold tabular-nums leading-none" style={{ color: titleColor }}>{pct}%</p>
              <p className="text-[11px] font-medium mt-1.5" style={{ color: 'var(--text-muted)' }}>{isExam ? `${correctCount}/30` : 'Punteggio'}</p>
            </div>
          </div>

          {/* Celebration dots */}
          {passed && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full anim-bounce" style={{ background: 'var(--success)', animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-center mb-2" style={{ color: titleColor }}>{title}</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>{sub}</p>

        {/* Stats Card */}
        <div className="glass p-6 mb-5" style={{ boxShadow: 'var(--shadow-xl)' }}>
          <div className="grid grid-cols-3 gap-4 text-center mb-5">
            <div>
              <p className="text-2xl font-extrabold tabular-nums" style={{ color: 'var(--text-primary)' }}>{total}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>Totali</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums" style={{ color: 'var(--success)' }}>{correctCount}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--success)', opacity: 0.6 }}>Corrette</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums" style={{ color: 'var(--danger)' }}>{wrongCount}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--danger)', opacity: 0.6 }}>Sbagliate</p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="flex h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="transition-all duration-1000 ease-out rounded-l-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
            <div className="flex-1 rounded-r-full" style={{ background: 'var(--danger-100)' }} />
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
            <div className="w-2 h-2 rounded-full" style={{ background: autoAdvance ? 'var(--success)' : 'var(--danger)' }} />
            Avanzamento auto: <span className="font-bold" style={{ color: autoAdvance ? 'var(--success)' : 'var(--danger)' }}>{autoAdvance ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
