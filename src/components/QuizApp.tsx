'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuizStore, LEVEL_THRESHOLDS } from '@/lib/quiz-store';
import { useTheme } from 'next-themes';
import { QuizMode, QuizData, QuizQuestion } from '@/lib/types';
import { CHAPTERS } from '@/lib/chapters';
import { useAuth } from '@/contexts/AuthContext';

// ==========================================
// ICON COMPONENTS (inline SVGs)
// ==========================================
function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconVolume({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function IconVolumeX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
  );
}
function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconRotateCcw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
function IconCheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconXCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
function IconTrophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function IconTarget({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconLayers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconTimer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><line x1="6" y1="19" x2="6.01" y2="19" /><line x1="18" y1="19" x2="18.01" y2="19" />
    </svg>
  );
}
function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconLogOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function IconStats({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  );
}
function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconFlame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
function IconBarChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconZap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ==========================================
// HELPERS
// ==========================================
function slugToName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ==========================================
// SUBTOPIC PICKER MODAL
// ==========================================
function SubtopicPicker({
  chapterSlug, chapterName, quizData, onStartSubtopics, onClose,
}: {
  chapterSlug: string; chapterName: string; quizData: QuizData;
  onStartSubtopics: (slug: string, subs: string[]) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const chapterData = quizData[chapterSlug];
  const subtopics = chapterData ? Object.keys(chapterData) : [];

  const toggle = (s: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  };
  const selectAll = () => setSelected(new Set(subtopics));
  const deselectAll = () => setSelected(new Set());
  const totalQ = selected.size > 0 ? Array.from(selected).reduce((sum, s) => sum + (chapterData[s]?.length || 0), 0) : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div><h3 className="text-lg font-bold">{chapterName}</h3><p className="text-sm text-muted-foreground mt-0.5">Seleziona gli argomenti</p></div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent transition-colors"><IconX className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 px-5 pt-3 flex-shrink-0">
          <button onClick={selectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">Seleziona tutti</button>
          <button onClick={deselectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">Deseleziona tutti</button>
          <span className="text-xs text-muted-foreground self-center ml-auto">{selected.size}/{subtopics.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2 max-h-96">
          {subtopics.map(subSlug => {
            const count = chapterData[subSlug]?.length || 0;
            const isSel = selected.has(subSlug);
            return (
              <button key={subSlug} onClick={() => toggle(subSlug)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isSel ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-card border hover:bg-accent'}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isSel ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30'}`}>
                  {isSel && <IconCheck className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0"><div className={`text-sm font-medium ${isSel ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>{slugToName(subSlug)}</div></div>
                <span className="text-xs text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="p-5 border-t flex-shrink-0 space-y-2">
          <div className="text-sm text-muted-foreground text-center">{totalQ > 0 ? `${totalQ} domande` : 'Seleziona almeno un argomento'}</div>
          <button onClick={() => selected.size > 0 && onStartSubtopics(chapterSlug, Array.from(selected))} disabled={selected.size === 0}
            className="w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-40 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
            <IconPlay className="w-4 h-4" /> Inizia Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MULTI-CHAPTER PICKER MODAL
// ==========================================
function MultiChapterPicker({ quizData, onStartMulti, onClose }: {
  quizData: QuizData; onStartMulti: (slugs: string[]) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (s: string) => { setSelected(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; }); };
  const selectAll = () => setSelected(new Set(CHAPTERS.map(c => c.slug)));
  const deselectAll = () => setSelected(new Set());
  const totalQ = selected.size > 0 ? Array.from(selected).reduce((sum, s) => sum + Object.values(quizData[s] || {}).reduce((sub, qs) => sub + qs.length, 0), 0) : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div><h3 className="text-lg font-bold">Seleziona Capitoli</h3><p className="text-sm text-muted-foreground mt-0.5">Esame combinato</p></div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent transition-colors"><IconX className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 px-5 pt-3 flex-shrink-0">
          <button onClick={selectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">Tutti</button>
          <button onClick={deselectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted">Nessuno</button>
          <span className="text-xs text-muted-foreground self-center ml-auto">{selected.size}/{CHAPTERS.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2 max-h-96">
          {CHAPTERS.map((ch, i) => {
            const isSel = selected.has(ch.slug);
            return (
              <button key={ch.slug} onClick={() => toggle(ch.slug)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isSel ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-card border hover:bg-accent'}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isSel ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30'}`}>
                  {isSel && <IconCheck className="w-3 h-3" />}
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 w-5">{i + 1}</span>
                <span className="flex-1 text-sm font-medium">{ch.name}</span>
                <span className="text-xs text-muted-foreground">{ch.questionCount}</span>
              </button>
            );
          })}
        </div>
        <div className="p-5 border-t flex-shrink-0 space-y-2">
          <div className="text-sm text-muted-foreground text-center">{totalQ > 0 ? `${totalQ} domande` : 'Seleziona almeno un capitolo'}</div>
          <button onClick={() => selected.size > 0 && onStartMulti(Array.from(selected))} disabled={selected.size === 0}
            className="w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-40 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
            <IconPlay className="w-4 h-4" /> Inizia ({totalQ} quiz)
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// NAVBAR
// ==========================================
function Navbar() {
  const { currentView, setView, xp, level, levelName, levelIcon, streak } = useQuizStore();
  const { user, logout: authLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentLevel = LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
  const xpProgress = nextLevel ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => setView('home')} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          </div>
          <span className="font-bold text-sm hidden sm:block">Quiz Patente B</span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {(['home', 'exam', 'errors', 'stats'] as const).map(view => {
            const labels: Record<string, { label: string; icon: React.ReactNode }> = {
              home: { label: 'Capitoli', icon: <IconHome className="w-4 h-4" /> },
              exam: { label: 'Esame', icon: <IconTimer className="w-4 h-4" /> },
              errors: { label: 'Errori', icon: <IconAlertTriangle className="w-4 h-4" /> },
              stats: { label: 'Statistiche', icon: <IconStats className="w-4 h-4" /> },
            };
            const v = labels[view];
            const isActive = currentView === view;
            return (
              <button key={view} onClick={() => setView(view)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                {v.icon}
                <span className="hidden sm:block">{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak */}
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-medium text-orange-500 dark:text-orange-400">
              <IconFlame className="w-4 h-4" />
              <span className="hidden sm:block">{streak}</span>
            </div>
          )}

          {/* Level badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-xs">
            <span>{levelIcon}</span>
            <span className="font-medium">Lv.{level}</span>
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
            </button>
          )}

          {/* Auth */}
          {user ? (
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                <IconUser className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-xl shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-3 py-2 border-b mb-1">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground mb-1">
                  <span>{levelIcon}</span>
                  <span>{levelName}</span>
                  <span className="ml-auto font-medium">{xp} XP</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, xpProgress)}%` }} />
                </div>
                <button onClick={authLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <IconLogOut className="w-4 h-4" /> Esci
                </button>
              </div>
            </div>
          ) : (
            <div className="w-8" /> 
          )}
        </div>
      </div>

      {/* XP bar on mobile */}
      <div className="sm:hidden px-4 pb-1">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
          <span>{levelIcon} {levelName}</span>
          <span>{xp} XP</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, xpProgress)}%` }} />
        </div>
      </div>
    </nav>
  );
}

// ==========================================
// LOGIN VIEW
// ==========================================
function LoginView() {
  const { login, setView } = useQuizStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Compila tutti i campi'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) setView('home');
      else setError('Email o password non validi');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <IconUser className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Accedi</h1>
          <p className="text-muted-foreground text-sm">Accedi al tuo account per continuare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-2xl p-6">
          {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@esempio.it"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="La tua password"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all active:scale-[0.98] disabled:opacity-60">
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Non hai un account?{' '}
          <button onClick={() => setView('register')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Registrati
          </button>
        </p>

        <button onClick={() => setView('home')} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          Torna alla Home
        </button>
      </div>
    </div>
  );
}

// ==========================================
// REGISTER VIEW
// ==========================================
function RegisterView() {
  const { register, setView } = useQuizStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Compila tutti i campi'); return; }
    if (password.length < 4) { setError('Password minimo 4 caratteri'); return; }
    if (password !== confirm) { setError('Le password non coincidono'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = register(name, email, password);
      if (ok) setView('home');
      else setError('Email gia registrata');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <IconShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Registrati</h1>
          <p className="text-muted-foreground text-sm">Crea il tuo account gratis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-2xl p-6">
          {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Il tuo nome"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@esempio.it"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 4 caratteri"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Conferma Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Ripeti la password"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all active:scale-[0.98] disabled:opacity-60">
            {loading ? 'Registrazione...' : 'Crea Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Hai gia un account?{' '}
          <button onClick={() => setView('login')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Accedi
          </button>
        </p>

        <button onClick={() => setView('home')} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          Torna alla Home
        </button>
      </div>
    </div>
  );
}

// ==========================================
// HOME VIEW
// ==========================================
function HomeView({ quizData, onStartSingle, onStartErrors, onStartMulti, onStartFullExam, onStartSubtopics }: {
  quizData: QuizData;
  onStartSingle: (slug: string) => void;
  onStartErrors: (slug: string) => void;
  onStartMulti: (slugs: string[]) => void;
  onStartFullExam: () => void;
  onStartSubtopics: (slug: string, subs: string[]) => void;
}) {
  const { chapterProgress, getTotalCorrect, getTotalWrong, getTotalErrors, xp, level, levelName, levelIcon, streak, totalStudyDays } = useQuizStore();
  const [subtopicChapter, setSubtopicChapter] = useState<string | null>(null);
  const [showMultiPicker, setShowMultiPicker] = useState(false);

  const totalCorrect = getTotalCorrect();
  const totalWrong = getTotalWrong();
  const totalErrors = getTotalErrors();
  const completedChapters = Object.keys(chapterProgress).length;
  const totalAllQuestions = useMemo(() => Object.values(quizData).reduce((s, ch) => s + Object.values(ch).reduce((ss, qs) => ss + qs.length, 0), 0), [quizData]);
  const accuracy = Object.values(chapterProgress).reduce((s, p) => s + p.totalAttempted, 0) > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-2 shadow-lg">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Quiz Patente B</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {totalAllQuestions.toLocaleString('it-IT')} quiz ufficiali per prepararti all&apos;esame
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
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{accuracy}%</div>
          <div className="text-sm text-muted-foreground mt-1">Precisione</div>
        </div>
      </div>

      {/* Level + XP card */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelIcon}</span>
            <div>
              <div className="text-sm font-bold">Livello {level} - {levelName}</div>
              <div className="text-xs text-muted-foreground">{xp} XP / {streak > 1 ? `${streak} giorni consecutivi 🔥` : `${totalStudyDays} giorni di studio`}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{xp} XP</div>
            <div className="text-[10px] text-muted-foreground">+10 corretta / -5 errata</div>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          {(() => {
            const cl = LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
            const nl = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
            const pct = nl ? ((xp - cl.minXP) / (nl.minXP - cl.minXP)) * 100 : 100;
            return <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%` }} />;
          })()}
        </div>
        {(() => {
          const nl = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
          return nl ? <div className="text-[10px] text-muted-foreground mt-1 text-right">Prossimo: {nl.name} ({nl.minXP} XP)</div> : <div className="text-[10px] text-muted-foreground mt-1 text-right">Livello massimo!</div>;
        })()}
      </div>

      {/* Continue where you left off */}
      {(() => {
        const entries = Object.entries(chapterProgress);
        if (entries.length === 0) return null;
        const lastAccessed = entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed)[0];
        const lastChapter = CHAPTERS.find(c => c.slug === lastAccessed[0]);
        if (!lastChapter) return null;
        return (
          <button
            onClick={() => onStartSingle(lastAccessed[0])}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-4 hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-bold text-sm">Continua da dove hai lasciato</div>
              <div className="text-xs text-emerald-100 truncate">{lastChapter.name} — {lastAccessed[1].totalAttempted} risposte</div>
            </div>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        );
      })()}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={() => setShowMultiPicker(true)}
          className="bg-card border rounded-xl p-4 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm"><IconLayers className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-sm">Multi Capitoli</h3><p className="text-xs text-muted-foreground">Scegli capitoli</p></div>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Seleziona <IconArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button onClick={onStartFullExam}
          className="bg-card border rounded-xl p-4 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-sm"><IconTimer className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-sm">Esame Simulato</h3><p className="text-xs text-muted-foreground">30 domande, 20 min</p></div>
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Inizia esame <IconArrowRight className="w-3 h-3" />
          </div>
        </button>

        {totalErrors > 0 ? (
          <button onClick={() => {
            const allErrorIds = new Set<string>();
            const errorQuestions: QuizQuestion[] = [];
            let idCounter = 0;
            for (const [chSlug, progress] of Object.entries(chapterProgress)) {
              if (!quizData[chSlug]) continue;
              const errorIds = new Set(progress.errorQuestionIds);
              if (errorIds.size === 0) continue;
              for (const subcats of Object.values(quizData[chSlug])) {
                for (const q of subcats) {
                  const qId = `${chSlug}-${idCounter++}`;
                  if (errorIds.has(qId)) errorQuestions.push({ ...q, id: qId });
                }
              }
            }
            if (errorQuestions.length > 0) {
              useQuizStore.getState().startQuiz(null, 'errors', 'Tutti gli Errori', shuffleArray(errorQuestions));
            }
          }}
          className="bg-card border rounded-xl p-4 hover:shadow-md transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm"><IconRotateCcw className="w-5 h-5" /></div>
              <div><h3 className="font-semibold text-sm">Ripeti Errori</h3><p className="text-xs text-muted-foreground">{totalErrors} da ripetere</p></div>
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Ripeti <IconArrowRight className="w-3 h-3" />
            </div>
          </button>
        ) : (
          <button disabled className="bg-card border rounded-xl p-4 opacity-40 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"><IconRotateCcw className="w-5 h-5" /></div>
              <div><h3 className="font-semibold text-sm">Nessun Errore</h3><p className="text-xs text-muted-foreground">Continua a studiare!</p></div>
            </div>
          </button>
        )}
      </div>

      {/* Chapter List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">25 Capitoli</h2>
          <span className="text-sm text-muted-foreground">{completedChapters}/25 esercitati</span>
        </div>
        <div className="grid gap-3">
          {CHAPTERS.map((chapter, index) => {
            const progress = chapterProgress[chapter.slug];
            const errorCount = progress?.errorQuestionIds.length || 0;
            const attempted = progress?.totalAttempted || 0;
            const pct = attempted > 0 ? Math.round((progress!.correctCount / attempted) * 100) : 0;
            const subtopicCount = quizData[chapter.slug] ? Object.keys(quizData[chapter.slug]).length : 0;

            return (
              <div key={chapter.slug} className="bg-card border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base leading-tight">{chapter.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{chapter.description}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">{chapter.questionCount}</span>
                    </div>
                    {attempted > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{attempted} risposte</span>
                          <span className={pct >= 80 ? 'text-green-600 dark:text-green-400 font-medium' : pct >= 50 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={() => onStartSingle(chapter.slug)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors active:scale-95">
                        <IconPlay className="w-4 h-4" /> Inizia
                      </button>
                      <button onClick={() => setSubtopicChapter(chapter.slug)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors active:scale-95">
                        <IconList className="w-4 h-4" /> Argomenti ({subtopicCount})
                      </button>
                      {errorCount > 0 && (
                        <button onClick={() => onStartErrors(chapter.slug)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors active:scale-95">
                          <IconRotateCcw className="w-4 h-4" /> Errori ({errorCount})
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
          chapterName={CHAPTERS.find(c => c.slug === subtopicChapter)?.name || ''}
          quizData={quizData}
          onStartSubtopics={(slug, subs) => { setSubtopicChapter(null); onStartSubtopics(slug, subs); }}
          onClose={() => setSubtopicChapter(null)}
        />
      )}
      {showMultiPicker && (
        <MultiChapterPicker
          quizData={quizData}
          onStartMulti={(slugs) => { setShowMultiPicker(false); onStartMulti(slugs); }}
          onClose={() => setShowMultiPicker(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// QUIZ VIEW (Endless mode)
// ==========================================
function QuizView() {
  const store = useQuizStore();
  const { questions, currentIndex, isAnswered, selectedAnswer, userAnswers, isFinished, isSpeaking, quizMode, quizTitle, answerQuestion, nextQuestion, stopQuiz, goToHome, setSpeaking } = store;
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const wrongCount = userAnswers.filter(a => !a.isCorrect).length;
  const successRate = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

  // TTS
  const speakQuestion = useCallback(() => {
    if (!currentQuestion) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(currentQuestion.q);
    utt.lang = 'it-IT'; utt.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith('it'));
    if (itVoice) utt.voice = itVoice;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }, [currentQuestion, isSpeaking, setSpeaking]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => { window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener('voiceschanged', handler); };
  }, []);

  // Auto-advance after answer
  useEffect(() => {
    if (isAnswered && !isFinished) {
      timerRef.current = setTimeout(() => nextQuestion(), 1500);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [isAnswered, isFinished, nextQuestion]);

  const imageError = imageErrors[currentIndex] || false;
  const handleImageError = () => setImageErrors(prev => ({ ...prev, [currentIndex]: true }));

  // Endless mode: loop when finished
  useEffect(() => {
    if (isFinished && quizMode !== 'exam') {
      // Reshuffle and restart
      const shuffled = shuffleArray(questions);
      useQuizStore.setState({ questions: shuffled, currentIndex: 0, userAnswers: [], isAnswered: false, selectedAnswer: null, isFinished: false });
    }
  }, [isFinished, quizMode, questions]);

  if (!currentQuestion) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-pulse text-muted-foreground">Caricamento...</div></div>;
  }

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

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={goToHome} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <IconArrowLeft className="w-4 h-4" /> Indietro
        </button>
        {getModeLabel() && <div className="text-sm font-medium text-muted-foreground truncate max-w-[200px] sm:max-w-none">{getModeLabel()}</div>}
        <div className="text-sm font-medium text-muted-foreground">{currentIndex + 1}/{questions.length}</div>
        <button onClick={stopQuiz} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Termina</button>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1.5"><IconCheckCircle className="w-4 h-4 text-green-500" /><span className="font-medium text-green-600 dark:text-green-400">{correctCount}</span></div>
        <div className="flex items-center gap-1.5"><IconXCircle className="w-4 h-4 text-red-500" /><span className="font-medium text-red-600 dark:text-red-400">{wrongCount}</span></div>
        <div className="flex items-center gap-1.5"><IconTarget className="w-4 h-4 text-emerald-500" /><span className="font-medium">{successRate}%</span></div>
      </div>

      <div className="bg-card border rounded-2xl p-5 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Domanda {currentIndex + 1}</span>
          <button onClick={speakQuestion}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all active:scale-90 ${isSpeaking ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-muted hover:bg-accent text-muted-foreground'}`}
            title="Ascolta">
            {isSpeaking ? <IconVolume className="w-5 h-5" /> : <IconVolumeX className="w-5 h-5" />}
          </button>
        </div>

        {currentQuestion.img && !imageError && (
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <img src={currentQuestion.img} alt="Segnale" className="h-32 sm:h-40 w-auto object-contain" onError={handleImageError} />
            </div>
          </div>
        )}

        <p className="text-lg sm:text-xl font-medium leading-relaxed">{currentQuestion.q}</p>

        {isAnswered && (
          <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${selectedAnswer === currentQuestion.a
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
            {selectedAnswer === currentQuestion.a
              ? <><IconCheckCircle className="w-5 h-5 flex-shrink-0" /><span>Corretto! La risposta esatta e {currentQuestion.a ? 'VERO' : 'FALSO'}.</span></>
              : <><IconXCircle className="w-5 h-5 flex-shrink-0" /><span>Sbagliato! La risposta corretta era {currentQuestion.a ? 'VERO' : 'FALSO'}.</span></>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => answerQuestion(true)} disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
              isAnswered
                ? (currentQuestion.a ? 'bg-green-500 text-white ring-2 ring-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-400 border border-red-200 dark:border-red-800')
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}>
            VERO
          </button>
          <button onClick={() => answerQuestion(false)} disabled={isAnswered}
            className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
              isAnswered
                ? (!currentQuestion.a ? 'bg-red-500 text-white ring-2 ring-red-400' : 'bg-green-100 dark:bg-green-900/20 text-green-400 border border-green-200 dark:border-green-800')
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}>
            FALSO
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXAM VIEW (30 questions, 20 min)
// ==========================================
function ExamView() {
  const store = useQuizStore();
  const { questions, currentIndex, isAnswered, selectedAnswer, userAnswers, isSpeaking, examTimeRemaining, examTimerActive, answerQuestion, nextQuestion, goToHome, setSpeaking, submitExam } = store;
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const wrongCount = userAnswers.filter(a => !a.isCorrect).length;

  // Timer
  useEffect(() => {
    if (examTimerActive && examTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        const t = useQuizStore.getState().examTimeRemaining;
        if (t <= 1) {
          useQuizStore.getState().submitExam();
        } else {
          useQuizStore.setState({ examTimeRemaining: t - 1 });
        }
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [examTimerActive, examTimeRemaining]);

  // Auto-advance after answer
  useEffect(() => {
    if (isAnswered) {
      autoAdvanceRef.current = setTimeout(() => nextQuestion(), 1200);
      return () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); };
    }
  }, [isAnswered, nextQuestion]);

  // TTS
  const speakQuestion = useCallback(() => {
    if (!currentQuestion) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(currentQuestion.q);
    utt.lang = 'it-IT'; utt.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith('it'));
    if (itVoice) utt.voice = itVoice;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }, [currentQuestion, isSpeaking, setSpeaking]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => { window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener('voiceschanged', handler); };
  }, []);

  const imageError = imageErrors[currentIndex] || false;
  const handleImageError = () => setImageErrors(prev => ({ ...prev, [currentIndex]: true }));

  const timePercent = (examTimeRemaining / (20 * 60)) * 100;
  const isTimeLow = examTimeRemaining < 120;

  if (!currentQuestion && !store.isFinished) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-pulse text-muted-foreground">Caricamento...</div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Timer Header */}
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={() => { useQuizStore.setState({ examTimerActive: false }); submitExam(); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <IconArrowLeft className="w-4 h-4 inline mr-1" /> Esci
          </button>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Tempo rimanente</div>
            <div className={`text-2xl font-bold font-mono ${isTimeLow ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
              {formatTime(examTimeRemaining)}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {currentIndex + 1}/{questions.length}
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isTimeLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${timePercent}%` }} />
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">✓ {correctCount}</span>
          <span className="text-red-600 dark:text-red-400 font-medium">✗ {wrongCount}</span>
          <span className="text-muted-foreground">Restanti: {questions.length - currentIndex - (isAnswered ? 1 : 0)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border rounded-2xl p-5 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Domanda {currentIndex + 1}</span>
          <button onClick={speakQuestion}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all active:scale-90 ${isSpeaking ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-muted hover:bg-accent text-muted-foreground'}`}>
            {isSpeaking ? <IconVolume className="w-5 h-5" /> : <IconVolumeX className="w-5 h-5" />}
          </button>
        </div>

        {currentQuestion?.img && !imageError && (
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <img src={currentQuestion.img} alt="Segnale" className="h-32 sm:h-40 w-auto object-contain" onError={handleImageError} />
            </div>
          </div>
        )}

        <p className="text-lg sm:text-xl font-medium leading-relaxed">{currentQuestion?.q}</p>

        {isAnswered && currentQuestion && (
          <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${selectedAnswer === currentQuestion.a
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
            {selectedAnswer === currentQuestion.a
              ? <><IconCheckCircle className="w-5 h-5 flex-shrink-0" /><span>Corretto!</span></>
              : <><IconXCircle className="w-5 h-5 flex-shrink-0" /><span>Sbagliato! Era {currentQuestion.a ? 'VERO' : 'FALSO'}.</span></>}
          </div>
        )}

        {currentQuestion && (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => answerQuestion(true)} disabled={isAnswered}
              className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
                isAnswered
                  ? (currentQuestion.a ? 'bg-green-500 text-white ring-2 ring-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-400')
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}>VERO</button>
            <button onClick={() => answerQuestion(false)} disabled={isAnswered}
              className={`py-4 px-6 rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-60 ${
                isAnswered
                  ? (!currentQuestion.a ? 'bg-red-500 text-white ring-2 ring-red-400' : 'bg-green-100 dark:bg-green-900/20 text-green-400')
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}>FALSO</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// EXAM RESULT VIEW
// ==========================================
function ExamResultView() {
  const { lastExamResult, goToHome, setView } = useQuizStore();
  if (!lastExamResult) return null;
  const r = lastExamResult;

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-8">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full shadow-lg ${r.passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'} text-white`}>
        {r.passed ? <IconTrophy className="w-12 h-12" /> : <IconXCircle className="w-12 h-12" />}
      </div>

      <div>
        <h2 className="text-2xl font-bold">{r.passed ? 'Esame Superato!' : 'Esame Non Superato'}</h2>
        <p className="text-muted-foreground mt-2">{r.title} — {r.totalQuestions} domande</p>
      </div>

      <div className="bg-card border rounded-2xl p-6 space-y-4">
        <div className="text-5xl font-bold">{r.score}%</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background rounded-xl p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{r.correctAnswers}</div>
            <div className="text-xs text-muted-foreground">Corrette</div>
          </div>
          <div className="bg-background rounded-xl p-3">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{r.wrongAnswers}</div>
            <div className="text-xs text-muted-foreground">Sbagliate</div>
          </div>
          <div className="bg-background rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatTime(r.timeSpent)}</div>
            <div className="text-xs text-muted-foreground">Tempo</div>
          </div>
        </div>

        {!r.passed && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
            Per superare l&apos;esame servono almeno l&apos;80% di risposte corrette e massimo 4 errori.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => setView('home')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors">
          <IconHome className="w-5 h-5" /> Torna alla Home
        </button>
        <button onClick={() => setView('exam')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border hover:bg-accent font-medium transition-colors">
          <IconRotateCcw className="w-5 h-5" /> Riprova
        </button>
      </div>
    </div>
  );
}

// ==========================================
// STATS VIEW
// ==========================================
function StatsView({ quizData }: { quizData: QuizData }) {
  const { chapterProgress, xp, level, levelName, levelIcon, streak, totalStudyDays, examResults, getTotalCorrect, getTotalWrong, getTotalErrors, getAccuracy } = useQuizStore();
  const totalCorrect = getTotalCorrect();
  const totalWrong = getTotalWrong();
  const totalErrors = getTotalErrors();
  const accuracy = getAccuracy();
  const totalAttempted = totalCorrect + totalWrong;

  const chapterStats = useMemo(() => {
    return CHAPTERS.map(ch => {
      const p = chapterProgress[ch.slug];
      return {
        ...ch,
        attempted: p?.totalAttempted || 0,
        correct: p?.correctCount || 0,
        wrong: p?.wrongCount || 0,
        errors: p?.errorQuestionIds.length || 0,
        pct: p && p.totalAttempted > 0 ? Math.round((p.correctCount / p.totalAttempted) * 100) : 0,
      };
    }).sort((a, b) => b.pct - a.pct);
  }, [chapterProgress]);

  const passedExams = examResults.filter(r => r.passed).length;
  const avgScore = examResults.length > 0 ? Math.round(examResults.reduce((s, r) => s + r.score, 0) / examResults.length) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Statistiche</h1>
        <p className="text-muted-foreground">Il tuo progresso verso la patente B</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalCorrect}</div>
          <div className="text-sm text-muted-foreground mt-1">Corrette</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalWrong}</div>
          <div className="text-sm text-muted-foreground mt-1">Sbagliate</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{accuracy}%</div>
          <div className="text-sm text-muted-foreground mt-1">Precisione</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalErrors}</div>
          <div className="text-sm text-muted-foreground mt-1">Errori</div>
        </div>
      </div>

      {/* Gamification Card */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><IconZap className="w-5 h-5 text-emerald-500" /> Livello e XP</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">{levelIcon}</div>
            <div className="text-sm font-bold">Lv.{level} {levelName}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{xp}</div>
            <div className="text-sm text-muted-foreground">Punti XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{streak}</div>
            <div className="text-sm text-muted-foreground">Giorni consecutivi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalStudyDays}</div>
            <div className="text-sm text-muted-foreground">Giorni totali</div>
          </div>
        </div>
      </div>

      {/* Exam History */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><IconBarChart className="w-5 h-5 text-emerald-500" /> Esami Simulati</h3>
        {examResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconTimer className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Nessun esame simulato ancora</p>
            <p className="text-xs mt-1">Prova l&apos;esame simulato dalla home!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="text-xl font-bold">{examResults.length}</div><div className="text-xs text-muted-foreground">Esami</div></div>
              <div><div className="text-xl font-bold text-green-600">{passedExams}</div><div className="text-xs text-muted-foreground">Superati</div></div>
              <div><div className="text-xl font-bold text-emerald-600">{avgScore}%</div><div className="text-xs text-muted-foreground">Media</div></div>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {examResults.slice(0, 10).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-background text-sm">
                  <div className="flex items-center gap-2">
                    {r.passed ? <IconCheckCircle className="w-4 h-4 text-green-500" /> : <IconXCircle className="w-4 h-4 text-red-500" />}
                    <span>{new Date(r.date).toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{formatTime(r.timeSpent)}</span>
                    <span className={`font-bold ${r.score >= 80 ? 'text-green-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{r.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chapter Breakdown */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><IconList className="w-5 h-5 text-emerald-500" /> Progresso per Capitolo</h3>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {chapterStats.map((ch, i) => (
            <div key={ch.slug} className="flex items-center gap-3 p-3 rounded-lg bg-background">
              <span className="w-6 text-xs font-bold text-muted-foreground text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium truncate">{ch.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0 ml-2">
                    <span>{ch.attempted}</span>
                    <span className={ch.errors > 0 ? 'text-amber-500' : 'text-green-500'}>{ch.errors} err</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${ch.attempted === 0 ? 'bg-muted' : ch.pct >= 80 ? 'bg-green-500' : ch.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${ch.attempted > 0 ? ch.pct : 0}%` }} />
                </div>
              </div>
              <span className={`text-xs font-bold w-10 text-right ${ch.pct >= 80 ? 'text-green-600' : ch.pct >= 50 ? 'text-amber-600' : ch.attempted > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {ch.attempted > 0 ? `${ch.pct}%` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
export default function QuizApp() {
  const { currentView, setView, quizMode, user } = useQuizStore();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const loadProgress = useQuizStore((s) => s.loadProgress);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  // Load quiz data
  useEffect(() => {
    fetch('/quizData.json')
      .then(r => r.json())
      .then(data => { setQuizData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Load progress from Supabase when user is logged in
  useEffect(() => {
    if (authUser && !authLoading) {
      loadProgress();
    }
  }, [authUser, authLoading, loadProgress]);

  // Hydrate user from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('quiz-patente-current-user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u && u.id) useQuizStore.setState({ user: u });
      } catch {}
    }
  }, []);

  // Quiz start handlers
  const startSingleChapter = useCallback((chapterSlug: string) => {
    if (!quizData || !quizData[chapterSlug]) return;
    const chapterData = quizData[chapterSlug];
    const questions: QuizQuestion[] = [];
    let idCounter = 0;
    for (const [subSlug, qs] of Object.entries(chapterData)) {
      for (const q of qs) {
        questions.push({ ...q, id: `${chapterSlug}-${idCounter++}` });
      }
    }
    const ch = CHAPTERS.find(c => c.slug === chapterSlug);
    useQuizStore.getState().startQuiz(chapterSlug, 'chapter', ch?.name || chapterSlug, shuffleArray(questions));
  }, [quizData]);

  const startErrorsForChapter = useCallback((chapterSlug: string) => {
    if (!quizData || !quizData[chapterSlug]) return;
    const progress = useQuizStore.getState().chapterProgress[chapterSlug];
    if (!progress || progress.errorQuestionIds.length === 0) return;
    const chapterData = quizData[chapterSlug];
    const errorIds = new Set(progress.errorQuestionIds);
    const questions: QuizQuestion[] = [];
    let idCounter = 0;
    for (const qs of Object.values(chapterData)) {
      for (const q of qs) {
        const qId = `${chapterSlug}-${idCounter++}`;
        if (errorIds.has(qId)) questions.push({ ...q, id: qId });
      }
    }
    const ch = CHAPTERS.find(c => c.slug === chapterSlug);
    useQuizStore.getState().startQuiz(chapterSlug, 'errors', `Errori: ${ch?.name || chapterSlug}`, shuffleArray(questions));
  }, [quizData]);

  const startMultiChapter = useCallback((chapterSlugs: string[]) => {
    if (!quizData) return;
    const questions: QuizQuestion[] = [];
    for (const slug of chapterSlugs) {
      const ch = quizData[slug];
      if (!ch) continue;
      let idCounter = 0;
      for (const qs of Object.values(ch)) {
        for (const q of qs) {
          questions.push({ ...q, id: `${slug}-${idCounter++}` });
        }
      }
    }
    useQuizStore.getState().startQuiz(null, 'multi-chapter', 'Multi Capitoli', shuffleArray(questions));
  }, [quizData]);

  const startSubtopics = useCallback((chapterSlug: string, subtopics: string[]) => {
    if (!quizData || !quizData[chapterSlug]) return;
    const chapterData = quizData[chapterSlug];
    const questions: QuizQuestion[] = [];
    let idCounter = 0;
    for (const subSlug of subtopics) {
      const qs = chapterData[subSlug];
      if (!qs) continue;
      for (const q of qs) {
        questions.push({ ...q, id: `${chapterSlug}-${subSlug}-${idCounter++}` });
      }
    }
    useQuizStore.getState().startQuiz(chapterSlug, 'subtopics', 'Argomenti Selezionati', shuffleArray(questions));
  }, [quizData]);

  const startFullExam = useCallback(() => {
    if (!quizData) return;
    // Pick 30 random questions from all chapters (weighted)
    const allQuestions: QuizQuestion[] = [];
    for (const [chSlug, chData] of Object.entries(quizData)) {
      let idCounter = 0;
      for (const qs of Object.values(chData)) {
        for (const q of qs) {
          allQuestions.push({ ...q, id: `${chSlug}-${idCounter++}` });
        }
      }
    }
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, 30);
    useQuizStore.getState().startExam(selected);
  }, [quizData]);

  const startExamFromNav = useCallback(() => {
    if (!quizData) return;
    const allQuestions: QuizQuestion[] = [];
    for (const [chSlug, chData] of Object.entries(quizData)) {
      let idCounter = 0;
      for (const qs of Object.values(chData)) {
        for (const q of qs) {
          allQuestions.push({ ...q, id: `${chSlug}-${idCounter++}` });
        }
      }
    }
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, 30);
    useQuizStore.getState().startExam(selected);
  }, [quizData]);

  // Handle direct exam/errors view from nav
  useEffect(() => {
    if (currentView === 'exam' && quizData) {
      const { questions, examTimerActive } = useQuizStore.getState();
      if (questions.length === 0) {
        startExamFromNav();
      }
    }
    if (currentView === 'errors') {
      // If no questions loaded, redirect to home (errors are accessed from chapter cards)
      const { questions } = useQuizStore.getState();
      if (questions.length === 0) {
        setView('home');
      }
    }
  }, [currentView, quizData, startExamFromNav, setView]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <IconAlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="text-muted-foreground">Impossibile caricare i dati del quiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {currentView === 'home' && (
          <HomeView
            quizData={quizData}
            onStartSingle={startSingleChapter}
            onStartErrors={startErrorsForChapter}
            onStartMulti={startMultiChapter}
            onStartFullExam={startFullExam}
            onStartSubtopics={startSubtopics}
          />
        )}
        {currentView === 'login' && <LoginView />}
        {currentView === 'register' && <RegisterView />}
        {(currentView === 'quiz' || currentView === 'errors') && <QuizView />}
        {currentView === 'exam' && <ExamView />}
        {currentView === 'exam-result' && <ExamResultView />}
        {currentView === 'stats' && <StatsView quizData={quizData} />}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Quiz Patente B — {Object.values(quizData).reduce((s, ch) => s + Object.values(ch).reduce((ss, qs) => ss + qs.length, 0), 0).toLocaleString('it-IT')} quiz ufficiali per la preparazione all&apos;esame di guida
        </div>
      </footer>
    </div>
  );
}
