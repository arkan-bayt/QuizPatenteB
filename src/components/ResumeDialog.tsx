'use client';
import React from 'react';

interface ResumeDialogProps {
  visible: boolean;
  resumeIdx: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  modeLabel: string;
  onResume: () => void;
  onRestart: () => void;
  onDismiss: () => void;
}

export default function ResumeDialog({
  visible,
  resumeIdx,
  totalQuestions,
  correctCount,
  wrongCount,
  modeLabel,
  onResume,
  onRestart,
  onDismiss,
}: ResumeDialogProps) {
  if (!visible) return null;

  const answeredCount = correctCount + wrongCount;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm glass p-6 anim-up" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 8px 25px rgba(30, 58, 138, 0.3)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
        </div>

        {/* Title - Bilingual */}
        <h2 className="text-center text-[17px] font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
          تقدّم محفوظ!
        </h2>
        <p className="text-center text-[11px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          لديك {modeLabel} قيد التقدم. هل تريد المتابعة من حيث توقفت؟
        </p>
        <p className="text-center text-[10px] font-medium mb-4" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
          Hai un {modeLabel} in corso. Vuoi continuare?
        </p>

        {/* Progress Stats */}
        <div className="glass p-4 mb-5" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>التقدم / Progresso</span>
            <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--primary-light)' }}>{answeredCount}/{totalQuestions} ({progressPct}%)</span>
          </div>
          <div className="progress-bar mb-3">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-xl" style={{ background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
              <p className="text-base font-bold tabular-nums" style={{ color: 'var(--success)' }}>{correctCount}</p>
              <p className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>صحيح</p>
              <p className="text-[8px]" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Corrette</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
              <p className="text-base font-bold tabular-nums" style={{ color: 'var(--danger)' }}>{wrongCount}</p>
              <p className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>خطأ</p>
              <p className="text-[8px]" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Sbagliate</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
              <p className="text-base font-bold tabular-nums" style={{ color: 'var(--primary-light)' }}>{accuracy}%</p>
              <p className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>دقة</p>
              <p className="text-[8px]" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Precisione</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              السؤال التالي: <span className="font-bold" style={{ color: 'var(--accent)' }}>#{resumeIdx + 1}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Resume Button */}
          <button onClick={onResume}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.3)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            أكمل من السؤال #{resumeIdx + 1}
          </button>

          {/* Restart Button */}
          <button onClick={onRestart}
            className="w-full py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            ابدأ من البداية
          </button>

          {/* Dismiss */}
          <button onClick={onDismiss}
            className="w-full py-2.5 rounded-2xl text-[12px] font-medium flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02]"
            style={{ color: 'var(--text-muted)' }}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
