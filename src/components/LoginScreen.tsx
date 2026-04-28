'use client';
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { login, saveSession } from '@/logic/authEngine';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
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
    <div className="min-h-screen bg-mesh-login flex items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl anim-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl anim-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-cyan-500/5 blur-3xl anim-float" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-[400px] relative z-10 anim-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-3xl mb-6 relative"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.15)' }}>
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quiz Patente B</h1>
          <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">7.139 domande ufficiali &middot; 25 capitoli</p>
        </div>

        {/* Login Card */}
        <div className="glass p-7" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white">Accedi al tuo account</h2>
          </div>

          {authError && (
            <div className="feedback-wrong p-3.5 mb-5 anim-scale">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-[var(--text-muted)] text-[11px] font-bold mb-2.5 uppercase tracking-[0.15em]">Username</label>
              <div className={`relative transition-all duration-300 ${focused === 'username' ? 'scale-[1.01]' : ''}`}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  className="input-modern pl-11"
                  placeholder="Il tuo username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] text-[11px] font-bold mb-2.5 uppercase tracking-[0.15em]">Password</label>
              <div className={`relative transition-all duration-300 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="input-modern pl-11 pr-11"
                  placeholder="La tua password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1">
                  {showPw
                    ? <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full mt-2 text-[15px]">
              {busy ? (
                <span className="flex items-center justify-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifica...
                </span>
              ) : 'Accedi'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 space-y-1">
          <p className="text-[var(--text-muted)] text-[11px]">Quiz Patente B v3.0 &middot; Open Source</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[var(--text-muted)] text-[10px]">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
