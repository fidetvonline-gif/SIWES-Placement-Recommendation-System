import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '', variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running inside standalone app, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow with active prompt
  if (isInstallable) {
    if (variant === 'hero') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
          <Download className="w-5 h-5 animate-bounce" />
          <span>{installing ? 'Installing...' : 'Install Web App'}</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={installing}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-all shadow-sm active:scale-95 ${className}`}
        title="Install SIWES Portal to your device for instant offline access"
      >
        <Download className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">{installing ? 'Installing...' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow with step-by-step instructions
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300/80 transition-all ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-500">Add SIWES Portal to Home Screen</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-indigo-600" /> located at the bottom or top of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <p>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <p>
                    Tap <strong>"Add"</strong> in the top right to complete installation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
