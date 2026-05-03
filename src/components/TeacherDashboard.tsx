'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useOverallStats, useWrongAnswers } from './hooks';
import { getTeacherAssignments, getAssignmentResults, createAssignment } from '@/logic/assignmentEngine';
import { Assignment, AssignmentConfig, AppUser } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';
import { getUniqueTopics, getChaptersByTopic } from '@/data/quizData';

// ============================================================
// School Class type (inline to avoid import issues)
// ============================================================
interface SchoolClass {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  color?: string | null;
  icon?: string | null;
  created_at: string;
  student_count?: number;
}

// ============================================================
// PREDEFINED CLASS ICONS & COLORS
// ============================================================
const CLASS_PRESETS = [
  { icon: '📚', label: 'Libri', color: '#4F46E5' },
  { icon: '🔬', label: 'Scienze', color: '#059669' },
  { icon: '🧮', label: 'Matematica', color: '#D97706' },
  { icon: '🎨', label: 'Arte', color: '#DC2626' },
  { icon: '⚽', label: 'Sport', color: '#7C3AED' },
  { icon: '💻', label: 'Informatica', color: '#0891B2' },
  { icon: '🎵', label: 'Musica', color: '#BE185D' },
  { icon: '🌍', label: 'Geografia', color: '#65A30D' },
  { icon: '📐', label: 'Architettura', color: '#B45309' },
  { icon: '📖', label: 'Storia', color: '#1D4ED8' },
  { icon: '🚗', label: 'Guida', color: '#EA580C' },
  { icon: '🏠', label: 'Casa', color: '#6366F1' },
];

