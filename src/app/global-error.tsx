'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-3xl font-bold">Errore</h1>
            <p className="text-muted-foreground">Si è verificato un errore imprevisto.</p>
            {error?.message && (
              <p className="text-sm text-red-500 font-mono break-all">{String(error.message)}</p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Ricarica
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
