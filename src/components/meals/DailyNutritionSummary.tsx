"use client";

import React, { useEffect, useState } from 'react';
import { Meal } from '@/context/NutritionContext';
import { calculateTotalNutrition } from '@/lib/nutrition/calculations';
import { OnboardingState } from '@/types/onboarding';

interface DailyNutritionSummaryProps {
  meals: Meal[];
  profile: OnboardingState;
}

export const DailyNutritionSummary = ({ meals, profile }: DailyNutritionSummaryProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totals = calculateTotalNutrition(meals);
  const targets = profile.nutritionTargets;

  const metrics = [
    { name: 'Calories', current: totals.calories, target: targets.calories, unit: 'kcal', color: 'bg-green-500', bg: 'bg-green-100' },
    { name: 'Protein', current: totals.protein, target: targets.protein, unit: 'g', color: 'bg-rose-500', bg: 'bg-rose-100' },
    { name: 'Carbs', current: totals.carbs, target: targets.carbs, unit: 'g', color: 'bg-amber-500', bg: 'bg-amber-100' },
    { name: 'Fat', current: totals.fat, target: targets.fat, unit: 'g', color: 'bg-yellow-500', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-fade-in-up">
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Daily Summary</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {metrics.map((metric, i) => {
          const percentage = Math.min(100, (metric.current / metric.target) * 100) || 0;
          return (
            <div key={metric.name} className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-stone-600">{metric.name}</span>
                <div className="text-right">
                  <span className="font-semibold text-stone-900 text-lg">{metric.current}</span>
                  <span className="text-stone-400 text-xs ml-1">/ {metric.target} {metric.unit}</span>
                </div>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${metric.bg}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${metric.color}`}
                  style={{ width: mounted ? `${percentage}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
