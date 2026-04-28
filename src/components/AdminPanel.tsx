'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { AppUser } from '@/data/supabaseClient';
import { getAllUsers, addUser, updateUserRole, deleteUser } from '@/logic/authEngine';

export default function AdminPanel() {
  const store = useStore();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [newUser, setNewUser] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [busy, setBusy] = useState(false);

  const loadUsers = async () => {
    const u = await getAllUsers();
    setUsers(u);
  };

  useEffect(() => { loadUsers(); }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleAdd = async () => {
    setBusy(true);
    const res = await addUser(newUser, newPw, newRole);
    if (res.ok) {
      showMsg('Utente creato con successo', 'success');
      setNewUser(''); setNewPw(''); loadUsers();
    } else {
      showMsg(res.msg, 'error');
    }
    setBusy(false);
  };

  const handleToggleRole = async (u: AppUser) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    const res = await updateUserRole(u.id, newRole);
    showMsg(res.msg, res.ok ? 'success' : 'error');
    loadUsers();
  };

  const handleDelete = async (u: AppUser) => {
    if (!confirm(`Eliminare l'utente ${u.username}?`)) return;
    const res = await deleteUser(u.id);
    showMsg(res.msg, res.ok ? 'success' : 'error');
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)]" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.setScreen('home')}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-[var(--border)] hover:bg-white/[0.08] transition-all duration-200">
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-[15px] font-bold text-white">Gestione Utenti</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-5">
        {/* Message toast */}
        {msg && (
          <div className={`p-4 rounded-2xl text-sm text-center anim-scale flex items-center justify-center gap-2 ${msgType === 'success' ? 'feedback-correct' : 'feedback-wrong'}`}>
            {msgType === 'success'
              ? <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              : <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            }
            <span className={msgType === 'success' ? 'text-green-300' : 'text-red-300'}>{msg}</span>
          </div>
        )}

        {/* Add User Card */}
        <div className="glass p-6 anim-up" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h2 className="text-[14px] font-bold text-white">Aggiungi Utente</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[var(--text-muted)] text-[10px] font-bold mb-2 uppercase tracking-[0.15em]">Username</label>
              <input value={newUser} onChange={(e) => setNewUser(e.target.value)} className="input-modern text-sm" placeholder="Username" />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-[10px] font-bold mb-2 uppercase tracking-[0.15em]">Password</label>
              <input value={newPw} onChange={(e) => setNewPw(e.target.value)} type="password" className="input-modern text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Ruolo:</span>
            <button onClick={() => setNewRole('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer ${newRole === 'admin' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:bg-white/[0.04]'}`}>
              Admin
            </button>
            <button onClick={() => setNewRole('user')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer ${newRole === 'user' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:bg-white/[0.04]'}`}>
              Utente
            </button>
          </div>

          <button onClick={handleAdd} disabled={busy || !newUser.trim() || !newPw.trim()} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
            {busy ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creazione...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Aggiungi Utente
              </>
            )}
          </button>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Utenti registrati ({users.length})</h2>
          </div>

          {users.map((u, i) => (
            <div key={u.id} className="glass p-4 flex items-center gap-4 anim-up" style={{ animationDelay: `${i * 40}ms` }}>
              {/* Avatar */}
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))' : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))', border: `1px solid ${u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.12)'}` }}>
                <span className={`text-sm font-bold ${u.role === 'admin' ? 'text-indigo-300' : 'text-amber-300'}`}>{u.username[0].toUpperCase()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-white">{u.username}</p>
                  {u.username === 'arkan' && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Super Admin</span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {u.role === 'admin' ? 'Amministratore' : 'Utente'} &middot; {u.created_at ? new Date(u.created_at).toLocaleDateString('it') : 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleRole(u)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'}`}>
                  {u.role === 'admin' ? 'Admin' : 'User'}
                </button>
                {u.username !== 'arkan' && (
                  <button onClick={() => handleDelete(u)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/10 transition-all duration-200 text-[var(--text-muted)] hover:text-red-300 border border-transparent hover:border-red-500/15">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="glass p-10 text-center">
              <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-[var(--text-muted)] text-sm font-medium">Nessun utente trovato</p>
              <p className="text-[var(--text-muted)] text-[11px] mt-1">Assicurati che la tabella app_users esista in Supabase</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
