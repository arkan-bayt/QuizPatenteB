'use client';

import React from 'react';
import { useQuizStore } from '@/lib/quiz-store';
import { safeStr, safeNum } from '@/lib/utils';

export default function Navbar() {
  const view = useQuizStore((s) => s.view);
  const setView = useQuizStore((s) => s.setView);
  const logout = useQuizStore((s) => s.logout);
  const chapterProgress = useQuizStore((s) => s.chapterProgress);

  const totalCorrect = Object.values(chapterProgress).reduce((s, p) => s + (typeof p.correctCount === 'number' ? p.correctCount : 0), 0);
  const totalWrong = Object.values(chapterProgress).reduce((s, p) => s + (typeof p.wrongCount === 'number' ? p.wrongCount : 0), 0);
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => setView('home')} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <span className="font-bold text-sm hidden sm:block">Quiz Patente B</span>
        </button>

        {/* Stats badge */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-600 dark:text-green-400 font-semibold">{safeNum(totalCorrect)} ✓</span>
          <span className="text-red-500 font-semibold">{safeNum(totalWrong)} ✗</span>
          <span className="text-muted-foreground font-medium">{safeNum(accuracy)}%</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('admin')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'admin' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          >
            ⚙️
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Esci
          </button>
        </div>
      </div>
    </nav>
  );
}
