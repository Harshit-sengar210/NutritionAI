"use client";

import React, { useEffect, useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

export const MacroSummary = () => {
  const { profile, todaysMeals } = useNutrition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const targets = profile.nutritionTargets;
  
  const consumed = todaysMeals.reduce(
    (acc, meal) => {
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const macros = [
    { name: 'Protein', icon: '🥩', consumed: consumed.protein, target: targets.protein, unit: 'g', color: 'bg-rose-500', bg: 'bg-rose-100' },
    { name: 'Carbs', icon: '🌾', consumed: consumed.carbs, target: targets.carbs, unit: 'g', color: 'bg-amber-500', bg: 'bg-amber-100' },
    { name: 'Fat', icon: '🥑', consumed: consumed.fat, target: targets.fat, unit: 'g', color: 'bg-yellow-500', bg: 'bg-yellow-100' },
    { name: 'Water', icon: '💧', consumed: 1.8, target: targets.water, unit: 'L', color: 'bg-blue-500', bg: 'bg-blue-100' }, // Hardcoding water consumed for mock demo as it's not tracked in meals yet
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-stone-900 mb-6">Macro Summary</h3>
      
      <div className="space-y-6">
        {macros.map((macro, index) => {
          const percentage = Math.min(100, (macro.consumed / macro.target) * 100) || 0;
          
          return (
            <div key={macro.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{macro.icon}</span>
                  <span className="text-sm font-medium text-stone-700">{macro.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-stone-900">{macro.consumed}</span>
                  <span className="text-stone-400"> / {macro.target} {macro.unit}</span>
                </div>
              </div>
              
              <div className={`w-full h-2 rounded-full overflow-hidden ${macro.bg}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${macro.color}`}
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
