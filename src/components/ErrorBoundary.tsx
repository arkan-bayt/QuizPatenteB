'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function safeErrorMessage(error: Error | null): string {
  if (!error) return 'Unknown error';
  // Ensure we always return a string, never an object
  if (typeof error.message === 'string') {
    return error.message;
  }
  if (typeof error.toString === 'function') {
    try {
      const str = error.toString();
      if (typeof str === 'string' && str !== '[object Object]') return str;
    } catch { /* ignore */ }
  }
  // Fallback: stringify the error, extracting only string-safe info
  try {
    return JSON.stringify({ message: error.message, name: error.name });
  } catch {
    return 'An unexpected error occurred';
  }
}

function safeErrorStack(error: Error | null): string {
  if (!error) return '';
  if (typeof error.stack === 'string') return error.stack;
  return '';
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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearAndReload = () => {
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

  render() {
    if (this.state.hasError) {
      const errorInfo = safeErrorMessage(this.state.error);
      const errorStack = safeErrorStack(this.state.error);

      const isReact310 = errorInfo.includes('Objects are not valid') || errorInfo.includes('#310');

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
            {isReact310 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-left">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                  Dati corrotti rilevati - React Error #310
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  I dati salvati nel browser contengono valori non validi. Usa &quot;Cancella dati e ricomincia&quot; per risolvere.
                </p>
              </div>
            )}
            {errorInfo && !isReact310 && (
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
            )}
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                Riprova
              </button>
              <button
                onClick={this.handleClearAndReload}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
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
