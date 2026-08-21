"use client";

import React from 'react';
import { useNutrition } from '@/context/NutritionContext';

interface WeeklyMealHistoryProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

export const WeeklyMealHistory = ({ selectedDate, onChangeDate }: WeeklyMealHistoryProps) => {
  const { weeklyData } = useNutrition();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-fade-in-up mt-8" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Weekly Meal History</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weeklyData.map((data) => {
          const isSelected = isSameDay(data.date, selectedDate);
          return (
            <button
              key={data.day}
              onClick={() => onChangeDate(data.date)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                isSelected 
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md scale-105' 
                  : 'bg-white border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-900'
              }`}
            >
              <div>
                <span className={`text-xs font-semibold uppercase ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                  {data.day}
                </span>
                <p className={`font-medium mt-1 text-sm ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {Math.round(data.calories)} kcal
                </p>
              </div>
              
              <div className="text-xs">
                <span className={isSelected ? 'text-green-400' : 'text-green-600'}>{Math.round(data.protein)}g pro</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
