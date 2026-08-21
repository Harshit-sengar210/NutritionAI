import React, { useState } from 'react';
import { OnboardingState } from '@/types/onboarding';

interface StepPersonalProps {
  data: OnboardingState['personalInfo'];
  updateData: (data: Partial<OnboardingState['personalInfo']>) => void;
}

export const StepPersonal = ({ data, updateData }: StepPersonalProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
    } else if (field === "age" && (isNaN(Number(value)) || Number(value) < 13 || Number(value) > 120)) {
      error = "Enter a valid age (13-120)";
    } else if (field === "height" && (isNaN(Number(value)) || Number(value) < 50 || Number(value) > 300)) {
      error = "Enter a valid height in cm";
    } else if (field === "weight" && (isNaN(Number(value)) || Number(value) < 20 || Number(value) > 400)) {
      error = "Enter a valid weight in kg";
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    validateField(name, value);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="e.g. Alex Johnson"
          className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${
            errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-green-500'
          }`}
        />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Age</label>
          <input
            type="number"
            name="age"
            value={data.age}
            onChange={handleChange}
            placeholder="Years"
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${
              errors.age ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-green-500'
            }`}
          />
          {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Gender</label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all appearance-none ${
              errors.gender ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-green-500'
            }`}
          >
            <option value="" disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={data.height}
            onChange={handleChange}
            placeholder="e.g. 175"
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${
              errors.height ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-green-500'
            }`}
          />
          {errors.height && <p className="text-xs text-red-500">{errors.height}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={data.weight}
            onChange={handleChange}
            placeholder="e.g. 70"
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${
              errors.weight ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-green-500'
            }`}
          />
          {errors.weight && <p className="text-xs text-red-500">{errors.weight}</p>}
        </div>
      </div>
    </div>
  );
};
