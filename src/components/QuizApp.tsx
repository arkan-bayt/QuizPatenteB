'use client';

import React, { useState, useEffect } from 'react';
import LoginView from '@/components/LoginView';
import Navbar from '@/components/Navbar';
import HomeView from '@/components/HomeView';
import QuizEngine from '@/components/QuizEngine';
import AdminView from '@/components/AdminView';
import ResumeDialog from '@/components/ResumeDialog';
import { useQuizStore } from '@/lib/quiz-store';
import { QuizData, QuizQuestion } from '@/lib/types';
import { isValidQuizData } from '@/lib/validators';
import { shuffleArray } from '@/lib/utils';

export default function QuizApp() {
  const view = useQuizStore((s) => s.view);
  const isLoggedIn = useQuizStore((s) => s.isLoggedIn);
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const loadSession = useQuizStore((s) => s.loadSession);
  const clearSession = useQuizStore((s) => s.clearSession);

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [pendingStart, setPendingStart] = useState<{
    questions: QuizQuestion[];
    title: string;
    mode: string;
    chapterSlugs: string[];
    topicKey: string | null;
  } | null>(null);

  // Wait for zustand persist
  useEffect(() => {
    try {
      const unsub = useQuizStore.persist.onFinishHydration(() => setHydrated(true));
      if (useQuizStore.persist.hasHydrated()) setHydrated(true);
      const fallback = setTimeout(() => setHydrated(true), 2000);
      return () => { unsub(); clearTimeout(fallback); };
    } catch {
      setHydrated(true);
    }
  }, []);

  // Check auth on hydration
  useEffect(() => {
    if (!hydrated) return;
    const auth = localStorage.getItem('quiz-auth');
    if (auth === 'true') {
      useQuizStore.setState({ isLoggedIn: true, view: 'home' });
    }
  }, [hydrated]);

  // Load quiz data
  useEffect(() => {
    fetch('/quizData.json')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => {
        if (isValidQuizData(data)) {
          setQuizData(data);
        } else {
          console.error('Invalid quiz data');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load quiz data:', err);
        setLoading(false);
      });
  }, []);

  // Handle quiz start with resume check
  const handleStartQuiz = (questions: QuizQuestion[], title: string, mode: string, chapterSlugs: string[], topicKey: string | null) => {
    // Check for saved session
    const saved = loadSession();
    if (saved && saved.questions.length > 0 && saved.answers.length > 0) {
      // Show resume dialog instead of starting new quiz
      setPendingStart({ questions, title, mode, chapterSlugs, topicKey });
      setShowResume(true);
      return;
    }
    // No saved session - start fresh
    clearSession();
    startQuiz(questions, title);
    // Set title for session saving
    try { (QuizEngine as any)._setTitle?.(title); } catch { /* ignore */ }
  };

  const handleResume = () => {
    const saved = loadSession();
    if (saved) {
      setShowResume(false);
      startQuiz(saved.questions, saved.title);
      try { (QuizEngine as any)._setTitle?.(saved.title); } catch { /* ignore */ }
    }
  };

  const handleStartOver = () => {
    setShowResume(false);
    clearSession();
    if (pendingStart) {
      startQuiz(pendingStart.questions, pendingStart.title);
      try { (QuizEngine as any)._setTitle?.(pendingStart.title); } catch { /* ignore */ }
      setPendingStart(null);
    }
  };

  const handleDismissResume = () => {
    setShowResume(false);
    setPendingStart(null);
  };

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return <LoginView />;
  }

  // Logged in views
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {view === 'home' && quizData && (
          <HomeView quizData={quizData} onStartQuiz={handleStartQuiz} />
        )}
        {view === 'quiz' && (
          <QuizEngine onReset={resetQuiz} />
        )}
        {view === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Resume Dialog */}
      {showResume && (() => {
        const saved = loadSession();
        if (!saved) return null;
        return (
          <ResumeDialog
            session={saved}
            onResume={handleResume}
            onStartOver={handleStartOver}
            onDismiss={handleDismissResume}
          />
        );
      })()}
    </div>
  );
}
