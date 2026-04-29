'use client';
import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getSubtopicsForChapter, getQuestionsBySubtopic, getQuestionsByChapters } from '@/data/quizData';
import { useChapterProgress } from './hooks';

export default function ChapterScreen() {
  const store = useStore();
  const { activeChapterId, allQuestions, chapters, user } = store;
  const chapter = chapters.find((c) => c.id === activeChapterId);
  const subtopics = useMemo(() => activeChapterId ? getSubtopicsForChapter(allQuestions, activeChapterId) : [], [allQuestions, activeChapterId]);
  const chapterProgress = useChapterProgress(activeChapterId || 0);
  const allChapterQs = activeChapterId ? getQuestionsByChapters(allQuestions, [activeChapterId]) : [];

  // Selection mode state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSt, setSelectedSt] = useState<Set<string>>(new Set());

  if (!chapter) return null;

  const answeredCount = chapterProgress.answeredIds.length;
  const correctCount = chapterProgress.correctIds.length;
  const wrongCount = chapterProgress.wrongIds.length;
  const totalQ = chapter.questionCount;
  const pct = totalQ > 0 ? Math.round((answeredCount / totalQ) * 100) : 0;
  const isComplete = pct === 100;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleStartAll = () => {
    const unanswered = allChapterQs.filter((q) => !chapterProgress.answeredIds.includes(q.id));
    const qs = unanswered.length > 0 ? unanswered : allChapterQs;
    store.startQuiz(qs, 'chapter');
  };

  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectMode(false);
      setSelectedSt(new Set());
    } else {
      setSelectMode(true);
      setSelectedSt(new Set());
    }
  };

  const toggleSubtopic = (st: string) => {
    const next = new Set(selectedSt);
    if (next.has(st)) next.delete(st); else next.add(st);
    setSelectedSt(next);
  };

  const selectAllSubtopics = () => {
    if (selectedSt.size === subtopics.length) {
      setSelectedSt(new Set());
    } else {
      setSelectedSt(new Set(subtopics));
    }
  };

  const startSelectedQuiz = () => {
    if (selectedSt.size === 0) return;
    let allQs: any[] = [];
    for (const st of selectedSt) {
      const qs = getQuestionsBySubtopic(allQuestions, chapter.id, st);
      allQs = allQs.concat(qs);
    }
    // Shuffle
    allQs = [...allQs].sort(() => Math.random() - 0.5);
    if (allQs.length > 0) {
      setSelectMode(false);
      setSelectedSt(new Set());
      store.startQuiz(allQs, 'subtopic');
    }
  };

  // Count total questions in selected subtopics
  const selectedQCount = (() => {
    let c = 0;
    for (const st of selectedSt) {
      c += getQuestionsBySubtopic(allQuestions, chapter.id, st).length;
    }
    return c;
  })();

  return (
    <div className="min-h-screen bg-mesh pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => { setSelectMode(false); setSelectedSt(new Set()); store.goHome(); }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>Cap. {chapter.id}: {chapter.name}</h1>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{answeredCount}/{totalQ} completate</p>
          </div>
          {/* Select Mode Toggle */}
          <button onClick={toggleSelectMode}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 ${selectMode ? 'text-white' : ''}`}
            style={selectMode
              ? { background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: 'white', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }
              : { background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {selectMode
              ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> Chiudi</>
              : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg> Seleziona</>
            }
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Progress Card */}
        <div className="glass p-6 anim-up" style={{ boxShadow: isComplete ? 'var(--glow-success)' : 'var(--shadow-lg)' }}>
          <div className="flex items-center gap-6 mb-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={isComplete ? 'var(--success)' : 'url(#chGradient)'} strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: isComplete ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))' : 'none' }}
                />
                <defs>
                  <linearGradient id="chGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold tabular-nums" style={{ color: isComplete ? 'var(--success)' : 'var(--text-primary)' }}>{pct}%</span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{answeredCount}/{totalQ}</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--success)' }}>{correctCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Corrette</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--danger)' }}>{wrongCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Sbagliate</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--primary-light)' }}>{accuracy}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Precisione</p>
              </div>
            </div>
          </div>

          <div className="progress-bar mb-5">
            <div className={isComplete ? 'progress-fill-green' : 'progress-fill'} style={{ width: `${pct}%` }} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleStartAll} className={`flex-1 ${isComplete ? 'btn-success' : 'btn-primary'}`}>
              {answeredCount === 0 ? 'Inizia Capitolo' : answeredCount >= totalQ ? 'Ripeti Capitolo' : `Continua (${totalQ - answeredCount} rimaste)`}
            </button>
          </div>
        </div>

        {/* Subtopics Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="icon-box icon-box-purple w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--purple)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>Sottotemi ({subtopics.length})</h2>
          </div>
          {selectMode && (
            <button onClick={selectAllSubtopics}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ background: selectedSt.size === subtopics.length ? 'var(--primary-100)' : 'var(--bg-tertiary)', color: selectedSt.size === subtopics.length ? 'var(--primary-light)' : 'var(--text-muted)', border: `1px solid ${selectedSt.size === subtopics.length ? 'var(--primary-150)' : 'var(--border)'}` }}>
              {selectedSt.size === subtopics.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
            </button>
          )}
        </div>

        {/* Subtopics List */}
        <div className="space-y-2">
          {subtopics.map((st, i) => {
            const stQs = getQuestionsBySubtopic(allQuestions, chapter.id, st);
            const stAnswered = stQs.filter((q) => chapterProgress.answeredIds.includes(q.id)).length;
            const stPct = stQs.length > 0 ? Math.round((stAnswered / stQs.length) * 100) : 0;
            const stLabel = st.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const stComplete = stPct === 100;
            const isSelected = selectedSt.has(st);

            const handleOpenSubtopic = () => {
              if (selectMode) {
                toggleSubtopic(st);
                return;
              }
              const unanswered = stQs.filter((q) => !chapterProgress.answeredIds.includes(q.id));
              const qs = unanswered.length > 0 ? unanswered : stQs;
              store.startQuiz(qs, 'subtopic');
            };

            return (
              <button key={st} onClick={handleOpenSubtopic}
                className="glass-hover w-full text-left p-4 flex items-center gap-3 anim-up transition-all duration-200"
                style={{
                  animationDelay: `${i * 30}ms`,
                  borderRadius: 'var(--radius-xl)',
                  border: isSelected ? '2px solid #8B5CF6' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(139, 92, 246, 0.06)' : undefined,
                  boxShadow: isSelected ? '0 2px 12px rgba(139, 92, 246, 0.15)' : 'none',
                }}>
                {/* Selection checkbox or number/check */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300`}
                  style={{
                    background: selectMode
                      ? isSelected ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'var(--bg-tertiary)'
                      : stComplete ? 'var(--success-100)' : 'var(--bg-tertiary)',
                    border: selectMode
                      ? isSelected ? '2px solid #8B5CF6' : '2px solid var(--border)'
                      : `1px solid ${stComplete ? 'var(--success-150)' : 'var(--border)'}`,
                  }}>
                  {selectMode ? (
                    isSelected
                      ? <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      : <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--border)' }} />
                  ) : stComplete ? (
                    <svg className="w-5 h-5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{stLabel}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 progress-bar" style={{ height: '3px' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${stPct}%`, background: stComplete ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--primary-light))' }} />
                    </div>
                    <span className="text-[10px] tabular-nums font-medium" style={{ color: 'var(--text-muted)' }}>{stAnswered}/{stQs.length}</span>
                  </div>
                </div>

                {/* Question count badge */}
                <span className="badge-modern text-[10px] flex-shrink-0">{stQs.length} Q</span>

                {/* Arrow (non-select mode) */}
                {!selectMode && (
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Start Button (Select Mode) */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 z-40 anim-up"
          style={{ background: 'linear-gradient(to top, var(--bg-primary) 70%, transparent)', padding: '16px 20px 24px' }}>
          <div className="max-w-2xl mx-auto">
            {selectedSt.size > 0 ? (
              <button onClick={startSelectedQuiz}
                className="w-full py-4 rounded-2xl text-white font-bold text-[15px] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                Inizia con {selectedSt.size} sottotemi selezionati
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>{selectedQCount} Q</span>
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl text-center font-medium text-sm"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Seleziona almeno un sottotema
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
