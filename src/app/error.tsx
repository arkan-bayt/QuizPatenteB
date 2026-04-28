'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the full error for debugging
    console.error('Page error boundary caught:', error);
  }, [error]);

  // Extract a safe error message
  let errorMsg = 'Errore sconosciuto';
  try {
    if (error && typeof error.message === 'string') {
      errorMsg = error.message;
    } else if (error && typeof error.toString === 'function') {
      const str = error.toString();
      if (typeof str === 'string' && str !== '[object Object]') errorMsg = str;
    }
  } catch { /* ignore */ }

  const isReact310 = errorMsg.includes('Objects are not valid') || errorMsg.includes('#310');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Errore</h1>
        <p className="text-muted-foreground">
          Si è verificato un errore nel caricamento della pagina.
        </p>

        {isReact310 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-left">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-2">
              Dati corrotti rilevati
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              I dati salvati nel browser potrebbero essere corrotti. Clicca &quot;Cancella dati e ricarica&quot; per risolvere il problema.
            </p>
          </div>
        )}

        {errorMsg && !isReact310 && (
          <div className="bg-card border rounded-xl p-4 text-left">
            <p className="text-xs font-mono text-red-500 break-all">{errorMsg}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Riprova
          </button>
          {isReact310 && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const keysToRemove: string[] = [];
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('patente-b-') || key.startsWith('quiz-patente-'))) {
                      keysToRemove.push(key);
                    }
                  }
                  keysToRemove.forEach(k => localStorage.removeItem(k));
                  window.location.reload();
                }
              }}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              Cancella dati e ricarica
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
