'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { speakText, stopSpeech } from '@/logic/ttsEngine';
import { recordExamResult, recordAnswer, updateChapterProgress, addWrongAnswer, removeWrongAnswer, saveQuizResume, clearQuizResume } from '@/logic/progressEngine';

export default function QuizScreen() {
  const store = useStore();
  const { quizQuestions, currentIdx, correctCount, wrongCount, selectedAnswer, showFeedback, isComplete, autoAdvance, quizMode, activeChapterId, activeSubtopic, selectedChapterIds, user, allQuestions } = store;
  const username = user?.username || '';
  const question = store.getCurrentQ();
  const total = quizQuestions.length;
  const pct = total > 0 ? Math.round(((correctCount + wrongCount) / total) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);
  const [answerAnim, setAnswerAnim] = useState(false);

  useEffect(() => { setImgErr(false); setAnswerAnim(false); }, [currentIdx]);

  // Auto-advance
  useEffect(() => {
    if (!showFeedback || !autoAdvance || isComplete) return;
    const t = setTimeout(() => store.goNext(), 1200);
    return () => clearTimeout(t);
  }, [showFeedback, autoAdvance, isComplete, store]);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctCount + wrongCount]);

  useEffect(() => {
    if (isComplete && username) {
      clearQuizResume(username);
      if (quizMode === 'exam') recordExamResult(username, correctCount >= 21);
    }
  }, [isComplete, username, quizMode, correctCount]);

  if (!question) return <div className="min-h-screen bg-mesh flex items-center justify-center"><p className="text-[var(--text-muted)]">Nessuna domanda</p></div>;

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

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[var(--border)] px-5 py-3.5 sticky top-0 z-20" style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { stopSpeech(); store.goHome(); }}
              className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-white transition-all duration-200 text-xs font-medium px-3 py-2 rounded-xl hover:bg-white/[0.04]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Chiudi
            </button>

            <div className="flex items-center gap-1.5">
              <div className={`badge-modern text-[11px] ${isExam ? 'bg-amber-500/10 text-amber-300 border-amber-500/15' : quizMode === 'wrong' ? 'bg-red-500/10 text-red-300 border-red-500/15' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/15'}`}>
                {modeLabel}
              </div>
              {isExam && (
                <div className={`badge-modern text-[11px] ${errorsLeft <= 1 ? 'bg-red-500/15 text-red-300 border-red-500/20 animate-pulse' : errorsLeft <= 2 ? 'bg-amber-500/10 text-amber-300 border-amber-500/15' : 'bg-green-500/10 text-green-300 border-green-500/15'}`}>
                  {errorsLeft <= 1 ? '⚠️' : errorsLeft <= 2 ? '⚡' : '✓'} {errorsLeft} errori rimasti
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/[0.08] border border-green-500/[0.1]">
                <span className="text-[11px] font-bold text-green-300 tabular-nums">{correctCount}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/[0.08] border border-red-500/[0.1]">
                <span className="text-[11px] font-bold text-red-300 tabular-nums">{wrongCount}</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums font-medium ml-1">{currentIdx + 1}/{total}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div className={`h-full rounded-full transition-all duration-500 ${isExam ? 'progress-fill-amber' : ''}`}
              style={{ width: `${pct}%`, background: isExam ? undefined : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
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
              <span className="text-[var(--text-muted)] text-[11px] truncate">{question.chapterName}</span>
            </div>
            {!showFeedback && (
              <button onClick={() => { stopSpeech(); speakText(question.question, 'it-IT'); }}
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-[var(--border)] flex items-center justify-center hover:bg-white/[0.08] transition-all duration-200 hover:scale-105"
                title="Ascolta">
                <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </button>
            )}
          </div>

          {/* Question Card */}
          <div className="glass p-6 anim-up" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}>
            {/* Question text */}
            <p className="text-white text-[17px] leading-relaxed mb-5 font-medium">{question.question}</p>

            {/* Image */}
            {hasImg && (
              <div className="mb-5 text-center anim-fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.image} alt="" className="quiz-img" onError={() => setImgErr(true)} loading="lazy" />
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
                      ? <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 anim-bounce">
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </div>
                      : <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 anim-bounce">
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    }
                    <div>
                      <span className={`font-bold text-sm ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                        {isCorrect ? 'Corretto!' : 'Sbagliato!'}
                      </span>
                      <p className={`text-xs mt-0.5 ${isCorrect ? 'text-green-400/60' : 'text-red-400/60'}`}>
                        La risposta corretta: <span className="font-bold">{question.answer ? 'VERO' : 'FALSO'}</span>
                      </p>
                    </div>
                  </div>
                </div>

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

                {!autoAdvance && (
                  <button onClick={() => store.goNext()} className="btn-primary w-full">
                    {currentIdx < quizQuestions.length - 1 ? 'Prossima Domanda →' : 'Vedi Risultati'}
                  </button>
                )}
                {autoAdvance && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <p className="text-[var(--text-muted)] text-[11px] font-medium">Prossima domanda automaticamente...</p>
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
