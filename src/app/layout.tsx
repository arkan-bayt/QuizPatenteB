import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Patente B - 7139 Domande Ufficiali',
  description: 'Preparati all\'esame della patente B con 7139 domande aggiornate al 2024.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="antialiased" style={{ background: '#0a0a0f' }}>
        {children}
      </body>
    </html>
  );
}
