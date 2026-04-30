import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quizpatenteb.app',
  appName: 'Quiz Patente B',
  webDir: 'out',
  server: {
    // ضع رابط موقعك على Vercel هنا
    // مثال: url: 'https://quiz-patente-b.vercel.app',
    // بدون رابط سيعمل على localhost للتجربة
    url: 'https://quiz-patente-b.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f172a'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
