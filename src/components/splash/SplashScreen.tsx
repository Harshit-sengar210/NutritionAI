"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NutritionLogo } from '../brand/NutritionLogo';

export const SplashScreen = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Initializing system...",
    "Loading nutrition database...",
    "Calibrating personalized targets...",
    "Preparing your experience..."
  ];

  useEffect(() => {
    // Animation sequence timings
    const timers = [
      setTimeout(() => setStage(1), 100),   // Step 1: Background & logo scale/fade
      setTimeout(() => setStage(2), 600),   // Step 2: Glow appears
      setTimeout(() => setStage(3), 1100),  // Step 5 & 6: Text fades/slides up
      setTimeout(() => setStage(4), 1600),  // Step 7: Loading indicator appears
      
      // Navigate to /auth after the progress bar animation completes (~1.5s) + some buffer
      setTimeout(() => {
        router.push('/auth');
      }, 3500)
    ];

    // Loading text cycler
    let textInterval: NodeJS.Timeout;
    if (stage >= 4) {
      let currentIndex = 0;
      textInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingMessages.length;
        setLoadingTextIndex(currentIndex);
      }, 500);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (textInterval) clearInterval(textInterval);
    };
  }, [router, stage]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Large blurred circular gradient */}
        <div 
          className={`absolute w-[600px] h-[600px] rounded-full bg-green-100/40 blur-3xl transition-opacity duration-1000 ${
            stage >= 2 ? 'opacity-100 animate-glow' : 'opacity-0'
          }`} 
        />
        {/* Soft radial glow at top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-50/50 blur-3xl" />
        {/* Soft radial glow at bottom left */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-green-50/50 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        
        {/* Logo Container */}
        <div 
          className={`mb-8 transition-all duration-1000 ease-out ${
            stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <NutritionLogo className="w-24 h-24 md:w-28 md:h-28" />
        </div>

        {/* Text Content */}
        <div className="text-center flex flex-col items-center space-y-3">
          <h1 
            className={`text-4xl md:text-5xl font-semibold text-stone-900 tracking-tight transition-all duration-700 ease-out ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Nutrition AI
          </h1>
          
          <p 
            className={`text-base md:text-lg text-stone-500 font-medium max-w-xs transition-all duration-700 ease-out delay-150 ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Your intelligent companion for better nutrition.
          </p>
        </div>

      </div>

      {/* Loading Indicator */}
      <div 
        className={`absolute bottom-16 md:bottom-24 w-full px-8 max-w-sm flex flex-col items-center space-y-5 transition-all duration-1000 ${
          stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-full h-1.5 bg-stone-200/50 rounded-full overflow-hidden shadow-inner relative backdrop-blur-sm">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 rounded-full animate-progress">
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/40 blur-[2px] animate-shimmer" />
          </div>
        </div>
        <div className="h-4 relative w-full flex justify-center">
          {loadingMessages.map((msg, idx) => (
            <p 
              key={idx}
              className={`absolute text-xs font-bold text-stone-400 uppercase tracking-[0.2em] transition-all duration-500 text-center w-full ${
                loadingTextIndex === idx ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-2'
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
      
    </div>
  );
};
