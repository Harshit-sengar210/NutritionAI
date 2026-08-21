import React from 'react';

export const AuthVisual = () => {
  return (
    <div className="relative w-full max-w-md aspect-square flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      
      {/* Abstract Glowing Background */}
      <div className="absolute inset-0 bg-green-50 rounded-full blur-3xl opacity-50 animate-glow" />
      
      {/* Central Circle */}
      <div className="relative z-10 w-64 h-64 rounded-full border border-green-100 bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-green-100/20">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-50 to-white shadow-inner flex items-center justify-center relative">
          
          {/* Decorative Rings */}
          <div className="absolute inset-2 border border-green-200/50 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
          
          {/* Main Leaf Symbol */}
          <svg className="w-16 h-16 text-green-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C12 22 4 16 4 9C4 4 9 2 12 2C15 2 20 4 20 9C20 16 12 22 12 22ZM12 4C10 4 6 5.5 6 9C6 14.5 12 19 12 19C12 19 18 14.5 18 9C18 5.5 14 4 12 4Z" opacity="0.2"/>
            <path d="M12 22C12 22 4 16 4 9C4 4 9 2 12 2C15 2 20 4 20 9C20 16 12 22 12 22ZM12 4C10.5 4 8 5.5 8 9C8 13.5 12 17.5 12 17.5V4Z"/>
          </svg>

        </div>
      </div>

      {/* Floating Nutrition Cards */}
      <div className="absolute z-20 top-8 left-0 animate-float bg-white/80 backdrop-blur-md border border-stone-100 rounded-2xl p-3 shadow-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">
          🔥
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-stone-700">320 kcal</span>
          <span className="text-[10px] text-stone-400">Breakfast</span>
        </div>
      </div>

      <div className="absolute z-20 bottom-12 right-0 animate-float-delayed bg-white/80 backdrop-blur-md border border-stone-100 rounded-2xl p-3 shadow-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xs">
          💧
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-stone-700">Hydration</span>
          <span className="text-[10px] text-stone-400">On track</span>
        </div>
      </div>

      {/* AI Sparkles */}
      <svg className="absolute z-20 top-16 right-16 w-6 h-6 text-emerald-400 animate-sparkle" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      <svg className="absolute z-20 bottom-24 left-12 w-4 h-4 text-green-300 animate-sparkle-delayed" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      
    </div>
  );
};
