"use client";

import React from 'react';

interface MealDistributionProps {
  distribution: { Breakfast: number; Lunch: number; Snack: number; Dinner: number };
}

export const MealDistribution = ({ distribution }: MealDistributionProps) => {
  const { Breakfast, Lunch, Snack, Dinner } = distribution;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Calorie Distribution</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center group">
          <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Breakfast</span>
          <div className="flex items-center gap-3 w-1/2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-300 rounded-full transition-all duration-1000" style={{ width: `${Breakfast}%` }} />
            </div>
            <span className="text-sm font-bold text-stone-900 w-8 text-right">{Breakfast}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center group">
          <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Lunch</span>
          <div className="flex items-center gap-3 w-1/2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${Lunch}%` }} />
            </div>
            <span className="text-sm font-bold text-stone-900 w-8 text-right">{Lunch}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center group">
          <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Dinner</span>
          <div className="flex items-center gap-3 w-1/2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Dinner}%` }} />
            </div>
            <span className="text-sm font-bold text-stone-900 w-8 text-right">{Dinner}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center group">
          <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Snacks</span>
          <div className="flex items-center gap-3 w-1/2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-200 rounded-full transition-all duration-1000" style={{ width: `${Snack}%` }} />
            </div>
            <span className="text-sm font-bold text-stone-900 w-8 text-right">{Snack}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
