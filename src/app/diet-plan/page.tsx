"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { generateDietPlan, DailyDietPlan } from '@/lib/nutrition/dietPlan';
import { useRouter } from 'next/navigation';

export default function DietPlanPage() {
  const { profile, dietPlan, setDietPlan, dietPreferences, setDietPreferences, addMeal } = useNutrition();
  const [activeDay, setActiveDay] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setDietPlan(generateDietPlan(profile, dietPreferences));
      setIsRegenerating(false);
    }, 1000);
  };

  const handleLogMeal = (meal: any) => {
    addMeal({
      type: meal.type,
      name: meal.food.name,
      servingSize: `${meal.quantity * meal.food.baseQuantity}${meal.food.servingUnit}`,
      quantity: meal.quantity,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.food.fiber ? meal.food.fiber * meal.quantity : 0,
      sugar: meal.food.sugar ? meal.food.sugar * meal.quantity : 0,
      sodium: meal.food.sodium ? meal.food.sodium * meal.quantity : 0,
      timestamp: new Date()
    });
    // Redirect to dashboard or meals
    router.push('/dashboard');
  };

  if (dietPlan.length === 0) return null;

  const currentDayPlan = dietPlan[activeDay];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">Your Personalized Diet Plan</h1>
          <p className="text-stone-500 font-medium mt-1 max-w-2xl">
            Designed around your {profile.goals.primary.toLowerCase()} goal, preferences, and nutrition targets.
          </p>
        </div>
        <button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          {isRegenerating ? <span className="animate-spin text-lg">↻</span> : <span className="text-lg">✨</span>}
          Regenerate Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Selector */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex gap-2 overflow-x-auto hide-scrollbar">
            {dietPlan.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`flex-1 min-w-[80px] p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                  activeDay === idx ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                <span className={`text-xs font-semibold uppercase mb-1 ${activeDay === idx ? 'text-stone-300' : ''}`}>
                  Day {idx + 1}
                </span>
                <span className={`font-bold ${activeDay === idx ? 'text-white' : 'text-stone-900'}`}>
                  {day.dateStr.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Meals for the day */}
          <div className={`space-y-4 ${isRegenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
            {currentDayPlan.meals.map((meal) => (
              <div key={meal.id} className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm group">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center text-3xl shrink-0">
                  {meal.food.category === 'Fruits' ? '🍎' : meal.food.category === 'Protein' ? '🍗' : '🍲'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{meal.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">{meal.food.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                    <span className="font-semibold text-stone-900">{meal.calories} kcal</span>
                    <span>{meal.quantity * meal.food.baseQuantity}{meal.food.servingUnit}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-4 text-xs font-medium w-full md:w-auto overflow-x-auto hide-scrollbar">
                  <div className="flex flex-col items-center p-2 bg-blue-50/50 rounded-lg border border-blue-100 min-w-[60px]">
                    <span className="text-blue-600 mb-1">Pro</span>
                    <span className="text-blue-900 font-bold">{meal.protein}g</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-orange-50/50 rounded-lg border border-orange-100 min-w-[60px]">
                    <span className="text-orange-600 mb-1">Carb</span>
                    <span className="text-orange-900 font-bold">{meal.carbs}g</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-purple-50/50 rounded-lg border border-purple-100 min-w-[60px]">
                    <span className="text-purple-600 mb-1">Fat</span>
                    <span className="text-purple-900 font-bold">{meal.fat}g</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <button 
                    onClick={() => handleLogMeal(meal)}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors w-full"
                  >
                    Log Meal
                  </button>
                  <button className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors w-full">
                    Swap Meal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
             <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
               <span className="text-lg">✦</span> Why this plan?
             </h3>
             <p className="text-sm text-green-800 font-medium leading-relaxed relative z-10">
               This plan prioritizes {profile.diet.preference || 'balanced'} foods while keeping your daily target of {profile.nutritionTargets.calories} kcal and {profile.nutritionTargets.protein}g of protein in focus to support your {profile.goals.primary.toLowerCase()} goal.
             </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Daily Summary</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Calories', actual: currentDayPlan.totalCalories, target: profile.nutritionTargets.calories, unit: 'kcal' },
                { label: 'Protein', actual: currentDayPlan.totalProtein, target: profile.nutritionTargets.protein, unit: 'g' },
                { label: 'Carbs', actual: currentDayPlan.totalCarbs, target: profile.nutritionTargets.carbs, unit: 'g' },
                { label: 'Fat', actual: currentDayPlan.totalFat, target: profile.nutritionTargets.fat, unit: 'g' }
              ].map(m => {
                const percent = Math.round((m.actual / m.target) * 100);
                return (
                  <div key={m.label}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-semibold text-stone-900">{m.label}</span>
                      <span className="text-xs font-bold text-stone-500">{m.actual} / {m.target}{m.unit}</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${percent > 110 ? 'bg-red-400' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Plan Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Meals per day</label>
                <select 
                  value={dietPreferences.mealsPerDay}
                  onChange={(e) => setDietPreferences({ ...dietPreferences, mealsPerDay: parseInt(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-green-500"
                >
                  <option value={3}>3 Meals</option>
                  <option value={4}>4 Meals (1 Snack)</option>
                  <option value={5}>5 Meals (2 Snacks)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Diet Type</label>
                <select 
                  value={dietPreferences.dietType}
                  onChange={(e) => setDietPreferences({ ...dietPreferences, dietType: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-green-500"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Vegetarian">Vegetarian</option>
                </select>
              </div>
              
              <button 
                onClick={handleRegenerate}
                className="w-full py-2.5 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 transition-colors text-sm mt-2"
              >
                Apply & Regenerate
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
