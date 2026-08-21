"use client";

import React from 'react';
import { DateRange } from '@/lib/nutrition/analytics';

interface AnalyticsInsightsProps {
  score: number;
  calTrend: number;
  range: DateRange;
}

export const AnalyticsInsights = ({ score, calTrend, range }: AnalyticsInsightsProps) => {
  const getInsights = () => {
    const insights = [];
    
    if (score > 80) {
      insights.push("Your meal logging consistency has been excellent.");
    } else {
      insights.push("Try to log your meals more consistently to improve your score.");
    }

    if (calTrend > 5) {
      insights.push(`Your calorie intake has increased by ${calTrend}% compared to the previous period.`);
    } else if (calTrend < -5) {
      insights.push(`Your calorie intake has decreased by ${Math.abs(calTrend)}% compared to the previous period.`);
    } else {
      insights.push("Your calorie intake has remained highly consistent.");
    }

    if (range === 'Today') {
      insights.push("Keep up the momentum for the rest of the day!");
    } else {
      insights.push("Most of your logged calories are coming from Dinner and Lunch.");
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full animate-fade-in-up" style={{ animationDelay: '700ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl text-green-500 animate-pulse">✦</span>
        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Nutrition AI Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
            <p className="text-sm text-stone-600 font-medium leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
