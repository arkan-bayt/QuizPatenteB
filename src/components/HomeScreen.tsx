'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getUniqueTopics, getChaptersByTopic, getQuestionsByChapters, getRandomQuestions } from '@/data/quizData';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';
import { clearSession } from '@/logic/authEngine';
import { forceSyncToCloud } from '@/logic/progressEngine';
import QuestionCountModal from './QuestionCountModal';
import ChapterIcon from './ChapterIcons';

const CHAPTER_COLORS: Record<number, string> = {
  1: '#3B82F6', 2: '#EF4444', 3: '#DC2626', 4: '#2563EB', 5: '#F59E0B',
  6: '#8B5CF6', 7: '#10B981', 8: '#06B6D4', 9: '#F97316', 10: '#6366F1',
  11: '#EC4899', 12: '#14B8A6', 13: '#0EA5E9', 14: '#A855F7', 15: '#22C55E',
  16: '#3B82F6', 17: '#64748B', 18: '#FBBF24', 19: '#F43F5E', 20: '#78716C',
  21: '#7C3AED', 22: '#BE185D', 23: '#475569', 24: '#059669', 25: '#B45309',
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
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const username = user?.username || '';
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const globalPct = allQuestions.length > 0 ? Math.min(100, Math.round((totalAnswered / allQuestions.length) * 100)) : 0;

  const [showExamModal, setShowExamModal] = useState(false);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const hasDarkClass = document.documentElement.classList.contains('dark');
    if (stored === 'dark' || hasDarkClass) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const examChapterIds = selectedChapterIds.length > 0 ? selectedChapterIds : chapters.map((c) => c.id);
  const availableExamQs = useMemo(() => getQuestionsByChapters(allQuestions, examChapterIds), [allQuestions, examChapterIds]);
  const isAllChapters = selectedChapterIds.length === 0 || selectedChapterIds.length === chapters.length;
  const selectedCount = isAllChapters ? chapters.length : selectedChapterIds.length;

  const handleExamClick = () => {
    if (availableExamQs.length === 0) return;
    setShowExamModal(true);
  };

  const handleExamConfirm = (count: number | 'all') => {
    setShowExamModal(false);
    if (count === 'all') {
      const shuffled = [...availableExamQs].sort(() => Math.random() - 0.5);
      store.startQuiz(shuffled, 'exam');
    } else {
      const examQs = getRandomQuestions(availableExamQs, count);
      if (examQs.length === 0) return;
      store.startQuiz(examQs, 'exam');
    }
  };

  const handleWrongRetry = () => {
    if (wrong.questions.length === 0) return;
    store.setScreen('wrong');
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quiz Patente B</h1>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Ciao, <span className="text-[#4F46E5]">{username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(isAdmin || isTeacher) && (
              <button onClick={() => store.openTeacherDashboard()} className="text-xs px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                Dashboard
              </button>
            )}
            {isStudent && (
              <button onClick={() => store.openStudentDashboard()} className="text-xs px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                Dashboard
              </button>
            )}
            {isAdmin && (
              <button onClick={() => store.setScreen('admin')} className="text-xs px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            )}
            <button onClick={toggleDark} className="text-xs px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors font-medium flex items-center gap-1.5" title={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}>
              <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
            </button>
            <button onClick={handleLogout} className="text-xs px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors font-medium flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Esci
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Welcome */}
        <div className="anim-up">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Allenati per la Patente B</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Rispondi, impara e supera l&apos;esame al primo tentativo.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="📋" value={totalAnswered} label="Risposte" color="#4F46E5" border="border-l-indigo-400" />
          <StatCard icon="✅" value={totalCorrect} label="Corrette" color="#059669" border="border-l-emerald-400" />
          <StatCard icon="❌" value={totalAnswered - totalCorrect} label="Sbagliate" color="#DC2626" border="border-l-red-400" />
          <StatCard icon="🔥" value={stats.streak} label="Serie" color="#D97706" border="border-l-amber-400" />
        </div>

        {/* Overall Progress */}
        <div className="card p-5 anim-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Progresso globale</span>
            <div className="text-right">
              <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{globalPct}%</span>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{totalAnswered} / {allQuestions.length}</p>
            </div>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="h-full rounded-full bg-[#4F46E5] transition-all duration-700" style={{ width: `${globalPct}%` }} />
          </div>
          {accuracy > 0 && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Accuratezza: <span className="font-semibold text-emerald-600">{accuracy}%</span></span>
              </div>
              {stats.examsPassed > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">🏆</span>
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Esami superati: <span className="font-semibold text-amber-600">{stats.examsPassed}</span></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-2 gap-3 anim-up">
          <button onClick={() => store.setScreen('aiChat')} className="card p-4 text-left hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg mb-2">💬</div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Chiedi all&apos;IA</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Domande su segnali e regole</p>
          </button>

          <button onClick={() => store.setScreen('studyPlan')} className="card p-4 text-left hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg mb-2">📋</div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Piano di Studio</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Piano personalizzato IA</p>
          </button>
        </div>

        <button onClick={() => store.setScreen('aiAnalysis')} className="w-full bg-[#4F46E5] rounded-2xl p-5 text-left hover:bg-[#4338CA] transition-colors anim-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl mb-3">🤖</div>
              <p className="text-[15px] font-bold text-white">Analisi IA Completa</p>
              <p className="text-xs mt-1 text-indigo-200">Analizza il tuo livello e scopri dove migliorare</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
          </div>
        </button>

        {/* Exam Section */}
        <div className="card p-5 anim-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Esame</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{isAllChapters ? 'Tutti i capitoli' : `${selectedCount} capitoli selezionati`} · {availableExamQs.length} domande</p>
              </div>
            </div>
            <button onClick={() => setShowChapterSelect(!showChapterSelect)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={showChapterSelect ? 'M19.5 8.25l-7.5 7.5-7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'} />
              </svg>
              Capitoli
            </button>
          </div>

          {showChapterSelect && (
            <div className="anim-fade mb-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => store.deselectAllChapters()} className="text-[10px] font-semibold px-2 py-1 rounded-md border text-[var(--text-muted)] hover:text-[var(--text-primary)]" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>Nessuno</button>
                <button onClick={() => store.selectAllChapters()} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">Tutti</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chapters.map((ch) => {
                  const isSelected = selectedChapterIds.length === 0 || selectedChapterIds.includes(ch.id);
                  return (
                    <button key={ch.id} onClick={() => store.toggleChapterId(ch.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                      style={{
                        background: isSelected ? (CHAPTER_COLORS[ch.id] || '#6B7280') : 'var(--bg-secondary)',
                        color: isSelected ? 'white' : 'var(--text-muted)',
                      }}>
                      <ChapterIcon chapterId={ch.id} size={14} /> {ch.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={handleExamClick} className="w-full py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white transition-colors flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">📝</div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Inizia Test</p>
              <p className="text-xs text-amber-100">{availableExamQs.length} domande disponibili</p>
            </div>
            {stats.examsPassed > 0 && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/15">{stats.examsPassed} passati</span>
            )}
            <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Wrong Answers Retry */}
        <button onClick={handleWrongRetry} className={`w-full card p-5 text-left hover:shadow-md transition-all anim-up ${wrong.total === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">🔄</div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Ripeti Errori</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{wrong.total} da ripassare</p>
            </div>
            {wrong.total > 0 && (
              <div className="flex-1 max-w-[100px]">
                <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="h-full rounded-full bg-red-400" style={{ width: `${Math.min(100, wrong.total * 3)}%` }} />
                </div>
              </div>
            )}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* Chapters by Topic */}
        {topics.map((topic, ti) => {
          const tm = TOPIC_META[topic] || { icon: '📚', label: topic };
          const topicChapters = getChaptersByTopic(chapters, topic);
          const topicTotal = topicChapters.reduce((s, c) => s + c.questionCount, 0);
          const topicAnswered = topicChapters.reduce((s, c) => { const cs = chapterStats.find((x) => x.id === c.id); return s + (cs?.answered || 0); }, 0);
          const topicPct = topicTotal > 0 ? Math.round((topicAnswered / topicTotal) * 100) : 0;

          return (
            <div key={topic} className="anim-up" style={{ animationDelay: `${(ti * 60) + 150}ms` }}>
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="text-lg">{tm.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{topic}</h2>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{topicChapters.length} cap.</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="h-full rounded-full bg-[#4F46E5] transition-all duration-700" style={{ width: `${topicPct}%` }} />
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{topicAnswered}/{topicTotal}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {topicChapters.map((ch, ci) => {
                  const cs = chapterStats.find((x) => x.id === ch.id);
                  const answered = cs?.answered || 0;
                  const totalQ = ch.questionCount;
                  const pctVal = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;
                  const isComplete = pctVal === 100;
                  const color = CHAPTER_COLORS[ch.id] || '#6B7280';

                  return (
                    <button key={ch.id} onClick={() => store.openChapter(ch.id)}
                      className="card overflow-hidden hover:shadow-md transition-all text-left anim-up"
                      style={{ animationDelay: `${(ti * 60) + (ci * 30) + 180}ms` }}>
                      {/* Top colored section */}
                      <div className="px-3 pt-4 pb-3" style={{ background: `${color}08` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          {isComplete && (
                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <ChapterIcon chapterId={ch.id} size={32} />
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>{`Cap. ${ch.id}`}</span>
                        <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pctVal}%`, background: color }} />
                        </div>
                      </div>
                      {/* Bottom section */}
                      <div className="px-3 py-2.5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[11px] font-semibold leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{ch.name}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{answered}/{totalQ}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <QuestionCountModal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        onConfirm={handleExamConfirm}
        totalAvailable={availableExamQs.length}
        title="Scegli quante domande"
        subtitle={isAllChapters ? 'Esame completo - tutti i capitoli' : `Esame - ${selectedCount} capitoli selezionati`}
      />
    </div>
  );
}

function StatCard({ icon, value, label, color, border }: { icon: string; value: number; label: string; color: string; border: string }) {
  return (
    <div className={`card p-4 text-center transition-all hover:shadow-md ${border} border-l-[3px]`}>
      <span className="text-base mb-0.5 block">{icon}</span>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}
