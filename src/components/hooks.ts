'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { QuizQuestion, Chapter, getSubtopicsForChapter, getQuestionsBySubtopic, getQuestionsByChapters, getRandomQuestions } from '@/data/quizData';
import { getChapterProgress, getUserStats, getWrongAnswerIds, updateChapterProgress, addWrongAnswer, removeWrongAnswer, recordAnswer, recordExamResult } from '@/logic/progressEngine';
import { saveQuizResume, clearQuizResume } from '@/logic/quizResume';
import { speakText, stopSpeech } from '@/logic/ttsEngine';

// ============================================================
// REUSABLE QUIZ ENGINE (handles: chapter, subtopic, exam, wrong modes)
// ============================================================
export function useQuizEngine() {
  const store = useStore();
  const { user, allQuestions, chapters, quizQuestions, currentIdx, correctCount, wrongCount, selectedAnswer, showFeedback, isComplete, autoAdvance, quizMode, activeChapterId, activeSubtopic, selectedChapterIds } = store;
  const username = user?.username || '';
  const question = store.getCurrentQ();
  const total = quizQuestions.length;
  const pct = total > 0 ? Math.round(((correctCount + wrongCount) / total) * 100) : 0;

  // Auto-advance after answering
  useEffect(() => {
    if (!showFeedback || !autoAdvance) return;
    const timer = setTimeout(() => store.goNext(), 1200);
    return () => clearTimeout(timer);
  }, [showFeedback, autoAdvance, store]);

  // Save progress on each answer
  useEffect(() => {
    if (!username || correctCount + wrongCount === 0) return;
    const q = store.getCurrentQ() || quizQuestions[currentIdx - 1 >= 0 ? currentIdx - 1 : 0];
    if (!q) return;
    const lastAnswer = selectedAnswer;
    const isCorrect = lastAnswer === q.answer;
    // Record stats
    recordAnswer(username, isCorrect);
    // Record chapter progress
    if (quizMode === 'chapter' || quizMode === 'subtopic') {
      updateChapterProgress(username, q.chapter, q.id, isCorrect);
      if (!isCorrect) addWrongAnswer(username, q.id, q.chapter);
      else removeWrongAnswer(username, q.id);
    }
    // Auto-save progress for ALL quiz modes (resume feature)
    if (quizQuestions.length >= 30) {
      saveQuizResume(username, {
        chapterIds: selectedChapterIds,
        questionIds: quizQuestions.map((x) => x.id),
        idx: currentIdx,
        correct: correctCount,
        wrong: wrongCount,
        mode: quizMode,
        chapterId: activeChapterId || undefined,
        subtopic: activeSubtopic || undefined,
        ts: Date.now(),
      });
    }
  }, [correctCount + wrongCount]);

  // Clear resume when quiz completes
  useEffect(() => {
    if (isComplete && username) clearQuizResume(username, quizMode, activeChapterId || undefined, activeSubtopic || undefined);
  }, [isComplete, username, quizMode, activeChapterId, activeSubtopic]);

  const handleAnswer = useCallback((val: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    store.submitAnswer(val);
  }, [showFeedback, store]);

  return { store, question, total, pct, correctCount, wrongCount, selectedAnswer, showFeedback, isComplete, autoAdvance, quizMode, username, handleAnswer };
}

// ============================================================
// CHAPTER PROGRESS HELPER
// ============================================================
export function useChapterProgress(chapterId: number) {
  const { user } = useStore();
  const username = user?.username || '';
  const allProgress = getChapterProgress(username);
  return allProgress[chapterId] || { answeredIds: [], correctIds: [], wrongIds: [] };
}

// ============================================================
// USER STATS HELPER
// ============================================================
export function useUserStats() {
  const { user } = useStore();
  return getUserStats(user?.username || '');
}

// ============================================================
// OVERALL PROGRESS STATS
// ============================================================
export function useOverallStats() {
  const { user, chapters } = useStore();
  const username = user?.username || '';
  const allProgress = getChapterProgress(username);
  let totalAnswered = 0;
  let totalCorrect = 0;
  const chapterStats: { id: number; answered: number; total: number; correct: number; wrong: number; pct: number }[] = [];
  for (const ch of chapters) {
    const cp = allProgress[ch.id] || { answeredIds: [], correctIds: [], wrongIds: [] };
    const answered = cp.answeredIds.length;
    const correct = cp.correctIds.length;
    const wrong = cp.wrongIds.length;
    totalAnswered += answered;
    totalCorrect += correct;
    chapterStats.push({ id: ch.id, answered, total: ch.questionCount, correct, wrong, pct: ch.questionCount > 0 ? Math.round((answered / ch.questionCount) * 100) : 0 });
  }
  return { totalAnswered, totalCorrect, totalWrong: totalAnswered - totalCorrect, chapterStats };
}

// ============================================================
// WRONG ANSWERS STATS
// ============================================================
export function useWrongAnswers() {
  const { user, allQuestions } = useStore();
  const username = user?.username || '';
  const wrongIds = getWrongAnswerIds(username);
  const wrongQuestions = allQuestions.filter((q) => wrongIds.includes(q.id));
  // Group by chapter
  const byChapter: Record<number, QuizQuestion[]> = {};
  for (const q of wrongQuestions) {
    if (!byChapter[q.chapter]) byChapter[q.chapter] = [];
    byChapter[q.chapter].push(q);
  }
  return { total: wrongIds.length, byChapter, questions: wrongQuestions };
}
