import React, { useState } from 'react';
import { OnboardingState } from '@/types/onboarding';

interface StepAllergiesProps {
  data: OnboardingState['allergies'];
  updateData: (data: OnboardingState['allergies']) => void;
}

const commonAllergies = [
  "Milk / Dairy",
  "Peanuts",
  "Tree Nuts",
  "Eggs",
  "Gluten",
  "Soy",
  "Shellfish",
  "Fish"
];

export const StepAllergies = ({ data, updateData }: StepAllergiesProps) => {
  const [otherInput, setOtherInput] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const toggleAllergy = (allergy: string) => {
    if (allergy === "None") {
      updateData(["None"]);
      setIsOtherSelected(false);
      return;
    }

    let current = data.filter(a => a !== "None");

    if (current.includes(allergy)) {
      current = current.filter(a => a !== allergy);
    } else {
      current.push(allergy);
    }

    updateData(current);
  };

  const handleOtherToggle = () => {
    if (isOtherSelected) {
      // Remove any custom allergies not in the common list
      const filtered = data.filter(a => commonAllergies.includes(a));
      updateData(filtered);
      setIsOtherSelected(false);
      setOtherInput("");
    } else {
      setIsOtherSelected(true);
      // If "None" is selected, remove it
      if (data.includes("None")) {
        updateData([]);
      }
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherInput(e.target.value);
    const standardAllergies = data.filter(a => commonAllergies.includes(a));
    if (e.target.value.trim()) {
      updateData([...standardAllergies, e.target.value.trim()]);
    } else {
      updateData(standardAllergies);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <p className="text-sm text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100">
        Your dietary restrictions help us avoid unsuitable food recommendations.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => toggleAllergy("None")}
          className={`p-4 rounded-xl border text-sm font-medium transition-all ${
            data.includes("None") || data.length === 0
              ? 'bg-green-500 border-green-500 text-white shadow-sm'
              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
          }`}
        >
          None
        </button>
        
        {commonAllergies.map(allergy => (
          <button
            key={allergy}
            onClick={() => toggleAllergy(allergy)}
            className={`p-4 rounded-xl border text-sm font-medium transition-all ${
              data.includes(allergy)
                ? 'bg-green-100 border-green-300 text-green-800 shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            {allergy}
          </button>
        ))}

        <button
          onClick={handleOtherToggle}
          className={`p-4 rounded-xl border text-sm font-medium transition-all ${
            isOtherSelected
              ? 'bg-green-100 border-green-300 text-green-800 shadow-sm'
              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
          }`}
        >
          Other
        </button>
      </div>

      {isOtherSelected && (
        <div className="pt-2 animate-fade-in">
          <input
            type="text"
            value={otherInput}
            onChange={handleOtherChange}
            placeholder="Please specify..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
          />
        </div>
      )}
    </div>
  );
};
