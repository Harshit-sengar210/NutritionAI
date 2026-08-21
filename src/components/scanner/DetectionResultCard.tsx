"use client";

import React, { useState, useEffect } from 'react';
import { DetectionResult } from '@/lib/nutrition/mockDetectionEngine';
import { calculateNutrition, CalculatedNutrition } from '@/lib/nutrition/calculations';
import { useNutrition } from '@/context/NutritionContext';
import { useRouter } from 'next/navigation';

interface DetectionResultCardProps {
  result: DetectionResult;
  onRetry: () => void;
}

export const DetectionResultCard = ({ result, onRetry }: DetectionResultCardProps) => {
  const { addMeal } = useNutrition();
  const router = useRouter();

  const [quantity, setQuantity] = useState(result.food.baseQuantity);
  const [mealType, setMealType] = useState('Lunch');
  const [nutrition, setNutrition] = useState<CalculatedNutrition>(calculateNutrition(result.food, result.food.baseQuantity));
  const [activeIngredients, setActiveIngredients] = useState<string[]>(result.detectedIngredients);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setNutrition(calculateNutrition(result.food, quantity));
  }, [quantity, result.food]);

  const handleAddIngredient = () => {
    const ingredient = prompt("Enter ingredient name:");
    if (ingredient) {
      setActiveIngredients([...activeIngredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setActiveIngredients(activeIngredients.filter(i => i !== ing));
  };

  const handleAddToMeals = () => {
    const ts = new Date();
    // Rough time based on type for realism
    if (mealType === 'Breakfast') ts.setHours(8, 30);
    else if (mealType === 'Lunch') ts.setHours(13, 0);
    else if (mealType === 'Snack') ts.setHours(16, 0);
    else if (mealType === 'Dinner') ts.setHours(19, 30);

    addMeal({
      type: mealType,
      name: result.food.name,
      servingSize: result.food.servingUnit,
      quantity: quantity / result.food.baseQuantity, // stored as multiplier
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      sugar: nutrition.sugar,
      sodium: nutrition.sodium,
      micronutrients: result.food.micronutrients,
      timestamp: ts
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-white border border-green-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-4">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-stone-900 mb-2">Added to {mealType}</h3>
        <p className="text-stone-500 mb-8 max-w-sm">
          {result.food.name} has been successfully added to your meals today.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => router.push('/meals')}
            className="w-full py-3.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-sm"
          >
            View Meal
          </button>
          <button 
            onClick={onRetry}
            className="w-full py-3.5 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-fade-in-up">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 block">AI Food Recognition</span>
          <h2 className="text-2xl font-bold text-stone-900">{result.food.name}</h2>
        </div>
        
        {/* Confidence Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
            <path
              className="text-stone-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-green-500 animate-[stroke-dashoffset_1s_ease-out_forwards]"
              strokeWidth="3"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - result.confidence}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stone-700">
            {result.confidence}%
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Ingredients */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Detected Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {activeIngredients.map(ing => (
              <span key={ing} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
                {ing}
                <button onClick={() => handleRemoveIngredient(ing)} className="text-stone-400 hover:text-stone-600 transition-colors">×</button>
              </span>
            ))}
            <button onClick={handleAddIngredient} className="inline-flex items-center px-3 py-1.5 bg-white border border-dashed border-stone-300 rounded-lg text-sm text-stone-500 hover:text-stone-700 hover:border-stone-400 transition-colors">
              + Add
            </button>
          </div>
        </div>

        {/* Serving Adjustment */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-stone-900">Estimated Serving</h3>
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">Demo Feature</span>
          </div>
          
          <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-xl border border-stone-100">
            <button 
              onClick={() => setQuantity(Math.max(10, quantity - 50))}
              className="w-12 h-10 flex items-center justify-center bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 active:scale-95 transition-all"
            >
              -
            </button>
            <div className="flex-1 text-center font-semibold text-stone-900 text-lg">
              {quantity}{result.food.servingUnit}
            </div>
            <button 
              onClick={() => setQuantity(quantity + 50)}
              className="w-12 h-10 flex items-center justify-center bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Nutrition Cards */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Nutrition Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Calories</span>
              <span className="text-lg font-bold text-stone-900">{nutrition.calories} <span className="text-sm font-medium text-stone-500">kcal</span></span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Protein</span>
              <span className="text-lg font-bold text-stone-900">{nutrition.protein}g</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Carbs</span>
              <span className="text-lg font-bold text-stone-900">{nutrition.carbs}g</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Fat</span>
              <span className="text-lg font-bold text-stone-900">{nutrition.fat}g</span>
            </div>
          </div>
        </div>

        {/* Meal Type Selection */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Add as</h3>
          <div className="grid grid-cols-4 gap-2">
            {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(t => (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-colors ${mealType === t ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onRetry}
          className="flex-1 py-3.5 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors"
        >
          Scan Another
        </button>
        <button 
          onClick={handleAddToMeals}
          className="flex-[2] py-3.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-md active:scale-[0.98]"
        >
          Add to Today's Meals
        </button>
      </div>

    </div>
  );
};
