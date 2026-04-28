'use client';

import dynamic from 'next/dynamic';

const QuizApp = dynamic(() => import('@/components/QuizApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Caricamento quiz...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <QuizApp />;
}
