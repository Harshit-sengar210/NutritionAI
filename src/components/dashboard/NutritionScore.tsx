"use client";

import React, { useEffect, useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

export const NutritionScore = () => {
  const { profile, todaysMeals } = useNutrition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const targets = profile.nutritionTargets;
  
  const consumedCalories = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = todaysMeals.reduce((sum, m) => sum + m.protein, 0);

  // Simple algorithm to calculate a score based on how close they are to targets
  // Score out of 100
  let score = 50; // Base score
  
  // Calorie proximity (up to 30 points)
  if (targets.calories > 0) {
    const calRatio = consumedCalories / targets.calories;
    if (calRatio > 0.8 && calRatio < 1.1) score += 30;
    else if (calRatio > 0.5 && calRatio <= 0.8) score += 15;
    else if (calRatio >= 1.1 && calRatio < 1.3) score += 15;
  }

  // Protein proximity (up to 20 points)
  if (targets.protein > 0) {
    const proRatio = consumedProtein / targets.protein;
    if (proRatio >= 0.8) score += 20;
    else if (proRatio >= 0.5) score += 10;
  }

  const normalizedScore = Math.min(100, Math.max(0, score));

  let status = "Needs Work";
  let statusColor = "text-amber-500";
  if (normalizedScore >= 80) {
    status = "Excellent";
    statusColor = "text-green-500";
  } else if (normalizedScore >= 60) {
    status = "Good";
    statusColor = "text-blue-500";
  }

  // Circular math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '700ms' }}>
      
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-1">Nutrition Score</h3>
        <p className={`text-sm font-bold ${statusColor}`}>{status}</p>
        
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-emerald-500 text-base">🔥</span> Calorie balance
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className={consumedProtein > targets.protein * 0.8 ? "text-emerald-500 text-base" : "text-stone-300 text-base"}>
              {consumedProtein > targets.protein * 0.8 ? "💪" : "💪"}
            </span> Protein progress
          </div>
        </div>
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={normalizedScore >= 80 ? "#10b981" : normalizedScore >= 60 ? "#3b82f6" : "#f59e0b"} />
              <stop offset="100%" stopColor={normalizedScore >= 80 ? "#34d399" : normalizedScore >= 60 ? "#60a5fa" : "#fbbf24"} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-100" />
          <circle
            cx="50" cy="50" r={radius} stroke="url(#scoreGradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
            className="drop-shadow-sm transition-all duration-1000 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: mounted ? strokeDashoffset : circumference
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-stone-900">{normalizedScore}</span>
        </div>
      </div>

    </div>
  );
};
