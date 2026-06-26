'use client';

import React, { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-primary px-4 text-center">
      <span className="material-symbols-outlined text-5xl mb-6 text-red-600">report</span>
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none">
        System Interruption
      </h1>
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-8 max-w-sm leading-relaxed">
        An unexpected error occurred while compiling this view layout.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-none"
        >
          Attempt Reload
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="border border-primary text-primary px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white active:scale-95 transition-all rounded-none"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
