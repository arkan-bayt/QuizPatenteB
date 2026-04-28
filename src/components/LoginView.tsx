'use client';

import React, { useState } from 'react';
import { useQuizStore } from '@/lib/quiz-store';

export default function LoginView() {
  const login = useQuizStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Compila tutti i campi');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) {
        setError('Credenziali non valide');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg mx-auto">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Patente B</h1>
          <p className="text-muted-foreground">Accedi per iniziare ad allenarti</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-2xl p-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-60 text-lg"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Programmato da un Iraqiano
        </p>
      </div>
    </div>
  );
}
