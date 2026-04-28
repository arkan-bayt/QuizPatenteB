'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadQuizData } from '@/data/quizData';
import { verifyCredentials, saveAdminSession, hasAdminSession } from '@/logic/authEngine';
import { loadProgress } from '@/logic/resumeEngine';
import { preloadVoices } from '@/logic/ttsEngine';
import LoginScreen from '@/components/LoginScreen';
import SelectionScreen from '@/components/SelectionScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const { screen, setData, login, setScreen, setShowResumePopup, isLoading } = useAppStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Preload TTS voices
    preloadVoices();

    // Load quiz data
    loadQuizData().then((data) => {
      setData(data.chapters, data.questions);
      setReady(true);
    }).catch((err) => {
      console.error('Failed to load quiz data:', err);
      setData([], []);
      setReady(true);
    });
  }, [setData]);

  useEffect(() => {
    if (!ready) return;
    // Check existing admin session
    if (hasAdminSession()) {
      login('admin');
      // Check for resumable progress
      if (loadProgress()) {
        setShowResumePopup(true);
      }
    } else {
      setScreen('login');
    }
  }, [ready, login, setScreen, setShowResumePopup]);

  if (!ready) return <LoadingScreen />;

  switch (screen) {
    case 'login': return <LoginScreen />;
    case 'select': return <SelectionScreen />;
    case 'quiz': return <QuizScreen />;
    case 'result': return <ResultScreen />;
    default: return <LoginScreen />;
  }
}
