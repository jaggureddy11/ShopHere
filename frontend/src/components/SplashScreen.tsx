'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check sessionStorage to only show splash once per session
    const hasPlayed = sessionStorage.getItem('splash-played');
    if (!hasPlayed) {
      setIsVisible(true);
      // Lock scroll while splash is active
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAnimationComplete = () => {
    // Unlock scroll and record that the splash has played
    document.body.style.overflow = '';
    sessionStorage.setItem('splash-played', 'true');
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      // Auto-close splash after 2.5 seconds (leaving time for the exit animation)
      const timer = setTimeout(() => {
        handleAnimationComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isMounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 bg-white z-[99999] flex flex-col items-center justify-center"
        >
          {/* Logo and Text Content Wrapper */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Logo Zoom-in */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-28 md:w-36 md:h-36 mb-6"
            >
              <Image
                src="/logo.png"
                alt="Shop Here Logo"
                fill
                className="object-contain mix-blend-multiply"
                priority
              />
            </motion.div>

            {/* Brand Name reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 15, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-premium text-2xl md:text-3xl font-black uppercase text-primary"
            >
              Shop Here
            </motion.h1>

            {/* Thin minimalist line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="h-[1px] bg-primary/20 my-4"
            />

            {/* Developer Credits caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-outline"
            >
              Developed by Jaggu
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
