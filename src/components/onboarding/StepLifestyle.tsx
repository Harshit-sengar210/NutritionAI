import React from 'react';
import { OnboardingState } from '@/types/onboarding';
import { SelectionCard } from './SelectionCard';

interface StepLifestyleProps {
  data: OnboardingState['lifestyle'];
  updateData: (data: Partial<OnboardingState['lifestyle']>) => void;
}

const activityLevels = [
  { id: 'Sedentary', title: 'Sedentary', desc: 'Little or no regular exercise' },
  { id: 'Lightly Active', title: 'Lightly Active', desc: 'Light exercise or activity' },
  { id: 'Moderately Active', title: 'Moderately Active', desc: 'Exercise several times a week' },
  { id: 'Very Active', title: 'Very Active', desc: 'Frequent intense activity' },
  { id: 'Extremely Active', title: 'Extremely Active', desc: 'Highly active lifestyle' },
];

export const StepLifestyle = ({ data, updateData }: StepLifestyleProps) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">Activity Level</label>
        <div className="grid grid-cols-1 gap-3">
          {activityLevels.map(level => (
            <SelectionCard
              key={level.id}
              title={level.title}
              description={level.desc}
              selected={data.activityLevel === level.id}
              onClick={() => updateData({ activityLevel: level.id })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">Typical daily routine (Optional)</label>
        <select
          value={data.dailyRoutine}
          onChange={(e) => updateData({ dailyRoutine: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all appearance-none"
        >
          <option value="" disabled>Select your routine</option>
          <option value="Desk Job">Desk Job (Mostly sitting)</option>
          <option value="On Feet">On Feet (Retail, Teaching, etc.)</option>
          <option value="Manual Labor">Manual Labor (Heavy lifting)</option>
          <option value="Variable">Variable / Irregular</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">Average Sleep Duration (Optional)</label>
        <select
          value={data.sleepDuration}
          onChange={(e) => updateData({ sleepDuration: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all appearance-none"
        >
          <option value="" disabled>Select sleep duration</option>
          <option value="Less than 5 hours">Less than 5 hours</option>
          <option value="5-6 hours">5-6 hours</option>
          <option value="7-8 hours">7-8 hours</option>
          <option value="More than 8 hours">More than 8 hours</option>
        </select>
      </div>
    </div>
  );
};
