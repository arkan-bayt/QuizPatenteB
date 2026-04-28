'use client';

import React, { useState } from 'react';
import { QuizData, QuizQuestion, ChapterProgress } from '@/lib/types';
import { CHAPTERS, slugToName, getTopicsForChapter } from '@/lib/chapters';
import { shuffleArray, safeNum } from '@/lib/utils';
import { useQuizStore } from '@/lib/quiz-store';

interface HomeViewProps {
  quizData: QuizData;
  onStartQuiz: (questions: QuizQuestion[], title: string, mode: string, chapterSlugs: string[], topicKey: string | null) => void;
}

export default function HomeView({ quizData, onStartQuiz }: HomeViewProps) {
  const chapterProgress = useQuizStore((s) => s.chapterProgress);
  const setView = useQuizStore((s) => s.setView);

  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<{ chapter: string; topic: string } | null>(null);
  const [mode, setMode] = useState<'chapters' | 'topic'>('chapters');

  const toggleChapter = (slug: string) => {
    setSelectedChapters(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAllChapters = () => setSelectedChapters(new Set(CHAPTERS.map(c => c.slug)));
  const deselectAllChapters = () => setSelectedChapters(new Set());

  const totalQuestions = selectedChapters.size > 0
    ? Array.from(selectedChapters).reduce((sum, slug) => {
        const ch = quizData[slug];
        if (!ch) return sum;
        return sum + Object.values(ch).reduce((s, qs) => s + qs.length, 0);
      }, 0)
    : 0;

  // Topic mode: count questions for selected topic
  const topicQuestions = selectedTopic
    ? quizData[selectedTopic.chapter]?.[selectedTopic.topic]?.length ?? 0
    : 0;

  const handleStart = () => {
    if (mode === 'topic' && selectedTopic) {
      const rawQs = quizData[selectedTopic.chapter]?.[selectedTopic.topic] ?? [];
      const questions: QuizQuestion[] = rawQs.map((q, i) => ({
        ...q,
        id: `${selectedTopic.chapter}-${selectedTopic.topic}-${i}`,
      }));
      const title = slugToName(selectedTopic.topic);
      onStartQuiz(shuffleArray(questions), title, 'topic', [selectedTopic.chapter], `${selectedTopic.chapter}:${selectedTopic.topic}`);
    } else if (selectedChapters.size > 0) {
      const questions: QuizQuestion[] = [];
      const slugs = Array.from(selectedChapters);
      for (const slug of slugs) {
        const ch = quizData[slug];
        if (!ch) continue;
        for (const [topic, qs] of Object.entries(ch)) {
          for (const q of qs) {
            questions.push({ ...q, id: `${slug}-${topic}-${questions.length}` });
          }
        }
      }
      const title = slugs.length === 1
        ? (CHAPTERS.find(c => c.slug === slugs[0])?.name ?? slugs[0])
        : `${slugs.length} Capitoli`;
      onStartQuiz(shuffleArray(questions), title, 'chapter', slugs, null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Scegli cosa studiare</h1>
        <p className="text-muted-foreground">Seleziona i capitoli o gli argomenti per iniziare</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setMode('chapters')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'chapters' ? 'bg-emerald-600 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
        >
          Capitoli
        </button>
        <button
          onClick={() => setMode('topic')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'topic' ? 'bg-emerald-600 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
        >
          Argomenti
        </button>
      </div>

      {mode === 'chapters' ? (
        <ChapterSelector
          quizData={quizData}
          selectedChapters={selectedChapters}
          onToggle={toggleChapter}
          onSelectAll={selectAllChapters}
          onDeselectAll={deselectAllChapters}
          chapterProgress={chapterProgress}
        />
      ) : (
        <TopicSelector
          quizData={quizData}
          selectedTopic={selectedTopic}
          onSelect={setSelectedTopic}
          chapterProgress={chapterProgress}
        />
      )}

      {/* Start button */}
      <div className="space-y-3">
        {mode === 'chapters' ? (
          <div className="text-center text-sm text-muted-foreground">
            {safeNum(selectedChapters.size)} capitoli selezionati — {safeNum(totalQuestions)} domande
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            {selectedTopic ? `${safeNum(topicQuestions)} domande in ${slugToName(selectedTopic.topic)}` : 'Nessun argomento selezionato'}
          </div>
        )}
        <button
          onClick={handleStart}
          disabled={mode === 'chapters' ? selectedChapters.size === 0 : !selectedTopic}
          className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Inizia Quiz
        </button>
      </div>
    </div>
  );
}

// ==========================================
// CHAPTER SELECTOR
// ==========================================
function ChapterSelector({
  quizData,
  selectedChapters,
  onToggle,
  onSelectAll,
  onDeselectAll,
  chapterProgress,
}: {
  quizData: QuizData;
  selectedChapters: Set<string>;
  onToggle: (slug: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  chapterProgress: Record<string, ChapterProgress>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 px-1">
        <button onClick={onSelectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">Seleziona tutti</button>
        <button onClick={onDeselectAll} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-accent">Deseleziona tutti</button>
        <span className="text-xs text-muted-foreground self-center ml-auto">{selectedChapters.size}/{CHAPTERS.length}</span>
      </div>

      <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
        {CHAPTERS.map((ch, i) => {
          const isSelected = selectedChapters.has(ch.slug);
          const prog = chapterProgress[ch.slug];
          const attempted = typeof prog?.totalAttempted === 'number' ? prog.totalAttempted : 0;
          const correct = typeof prog?.correctCount === 'number' ? prog.correctCount : 0;
          const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
          const errorCount = Array.isArray(prog?.errorIds) ? prog.errorIds.length : 0;

          return (
            <button
              key={ch.slug}
              onClick={() => onToggle(ch.slug)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700'
                  : 'bg-card border hover:bg-accent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                isSelected ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{safeStr(ch.name)}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{safeNum(ch.questionCount)} domande</span>
                  {attempted > 0 && (
                    <>
                      <span>·</span>
                      <span className={pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}>{safeNum(pct)}%</span>
                    </>
                  )}
                  {errorCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-red-500">{safeNum(errorCount)} err</span>
                    </>
                  )}
                </div>
              </div>
              {isSelected && (
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// TOPIC SELECTOR
// ==========================================
function TopicSelector({
  quizData,
  selectedTopic,
  onSelect,
  chapterProgress,
}: {
  quizData: QuizData;
  selectedTopic: { chapter: string; topic: string } | null;
  onSelect: (topic: { chapter: string; topic: string } | null) => void;
  chapterProgress: Record<string, ChapterProgress>;
}) {
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
        {CHAPTERS.map((ch) => {
          const topics = getTopicsForChapter(quizData, ch.slug);
          if (topics.length === 0) return null;
          const isOpen = openChapter === ch.slug;

          return (
            <div key={ch.slug} className="bg-card border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenChapter(isOpen ? null : ch.slug)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-emerald-600">{safeNum(parseInt(ch.id))}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{safeStr(ch.name)}</div>
                  <div className="text-xs text-muted-foreground">{safeNum(topics.length)} argomenti · {safeNum(ch.questionCount)} domande</div>
                </div>
                <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t max-h-60 overflow-y-auto">
                  {topics.map((topic) => {
                    const isSel = selectedTopic?.chapter === ch.slug && selectedTopic?.topic === topic;
                    const count = quizData[ch.slug]?.[topic]?.length ?? 0;
                    return (
                      <button
                        key={topic}
                        onClick={() => onSelect(isSel ? null : { chapter: ch.slug, topic })}
                        className={`w-full text-left px-6 py-2.5 text-sm border-b last:border-b-0 transition-colors ${
                          isSel
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="truncate">{safeStr(slugToName(topic))}</span>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{safeNum(count)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
