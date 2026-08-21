import React from 'react';
import { OnboardingState } from '@/types/onboarding';
import { SelectionCard } from './SelectionCard';

interface StepGoalsProps {
  data: OnboardingState['goals'];
  updateData: (data: Partial<OnboardingState['goals']>) => void;
}

const primaryGoals = [
  { id: "Weight Loss", title: "Weight Loss", desc: "Burn fat and lose weight safely", icon: "📉" },
  { id: "Weight Gain", title: "Weight Gain", desc: "Build mass and increase weight", icon: "📈" },
  { id: "Muscle Gain", title: "Muscle Gain", desc: "Focus on hypertrophy and strength", icon: "💪" },
  { id: "Maintain Current Weight", title: "Maintain Current Weight", desc: "Keep your weight stable", icon: "⚖️" },
  { id: "Improve General Nutrition", title: "Improve General Nutrition", desc: "Eat healthier and feel better", icon: "🥗" }
];

const secondaryGoals = [
  "Improve protein intake",
  "Eat more balanced meals",
  "Improve meal consistency",
  "Reduce processed foods",
  "More energy throughout the day"
];

export const StepGoals = ({ data, updateData }: StepGoalsProps) => {

  const toggleSecondary = (goal: string) => {
    if (data.secondary.includes(goal)) {
      updateData({ secondary: data.secondary.filter(g => g !== goal) });
    } else {
      updateData({ secondary: [...data.secondary, goal] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Primary Goal (Select one)</label>
        <div className="grid grid-cols-1 gap-3">
          {primaryGoals.map(goal => (
            <SelectionCard
              key={goal.id}
              title={goal.title}
              description={goal.desc}
              icon={<span className="text-xl">{goal.icon}</span>}
              selected={data.primary === goal.id}
              onClick={() => updateData({ primary: goal.id })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Secondary Goals (Optional)</label>
        <div className="flex flex-wrap gap-2">
          {secondaryGoals.map(goal => (
            <button
              key={goal}
              onClick={() => toggleSecondary(goal)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                data.secondary.includes(goal)
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
