'use client';
import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { TOPICS_INFO, getChaptersByTopicName, type ChapterExplanation } from '@/data/explanationsData';
import { getChapterPreviewImages } from '@/data/chapterImages';

export default function TopicExplanationScreen() {
  const store = useStore();
  const { activeExplanationTopic } = store;
  const [search, setSearch] = useState('');

  const topicInfo = useMemo(() => {
    return TOPICS_INFO.find((t) => t.nameIt === activeExplanationTopic);
  }, [activeExplanationTopic]);

  const chapters = useMemo(() => {
    if (!activeExplanationTopic) return [];
    return getChaptersByTopicName(activeExplanationTopic);
  }, [activeExplanationTopic]);

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;
    const q = search.toLowerCase().trim();
    return chapters.filter(
      (ch) =>
        ch.titleIt.toLowerCase().includes(q) ||
        ch.titleAr.includes(q) ||
        ch.id.toString().includes(q)
    );
  }, [chapters, search]);

  if (!topicInfo) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Argomento non trovato</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.setScreen('explanations')} className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>{topicInfo.nameIt}</h1>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{topicInfo.nameAr}</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: `${topicInfo.color}20`, border: `1.5px solid ${topicInfo.color}40` }}>
            {topicInfo.icon}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Topic Description */}
        <div className="anim-up">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{topicInfo.descriptionIt}</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{topicInfo.descriptionAr}</p>
        </div>

        {/* Search Bar */}
        <div className="anim-up relative" style={{ animationDelay: '60ms' }}>
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca capitolo..."
            className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-subtle)',
            }}
          />
        </div>

        {/* Chapter Count */}
        <div className="anim-up flex items-center gap-2" style={{ animationDelay: '80ms' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            {filteredChapters.length} {filteredChapters.length === 1 ? 'capitolo' : 'capitoli'}
          </span>
          {search && (
            <button onClick={() => setSearch('')} className="text-xs font-medium" style={{ color: 'var(--primary-light)' }}>
              Cancella ricerca
            </button>
          )}
        </div>

        {/* Chapter Cards */}
        <div className="space-y-3">
          {filteredChapters.map((ch, ci) => (
            <ChapterCard key={ch.id} chapter={ch} color={topicInfo.color} index={ci} allQuestions={store.allQuestions} onClick={() => {
              useStore.setState({ activeChapterId: ch.id });
              store.setScreen('explanationChapter');
            }} />
          ))}
          {filteredChapters.length === 0 && (
            <div className="glass p-8 text-center anim-fade">
              <span className="text-3xl block mb-3">🔍</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessun capitolo trovato</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Prova con un termine diverso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterCard({ chapter, color, index, allQuestions, onClick }: {
  chapter: ChapterExplanation;
  color: string;
  index: number;
  allQuestions: any[];
  onClick: () => void;
}) {
  // Get real preview images from quiz data
  const previewImages = useMemo(() => {
    return getChapterPreviewImages(chapter.id, allQuestions, 3);
  }, [chapter.id, allQuestions]);

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden text-left w-full glass p-4 anim-up transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
      style={{ animationDelay: `${(index * 50) + 120}ms`, borderLeft: `3px solid ${color}` }}>
      <div className="flex items-start gap-3">
        {/* Chapter Number Circle */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
          <span className="text-sm font-bold" style={{ color }}>{chapter.id}</span>
        </div>

        {/* Chapter Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{chapter.titleIt}</p>
            <span className="text-base flex-shrink-0">{chapter.icon}</span>
          </div>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)', direction: 'rtl' }}>{chapter.titleAr}</p>

          {/* Key Points Count */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{chapter.keyPoints.length} punti chiave</span>
            </div>
            {chapter.commonMistakes.length > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{chapter.commonMistakes.length} errori comuni</span>
              </div>
            )}
          </div>
        </div>

        {/* Real Sign Preview Images from Quiz */}
        {previewImages.length > 0 && (
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            {previewImages.map((img, si) => (
              <div key={si} className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Arrow */}
        <svg className="w-4 h-4 flex-shrink-0 mt-1 opacity-40 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  );
}
