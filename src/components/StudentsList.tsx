'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { AppUser } from '@/data/supabaseClient';
import { getAllUsers, addUser, deleteUser } from '@/logic/authEngine';

export default function StudentsList() {
  const store = useStore();
  const { user } = store;
  const teacherId = user?.id || '';

  const [students, setStudents] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  // Add student form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const loadStudents = async () => {
    setLoading(true);
    const allUsers = await getAllUsers();
    // Filter students that belong to this teacher
    const myStudents = allUsers.filter(
      (u) => (u.role === 'student') && (u.owner_id === teacherId)
    );
    setStudents(myStudents);
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, [teacherId]);

  const handleAdd = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      showMsg('Inserisci username e password', 'error');
      return;
    }
    setBusy(true);
    const adminName = user?.username || '';
    // Note: full_name and email would need API support; for now, username is used
    const res = await addUser(newUsername.trim(), newPassword, 'student' as any, adminName);
    setBusy(false);
    if (res.ok) {
      showMsg('Studente aggiunto con successo', 'success');
      setNewUsername(''); setNewPassword(''); setNewFullName(''); setNewEmail('');
      loadStudents();
    } else {
      showMsg(res.msg, 'error');
    }
  };

  const handleDelete = async (studentId: string) => {
    const adminName = user?.username || '';
    const res = await deleteUser(studentId, adminName);
    setDeleteTarget(null);
    if (res.ok) {
      showMsg('Studente eliminato', 'success');
      loadStudents();
    } else {
      showMsg(res.msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.openTeacherDashboard()}
            className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              I Miei Studenti
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {students.length} studenti registrati
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

        {/* Add Student Form */}
        <div className="glass p-6 anim-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="icon-box icon-box-primary w-8 h-8">
              <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Aggiungi Studente</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Username *</label>
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="input-modern text-sm" placeholder="Username" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Password *</label>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="input-modern text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Nome completo</label>
              <input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} className="input-modern text-sm" placeholder="Nome e cognome" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Email (opzionale)</label>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" className="input-modern text-sm" placeholder="email@esempio.it" />
            </div>
          </div>

          <button onClick={handleAdd} disabled={busy || !newUsername.trim() || !newPassword.trim()}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2">
            {busy ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creazione...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Aggiungi Studente
              </>
            )}
          </button>
        </div>

        {/* Students List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="icon-box icon-box-purple w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--purple)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              Studenti registrati ({students.length})
            </h2>
          </div>

          {loading ? (
            <div className="glass p-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)' }} />
              <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="glass p-10 text-center">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessuno studente trovato</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Aggiungi il tuo primo studente dal form qui sopra</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={s.id} className="glass p-4 flex items-center gap-4 anim-up" style={{ animationDelay: `${i * 40}ms` }}>
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-150), var(--primary-100))',
                      border: '1px solid var(--primary-200)',
                    }}>
                    <span className="text-sm font-bold" style={{ color: 'var(--primary-light)' }}>
                      {(s.full_name || s.username).substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {s.full_name || s.username}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>@{s.username}</p>
                      {s.email && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>·</span>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{s.email}</p>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Iscritto il {s.created_at ? new Date(s.created_at).toLocaleDateString('it') : 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Progress indicator */}
                    <div className="text-right">
                      <p className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--success)' }}>—</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>progresso</p>
                    </div>

                    {/* Delete button */}
                    {deleteTarget === s.id ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleDelete(s.id)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer"
                          style={{ background: 'var(--danger-100)', color: 'var(--danger)', borderColor: 'var(--danger-150)' }}>
                          Conferma
                        </button>
                        <button onClick={() => setDeleteTarget(null)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer"
                          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                          Annulla
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteTarget(s.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-transparent"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-100)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger-150)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
