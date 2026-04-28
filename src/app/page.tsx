'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { loadQuizData } from '@/data/quizData';
import { loadSession, clearSession } from '@/logic/authEngine';
import { preloadVoices } from '@/logic/ttsEngine';
import { loadQuizResume } from '@/logic/progressEngine';
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
    } else {
      store.setScreen('login');
    }
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
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
