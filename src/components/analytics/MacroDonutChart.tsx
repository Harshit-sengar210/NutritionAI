"use client";

import React from 'react';

interface MacroDonutChartProps {
  distribution: { protein: number; carbs: number; fat: number; total: number };
}

export const MacroDonutChart = ({ distribution }: MacroDonutChartProps) => {
  const { protein, carbs, fat } = distribution;
  
  // Calculate SVG stroke dashes
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  const proDash = (protein / 100) * circumference;
  const carbDash = (carbs / 100) * circumference;
  const fatDash = (fat / 100) * circumference;
  
  const proOffset = 0;
  const carbOffset = -proDash;
  const fatOffset = carbOffset - carbDash;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-8 self-start uppercase tracking-wider">Macronutrient Breakdown</h3>
      
      <div className="relative w-48 h-48 mb-8 shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f5f5f4" strokeWidth="12" />
          
          {/* Fat Segment */}
          <circle 
            cx="50" cy="50" r={radius} fill="none" 
            stroke="#a855f7" strokeWidth="12" 
            strokeDasharray={`${fatDash} ${circumference}`}
            strokeDashoffset={fatOffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Carbs Segment */}
          <circle 
            cx="50" cy="50" r={radius} fill="none" 
            stroke="#f97316" strokeWidth="12" 
            strokeDasharray={`${carbDash} ${circumference}`}
            strokeDashoffset={carbOffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Protein Segment */}
          <circle 
            cx="50" cy="50" r={radius} fill="none" 
            stroke="#3b82f6" strokeWidth="12" 
            strokeDasharray={`${proDash} ${circumference}`}
            strokeDashoffset={proOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-900 leading-none">{distribution.total}g</span>
          <span className="text-xs text-stone-500 font-medium mt-1">Total Macros</span>
        </div>
      </div>

      <div className="w-full space-y-3 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-stone-600">Protein</span>
          </div>
          <span className="text-sm font-bold text-stone-900">{protein}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm font-medium text-stone-600">Carbs</span>
          </div>
          <span className="text-sm font-bold text-stone-900">{carbs}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm font-medium text-stone-600">Fat</span>
          </div>
          <span className="text-sm font-bold text-stone-900">{fat}%</span>
        </div>
      </div>
    </div>
  );
};
