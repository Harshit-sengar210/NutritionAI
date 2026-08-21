"use client";

import React from 'react';
import { Meal } from '@/context/NutritionContext';

interface NutrientBreakdownProps {
  meals: Meal[];
  days: number;
}

export const NutrientBreakdown = ({ meals, days }: NutrientBreakdownProps) => {
  if (meals.length === 0) return null;

  // Calculate averages
  const sums = meals.reduce((acc, m) => {
    acc.fiber += m.fiber || 0;
    acc.sugar += m.sugar || 0;
    acc.sodium += m.sodium || 0;
    return acc;
  }, { fiber: 0, sugar: 0, sodium: 0 });

  const fiberAvg = Math.round(sums.fiber / days);
  const sugarAvg = Math.round(sums.sugar / days);
  const sodiumAvg = Math.round(sums.sodium / days);

  const nutrients = [
    { name: 'Fiber', actual: fiberAvg, unit: 'g', target: '30g' },
    { name: 'Sugar', actual: sugarAvg, unit: 'g', target: '<50g' },
    { name: 'Sodium', actual: sodiumAvg, unit: 'mg', target: '<2300mg' },
    { name: 'Calcium', actual: '780', unit: 'mg', target: '1000mg' },
    { name: 'Iron', actual: '12', unit: 'mg', target: 'Target not configured' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Nutrient Breakdown</h3>
      
      <div className="space-y-4">
        {nutrients.map(n => (
          <div key={n.name} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
            <div>
              <span className="font-medium text-stone-900 block">{n.name}</span>
              <span className="text-xs text-stone-500">Target: {n.target}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-stone-900">{n.actual}</span>
              <span className="text-sm text-stone-500 ml-1">{n.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
