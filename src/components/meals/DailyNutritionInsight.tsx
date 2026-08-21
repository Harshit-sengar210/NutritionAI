"use client";

import React, { useEffect, useState } from 'react';
import { Meal } from '@/context/NutritionContext';
import { OnboardingState } from '@/types/onboarding';

interface DailyNutritionInsightProps {
  meals: Meal[];
  profile: OnboardingState;
}

export const DailyNutritionInsight = ({ meals, profile }: DailyNutritionInsightProps) => {
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const targetCalories = profile.nutritionTargets.calories;
    const targetProtein = profile.nutritionTargets.protein;
    
    const consumedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const consumedProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const consumedFiber = meals.reduce((sum, meal) => sum + meal.fiber, 0);

    const calPercent = targetCalories > 0 ? consumedCalories / targetCalories : 0;
    const proPercent = targetProtein > 0 ? consumedProtein / targetProtein : 0;

    let message = "Your logged meals are currently well balanced against your targets.";

    if (meals.length === 0) {
      message = "No meals logged for this date. Log a meal to see insights.";
    } else if (calPercent > 0.9 && proPercent < 0.6) {
      message = "You're approaching your daily calorie target, but your protein intake is still low. Try to add lean protein.";
    } else if (calPercent > 1.1) {
      message = "You've exceeded your daily calorie target.";
    } else if (proPercent < 0.5 && calPercent > 0.5) {
      message = "Your protein intake is below today's target relative to your calories.";
    } else if (consumedFiber < 10 && meals.length >= 2) {
      message = "Your logged meals are currently low in fiber. Consider adding fruits, vegetables, or whole grains.";
    } else if (calPercent > 0.8 && proPercent > 0.8) {
      message = "Excellent job! You are hitting both your calorie and protein targets effectively.";
    }

    setInsight(message);
  }, [meals, profile.nutritionTargets]);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 shadow-sm flex gap-4 animate-fade-in-up items-start sm:items-center" style={{ animationDelay: '100ms' }}>
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <span className="text-xl">✨</span>
      </div>
      <div>
        <h4 className="font-semibold text-stone-900 text-sm">Nutrition Insight</h4>
        <p className="text-stone-600 text-sm mt-0.5">{insight}</p>
      </div>
    </div>
  );
};
