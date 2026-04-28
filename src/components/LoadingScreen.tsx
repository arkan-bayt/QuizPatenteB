'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative inline-block mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
        <p className="text-slate-400 text-sm">Caricamento quiz...</p>
      </div>
    </div>
  );
}
