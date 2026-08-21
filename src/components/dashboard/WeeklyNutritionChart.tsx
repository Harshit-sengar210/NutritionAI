"use client";

import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

type MetricType = 'calories' | 'protein' | 'carbs' | 'fat';

export const WeeklyNutritionChart = () => {
  const { weeklyData } = useNutrition();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('calories');

  const maxVal = Math.max(...weeklyData.map(d => d[selectedMetric])) * 1.2; // Add 20% headroom

  const getMetricColor = (metric: MetricType) => {
    switch(metric) {
      case 'calories': return 'bg-green-500';
      case 'protein': return 'bg-rose-500';
      case 'carbs': return 'bg-amber-500';
      case 'fat': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getMetricLabel = (metric: MetricType) => {
    switch(metric) {
      case 'calories': return 'kcal';
      case 'protein': return 'g';
      case 'carbs': return 'g';
      case 'fat': return 'g';
      default: return '';
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-lg font-semibold text-stone-900">Weekly Progress</h3>
        
        <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-100">
          {(['calories', 'protein', 'carbs', 'fat'] as MetricType[]).map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                selectedMetric === metric
                  ? 'bg-white shadow-sm text-stone-900 border border-stone-200'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto pt-4 border-b border-stone-100">
        {weeklyData.map((data, i) => {
          const heightPercent = maxVal > 0 ? (data[selectedMetric] / maxVal) * 100 : 0;
          const isToday = i === 6; // Mocking Sunday as "Today" for demo purposes

          return (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-stone-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none transform -translate-y-2 group-hover:translate-y-0 duration-200">
                {data[selectedMetric]} {getMetricLabel(selectedMetric)}
              </div>

              {/* Bar */}
              <div className="w-full max-w-[24px] md:max-w-[32px] h-32 bg-stone-50 rounded-t-lg relative flex items-end overflow-hidden group-hover:bg-stone-100 transition-colors">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-700 ease-out ${getMetricColor(selectedMetric)} ${isToday ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              
              <span className={`text-[10px] mt-2 font-medium ${isToday ? 'text-green-600 font-bold' : 'text-stone-400'}`}>
                {data.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
