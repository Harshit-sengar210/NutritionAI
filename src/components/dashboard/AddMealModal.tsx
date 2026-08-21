"use client";

import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMealModal = ({ isOpen, onClose }: AddMealModalProps) => {
  const { addMeal } = useNutrition();
  
  const [formData, setFormData] = useState({
    type: 'Breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a food name.');
      return;
    }

    const cals = parseInt(formData.calories);
    if (isNaN(cals) || cals <= 0) {
      setError('Please enter valid calories.');
      return;
    }

    addMeal({
      type: formData.type,
      name: formData.name,
      calories: cals,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      servingSize: 'custom',
      quantity: 1,
      timestamp: new Date()
    });

    // Reset and close
    setFormData({ type: 'Breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-scale-fade">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h2 className="text-xl font-semibold text-stone-900">Add Meal</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">Meal Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">Food Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Grilled Salmon & Quinoa"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">Calories (kcal)</label>
              <input
                type="number"
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">Protein (g)</label>
              <input
                type="number"
                value={formData.protein}
                onChange={e => setFormData({ ...formData, protein: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">Carbs (g)</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={e => setFormData({ ...formData, carbs: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">Fat (g)</label>
              <input
                type="number"
                value={formData.fat}
                onChange={e => setFormData({ ...formData, fat: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
