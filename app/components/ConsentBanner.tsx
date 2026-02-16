'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating consent button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/consent"
          className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="font-semibold">Digital Consent</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            !
          </div>
        </Link>
      </div>

      {/* Top banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <div className="relative z-10 container mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base">
              🆕 NEW: Digital Signature & Consent Form Available!
            </span>
            <Link 
              href="/consent" 
              className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-bold hover:bg-purple-50 transition-colors"
            >
              Try Now →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}