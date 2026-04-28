'use client';

import { SavedQuizSession } from '@/lib/types';
import { formatTimeAgo } from '@/lib/session-manager';

function safeStr(val: unknown, fallback: string = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return fallback;
}

/**
 * ResumeSessionDialog
 * Shows when a saved session exists for the quiz the user is about to start.
 * Offers "Continue from where you left off" or "Start over" options.
 */

// Icon components (inline SVGs)
function IconPlayCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconRotateCcw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface ResumeSessionDialogProps {
  session: SavedQuizSession;
  onResume: () => void;
  onStartOver: () => void;
  onDismiss: () => void;
}

export default function ResumeSessionDialog({
  session,
  onResume,
  onStartOver,
  onDismiss,
}: ResumeSessionDialogProps) {
  const answeredCount = session.userAnswers.length;
  const totalQuestions = session.questions.length;
  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const correctCount = session.userAnswers.filter(a => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-background w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 text-white">
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <IconPlayCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sessione salvata trovata</h3>
              <p className="text-emerald-100 text-sm">{safeStr(session.quizTitle)}</p>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="px-6 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-card border">
              <div className="text-lg font-bold text-foreground">{answeredCount}/{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Risposte</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{correctCount}</div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70">Corrette</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{wrongCount}</div>
              <div className="text-xs text-red-600/70 dark:text-red-400/70">Sbagliate</div>
            </div>
          </div>

          {/* Time info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <IconClock className="w-3.5 h-3.5" />
            <span>Salvata {formatTimeAgo(session.savedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Domanda {session.currentIndex + 1} di {totalQuestions}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20"
          >
            <IconPlayCircle className="w-5 h-5" />
            Continua da dove hai lasciato
          </button>
          <button
            onClick={onStartOver}
            className="w-full py-3 rounded-xl font-medium bg-muted hover:bg-accent text-foreground transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <IconRotateCcw className="w-4 h-4" />
            Inizia da capo
          </button>
        </div>
      </div>
    </div>
  );
}
