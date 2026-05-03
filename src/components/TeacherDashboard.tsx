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
  const activeAssignments = assignments.filter((a) => a.is_active);
  const totalStudents = students.length;
  const avgClassScore = 0;
  const studentsNeedingHelp = 0;

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
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="👥" value={totalStudents} label="Studenti" color="#4F46E5" border="border-l-indigo-400" />
          <StatCard icon="📝" value={activeAssignments.length} label="Compiti attivi" color="#059669" border="border-l-emerald-400" />
          <StatCard icon="📊" value={`${avgClassScore}%`} label="Media classe" color="#D97706" border="border-l-amber-400" />
          <StatCard icon="⚠️" value={studentsNeedingHelp} label="Da aiutare" color="#DC2626" border="border-l-red-400" />
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

function StatCard({ icon, value, label, color, border }: { icon: string; value: number | string; label: string; color: string; border: string }) {
  return (
    <div className="rounded-xl border shadow-sm p-4 text-center transition-all hover:shadow-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <span className="text-base mb-0.5 block">{icon}</span>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

function CreateAssignmentModal({ teacherId, students, chapters, onClose, onSuccess, onError }: {
  teacherId: string; students: AppUser[]; chapters: { id: number; name: string }[];
  onClose: () => void; onSuccess: () => void; onError: (msg: string) => void;
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

  const toggleChapter = (id: number) => setSelectedChapters((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const selectAllStudents = () => {
    if (selectedStudents.size === students.length) setSelectedStudents(new Set());
    else setSelectedStudents(new Set(students.map((s) => s.id)));
  };

  const handleCreate = async () => {
    if (!title.trim()) { onError('Inserisci un titolo'); return; }
    if (selectedStudents.size === 0) { onError('Seleziona almeno uno studente'); return; }
    if (mode === 'chapters' && selectedChapters.length === 0) { onError('Seleziona almeno un capitolo'); return; }

    let questionCount = mode === 'exam' ? 30 : mode === 'chapters' ? 0 : customQuestionCount;
    const config: AssignmentConfig = {
      chapters: mode === 'chapters' ? selectedChapters : [],
      number_of_questions: questionCount,
      time_limit_minutes: timeLimit ? parseInt(timeLimit) : null,
      max_attempts: maxAttempts,
      mode: mode === 'chapters' ? 'chapters' : 'exam',
    };

    setBusy(true);
    const res = await createAssignment({ teacherId, title: title.trim(), description: description.trim() || undefined, config, studentIds: Array.from(selectedStudents) });
    setBusy(false);
    if (res.ok) onSuccess(); else onError(res.msg);
  };

  const topics = useMemo(() => getUniqueTopics(chapters as any), [chapters]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md rounded-2xl border shadow-xl p-6 anim-up max-h-[85vh] overflow-y-auto" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
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

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Titolo *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Es: Esame Capitoli 1-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Descrizione</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Descrizione opzionale..." />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Modalità</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'exam' as const, label: 'Esame (30 domande)', icon: '📝' },
                { key: 'chapters' as const, label: 'Per Capitoli', icon: '📚' },
                { key: 'custom' as const, label: 'Personalizzato', icon: '🔢' },
              ].map((m) => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${mode === m.key ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''}`}
                  style={mode !== m.key ? { color: 'var(--text-muted)', borderColor: 'var(--border)' } : undefined}>
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Capitoli</label>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelectedChapters([])} className="text-[10px] font-semibold px-2 py-1 rounded-md border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>Nessuno</button>
                  <button onClick={() => setSelectedChapters(chapters.map((c) => c.id))} className="text-[10px] font-semibold px-2 py-1 rounded-md text-indigo-600 border border-indigo-200 bg-indigo-50">Tutti</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {chapters.map((ch) => (
                  <button key={ch.id} onClick={() => toggleChapter(ch.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${selectedChapters.includes(ch.id) ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : ''}`}
                    style={selectedChapters.includes(ch.id) ? undefined : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    Cap. {ch.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'custom' && (
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Numero domande</label>
              <input type="number" value={customQuestionCount} onChange={(e) => setCustomQuestionCount(parseInt(e.target.value) || 1)} min={1} max={100} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Limite tempo (min)</label>
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} min={1} placeholder="Opzionale" className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tentativi max</label>
              <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)} min={1} max={99} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Studenti *</label>
              {students.length > 0 && (
                <button onClick={selectAllStudents} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${selectedStudents.size === students.length ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : ''}`}
                  style={selectedStudents.size === students.length ? undefined : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {selectedStudents.size === students.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: 'var(--text-muted)' }}>Nessuno studente disponibile</p>
              ) : students.map((s) => (
                <button key={s.id} onClick={() => toggleStudent(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${selectedStudents.has(s.id) ? 'bg-indigo-50 border border-indigo-200' : ''}`}
                  style={selectedStudents.has(s.id) ? undefined : { background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${selectedStudents.has(s.id) ? 'bg-[#4F46E5]' : ''}`} style={{ border: selectedStudents.has(s.id) ? 'none' : '1.5px solid var(--border)', background: selectedStudents.has(s.id) ? '#4F46E5' : 'var(--bg-tertiary)' }}>
                    {selectedStudents.has(s.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.full_name || s.username}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                  </div>
                </button>
              ))}
            </div>
            {selectedStudents.size > 0 && <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-muted)' }}>{selectedStudents.size} studenti selezionati</p>}
          </div>

          <button onClick={handleCreate} disabled={busy || !title.trim() || selectedStudents.size === 0}
            className="w-full py-3.5 text-white font-bold text-sm rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50">
            {busy ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creazione...</span> : 'Crea Compito'}
          </button>
        </div>
      </div>
    </div>
  );
}
