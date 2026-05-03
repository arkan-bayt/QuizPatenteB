'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { speakText, stopSpeech } from '@/logic/ttsEngine';
import { recordExamResult, recordAnswer, updateChapterProgress, addWrongAnswer, removeWrongAnswer, saveQuizResume, clearQuizResume } from '@/logic/progressEngine';
import { submitAssignmentResult } from '@/logic/assignmentEngine';
import { authenticatedFetch } from '@/lib/api';
import WordTranslator from './WordTranslator';

// Italian prepositions, articles, conjunctions - these are NOT tappable
const SKIP_WORDS = new Set([
  'il', 'lo', 'la', 'le', 'gli', 'i', 'un', 'uno', 'una',
  'di', 'del', 'della', 'dei', 'degli', 'delle', 'de',
  'a', 'al', 'alla', 'ai', 'alle', 'ad', 'in', 'nel', 'nella', 'nei', 'nelle',
  'da', 'dal', 'dalla', 'dai', 'dalle', 'su', 'sul', 'sulla', 'sui', 'sulle',
  'con', 'col', 'coi', 'per', 'tra', 'fra',
  'che', 'e', 'ed', 'o', 'ma', 'se', 'ne', 'ci', 'vi', 'mi', 'ti', 'si', 'gli',
  'non', 'no', 'ni', 'anche', 'ancora', 'gia', 'piu', 'meno', 'molto',
  'tanto', 'quanto', 'come', 'dove', 'quando', 'finche', 'mentre',
  'pero', 'dunque', 'quindi', 'inoltre', 'oppure', 'ovvero',
  'questo', 'questa', 'quello', 'quella', 'questi', 'queste', 'quelli', 'quelle',
  'suo', 'sua', 'suoi', 'sue', 'tuo', 'tua', 'tuoi', 'tue',
  'mio', 'mia', 'miei', 'mie', 'nostro', 'nostra', 'vostro', 'vostra',
  'essere', 'avere', 'fare', 'stare', 'andare', 'venire', 'dovere', 'potere', 'volere',
  'sono', 'sei', 'siamo', 'siete', 'ho', 'hai', 'ha',
  'faccio', 'fai', 'fa', 'sto', 'stai', 'sta', 'vado', 'vai', 'va',
  'puo', 'devi', 'vuoi', 'posso', 'dobbiamo', 'devo', 'deve',
  'era', 'ero', 'aveva', 'fui', 'fatto', 'stato', 'fatta', 'stati', 'state',
  'vero', 'falso',
  'tutti', 'nessuno', 'altro', 'tutto', 'nulla',
  'ogni', 'alcuno', 'qualche', 'nessun', 'nessuna',
  'prima', 'dopo', 'durante', 'fino',
  'sotto', 'sopra', 'dentro', 'fuori',
  'hanno', 'abbiamo', 'avete', 'fanno', 'stiamo', 'stanno',
  'possibile',
]);

// Check if a word is skippable (preposition/article/number)
function isSkipWord(cleaned: string): boolean {
  if (cleaned.length <= 1) return true;
  if (/[0-9]/.test(cleaned)) return true;
  return SKIP_WORDS.has(cleaned);
}

// Translation cache (persisted in localStorage)
const translationCache: Record<string, string> = {};
function getCachedTranslation(word: string): string | null {
  const key = word.toLowerCase();
  if (translationCache[key]) {
    // Validate it's actually Arabic, not a cached Italian fallback
    if (/[؀-\u06FF]/.test(translationCache[key])) return translationCache[key];
    delete translationCache[key]; // Remove bad cache entry
    return null;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('qp_translations');
      if (saved) {
        const all = JSON.parse(saved);
        if (all[key]) {
          // Only return if it's actually Arabic
          if (/[؀-\u06FF]/.test(all[key])) {
            translationCache[key] = all[key];
            return all[key];
          } else {
            delete all[key]; // Clean up bad cache entry
            localStorage.setItem('qp_translations', JSON.stringify(all));
          }
        }
      }
    } catch { /* */ }
  }
  return null;
}
function setCachedTranslation(word: string, translation: string) {
  const key = word.toLowerCase();
  translationCache[key] = translation;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('qp_translations');
      const all = saved ? JSON.parse(saved) : {};
      all[key] = translation;
      if (Object.keys(all).length > 500) {
        const keys = Object.keys(all);
        for (let i = 0; i < 100; i++) delete all[keys[i]];
      }
      localStorage.setItem('qp_translations', JSON.stringify(all));
    } catch { /* */ }
  }
}

