'use client';

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    // Collect as much error info as possible
    let info = '';
    try {
      if (error) {
        info += 'Message: ' + String(error.message || 'none') + '\n';
        info += 'Name: ' + String(error.name || 'none') + '\n';
        info += 'Digest: ' + String(error.digest || 'none') + '\n';
        if (error.stack) info += 'Stack: ' + String(error.stack).slice(0, 2000) + '\n';
        try {
          const keys = Object.getOwnPropertyNames(error);
          info += 'Keys: ' + keys.join(', ') + '\n';
          for (const k of keys) {
            if (k === 'message' || k === 'stack' || k === 'name') continue;
            try {
              info += k + ': ' + JSON.stringify(error[k as keyof Error]).slice(0, 500) + '\n';
            } catch { /* skip */ }
          }
        } catch { /* skip */ }
      }
    } catch (e) {
      info += 'Failed to read error: ' + String(e);
    }
    setDetails(info);
    console.error('[ERROR_PAGE] Full error details:', info);

    // Try to log localStorage state for debugging
    try {
      console.log('[ERROR_PAGE] localStorage keys:', 
        Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter(k => k?.includes('patente') || k?.includes('quiz'))
      );
    } catch { /* ignore */ }
  }, [error]);

  const handleClearAndReload = () => {
    if (typeof window !== 'undefined') {
      // Clear ALL quiz-related localStorage keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('patente-b-') || key.startsWith('quiz-patente-') || key.startsWith('quiz-session-'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const isReact310 = error?.message?.includes('Objects are not valid') || error?.message?.includes('#310');

  const errorMsg = error?.message || 'Unknown error';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full text-center space-y-6">
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
            <p className="text-sm text-amber-700 dark:text-amber-400 font-bold mb-2">
              Dati non validi rilevati (React #310)
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Un oggetto sta venendo renderizzato come testo. Apri la console del browser (F12) e cerca i messaggi &quot;REACT_310_INTERCEPT&quot; per vedere il dettaglio.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
              Clicca &quot;Cancella dati e ricarica&quot; per resettare completamente l&apos;app.
            </p>
          </div>
        )}

        {/* ALWAYS show the error message */}
        <div className="bg-card border rounded-xl p-4 text-left">
          <p className="text-sm font-bold mb-2 text-red-600">Dettagli errore:</p>
          <p className="text-xs font-mono text-red-500 break-all">{errorMsg}</p>
          {details && (
            <pre className="mt-3 text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-48 overflow-y-auto bg-muted/50 rounded-lg p-2">
              {details}
            </pre>
          )}
        </div>

        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Riprova
          </button>
          <button
            onClick={handleClearAndReload}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Cancella dati e ricarica
          </button>
        </div>
      </div>
    </div>
  );
}
