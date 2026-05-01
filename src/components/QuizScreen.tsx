'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { speakText, stopSpeech } from '@/logic/ttsEngine';
import { recordExamResult, recordAnswer, updateChapterProgress, addWrongAnswer, removeWrongAnswer, saveQuizResume, clearQuizResume } from '@/logic/progressEngine';
import { CHAPTER_EXPLANATIONS } from '@/data/explanationsData';

export default function QuizScreen() {
  const store = useStore();
  const { quizQuestions, currentIdx, correctCount, wrongCount, selectedAnswer, showFeedback, isComplete, autoAdvance, quizMode, activeChapterId, activeSubtopic, selectedChapterIds, user, allQuestions } = store;
  const username = user?.username || '';
  const question = store.getCurrentQ();
  const total = quizQuestions.length;
  const pct = total > 0 ? Math.round(((correctCount + wrongCount) / total) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);
  const [answerAnim, setAnswerAnim] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplained, setAiExplained] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const prevIdxRef = useRef(currentIdx);

  useEffect(() => { setImgErr(false); setAnswerAnim(false); }, [currentIdx]);

  // Reset AI explanation on new question
  useEffect(() => {
    if (currentIdx !== prevIdxRef.current) {
      setAiExplanation(null);
      setAiLoading(false);
      setAiExplained(false);
      setHint(null);
      setHintLoading(false);
      setHintUsed(false);
      prevIdxRef.current = currentIdx;
    }
  }, [currentIdx]);

  // Auto-advance (disabled when showing AI explanation)
  useEffect(() => {
    if (!showFeedback || !autoAdvance || isComplete) return;
    if (aiExplained && aiExplanation) return; // Don't auto-advance while showing AI explanation
    const t = setTimeout(() => store.goNext(), 1200);
    return () => clearTimeout(t);
  }, [showFeedback, autoAdvance, isComplete, store, aiExplained, aiExplanation]);

  // Fetch AI explanation on wrong answer
  useEffect(() => {
    if (!showFeedback || aiExplained) return;
    const q = quizQuestions[currentIdx];
    if (!q || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === q.answer;
    if (isCorrect) return; // Only explain wrong answers

    let cancelled = false;
    setAiLoading(true);

    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'explain',
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: selectedAnswer,
        chapterName: q.chapterName,
        subtopic: q.subtopic,
        hasImage: !!q.image,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setAiExplanation(data.explanation || null);
          setAiLoading(false);
          setAiExplained(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAiLoading(false);
          setAiExplained(true);
        }
      });

    return () => { cancelled = true; };
  }, [showFeedback, aiExplained, quizQuestions, currentIdx, selectedAnswer]);

  // Record answer
  useEffect(() => {
    if (!username || showFeedback === undefined || correctCount + wrongCount === 0) return;
    if (selectedAnswer === null) return;
    const q = quizQuestions[currentIdx];
    if (!q) return;
    const isCorrect = selectedAnswer === q.answer;
    recordAnswer(username, isCorrect);
    if (quizMode === 'chapter' || quizMode === 'subtopic') {
      updateChapterProgress(username, q.chapter, q.id, isCorrect);
      if (!isCorrect) addWrongAnswer(username, q.id, q.chapter);
      else removeWrongAnswer(username, q.id);
    }
    if (quizMode === 'exam') {
      if (!isCorrect) addWrongAnswer(username, q.id, q.chapter);
      else removeWrongAnswer(username, q.id);
      saveQuizResume(username, { chapterIds: selectedChapterIds, questionIds: quizQuestions.map((x) => x.id), idx: currentIdx, correct: correctCount, wrong: wrongCount, mode: 'exam' });
    }
    if (quizMode === 'wrong') {
      if (isCorrect) removeWrongAnswer(username, q.id);
      saveQuizResume(username, { chapterIds: [], questionIds: quizQuestions.map((x) => x.id), idx: currentIdx, correct: correctCount, wrong: wrongCount, mode: 'wrong' });
    }
    if (quizMode === 'chapter') {
      saveQuizResume(username, { chapterIds: [], questionIds: quizQuestions.map((x) => x.id), idx: currentIdx, correct: correctCount, wrong: wrongCount, mode: 'chapter', chapterId: activeChapterId || undefined });
    }
    if (quizMode === 'subtopic') {
      saveQuizResume(username, { chapterIds: [], questionIds: quizQuestions.map((x) => x.id), idx: currentIdx, correct: correctCount, wrong: wrongCount, mode: 'subtopic', chapterId: activeChapterId || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctCount + wrongCount]);

  useEffect(() => {
    if (isComplete && username) {
      clearQuizResume(username);
      if (quizMode === 'exam') recordExamResult(username, correctCount >= 21);
    }
  }, [isComplete, username, quizMode, correctCount]);

  if (!question) return <div className="min-h-screen bg-mesh flex items-center justify-center"><p style={{ color: 'var(--text-muted)' }}>Nessuna domanda</p></div>;

  const isCorrect = selectedAnswer === question.answer;
  const hasImg = !!question.image && !imgErr;
  const isExam = quizMode === 'exam';
  const modeLabel = quizMode === 'exam' ? 'Esame' : quizMode === 'wrong' ? 'Ripeti Sbagliate' : `Cap. ${question.chapter}`;

  const handleAnswer = (val: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    setAnswerAnim(true);
    store.submitAnswer(val);
  };

  // Exam error counter visual
  const maxErrors = isExam ? 3 : 999;
  const errorsLeft = maxErrors - wrongCount;

  const handleNext = () => {
    setAiExplanation(null);
    setAiLoading(false);
    setAiExplained(false);
    setHint(null);
    setHintLoading(false);
    setHintUsed(false);
    store.goNext();
  };

  const handleHint = () => {
    if (hint || hintLoading || showFeedback) return;
    const q = quizQuestions[currentIdx];
    if (!q) return;
    setHintLoading(true);
    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'hint',
        question: q.question,
        chapterName: q.chapterName,
        subtopic: q.subtopic,
        hasImage: !!q.image,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setHint(data.hint || null);
        setHintUsed(true);
        setHintLoading(false);
      })
      .catch(() => {
        setHintLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Top bar */}
      <div className="glass-header px-5 py-3.5 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { stopSpeech(); store.goHome(); }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Chiudi
            </button>

            <div className="flex items-center gap-1.5">
              <div className="badge-modern text-[11px]"
                style={{
                  background: isExam ? 'var(--accent-100)' : quizMode === 'wrong' ? 'var(--danger-100)' : 'var(--primary-100)',
                  borderColor: isExam ? 'var(--accent-150)' : quizMode === 'wrong' ? 'var(--danger-150)' : 'var(--primary-150)',
                  color: isExam ? 'var(--accent)' : quizMode === 'wrong' ? 'var(--danger)' : 'var(--primary-light)'
                }}>
                {modeLabel}
              </div>
              {isExam && (
                <div className="badge-modern text-[11px]"
                  style={{
                    background: errorsLeft <= 1 ? 'var(--danger-150)' : errorsLeft <= 2 ? 'var(--accent-100)' : 'var(--success-100)',
                    borderColor: errorsLeft <= 1 ? 'var(--danger-200)' : errorsLeft <= 2 ? 'var(--accent-150)' : 'var(--success-150)',
                    color: errorsLeft <= 1 ? 'var(--danger)' : errorsLeft <= 2 ? 'var(--accent)' : 'var(--success)'
                  }}>
                  {errorsLeft <= 1 ? '⚠️' : errorsLeft <= 2 ? '⚡' : '✓'} {errorsLeft} errori rimasti
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--success)' }}>{correctCount}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--danger)' }}>{wrongCount}</span>
              </div>
              <span className="text-[11px] tabular-nums font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{currentIdx + 1}/{total}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div className={`h-full rounded-full transition-all duration-500`}
              style={{ width: `${pct}%`, background: isExam ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #1E3A8A, #3B82F6)' }} />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-6">
        <div className="w-full max-w-2xl" key={`${currentIdx}-${question.id}`}>
          {/* Chapter + TTS header */}
          <div className="flex items-center justify-between mb-4 anim-fade">
            <div className="flex items-center gap-2">
              <span className="badge-modern text-[10px]">Cap. {question.chapter}</span>
              <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{question.chapterName}</span>
            </div>
            {!showFeedback && (
              <div className="flex items-center gap-2">
                <button onClick={() => { stopSpeech(); speakText(question.question, 'it-IT'); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                  title="Ascolta">
                  <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </button>
                <button onClick={handleHint} disabled={!!hint || hintLoading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${hintUsed ? 'ring-2 ring-amber-400/50' : ''}`}
                  style={{ background: hint ? 'var(--accent-100)' : 'var(--bg-tertiary)', border: `1px solid ${hint ? 'var(--accent-200)' : 'var(--border)'}` }}
                  title="Indizio IA">
                  {hintLoading ? (
                    <svg className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" style={{ color: hint ? 'var(--accent)' : 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="glass p-6 anim-up" style={{ boxShadow: 'var(--shadow-xl)' }}>
            {/* Question text */}
            <p className="text-[18px] leading-relaxed mb-5 font-semibold" style={{ color: 'var(--text-primary)' }}>{question.question}</p>

            {/* Image */}
            {hasImg && (
              <div className="mb-5 text-center anim-fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.image} alt="" className="quiz-img" onError={() => setImgErr(true)} loading="lazy" />
              </div>
            )}

            {/* Hint Card */}
            {hint && !showFeedback && (
              <div className="mb-4 p-3.5 rounded-2xl anim-fade" style={{ background: 'var(--accent-50)', border: '1.5px solid var(--accent-200)' }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--accent-100)' }}>
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold" style={{ color: 'var(--accent)' }}>Indizio IA</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--accent-100)', color: 'var(--accent)' }}>TIP</span>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{hint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Buttons */}
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-4 anim-fade">
                <button onClick={() => handleAnswer(true)} className="answer-btn answer-true">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    VERO
                  </div>
                </button>
                <button onClick={() => handleAnswer(false)} className="answer-btn answer-false">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    FALSO
                  </div>
                </button>
              </div>
            ) : (
              <div className="anim-up">
                {/* Feedback Banner */}
                <div className={`p-4 mb-5 ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                  <div className="flex items-center gap-3">
                    {isCorrect
                      ? <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 anim-bounce" style={{ background: 'var(--success-150)' }}>
                          <svg className="w-5 h-5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </div>
                      : <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 anim-bounce" style={{ background: 'var(--danger-150)' }}>
                          <svg className="w-5 h-5" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    }
                    <div>
                      <span className="font-bold text-sm" style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                        {isCorrect ? 'Corretto!' : 'Sbagliato!'}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', opacity: 0.7 }}>
                        La risposta corretta: <span className="font-bold">{question.answer ? 'VERO' : 'FALSO'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Explanation Card */}
                {!isCorrect && (
                  <div className="mb-5 anim-fade">
                    {aiLoading ? (
                      <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                            <svg className="w-4 h-4 animate-spin" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Spiegazione IA in arrivo...</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Un momento</p>
                          </div>
                        </div>
                      </div>
                    ) : aiExplanation ? (
                      <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--primary-200)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--primary-100)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[12px] font-bold" style={{ color: 'var(--primary-light)' }}>Spiegazione IA</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--primary-100)', color: 'var(--primary-light)' }}>AI</span>
                            </div>
                            <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>{aiExplanation}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* View full chapter explanation link */}
                    {question && (
                      <button
                        onClick={() => {
                          store.setActiveChapterId(question.chapter);
                          const chExpl = CHAPTER_EXPLANATIONS.find(c => c.id === question.chapter);
                          if (chExpl) {
                            store.setActiveExplanationTopic(chExpl.topicIt);
                          }
                          store.setScreen('explanationChapter');
                        }}
                        className="w-full p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] anim-fade"
                        style={{ background: 'var(--primary-50)', border: '1.5px solid var(--primary-150)', animationDelay: '200ms' }}
                      >
                        <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <span className="text-[12px] font-bold" style={{ color: 'var(--primary-light)' }}>Spiegazione completa del Capitolo {question.chapter}</span>
                        <svg className="w-3.5 h-3.5" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Visual answer buttons (after answering) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`answer-btn ${question.answer === true ? 'answer-correct' : (selectedAnswer === true && !isCorrect ? 'answer-wrong' : 'answer-dim')}`}>
                    <div className="flex items-center justify-center gap-2">
                      {question.answer === true && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      VERO
                    </div>
                  </div>
                  <div className={`answer-btn ${question.answer === false ? 'answer-correct' : (selectedAnswer === false && !isCorrect ? 'answer-wrong' : 'answer-dim')}`}>
                    <div className="flex items-center justify-center gap-2">
                      {question.answer === false && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      FALSO
                    </div>
                  </div>
                </div>

                {/* Next button - show when AI explanation is shown OR auto-advance is off */}
                {(!autoAdvance || (aiExplained && aiExplanation)) && (
                  <button onClick={handleNext} className="btn-primary w-full">
                    {currentIdx < quizQuestions.length - 1 ? 'Prossima Domanda →' : 'Vedi Risultati'}
                  </button>
                )}
                {autoAdvance && !(aiExplained && aiExplanation) && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--primary-light)' }} />
                    <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Prossima domanda automaticamente...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
