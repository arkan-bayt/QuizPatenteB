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

export default function Page() {
  const store = useStore();
  const { screen } = store;
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);

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
        <div className="w-10 h-10 rounded-2xl border-2 border-indigo-500/30 border-t-indigo-400 animate-spin"
          style={{ boxShadow: '0 0 20px rgba(99,102,241,0.2)' }} />
        <p className="text-[var(--text-muted)] text-sm font-medium">Caricamento domande...</p>
      </div>
    );
  }

  // Show syncing indicator briefly
  if (syncing) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-2xl border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"
          style={{ boxShadow: '0 0 20px rgba(6,182,212,0.2)' }} />
        <p className="text-[var(--text-muted)] text-sm font-medium">Sincronizzazione progresso...</p>
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
    default: return <LoginScreen />;
  }
}
