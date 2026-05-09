'use client';
import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    // Also check navigator.standalone for iOS Safari
    if ('standalone' in navigator && (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('qp_pwa_dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Don't show again for 3 days after dismissal
      if (Date.now() - dismissedAt < 3 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a small delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setShowManual(false);
      setDeferredPrompt(null);
    });

    // If after 5 seconds no beforeinstallprompt fired, show manual instructions
    // (for browsers like iOS Safari that don't support beforeinstallprompt)
    const manualTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        // On Android without beforeinstallprompt, we can still show Chrome menu instructions
        const isAndroid = /Android/.test(navigator.userAgent);
        if (isIOS || isAndroid) {
          setShowPrompt(true);
        }
      }
    }, 6000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(manualTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
      } catch { /* */ }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // No deferred prompt - show manual instructions
      setShowManual(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManual(false);
    localStorage.setItem('qp_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  // Detect platform for manual instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Manual install instructions
  if (showManual) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center anim-up" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={handleDismiss}>
        <div className="w-full max-w-md p-4 pb-8" onClick={e => e.stopPropagation()}>
          <div className="glass p-5" style={{
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--bg-card)',
          }}>
            <h3 className="text-[16px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              📱 Installa l&apos;app
            </h3>

            {isIOS ? (
              <div className="space-y-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                <p>Per installare l&apos;app su iPhone:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Tocca il pulsante <strong>Condividi</strong> <span style={{ fontSize: '18px' }}>⬆️</span> in basso</li>
                  <li>Scorri e tocca <strong>&quot;Aggiungi alla Home&quot;</strong></li>
                  <li>Tocca <strong>&quot;Aggiungi&quot;</strong></li>
                </ol>
              </div>
            ) : isAndroid ? (
              <div className="space-y-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                <p>Per installare l&apos;app su Android:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Tocca il menu <strong>⋮</strong> in alto a destra di Chrome</li>
                  <li>Tocca <strong>&quot;Installa app&quot;</strong> o <strong>&quot;Aggiungi alla schermata Home&quot;</strong></li>
                  <li>Conferma con <strong>&quot;Installa&quot;</strong></li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                <p>Per installare l&apos;app:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Clicca l&apos;icona <strong>di installazione</strong> nella barra degli indirizzi</li>
                  <li>Oppure vai nel menu del browser e seleziona <strong>&quot;Installa app&quot;</strong></li>
                </ol>
              </div>
            )}

            <button onClick={handleDismiss}
              className="w-full mt-4 py-2.5 rounded-xl text-[14px] font-medium"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              Ho capito
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 anim-up" style={{ padding: '0 16px 24px' }}>
      <div className="max-w-md mx-auto glass p-4" style={{
        borderRadius: 'var(--radius-2xl)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.15), 0 0 0 1px var(--border)',
        background: 'var(--bg-card)',
      }}>
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1E3A8A, #4F46E5)', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}>
            <img src="/icons/icon-192x192.png" alt="" className="w-full h-full object-cover rounded-xl" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white text-lg font-black">QB</span>';
            }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Installa Quiz Patente B
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Accedi velocemente dalla schermata home. Funziona anche offline!
            </p>

            <div className="flex items-center gap-2 mt-3">
              {deferredPrompt ? (
                <button onClick={handleInstall}
                  className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A, #4F46E5)', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.25)' }}>
                  Installa
                </button>
              ) : (
                <button onClick={handleInstall}
                  className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A, #4F46E5)', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.25)' }}>
                  Come installare
                </button>
              )}
              <button onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                Dopo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
