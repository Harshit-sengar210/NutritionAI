import React, { useEffect, useState } from 'react';
import { OnboardingState } from '@/types/onboarding';

interface StepNutritionTargetsProps {
  data: OnboardingState['nutritionTargets'];
  updateData: (data: Partial<OnboardingState['nutritionTargets']>) => void;
  fullState: OnboardingState;
}

export const StepNutritionTargets = ({ data, updateData, fullState }: StepNutritionTargetsProps) => {
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    // Simple mock calculation logic for preliminary targets
    if (!calculated && data.calories === 0) {
      const weight = Number(fullState.personalInfo.weight) || 70;
      const height = Number(fullState.personalInfo.height) || 170;
      const age = Number(fullState.personalInfo.age) || 30;
      const isMale = fullState.personalInfo.gender !== 'Female';

      // Mifflin-St Jeor Equation
      let bmr = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);
      
      const activityMultipliers: Record<string, number> = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Extremely Active': 1.9
      };

      const multiplier = activityMultipliers[fullState.lifestyle.activityLevel] || 1.2;
      let tdee = Math.round(bmr * multiplier);

      // Adjust based on goal
      if (fullState.goals.primary === 'Weight Loss') tdee -= 500;
      if (fullState.goals.primary === 'Weight Gain') tdee += 500;
      if (fullState.goals.primary === 'Muscle Gain') tdee += 300;

      const calories = Math.max(1200, tdee); // minimum safe floor
      
      // Simple macro split (30% protein, 40% carbs, 30% fat)
      const protein = Math.round((calories * 0.3) / 4);
      const carbs = Math.round((calories * 0.4) / 4);
      const fat = Math.round((calories * 0.3) / 9);
      const water = Math.round(weight * 0.033 * 10) / 10; // ~33ml per kg

      updateData({ calories, protein, carbs, fat, water });
      setCalculated(true);
    }
  }, [calculated, data.calories, fullState, updateData]);

  const adjustValue = (field: keyof OnboardingState['nutritionTargets'], delta: number) => {
    const newValue = Math.max(0, data[field] + delta);
    updateData({ [field]: Number(newValue.toFixed(1)) });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
          Estimated Starting Targets
        </span>
        <p className="text-sm text-stone-500 max-w-xs mx-auto">
          We&apos;ve calculated these based on your profile. You can fine-tune them below.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Calories */}
        <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <h4 className="font-semibold text-stone-900">Daily Calories</h4>
            <p className="text-xs text-stone-500">kcal / day</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue('calories', -50)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">-</button>
            <span className="font-semibold text-lg w-16 text-center text-green-700">{data.calories}</span>
            <button onClick={() => adjustValue('calories', 50)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">+</button>
          </div>
        </div>

        {/* Protein */}
        <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <h4 className="font-semibold text-stone-900">Protein</h4>
            <p className="text-xs text-stone-500">grams / day</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue('protein', -5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">-</button>
            <span className="font-semibold w-16 text-center text-stone-800">{data.protein}g</span>
            <button onClick={() => adjustValue('protein', 5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">+</button>
          </div>
        </div>

        {/* Carbs */}
        <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <h4 className="font-semibold text-stone-900">Carbohydrates</h4>
            <p className="text-xs text-stone-500">grams / day</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue('carbs', -5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">-</button>
            <span className="font-semibold w-16 text-center text-stone-800">{data.carbs}g</span>
            <button onClick={() => adjustValue('carbs', 5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">+</button>
          </div>
        </div>

        {/* Fat */}
        <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <h4 className="font-semibold text-stone-900">Fat</h4>
            <p className="text-xs text-stone-500">grams / day</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue('fat', -2)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">-</button>
            <span className="font-semibold w-16 text-center text-stone-800">{data.fat}g</span>
            <button onClick={() => adjustValue('fat', 2)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">+</button>
          </div>
        </div>
        
        {/* Water */}
        <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <h4 className="font-semibold text-stone-900">Water</h4>
            <p className="text-xs text-stone-500">Liters / day</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue('water', -0.1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">-</button>
            <span className="font-semibold w-16 text-center text-stone-800">{data.water.toFixed(1)}L</span>
            <button onClick={() => adjustValue('water', 0.1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">+</button>
          </div>
        </div>

      </div>
    </div>
  );
};
