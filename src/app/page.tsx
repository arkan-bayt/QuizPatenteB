'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { loadQuizData } from '@/data/quizData';
import { loadSession, clearSession } from '@/logic/authEngine';
import { preloadVoices } from '@/logic/ttsEngine';
import { loadCloudProgress } from '@/logic/progressEngine';
import LoginScreen from '@/components/LoginScreen';
import HomeScreen from '@/components/HomeScreen';
import ChapterScreen from '@/components/ChapterScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import AdminPanel from '@/components/AdminPanel';
import AIAnalysisScreen from '@/components/AIAnalysisScreen';
import AIChatScreen from '@/components/AIChatScreen';
import StudyPlanScreen from '@/components/StudyPlanScreen';

export default function Page() {
  const store = useStore();
  const { screen } = store;
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Dark mode auto-detection + manual toggle persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto-detect system preference
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) {
        document.documentElement.classList.add('dark');
      }
      // Listen for system changes
      const handler = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          document.documentElement.classList.toggle('dark', e.matches);
        }
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    preloadVoices();
    loadQuizData().then((data) => {
      store.setData(data.chapters, data.questions);
      setReady(true);
    }).catch(() => { store.setData([], []); setReady(true); });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const session = loadSession();
    if (session) {
      store.setUser(session);
      store.setScreen('home');
      // Load cloud progress on app start
      if (session.username) {
        setSyncing(true);
        loadCloudProgress(session.username).then(() => {
          setSyncing(false);
          // Force re-render of home screen
          store.setData(store.chapters, store.allQuestions);
        }).catch(() => setSyncing(false));
      }
    } else {
      store.setScreen('login');
    }
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-2xl border-[2.5px] animate-spin"
          style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)', boxShadow: 'var(--glow-primary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Caricamento domande...</p>
      </div>
    );
  }

  // Show syncing indicator briefly
  if (syncing) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-2xl border-[2.5px] animate-spin"
          style={{ borderColor: 'var(--success-150)', borderTopColor: 'var(--success)', boxShadow: 'var(--glow-success)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Sincronizzazione progresso...</p>
      </div>
    );
  }

  switch (screen) {
    case 'login': return <LoginScreen />;
    case 'home': return <HomeScreen />;
    case 'chapter': return <ChapterScreen />;
    case 'quiz': return <QuizScreen />;
    case 'exam': return <QuizScreen />;
    case 'result': return <ResultScreen />;
    case 'admin': return <AdminPanel />;
    case 'aiAnalysis': return <AIAnalysisScreen />;
    case 'aiChat': return <AIChatScreen />;
    case 'studyPlan': return <StudyPlanScreen />;
    default: return <LoginScreen />;
  }
}
