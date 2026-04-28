import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Patente B - Preparati all\'esame',
  description: 'Applicazione per esercitarsi con le domande dell\'esame della patente B italiana',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-blue-900 antialiased">
        {children}
      </body>
    </html>
  );
}
