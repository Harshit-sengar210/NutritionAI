"use client";

import React from 'react';

interface MealsHeaderProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  onAddMeal: () => void;
}

export const MealsHeader = ({ selectedDate, onChangeDate, onAddMeal }: MealsHeaderProps) => {
  
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onChangeDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // Prevent navigating beyond today
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (newDate <= today) {
      onChangeDate(newDate);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() >= tomorrow.getDate() && 
           date.getMonth() === tomorrow.getMonth() && 
           date.getFullYear() === tomorrow.getFullYear();
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
      return "Yesterday";
    }

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">Meals</h1>
        <p className="text-stone-500 font-medium text-sm md:text-base mt-1">
          Track what you eat and understand your nutrition.
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4 self-start md:self-auto">
        <div className="flex items-center bg-white border border-stone-200 rounded-full shadow-sm p-1">
          <button 
            onClick={handlePrevDay}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
          >
            &lt;
          </button>
          <span className="text-sm font-semibold text-stone-900 px-4 min-w-[120px] text-center">
            {formatDate(selectedDate)}
          </span>
          <button 
            onClick={handleNextDay}
            disabled={isTomorrow(selectedDate) || isToday(selectedDate)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isToday(selectedDate) ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            &gt;
          </button>
        </div>

        <button 
          onClick={onAddMeal}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-sm whitespace-nowrap hidden md:block"
        >
          + Add Meal
        </button>
      </div>
    </div>
  );
};
