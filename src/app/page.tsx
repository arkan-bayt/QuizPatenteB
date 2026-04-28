'use client';

import React from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import LoginScreen from '@/components/LoginScreen';
import SelectionScreen from '@/components/SelectionScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';

export default function Home() {
  const screen = useQuizStore((state) => state.screen);

  // Simple screen renderer - no complex objects passed
  switch (screen) {
    case 'login':
      return <LoginScreen />;
    case 'select':
      return <SelectionScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return <LoginScreen />;
  }
}
