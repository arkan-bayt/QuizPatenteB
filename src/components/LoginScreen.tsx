'use client';
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { login, saveSession } from '@/logic/authEngine';
import { loadCloudProgress } from '@/logic/progressEngine';

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
    if (res.ok && res.user) {
      saveSession(res.user);
      setUser(res.user);
      // Load cloud progress before navigating
      setBusy(true);
      await loadCloudProgress(res.user.username);
      setBusy(false);
      // Role-based routing
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
    <div className="min-h-screen bg-mesh-login flex items-center justify-center p-5 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-40 h-40 rounded-full anim-float" style={{ background: 'var(--primary-100)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-24 right-8 w-48 h-48 rounded-full anim-float" style={{ background: 'var(--success-100)', filter: 'blur(60px)', animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full anim-float" style={{ background: 'var(--accent-100)', filter: 'blur(60px)', animationDelay: '3s' }} />

      <div className="w-full max-w-[400px] relative z-10 anim-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[88px] h-[88px] rounded-[22px] mb-6 relative"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)' }}>
            <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] animate-pulse" style={{ borderColor: 'var(--bg-primary)' }} />
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Quiz Patente B</h1>
          <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>7.139 domande ufficiali &middot; 25 capitoli</p>
        </div>

        {/* Login Card */}
        <div className="glass p-7" style={{ boxShadow: 'var(--shadow-2xl)' }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="icon-box icon-box-primary w-9 h-9">
              <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>Accedi al tuo account</h2>
          </div>

          {authError && (
            <div className="feedback-wrong p-3.5 mb-5 anim-slide-down">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold mb-2.5 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Username</label>
              <div className={`relative transition-all duration-300 ${focused === 'username' ? 'scale-[1.01]' : ''}`}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
              <label className="block text-[11px] font-bold mb-2.5 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className={`relative transition-all duration-300 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors" style={{ color: 'var(--text-muted)' }}>
                  {showPw
                    ? <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full mt-2 text-[15px]">
              {busy ? (
                <span className="flex items-center justify-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifica...
                </span>
              ) : 'Accedi'}
            </button>
          </form>
        </div>

        {/* System Status */}
        <div className="text-center mt-8 space-y-1.5">
          <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Quiz Patente B v3.0 &middot; Open Source</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
