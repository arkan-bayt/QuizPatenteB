'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeech } from '@/logic/ttsEngine';
import { saveProgress } from '@/logic/resumeEngine';

export default function QuizScreen() {
  const store = useAppStore();
  const { quizQuestions, currentIndex, correctCount, wrongCount, selectedAnswer, showFeedback } = store;
  const [imgError, setImgError] = useState(false);

  const question = store.currentQuestion();
  const progress = quizQuestions.length > 0 ? Math.round(((currentIndex + (showFeedback ? 1 : 0)) / quizQuestions.length) * 100) : 0;

  // Save progress on each answer
  const save = useCallback(() => {
    const s = useAppStore.getState();
    saveProgress({
      chapterIds: s.selectedChapterIds,
      questionIds: s.quizQuestions.map((q) => q.id),
      currentIndex: s.currentIndex,
      correctCount: s.correctCount,
      totalAnswered: s.correctCount + s.wrongCount,
      timestamp: Date.now(),
    });
  }, []);

  useEffect(() => { if (correctCount + wrongCount > 0) save(); }, [correctCount + wrongCount, save]);
  useEffect(() => () => stopSpeech(), []);
  useEffect(() => { setImgError(false); }, [currentIndex]);

  if (!question) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-slate-400">Nessuna domanda</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === question.answer;
  const hasImage = !!question.image && !imgError;

  const handleAnswer = (val: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    store.answer(val);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 sticky top-0 z-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <button onClick={() => { stopSpeech(); store.restart(); }} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Indietro
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="badge bg-emerald-500/15 text-emerald-300">{correctCount}</span>
                <span className="badge bg-rose-500/15 text-rose-300">{wrongCount}</span>
              </div>
              <span className="text-sm text-slate-400 font-medium tabular-nums">{currentIndex + 1}/{quizQuestions.length}</span>
            </div>
            <button onClick={() => { stopSpeech(); store.logout(); if (typeof window !== 'undefined') localStorage.removeItem('quiz_admin_session'); }} className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </button>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center px-4 py-5">
        <div className="w-full max-w-lg animate-fade-in" key={currentIndex}>
          {/* Chapter badge */}
          <div className="mb-4">
            <span className="badge bg-white/[0.06] text-slate-400 text-xs">
              Cap. {question.chapter} &middot; {question.chapterName}
            </span>
          </div>

          {/* Question card */}
          <div className="glass-card p-5 mb-5">
            {/* Question text + TTS button */}
            <div className="flex items-start gap-3 mb-4">
              <p className="text-white text-[17px] leading-relaxed flex-1 font-medium">{question.question}</p>
              {!showFeedback && (
                <button onClick={() => { stopSpeech(); speakText(question.question, 'it-IT'); }} className="flex-shrink-0 w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors" title="Ascolta">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                </button>
              )}
            </div>

            {/* Image */}
            {hasImage && (
              <div className="mb-5 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={question.image}
                  alt="Segnale stradale"
                  className="quiz-image"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              </div>
            )}

            {/* Answer buttons */}
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <button onClick={() => handleAnswer(true)} className="answer-btn answer-true">VERO</button>
                <button onClick={() => handleAnswer(false)} className="answer-btn answer-false">FALSO</button>
              </div>
            ) : (
              <div className="animate-slide-up">
                {/* Result feedback */}
                <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-rose-500/15 border border-rose-500/25'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCorrect ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {isCorrect ? 'Corretto!' : 'Sbagliato'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Risposta: <span className="font-semibold text-white">{question.answer ? 'VERO' : 'FALSO'}</span>
                  </p>
                </div>

                {/* Selected answers visual */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className={`answer-btn ${question.answer ? 'answer-correct' : selectedAnswer && !question.answer ? 'answer-wrong' : 'opacity-30'}`}>VERO</div>
                  <div className={`answer-btn ${!question.answer ? 'answer-correct' : selectedAnswer && question.answer ? 'answer-wrong' : 'opacity-30'}`}>FALSO</div>
                </div>

                <button onClick={() => store.next()} className="btn-accent w-full">
                  {currentIndex < quizQuestions.length - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
