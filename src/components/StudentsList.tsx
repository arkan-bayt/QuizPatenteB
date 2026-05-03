'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { AppUser } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';

export default function StudentsList() {
  const store = useStore();
  const { user } = store;
  const teacherId = user?.id || '';

  const [students, setStudents] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'get_my_students', teacherId }),
      });
      const data = await res.json();
      if (data.ok && data.students) {
        setStudents(data.students);
      } else {
        // Fallback: load all users and filter
        const allRes = await authenticatedFetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ action: 'list_users' }),
        });
        const allData = await allRes.json();
        if (allData.ok && allData.users) {
          setStudents(allData.users.filter((u: any) => u.role === 'student'));
        }
      }
    } catch {
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, [teacherId]);

  const handleAdd = async () => {
    if (!newUsername.trim() || !newPassword.trim()) { showMsg('Inserisci username e password', 'error'); return; }
    setBusy(true);
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          action: 'register_student',
          teacherId,
          username: newUsername.trim(),
          password: newPassword,
          full_name: newFullName.trim() || undefined,
          email: newEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      setBusy(false);
      if (data.ok) {
        showMsg('Studente aggiunto con successo', 'success');
        setNewUsername(''); setNewPassword(''); setNewFullName(''); setNewEmail('');
        loadStudents();
      } else { showMsg(data.msg || 'Errore', 'error'); }
    } catch {
      setBusy(false);
      showMsg('Errore di connessione', 'error');
    }
  };

  const handleDelete = async (studentId: string) => {
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_user', userId: studentId, adminUsername: '' }),
      });
      const data = await res.json();
      setDeleteTarget(null);
      if (data.ok) { showMsg('Studente eliminato', 'success'); loadStudents(); }
      else { showMsg(data.msg || 'Errore', 'error'); }
    } catch {
      setDeleteTarget(null);
      showMsg('Errore di connessione', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => store.openTeacherDashboard()} className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">I Miei Studenti</h1>
            <p className="text-[11px] text-gray-400">{students.length} studenti registrati</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {msg && (
          <div className={`p-4 rounded-xl text-sm text-center anim-slide-down ${msgType === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Add Student Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 anim-up">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Aggiungi Studente</h2>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Username *</label>
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="Username" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Password *</label>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="Password" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Nome completo</label>
              <input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="Nome e cognome" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-400">Email (opzionale)</label>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="email@esempio.it" />
            </div>
          </div>

          <button onClick={handleAdd} disabled={busy || !newUsername.trim() || !newPassword.trim()}
            className="w-full py-3.5 text-white font-bold text-sm rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {busy ? (<><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creazione...</>) : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Aggiungi Studente</>)}
          </button>
        </div>

        {/* Students List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Studenti registrati ({students.length})</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto border-gray-200 border-t-[#4F46E5]" />
              <p className="text-xs mt-3 text-gray-400">Caricamento...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Nessuno studente trovato</p>
              <p className="text-xs mt-1 text-gray-400">Aggiungi il tuo primo studente dal form qui sopra</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#4F46E5]">{(s.full_name || s.username).substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.full_name || s.username}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-gray-400">@{s.username}</p>
                      {s.email && <><span className="text-gray-300">·</span><p className="text-[11px] text-gray-400 truncate">{s.email}</p></>}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Iscritto il {s.created_at ? new Date(s.created_at).toLocaleDateString('it') : 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-300">—</p>
                      <p className="text-[10px] text-gray-400">progresso</p>
                    </div>
                    {deleteTarget === s.id ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">Conferma</button>
                        <button onClick={() => setDeleteTarget(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-400 border border-gray-100">Annulla</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteTarget(s.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
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
