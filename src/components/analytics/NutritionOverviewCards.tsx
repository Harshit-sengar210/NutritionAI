"use client";

import React from 'react';
import { OnboardingState } from '@/types/onboarding';

interface NutritionOverviewCardsProps {
  averages: { calories: number; protein: number; carbs: number; fat: number };
  prevAverages: { calories: number; protein: number; carbs: number; fat: number };
  targets: OnboardingState['nutritionTargets'];
}

export const NutritionOverviewCards = ({ averages, prevAverages, targets }: NutritionOverviewCardsProps) => {
  const cards = [
    {
      title: 'Calories',
      value: averages.calories,
      unit: 'kcal',
      target: targets.calories,
      prev: prevAverages.calories,
      color: 'green'
    },
    {
      title: 'Protein',
      value: averages.protein,
      unit: 'g',
      target: targets.protein,
      prev: prevAverages.protein,
      color: 'blue'
    },
    {
      title: 'Carbohydrates',
      value: averages.carbs,
      unit: 'g',
      target: targets.carbs,
      prev: prevAverages.carbs,
      color: 'orange'
    },
    {
      title: 'Fat',
      value: averages.fat,
      unit: 'g',
      target: targets.fat,
      prev: prevAverages.fat,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const percent = card.target > 0 ? Math.round((card.value / card.target) * 100) : 0;
        
        let trend = 0;
        if (card.prev > 0) {
          trend = Math.round(((card.value - card.prev) / card.prev) * 100);
        }

        const isPositiveTrend = trend > 0;
        const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '-';
        
        return (
          <div key={card.title} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">{card.title}</h3>
            
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold text-stone-900 leading-none">{card.value}</span>
              <span className="text-sm font-medium text-stone-500 mb-1">{card.unit}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm font-medium text-stone-500 mb-4">
              <span>Target: {card.target} {card.unit}</span>
              <span className={percent >= 100 ? 'text-green-600' : 'text-stone-900'}>{percent}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${percent >= 100 ? 'bg-green-500' : 'bg-stone-800'}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-stone-50 w-fit">
              <span className={trend > 5 ? 'text-red-500' : trend < -5 ? 'text-green-500' : 'text-stone-500'}>
                {trendIcon} {Math.abs(trend)}%
              </span>
              <span className="text-stone-400">vs prev period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
