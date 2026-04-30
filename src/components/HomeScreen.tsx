'use client';
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getUniqueTopics, getChaptersByTopic, getQuestionsByChapters, getRandomQuestions } from '@/data/quizData';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';
import { clearSession } from '@/logic/authEngine';
import { forceSyncToCloud } from '@/logic/progressEngine';

// Unique design for each of the 25 chapters
const CHAPTER_STYLES: Record<number, { icon: string; gradient: string; shadow: string }> = {
  1:  { icon: '📖', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', shadow: '0 4px 15px rgba(59,130,246,0.35)' },
  2:  { icon: '⚠️', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', shadow: '0 4px 15px rgba(239,68,68,0.35)' },
  3:  { icon: '🚫', gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', shadow: '0 4px 15px rgba(220,38,38,0.35)' },
  4:  { icon: '🔵', gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', shadow: '0 4px 15px rgba(37,99,235,0.35)' },
  5:  { icon: '🔺', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', shadow: '0 4px 15px rgba(245,158,11,0.35)' },
  6:  { icon: '📏', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', shadow: '0 4px 15px rgba(139,92,246,0.35)' },
  7:  { icon: '🚦', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', shadow: '0 4px 15px rgba(16,185,129,0.35)' },
  8:  { icon: '🪧', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', shadow: '0 4px 15px rgba(6,182,212,0.35)' },
  9:  { icon: '🚧', gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', shadow: '0 4px 15px rgba(249,115,22,0.35)' },
  10: { icon: '📋', gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', shadow: '0 4px 15px rgba(99,102,241,0.35)' },
  11: { icon: '🏎️', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', shadow: '0 4px 15px rgba(236,72,153,0.35)' },
  12: { icon: '📏', gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', shadow: '0 4px 15px rgba(20,184,166,0.35)' },
  13: { icon: '🛣️', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', shadow: '0 4px 15px rgba(14,165,233,0.35)' },
  14: { icon: '🔀', gradient: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)', shadow: '0 4px 15px rgba(168,85,247,0.35)' },
  15: { icon: '↗️', gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', shadow: '0 4px 15px rgba(34,197,94,0.35)' },
  16: { icon: '🅿️', gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', shadow: '0 4px 15px rgba(59,130,246,0.35)' },
  17: { icon: '🛤️', gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)', shadow: '0 4px 15px rgba(100,116,139,0.35)' },
  18: { icon: '💡', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', shadow: '0 4px 15px rgba(251,191,36,0.35)' },
  19: { icon: '🦺', gradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', shadow: '0 4px 15px rgba(244,63,94,0.35)' },
  20: { icon: '📄', gradient: 'linear-gradient(135deg, #78716C 0%, #57534E 100%)', shadow: '0 4px 15px rgba(120,113,108,0.35)' },
  21: { icon: '📚', gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', shadow: '0 4px 15px rgba(124,58,237,0.35)' },
  22: { icon: '⚗️', gradient: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)', shadow: '0 4px 15px rgba(190,24,93,0.35)' },
  23: { icon: '⚖️', gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)', shadow: '0 4px 15px rgba(71,85,105,0.35)' },
  24: { icon: '🌱', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', shadow: '0 4px 15px rgba(5,150,105,0.35)' },
  25: { icon: '🔧', gradient: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)', shadow: '0 4px 15px rgba(180,83,9,0.35)' },
};

const TOPIC_META: Record<string, { icon: string; label: string }> = {
  'Conoscenze generali': { icon: '📖', label: 'Conoscenze generali' },
  'Segnali stradali': { icon: '🚦', label: 'Segnali stradali' },
  'Norme di circolazione': { icon: '🛣️', label: 'Norme di circolazione' },
  'Equipaggiamento e sicurezza': { icon: '🦺', label: 'Equipaggiamento e sicurezza' },
  'Documenti e norme': { icon: '📄', label: 'Documenti e norme' },
};

export default function HomeScreen() {
  const store = useStore();
  const { user, chapters, allQuestions, selectedChapterIds } = store;
  const { totalAnswered, totalCorrect, chapterStats } = useOverallStats();
  const stats = useUserStats();
  const wrong = useWrongAnswers();
  const topics = useMemo(() => getUniqueTopics(chapters), [chapters]);
  const isAdmin = user?.role === 'admin';
  const username = user?.username || '';
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const globalPct = allQuestions.length > 0 ? Math.min(100, Math.round((totalAnswered / allQuestions.length) * 100)) : 0;

  const handleExamMode = () => {
    const ids = selectedChapterIds.length > 0 ? selectedChapterIds : chapters.map((c) => c.id);
    const qs = getQuestionsByChapters(allQuestions, ids);
    const examQs = getRandomQuestions(qs, 30);
    if (examQs.length < 30) return;
    store.startQuiz(examQs, 'exam');
  };

  const handleWrongRetry = () => {
    if (wrong.questions.length === 0) return;
    store.startQuiz(wrong.questions, 'wrong');
  };

  const handleLogout = () => {
    if (username) forceSyncToCloud(username);
    clearSession();
    store.setUser(null);
    store.setScreen('login');
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Quiz Patente B</h1>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Ciao, <span style={{ color: 'var(--primary-light)' }}>{username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => store.setScreen('admin')} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5" style={{ borderRadius: 12 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            )}
            <button onClick={handleLogout} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5" style={{ borderRadius: 12 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Esci
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        {/* Hero Section */}
        <div className="anim-up">
          <h1 className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Allenati per la Patente B</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Rispondi, impara e supera l&apos;esame al primo tentativo.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="📋" value={totalAnswered} label="Risposte" glow="stat-glow-blue" color="var(--primary-light)" />
          <StatCard icon="✅" value={totalCorrect} label="Corrette" glow="stat-glow-green" color="var(--success)" />
          <StatCard icon="❌" value={totalAnswered - totalCorrect} label="Sbagliate" glow="stat-glow-red" color="var(--danger)" />
          <StatCard icon="🔥" value={stats.streak} label="Serie" glow="stat-glow-amber" color="var(--accent)" />
        </div>

        {/* Overall Progress */}
        <div className="glass p-5 anim-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="icon-box icon-box-primary w-8 h-8">
                <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Progresso globale</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{globalPct}%</span>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{totalAnswered} / {allQuestions.length}</p>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${globalPct}%` }} />
          </div>
          {accuracy > 0 && (
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Accuratezza: <span className="font-semibold" style={{ color: 'var(--success)' }}>{accuracy}%</span></span>
              </div>
              {stats.examsPassed > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">🏆</span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Esami superati: <span className="font-semibold" style={{ color: 'var(--accent)' }}>{stats.examsPassed}</span></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanations - PROMINENT POSITION */}
        <button onClick={() => store.setScreen('explanations')} className="relative overflow-hidden p-5 text-left anim-up transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{ animationDelay: '110ms', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 6px 30px rgba(14, 165, 233, 0.4)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
              📚
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-extrabold text-white">Spiegazioni / الشروحات</p>
              <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Guida completa + Atlante dei Segnali / دليل شامل + أطلس الإشارات</p>
            </div>
            <svg className="w-6 h-6 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* AI Features Grid */}
        <div className="grid grid-cols-2 gap-3 anim-up" style={{ animationDelay: '120ms' }}>
          <button onClick={() => store.setScreen('aiChat')} className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                💬
              </div>
              <p className="text-[13px] font-bold text-white">Chiedi all&apos;IA</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Domande su segnali e regole</p>
            </div>
          </button>

          <button onClick={() => store.setScreen('studyPlan')} className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                📋
              </div>
              <p className="text-[13px] font-bold text-white">Piano di Studio</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Piano personalizzato IA</p>
            </div>
          </button>
        </div>

        <button onClick={() => store.setScreen('aiAnalysis')} className="relative overflow-hidden p-5 text-left anim-up transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{ animationDelay: '140ms', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  🤖
                </div>
                <p className="text-[15px] font-bold text-white">Analisi IA Completa</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Analizza il tuo livello e scopri dove migliorare</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleExamMode} className="relative overflow-hidden p-5 text-left anim-up transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ animationDelay: '150ms', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
                📝
              </div>
              <p className="text-[15px] font-bold text-white">Inizia Test</p>
              <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>30 domande casuali</p>
              {stats.examsPassed > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <div className="h-full rounded-full" style={{ width: '100%', background: 'rgba(255,255,255,0.6)' }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{stats.examsPassed} passati</span>
                </div>
              )}
            </div>
          </button>

          <button onClick={handleWrongRetry} className={`relative overflow-hidden p-5 text-left anim-up transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${wrong.total === 0 ? 'opacity-40 pointer-events-none' : ''}`}
            style={{ animationDelay: '200ms', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', borderRadius: 'var(--radius-xl)', boxShadow: wrong.total > 0 ? '0 4px 20px rgba(239, 68, 68, 0.25)' : 'none' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
                🔄
              </div>
              <p className="text-[15px] font-bold text-white">Ripeti Errori</p>
              <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{wrong.total} da ripassare</p>
              {wrong.total > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, wrong.total * 3)}%`, background: 'rgba(255,255,255,0.6)' }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{wrong.total} Q</span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Chapters by Topic - Card Grid */}
        {topics.map((topic, ti) => {
          const tm = TOPIC_META[topic] || { icon: '📚', label: topic };
          const topicChapters = getChaptersByTopic(chapters, topic);
          const topicTotal = topicChapters.reduce((s, c) => s + c.questionCount, 0);
          const topicAnswered = topicChapters.reduce((s, c) => { const cs = chapterStats.find((x) => x.id === c.id); return s + (cs?.answered || 0); }, 0);
          const topicPct = topicTotal > 0 ? Math.round((topicAnswered / topicTotal) * 100) : 0;

          return (
            <div key={topic} className="anim-up" style={{ animationDelay: `${(ti * 80) + 200}ms` }}>
              {/* Topic Header */}
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="text-lg">{tm.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>{topic}</h2>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{topicChapters.length} cap.</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-1 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topicPct}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }} />
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{topicAnswered}/{topicTotal}</span>
                  </div>
                </div>
              </div>

              {/* Chapter Cards Grid */}
              <div className="grid grid-cols-3 gap-3">
                {topicChapters.map((ch, ci) => {
                  const cs = chapterStats.find((x) => x.id === ch.id);
                  const answered = cs?.answered || 0;
                  const totalQ = ch.questionCount;
                  const pctVal = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;
                  const isComplete = pctVal === 100;
                  const style = CHAPTER_STYLES[ch.id] || { icon: '📘', gradient: 'linear-gradient(135deg, #94A3B8, #64748B)', shadow: '0 4px 15px rgba(100,116,139,0.35)' };

                  return (
                    <button key={ch.id} onClick={() => store.openChapter(ch.id)}
                      className="relative overflow-hidden transition-all duration-300 hover:scale-[1.05] active:scale-[0.97] anim-up text-center"
                      style={{
                        animationDelay: `${(ti * 80) + (ci * 40) + 250}ms`,
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: style.shadow,
                      }}>
                      {/* Card Background */}
                      <div className="pt-5 pb-4 px-3" style={{ background: style.gradient }}>
                        {/* Decorative Circle */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />

                        {/* Completion Badge */}
                        {isComplete && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.9)' }}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          </div>
                        )}

                        {/* Icon */}
                        <div className="text-3xl mb-2">{style.icon}</div>

                        {/* Chapter Number */}
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Cap. {ch.id}</span>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full mt-2 mb-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pctVal}%`, background: 'rgba(255,255,255,0.8)' }} />
                        </div>
                        <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{answered}/{totalQ}</span>
                      </div>

                      {/* Chapter Name - always visible below */}
                      <div className="px-3 py-3" style={{ background: isComplete ? 'var(--success-100)' : 'var(--bg-card)', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}>
                        <p className="text-[11px] font-semibold leading-tight line-clamp-2" style={{ color: isComplete ? 'var(--success)' : 'var(--text-primary)' }}>{ch.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, glow, color }: { icon: string; value: number; label: string; glow: string; color: string }) {
  return (
    <div className={`glass ${glow} p-4 text-center transition-all duration-300 hover:scale-[1.03]`}>
      <span className="text-lg mb-1 block">{icon}</span>
      <p className="text-xl font-extrabold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}
