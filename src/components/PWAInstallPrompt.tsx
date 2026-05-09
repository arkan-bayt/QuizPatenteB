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

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('qp_pwa_dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Don't show again for 7 days after dismissal
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a small delay so it doesn't feel intrusive
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch { /* */ }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('qp_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 anim-up" style={{ padding: '0 16px 24px' }}>
      <div className="max-w-md mx-auto glass p-4" style={{
        borderRadius: 'var(--radius-2xl)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.15), 0 0 0 1px var(--border)',
        background: 'var(--bg-card)',
      }}>
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1E3A8A, #4F46E5)', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}>
            <span className="text-white text-lg font-black">QB</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Installa Quiz Patente B
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Accedi velocemente dalla schermata home. Funziona anche offline!
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button onClick={handleInstall}
                className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #1E3A8A, #4F46E5)', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.25)' }}>
                Installa
              </button>
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
