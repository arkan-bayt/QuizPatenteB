'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useOverallStats, useWrongAnswers } from './hooks';
import { getTeacherAssignments, getAssignmentResults, createAssignment } from '@/logic/assignmentEngine';
import { Assignment, AssignmentConfig } from '@/data/supabaseClient';
import { getAllUsers } from '@/logic/authEngine';
import { AppUser } from '@/data/supabaseClient';
import { getUniqueTopics, getChaptersByTopic } from '@/data/quizData';

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
    const [assignmentsData, usersData] = await Promise.all([
      getTeacherAssignments(teacherId),
      getAllUsers(),
    ]);
    setAssignments(assignmentsData);
    setStudents(usersData.filter((u) => u.role === 'student' && u.owner_id === teacherId));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [teacherId]);

  const teacherName = user?.full_name || user?.username || '';

  // Stats computation
  const activeAssignments = assignments.filter((a) => a.is_active);
  const totalStudents = students.length;

  const studentProgressMap = useMemo(() => {
    const map: Record<string, { progress: number; lastActive: string; score: number }> = {};
    students.forEach((s) => {
      map[s.id] = { progress: 0, lastActive: s.created_at || '', score: 0 };
    });
    return map;
  }, [students]);

  // Simplified stats based on assignments
  const avgClassScore = 0;
  const studentsNeedingHelp = 0;

  const handleViewResults = (assignmentId: string) => {
    store.openAssignmentResults(assignmentId);
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.goHome()}
            className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Dashboard Insegnante
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {teacherName}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        {/* Message toast */}
        {msg && (
          <div className={`p-4 rounded-2xl text-sm text-center anim-slide-down flex items-center justify-center gap-2 ${msgType === 'success' ? 'feedback-correct' : 'feedback-wrong'}`}>
            <span style={{ color: msgType === 'success' ? 'var(--success)' : 'var(--danger)' }}>{msg}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="👥" value={totalStudents} label="Studenti" color="var(--primary-light)" glow="stat-glow-blue" />
          <StatCard icon="📝" value={activeAssignments.length} label="Compiti attivi" color="var(--success)" glow="stat-glow-green" />
          <StatCard icon="📊" value={`${avgClassScore}%`} label="Media classe" color="var(--accent)" glow="stat-glow-amber" />
          <StatCard icon="⚠️" value={studentsNeedingHelp} label="Da aiutare" color="var(--danger)" glow="stat-glow-red" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 anim-up" style={{ animationDelay: '80ms' }}>
          <button onClick={() => setShowCreateModal(true)}
            className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(249, 115, 22, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                ➕
              </div>
              <p className="text-[13px] font-bold text-white">Crea Nuovo Compito</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Assegna quiz agli studenti</p>
            </div>
          </button>

          <button onClick={() => store.openStudentsList()}
            className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                👥
              </div>
              <p className="text-[13px] font-bold text-white">I Miei Studenti</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{totalStudents} studenti registrati</p>
            </div>
          </button>
        </div>

        {/* Active Assignments Section */}
        <div className="anim-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2.5 mb-4 px-1">
            <div className="icon-box icon-box-primary w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              Compiti Attivi ({activeAssignments.length})
            </h2>
          </div>

          {loading ? (
            <div className="glass p-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)' }} />
              <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="glass p-8 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessun compito attivo</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Crea il tuo primo compito per iniziare</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAssignments.map((a, i) => (
                <button key={a.id} onClick={() => handleViewResults(a.id)}
                  className="glass p-4 w-full text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] anim-up"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                      📝
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                      {a.description && (
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{a.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                          {a.config.number_of_questions} domande
                        </span>
                        {a.config.time_limit_minutes && (
                          <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            ⏱️ {a.config.time_limit_minutes} min
                          </span>
                        )}
                        <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          🔄 Max {a.config.max_attempts} tentativi
                        </span>
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

        {/* Students Progress Section */}
        <div className="anim-up" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-2.5 mb-4 px-1">
            <div className="icon-box icon-box-green w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              Progresso Studenti
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="glass p-8 text-center">
              <div className="text-4xl mb-3">👨‍🎓</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessuno studente registrato</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Aggiungi studenti dalla sezione &quot;I Miei Studenti&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={s.id} className="glass p-3 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--primary-150), var(--primary-100))', border: '1px solid var(--primary-200)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--primary-light)' }}>
                      {(s.full_name || s.username)[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {s.full_name || s.username}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--success)' }}>—</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>nessun dato</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <CreateAssignmentModal
          teacherId={teacherId}
          students={students}
          chapters={chapters}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            showMsg('Compito creato con successo!', 'success');
            loadData();
          }}
          onError={(msg) => showMsg(msg, 'error')}
        />
      )}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ icon, value, label, color, glow }: { icon: string; value: number | string; label: string; color: string; glow: string }) {
  return (
    <div className={`glass ${glow} p-4 text-center transition-all duration-300 hover:scale-[1.03]`}>
      <span className="text-lg mb-1 block">{icon}</span>
      <p className="text-xl font-extrabold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

// ============================================================
// CREATE ASSIGNMENT MODAL
// ============================================================
function CreateAssignmentModal({
  teacherId,
  students,
  chapters,
  onClose,
  onSuccess,
  onError,
}: {
  teacherId: string;
  students: AppUser[];
  chapters: { id: number; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'exam' | 'chapters' | 'custom'>('exam');
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [customQuestionCount, setCustomQuestionCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const toggleChapter = (id: number) => {
    setSelectedChapters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
    if (selectedStudents.size === 0) { onError('Seleziona almeno uno studente'); return; }
    if (mode === 'chapters' && selectedChapters.length === 0) { onError('Seleziona almeno un capitolo'); return; }

    let questionCount = 30;
    if (mode === 'exam') questionCount = 30;
    else if (mode === 'chapters') questionCount = 0; // all from selected chapters
    else questionCount = customQuestionCount;

    const config: AssignmentConfig = {
      chapters: mode === 'chapters' ? selectedChapters : [],
      number_of_questions: questionCount,
      time_limit_minutes: timeLimit ? parseInt(timeLimit) : null,
      max_attempts: maxAttempts,
      mode: mode === 'chapters' ? 'chapters' : 'exam',
    };

    setBusy(true);
    const res = await createAssignment({
      teacherId,
      title: title.trim(),
      description: description.trim() || undefined,
      config,
      studentIds: Array.from(selectedStudents),
    });
    setBusy(false);

    if (res.ok) {
      onSuccess();
    } else {
      onError(res.msg);
    }
  };

  const topics = useMemo(() => getUniqueTopics(chapters as any), [chapters]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md glass p-6 anim-up max-h-[85vh] overflow-y-auto"
        style={{ borderRadius: 'var(--radius-2xl)' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold" style={{ color: 'var(--text-primary)' }}>Nuovo Compito</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Crea un quiz per i tuoi studenti</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2" style={{ borderRadius: 10 }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Titolo *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-modern text-sm" placeholder="Es: Esame Capitoli 1-5" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Descrizione</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="input-modern text-sm" placeholder="Descrizione opzionale..." />
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Modalità</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'exam' as const, label: 'Esame (30 domande)', icon: '📝' },
                { key: 'chapters' as const, label: 'Per Capitoli', icon: '📚' },
                { key: 'custom' as const, label: 'Numero personalizzato', icon: '🔢' },
              ].map((m) => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer"
                  style={mode === m.key
                    ? { background: 'var(--primary-150)', color: 'var(--primary-light)', borderColor: 'var(--primary-200)' }
                    : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                  }>
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selection */}
          {mode === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Capitoli</label>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelectedChapters([])} className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: selectedChapters.length === 0 ? 'var(--danger-100)' : 'var(--bg-tertiary)', color: selectedChapters.length === 0 ? 'var(--danger)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    Nessuno
                  </button>
                  <button onClick={() => setSelectedChapters(chapters.map((c) => c.id))} className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: selectedChapters.length === chapters.length ? 'var(--primary-100)' : 'var(--bg-tertiary)', color: selectedChapters.length === chapters.length ? 'var(--primary-light)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    Tutti
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {chapters.map((ch) => (
                  <button key={ch.id} onClick={() => toggleChapter(ch.id)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150"
                    style={{
                      background: selectedChapters.includes(ch.id) ? 'var(--primary-150)' : 'var(--bg-tertiary)',
                      color: selectedChapters.includes(ch.id) ? 'var(--primary-light)' : 'var(--text-muted)',
                      border: `1px solid ${selectedChapters.includes(ch.id) ? 'var(--primary-200)' : 'var(--border)'}`,
                    }}>
                    Cap. {ch.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Question Count */}
          {mode === 'custom' && (
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Numero domande</label>
              <input type="number" value={customQuestionCount} onChange={(e) => setCustomQuestionCount(parseInt(e.target.value) || 1)} min={1} max={100}
                className="input-modern text-sm" />
            </div>
          )}

          {/* Time Limit & Max Attempts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Limite tempo (min)</label>
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} min={1} placeholder="Opzionale"
                className="input-modern text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Tentativi max</label>
              <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)} min={1} max={99}
                className="input-modern text-sm" />
            </div>
          </div>

          {/* Student Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Studenti *</label>
              {students.length > 0 && (
                <button onClick={selectAllStudents} className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                  style={{ background: selectedStudents.size === students.length ? 'var(--primary-100)' : 'var(--bg-tertiary)', color: selectedStudents.size === students.length ? 'var(--primary-light)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {selectedStudents.size === students.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-[11px] text-center py-3" style={{ color: 'var(--text-muted)' }}>Nessuno studente disponibile</p>
              ) : (
                students.map((s) => (
                  <button key={s.id} onClick={() => toggleStudent(s.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: selectedStudents.has(s.id) ? 'var(--primary-150)' : 'var(--bg-card)',
                      border: `1px solid ${selectedStudents.has(s.id) ? 'var(--primary-200)' : 'var(--border-subtle)'}`,
                    }}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${selectedStudents.has(s.id) ? 'bg-primary' : ''}`}
                      style={{
                        background: selectedStudents.has(s.id) ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                        border: `1.5px solid ${selectedStudents.has(s.id) ? 'var(--primary-light)' : 'var(--border)'}`,
                      }}>
                      {selectedStudents.has(s.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.full_name || s.username}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
            {selectedStudents.size > 0 && (
              <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
                {selectedStudents.size} studenti selezionati
              </p>
            )}
          </div>

          {/* Create Button */}
          <button onClick={handleCreate} disabled={busy || !title.trim() || selectedStudents.size === 0}
            className="w-full py-3.5 text-white font-bold text-[14px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)' }}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creazione...
              </span>
            ) : 'Crea Compito'}
          </button>
        </div>
      </div>
    </div>
  );
}
