import React from 'react';
import { OnboardingState } from '@/types/onboarding';

interface StepDietProps {
  data: OnboardingState['diet'];
  updateData: (data: Partial<OnboardingState['diet']>) => void;
}

const dietPreferences = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Eggetarian",
  "Pescatarian",
  "Other"
];

const cuisines = [
  "Indian",
  "North Indian",
  "South Indian",
  "Mediterranean",
  "Asian",
  "Continental"
];

const meals = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks"
];

export const StepDiet = ({ data, updateData }: StepDietProps) => {

  const toggleCuisine = (cuisine: string) => {
    if (data.cuisines.includes(cuisine)) {
      updateData({ cuisines: data.cuisines.filter(c => c !== cuisine) });
    } else {
      updateData({ cuisines: [...data.cuisines, cuisine] });
    }
  };

  const toggleMeal = (meal: string) => {
    if (data.meals.includes(meal)) {
      updateData({ meals: data.meals.filter(m => m !== meal) });
    } else {
      updateData({ meals: [...data.meals, meal] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Primary Preference */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Primary Diet Preference</label>
        <div className="grid grid-cols-2 gap-3">
          {dietPreferences.map(pref => (
            <button
              key={pref}
              onClick={() => updateData({ preference: pref })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                data.preference === pref
                  ? 'bg-green-500 border-green-500 text-white shadow-sm'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisines */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Cuisine Preferences</label>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                data.cuisines.includes(cuisine)
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Meals you typically eat</label>
        <div className="flex flex-wrap gap-2">
          {meals.map(meal => (
            <button
              key={meal}
              onClick={() => toggleMeal(meal)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                data.meals.includes(meal)
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
