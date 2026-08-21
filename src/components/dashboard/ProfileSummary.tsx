"use client";

import React from 'react';
import Link from 'next/link';
import { useNutrition } from '@/context/NutritionContext';

export const ProfileSummary = () => {
  const { profile } = useNutrition();

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full animate-fade-in-up" style={{ animationDelay: '900ms' }}>
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Profile Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500">Goal:</span>
            <span className="font-medium text-stone-900 text-right">{profile.goals.primary}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500">Diet:</span>
            <span className="font-medium text-stone-900 text-right">{profile.diet.preference}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500">Target Calories:</span>
            <span className="font-medium text-stone-900 text-right">{profile.nutritionTargets.calories} kcal</span>
          </div>
        </div>
      </div>
      
      <Link href="/profile" className="w-full mt-6 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors text-center text-sm">
        View Full Profile
      </Link>
    </div>
  );
};
