"use client";

import React, { useState } from 'react';

interface TopContributorsProps {
  calorieContributors: { name: string; value: number }[];
  proteinContributors: { name: string; value: number }[];
}

export const TopContributors = ({ calorieContributors, proteinContributors }: TopContributorsProps) => {
  const [metric, setMetric] = useState<'calories' | 'protein'>('calories');

  const data = metric === 'calories' ? calorieContributors : proteinContributors;
  const unit = metric === 'calories' ? 'kcal' : 'g';

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Top Contributors</h3>
        <select 
          value={metric} 
          onChange={(e) => setMetric(e.target.value as 'calories' | 'protein')}
          className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-stone-700 outline-none focus:border-green-500"
        >
          <option value="calories">Calories</option>
          <option value="protein">Protein</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-stone-900 truncate">{item.name}</div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-stone-900">{item.value}</span>
              <span className="text-xs text-stone-500 ml-1">{unit}</span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-sm text-stone-500 text-center py-4">No data available.</div>
        )}
      </div>
    </div>
  );
};
