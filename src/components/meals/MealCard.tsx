"use client";

import React, { useState } from 'react';
import { Meal } from '@/context/NutritionContext';
import { MealDetailsModal } from './MealDetailsModal';

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export const MealCard = ({ meal, onEdit, onDelete }: MealCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getMealIcon = (type: string) => {
    if (type === 'Breakfast') return '🌅';
    if (type === 'Lunch') return '☀️';
    if (type === 'Dinner') return '🌙';
    return '🍎';
  };

  if (showDeleteConfirm) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-scale-fade">
        <div>
          <p className="font-semibold text-red-900">Delete this meal?</p>
          <p className="text-sm text-red-700 mt-1">&quot;{meal.name}&quot;</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-white text-stone-700 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={() => onDelete(meal.id)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">Delete Meal</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-stone-100 rounded-2xl p-4 md:p-5 hover:border-stone-200 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between relative">
        <div className="flex items-center flex-1 cursor-pointer" onClick={() => setShowDetails(true)}>
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
            {getMealIcon(meal.type)}
          </div>
          <div className="ml-4 flex-1">
            <h4 className="font-semibold text-stone-900 text-base group-hover:text-green-700 transition-colors">{meal.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 font-medium">
              <span className="text-stone-700">{meal.calories} kcal</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>{meal.quantity} {meal.servingSize}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
          {/* Macro summary */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-stone-400">Pro</span>
              <span className="font-semibold text-stone-700">{meal.protein}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-stone-400">Carbs</span>
              <span className="font-semibold text-stone-700">{meal.carbs}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-stone-400">Fat</span>
              <span className="font-semibold text-stone-700">{meal.fat}g</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
            >
              ⋮
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-100 shadow-lg rounded-xl z-20 py-1 overflow-hidden animate-fade-in">
                  <button onClick={() => { setShowMenu(false); setShowDetails(true); }} className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">View Details</button>
                  <button onClick={() => { setShowMenu(false); onEdit(meal); }} className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Edit</button>
                  <button onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MealDetailsModal isOpen={showDetails} onClose={() => setShowDetails(false)} meal={meal} />
    </>
  );
};
