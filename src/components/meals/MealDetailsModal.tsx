"use client";

import React from 'react';
import { Meal } from '@/context/NutritionContext';

interface MealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
}

export const MealDetailsModal = ({ isOpen, onClose, meal }: MealDetailsModalProps) => {
  if (!isOpen) return null;

  const getMealIcon = (type: string) => {
    if (type === 'Breakfast') return '🌅';
    if (type === 'Lunch') return '☀️';
    if (type === 'Dinner') return '🌙';
    return '🍎';
  };

  const macros = [
    { label: 'Protein', val: meal.protein, color: 'bg-rose-500', max: 50 },
    { label: 'Carbs', val: meal.carbs, color: 'bg-amber-500', max: 100 },
    { label: 'Fat', val: meal.fat, color: 'bg-yellow-500', max: 40 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-scale-fade mt-auto sm:mt-0">
        
        <div className="p-6 bg-stone-50/50 flex flex-col items-center border-b border-stone-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">
            ✕
          </button>
          
          <div className="w-20 h-20 rounded-full bg-white border border-stone-200 flex items-center justify-center text-4xl shadow-sm mb-4">
            {getMealIcon(meal.type)}
          </div>
          <h2 className="text-xl font-semibold text-stone-900 text-center">{meal.name}</h2>
          <p className="text-sm text-stone-500 font-medium mt-1">{meal.type} • {meal.quantity} {meal.servingSize}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-end border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Calories</h3>
            </div>
            <div className="text-2xl font-bold text-stone-900">{meal.calories} <span className="text-sm font-medium text-stone-500">kcal</span></div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4">Macros</h3>
            <div className="space-y-4">
              {macros.map(macro => (
                <div key={macro.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600 font-medium">{macro.label}</span>
                    <span className="font-semibold text-stone-900">{macro.val}g</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${macro.color}`}
                      style={{ width: `${Math.min(100, (macro.val / macro.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3">Other Nutrients</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs text-stone-500 mb-1">Fiber</span>
                <span className="font-semibold text-stone-900">{meal.fiber}g</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs text-stone-500 mb-1">Sugar</span>
                <span className="font-semibold text-stone-900">{meal.sugar}g</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                <span className="block text-xs text-stone-500 mb-1">Sodium</span>
                <span className="font-semibold text-stone-900">{meal.sodium}mg</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3">Micronutrients</h3>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
              {meal.micronutrients ? (
                Object.entries(meal.micronutrients).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3 text-sm">
                    <span className="text-stone-600 capitalize">{key.replace('vitamin', 'Vitamin ')}</span>
                    <span className="font-medium text-stone-900">{val}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-stone-500 italic text-center">Not available for this food</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
