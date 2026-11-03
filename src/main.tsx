import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/professional-theme-global.css';
import './styles/simapp-depth.css';

// ADDITIVE: Register Service Worker for PWA support
import { registerServiceWorker, isPWA } from './utils/registerServiceWorker';
import { isElectron } from './services/platform';

// Make validator tests available in console for testing
import { runTempoValidatorTests } from './utils/tempoValidator.test';
import { runPreferencesValidatorTests } from './utils/preferencesValidator.test';
import { runVoicingPatternsTests } from './utils/voicingPatterns.test';

if (typeof window !== 'undefined') {
  (window as any).runTempoValidatorTests = runTempoValidatorTests;
  (window as any).runPreferencesValidatorTests = runPreferencesValidatorTests;
  (window as any).runVoicingPatternsTests = runVoicingPatternsTests;
  console.log('💡 Tempo tests available. Run in console: runTempoValidatorTests()');
  console.log('💡 Preferences tests available. Run in console: runPreferencesValidatorTests()');
  console.log('💡 Voicing patterns tests available. Run in console: runVoicingPatternsTests()');

  // ADDITIVE: Register service worker for offline support
  if (!isElectron()) {
    registerServiceWorker();
  }

  // ADDITIVE: Check if running as PWA
  if (isPWA()) {
    console.log('📱 Running as Progressive Web App');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
