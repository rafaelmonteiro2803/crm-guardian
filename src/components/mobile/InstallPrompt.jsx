import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after 2 sessions or explicit user action
      const sessionCount = parseInt(sessionStorage.getItem('pwa-sessions') || '0') + 1;
      sessionStorage.setItem('pwa-sessions', sessionCount);

      if (sessionCount >= 2) {
        // Delay prompt slightly
        setTimeout(() => setShowPrompt(true), 1000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
      sessionStorage.removeItem('pwa-sessions');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-s5 right-s5 z-50 animate-slide-up">
      <Card thick padding="s5" variant="accent">
        <div className="space-y-s4">
          <div className="flex items-start justify-between gap-s3">
            <div className="flex items-center gap-s3">
              <Download className="text-accent-ink flex-shrink-0" size={24} />
              <div>
                <p className="text-body font-bold text-accent-ink">Instalar Guardian</p>
                <p className="text-xs text-accent-ink opacity-80">Acesso rápido na tela inicial</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-accent-ink active:opacity-60 flex-shrink-0"
              aria-label="Descartar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-s2">
            <Button
              kind="ghost"
              size="sm"
              full
              onClick={handleDismiss}
            >
              Depois
            </Button>
            <Button
              kind="primary"
              size="sm"
              full
              onClick={handleInstall}
            >
              Instalar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
