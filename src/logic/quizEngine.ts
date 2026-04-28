// ============================================================
// LOGIC LAYER - Quiz Engine
// ============================================================

import { QuizQuestion } from '@/data/quizData';

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  correctCount: number;
  totalAnswered: number;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isComplete: boolean;
}

export function createQuiz(questions: QuizQuestion[]): QuizState {
  // Shuffle questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return {
    questions: shuffled,
    currentIndex: 0,
    correctCount: 0,
    totalAnswered: 0,
    selectedAnswer: null,
    showFeedback: false,
    isComplete: false,
  };
}

export function submitAnswer(state: QuizState, answer: boolean): QuizState {
  const currentQuestion = state.questions[state.currentIndex];
  if (!currentQuestion) return state;

  const isCorrect = answer === currentQuestion.answer;

  return {
    ...state,
    selectedAnswer: answer,
    showFeedback: true,
    correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
    totalAnswered: state.totalAnswered + 1,
  };
}

export function nextQuestion(state: QuizState): QuizState {
  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.questions.length) {
    return { ...state, isComplete: true, showFeedback: false };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    selectedAnswer: null,
    showFeedback: false,
  };
}

export function getCurrentQuestion(state: QuizState): QuizQuestion | null {
  if (state.currentIndex < 0 || state.currentIndex >= state.questions.length) {
    return null;
  }
  return state.questions[state.currentIndex];
}

export function getScore(state: QuizState): { correct: number; total: number; percentage: number } {
  const percentage = state.totalAnswered > 0
    ? Math.round((state.correctCount / state.totalAnswered) * 100)
    : 0;
  return {
    correct: state.correctCount,
    total: state.totalAnswered,
    percentage,
  };
}

export function resetQuiz(questions: QuizQuestion[]): QuizState {
  return createQuiz(questions);
}
