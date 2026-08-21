"use client";

import React from 'react';
import Link from 'next/link';
import { DateRange } from '@/lib/nutrition/analytics';

interface AnalyticsHeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export const AnalyticsHeader = ({ dateRange, setDateRange }: AnalyticsHeaderProps) => {
  const ranges: DateRange[] = ['Today', '7 Days', '30 Days'];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">Nutrition Analytics</h1>
        <p className="text-stone-500 font-medium text-sm md:text-base mt-1">
          Understand your nutrition patterns and track your progress.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <Link 
          href={`/reports?range=${dateRange}`}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 shadow-sm text-sm"
        >
          View Detailed Report
        </Link>
        <div className="flex items-center bg-white border border-stone-200 rounded-xl shadow-sm p-1">
          {ranges.map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-stone-900 text-white shadow'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
