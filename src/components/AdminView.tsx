'use client';

import React from 'react';
import { useQuizStore } from '@/lib/quiz-store';

export default function AdminView() {
  const setView = useQuizStore((s) => s.setView);

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Impostazioni dell&apos;applicazione</p>
      </div>

      {/* Admin Info Card */}
      <div className="bg-card border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold">Credenziali di accesso</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background">
            <span className="text-muted-foreground">Username</span>
            <span className="font-mono font-medium">arkan</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-background">
            <span className="text-muted-foreground">Password</span>
            <span className="font-mono font-medium">12345</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Le credenziali sono configurate nel codice sorgente. Per cambiarle, modifica il file quiz-store.ts.
        </p>
      </div>

      {/* App Info */}
      <div className="bg-card border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold">Informazioni</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-background">
            <span className="text-muted-foreground">Versione</span>
            <span className="font-medium">2.0.0 (Clean Build)</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-background">
            <span className="text-muted-foreground">Capitoli</span>
            <span className="font-medium">25</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-background">
            <span className="text-muted-foreground">Domande totali</span>
            <span className="font-medium">7,139</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setView('home')}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
      >
        Torna alla Home
      </button>
    </div>
  );
}
