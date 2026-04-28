'use client';
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { login, saveSession, loadSession } from '@/logic/authEngine';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const { setAuthError, authError, setUser, setScreen } = useStore();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!username.trim() || !password.trim()) { setAuthError('Inserisci username e password'); return; }
    setBusy(true);
    const res = await login(username, password);
    setBusy(false);
    if (res.ok && res.user) { saveSession(res.user); setUser(res.user); setScreen('home'); }
    else setAuthError(res.msg);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-5">
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-purple-950/20 pointer-events-none" />
      <div className="w-full max-w-[380px] relative z-10 anim-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-indigo-500/10 border border-indigo-500/15 mb-5">
            <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Quiz Patente B</h1>
          <p className="text-[var(--t3)] text-sm mt-1.5">7.139 domande ufficiali &middot; 25 capitoli</p>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Accedi al tuo account</h2>
          {authError && (
            <div className="bg-red-500/10 border border-red-500/15 rounded-xl p-3 mb-4 anim-scale">
              <p className="text-red-400 text-sm text-center">{authError}</p>
            </div>
          )}
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-[var(--t3)] text-[11px] font-semibold mb-2 uppercase tracking-widest">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" autoComplete="username" />
            </div>
            <div>
              <label className="block text-[var(--t3)] text-[11px] font-semibold mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-11" placeholder="Password" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)] hover:text-[var(--t2)] transition-colors p-0.5">
                  {showPw ? <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={busy} className="btn-indigo w-full mt-6 text-[15px]">
              {busy ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Verifica...</span> : 'Accedi'}
            </button>
          </form>
        </div>
        <p className="text-center text-[var(--t3)] text-[11px] mt-8">Quiz Patente B v3.0 &middot; Open Source</p>
      </div>
    </div>
  );
}
