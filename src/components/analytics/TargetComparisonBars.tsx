"use client";

import React from 'react';
import { OnboardingState } from '@/types/onboarding';

interface TargetComparisonBarsProps {
  averages: { calories: number; protein: number; carbs: number; fat: number };
  targets: OnboardingState['nutritionTargets'];
}

export const TargetComparisonBars = ({ averages, targets }: TargetComparisonBarsProps) => {
  const metrics = [
    { label: 'Calories', actual: averages.calories, target: targets.calories, unit: 'kcal' },
    { label: 'Protein', actual: averages.protein, target: targets.protein, unit: 'g' },
    { label: 'Carbs', actual: averages.carbs, target: targets.carbs, unit: 'g' },
    { label: 'Fat', actual: averages.fat, target: targets.fat, unit: 'g' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Target vs Actual</h3>
      
      <div className="space-y-6">
        {metrics.map(m => {
          const percent = m.target > 0 ? Math.round((m.actual / m.target) * 100) : 0;
          let statusColor = 'bg-green-500'; // near target
          
          if (m.label === 'Protein' && percent < 90) statusColor = 'bg-stone-800'; // under target
          else if (m.label !== 'Protein' && percent > 110) statusColor = 'bg-red-400'; // over target

          return (
            <div key={m.label}>
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-stone-900">{m.label}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-stone-900">{m.actual}</span>
                  <span className="text-xs text-stone-500 ml-1">/ {m.target} {m.unit}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden relative">
                <div 
                  className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-1000 ${statusColor}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
                {/* Target Marker */}
                <div className="absolute top-0 bottom-0 left-[100%] w-0.5 bg-stone-900 z-10" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
