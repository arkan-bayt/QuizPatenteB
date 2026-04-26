'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizQuestion, ChapterProgress, UserAnswer, QuizMode } from './types';
import { CHAPTERS } from './chapters';

interface QuizState {
  // Quiz session state
  currentView: 'home' | 'quiz' | 'stats';
  quizMode: QuizMode;
  currentChapterSlug: string | null;
  quizTitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  isAnswered: boolean;
  selectedAnswer: boolean | null;
  isSpeaking: boolean;
  isFinished: boolean;

  // Progress state
  chapterProgress: Record<string, ChapterProgress>;

  // Actions
  setView: (view: 'home' | 'quiz' | 'stats') => void;
  startQuiz: (chapterSlug: string | null, mode: QuizMode, title?: string) => void;
  answerQuestion: (answer: boolean) => void;
  nextQuestion: () => void;
  stopQuiz: () => void;
  goToHome: () => void;
  resetQuiz: () => void;
  setSpeaking: (speaking: boolean) => void;
  clearErrorQuestions: (chapterSlug: string) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      quizMode: 'chapter',
      currentChapterSlug: null,
      quizTitle: '',
      questions: [],
      currentIndex: 0,
      userAnswers: [],
      isAnswered: false,
      selectedAnswer: null,
      isSpeaking: false,
      isFinished: false,
      chapterProgress: {},

      setView: (view) => set({ currentView: view }),

      startQuiz: (chapterSlug, mode, title) => {
        set({
          currentView: 'quiz',
          quizMode: mode,
          currentChapterSlug: chapterSlug,
          quizTitle: title || '',
        });
      },

      answerQuestion: (answer) => {
        const state = get();
        const currentQuestion = state.questions[state.currentIndex];
        if (!currentQuestion || state.isAnswered) return;

        const isCorrect = answer === currentQuestion.a;

        const userAnswer: UserAnswer = {
          questionId: currentQuestion.id,
          chapterSlug: state.currentChapterSlug || '',
          userAnswer: answer,
          correctAnswer: currentQuestion.a,
          isCorrect,
          timestamp: Date.now(),
        };

        // Extract chapter slug from question ID for multi-chapter/full-exam modes
        // ID format: "chapter-slug-123" for single, "chapter-slug-sub-123" for multi
        const idParts = currentQuestion.id.split('-');
        let chapterSlug = state.currentChapterSlug || '';

        if (!chapterSlug && idParts.length >= 2) {
          // For multi-chapter/full-exam, find matching chapter slug
          for (let i = idParts.length - 1; i >= 2; i--) {
            const candidate = idParts.slice(0, i).join('-');
            if (CHAPTERS.some((ch) => ch.slug === candidate)) {
              chapterSlug = candidate;
              break;
            }
          }
        }

        // Update chapter progress if we identified the chapter
        if (chapterSlug) {
          const existingProgress = state.chapterProgress[chapterSlug] || {
            chapterSlug,
            totalAttempted: 0,
            correctCount: 0,
            wrongCount: 0,
            errorQuestionIds: [],
            lastAccessed: Date.now(),
          };

          const newErrorIds = isCorrect
            ? existingProgress.errorQuestionIds.filter((id) => id !== currentQuestion.id)
            : existingProgress.errorQuestionIds.includes(currentQuestion.id)
              ? existingProgress.errorQuestionIds
              : [...existingProgress.errorQuestionIds, currentQuestion.id];

          const updatedProgress: ChapterProgress = {
            ...existingProgress,
            totalAttempted: existingProgress.totalAttempted + 1,
            correctCount: existingProgress.correctCount + (isCorrect ? 1 : 0),
            wrongCount: existingProgress.wrongCount + (isCorrect ? 0 : 1),
            errorQuestionIds: newErrorIds,
            lastAccessed: Date.now(),
          };

          set({
            isAnswered: true,
            selectedAnswer: answer,
            userAnswers: [...state.userAnswers, userAnswer],
            chapterProgress: {
              ...state.chapterProgress,
              [chapterSlug]: updatedProgress,
            },
          });
        } else {
          set({
            isAnswered: true,
            selectedAnswer: answer,
            userAnswers: [...state.userAnswers, userAnswer],
          });
        }
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.currentIndex + 1;

        if (nextIndex >= state.questions.length) {
          set({ isFinished: true });
        } else {
          set({ currentIndex: nextIndex, isAnswered: false, selectedAnswer: null });
        }
      },

      stopQuiz: () => {
        set({ isFinished: true });
      },

      goToHome: () => {
        set({
          currentView: 'home',
          questions: [],
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isFinished: false,
        });
      },

      resetQuiz: () => {
        set({
          currentView: 'home',
          quizMode: 'chapter',
          currentChapterSlug: null,
          questions: [],
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isSpeaking: false,
          isFinished: false,
        });
      },

      setSpeaking: (speaking) => set({ isSpeaking: speaking }),

      clearErrorQuestions: (chapterSlug) => {
        const state = get();
        const progress = state.chapterProgress[chapterSlug];
        if (progress) {
          set({
            chapterProgress: {
              ...state.chapterProgress,
              [chapterSlug]: {
                ...progress,
                errorQuestionIds: [],
                wrongCount: 0,
                correctCount: 0,
                totalAttempted: 0,
              },
            },
          });
        }
      },
    }),
    {
      name: 'patente-b-quiz-storage',
      partialize: (state) => ({
        chapterProgress: state.chapterProgress,
      }),
    }
  )
);
