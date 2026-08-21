"use client";

import React, { useState, useEffect } from 'react';
import { Meal, useNutrition } from '@/context/NutritionContext';
import { FoodItem, searchFoods } from '@/lib/nutrition/foodDatabase';
import { calculateNutrition } from '@/lib/nutrition/calculations';
import { useRouter } from 'next/navigation';

interface AdvancedAddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate: Date;
  initialType?: string;
  editMeal?: Meal;
}

export const AdvancedAddMealModal = ({ isOpen, onClose, initialDate, initialType = 'Breakfast', editMeal }: AdvancedAddMealModalProps) => {
  const { addMeal, updateMeal } = useNutrition();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [mealType, setMealType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Custom manual entry
  const [isManual, setIsManual] = useState(false);
  const [manualData, setManualData] = useState({
    name: '', servingSize: 'serving', calories: '', protein: '', carbs: '', fat: '', fiber: '', sugar: '', sodium: ''
  });

  // Pre-fill if editing
  useEffect(() => {
    if (isOpen && editMeal) {
      setStep(3); // Skip straight to edit
      setIsManual(true);
      setMealType(editMeal.type);
      setManualData({
        name: editMeal.name,
        servingSize: editMeal.servingSize,
        calories: editMeal.calories.toString(),
        protein: editMeal.protein.toString(),
        carbs: editMeal.carbs.toString(),
        fat: editMeal.fat.toString(),
        fiber: editMeal.fiber.toString(),
        sugar: editMeal.sugar.toString(),
        sodium: editMeal.sodium.toString(),
      });
      setQuantity(editMeal.quantity);
    } else if (isOpen) {
      setStep(1);
      setMealType(initialType);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedFood(null);
      setQuantity(1);
      setIsManual(false);
      setManualData({ name: '', servingSize: 'serving', calories: '', protein: '', carbs: '', fat: '', fiber: '', sugar: '', sodium: '' });
    }
  }, [isOpen, editMeal, initialType]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchFoods(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  const currentNutrition = selectedFood ? calculateNutrition(selectedFood, quantity * selectedFood.baseQuantity) : null;

  const handleSave = () => {
    const ts = new Date(initialDate);
    // Rough time based on type
    if (mealType === 'Breakfast') ts.setHours(8, 30);
    else if (mealType === 'Lunch') ts.setHours(13, 0);
    else if (mealType === 'Snack') ts.setHours(16, 0);
    else if (mealType === 'Dinner') ts.setHours(19, 30);

    let finalMeal: Omit<Meal, 'id'>;

    if (isManual) {
      finalMeal = {
        type: mealType,
        name: manualData.name || 'Custom Food',
        servingSize: manualData.servingSize,
        quantity: quantity,
        calories: parseInt(manualData.calories) || 0,
        protein: parseFloat(manualData.protein) || 0,
        carbs: parseFloat(manualData.carbs) || 0,
        fat: parseFloat(manualData.fat) || 0,
        fiber: parseFloat(manualData.fiber) || 0,
        sugar: parseFloat(manualData.sugar) || 0,
        sodium: parseInt(manualData.sodium) || 0,
        timestamp: ts
      };
    } else if (selectedFood && currentNutrition) {
      finalMeal = {
        type: mealType,
        name: selectedFood.name,
        servingSize: selectedFood.servingUnit,
        quantity: quantity,
        calories: currentNutrition.calories,
        protein: currentNutrition.protein,
        carbs: currentNutrition.carbs,
        fat: currentNutrition.fat,
        fiber: currentNutrition.fiber,
        sugar: currentNutrition.sugar,
        sodium: currentNutrition.sodium,
        micronutrients: selectedFood.micronutrients,
        timestamp: ts
      };
    } else {
      return; // Should not happen
    }

    if (editMeal) {
      updateMeal(editMeal.id, finalMeal);
    } else {
      addMeal(finalMeal);
    }
    
    // Tiny delay to let user see success, then close
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-fade mt-auto sm:mt-0 flex flex-col max-h-[90vh]">
        
        <div className="p-4 sm:p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && !editMeal && (
              <button onClick={() => setStep(step - 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50">
                ←
              </button>
            )}
            <h2 className="text-lg sm:text-xl font-semibold text-stone-900">
              {editMeal ? 'Edit Meal' : 'Add Meal'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: Choose entry method */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">What meal are you adding?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(t => (
                    <button
                      key={t}
                      onClick={() => setMealType(t)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-colors ${mealType === t ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">How would you like to add it?</label>
                <div className="space-y-2">
                  <button onClick={() => setStep(2)} className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 transition-all group bg-white">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔍</span>
                      <span className="font-medium text-stone-800 group-hover:text-green-800">Search Food</span>
                    </div>
                    <span className="text-stone-400">→</span>
                  </button>
                  <button onClick={() => { setIsManual(true); setStep(3); }} className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 transition-all group bg-white">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✍️</span>
                      <span className="font-medium text-stone-800 group-hover:text-green-800">Enter Manually</span>
                    </div>
                    <span className="text-stone-400">→</span>
                  </button>
                  <button onClick={() => { onClose(); router.push('/food-scanner'); }} className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 transition-all group bg-white">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📷</span>
                      <span className="font-medium text-stone-800 group-hover:text-green-800">Scan Food</span>
                    </div>
                    <span className="text-stone-400">→</span>
                  </button>
                  <div className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-stone-50 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎙️</span>
                      <span className="font-medium text-stone-500">Voice Log (Coming Soon)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Search Food */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in flex flex-col h-full min-h-[300px]">
              <input
                type="text"
                placeholder="Search food... (e.g. Apple, Rice, Chicken)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
              
              <div className="flex-1 overflow-y-auto space-y-2 border border-stone-100 rounded-xl bg-stone-50/50 p-2">
                {searchResults.length > 0 ? (
                  searchResults.map(food => (
                    <button
                      key={food.id}
                      onClick={() => { setSelectedFood(food); setStep(3); }}
                      className="w-full text-left p-3 bg-white border border-stone-100 rounded-lg hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-stone-900">{food.name}</span>
                        <span className="text-xs font-semibold text-green-600">{food.calories} kcal</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        per {food.baseQuantity} {food.servingUnit}
                      </div>
                    </button>
                  ))
                ) : (
                  searchQuery.length > 0 ? (
                    <div className="p-4 text-center text-sm text-stone-500">No foods found in local database.</div>
                  ) : (
                    <div className="p-4 text-center text-sm text-stone-400">Type to search...</div>
                  )
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Adjust Serving / Manual Entry */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in pb-16 sm:pb-0">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Food Details</label>
                {isManual ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Food Name"
                      value={manualData.name}
                      onChange={e => setManualData({...manualData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                    <div className="flex gap-3">
                      <div className="flex-1 border border-stone-200 rounded-xl overflow-hidden flex bg-white">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-stone-500 hover:bg-stone-50 border-r border-stone-200">-</button>
                        <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} className="w-full text-center focus:outline-none" />
                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-stone-500 hover:bg-stone-50 border-l border-stone-200">+</button>
                      </div>
                      <input
                        type="text"
                        placeholder="Serving Unit (e.g. bowl, g)"
                        value={manualData.servingSize}
                        onChange={e => setManualData({...manualData, servingSize: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h3 className="font-semibold text-stone-900 mb-3">{selectedFood?.name}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border border-stone-200 rounded-xl overflow-hidden flex bg-white">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-stone-500 hover:bg-stone-50 border-r border-stone-200">-</button>
                        <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} className="w-full text-center focus:outline-none font-medium" />
                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-stone-500 hover:bg-stone-50 border-l border-stone-200">+</button>
                      </div>
                      <div className="flex-1 text-sm font-medium text-stone-600 bg-white px-4 py-3 rounded-xl border border-stone-200 flex items-center justify-center">
                        x {selectedFood?.baseQuantity} {selectedFood?.servingUnit}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Nutrition {isManual ? 'Values' : 'Preview'}</label>
                
                {isManual ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">KCAL</span>
                      <input type="number" value={manualData.calories} onChange={e => setManualData({...manualData, calories: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">PRO</span>
                      <input type="number" value={manualData.protein} onChange={e => setManualData({...manualData, protein: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">CARB</span>
                      <input type="number" value={manualData.carbs} onChange={e => setManualData({...manualData, carbs: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">FAT</span>
                      <input type="number" value={manualData.fat} onChange={e => setManualData({...manualData, fat: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">FIBER</span>
                      <input type="number" value={manualData.fiber} onChange={e => setManualData({...manualData, fiber: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-stone-400">SUGAR</span>
                      <input type="number" value={manualData.sugar} onChange={e => setManualData({...manualData, sugar: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-green-500" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="text-center p-2">
                      <div className="text-lg font-bold text-green-600">{currentNutrition?.calories}</div>
                      <div className="text-[10px] font-semibold text-stone-500 uppercase">kcal</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-lg font-bold text-stone-800">{currentNutrition?.protein}</div>
                      <div className="text-[10px] font-semibold text-stone-500 uppercase">Protein (g)</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-lg font-bold text-stone-800">{currentNutrition?.carbs}</div>
                      <div className="text-[10px] font-semibold text-stone-500 uppercase">Carbs (g)</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-lg font-bold text-stone-800">{currentNutrition?.fat}</div>
                      <div className="text-[10px] font-semibold text-stone-500 uppercase">Fat (g)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {step === 3 && (
          <div className="p-4 sm:p-6 border-t border-stone-100 bg-white shrink-0">
            <button
              onClick={handleSave}
              disabled={isManual && (!manualData.name || !manualData.calories)}
              className="w-full py-4 px-4 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              {editMeal ? 'Save Changes' : 'Add to ' + mealType}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
