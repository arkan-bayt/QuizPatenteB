'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getTeacherAssignments, createAssignment } from '@/logic/assignmentEngine';
import { Assignment, AssignmentConfig, AppUser } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';
import { Chapter, getUniqueTopics, getChaptersByTopic } from '@/data/quizData';
import ChapterIcon from './ChapterIcons';

// ============================================================
// CHAPTER COLORS (same as HomeScreen)
// ============================================================
const CHAPTER_COLORS: Record<number, string> = {
  1: '#3B82F6', 2: '#EF4444', 3: '#DC2626', 4: '#2563EB', 5: '#F59E0B',
  6: '#8B5CF6', 7: '#10B981', 8: '#06B6D4', 9: '#F97316', 10: '#6366F1',
  11: '#EC4899', 12: '#14B8A6', 13: '#0EA5E9', 14: '#A855F7', 15: '#22C55E',
  16: '#3B82F6', 17: '#64748B', 18: '#FBBF24', 19: '#F43F5E', 20: '#78716C',
  21: '#7C3AED', 22: '#BE185D', 23: '#475569', 24: '#059669', 25: '#B45309',
};

export default function TeacherDashboard() {
  const store = useStore();
  const { user, chapters } = store;
  const teacherId = user?.id || '';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const assignmentsData = await getTeacherAssignments(teacherId);
    setAssignments(assignmentsData);
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'get_my_students', teacherId }),
      });
      const data = await res.json();
      if (data.ok && data.students) {
        setStudents(data.students);
      }
    } catch {
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [teacherId]);

  const teacherName = user?.full_name || user?.username || '';
  const activeAssignments = assignments.filter((a) => a.is_active);
  const totalStudents = students.length;

  const handleViewResults = (assignmentId: string) => {
    store.openAssignmentResults(assignmentId);
  };

  return (
    <div className="min-h-screen pb-12" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => store.goHome()} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard Insegnante</h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{teacherName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {msg && (
          <div className={`p-4 rounded-xl text-sm text-center anim-slide-down ${msgType === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 anim-up stagger">
          <StatCard icon="👥" value={totalStudents} label="Studenti" color="#4F46E5" />
          <StatCard icon="📝" value={activeAssignments.length} label="Compiti attivi" color="#D97706" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 anim-up">
          <button onClick={() => setShowCreateModal(true)} className="bg-[#4F46E5] rounded-2xl p-4 text-left hover:bg-[#4338CA] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg mb-2">➕</div>
            <p className="text-sm font-bold text-white">Crea Nuovo Compito</p>
            <p className="text-xs text-indigo-200 mt-0.5">Assegna quiz agli studenti</p>
          </button>

          <button onClick={() => store.openStudentsList()} className="rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg mb-2">👥</div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>I Miei Studenti</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{totalStudents} studenti registrati</p>
          </button>
        </div>

        {/* Assignments */}
        <div className="anim-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Compiti Attivi ({activeAssignments.length})</h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto border-[var(--border)] border-t-[#4F46E5]" />
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Nessun compito attivo</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Crea il tuo primo compito per iniziare</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeAssignments.map((a, i) => (
                <button key={a.id} onClick={() => handleViewResults(a.id)}
                  className="w-full rounded-xl border p-4 text-left hover:shadow-md transition-all anim-up" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 30}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-base flex-shrink-0">📝</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                      {a.description && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{a.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.config.number_of_questions} domande</span>
                        {a.config.time_limit_minutes && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⏱️ {a.config.time_limit_minutes} min</span>}
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>🔄 Max {a.config.max_attempts} tentativi</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Students */}
        <div className="anim-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Progresso Studenti</h2>
          </div>

          {students.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-3">👨‍🎓</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Nessuno studente registrato</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Aggiungi studenti dalla sezione &quot;I Miei Studenti&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={s.id} className="rounded-xl border p-3.5 flex items-center gap-3 anim-up" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 25}ms` }}>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#4F46E5]">{(s.full_name || s.username)[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.full_name || s.username}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>—</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>nessun dato</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateAssignmentModal
          teacherId={teacherId}
          students={students}
          chapters={chapters}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); showMsg('Compito creato con successo!', 'success'); loadData(); }}
          onError={(msg) => showMsg(msg, 'error')}
        />
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <div className="rounded-xl border shadow-sm p-4 text-center transition-all hover:shadow-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <span className="text-base mb-0.5 block">{icon}</span>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

