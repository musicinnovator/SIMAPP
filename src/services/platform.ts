export function isElectron(): boolean {
  return typeof window !== 'undefined' && Boolean(window.simappDesktop);
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

export function getPlatformLabel(): 'desktop' | 'mobile' | 'web' {
  if (isElectron()) return 'desktop';
  if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return 'mobile';
  return 'web';
}
