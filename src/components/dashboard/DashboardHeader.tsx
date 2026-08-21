"use client";

import React from 'react';
import Link from 'next/link';
import { useNutrition } from '@/context/NutritionContext';

export const DashboardHeader = () => {
  const { profile } = useNutrition();
  
  // Get first name or default to Guest
  const firstName = profile.personalInfo.fullName.split(' ')[0] || 'Guest';

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">
          Good Morning, {firstName} <span className="inline-block hover:animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-stone-500 font-medium text-sm md:text-base">
          Here&apos;s your nutrition overview for today.
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link 
          href="/reports"
          className="hidden md:flex px-4 py-2 bg-stone-900 text-white font-medium rounded-full text-sm hover:bg-stone-800 transition-colors shadow-sm items-center gap-2"
        >
          <span>📊</span> View Full Report
        </Link>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors relative focus:outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm">
          <span className="text-xl">🔔</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold border border-green-200 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm">
          {firstName.charAt(0)}
        </button>
      </div>
    </header>
  );
};
