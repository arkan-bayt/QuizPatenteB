'use client';
import React, { useMemo, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useWrongAnswers } from './hooks';
import { QuizQuestion } from '@/data/quizData';

export default function WrongQuestionsScreen() {
  const store = useStore();
  const wrong = useWrongAnswers();
  const [showExamModal, setShowExamModal] = useState(false);
  const [customCount, setCustomCount] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Group questions by chapter → subtopic
  const grouped = useMemo(() => {
    const result: {
      chapterId: number;
      chapterName: string;
      subtopics: {
        name: string;
        questions: QuizQuestion[];
      }[];
      total: number;
    }[] = [];

    for (const chId of Object.keys(wrong.byChapter).map(Number).sort((a, b) => a - b)) {
      const qs = wrong.byChapter[chId];
      if (qs.length === 0) continue;

      const subtopicMap: Record<string, QuizQuestion[]> = {};
      for (const q of qs) {
        const key = q.subtopic || 'Altro';
        if (!subtopicMap[key]) subtopicMap[key] = [];
        subtopicMap[key].push(q);
      }

      result.push({
        chapterId: chId,
        chapterName: qs[0].chapterName,
        subtopics: Object.keys(subtopicMap).sort().map((name) => ({
          name,
          questions: subtopicMap[name],
        })),
        total: qs.length,
      });
    }
    return result;
  }, [wrong.byChapter]);

  // Filter by search
  const filteredGrouped = useMemo(() => {
    if (!searchQuery.trim()) return grouped;
    const q = searchQuery.toLowerCase();
    return grouped.map((ch) => ({
      ...ch,
      subtopics: ch.subtopics
        .map((st) => ({
          ...st,
          questions: st.questions.filter(
            (q2) =>
              q2.question.toLowerCase().includes(q) ||
              st.name.toLowerCase().includes(q) ||
              ch.chapterName.toLowerCase().includes(q)
          ),
        }))
        .filter((st) => st.questions.length > 0),
    })).filter((ch) => ch.subtopics.length > 0);
  }, [grouped, searchQuery]);

  // Expand all by default on first load
  React.useEffect(() => {
    if (grouped.length > 0 && expandedChapters.size === 0) {
      setExpandedChapters(new Set(grouped.map((ch) => ch.chapterId)));
      const allSubs = new Set<string>();
      for (const ch of grouped) {
        for (const st of ch.subtopics) {
          allSubs.add(`${ch.chapterId}::${st.name}`);
        }
      }
      setExpandedSubtopics(allSubs);
    }
  }, [grouped.length]);

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSubtopic = (key: string) => {
    setExpandedSubtopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const startExam = useCallback(
    (count: number | 'all') => {
      if (wrong.questions.length === 0) return;
      let examQs = [...wrong.questions].sort(() => Math.random() - 0.5);
      if (count !== 'all') {
        examQs = examQs.slice(0, Math.min(count, examQs.length));
      }
      if (examQs.length === 0) return;
      store.startQuiz(examQs, 'wrong');
      setShowExamModal(false);
    },
    [wrong.questions, store]
  );

  const handleCustomExam = useCallback(() => {
    const n = parseInt(customCount, 10);
    if (isNaN(n) || n < 1) return;
    startExam(n);
  }, [customCount, startExam]);

  const filteredTotal = filteredGrouped.reduce((s, ch) => s + ch.total, 0);

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => store.goHome()}
            className="btn-ghost p-2"
            style={{ borderRadius: 12 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Domande Sbagliate
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {wrong.total} domande da ripassare
            </p>
          </div>
          {wrong.total > 0 && (
            <button
              onClick={() => setShowExamModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-white font-semibold text-[13px] transition-all duration-300 hover:scale-[1.05] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Esame
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-5 space-y-4">
        {/* Empty State */}
        {wrong.total === 0 && (
          <div className="glass p-10 text-center anim-up">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Nessun errore!
            </h2>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Non hai ancora sbagliato nessuna domanda. Continua cosi!
            </p>
            <button
              onClick={() => store.goHome()}
              className="mt-6 px-6 py-3 text-white font-semibold text-[13px] transition-all duration-300 hover:scale-[1.05]"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              Torna alla Home
            </button>
          </div>
        )}

        {wrong.total > 0 && (
          <>
            {/* Start Exam Banner */}
            <button
              onClick={() => setShowExamModal(true)}
              className="relative overflow-hidden p-5 text-left w-full anim-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 6px 30px rgba(239, 68, 68, 0.4)',
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background:
                    'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)',
                }}
              />
              <div className="relative z-10 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  📝
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-extrabold text-white">
                    Inizia Esame con Errori
                  </p>
                  <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    30 domande / Tutte / Numero personalizzato
                  </p>
                </div>
                <svg
                  className="w-6 h-6 text-white opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                  />
                </svg>
              </div>
            </button>

            {/* Search */}
            <div className="glass anim-up" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cerca domanda o argomento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[11px] font-medium px-2 py-1"
                    style={{ color: 'var(--primary-light)', background: 'var(--primary-100)', borderRadius: 8 }}>
                    Cancella
                  </button>
                )}
              </div>
            </div>

            {/* Summary bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {filteredGrouped.length} capitoli · {filteredTotal} domande
                {searchQuery && ` (filtrati)`}
              </span>
              <button
                onClick={() => {
                  const allCh = new Set(filteredGrouped.map((c) => c.chapterId));
                  const allSt = new Set<string>();
                  for (const ch of filteredGrouped) {
                    for (const st of ch.subtopics) {
                      allSt.add(`${ch.chapterId}::${st.name}`);
                    }
                  }
                  setExpandedChapters(allCh);
                  setExpandedSubtopics(allSt);
                }}
                className="text-[11px] font-medium px-2 py-1"
                style={{ color: 'var(--primary-light)', background: 'var(--primary-100)', borderRadius: 8 }}
              >
                Espandi tutti
              </button>
            </div>

            {/* Chapters & Questions */}
            {filteredGrouped.map((ch, chIdx) => {
              const isExpanded = expandedChapters.has(ch.chapterId);
              const style = getChapterStyle(ch.chapterId);

              return (
                <div key={ch.chapterId} className="anim-up" style={{ animationDelay: `${chIdx * 50}ms` }}>
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(ch.chapterId)}
                    className="w-full glass p-4 flex items-center gap-3 text-left transition-all duration-200"
                    style={{ borderRadius: 'var(--radius-xl)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: style.gradient }}
                    >
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          Cap. {ch.chapterId}
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold leading-tight mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                        {ch.chapterName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1"
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: 'var(--danger)',
                          borderRadius: 10,
                        }}
                      >
                        {ch.total}
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--text-muted)' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </button>

                  {/* Subtopics */}
                  {isExpanded && (
                    <div className="mt-2 ml-4 space-y-2">
                      {ch.subtopics.map((st) => {
                        const stKey = `${ch.chapterId}::${st.name}`;
                        const isStExpanded = expandedSubtopics.has(stKey);

                        return (
                          <div key={stKey}>
                            {/* Subtopic Header */}
                            <button
                              onClick={() => toggleSubtopic(stKey)}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all duration-200"
                              style={{
                                borderRadius: 'var(--radius-lg)',
                                background: isStExpanded ? 'var(--primary-100)' : 'var(--bg-card)',
                              }}
                            >
                              <div
                                className="w-1 h-5 rounded-full flex-shrink-0"
                                style={{ background: 'var(--primary-light)' }}
                              />
                              <span className="flex-1 text-[12px] font-semibold uppercase tracking-wide truncate" style={{ color: 'var(--text-primary)' }}>
                                {st.name}
                              </span>
                              <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                {st.questions.length}
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform duration-300 ${isStExpanded ? 'rotate-180' : ''}`}
                                style={{ color: 'var(--text-muted)' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>

                            {/* Questions */}
                            {isStExpanded && (
                              <div className="mt-1 space-y-2">
                                {st.questions.map((q, qIdx) => (
                                  <QuestionCard key={q.id} question={q} index={qIdx + 1} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Exam Modal */}
      {showExamModal && (
        <ExamModal
          totalQuestions={wrong.questions.length}
          onClose={() => setShowExamModal(false)}
          onStart={startExam}
          customCount={customCount}
          onCustomCountChange={setCustomCount}
          onCustomSubmit={handleCustomExam}
        />
      )}
    </div>
  );
}

// ============================================================
// QUESTION CARD
// ============================================================
function QuestionCard({ question, index }: { question: QuizQuestion; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="glass flex gap-3 p-3 transition-all duration-200"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      {/* Question Image */}
      {question.image && !imgError && (
        <div className="flex-shrink-0">
          <img
            src={question.image}
            alt=""
            className="w-14 h-14 object-contain rounded-lg"
            style={{ background: 'var(--bg-tertiary)' }}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          <span className="font-bold" style={{ color: 'var(--text-muted)' }}>Q{index}.</span>{' '}
          {question.question}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {question.answer ? (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1"
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                color: 'var(--success)',
                borderRadius: 8,
              }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              VERO
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger)',
                borderRadius: 8,
              }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              FALSO
            </span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Cap. {question.chapter} · {question.subtopic}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXAM MODAL
// ============================================================
function ExamModal({
  totalQuestions,
  onClose,
  onStart,
  customCount,
  onCustomCountChange,
  onCustomSubmit,
}: {
  totalQuestions: number;
  onClose: () => void;
  onStart: (count: number | 'all') => void;
  customCount: string;
  onCustomCountChange: (v: string) => void;
  onCustomSubmit: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md glass p-6 anim-up"
        style={{ borderRadius: 'var(--radius-2xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Esame Errori
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {totalQuestions} domande sbagliate disponibili
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2"
            style={{ borderRadius: 10 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-1 mb-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
          <button
            onClick={() => setActiveTab('preset')}
            className="flex-1 py-2 text-[12px] font-semibold transition-all duration-200"
            style={{
              borderRadius: 'var(--radius-md)',
              background: activeTab === 'preset' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'preset' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'preset' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Scelta rapida
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className="flex-1 py-2 text-[12px] font-semibold transition-all duration-200"
            style={{
              borderRadius: 'var(--radius-md)',
              background: activeTab === 'custom' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'custom' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'custom' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Numero personalizzato
          </button>
        </div>

        {activeTab === 'preset' ? (
          /* Preset Options */
          <div className="space-y-3">
            {/* 30 Questions */}
            <button
              onClick={() => onStart(30)}
              disabled={totalQuestions === 0}
              className="w-full flex items-center gap-4 p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-subtle)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                }}
              >
                📝
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  30 Domande
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Simulazione esame ufficiale
                  {totalQuestions < 30 && ` (${totalQuestions} disponibili)`}
                </p>
              </div>
              <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* All Questions */}
            <button
              onClick={() => onStart('all')}
              className="w-full flex items-center gap-4 p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-subtle)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                }}
              >
                🔄
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Tutte le domande
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {totalQuestions} domande sbagliate
                </p>
              </div>
              <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        ) : (
          /* Custom Number */
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 p-4"
              style={{
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-subtle)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                }}
              >
                🔢
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Quante domande?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCustomCountChange(String(Math.max(1, (parseInt(customCount) || 1) - 5)))}
                    className="w-9 h-9 flex items-center justify-center text-lg font-bold transition-all hover:scale-110"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderRadius: 10,
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={customCount}
                    onChange={(e) => onCustomCountChange(e.target.value)}
                    placeholder="10"
                    min={1}
                    max={totalQuestions}
                    className="flex-1 text-center text-[18px] font-bold py-2 outline-none"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderRadius: 10,
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onCustomSubmit();
                    }}
                  />
                  <button
                    onClick={() => onCustomCountChange(String(Math.min(totalQuestions, (parseInt(customCount) || 0) + 5)))}
                    className="w-9 h-9 flex items-center justify-center text-lg font-bold transition-all hover:scale-110"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderRadius: 10,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onCustomSubmit}
              disabled={!customCount || parseInt(customCount) < 1 || parseInt(customCount) > totalQuestions}
              className="w-full py-3.5 text-white font-bold text-[14px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              }}
            >
              Inizia con {customCount || '?'} domande
            </button>

            <p className="text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Massimo {totalQuestions} domande disponibili
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================
function getChapterStyle(chapterId: number) {
  const styles: Record<number, { icon: string; gradient: string }> = {
    1:  { icon: '📖', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
    2:  { icon: '⚠️', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' },
    3:  { icon: '🚫', gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' },
    4:  { icon: '🔵', gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)' },
    5:  { icon: '🔺', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    6:  { icon: '📏', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' },
    7:  { icon: '🚦', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    8:  { icon: '🪧', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' },
    9:  { icon: '🚧', gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' },
    10: { icon: '📋', gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' },
    11: { icon: '🏎️', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' },
    12: { icon: '📏', gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' },
    13: { icon: '🛣️', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' },
    14: { icon: '🔀', gradient: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)' },
    15: { icon: '↗️', gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' },
    16: { icon: '🅿️', gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' },
    17: { icon: '🛤️', gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)' },
    18: { icon: '💡', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' },
    19: { icon: '🦺', gradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' },
    20: { icon: '📄', gradient: 'linear-gradient(135deg, #78716C 0%, #57534E 100%)' },
    21: { icon: '📚', gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' },
    22: { icon: '⚗️', gradient: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)' },
    23: { icon: '⚖️', gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)' },
    24: { icon: '🌱', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
    25: { icon: '🔧', gradient: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)' },
  };
  return styles[chapterId] || { icon: '📘', gradient: 'linear-gradient(135deg, #94A3B8, #64748B)' };
}