// ============================================================
// CREATE ASSIGNMENT MODAL — SIMPLIFIED FLOW
// Field 1: Title
// Field 2: Chapters (25 chapters, multi-select)
// Field 3: Number of questions (30 / All / Custom)
// Field 4: Exam time
// Field 5: Students (all listed, select all or individual)
// ============================================================
function CreateAssignmentModal({ teacherId, students, chapters, onClose, onSuccess, onError }: {
  teacherId: string;
  students: AppUser[];
  chapters: Chapter[];
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [questionMode, setQuestionMode] = useState<'thirty' | 'all' | 'custom'>('thirty');
  const [customQuestionCount, setCustomQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  // Group chapters by topic
  const topics = useMemo(() => getUniqueTopics(chapters), [chapters]);

  // Calculate total available questions from selected chapters
  const totalAvailableQuestions = useMemo(() => {
    return chapters.filter(c => selectedChapters.includes(c.id)).reduce((sum, c) => sum + c.questionCount, 0);
  }, [chapters, selectedChapters]);

  // Get final question count
  const getQuestionCount = (): number => {
    if (questionMode === 'thirty') return 30;
    if (questionMode === 'all') return totalAvailableQuestions;
    return customQuestionCount;
  };

  const toggleChapter = (id: number) => {
    setSelectedChapters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map((c) => c.id));
  };

  const deselectAllChapters = () => {
    setSelectedChapters([]);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllStudents = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)));
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) { onError('Inserisci un titolo'); return; }
    if (selectedChapters.length === 0) { onError('Seleziona almeno un capitolo'); return; }
    if (selectedStudents.size === 0) { onError('Seleziona almeno uno studente'); return; }

    const config: AssignmentConfig = {
      chapters: selectedChapters,
      number_of_questions: getQuestionCount(),
      time_limit_minutes: timeLimit ? parseInt(timeLimit) : null,
      max_attempts: 3,
      mode: 'chapters',
    };

    // Build description from selected chapters
    const chapterNames = selectedChapters.sort((a, b) => a - b).map(id => {
      const ch = chapters.find(c => c.id === id);
      return ch ? `Cap.${id}` : '';
    }).filter(Boolean).join(', ');
    const description = `${selectedChapters.length} capitoli (${chapterNames})`;

    setBusy(true);
    const res = await createAssignment({
      teacherId,
      title: title.trim(),
      description,
      config,
      studentIds: Array.from(selectedStudents),
    });
    setBusy(false);
    if (res.ok) onSuccess();
    else onError(res.msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border shadow-xl anim-up max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Nuovo Compito</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Crea un quiz per i tuoi studenti</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 pb-5 space-y-5 flex-1">

          {/* ============ FIELD 1: TITOLO ============ */}
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Titolo *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              placeholder="Es: Esame Capitoli 1-5"
            />
          </div>

          {/* ============ FIELD 2: CAPITOLI (25 chapters) ============ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Capitoli * ({selectedChapters.length}/25 selezionati)
              </label>
              <div className="flex gap-1.5">
                <button
                  onClick={deselectAllChapters}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors"
                  style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                >
                  Nessuno
                </button>
                <button
                  onClick={selectAllChapters}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 transition-colors"
                >
                  Tutti
                </button>
              </div>
            </div>

            {/* Selected chapters summary */}
            {selectedChapters.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedChapters.sort((a, b) => a - b).map((id) => {
                  const ch = chapters.find(c => c.id === id);
                  const color = CHAPTER_COLORS[id] || '#6B7280';
                  return (
                    <span
                      key={id}
                      onClick={() => toggleChapter(id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white cursor-pointer transition-transform hover:scale-105"
                      style={{ background: color }}
                    >
                      Cap. {id}
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Chapter grid grouped by topic */}
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
              {topics.map((topic) => {
                const topicChapters = getChaptersByTopic(chapters, topic);
                const topicSelectedCount = topicChapters.filter(c => selectedChapters.includes(c.id)).length;

                return (
                  <div key={topic}>
                    {/* Topic header */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        {topic}
                      </span>
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                        {topicSelectedCount}/{topicChapters.length}
                      </span>
                      {topicSelectedCount === topicChapters.length && topicChapters.length > 0 && (
                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>

                    {/* Chapter chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {topicChapters.map((ch) => {
                        const isSelected = selectedChapters.includes(ch.id);
                        const color = CHAPTER_COLORS[ch.id] || '#6B7280';
                        return (
                          <button
                            key={ch.id}
                            onClick={() => toggleChapter(ch.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all border ${
                              isSelected
                                ? 'border-transparent shadow-sm'
                                : 'hover:border-gray-300'
                            }`}
                            style={
                              isSelected
                                ? { background: color, color: 'white', borderColor: color }
                                : { background: 'var(--bg-card)', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                            }
                          >
                            <ChapterIcon chapterId={ch.id} size={14} />
                            <span>{ch.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============ FIELD 3: NUMERO DOMANDE ============ */}
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Numero domande
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* 30 option */}
              <button
                onClick={() => setQuestionMode('thirty')}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                  questionMode === 'thirty'
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-300'
                    : ''
                }`}
                style={questionMode !== 'thirty' ? { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-card)' } : undefined}
              >
                <span className="text-lg">📝</span>
                <span>30</span>
                <span className="text-[9px] font-normal opacity-70">Esame</span>
              </button>

              {/* All option */}
              <button
                onClick={() => setQuestionMode('all')}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                  questionMode === 'all'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                    : ''
                }`}
                style={questionMode !== 'all' ? { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-card)' } : undefined}
              >
                <span className="text-lg">📚</span>
                <span>Tutte</span>
                <span className="text-[9px] font-normal opacity-70">{totalAvailableQuestions > 0 ? totalAvailableQuestions : '—'}</span>
              </button>

              {/* Custom option */}
              <button
                onClick={() => setQuestionMode('custom')}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                  questionMode === 'custom'
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : ''
                }`}
                style={questionMode !== 'custom' ? { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-card)' } : undefined}
              >
                <span className="text-lg">🔢</span>
                <span>Custom</span>
                <span className="text-[9px] font-normal opacity-70">Scegli</span>
              </button>
            </div>

            {/* Custom input */}
            {questionMode === 'custom' && (
              <div className="mt-2">
                <input
                  type="number"
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(Math.max(1, Math.min(totalAvailableQuestions || 999, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={totalAvailableQuestions || 999}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder="Inserisci numero domande"
                />
              </div>
            )}

            {/* Info text */}
            {selectedChapters.length > 0 && (
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                {totalAvailableQuestions} domande disponibili nei capitoli selezionati
              </p>
            )}
          </div>

          {/* ============ FIELD 4: TEMPO ESAME ============ */}
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Tempo esame (minuti)
            </label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min={1}
              placeholder="Opzionale (es: 20)"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* ============ FIELD 5: STUDENTI ============ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Studenti * ({selectedStudents.size}/{students.length})
              </label>
              <button
                onClick={selectAllStudents}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                  selectedStudents.size === students.length
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : ''
                }`}
                style={selectedStudents.size !== students.length ? { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-card)' } : undefined}
              >
                {selectedStudents.size === students.length ? '✓ Tutti' : 'Seleziona tutti'}
              </button>
            </div>

            {students.length === 0 ? (
              <div className="rounded-xl border p-6 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nessuno studente disponibile</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[30vh] overflow-y-auto pr-1">
                {students.map((s) => {
                  const isSelected = selectedStudents.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStudent(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border text-left ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-200'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? 'bg-indigo-500 border-indigo-500' : ''
                        }`}
                        style={!isSelected ? { borderColor: 'var(--border)' } : undefined}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-[#4F46E5]">{(s.full_name || s.username)[0].toUpperCase()}</span>
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {s.full_name || s.username}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                      </div>

                      {/* Status icon */}
                      {isSelected && (
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className="px-5 pb-5 pt-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleCreate}
            disabled={busy || !title.trim() || selectedChapters.length === 0 || selectedStudents.size === 0}
            className="w-full py-3.5 text-white font-bold text-sm rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-40"
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creazione...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Crea Compito
                <span className="text-indigo-200 text-xs font-normal">
                  ({selectedChapters.length} cap. · {getQuestionCount()} dom. · {selectedStudents.size} stud.)
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
