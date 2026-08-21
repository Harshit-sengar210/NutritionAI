"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { generateDietPlan } from '@/lib/nutrition/dietPlan';

export default function ProfilePage() {
  const { profile, updateProfile, dietPreferences, updateMeal, meals, dietPlan, setDietPlan } = useNutrition();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: profile.personalInfo.fullName,
    age: profile.personalInfo.age,
    gender: profile.personalInfo.gender,
    height: profile.personalInfo.height,
    weight: profile.personalInfo.weight,
    activityLevel: profile.lifestyle.activityLevel || 'Moderate',
    goal: profile.goals.primary,
    dietPreference: profile.diet.preference || 'None',
  });

  // Target Form State
  const [targetType, setTargetType] = useState<'Recommended' | 'Custom'>('Recommended');
  const [targetData, setTargetData] = useState({ ...profile.nutritionTargets });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState('');

  // Calculations for Activity Card
  const totalMeals = meals.length;
  const daysTracked = new Set(meals.map(m => new Date(m.timestamp).toDateString())).size;
  const cals = meals.reduce((s, m) => s + m.calories, 0);
  const avgCals = daysTracked ? Math.round(cals / daysTracked) : 0;
  const nutritionScore = Math.round((avgCals / (profile.nutritionTargets.calories || 2000)) * 100);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (Number(formData.age) <= 0 || Number(formData.height) <= 0 || Number(formData.weight) <= 0) {
      alert("Please enter valid positive numbers for age, height, and weight.");
      return;
    }

    const updatedProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        fullName: formData.name,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
      },
      lifestyle: {
        ...profile.lifestyle,
        activityLevel: formData.activityLevel,
      },
      goals: {
        ...profile.goals,
        primary: formData.goal,
      },
      diet: {
        ...profile.diet,
        preference: formData.dietPreference,
      }
    };
    
    // Recalculate targets if on recommended mode
    if (targetType === 'Recommended') {
      const w = Number(formData.weight);
      const h = Number(formData.height);
      const a = Number(formData.age);
      // Mifflin-St Jeor
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr += formData.gender === 'Male' ? 5 : -161;
      
      const multipliers: Record<string, number> = {
        'Sedentary': 1.2, 'Light': 1.375, 'Moderate': 1.55, 'Active': 1.725, 'Very Active': 1.9
      };
      let tdee = bmr * (multipliers[formData.activityLevel] || 1.55);
      
      if (formData.goal === 'Lose Weight') tdee -= 500;
      else if (formData.goal === 'Muscle Gain') tdee += 300;
      
      const cals = Math.round(tdee);
      const newTargets = {
        calories: cals,
        protein: Math.round((cals * 0.25) / 4), // 25% protein
        carbs: Math.round((cals * 0.45) / 4), // 45% carbs
        fat: Math.round((cals * 0.30) / 9), // 30% fat
        water: 2.5
      };
      
      updatedProfile.nutritionTargets = newTargets;
      setTargetData(newTargets);
    }
    
    updateProfile(updatedProfile);
    
    // Also regenerate diet plan silently
    setDietPlan(generateDietPlan(updatedProfile, dietPreferences));

    setIsEditingProfile(false);
    setShowSuccess('✓ Profile updated');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const handleTargetSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      nutritionTargets: targetData
    });
    setIsEditingTargets(false);
    setShowSuccess('✓ Targets updated');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in relative">
        
        {/* Success Toast */}
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all z-50 flex items-center gap-2 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {showSuccess}
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Profile</h1>
            <p className="text-stone-500 font-medium mt-1">Manage your personal nutrition information.</p>
          </div>
          <Link href="/settings" className="w-12 h-12 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
            ⚙️
          </Link>
        </div>

        {/* HERO HEADER */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-green-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-green-700">{profile.personalInfo.fullName.charAt(0)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-stone-800 transition-colors shadow-md border-2 border-white opacity-0 group-hover:opacity-100">
              <span className="text-sm">📷</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-1">{profile.personalInfo.fullName}</h2>
            <p className="text-stone-500 font-medium mb-4">{profile.personalInfo.fullName.split(' ')[0].toLowerCase()}@example.com</p>
            <div className="inline-block px-4 py-2 bg-green-50 text-green-800 font-semibold rounded-full text-sm">
              Goal: {profile.goals.primary}
            </div>
          </div>
          
          <div className="z-10">
            <button onClick={() => setIsEditingProfile(true)} className="px-6 py-2.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors shadow-sm">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN */}
          <div className="md:col-span-2 space-y-8">
            
            {/* OVERVIEW */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Your Nutrition Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Age</div>
                  <div className="font-bold text-stone-900">{profile.personalInfo.age}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Gender</div>
                  <div className="font-bold text-stone-900">{profile.personalInfo.gender}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Height</div>
                  <div className="font-bold text-stone-900">{profile.personalInfo.height} cm</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Weight</div>
                  <div className="font-bold text-stone-900">{profile.personalInfo.weight} kg</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Activity Level</div>
                  <div className="font-bold text-stone-900">{profile.lifestyle.activityLevel || 'Moderate'}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Meals Per Day</div>
                  <div className="font-bold text-stone-900">{dietPreferences.mealsPerDay}</div>
                </div>
              </div>
            </div>

            {/* TARGETS */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Nutrition Targets</h3>
                <button onClick={() => setIsEditingTargets(true)} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Adjust Targets
                </button>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-stone-50 rounded-2xl mb-6">
                <div className="flex-1">
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Daily Calories</div>
                  <div className="text-3xl font-bold text-stone-900">{profile.nutritionTargets.calories} <span className="text-sm text-stone-500 font-medium">kcal</span></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Protein</div>
                  <div className="text-xl font-bold text-stone-900">{profile.nutritionTargets.protein}g</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Carbs</div>
                  <div className="text-xl font-bold text-stone-900">{profile.nutritionTargets.carbs}g</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Fat</div>
                  <div className="text-xl font-bold text-stone-900">{profile.nutritionTargets.fat}g</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Fiber</div>
                  <div className="text-xl font-bold text-stone-900">30g</div>
                </div>
              </div>
            </div>
            
            {/* DIET PREFERENCES */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Diet Preferences</h3>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-medium text-stone-900">
                  {profile.diet.preference || 'None'}
                </div>
                {profile.allergies?.map((a: string) => (
                  <div key={a} className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-900">
                    No {a}
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Profile Completion</h3>
              <div className="h-2 bg-stone-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '86%' }}></div>
              </div>
              <div className="text-3xl font-bold text-stone-900 mb-6">86%</div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-stone-700 font-medium"><span className="text-green-500 font-bold">✓</span> Basic information</li>
                <li className="flex items-center gap-3 text-stone-700 font-medium"><span className="text-green-500 font-bold">✓</span> Nutrition goal</li>
                <li className="flex items-center gap-3 text-stone-700 font-medium"><span className="text-green-500 font-bold">✓</span> Diet preference</li>
                <li className="flex items-center gap-3 text-stone-400 font-medium"><span className="w-3 h-3 rounded-full border-2 border-stone-300 ml-1"></span> Food preferences</li>
              </ul>
            </div>
            
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Profile Activity</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Meals Logged</div>
                    <div className="text-2xl font-bold text-stone-900">{totalMeals}</div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Days Tracked</div>
                    <div className="text-2xl font-bold text-stone-900">{daysTracked}</div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Nutrition Score</div>
                    <div className="text-2xl font-bold text-stone-900">{Math.min(100, Math.max(0, nutritionScore)) || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h2 className="text-xl font-bold text-stone-900">Edit Profile</h2>
              <button onClick={() => setIsEditingProfile(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleProfileSave} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50" required />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Age</label>
                    <input type="number" min="1" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Height (cm)</label>
                    <input type="number" min="50" max="300" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Weight (kg)</label>
                    <input type="number" min="20" max="300" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Activity Level</label>
                  <select value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50">
                    <option value="Sedentary">Sedentary (Little to no exercise)</option>
                    <option value="Light">Light (Exercise 1-3 times/week)</option>
                    <option value="Moderate">Moderate (Exercise 3-5 times/week)</option>
                    <option value="Active">Active (Exercise 4-5 times/week)</option>
                    <option value="Very Active">Very Active (Exercise 6-7 times/week)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Primary Goal</label>
                  <select value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50">
                    <option value="Lose Weight">Lose Weight</option>
                    <option value="Maintain Weight">Maintain Weight</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Improve General Nutrition">Improve General Nutrition</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Diet Preference</label>
                  <select value={formData.dietPreference} onChange={e => setFormData({...formData, dietPreference: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50">
                    <option value="None">None / Balanced</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8">
                <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl shadow-md hover:bg-stone-800 transition-all active:scale-[0.98]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* EDIT TARGETS MODAL */}
      {isEditingTargets && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h2 className="text-xl font-bold text-stone-900">Adjust Targets</h2>
              <button onClick={() => setIsEditingTargets(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleTargetSave} className="p-6">
              
              <div className="flex bg-stone-100 rounded-lg p-1 mb-6">
                <button type="button" onClick={() => setTargetType('Recommended')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${targetType === 'Recommended' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Recommended</button>
                <button type="button" onClick={() => setTargetType('Custom')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${targetType === 'Custom' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Custom</button>
              </div>
              
              {targetType === 'Custom' && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800 font-medium flex gap-3 items-start">
                  <span>ℹ️</span> Custom targets override application-generated recommended targets.
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 flex justify-between">
                    Calories
                    <span className="text-stone-400 font-normal">kcal</span>
                  </label>
                  <input type="number" value={targetData.calories} onChange={e => setTargetData({...targetData, calories: Number(e.target.value)})} disabled={targetType === 'Recommended'} className={`w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all ${targetType === 'Recommended' ? 'bg-stone-100 text-stone-500' : 'bg-stone-50'}`} required />
                </div>
                
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Protein</label>
                    <input type="number" value={targetData.protein} onChange={e => setTargetData({...targetData, protein: Number(e.target.value)})} disabled={targetType === 'Recommended'} className={`w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all ${targetType === 'Recommended' ? 'bg-stone-100 text-stone-500' : 'bg-stone-50'}`} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Carbs</label>
                    <input type="number" value={targetData.carbs} onChange={e => setTargetData({...targetData, carbs: Number(e.target.value)})} disabled={targetType === 'Recommended'} className={`w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all ${targetType === 'Recommended' ? 'bg-stone-100 text-stone-500' : 'bg-stone-50'}`} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Fat</label>
                    <input type="number" value={targetData.fat} onChange={e => setTargetData({...targetData, fat: Number(e.target.value)})} disabled={targetType === 'Recommended'} className={`w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all ${targetType === 'Recommended' ? 'bg-stone-100 text-stone-500' : 'bg-stone-50'}`} required />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl shadow-md hover:bg-stone-800 transition-all active:scale-[0.98]">
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
