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
    <div className="min-h-screen bg-[#FAFAFA] pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => store.goHome()} className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Dashboard Insegnante</h1>
            <p className="text-[11px] text-gray-400">{teacherName}</p>
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

          <button onClick={() => store.openStudentsList()} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg mb-2">👥</div>
            <p className="text-sm font-bold text-gray-900">I Miei Studenti</p>
            <p className="text-xs text-gray-400 mt-0.5">{totalStudents} studenti registrati</p>
          </button>
        </div>

        {/* Assignments */}
        <div className="anim-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Compiti Attivi ({activeAssignments.length})</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto border-gray-200 border-t-[#4F46E5]" />
              <p className="text-xs mt-3 text-gray-400">Caricamento...</p>
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-medium text-gray-500">Nessun compito attivo</p>
              <p className="text-xs mt-1 text-gray-400">Crea il tuo primo compito per iniziare</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeAssignments.map((a, i) => (
                <button key={a.id} onClick={() => handleViewResults(a.id)}
                  className="w-full bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-md hover:border-gray-200 transition-all anim-up"
                  style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-base flex-shrink-0">📝</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                      {a.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{a.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-400">{a.config.number_of_questions} domande</span>
                        {a.config.time_limit_minutes && <span className="text-[10px] text-gray-400">⏱️ {a.config.time_limit_minutes} min</span>}
                        <span className="text-[10px] text-gray-400">🔄 Max {a.config.max_attempts} tentativi</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Progresso Studenti</h2>
          </div>

          {students.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-3xl mb-3">👨‍🎓</div>
              <p className="text-sm font-medium text-gray-500">Nessuno studente registrato</p>
              <p className="text-xs mt-1 text-gray-400">Aggiungi studenti dalla sezione &quot;I Miei Studenti&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 25}ms` }}>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#4F46E5]">{(s.full_name || s.username)[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.full_name || s.username}</p>
                    <p className="text-[10px] text-gray-400">@{s.username}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-gray-400">—</p>
                    <p className="text-[10px] text-gray-400">nessun dato</p>
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
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center transition-all hover:shadow-md ${border} border-l-[3px]`}>
      <span className="text-base mb-0.5 block">{icon}</span>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider text-gray-400">{label}</p>
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
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-6 anim-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Nuovo Compito</h2>
            <p className="text-xs mt-0.5 text-gray-400">Crea un quiz per i tuoi studenti</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Titolo *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="Es: Esame Capitoli 1-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Descrizione</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="Descrizione opzionale..." />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Modalità</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'exam' as const, label: 'Esame (30 domande)', icon: '📝' },
                { key: 'chapters' as const, label: 'Per Capitoli', icon: '📚' },
                { key: 'custom' as const, label: 'Personalizzato', icon: '🔢' },
              ].map((m) => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${mode === m.key ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-gray-400 border-gray-100 hover:text-gray-700'}`}>
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Capitoli</label>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelectedChapters([])} className="text-[10px] font-semibold px-2 py-1 rounded-md text-gray-400 border border-gray-100">Nessuno</button>
                  <button onClick={() => setSelectedChapters(chapters.map((c) => c.id))} className="text-[10px] font-semibold px-2 py-1 rounded-md text-indigo-600 border border-indigo-200 bg-indigo-50">Tutti</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {chapters.map((ch) => (
                  <button key={ch.id} onClick={() => toggleChapter(ch.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${selectedChapters.includes(ch.id) ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-gray-400 border border-gray-100'}`}>
                    Cap. {ch.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'custom' && (
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Numero domande</label>
              <input type="number" value={customQuestionCount} onChange={(e) => setCustomQuestionCount(parseInt(e.target.value) || 1)} min={1} max={100} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Limite tempo (min)</label>
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} min={1} placeholder="Opzionale" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Tentativi max</label>
              <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)} min={1} max={99} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Studenti *</label>
              {students.length > 0 && (
                <button onClick={selectAllStudents} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${selectedStudents.size === students.length ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-gray-400 border border-gray-100'}`}>
                  {selectedStudents.size === students.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-xs text-center py-3 text-gray-400">Nessuno studente disponibile</p>
              ) : students.map((s) => (
                <button key={s.id} onClick={() => toggleStudent(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${selectedStudents.has(s.id) ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-gray-100 hover:border-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${selectedStudents.has(s.id) ? 'bg-[#4F46E5]' : 'bg-gray-100'}`} style={{ border: selectedStudents.has(s.id) ? 'none' : '1.5px solid #D1D5DB' }}>
                    {selectedStudents.has(s.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{s.full_name || s.username}</p>
                    <p className="text-[10px] text-gray-400">@{s.username}</p>
                  </div>
                </button>
              ))}
            </div>
            {selectedStudents.size > 0 && <p className="text-[10px] mt-2 text-center text-gray-400">{selectedStudents.size} studenti selezionati</p>}
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
