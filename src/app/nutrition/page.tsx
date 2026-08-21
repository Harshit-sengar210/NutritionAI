"use client";

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { 
  DateRange, 
  filterMealsByDateRange, 
  getPreviousRangeMeals,
  calculateAverages, 
  calculateTrend,
  calculateMacroDistribution,
  calculateMealDistribution,
  getTopContributors,
  calculateConsistencyScore,
  generateDailyTrendData
} from '@/lib/nutrition/analytics';

// Components
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { NutritionOverviewCards } from '@/components/analytics/NutritionOverviewCards';
import { CalorieTrendChart } from '@/components/analytics/CalorieTrendChart';
import { MacroDonutChart } from '@/components/analytics/MacroDonutChart';
import { TargetComparisonBars } from '@/components/analytics/TargetComparisonBars';
import { MealDistribution } from '@/components/analytics/MealDistribution';
import { NutrientBreakdown } from '@/components/analytics/NutrientBreakdown';
import { TopContributors } from '@/components/analytics/TopContributors';
import { ConsistencyScore } from '@/components/analytics/ConsistencyScore';
import { AnalyticsInsights } from '@/components/analytics/AnalyticsInsights';

export default function NutritionAnalyticsPage() {
  const { profile, meals } = useNutrition();
  const [dateRange, setDateRange] = useState<DateRange>('7 Days');

  // Compute analytics data based on date range
  const {
    currentMeals,
    prevMeals,
    daysToDivide
  } = useMemo(() => {
    let daysToDivide = 1;
    if (dateRange === '7 Days') daysToDivide = 7;
    if (dateRange === '30 Days') daysToDivide = 30;

    return {
      currentMeals: filterMealsByDateRange(meals, dateRange),
      prevMeals: getPreviousRangeMeals(meals, dateRange),
      daysToDivide
    };
  }, [meals, dateRange]);

  const averages = useMemo(() => calculateAverages(currentMeals, dateRange), [currentMeals, dateRange]);
  const prevAverages = useMemo(() => calculateAverages(prevMeals, dateRange), [prevMeals, dateRange]);
  
  const calTrend = calculateTrend(averages.calories, prevAverages.calories);
  const macroDist = useMemo(() => calculateMacroDistribution(currentMeals), [currentMeals]);
  const mealDist = useMemo(() => calculateMealDistribution(currentMeals), [currentMeals]);
  const calContributors = useMemo(() => getTopContributors(currentMeals, 'calories'), [currentMeals]);
  const proContributors = useMemo(() => getTopContributors(currentMeals, 'protein'), [currentMeals]);
  const score = useMemo(() => calculateConsistencyScore(currentMeals, profile, dateRange), [currentMeals, profile, dateRange]);
  const trendData = useMemo(() => generateDailyTrendData(currentMeals, dateRange), [currentMeals, dateRange]);

  return (
    <DashboardLayout>
      <AnalyticsHeader dateRange={dateRange} setDateRange={setDateRange} />
      
      {currentMeals.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-[2.5rem] p-12 text-center animate-fade-in flex flex-col items-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-2xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">Not enough data yet</h2>
          <p className="text-stone-500 max-w-md">Keep logging meals to unlock deeper nutrition insights for this time period.</p>
        </div>
      ) : (
        <>
          <NutritionOverviewCards 
            averages={averages} 
            prevAverages={prevAverages} 
            targets={profile.nutritionTargets} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CalorieTrendChart data={trendData} target={profile.nutritionTargets.calories} />
            </div>
            <div className="lg:col-span-1">
              <MacroDonutChart distribution={macroDist} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TargetComparisonBars averages={averages} targets={profile.nutritionTargets} />
            </div>
            <div className="lg:col-span-1">
              <MealDistribution distribution={mealDist} />
            </div>
            <div className="lg:col-span-1">
              <ConsistencyScore score={score} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <NutrientBreakdown meals={currentMeals} days={daysToDivide} />
            </div>
            <div className="md:col-span-1">
              <TopContributors calorieContributors={calContributors} proteinContributors={proContributors} />
            </div>
            <div className="md:col-span-1">
              <AnalyticsInsights score={score} calTrend={calTrend} range={dateRange} />
            </div>
          </div>
        </>
      )}

    </DashboardLayout>
  );
}
