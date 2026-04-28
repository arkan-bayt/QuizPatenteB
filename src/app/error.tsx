'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          Si è verificato un errore. Prova a ricaricare la pagina.
        </p>
        {error?.message && (
          <div className="bg-card border rounded-xl p-4 text-left">
            <p className="text-xs font-mono text-red-500 break-all">
              {String(error.message)}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={() => {
              // Clear quiz data and reload
              try {
                const keys: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && (key.startsWith('quiz-') || key.startsWith('patente-'))) {
                    keys.push(key);
                  }
                }
                keys.forEach(k => localStorage.removeItem(k));
              } catch { /* ignore */ }
              window.location.reload();
            }}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Cancella dati e ricarica
          </button>
        </div>
      </div>
    </div>
  );
}
