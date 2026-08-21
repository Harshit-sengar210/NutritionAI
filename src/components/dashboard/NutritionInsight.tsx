"use client";

import React, { useEffect, useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';

export const NutritionInsight = () => {
  const { profile, todaysMeals } = useNutrition();
  const [insight, setInsight] = useState("");

  useEffect(() => {
    // Basic local rule-based insight logic
    const targetCalories = profile.nutritionTargets.calories;
    const targetProtein = profile.nutritionTargets.protein;
    
    const consumedCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const consumedProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);

    const calPercent = targetCalories > 0 ? consumedCalories / targetCalories : 0;
    const proPercent = targetProtein > 0 ? consumedProtein / targetProtein : 0;

    let message = "Your nutrition is looking well balanced today. Keep up the good work!";

    if (todaysMeals.length === 0) {
      message = "You haven't logged any meals yet today. Log your first meal to get personalized insights!";
    } else if (calPercent > 0.9 && proPercent < 0.6) {
      message = "You're approaching your daily calorie target, but your protein intake is still low. Consider adding a lean protein source to your next meal.";
    } else if (calPercent > 1.1) {
      message = "You've exceeded your daily calorie target. Focus on hydration and light activity for the rest of the day.";
    } else if (proPercent < 0.5 && calPercent > 0.5) {
      message = "Your protein intake is currently below today's target relative to your calories. Try to incorporate more protein-rich foods.";
    } else if (calPercent > 0.8 && proPercent > 0.8) {
      message = "Excellent job today! You are hitting both your calorie and protein targets effectively.";
    }

    setInsight(message);
  }, [todaysMeals, profile.nutritionTargets]);

  return (
    <div className="bg-green-900 border border-green-800 rounded-3xl p-6 lg:p-8 shadow-lg text-white relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/50 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-emerald-600/40 rounded-full blur-2xl -z-0" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl animate-pulse">✦</span>
          <h3 className="text-lg font-semibold tracking-wide">Nutrition AI Insight</h3>
        </div>
        
        <p className="text-green-50 text-base leading-relaxed font-medium">
          &quot;{insight}&quot;
        </p>
      </div>
    </div>
  );
};
