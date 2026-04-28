'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorInfo = this.state.error?.message || 'Unknown error';
      const errorStack = this.state.error?.stack || '';

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
            <h1 className="text-2xl font-bold text-foreground">Si è verificato un errore</h1>
            <p className="text-muted-foreground">
              Qualcosa è andato storto. Prova a ricaricare la pagina.
            </p>
            <div className="bg-card border rounded-xl p-4 text-left">
              <p className="text-xs font-mono text-red-500 break-all">
                {errorInfo}
              </p>
              {errorStack && (
                <pre className="mt-2 text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                  {errorStack.split('\n').slice(0, 15).join('\n')}
                </pre>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                Riprova
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Clear all quiz-related localStorage keys
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
                className="px-6 py-3 rounded-xl bg-muted hover:bg-accent font-medium transition-colors"
              >
                Cancella dati e ricomincia
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
