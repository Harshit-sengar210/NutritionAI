"use client";

import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { AddMealModal } from './AddMealModal';
import Link from 'next/link';

export const TodaysMeals = () => {
  const { todaysMeals } = useNutrition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group or just display in order
  const sortedMeals = [...todaysMeals].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getMealIcon = (type: string) => {
    if (type === 'Breakfast') return '🌅';
    if (type === 'Lunch') return '☀️';
    if (type === 'Dinner') return '🌙';
    return '🍎';
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col h-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-stone-900">Today&apos;s Meals</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
        >
          + Add Meal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {sortedMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-stone-100 rounded-2xl">
            <span className="text-3xl mb-2">🍽️</span>
            <p className="text-stone-900 font-medium text-sm">No meals logged yet.</p>
            <p className="text-stone-500 text-xs mt-1">Start tracking your nutrition today.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-xs font-medium bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-800 transition-colors"
            >
              Add Your First Meal
            </button>
          </div>
        ) : (
          sortedMeals.map((meal) => (
            <div key={meal.id} className="flex items-center p-4 border border-stone-100 rounded-2xl hover:border-stone-200 hover:shadow-sm transition-all group bg-stone-50/50">
              <div className="w-10 h-10 rounded-full bg-white border border-stone-100 flex items-center justify-center text-lg shadow-sm">
                {getMealIcon(meal.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-stone-900 text-sm group-hover:text-green-700 transition-colors">{meal.name}</h4>
                  <span className="font-semibold text-stone-900 text-sm">{meal.calories} kcal</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-stone-500 font-medium">{meal.type}</p>
                  <p className="text-[10px] text-stone-400">
                    {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
