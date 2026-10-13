import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.socialmediacounter.app',
  appName: 'Viral Counters',
  webDir: 'build',
  plugins: {
    // Native HTTP avoids WebView CORS restrictions when calling Instagram/Google directly
    CapacitorHttp: { enabled: true }
  }
};

export default config;
