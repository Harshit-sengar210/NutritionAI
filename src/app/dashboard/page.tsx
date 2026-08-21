import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NutritionHero } from '@/components/dashboard/NutritionHero';
import { MacroSummary } from '@/components/dashboard/MacroSummary';
import { TodaysMeals } from '@/components/dashboard/TodaysMeals';
import { NutritionInsight } from '@/components/dashboard/NutritionInsight';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WeeklyNutritionChart } from '@/components/dashboard/WeeklyNutritionChart';
import { NutritionScore } from '@/components/dashboard/NutritionScore';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProfileSummary } from '@/components/dashboard/ProfileSummary';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-fade-in-up">
              <NutritionHero />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <MacroSummary />
            </div>
          </div>

          <NutritionInsight />
          
          <QuickActions />

          <WeeklyNutritionChart />
          
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-96">
            <TodaysMeals />
          </div>
          
          <NutritionScore />
          
          <RecentActivity />
          
          <ProfileSummary />
        </div>

      </div>
    </DashboardLayout>
  );
}
