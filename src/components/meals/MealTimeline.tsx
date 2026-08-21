"use client";

import React from 'react';
import { Meal, useNutrition } from '@/context/NutritionContext';
import { MealCard } from './MealCard';

interface MealTimelineProps {
  meals: Meal[];
  onAddMeal: (type?: string) => void;
  onEditMeal: (meal: Meal) => void;
}

export const MealTimeline = ({ meals, onAddMeal, onEditMeal }: MealTimelineProps) => {
  const { deleteMeal } = useNutrition();
  
  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  if (meals.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <span className="text-5xl mb-4">🍽️</span>
        <h3 className="text-xl font-semibold text-stone-900 mb-2">No meals logged yet.</h3>
        <p className="text-stone-500 mb-6 max-w-sm">Start tracking your meals to see your nutrition progress and get personalized insights.</p>
        <button 
          onClick={() => onAddMeal()}
          className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
        >
          Add Your First Meal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {mealTypes.map((type) => {
        const typeMeals = meals.filter(m => m.type === type).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        return (
          <div key={type} className="relative">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 pl-4 border-l-2 border-stone-200">{type}</h3>
            
            <div className="space-y-3 pl-4 border-l-2 border-stone-100 pb-2">
              {typeMeals.length > 0 ? (
                typeMeals.map(meal => (
                  <MealCard 
                    key={meal.id} 
                    meal={meal} 
                    onEdit={onEditMeal} 
                    onDelete={deleteMeal} 
                  />
                ))
              ) : (
                <div className="flex items-center justify-between p-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/30 group">
                  <span className="text-sm text-stone-400 italic">Not logged yet</span>
                  <button 
                    onClick={() => onAddMeal(type)}
                    className="text-sm font-medium text-green-600 hover:text-green-700 bg-white border border-stone-200 hover:border-green-200 px-3 py-1.5 rounded-full transition-all shadow-sm group-hover:shadow"
                  >
                    + Add {type}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