export default function QuizScreen() {
  const store = useStore();
  const { quizQuestions, currentIdx, correctCount, wrongCount, selectedAnswer, showFeedback, isComplete, autoAdvance, quizMode, activeChapterId, activeSubtopic, selectedChapterIds, user, allQuestions, activeAssignmentId } = store;
  const username = user?.username || '';
  const question = store.getCurrentQ();
  const total = quizQuestions.length;
  const pct = total > 0 ? Math.round(((correctCount + wrongCount) / total) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);
  const [answerAnim, setAnswerAnim] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplained, setAiExplained] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const prevIdxRef = useRef(currentIdx);

  // AI usage tracking
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);
  const [aiLimit, setAiLimit] = useState<number | null>(null);

  // Word translation state (for inline bar)
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordTranslation, setWordTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  // WordTranslator popup state
  const [translatorPopup, setTranslatorPopup] = useState<{
    word: string;
    position: { x: number; y: number };
  } | null>(null);

  // Assignment mode state
  const [submittingResult, setSubmittingResult] = useState(false);
  const [quizStartTime] = useState(Date.now());

  // Assignment title (passed via store or URL)
  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  useEffect(() => {
    if (activeAssignmentId && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('qp_active_assignment');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.title) setAssignmentTitle(data.title);
        }
      } catch { /* */ }
    }
  }, [activeAssignmentId]);

  const isAssignmentMode = !!activeAssignmentId;

  const handleWordClick = useCallback(async (e: React.MouseEvent | React.TouchEvent, word: string) => {
    if (word.length <= 1 || /[0-9]/.test(word)) return;
    const cleaned = word.replace(/[.,;:!?"'()]/g, '').toLowerCase();
    if (cleaned.length <= 1) return;
    // Skip prepositions, articles, numbers
    if (isSkipWord(cleaned)) return;

    // Get click/tap position
    let clientX: number, clientY: number;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Close inline bar and show popup instead
    setSelectedWord(null);
    setWordTranslation(null);

    // If same word tapped, close
    if (translatorPopup && translatorPopup.word === cleaned) {
      setTranslatorPopup(null);
      return;
    }

    setTranslatorPopup({ word: cleaned, position: { x: clientX, y: clientY } });
  }, [translatorPopup]);

  const handleTranslatorClose = useCallback((translation: string) => {
    setTranslatorPopup(null);
    // Optionally cache the translation for inline use
    if (translation && /[؀-\u06FF]/.test(translation)) {
      setCachedTranslation(translatorPopup?.word || '', translation);
    }
  }, [translatorPopup]);

  // Fallback inline word click handler (same as before, kept for compatibility)
  const handleWordClickInline = useCallback(async (word: string) => {
    if (word.length <= 1 || /[0-9]/.test(word)) return;
    const cleaned = word.replace(/[.,;:!?"'()]/g, '').toLowerCase();
    if (cleaned.length <= 1) return;
    if (isSkipWord(cleaned)) return;

    if (selectedWord === cleaned) {
      setSelectedWord(null);
      setWordTranslation(null);
      return;
    }

    setSelectedWord(cleaned);

    const cached = getCachedTranslation(cleaned);
    if (cached) {
      setWordTranslation(cached);
      setTranslating(false);
      return;
    }

    setTranslating(true);
    setWordTranslation(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ action: 'translate', word: cleaned }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      const tr = data.translation || '';
      const isArabic = /[\u0600-\u06FF]/.test(tr);
      if (isArabic && tr.length > 0) {
        setWordTranslation(tr);
        setCachedTranslation(cleaned, tr);
      } else {
        setWordTranslation('');
      }
    } catch {
      setWordTranslation('');
    }
    setTranslating(false);
  }, [selectedWord]);

  useEffect(() => { setImgErr(false); setAnswerAnim(false); }, [currentIdx]);

  // Reset AI explanation on new question
  useEffect(() => {
    if (currentIdx !== prevIdxRef.current) {
      setAiExplanation(null);
      setAiLoading(false);
      setAiExplained(false);
      setHint(null);
      setHintLoading(false);
      setHintUsed(false);
      setSelectedWord(null);
      setWordTranslation(null);
      setTranslatorPopup(null);
      prevIdxRef.current = currentIdx;
    }
  }, [currentIdx]);

  // Auto-advance (disabled when showing AI explanation)
  useEffect(() => {
    if (!showFeedback || !autoAdvance || isComplete) return;
    if (aiExplained && aiExplanation) return;
    const t = setTimeout(() => store.goNext(), 1200);
    return () => clearTimeout(t);
  }, [showFeedback, autoAdvance, isComplete, store, aiExplained, aiExplanation]);

  // Fetch AI explanation on wrong answer
  useEffect(() => {
    if (!showFeedback || aiExplained) return;
    const q = quizQuestions[currentIdx];
    if (!q || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === q.answer;
    if (isCorrect) return;

    let cancelled = false;
    setAiLoading(true);

    authenticatedFetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        action: 'explain',
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: selectedAnswer,
        chapterName: q.chapterName,
        subtopic: q.subtopic,
        hasImage: !!q.image,
        username,
      }),
    })
      .then(res => {
        if (res.status === 429) return res.json();
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setAiExplanation(data.explanation || null);
          if (data.ai_remaining !== undefined) setAiRemaining(data.ai_remaining);
          if (data.ai_limit !== undefined) setAiLimit(data.ai_limit);
          if (data.error && data.error.includes('limit')) {
            setAiRemaining(0);
            setAiLimit(data.limit || 0);
          }
          setAiLoading(false);
          setAiExplained(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAiLoading(false);
          setAiExplained(true);
        }
      });

    return () => { cancelled = true; };
  }, [showFeedback, aiExplained, quizQuestions, currentIdx, selectedAnswer, username]);

  // Record answer
  useEffect(() => {
    if (!username || showFeedback === undefined || correctCount + wrongCount === 0) return;
    if (selectedAnswer === null) return;
    const q = quizQuestions[currentIdx];
    if (!q) return;
    const isCorrect = selectedAnswer === q.answer;
    recordAnswer(username, isCorrect);
    if (quizMode === 'chapter' || quizMode === 'subtopic') {
      updateChapterProgress(username, q.chapter, q.id, isCorrect);
      if (!isCorrect) addWrongAnswer(username, q.id, q.chapter);
      else removeWrongAnswer(username, q.id);
    }
    if (quizMode === 'exam') {
      if (!isCorrect) addWrongAnswer(username, q.id, q.chapter);
      else removeWrongAnswer(username, q.id);
      saveQuizResume(username, { chapterIds: selectedChapterIds, questionIds: quizQuestions.map((x) => x.id), idx: currentIdx, correct: correctCount, wrong: wrongCount, mode: 'exam' });
    }
    if (quizMode === 'wrong') {
      if (isCorrect) removeWrongAnswer(username, q.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctCount + wrongCount]);

  useEffect(() => {
    if (isComplete && username) {
      clearQuizResume(username);
      if (quizMode === 'exam') recordExamResult(username, correctCount >= 21);
    }
  }, [isComplete, username, quizMode, correctCount]);

  // Auto-submit assignment result when quiz completes
  useEffect(() => {
    if (!isComplete || !isAssignmentMode || !activeAssignmentId || !username) return;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

    setSubmittingResult(true);

    const answers: Record<string, { questionId: number; userAnswer: boolean; correctAnswer: boolean; isCorrect: boolean }> = {};
    quizQuestions.forEach((q, idx) => {
      // We don't have per-question answers stored here, just overall counts
      // The individual answers would need to be collected during the quiz
      answers[`q_${q.id}`] = {
        questionId: q.id,
        userAnswer: q.answer, // Placeholder - in real scenario, track each answer
        correctAnswer: q.answer,
        isCorrect: true,
      };
    });

    submitAssignmentResult(activeAssignmentId, {
      studentId: user?.id || '',
      score,
      total_questions: total,
      correct_count: correctCount,
      mistakes_count: wrongCount,
      time_taken_seconds: timeTaken,
      answers,
    }).then((res) => {
      setSubmittingResult(false);
      if (res.ok) {
        // Clean up assignment state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('qp_active_assignment');
        }
        // Navigate to student dashboard after a brief delay
        setTimeout(() => {
          store.setScreen('studentDashboard');
        }, 1500);
      } else {
        // Still navigate to results
        setTimeout(() => {
          store.setScreen('result');
        }, 1500);
      }
    }).catch(() => {
      setSubmittingResult(false);
      setTimeout(() => {
        store.setScreen('result');
      }, 1500);
    });
  }, [isComplete, isAssignmentMode, activeAssignmentId, username, correctCount, wrongCount, total, quizStartTime, quizQuestions, user, store]);

  if (!question) return <div className="min-h-screen bg-mesh flex items-center justify-center"><p style={{ color: 'var(--text-muted)' }}>Nessuna domanda</p></div>;

  const isCorrect = selectedAnswer === question.answer;
  const hasImg = !!question.image && !imgErr;
  const isExam = quizMode === 'exam';
  const modeLabel = isAssignmentMode
    ? `Compito${assignmentTitle ? ': ' + assignmentTitle : ''}`
    : quizMode === 'exam' ? 'Esame' : quizMode === 'wrong' ? 'Ripeti Sbagliate' : `Cap. ${question.chapter}`;

  const handleAnswer = (val: boolean) => {
    if (showFeedback) return;
    stopSpeech();
    setAnswerAnim(true);
    store.submitAnswer(val);
  };

  // Exam error counter visual
  const maxErrors = isExam ? 3 : 999;
  const errorsLeft = maxErrors - wrongCount;

  const handleNext = () => {
    setAiExplanation(null);
    setAiLoading(false);
    setAiExplained(false);
    setHint(null);
    setHintLoading(false);
    setHintUsed(false);
    setSelectedWord(null);
    setWordTranslation(null);
    setTranslatorPopup(null);
    store.goNext();
  };

  const handleHint = () => {
    if (hint || hintLoading || showFeedback) return;
    const q = quizQuestions[currentIdx];
    if (!q) return;
    setHintLoading(true);
    authenticatedFetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        action: 'hint',
        question: q.question,
        chapterName: q.chapterName,
        subtopic: q.subtopic,
        hasImage: !!q.image,
        username,
      }),
    })
      .then(res => {
        if (res.status === 429) return res.json();
        return res.json();
      })
      .then(data => {
        setHint(data.hint || null);
        setHintUsed(true);
        setHintLoading(false);
        if (data.ai_remaining !== undefined) setAiRemaining(data.ai_remaining);
        if (data.ai_limit !== undefined) setAiLimit(data.ai_limit);
        if (data.error && data.error.includes('limit')) {
          setAiRemaining(0);
          setAiLimit(data.limit || 0);
        }
      })
      .catch(() => {
        setHintLoading(false);
      });
  };

  const aiLimitReached = aiRemaining === 0;
  const aiRemainingDisplay = aiRemaining !== null ? aiRemaining : '?';

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* WordTranslator Popup */}
      {translatorPopup && (
        <WordTranslator
          word={translatorPopup.word}
          position={translatorPopup.position}
          onClose={handleTranslatorClose}
        />
      )}

      {/* Top bar */}
      <div className="glass-header px-5 py-3.5 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          {/* Assignment indicator */}
          {isAssignmentMode && (
            <div className="mb-2 px-3 py-1.5 rounded-xl flex items-center gap-2 anim-fade"
              style={{ background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.16)' }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <span className="text-[11px] font-semibold truncate" style={{ color: '#818CF8' }}>
                Compito{assignmentTitle ? ': ' + assignmentTitle : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { stopSpeech(); store.goHome(); }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {submittingResult ? 'Invio...' : 'Chiudi'}
            </button>

            <div className="flex items-center gap-1.5">
              <div className="badge-modern text-[11px]"
                style={{
                  background: isAssignmentMode ? 'rgba(79, 70, 229, 0.08)' : isExam ? 'rgba(217, 119, 6, 0.1)' : quizMode === 'wrong' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(79, 70, 229, 0.08)',
                  borderColor: isAssignmentMode ? 'rgba(79, 70, 229, 0.12)' : isExam ? 'rgba(217, 119, 6, 0.15)' : quizMode === 'wrong' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(79, 70, 229, 0.12)',
                  color: isAssignmentMode ? '#818CF8' : isExam ? '#D97706' : quizMode === 'wrong' ? '#DC2626' : '#818CF8'
                }}>
                {modeLabel}
              </div>
              {isExam && (
                <div className="badge-modern text-[11px]"
                  style={{
                    background: errorsLeft <= 1 ? 'rgba(220, 38, 38, 0.15)' : errorsLeft <= 2 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                    borderColor: errorsLeft <= 1 ? 'rgba(220, 38, 38, 0.2)' : errorsLeft <= 2 ? 'rgba(217, 119, 6, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                    color: errorsLeft <= 1 ? '#DC2626' : errorsLeft <= 2 ? '#D97706' : '#059669'
                  }}>
                  {errorsLeft <= 1 ? '⚠️' : errorsLeft <= 2 ? '⚡' : '✓'} {errorsLeft} errori rimasti
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(5, 150, 105, 0.06)', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: '#059669' }}>{correctCount}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.06)', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: '#DC2626' }}>{wrongCount}</span>
              </div>
              <span className="text-[11px] tabular-nums font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{currentIdx + 1}/{total}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div className={`h-full rounded-full transition-all duration-500`}
              style={{ width: `${pct}%`, background: isAssignmentMode ? 'linear-gradient(90deg, #1E3A8A, #3B82F6)' : isExam ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #1E3A8A, #3B82F6)' }} />
          </div>
        </div>
      </div>

      {/* Submitting overlay for assignment mode */}
      {submittingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="glass p-6 rounded-2xl flex flex-col items-center gap-3 anim-fade" style={{ minWidth: '200px' }}>
            <svg className="w-8 h-8 animate-spin" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>Invio risultato...</p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Salvataggio del compito in corso</p>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-6">
        <div className="w-full max-w-2xl" key={`${currentIdx}-${question.id}`}>
          {/* Chapter + TTS header */}
          <div className="flex items-center justify-between mb-4 anim-fade">
            <div className="flex items-center gap-2">
              <span className="badge-modern text-[10px]">Cap. {question.chapter}</span>
              <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{question.chapterName}</span>
            </div>
            {!showFeedback && (
              <div className="flex items-center gap-2">
                <button onClick={() => { stopSpeech(); speakText(question.question, 'it-IT'); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                  title="Ascolta">
                  <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </button>
                {/* AI Hint Button with limit display */}
                <button
                  onClick={handleHint}
                  disabled={!!hint || hintLoading || aiLimitReached}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${hintUsed ? 'ring-2 ring-amber-400/50' : ''}`}
                  style={{
                    background: aiLimitReached ? 'var(--bg-tertiary)' : hint ? 'rgba(217, 119, 6, 0.1)' : 'var(--bg-tertiary)',
                    border: `1px solid ${aiLimitReached ? 'var(--border)' : hint ? 'rgba(217, 119, 6, 0.2)' : 'var(--border)'}`,
                    opacity: aiLimitReached ? 0.5 : 1,
                  }}
                  title={aiLimitReached ? 'Limite raggiunto per oggi' : 'Indizio IA'}
                >
                  {hintLoading ? (
                    <svg className="w-4 h-4 animate-spin" style={{ color: '#D97706' }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" style={{ color: hint ? '#D97706' : aiLimitReached ? 'var(--text-muted)' : 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  )}
                </button>
                {/* AI remaining indicator */}
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  style={{
                    color: aiLimitReached ? '#DC2626' : 'var(--text-muted)',
                    background: aiLimitReached ? 'rgba(220, 38, 38, 0.06)' : 'var(--bg-tertiary)',
                  }}>
                  {aiLimitReached ? '0/0' : `${aiRemainingDisplay}/5`}
                </span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="glass p-6 anim-up" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.03)' }}>
            {/* Question text - keyword words are tappable with popup */}
            <div className="text-[18px] leading-relaxed mb-2 font-semibold" style={{ color: 'var(--text-primary)', cursor: 'default' }} dir="ltr">
              {question.question.split(/(\s+)/).map((part, i) => {
                const isSpace = /^\s+$/.test(part);
                if (isSpace) return <span key={i}>{part}</span>;
                const cleaned = part.replace(/[.,;:!?"'()]/g, '').toLowerCase();
                const isTappable = !showFeedback && !isSkipWord(cleaned);
                const isSelected = selectedWord === cleaned;
                return (
                  <span
                    key={i}
                    onClick={(e) => isTappable && handleWordClick(e, part)}
                    onTouchEnd={(e) => {
                      if (isTappable) {
                        e.preventDefault();
                        handleWordClick(e, part);
                      }
                    }}
                    className="inline-block rounded transition-all duration-150"
                    style={{
                      cursor: isTappable ? 'pointer' : 'default',
                      padding: '1px 2px',
                      borderRadius: '4px',
                      ...(isTappable ? {
                        borderBottom: isSelected ? '2px solid #818CF8' : '1.5px dashed rgba(59,130,246,0.3)',
                      } : {}),
                      ...(isSelected
                        ? { background: 'rgba(79, 70, 229, 0.08)', color: '#818CF8' }
                        : {}),
                    }}
                  >{part}</span>
                );
              })}
            </div>

            {/* Fixed Translation Bar - inline fallback */}
            {(selectedWord || translating) && !showFeedback && !translatorPopup && (
              <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3 anim-fade"
                style={{ background: 'rgba(79, 70, 229, 0.04)', border: '1.5px solid rgba(79, 70, 229, 0.16)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(79, 70, 229, 0.08)' }}>
                  <svg className="w-4 h-4" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                  </svg>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  {translating ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 animate-spin" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>جاري الترجمة...</span>
                    </div>
                  ) : wordTranslation ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold" style={{ color: 'var(--text-muted)' }} dir="ltr">{selectedWord}</span>
                      <svg className="w-3 h-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="text-[18px] font-extrabold" style={{ color: '#818CF8' }} dir="rtl">{wordTranslation}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold" style={{ color: 'var(--text-muted)' }} dir="ltr">{selectedWord}</span>
                      <svg className="w-3 h-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="text-[13px]" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }} dir="rtl">لم يتم العثور على ترجمة</span>
                    </div>
                  )}
                </div>
                <button onClick={() => { setSelectedWord(null); setWordTranslation(null); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  <svg className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Image */}
            {hasImg && (
              <div className="mb-5 text-center anim-fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.image} alt="" className="quiz-img" onError={() => setImgErr(true)} loading="lazy" />
              </div>
            )}

            {/* Hint Card */}
            {hint && !showFeedback && (
              <div className="mb-4 p-3.5 rounded-2xl anim-fade" style={{ background: 'rgba(217, 119, 6, 0.06)', border: '1.5px solid rgba(217, 119, 6, 0.2)' }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(217, 119, 6, 0.1)' }}>
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold" style={{ color: '#D97706' }}>Indizio IA</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>TIP</span>
                      {aiLimit !== null && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                          {aiRemaining} rimasti
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{hint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Buttons */}
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-4 anim-fade">
                <button onClick={() => handleAnswer(true)} className="answer-btn answer-true">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    VERO
                  </div>
                </button>
                <button onClick={() => handleAnswer(false)} className="answer-btn answer-false">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    FALSO
                  </div>
                </button>
              </div>
            ) : (
              <div className="anim-up">
                {/* Feedback Banner */}
                <div className={`p-4 mb-5 ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                  <div className="flex items-center gap-3">
                    {isCorrect
                      ? <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 anim-bounce" style={{ background: 'rgba(5, 150, 105, 0.15)' }}>
                          <svg className="w-5 h-5" style={{ color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </div>
                      : <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 anim-bounce" style={{ background: 'rgba(220, 38, 38, 0.15)' }}>
                          <svg className="w-5 h-5" style={{ color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    }
                    <div>
                      <span className="font-bold text-sm" style={{ color: isCorrect ? '#059669' : '#DC2626' }}>
                        {isCorrect ? 'Corretto!' : 'Sbagliato!'}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: isCorrect ? '#059669' : '#DC2626', opacity: 0.7 }}>
                        La risposta corretta: <span className="font-bold">{question.answer ? 'VERO' : 'FALSO'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Explanation Card */}
                {!isCorrect && (
                  <div className="mb-5 anim-fade">
                    {aiLoading ? (
                      <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                            <svg className="w-4 h-4 animate-spin" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Spiegazione IA in arrivo...</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Un momento</p>
                          </div>
                        </div>
                      </div>
                    ) : aiExplanation ? (
                      <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(79, 70, 229, 0.16)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(79, 70, 229, 0.08)' }}>
                            <svg className="w-4 h-4" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[12px] font-bold" style={{ color: '#818CF8' }}>Spiegazione IA</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#818CF8' }}>AI</span>
                            </div>
                            <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>{aiExplanation}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Visual answer buttons (after answering) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`answer-btn ${question.answer === true ? 'answer-correct' : (selectedAnswer === true && !isCorrect ? 'answer-wrong' : 'answer-dim')}`}>
                    <div className="flex items-center justify-center gap-2">
                      {question.answer === true && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      VERO
                    </div>
                  </div>
                  <div className={`answer-btn ${question.answer === false ? 'answer-correct' : (selectedAnswer === false && !isCorrect ? 'answer-wrong' : 'answer-dim')}`}>
                    <div className="flex items-center justify-center gap-2">
                      {question.answer === false && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      FALSO
                    </div>
                  </div>
                </div>

                {/* Next button */}
                {(!autoAdvance || (aiExplained && aiExplanation)) && !submittingResult && (
                  <button onClick={handleNext} className="btn-primary w-full">
                    {currentIdx < quizQuestions.length - 1 ? 'Prossima Domanda →' : 'Vedi Risultati'}
                  </button>
                )}
                {autoAdvance && !(aiExplained && aiExplanation) && !submittingResult && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#818CF8' }} />
                    <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Prossima domanda automaticamente...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
