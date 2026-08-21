"use client";

import React, { useEffect, useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

export const NutritionHero = () => {
  const { profile, todaysMeals } = useNutrition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const targetCalories = profile.nutritionTargets.calories;
  const consumedCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const remaining = Math.max(0, targetCalories - consumedCalories);
  
  // Calculate percentage for circular progress
  const percentage = Math.min(100, Math.round((consumedCalories / targetCalories) * 100)) || 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-10 group-hover:bg-green-50 transition-colors duration-1000" />

      <div className="w-full flex justify-between items-center mb-6 z-10">
        <h2 className="text-lg font-semibold text-stone-900">Today&apos;s Nutrition</h2>
        <span className="text-sm font-medium text-stone-500 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
          {consumedCalories} / {targetCalories} kcal
        </span>
      </div>

      <div className="relative w-56 h-56 flex items-center justify-center my-4 z-10">
        {/* SVG Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-stone-100"
          />
          {/* Progress track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            className="text-green-500 drop-shadow-sm transition-all duration-1000 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: mounted ? strokeDashoffset : circumference
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center animate-fade-in">
          <span className="text-4xl font-bold text-stone-900 tracking-tight">
            {consumedCalories}
          </span>
          <span className="text-sm font-medium text-stone-500 uppercase tracking-wider mt-1">
            kcal consumed
          </span>
        </div>
      </div>

      <div className="mt-4 z-10 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <p className="font-medium text-stone-600">
          <span className="text-green-600 font-semibold">{remaining} kcal</span> remaining
        </p>
      </div>
    </div>
  );
};
