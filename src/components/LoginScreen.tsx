'use client';
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { login, saveSession } from '@/logic/authEngine';
import { loadCloudProgress, startAutoSync, getThemePreference } from '@/logic/progressEngine';

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
    if (res.ok && res.user) {
      // Save session with optional session_token (handles both old and new API response formats)
      saveSession(res.user, res.session_token);
      setUser(res.user);
      setBusy(true);
      await loadCloudProgress(res.user.username);
      setBusy(false);
      // Apply theme preference from cloud data
      const savedTheme = getThemePreference(res.user.username);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
      // Start auto-sync with correct username
      startAutoSync(res.user.username);
      // Route based on role
      if (res.user.role === 'super_admin' || res.user.role === 'admin') {
        setScreen('home');
      } else if (res.user.role === 'teacher') {
        setScreen('teacherDashboard');
      } else if (res.user.role === 'student') {
        setScreen('studentDashboard');
      } else {
        setScreen('home');
      }
    }
    else setAuthError(res.msg);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-[400px] anim-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl mb-5 bg-[#4F46E5]">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Quiz Patente B</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Piattaforma per la preparazione all&apos;esame della patente B</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border shadow-sm p-7" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Accedi al tuo account</h2>

          {authError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 mb-5 anim-slide-down">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none transition-all text-sm"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="Il tuo username"
                autoComplete="username"
                onFocus={(e) => { e.target.style.borderColor = '#818CF8'; e.target.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 pr-11 outline-none transition-all text-sm"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder="La tua password"
                  autoComplete="current-password"
                  onFocus={(e) => { e.target.style.borderColor = '#818CF8'; e.target.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPw
                    ? <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="w-full mt-2 py-3.5 text-white font-semibold text-sm rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50">
              {busy ? (
                <span className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifica...
                </span>
              ) : 'Accedi'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Quiz Patente B v3.0 · Open Source</p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
