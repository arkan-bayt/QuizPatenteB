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
  const [busy, setBusy] = useState(false);

  const loadUsers = async () => {
    const u = await getAllUsers();
    setUsers(u);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleAdd = async () => {
    setBusy(true);
    const res = await addUser(newUser, newPw, newRole);
    setMsg(res.msg);
    if (res.ok) { setNewUser(''); setNewPw(''); loadUsers(); }
    setBusy(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleToggleRole = async (u: AppUser) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    const res = await updateUserRole(u.id, newRole);
    setMsg(res.msg);
    loadUsers();
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (u: AppUser) => {
    if (!confirm(`Eliminare l'utente ${u.username}?`)) return;
    const res = await deleteUser(u.id);
    setMsg(res.msg);
    loadUsers();
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => store.setScreen('home')} className="text-[var(--t2)] hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <h1 className="text-base font-bold text-white">Gestione Utenti</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {msg && (
          <div className={`p-3 rounded-xl text-sm text-center anim-scale ${msg.includes('success') || msg.includes('successo') || msg.includes('creato') || msg.includes('aggiornato') || msg.includes('eliminato') ? 'bg-green-500/10 text-green-300 border border-green-500/15' : 'bg-red-500/10 text-red-300 border border-red-500/15'}`}>
            {msg}
          </div>
        )}

        {/* Add user form */}
        <div className="card p-5 anim-up">
          <h2 className="text-sm font-semibold text-white mb-4">Aggiungi Utente</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={newUser} onChange={(e) => setNewUser(e.target.value)} className="input text-sm" placeholder="Username" />
            <input value={newPw} onChange={(e) => setNewPw(e.target.value)} type="password" className="input text-sm" placeholder="Password" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-[var(--t3)]">Ruolo:</span>
            <button onClick={() => setNewRole('admin')} className={`badge px-3 py-1 cursor-pointer transition-colors ${newRole === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-[var(--t3)] border border-[var(--border)]'}`}>Admin</button>
            <button onClick={() => setNewRole('user')} className={`badge px-3 py-1 cursor-pointer transition-colors ${newRole === 'user' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-[var(--t3)] border border-[var(--border)]'}`}>Utente</button>
          </div>
          <button onClick={handleAdd} disabled={busy || !newUser.trim() || !newPw.trim()} className="btn-indigo w-full text-sm">Aggiungi Utente</button>
        </div>

        {/* Users list */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[var(--t3)] uppercase tracking-widest px-1">Utenti registrati ({users.length})</h2>
          {users.map((u) => (
            <div key={u.id} className="card p-4 flex items-center gap-3 anim-up">
              <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-indigo-300">{u.username[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{u.username}</p>
                <p className="text-[11px] text-[var(--t3)]">{u.role === 'admin' ? 'Amministratore' : 'Utente'} &middot; {new Date(u.created_at).toLocaleDateString('it')}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleToggleRole(u)} className="badge px-2.5 py-1 cursor-pointer border border-[var(--border)] hover:bg-white/5 transition-colors">
                  {u.role === 'admin' ? <span className="text-indigo-300">Admin</span> : <span className="text-amber-300">User</span>}
                </button>
                {u.username !== 'arkan' && (
                  <button onClick={() => handleDelete(u)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/15 transition-colors text-[var(--t3)] hover:text-red-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-[var(--t3)] text-sm">Nessun utente trovato</p>
              <p className="text-[var(--t3)] text-[11px] mt-1">Assicurati che la tabella app_users esista in Supabase</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
