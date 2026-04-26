'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuizStore } from '@/lib/quiz-store';
import { useTheme } from 'next-themes';
import { QuizQuestion } from '@/lib/types';
import { CHAPTERS } from '@/lib/chapters';

// Icon components
function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function VolumeXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function RotateCcwIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Simple icon map using the name
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen: BookIcon,
  AlertTriangle: AlertTriangleIcon,
  Ban: XCircleIcon,
  ShieldCheck: CheckCircleIcon,
  ArrowRightLeft: ArrowRightIcon,
  Minus: () => <span className="w-6 h-6 flex items-center justify-center text-lg font-bold">—</span>,
  TrafficCone: AlertTriangleIcon,
  MapPin: () => <span className="w-6 h-6 flex items-center justify-center text-lg">📍</span>,
  Construction: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🚧</span>,
  LayoutGrid: () => <span className="w-6 h-6 flex items-center justify-center text-lg">▦</span>,
  Gauge: () => <span className="w-6 h-6 flex items-center justify-center text-lg">⏱</span>,
  MoveHorizontal: ArrowRightIcon,
  Route: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🛣</span>,
  GitBranch: ArrowRightIcon,
  ArrowRight: ArrowRightIcon,
  ParkingCircle: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🅿️</span>,
  Road: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🛤</span>,
  Lightbulb: () => <span className="w-6 h-6 flex items-center justify-center text-lg">💡</span>,
  HardHat: () => <span className="w-6 h-6 flex items-center justify-center text-lg">⛑️</span>,
  CreditCard: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🪪</span>,
  AlertCircle: AlertTriangleIcon,
  Heart: () => <span className="w-6 h-6 flex items-center justify-center text-lg">❤️</span>,
  Scale: () => <span className="w-6 h-6 flex items-center justify-center text-lg">⚖️</span>,
  Leaf: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🍃</span>,
  Wrench: () => <span className="w-6 h-6 flex items-center justify-center text-lg">🔧</span>,
};

function ChapterIcon({ iconName, className }: { iconName: string; className?: string }) {
  const IconComponent = iconMap[iconName] || BookIcon;
  return <IconComponent className={className} />;
}

