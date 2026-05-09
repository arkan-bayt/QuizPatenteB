import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Patente B - 7139 Domande Ufficiali',
  description: 'Preparati all\'esame della patente B con 7139 domande aggiornate al 2024. Allenati, impara e supera l\'esame al primo tentativo.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QuizPatente',
  },
  openGraph: {
    type: 'website',
    title: 'Quiz Patente B',
    description: 'Preparati all\'esame della patente B con 7139 domande aggiornate al 2024.',
    siteName: 'Quiz Patente B',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E3A8A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QuizPatente" />
        <meta name="application-name" content="Quiz Patente B" />
        <meta name="msapplication-TileColor" content="#1E3A8A" />
        <meta name="msapplication-navbutton-color" content="#1E3A8A" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
