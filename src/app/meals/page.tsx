"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MealsHeader } from '@/components/meals/MealsHeader';
import { DailyNutritionSummary } from '@/components/meals/DailyNutritionSummary';
import { MealTimeline } from '@/components/meals/MealTimeline';
import { AdvancedAddMealModal } from '@/components/meals/AdvancedAddMealModal';
import { DailyNutritionInsight } from '@/components/meals/DailyNutritionInsight';
import { WeeklyMealHistory } from '@/components/meals/WeeklyMealHistory';
import { useNutrition, Meal } from '@/context/NutritionContext';

export default function MealsPage() {
  const { meals, profile } = useNutrition();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialType, setInitialType] = useState('Breakfast');
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const filteredMeals = meals.filter(m => isSameDay(new Date(m.timestamp), selectedDate));

  const handleAddMeal = (type?: string) => {
    setInitialType(type || 'Breakfast');
    setEditingMeal(undefined);
    setIsModalOpen(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <MealsHeader 
        selectedDate={selectedDate} 
        onChangeDate={setSelectedDate} 
        onAddMeal={() => handleAddMeal()} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <DailyNutritionInsight meals={filteredMeals} profile={profile} />
          
          <MealTimeline 
            meals={filteredMeals} 
            onAddMeal={handleAddMeal} 
            onEditMeal={handleEditMeal} 
          />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <DailyNutritionSummary meals={filteredMeals} profile={profile} />
        </div>

      </div>

      <WeeklyMealHistory selectedDate={selectedDate} onChangeDate={setSelectedDate} />

      <AdvancedAddMealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialDate={selectedDate}
        initialType={initialType}
        editMeal={editingMeal}
      />
      
    </DashboardLayout>
  );
}
