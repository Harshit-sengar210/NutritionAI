import React from 'react';
import { OnboardingState } from '@/types/onboarding';

interface StepSummaryProps {
  data: OnboardingState;
  goToStep: (step: number) => void;
}

export const StepSummary = ({ data, goToStep }: StepSummaryProps) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Personal Info */}
      <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm relative group">
        <button onClick={() => goToStep(0)} className="absolute top-4 right-4 text-xs font-medium text-stone-400 hover:text-green-600 transition-colors">Edit</button>
        <h3 className="font-semibold text-stone-900 mb-3 border-b border-stone-100 pb-2">Personal</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-stone-500">Name:</div><div className="font-medium">{data.personalInfo.fullName}</div>
          <div className="text-stone-500">Age:</div><div className="font-medium">{data.personalInfo.age}</div>
          <div className="text-stone-500">Height:</div><div className="font-medium">{data.personalInfo.height} cm</div>
          <div className="text-stone-500">Weight:</div><div className="font-medium">{data.personalInfo.weight} kg</div>
        </div>
      </div>

      {/* Diet & Lifestyle */}
      <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm relative group">
        <button onClick={() => goToStep(2)} className="absolute top-4 right-4 text-xs font-medium text-stone-400 hover:text-green-600 transition-colors">Edit</button>
        <h3 className="font-semibold text-stone-900 mb-3 border-b border-stone-100 pb-2">Diet & Lifestyle</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-stone-500">Activity:</div><div className="font-medium">{data.lifestyle.activityLevel}</div>
          <div className="text-stone-500">Preference:</div><div className="font-medium">{data.diet.preference}</div>
          <div className="text-stone-500">Allergies:</div><div className="font-medium">{data.allergies.length > 0 ? data.allergies.join(', ') : 'None'}</div>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm relative group">
        <button onClick={() => goToStep(4)} className="absolute top-4 right-4 text-xs font-medium text-stone-400 hover:text-green-600 transition-colors">Edit</button>
        <h3 className="font-semibold text-stone-900 mb-3 border-b border-stone-100 pb-2">Goals</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-stone-500">Primary:</div><div className="font-medium text-green-700">{data.goals.primary}</div>
          {data.goals.secondary.length > 0 && (
            <>
              <div className="text-stone-500 mt-1">Secondary:</div>
              <div className="font-medium mt-1">{data.goals.secondary.join(', ')}</div>
            </>
          )}
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-white border border-green-200 bg-green-50/30 p-5 rounded-2xl shadow-sm relative group">
        <button onClick={() => goToStep(5)} className="absolute top-4 right-4 text-xs font-medium text-green-600 hover:text-green-800 transition-colors">Edit</button>
        <h3 className="font-semibold text-green-900 mb-3 border-b border-green-100 pb-2">Nutrition Targets</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-stone-500">Calories:</div><div className="font-semibold text-green-700">{data.nutritionTargets.calories} kcal</div>
          <div className="text-stone-500">Protein:</div><div className="font-medium">{data.nutritionTargets.protein}g</div>
          <div className="text-stone-500">Carbs:</div><div className="font-medium">{data.nutritionTargets.carbs}g</div>
          <div className="text-stone-500">Fat:</div><div className="font-medium">{data.nutritionTargets.fat}g</div>
          <div className="text-stone-500">Water:</div><div className="font-medium">{data.nutritionTargets.water}L</div>
        </div>
      </div>

    </div>
  );
};
