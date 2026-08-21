"use client";

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { foodDatabase, FoodCategory } from '@/data/foods';
import { useRouter } from 'next/navigation';

export default function FoodDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const router = useRouter();

  const categories: (FoodCategory | 'All')[] = [
    'All', 'Grains', 'Fruits', 'Vegetables', 'Dairy', 'Protein', 'Nuts & Seeds', 'Beverages', 'Snacks'
  ];

  const filteredFoods = useMemo(() => {
    return foodDatabase.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">Food Database</h1>
        <p className="text-stone-500 font-medium text-sm md:text-base mt-1">
          Explore foods and understand their nutritional value.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm mb-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
            <input
              type="text"
              placeholder="Search foods (e.g., Paneer, high protein)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0 shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {filteredFoods.map(food => (
          <div 
            key={food.id}
            onClick={() => router.push(`/food-database/${food.id}`)}
            className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-md cursor-pointer transition-all group flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              {food.category === 'Fruits' ? '🍎' : 
               food.category === 'Vegetables' ? '🥦' : 
               food.category === 'Protein' ? '🍗' : 
               food.category === 'Dairy' ? '🥛' : 
               food.category === 'Grains' ? '🌾' : '🍲'}
            </div>
            
            <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-green-600 transition-colors">{food.name}</h3>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">{food.category}</span>
            
            <div className="mt-auto pt-4 border-t border-stone-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-lg font-bold text-stone-900">{food.calories}</span>
                <span className="text-xs text-stone-500 mb-1">kcal / {food.baseQuantity}{food.servingUnit}</span>
              </div>
              
              <div className="flex gap-2 text-xs font-medium">
                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">P: {food.protein}g</span>
                <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">C: {food.carbs}g</span>
                <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded">F: {food.fat}g</span>
              </div>
            </div>
          </div>
        ))}

        {filteredFoods.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-500">
            No foods found matching your search.
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}
