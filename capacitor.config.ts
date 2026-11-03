import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.harrissoftwaresolutions.simapp',
  appName: 'Scripture in Music',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: false,
  },
};

export default config;
