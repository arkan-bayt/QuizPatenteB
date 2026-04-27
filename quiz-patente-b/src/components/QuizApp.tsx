'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuizStore } from '@/lib/quiz-store';
import { useTheme } from 'next-themes';
import { QuizMode } from '@/lib/types';
import { CHAPTERS } from '@/lib/chapters';

type QuizData = Record<string, Record<string, Array<{ q: string; a: boolean; img?: string }>>>;

// ==========================================
// ICON COMPONENTS
// ==========================================
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
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
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

// ==========================================
// HELPER: slug to readable Italian name
// ==========================================
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ==========================================
// SUBTOPIC PICKER MODAL
// ==========================================
function SubtopicPicker({
  chapterSlug,
  chapterName,
  quizData,
  onStartSubtopics,
  onClose,
}: {
  chapterSlug: string;
  chapterName: string;
  quizData: QuizData;
  onStartSubtopics: (chapterSlug: string, subtopics: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const chapterData = quizData[chapterSlug];
  const subtopics = chapterData ? Object.keys(chapterData) : [];

  const toggleSubtopic = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(subtopics));
  };
  const deselectAll = () => {
    setSelected(new Set());
  };

  const totalQuestions = selected.size > 0
    ? Array.from(selected).reduce((sum, s) => sum + (chapterData[s]?.length || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold">{chapterName}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Seleziona gli argomenti da esercitare</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Select all / Deselect */}
        <div className="flex gap-2 px-5 pt-3 flex-shrink-0">
          <button onClick={selectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            Seleziona tutti
          </button>
          <button onClick={deselectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
            Deseleziona tutti
          </button>
          <span className="text-xs text-muted-foreground self-center ml-auto">
            {selected.size} / {subtopics.length} argomenti
          </span>
        </div>

        {/* Subtopic list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {subtopics.map((subSlug) => {
            const count = chapterData[subSlug]?.length || 0;
            const isSelected = selected.has(subSlug);
            return (
              <button
                key={subSlug}
                onClick={() => toggleSubtopic(subSlug)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-card border hover:bg-accent'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-muted-foreground/30'
                }`}>
                  {isSelected && <CheckIcon className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                    {slugToName(subSlug)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{count} quiz</span>
              </button>
            );
          })}
        </div>

        {/* Start button */}
        <div className="p-5 border-t flex-shrink-0 space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            {totalQuestions > 0 ? `${totalQuestions} domande selezionate` : 'Seleziona almeno un argomento'}
          </div>
          <button
            onClick={() => selected.size > 0 && onStartSubtopics(chapterSlug, Array.from(selected))}
            disabled={selected.size === 0}
            className="w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-4 h-4" />
            Inizia Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MULTI-CHAPTER PICKER MODAL
// ==========================================
function MultiChapterPicker({
  quizData,
  onStartMulti,
  onClose,
}: {
  quizData: QuizData;
  onStartMulti: (chapterSlugs: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleChapter = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(CHAPTERS.map((c) => c.slug)));
  };
  const deselectAll = () => {
    setSelected(new Set());
  };

  const totalQuestions = selected.size > 0
    ? Array.from(selected).reduce((sum, s) => {
        const ch = quizData[s];
        if (!ch) return sum;
        return sum + Object.values(ch).reduce((subSum, qs) => subSum + qs.length, 0);
      }, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold">Seleziona Capitoli</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Scegli piu capitoli per un esame combinato</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Select all / Deselect */}
        <div className="flex gap-2 px-5 pt-3 flex-shrink-0">
          <button onClick={selectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            Seleziona tutti
          </button>
          <button onClick={deselectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
            Deseleziona tutti
          </button>
          <span className="text-xs text-muted-foreground self-center ml-auto">
            {selected.size} / {CHAPTERS.length} capitoli
          </span>
        </div>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {CHAPTERS.map((chapter, index) => {
            const isSelected = selected.has(chapter.slug);
            return (
              <button
                key={chapter.slug}
                onClick={() => toggleChapter(chapter.slug)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-card border hover:bg-accent'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-muted-foreground/30'
                }`}>
                  {isSelected && <CheckIcon className="w-3 h-3" />}
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                    {chapter.name}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{chapter.questionCount}</span>
              </button>
            );
          })}
        </div>

        {/* Start button */}
        <div className="p-5 border-t flex-shrink-0 space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            {totalQuestions > 0 ? `${totalQuestions} domande selezionate` : 'Seleziona almeno un capitolo'}
          </div>
          <button
            onClick={() => selected.size > 0 && onStartMulti(Array.from(selected))}
            disabled={selected.size === 0}
            className="w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-4 h-4" />
            Inizia Esame ({totalQuestions} quiz)
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HOME VIEW
// ==========================================
function HomeView({
  quizData,
  onStartSingle,
  onStartErrors,
  onStartMulti,
  onStartFullExam,
  onStartSubtopics,
}: {
  quizData: QuizData;
  onStartSingle: (chapterSlug: string) => void;
  onStartErrors: (chapterSlug: string) => void;
  onStartMulti: (chapterSlugs: string[]) => void;
  onStartFullExam: () => void;
  onStartSubtopics: (chapterSlug: string, subtopics: string[]) => void;
}) {
  const { chapterProgress } = useQuizStore();

  // Subtopic picker state
  const [subtopicChapter, setSubtopicChapter] = useState<string | null>(null);
  const [showMultiPicker, setShowMultiPicker] = useState(false);

  const totalCorrect = Object.values(chapterProgress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalWrong = Object.values(chapterProgress).reduce((sum, p) => sum + p.wrongCount, 0);
  const totalErrors = Object.values(chapterProgress).reduce((sum, p) => sum + p.errorQuestionIds.length, 0);
  const completedChapters = Object.keys(chapterProgress).length;

  // Count total questions for full exam
  const totalAllQuestions = useMemo(() => {
    return Object.values(quizData).reduce(
      (sum, ch) => sum + Object.values(ch).reduce((s, qs) => s + qs.length, 0),
      0
    );
  }, [quizData]);

  return (
    <div className="space-y-6">
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
          Allenati con tutti i quiz ufficiali per la patente B. Scegli come vuoi esercitarti!
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Multi-chapter exam */}
        <button
          onClick={() => setShowMultiPicker(true)}
          className="bg-card border rounded-xl p-4 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <LayersIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Multi Capitoli</h3>
              <p className="text-xs text-muted-foreground">Scegli 2, 3 o piu capitoli</p>
            </div>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Seleziona capitoli <ArrowRightIcon className="w-3 h-3" />
          </div>
        </button>

        {/* Full exam */}
        <button
          onClick={onStartFullExam}
          className="bg-card border rounded-xl p-4 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <GlobeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Esame Completo</h3>
              <p className="text-xs text-muted-foreground">Tutti i {totalAllQuestions.toLocaleString('it-IT')} quiz</p>
            </div>
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Inizia esame completo <ArrowRightIcon className="w-3 h-3" />
          </div>
        </button>

        {/* Repeat all errors */}
        {totalErrors > 0 && (
          <button
            onClick={() => {
              // Start quiz with all error questions from all chapters
              const allErrorIds = new Set<string>();
              const errorQuestions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];
              let idCounter = 0;

              for (const [chSlug, progress] of Object.entries(chapterProgress)) {
                if (!quizData[chSlug]) continue;
                const errorIds = new Set(progress.errorQuestionIds);
                if (errorIds.size === 0) continue;
                for (const subcats of Object.values(quizData[chSlug])) {
                  for (const q of subcats) {
                    const qId = `${chSlug}-${idCounter++}`;
                    if (errorIds.has(qId)) {
                      errorQuestions.push({ ...q, id: qId });
                    }
                  }
                }
              }

              if (errorQuestions.length > 0) {
                const shuffled = [...errorQuestions].sort(() => Math.random() - 0.5);
                useQuizStore.setState({ questions: shuffled });
                useQuizStore.getState().startQuiz(null, 'errors', 'Tutti gli Errori');
              }
            }}
            className="bg-card border rounded-xl p-4 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                <RotateCcwIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Ripeti Errori</h3>
                <p className="text-xs text-muted-foreground">{totalErrors} domande sbagliate</p>
              </div>
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Ripeti tutti gli errori <ArrowRightIcon className="w-3 h-3" />
            </div>
          </button>
        )}
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
            const subtopicCount = quizData[chapter.slug] ? Object.keys(quizData[chapter.slug]).length : 0;

            return (
              <div
                key={chapter.slug}
                className="bg-card border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Number */}
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

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => onStartSingle(chapter.slug)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors active:scale-95"
                      >
                        <PlayIcon className="w-4 h-4" />
                        Inizia
                      </button>
                      <button
                        onClick={() => setSubtopicChapter(chapter.slug)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors active:scale-95"
                      >
                        <ListIcon className="w-4 h-4" />
                        Argomenti ({subtopicCount})
                      </button>
                      {errorCount > 0 && (
                        <button
                          onClick={() => onStartErrors(chapter.slug)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors active:scale-95"
                        >
                          <RotateCcwIcon className="w-4 h-4" />
                          Errori ({errorCount})
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

      {/* Modals */}
      {subtopicChapter && (
        <SubtopicPicker
          chapterSlug={subtopicChapter}
          chapterName={CHAPTERS.find((c) => c.slug === subtopicChapter)?.name || ''}
          quizData={quizData}
          onStartSubtopics={(slug, subs) => {
            setSubtopicChapter(null);
            onStartSubtopics(slug, subs);
          }}
          onClose={() => setSubtopicChapter(null)}
        />
      )}
      {showMultiPicker && (
        <MultiChapterPicker
          quizData={quizData}
          onStartMulti={(slugs) => {
            setShowMultiPicker(false);
            onStartMulti(slugs);
          }}
          onClose={() => setShowMultiPicker(false)}
        />
      )}
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
    quizTitle,
    currentChapterSlug,
    answerQuestion,
    nextQuestion,
    stopQuiz,
    goToHome,
    setSpeaking,
  } = useQuizStore();

  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentQuestion = questions[currentIndex];

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

  // Image error tracking
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

  // Quiz mode display title
  const getModeLabel = () => {
    if (quizTitle) return quizTitle;
    switch (quizMode) {
      case 'full-exam': return 'Esame Completo';
      case 'multi-chapter': return 'Multi Capitoli';
      case 'errors': return 'Ripeti Errori';
      case 'subtopics': return 'Argomenti Selezionati';
      default: return '';
    }
  };

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
            {getModeLabel()} — {userAnswers.length} domande risposte
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
            onClick={() => useQuizStore.getState().goToHome()}
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
        {getModeLabel() && (
          <div className="text-sm font-medium text-muted-foreground truncate max-w-[200px] sm:max-w-none">
            {getModeLabel()}
          </div>
        )}
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{questions.length}
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
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentView } = useQuizStore();

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

  // Helper: flatten questions from chapter
  const flattenChapter = useCallback((chapterSlug: string, quizData: QuizData) => {
    const chapterData = quizData[chapterSlug];
    if (!chapterData) return [];
    const allQuestions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];
    let idCounter = 0;
    for (const subcat of Object.values(chapterData)) {
      for (const q of subcat) {
        allQuestions.push({ ...q, id: `${chapterSlug}-${idCounter++}` });
      }
    }
    return allQuestions;
  }, []);

  // Start single chapter quiz
  const handleStartSingle = useCallback(
    (chapterSlug: string) => {
      if (!quizData) return;
      const questions = flattenChapter(chapterSlug, quizData);
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      useQuizStore.setState({ questions: shuffled });
      const chName = CHAPTERS.find((c) => c.slug === chapterSlug)?.name || chapterSlug;
      useQuizStore.getState().startQuiz(chapterSlug, 'chapter', chName);
    },
    [quizData, flattenChapter]
  );

  // Start errors quiz for a chapter
  const handleStartErrors = useCallback(
    (chapterSlug: string) => {
      if (!quizData) return;
      const state = useQuizStore.getState();
      const allQuestions = flattenChapter(chapterSlug, quizData);
      const errorIds = new Set(state.chapterProgress[chapterSlug]?.errorQuestionIds || []);
      let questions = allQuestions.filter((q) => errorIds.has(q.id));
      if (questions.length === 0) questions = allQuestions;
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      useQuizStore.setState({ questions: shuffled });
      const chName = CHAPTERS.find((c) => c.slug === chapterSlug)?.name || chapterSlug;
      useQuizStore.getState().startQuiz(chapterSlug, 'errors', `Errori: ${chName}`);
    },
    [quizData, flattenChapter]
  );

  // Start multi-chapter quiz
  const handleStartMulti = useCallback(
    (chapterSlugs: string[]) => {
      if (!quizData) return;
      const allQuestions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];
      for (const slug of chapterSlugs) {
        allQuestions.push(...flattenChapter(slug, quizData));
      }
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      useQuizStore.setState({ questions: shuffled });
      const names = chapterSlugs.map((s) => CHAPTERS.find((c) => c.slug === s)?.name || s).join(', ');
      useQuizStore.getState().startQuiz(null, 'multi-chapter', names);
    },
    [quizData, flattenChapter]
  );

  // Start full exam
  const handleStartFullExam = useCallback(() => {
    if (!quizData) return;
    const allQuestions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];
    for (const chSlug of Object.keys(quizData)) {
      allQuestions.push(...flattenChapter(chSlug, quizData));
    }
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    useQuizStore.setState({ questions: shuffled });
    useQuizStore.getState().startQuiz(null, 'full-exam', `Esame Completo (${allQuestions.length} quiz)`);
  }, [quizData, flattenChapter]);

  // Start subtopics quiz
  const handleStartSubtopics = useCallback(
    (chapterSlug: string, subtopics: string[]) => {
      if (!quizData) return;
      const chapterData = quizData[chapterSlug];
      if (!chapterData) return;
      const questions: Array<{ q: string; a: boolean; img?: string; id: string }> = [];
      let idCounter = 0;
      for (const subSlug of subtopics) {
        const subData = chapterData[subSlug];
        if (!subData) continue;
        for (const q of subData) {
          questions.push({ ...q, id: `${chapterSlug}-${idCounter++}` });
        }
      }
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      useQuizStore.setState({ questions: shuffled });
      const chName = CHAPTERS.find((c) => c.slug === chapterSlug)?.name || chapterSlug;
      const topicNames = subtopics.map(slugToName).join(', ');
      useQuizStore.getState().startQuiz(chapterSlug, 'subtopics', `${chName}: ${topicNames}`);
    },
    [quizData]
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
        {currentView === 'home' && quizData && (
          <HomeView
            quizData={quizData}
            onStartSingle={handleStartSingle}
            onStartErrors={handleStartErrors}
            onStartMulti={handleStartMulti}
            onStartFullExam={handleStartFullExam}
            onStartSubtopics={handleStartSubtopics}
          />
        )}
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