export default function TeacherDashboard() {
  const store = useStore();
  const { user, chapters } = store;
  const teacherId = user?.id || '';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<AppUser[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [dbSetupNeeded, setDbSetupNeeded] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const loadClasses = async () => {
    try {
      const res = await authenticatedFetch('/api/classes?action=list');
      const data = await res.json();
      if (data.ok && data.classes) {
        setClasses(data.classes);
        setDbSetupNeeded(false);
      }
    } catch {
      setClasses([]);
 }
  };

  const checkDbSetup = async () => {
    try {
      const res = await authenticatedFetch('/api/setup', { method: 'POST' });
      const data = await res.json();
      setDbSetupNeeded(data.sql_needed || false);
    } catch {
      setDbSetupNeeded(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const assignmentsData = await getTeacherAssignments(teacherId);
    setAssignments(assignmentsData);
    // Load students via authenticated API
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
    await loadClasses();
    if (classes.length === 0) {
      await checkDbSetup();
    }
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

  const handleCreateClass = async (name: string, icon: string, color: string) => {
    try {
      const res = await authenticatedFetch('/api/classes', {
        method: 'POST',
        body: JSON.stringify({ action: 'create', name, icon, color }),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg('Classe creata con successo!', 'success');
        await loadClasses();
      } else {
        showMsg(data.msg || 'Errore', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      const res = await authenticatedFetch('/api/classes', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', class_id: classId }),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg('Classe eliminata', 'success');
        await loadClasses();
      } else {
        showMsg(data.msg || 'Errore', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
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

        {/* Database Setup Banner */}
        {dbSetupNeeded && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 anim-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">Setup Database Richiesto</p>
                <p className="text-xs text-amber-700 mt-1">
                  Per utilizzare le classi, devi eseguire un comando SQL nel Supabase SQL Editor.
                </p>
                <ol className="text-xs text-amber-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Vai su <a href="https://supabase.com/dashboard/project/jdahzuhkwimridgskcqd/sql" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-900">Supabase SQL Editor</a></li>
                  <li>Incolla il SQL e clicca &quot;Run&quot;</li>
                  <li>Ricarica questa pagina</li>
                </ol>
                <div className="mt-3 p-3 rounded-lg bg-white/60 border border-amber-200 max-h-32 overflow-auto">
                  <code className="text-[10px] text-amber-900 whitespace-pre-wrap leading-relaxed">CREATE TABLE IF NOT EXISTS school_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  color TEXT DEFAULT '#4F46E5',
  icon TEXT DEFAULT '📚',
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_app_users_class_id ON app_users(class_id);</code>
                </div>
                <button onClick={() => navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS school_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  color TEXT DEFAULT '#4F46E5',
  icon TEXT DEFAULT '📚',
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_app_users_class_id ON app_users(class_id);`).then(() => showMsg('SQL copiato negli appunti!', 'success'))}
                  className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors">
                  📋 Copia SQL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="👥" value={totalStudents} label="Studenti" color="#4F46E5" border="border-l-indigo-400" />
          <StatCard icon="🏫" value={classes.length} label="Classi" color="#059669" border="border-l-emerald-400" />
          <StatCard icon="📝" value={activeAssignments.length} label="Compiti attivi" color="#D97706" border="border-l-amber-400" />
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

        {/* Classes Section */}
        <div className="anim-up">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Le Mie Classi ({classes.length})</h2>
            <button onClick={() => setShowCreateClassModal(true)} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors">
              + Nuova Classe
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-2">🏫</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Nessuna classe creata</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Crea una classe per organizzare i tuoi studenti</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {classes.map((cls, i) => {
                const classStudents = students.filter(s => s.class_id === cls.id);
                return (
                  <div key={cls.id} className="rounded-2xl border overflow-hidden anim-up" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 40}ms` }}>
                    <div className="h-2" style={{ background: cls.color || '#4F46E5' }} />
                    <div className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: (cls.color || '#4F46E5') + '15' }}>
                          {cls.icon || '📚'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{cls.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{classStudents.length} studenti</p>
                        </div>
                      </div>
                      {cls.image_url && (
                        <div className="mt-2 rounded-lg overflow-hidden h-16">
                          <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              {students.map((s, i) => {
                const studentClass = classes.find(c => c.id === s.class_id);
                return (
                  <div key={s.id} className="rounded-xl border p-3.5 flex items-center gap-3 anim-up" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 25}ms` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: studentClass ? (studentClass.color || '#4F46E5') + '15' : 'var(--bg-tertiary)' }}>
                      <span className="text-xs font-bold" style={{ color: studentClass ? (studentClass.color || '#4F46E5') : '#4F46E5' }}>
                        {(s.full_name || s.username)[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.full_name || s.username}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                        {studentClass && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold" style={{ background: (studentClass.color || '#4F46E5') + '15', color: studentClass.color || '#4F46E5' }}>
                            {studentClass.icon} {studentClass.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>—</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>nessun dato</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateAssignmentModal
          teacherId={teacherId}
          students={students}
          classes={classes}
          chapters={chapters}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); showMsg('Compito creato con successo!', 'success'); loadData(); }}
          onError={(msg) => showMsg(msg, 'error')}
        />
      )}

      {showCreateClassModal && (
        <CreateClassModal
          onCreate={handleCreateClass}
          onClose={() => setShowCreateClassModal(false)}
          onDelete={handleDeleteClass}
          classes={classes}
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

// ============================================================
// CREATE CLASS MODAL
// ============================================================
function CreateClassModal({ onCreate, onClose, onDelete, classes }: {
  onCreate: (name: string, icon: string, color: string) => void;
  onClose: () => void;
  onDelete: (classId: string) => void;
  classes: SchoolClass[];
}) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const [tab, setTab] = useState<'create' | 'manage'>('create');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), selectedIcon, selectedColor);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md rounded-2xl border shadow-xl p-6 anim-up max-h-[85vh] overflow-y-auto" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Gestione Classi</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Crea e gestisci le tue classi</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('create')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === 'create' ? 'bg-indigo-50 text-indigo-600' : ''}`} style={tab !== 'create' ? { color: 'var(--text-muted)' } : undefined}>
            Nuova Classe
          </button>
          <button onClick={() => setTab('manage')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === 'manage' ? 'bg-indigo-50 text-indigo-600' : ''}`} style={tab !== 'manage' ? { color: 'var(--text-muted)' } : undefined}>
            Gestisci ({classes.length})
          </button>
        </div>

        {tab === 'create' ? (
          <div className="space-y-4">
            {/* Class Name */}
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Nome Classe *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Es: Classe A, 3° B, Gruppo 1..." />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Icona</label>
              <div className="grid grid-cols-6 gap-2">
                {CLASS_PRESETS.map((preset) => (
                  <button key={preset.icon} onClick={() => { setSelectedIcon(preset.icon); setSelectedColor(preset.color); }}
                    className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${selectedIcon === preset.icon ? 'ring-2 ring-offset-2 ring-indigo-400 scale-105' : 'hover:scale-105'}`}
                    style={{ background: selectedIcon === preset.icon ? preset.color + '20' : 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                    {preset.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Anteprima</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: selectedColor + '15' }}>
                  {selectedIcon}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{name || 'Nome Classe'}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>0 studenti</p>
                </div>
              </div>
            </div>

            <button onClick={handleCreate} disabled={!name.trim()}
              className="w-full py-3.5 text-white font-bold text-sm rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50">
              Crea Classe
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {classes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nessuna classe creata</p>
              </div>
            ) : classes.map((cls) => (
              <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: (cls.color || '#4F46E5') + '15' }}>
                  {cls.icon || '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{cls.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cls.student_count || 0} studenti</p>
                </div>
                <button onClick={() => { if (confirm(`Eliminare la classe "${cls.name}"? Gli studenti verranno rimossi dalla classe.`)) onDelete(cls.id); }}
                  className="p-2 rounded-lg transition-colors hover:bg-red-50" style={{ color: '#DC2626' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CREATE ASSIGNMENT MODAL — WITH CLASS SELECTOR
// ============================================================
function CreateAssignmentModal({ teacherId, students, classes, chapters, onClose, onSuccess, onError }: {
  teacherId: string; students: AppUser[]; classes: SchoolClass[]; chapters: { id: number; name: string }[];
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
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleChapter = (id: number) => setSelectedChapters((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const selectAllStudents = () => {
    if (selectedStudents.size === filteredStudents.length) setSelectedStudents(new Set());
    else setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
  };

  // When a class is selected, auto-select all students in that class
  const handleSelectClass = (classId: string | null) => {
    setSelectedClassId(classId);
    setShowClassDropdown(false);
    if (classId) {
      const classStudentIds = students.filter(s => s.class_id === classId).map(s => s.id);
      setSelectedStudents(new Set(classStudentIds));
    }
  };

  // Filtered students based on selected class (or all if no class selected)
  const filteredStudents = selectedClassId
    ? students.filter(s => s.class_id === selectedClassId)
    : students;

  const selectedClassName = selectedClassId ? classes.find(c => c.id === selectedClassId) : null;

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

          {/* ============================================================ */}
          {/* CLASS SELECTOR - VISUAL DROPDOWN WITH IMAGES/ICONS */}
          {/* ============================================================ */}
          <div className="relative">
            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Classe (opzionale)</label>
            <button
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="w-full border rounded-xl px-4 py-3 text-sm text-left flex items-center gap-3 transition-all outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              style={{ background: 'var(--bg-card)', borderColor: showClassDropdown ? '#4F46E5' : 'var(--border)', color: selectedClassName ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {selectedClassName ? (
                <>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: (selectedClassName.color || '#4F46E5') + '15' }}>
                    {selectedClassName.icon || '📚'}
                  </div>
                  <span className="font-semibold">{selectedClassName.name}</span>
                  <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{filteredStudents.length} studenti</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  <span>Seleziona una classe...</span>
                </>
              )}
              <svg className={`w-4 h-4 ml-auto flex-shrink-0 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Class Dropdown */}
            {showClassDropdown && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-xl border shadow-lg overflow-hidden anim-slide-down" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', maxHeight: '200px', overflowY: 'auto' }}>
                {/* All students option */}
                <button
                  onClick={() => handleSelectClass(null)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedClassId === null ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gray-100">
                    👥
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Tutti gli studenti</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{students.length} studenti</p>
                  </div>
                  {selectedClassId === null && (
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  )}
                </button>

                {classes.length === 0 ? (
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Nessuna classe creata</p>
                  </div>
                ) : classes.map((cls) => {
                  const classStudentsCount = students.filter(s => s.class_id === cls.id).length;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => handleSelectClass(cls.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedClassId === cls.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                    >
                      {/* Class Image or Icon */}
                      {cls.image_url ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: (cls.color || '#4F46E5') + '15' }}>
                          {cls.icon || '📚'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{cls.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{classStudentsCount} studenti</p>
                      </div>
                      {/* Color indicator */}
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cls.color || '#4F46E5' }} />
                      {selectedClassId === cls.id && (
                        <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
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

          {/* Students */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Studenti * {selectedClassName && <span style={{ color: selectedClassName.color || '#4F46E5' }}>({selectedClassName.name})</span>}
              </label>
              {filteredStudents.length > 0 && (
                <button onClick={selectAllStudents} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${selectedStudents.size === filteredStudents.length ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : ''}`}
                  style={selectedStudents.size === filteredStudents.length ? undefined : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {selectedStudents.size === filteredStudents.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: 'var(--text-muted)' }}>
                  {selectedClassId ? 'Nessuno studente in questa classe' : 'Nessuno studente disponibile'}
                </p>
              ) : filteredStudents.map((s) => {
                const studentClass = classes.find(c => c.id === s.class_id);
                return (
                  <button key={s.id} onClick={() => toggleStudent(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${selectedStudents.has(s.id) ? 'bg-indigo-50 border border-indigo-200' : ''}`}
                    style={selectedStudents.has(s.id) ? undefined : { background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${selectedStudents.has(s.id) ? 'bg-[#4F46E5]' : ''}`} style={{ border: selectedStudents.has(s.id) ? 'none' : '1.5px solid var(--border)', background: selectedStudents.has(s.id) ? '#4F46E5' : 'var(--bg-tertiary)' }}>
                      {selectedStudents.has(s.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.full_name || s.username}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                        {studentClass && (
                          <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: (studentClass.color || '#4F46E5') + '15', color: studentClass.color || '#4F46E5' }}>
                            {studentClass.icon}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
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


