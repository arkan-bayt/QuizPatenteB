'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { clearProgress } from '@/logic/resumeEngine';

export default function ResultScreen() {
  const { correctCount, wrongCount, quizQuestions, selectedChapterIds, restart, logout } = useAppStore();
  const total = correctCount + wrongCount;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = pct >= 60;

  const handleRestart = () => { clearProgress(); restart(); };
  const handleNew = () => { clearProgress(); restart(); };
  const handleExit = () => { clearProgress(); logout(); if (typeof window !== 'undefined') localStorage.removeItem('quiz_admin_session'); };

  const msg = pct >= 90 ? { t: 'Eccellente!', s: 'Sei pronto per l\'esame!' } :
    pct >= 70 ? { t: 'Ottimo!', s: 'Ottimo lavoro, continua cosi!' } :
    pct >= 60 ? { t: 'Buono!', s: 'Buon risultato, ma puoi migliorare.' } :
    pct >= 40 ? { t: 'Insufficiente', s: 'Ripassa gli argomenti e riprova.' } :
    { t: 'Da ripassare', s: 'Non scoraggiarti, studia e riprova!' };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-5">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Score circle */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${passed ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-rose-400/50 bg-rose-500/10'}`}>
            <div>
              <p className={`text-4xl font-bold tabular-nums ${passed ? 'text-emerald-300' : 'text-rose-300'}`}>{pct}%</p>
              <p className="text-slate-500 text-xs mt-0.5">Punteggio</p>
            </div>
          </div>
        </div>

        <h1 className={`text-2xl font-bold text-center mb-1 ${passed ? 'text-emerald-300' : 'text-rose-300'}`}>{msg.t}</h1>
        <p className="text-slate-400 text-sm text-center mb-8">{msg.s}</p>

        {/* Stats */}
        <div className="glass-card p-5 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">{total}</p>
              <p className="text-slate-500 text-xs mt-0.5">Totali</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">{correctCount}</p>
              <p className="text-emerald-500/60 text-xs mt-0.5">Corrette</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-400 tabular-nums">{wrongCount}</p>
              <p className="text-rose-500/60 text-xs mt-0.5">Sbagliate</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <p className="text-slate-400 text-sm">Capitoli: <span className="text-white font-medium">{selectedChapterIds.length}</span> &middot; Domande: <span className="text-white font-medium">{quizQuestions.length}</span></p>
          </div>
        </div>

        {/* Visual bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.06]">
            <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
            <div className="bg-rose-500 flex-1" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-emerald-400 text-xs font-medium">{pct}% Corrette</span>
            <span className="text-rose-400 text-xs font-medium">{100 - pct}% Sbagliate</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button onClick={handleRestart} className="btn-accent w-full">Riprova stesso quiz</button>
          <button onClick={handleNew} className="btn-primary w-full">Nuova selezione argomenti</button>
          <button onClick={handleExit} className="btn-ghost w-full border border-white/[0.06] rounded-xl">Esci</button>
        </div>
      </div>
    </div>
  );
}
