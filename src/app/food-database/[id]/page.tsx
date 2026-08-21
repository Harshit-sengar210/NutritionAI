"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { foodDatabase } from '@/data/foods';
import { calculateNutrition } from '@/lib/nutrition/calculations';

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const foodId = params.id as string;
  
  const food = useMemo(() => foodDatabase.find(f => f.id === foodId), [foodId]);
  
  const [multiplier, setMultiplier] = useState(1);

  if (!food) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-stone-500">Food not found.</div>
      </DashboardLayout>
    );
  }

  const nutrition = calculateNutrition(food, food.baseQuantity * multiplier);
  const displayQuantity = food.baseQuantity * multiplier;

  const handleAskAI = () => {
    // Navigate to AI nutritionist with a pre-filled query
    router.push(`/ai-nutritionist?query=Tell me about ${encodeURIComponent(food.name)}`);
  };

  return (
    <DashboardLayout>
      <button 
        onClick={() => router.push('/food-database')}
        className="text-sm font-medium text-stone-500 hover:text-stone-900 mb-6 flex items-center gap-2 transition-colors"
      >
        ← Back to Database
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-3xl shrink-0">
                {food.category === 'Fruits' ? '🍎' : food.category === 'Vegetables' ? '🥦' : food.category === 'Protein' ? '🍗' : '🍲'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-stone-900 mb-1">{food.name}</h1>
                <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">{food.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 text-center">
                <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Calories</span>
                <span className="text-2xl font-bold text-stone-900">{nutrition.calories}</span>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 text-center">
                <span className="block text-xs text-blue-600 uppercase tracking-wider mb-1">Protein</span>
                <span className="text-2xl font-bold text-blue-900">{nutrition.protein}g</span>
              </div>
              <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 text-center">
                <span className="block text-xs text-orange-600 uppercase tracking-wider mb-1">Carbs</span>
                <span className="text-2xl font-bold text-orange-900">{nutrition.carbs}g</span>
              </div>
              <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 text-center">
                <span className="block text-xs text-purple-600 uppercase tracking-wider mb-1">Fat</span>
                <span className="text-2xl font-bold text-purple-900">{nutrition.fat}g</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Detailed Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-600 font-medium">Fiber</span>
                <span className="font-bold text-stone-900">{nutrition.fiber}g</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-600 font-medium">Sugar</span>
                <span className="font-bold text-stone-900">{nutrition.sugar}g</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-600 font-medium">Sodium</span>
                <span className="font-bold text-stone-900">{nutrition.sodium}mg</span>
              </div>
            </div>

            {food.micronutrients && (
              <>
                <h3 className="text-sm font-semibold text-stone-900 mt-8 mb-4 uppercase tracking-wider">Micronutrients</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(food.micronutrients).map(([key, value]) => (
                    <div key={key} className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                      <span className="block text-xs text-stone-500 capitalize mb-1">{key}</span>
                      <span className="font-bold text-stone-900">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Serving Size</h3>
            
            <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-xl border border-stone-100 mb-6">
              <button 
                onClick={() => setMultiplier(Math.max(0.5, multiplier - 0.5))}
                className="w-12 h-10 flex items-center justify-center bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 active:scale-95 transition-all"
              >
                -
              </button>
              <div className="flex-1 text-center font-semibold text-stone-900 text-lg">
                {displayQuantity}{food.servingUnit}
              </div>
              <button 
                onClick={() => setMultiplier(multiplier + 0.5)}
                className="w-12 h-10 flex items-center justify-center bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 active:scale-95 transition-all"
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-sm">
                Add to Today's Meals
              </button>
              <button className="w-full py-3.5 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors shadow-sm">
                Add to Diet Plan
              </button>
              <button 
                onClick={handleAskAI}
                className="w-full py-3.5 bg-green-50 text-green-700 border border-green-200 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">✦</span>
                Ask AI About This Food
              </button>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}
