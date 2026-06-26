'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-primary px-4 text-center">
      <span className="material-symbols-outlined text-5xl mb-6 text-outline">error_outline</span>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
        Page Not Found
      </h1>
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-8 max-w-xs leading-relaxed">
        The requested technical layout does not exist or has been archived.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
