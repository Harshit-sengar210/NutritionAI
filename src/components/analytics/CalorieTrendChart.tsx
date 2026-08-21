"use client";

import React, { useState } from 'react';

interface CalorieTrendChartProps {
  data: {
    dateStr: string;
    dayName: string;
    isToday: boolean;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  target: number;
}

export const CalorieTrendChart = ({ data, target }: CalorieTrendChartProps) => {
  const [metric, setMetric] = useState<'calories' | 'protein' | 'carbs' | 'fat'>('calories');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Find max value to scale chart
  const maxValue = Math.max(...data.map(d => d[metric]), target * (metric === 'calories' ? 1.2 : 1));
  const chartHeight = 240;

  const getMetricTarget = () => {
    if (metric === 'calories') return target;
    if (metric === 'protein') return 120; // Ideally passed from props, using safe defaults for demo
    if (metric === 'carbs') return 250;
    if (metric === 'fat') return 70;
    return target;
  };

  const metricTarget = getMetricTarget();
  const targetY = chartHeight - (metricTarget / maxValue) * chartHeight;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col h-full animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Nutrition Trend</h2>
          <p className="text-sm text-stone-500 font-medium">Daily intake over selected period</p>
        </div>
        
        <div className="flex bg-stone-100 rounded-lg p-1">
          {['calories', 'protein', 'carbs', 'fat'].map(m => (
            <button
              key={m}
              onClick={() => setMetric(m as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                metric === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[280px] w-full flex items-end pt-10 pb-6 overflow-x-auto hide-scrollbar">
        {/* Target Line */}
        <div 
          className="absolute left-0 right-0 border-t-2 border-dashed border-green-400 pointer-events-none flex items-center justify-end z-0"
          style={{ top: `${targetY}px` }}
        >
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded -mt-6">
            Target: {metricTarget}
          </span>
        </div>

        {/* Bars */}
        <div className="flex items-end justify-between w-full h-[240px] min-w-[500px] gap-2 px-2 relative z-10">
          {data.map((d, i) => {
            const height = (d[metric] / maxValue) * chartHeight;
            const isHovered = hoveredIdx === i;
            
            return (
              <div 
                key={i} 
                className="flex flex-col items-center flex-1 group"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                <div className={`absolute top-0 transform -translate-y-full mb-2 bg-stone-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap transition-opacity duration-200 pointer-events-none z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="font-bold mb-1">{d.dateStr}</div>
                  <div>{d[metric]} {metric === 'calories' ? 'kcal' : 'g'}</div>
                </div>

                {/* Bar */}
                <div 
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ease-out ${
                    d.isToday 
                      ? 'bg-green-500' 
                      : d[metric] > metricTarget * 1.1 
                        ? 'bg-red-400' 
                        : 'bg-stone-800'
                  } ${isHovered ? 'opacity-80' : 'opacity-100'}`}
                  style={{ height: `${Math.max(4, height)}px` }}
                />
                
                {/* Label */}
                <span className={`text-xs mt-3 font-medium transition-colors ${d.isToday ? 'text-green-600 font-bold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                  {data.length <= 7 ? d.dayName : d.dateStr.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
