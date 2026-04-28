'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QuizQuestion, SessionState } from '@/lib/types';
import { useQuizStore } from '@/lib/quiz-store';
import { safeStr } from '@/lib/utils';

interface QuizEngineProps {
  onReset: () => void;
}

export default function QuizEngine({ onReset }: QuizEngineProps) {
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const isAnswered = useQuizStore((s) => s.isAnswered);
  const selectedAnswer = useQuizStore((s) => s.selectedAnswer);
  const answers = useQuizStore((s) => s.answers);
  const isSpeaking = useQuizStore((s) => s.isSpeaking);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const setSpeaking = useQuizStore((s) => s.setSpeaking);
  const saveSession = useQuizStore((s) => s.saveSession);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTitle = useRef('Quiz');

  const question: QuizQuestion | undefined = questions[currentIndex];
  const correctCount = answers.filter(a => a.correct).length;
  const wrongCount = answers.filter(a => !a.correct).length;
  const pct = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  // Set session title from first question render
  useEffect(() => {
    // Save title for session (we'll get it from the store or a prop)
    // For now, use a generic title
  }, []);

  // TTS
  const speakQuestion = useCallback(() => {
    if (!question) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(safeStr(question.q));
    utt.lang = 'it-IT';
    utt.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith('it'));
    if (itVoice) utt.voice = itVoice;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }, [question, isSpeaking, setSpeaking]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isAnswered) {
      timerRef.current = setTimeout(() => nextQuestion(), 1500);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [isAnswered, nextQuestion]);

  // Save session on visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && answers.length > 0) {
        saveSessionToStore();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [answers, currentIndex, questions]);

  // Save session on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (answers.length > 0) {
        saveSessionToStore();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, currentIndex, questions]);

  function saveSessionToStore() {
    const session: SessionState = {
      mode: 'chapter',
      chapterSlugs: [],
      topicKey: null,
      questions,
      currentIndex,
      answers,
      startedAt: Date.now() - answers.length * 10000, // Approximate
      savedAt: Date.now(),
      title: sessionTitle.current,
    };
    saveSession(session);
  }

  const imageError = imageErrors[currentIndex] || false;
  const handleImageError = () => setImageErrors(prev => ({ ...prev, [currentIndex]: true }));

  // Update session title from quiz store state
  useEffect(() => {
    // We'll set the title from the parent component
  }, []);

  // Expose a way for parent to set title
  useEffect(() => {
    (QuizEngine as any)._setTitle = (t: string) => { sessionTitle.current = t; };
    return () => { delete (QuizEngine as any)._setTitle; };
  }, []);

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Indietro
        </button>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-green-500 font-bold">✓</span>
          <span className="font-medium text-green-600 dark:text-green-400">{correctCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-red-500 font-bold">✗</span>
          <span className="font-medium text-red-600 dark:text-red-400">{wrongCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">%</span>
          <span className="font-medium">{pct}%</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border rounded-2xl p-5 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            Domanda {currentIndex + 1}
          </span>
          <button
            onClick={speakQuestion}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all active:scale-90 ${
              isSpeaking
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                : 'bg-muted hover:bg-accent text-muted-foreground'
            }`}
            title="Ascolta"
          >
            {isSpeaking ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            )}
          </button>
        </div>

        {/* Image */}
        {typeof question.img === 'string' && question.img.length > 0 && !imageError && (
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <img
                src={question.img}
                alt="Segnale"
                className="h-32 sm:h-40 w-auto object-contain"
                onError={handleImageError}
              />
            </div>
          </div>
        )}

        {/* Question text - SAFE rendering */}
        <p className="text-lg sm:text-xl font-medium leading-relaxed">
          {safeStr(question.q)}
        </p>

        {/* Answer feedback */}
        {isAnswered && question && (
          <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
            selectedAnswer === question.a
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {selectedAnswer === question.a ? (
              <><svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><span>Corretto! La risposta esatta è {question.a ? 'VERO' : 'FALSO'}.</span></>
            ) : (
              <><svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg><span>Sbagliato! La risposta corretta era {question.a ? 'VERO' : 'FALSO'}.</span></>
            )}
          </div>
        )}

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answerQuestion(true)}
            disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
              isAnswered
                ? (question.a ? 'bg-green-500 text-white ring-2 ring-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-400 border border-red-200 dark:border-red-800')
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            VERO
          </button>
          <button
            onClick={() => answerQuestion(false)}
            disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
              isAnswered
                ? (!question.a ? 'bg-red-500 text-white ring-2 ring-red-400' : 'bg-green-100 dark:bg-green-900/20 text-green-400 border border-green-200 dark:border-green-800')
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            FALSO
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground/60">Per contattarci: arkanali199494@gmail.com</p>
      </div>
    </div>
  );
}