// ==========================================
// HOME VIEW
// ==========================================
function HomeView({ onStartQuiz }: { onStartQuiz: (slug: string, mode: 'chapter' | 'errors') => void }) {
  const { chapterProgress } = useQuizStore();

  const totalCorrect = Object.values(chapterProgress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalWrong = Object.values(chapterProgress).reduce((sum, p) => sum + p.wrongCount, 0);
  const totalAttempted = totalCorrect + totalWrong;
  const totalErrors = Object.values(chapterProgress).reduce((sum, p) => sum + p.errorQuestionIds.length, 0);
  const completedChapters = Object.keys(chapterProgress).length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-2 shadow-lg">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Quiz Patente B</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Allenati con tutti i quiz ufficiali per la patente B. Scegli un capitolo e inizia a esercitarti!
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCorrect}</div>
          <div className="text-sm text-muted-foreground mt-1">Corrette</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalWrong}</div>
          <div className="text-sm text-muted-foreground mt-1">Sbagliate</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalErrors}</div>
          <div className="text-sm text-muted-foreground mt-1">Da Ripetere</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedChapters}/25</div>
          <div className="text-sm text-muted-foreground mt-1">Capitoli</div>
        </div>
      </div>

      {/* Chapter List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Capitoli</h2>
        <div className="grid gap-3">
          {CHAPTERS.map((chapter, index) => {
            const progress = chapterProgress[chapter.slug];
            const errorCount = progress?.errorQuestionIds.length || 0;
            const attempted = progress?.totalAttempted || 0;
            const pct = attempted > 0 ? Math.round((progress!.correctCount / attempted) * 100) : 0;

            return (
              <div
                key={chapter.slug}
                className="bg-card border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base leading-tight">{chapter.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{chapter.description}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {chapter.questionCount} quiz
                      </span>
                    </div>

                    {/* Progress bar */}
                    {attempted > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{attempted} risposte</span>
                          <span className={pct >= 80 ? 'text-green-600 dark:text-green-400 font-medium' : pct >= 50 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                            {pct}% corrette
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => onStartQuiz(chapter.slug, 'chapter')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors active:scale-95"
                      >
                        <PlayIcon className="w-4 h-4" />
                        Inizia
                      </button>
                      {errorCount > 0 && (
                        <button
                          onClick={() => onStartQuiz(chapter.slug, 'errors')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors active:scale-95"
                        >
                          <RotateCcwIcon className="w-4 h-4" />
                          Ripeti errori ({errorCount})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// QUIZ VIEW
// ==========================================
function QuizView() {
  const {
    questions,
    currentIndex,
    isAnswered,
    selectedAnswer,
    userAnswers,
    isFinished,
    isSpeaking,
    quizMode,
    currentChapterSlug,
    chapterProgress,
    answerQuestion,
    nextQuestion,
    stopQuiz,
    goToHome,
    setSpeaking,
  } = useQuizStore();

  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = currentChapterSlug ? chapterProgress[currentChapterSlug] : null;

  // Stats
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const wrongCount = userAnswers.filter((a) => !a.isCorrect).length;
  const successRate = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

  // TTS
  const speakQuestion = useCallback(() => {
    if (!currentQuestion) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuestion.q);
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;

    // Try to find an Italian voice
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find((v) => v.lang.startsWith('it'));
    if (italianVoice) utterance.voice = italianVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechRef.current = utterance;

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion, isSpeaking, setSpeaking]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  // Derive image error state for current question
  const imageError = imageErrors[currentIndex] || false;
  const handleImageError = () => {
    setImageErrors((prev) => ({ ...prev, [currentIndex]: true }));
  };

  if (!currentQuestion && !isFinished) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Caricamento...</div>
      </div>
    );
  }

  // Finished Screen
  if (isFinished) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
          <TrophyIcon className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Quiz Completato!</h2>
          <p className="text-muted-foreground mt-2">
            {quizMode === 'errors' ? 'Hai ripassato i quiz errati' : `Hai completato il capitolo`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border rounded-xl p-4">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
            <div className="text-sm text-muted-foreground mt-1">Corrette</div>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrongCount}</div>
            <div className="text-sm text-muted-foreground mt-1">Sbagliate</div>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{successRate}%</div>
            <div className="text-sm text-muted-foreground mt-1">Risultato</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => currentChapterSlug && useQuizStore.getState().goToHome()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Torna ai Capitoli
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToHome}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRightIcon className="w-4 h-4 rotate-180" />
          Indietro
        </button>
        <div className="text-sm font-medium text-muted-foreground">
          Domanda {currentIndex + 1} di {questions.length}
        </div>
        <button
          onClick={stopQuiz}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          Termina
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Mini stats */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-4 h-4 text-green-500" />
          <span className="font-medium text-green-600 dark:text-green-400">{correctCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircleIcon className="w-4 h-4 text-red-500" />
          <span className="font-medium text-red-600 dark:text-red-400">{wrongCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TargetIcon className="w-4 h-4 text-emerald-500" />
          <span className="font-medium">{successRate}%</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border rounded-2xl p-5 sm:p-8 space-y-5 shadow-sm">
        {/* Question header with TTS */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-3">
              Domanda {currentIndex + 1}
            </span>
          </div>
          <button
            onClick={speakQuestion}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              isSpeaking
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
            title="Ascolta la domanda"
          >
            {isSpeaking ? <VolumeIcon className="w-5 h-5" /> : <VolumeXIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Image */}
        {currentQuestion.img && !imageError && (
          <div className="flex justify-center">
            <div className="relative bg-white rounded-xl p-3 border shadow-sm">
              <img
                src={currentQuestion.img}
                alt="Segnale stradale"
                className="h-32 sm:h-40 w-auto object-contain"
                onError={handleImageError}
              />
            </div>
          </div>
        )}

        {/* Question Text */}
        <p className="text-lg sm:text-xl font-medium leading-relaxed">{currentQuestion.q}</p>

        {/* Answer feedback */}
        {isAnswered && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
              selectedAnswer === currentQuestion.a
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {selectedAnswer === currentQuestion.a ? (
              <>
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span>Corretto! La risposta esatta e {currentQuestion.a ? 'VERO' : 'FALSO'}.</span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span>Sbagliato! La risposta corretta era {currentQuestion.a ? 'VERO' : 'FALSO'}.</span>
              </>
            )}
          </div>
        )}

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answerQuestion(true)}
            disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all duration-200 active:scale-95 ${
              isAnswered
                ? currentQuestion.a === true
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 ring-2 ring-green-300 dark:ring-green-700'
                  : selectedAnswer === true
                    ? 'bg-red-500 text-white opacity-70 ring-2 ring-red-300 dark:ring-red-700'
                    : 'bg-muted text-muted-foreground opacity-50'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30'
            }`}
          >
            VERO
          </button>
          <button
            onClick={() => answerQuestion(false)}
            disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all duration-200 active:scale-95 ${
              isAnswered
                ? currentQuestion.a === false
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-300 dark:ring-red-700'
                  : selectedAnswer === false
                    ? 'bg-red-500 text-white opacity-70 ring-2 ring-red-300 dark:ring-red-700'
                    : 'bg-muted text-muted-foreground opacity-50'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30'
            }`}
          >
            FALSO
          </button>
        </div>

        {/* Next Button */}
        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full py-3.5 rounded-xl bg-foreground text-background hover:opacity-90 font-medium transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {currentIndex + 1 >= questions.length ? 'Vedi Risultati' : 'Prossima Domanda'}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
export default function QuizApp() {
  const { theme, setTheme } = useTheme();
  const [quizData, setQuizData] = useState<Record<string, Record<string, Array<{ q: string; a: boolean; img?: string }>>> | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentView, startQuiz, resetQuiz } = useQuizStore();

  const mounted = quizData !== null || !loading;

  // Load quiz data
  useEffect(() => {
    fetch('/quizData.json')
      .then((res) => res.json())
      .then((data) => {
        setQuizData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quiz data:', err);
        setLoading(false);
      });
  }, []);

  const handleStartQuiz = useCallback(
    (chapterSlug: string, mode: 'chapter' | 'errors') => {
      if (!quizData[chapterSlug]) return;

      const state = useQuizStore.getState();

      let questions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];

      // Flatten all questions from the chapter
      const chapterData = quizData[chapterSlug];
      let allQuestions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];

      let idCounter = 0;
      for (const subcat of Object.values(chapterData)) {
        for (const q of subcat) {
          allQuestions.push({
            ...q,
            id: `${chapterSlug}-${idCounter++}`,
          });
        }
      }

      if (mode === 'errors') {
        // Filter to only error questions
        const errorIds = new Set(state.chapterProgress[chapterSlug]?.errorQuestionIds || []);
        questions = allQuestions.filter((q) => errorIds.has(q.id));
        if (questions.length === 0) {
          // No errors, show all questions instead
          questions = allQuestions;
        }
      } else {
        questions = allQuestions;
      }

      // Shuffle questions for variety
      questions = [...questions].sort(() => Math.random() - 0.5);

      // Set questions in store and start quiz
      useQuizStore.setState({ questions });
      startQuiz(chapterSlug, mode);
    },
    [quizData, startQuiz]
  );

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg animate-pulse">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <p className="text-muted-foreground">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          {currentView !== 'home' ? (
            <button
              onClick={() => useQuizStore.getState().goToHome()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              Quiz Patente B
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="font-bold text-base">Quiz Patente B</span>
            </div>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
            title={theme === 'dark' ? 'Modalita chiara' : 'Modalita scura'}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentView === 'home' && <HomeView onStartQuiz={handleStartQuiz} />}
        {currentView === 'quiz' && <QuizView />}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Quiz Patente B — Dati da{' '}
          <a
            href="https://github.com/Ed0ardo/QuizPatenteB"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Ed0ardo/QuizPatenteB
          </a>
          {' '}• 7.139 quiz ufficiali
        </div>
      </footer>
    </div>
  );
}
