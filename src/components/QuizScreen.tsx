'use client';
import React, { useEffect, useState, useCallback } from 'react';
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

  useEffect(() => { setImgErr(false); }, [currentIdx]);

  // Auto-advance
  useEffect(() => {
    if (!showFeedback || !autoAdvance || isComplete) return;
    const t = setTimeout(() => store.goNext(), 1300);
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

  useEffect(() => { if (isComplete && username) { clearQuizResume(username); if (quizMode === 'exam') recordExamResult(username, correctCount >= 21); } }, [isComplete]);

  if (!question) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><p className="text-[var(--t3)]">Nessuna domanda</p></div>;

  const isCorrect = selectedAnswer === question.answer;
  const hasImg = !!question.image && !imgErr;
  const isExam = quizMode === 'exam';
  const modeLabel = quizMode === 'exam' ? 'Esame' : quizMode === 'wrong' ? 'Ripeti Sbagliate' : `Cap. ${question.chapter}`;

  const handleAnswer = (val: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    store.submitAnswer(val);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top bar */}
      <div className="bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)] px-4 py-3 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => { stopSpeech(); store.goHome(); }} className="flex items-center gap-1 text-[var(--t3)] hover:text-white transition-colors text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Chiudi
            </button>
            <span className="badge bg-white/5 text-[var(--t2)]">{modeLabel}</span>
            <div className="flex items-center gap-2">
              <span className="badge bg-green-500/10 text-green-300">{correctCount}</span>
              <span className="badge bg-red-500/10 text-red-300">{wrongCount}</span>
              <span className="text-xs text-[var(--t2)] tabular-nums">{currentIdx + 1}/{total}</span>
            </div>
          </div>
          <div className="pbar">
            <div className="pfill" style={{ width: `${pct}%`, background: isExam ? 'var(--amber)' : 'var(--indigo)' }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center px-4 py-5">
        <div className="w-full max-w-2xl anim-up" key={`${currentIdx}-${question.id}`}>
          {/* Chapter badge */}
          <div className="mb-3 flex items-center gap-2">
            <span className="badge bg-white/5 text-[var(--t3)] text-[11px]">Cap. {question.chapter}</span>
            <span className="text-[var(--t3)] text-[11px] truncate">{question.chapterName}</span>
          </div>

          {/* Card */}
          <div className="card p-5">
            {/* Question + TTS */}
            <div className="flex items-start gap-3 mb-4">
              <p className="text-white text-[17px] leading-relaxed flex-1">{question.question}</p>
              {!showFeedback && (
                <button onClick={() => { stopSpeech(); speakText(question.question, 'it-IT'); }} className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center hover:bg-white/10 transition-colors" title="Ascolta">
                  <svg className="w-4 h-4 text-[var(--t2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                </button>
              )}
            </div>

            {/* Image */}
            {hasImg && (
              <div className="mb-4 text-center anim-fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.image} alt="" className="quiz-img" onError={() => setImgErr(true)} loading="lazy" />
              </div>
            )}

            {/* Buttons */}
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-3 anim-fade">
                <button onClick={() => handleAnswer(true)}
                  className="py-4 rounded-2xl font-bold text-base border-2 border-green-500/30 bg-green-500/8 text-green-300 hover:bg-green-500/15 hover:border-green-500/50 active:scale-[0.97] transition-all">
                  VERO
                </button>
                <button onClick={() => handleAnswer(false)}
                  className="py-4 rounded-2xl font-bold text-base border-2 border-red-500/30 bg-red-500/8 text-red-300 hover:bg-red-500/15 hover:border-red-500/50 active:scale-[0.97] transition-all">
                  FALSO
                </button>
              </div>
            ) : (
              <div className="anim-up">
                {/* Feedback */}
                <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/15' : 'bg-red-500/10 border border-red-500/15'}`}>
                  <div className="flex items-center gap-2">
                    {isCorrect
                      ? <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      : <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                    <span className={`font-semibold text-sm ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {isCorrect ? 'Corretto!' : 'Sbagliato!'} &rarr; {question.answer ? 'VERO' : 'FALSO'}
                    </span>
                  </div>
                </div>
                {/* Visual correct/wrong on buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={`py-3.5 rounded-2xl font-bold text-sm border-2 text-center transition-all ${question.answer === true ? 'border-green-400 bg-green-500/15 text-green-300' : selectedAnswer === true && !isCorrect ? 'border-red-400 bg-red-500/15 text-red-300' : 'border-[var(--border)] bg-transparent text-[var(--t3)] opacity-30'}`}>
                    VERO {question.answer === true && '✓'}
                  </div>
                  <div className={`py-3.5 rounded-2xl font-bold text-sm border-2 text-center transition-all ${question.answer === false ? 'border-green-400 bg-green-500/15 text-green-300' : selectedAnswer === false && !isCorrect ? 'border-red-400 bg-red-500/15 text-red-300' : 'border-[var(--border)] bg-transparent text-[var(--t3)] opacity-30'}`}>
                    FALSO {question.answer === false && '✓'}
                  </div>
                </div>
                {!autoAdvance && (
                  <button onClick={() => store.goNext()} className="btn-indigo w-full">
                    {currentIdx < quizQuestions.length - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
                  </button>
                )}
                {autoAdvance && (
                  <p className="text-center text-[var(--t3)] text-[11px]">Prossima domanda automaticamente...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
