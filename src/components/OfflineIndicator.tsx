import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-amber-600/95 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-amber-400/30 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Offline Mode — Using cached data & local storage</span>
      <div className="flex items-center gap-1 bg-amber-700/80 px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-bold">
        <Database className="w-3 h-3" />
        Offline Ready
      </div>
    </div>
  );
};
