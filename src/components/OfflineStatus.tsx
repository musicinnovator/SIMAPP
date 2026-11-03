import React, { useEffect, useState } from 'react';
import { CloudOff, ShieldCheck } from 'lucide-react';
import { isElectron } from '../services/platform';

export function OfflineStatus() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' || navigator.onLine !== false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const label = isElectron() || !online ? 'Local-only mode' : 'Offline-ready';
  const Icon = online && !isElectron() ? ShieldCheck : CloudOff;

  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-100 sm:flex" title="Your scripture and practice data can be stored locally.">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
