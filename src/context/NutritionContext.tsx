"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OnboardingState, initialOnboardingState } from '@/types/onboarding';
import { DailyDietPlan, DietPlanPreferences, generateDietPlan } from '@/lib/nutrition/dietPlan';
import { ConversationMessage } from '@/lib/ai/nutritionist';

export interface Micronutrients {
  vitaminA?: string;
  vitaminC?: string;
  vitaminD?: string;
  calcium?: string;
  iron?: string;
  potassium?: string;
}

export interface Meal {
  id: string;
  type: string;
  name: string;
  servingSize: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  micronutrients?: Micronutrients;
  timestamp: Date;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: Date;
  type: 'meal' | 'insight' | 'system';
}

interface WeeklyDataPoint {
  day: string;
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Phase 12 Extensions
export interface NotificationPreferences {
  mealReminders: boolean;
  dailySummary: boolean;
  dietPlanReminders: boolean;
  waterReminders: boolean;
  aiRecommendations: boolean;
  weeklyReport: boolean;
  goalProgressUpdates: boolean;
  reminders: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface AiPreferences {
  personalizedRecommendations: boolean;
  aiNutritionistContext: boolean;
  foodBasedSuggestions: boolean;
  useMealHistory: boolean;
  useAnalytics: boolean;
}

export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  reducedMotion: boolean;
}

export interface PrivacyPreferences {
  // Demo states for settings UI
  analyticsSharing: boolean;
}

interface NutritionContextType {
  profile: OnboardingState;
  setProfile: (profile: OnboardingState) => void;
  updateProfile: (updates: Partial<OnboardingState>) => void;
  meals: Meal[];
  todaysMeals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  activities: Activity[];
  addActivity: (message: string, type: Activity['type']) => void;
  weeklyData: WeeklyDataPoint[];
  
  // Phase 8 & 9 extensions
  dietPlan: DailyDietPlan[];
  setDietPlan: (plan: DailyDietPlan[]) => void;
  dietPreferences: DietPlanPreferences;
  setDietPreferences: (prefs: DietPlanPreferences) => void;
  
  aiConversation: ConversationMessage[];
  addAiMessage: (msg: ConversationMessage) => void;

  // Phase 12 extensions
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: (prefs: NotificationPreferences) => void;
  aiPreferences: AiPreferences;
  setAiPreferences: (prefs: AiPreferences) => void;
  appearancePreferences: AppearancePreferences;
  setAppearancePreferences: (prefs: AppearancePreferences) => void;
  privacyPreferences: PrivacyPreferences;
  setPrivacyPreferences: (prefs: PrivacyPreferences) => void;
  clearLocalData: () => void;
}

// Generate dates for the current week (mock data)
const today = new Date();
const mockWeeklyData: WeeklyDataPoint[] = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    day: dayNames[d.getDay()],
    date: d,
    calories: 1800 + Math.random() * 600,
    protein: 90 + Math.random() * 40,
    carbs: 200 + Math.random() * 80,
    fat: 55 + Math.random() * 30,
  };
});

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<OnboardingState>(initialOnboardingState);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Phase 8 & 9 extensions
  const [dietPreferences, setDietPreferences] = useState<DietPlanPreferences>({ mealsPerDay: 4, dietType: 'Balanced' });
  const [dietPlan, setDietPlan] = useState<DailyDietPlan[]>([]);
  const [aiConversation, setAiConversation] = useState<ConversationMessage[]>([]);

  // Phase 12 extensions
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    mealReminders: true, dailySummary: true, dietPlanReminders: true, waterReminders: false,
    aiRecommendations: true, weeklyReport: true, goalProgressUpdates: true,
    reminders: { breakfast: "08:00 AM", lunch: "01:00 PM", dinner: "08:00 PM" }
  });
  const [aiPreferences, setAiPreferences] = useState<AiPreferences>({
    personalizedRecommendations: true, aiNutritionistContext: true, foodBasedSuggestions: true,
    useMealHistory: true, useAnalytics: true
  });
  const [appearancePreferences, setAppearancePreferences] = useState<AppearancePreferences>({
    theme: 'light', compactMode: false, reducedMotion: false
  });
  const [privacyPreferences, setPrivacyPreferences] = useState<PrivacyPreferences>({
    analyticsSharing: true
  });
  
  useEffect(() => {
    if (!profile.personalInfo.fullName) {
      setProfile({
        ...initialOnboardingState,
        personalInfo: { fullName: "Guest", age: "30", gender: "Male", height: "175", weight: "70" },
        goals: { primary: "Improve General Nutrition", secondary: [] },
        nutritionTargets: { calories: 2200, protein: 120, carbs: 250, fat: 70, water: 2.5 }
      });
      
      // Procedurally generate 30 days of realistic mock meals
      const generatedMeals: Meal[] = [];
      const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        
        // Randomly skip some meals to show realistic tracking consistency
        if (Math.random() > 0.9 && i > 0) continue; 
        
        // Breakfast
        if (Math.random() > 0.1) {
          const t = new Date(d); t.setHours(8, 30);
          generatedMeals.push({
            id: `b${i}`, type: 'Breakfast', name: 'Oats & Banana', servingSize: '1 bowl', quantity: 1,
            calories: 420 + Math.floor(Math.random()*50), protein: 12, carbs: 65, fat: 8, fiber: 8, sugar: 15, sodium: 5,
            micronutrients: { potassium: '400mg', calcium: '50mg' }, timestamp: t
          });
        }
        
        // Lunch
        if (Math.random() > 0.1) {
          const t = new Date(d); t.setHours(13, 0);
          generatedMeals.push({
            id: `l${i}`, type: 'Lunch', name: 'Grilled Chicken Salad', servingSize: '1 plate', quantity: 1,
            calories: 550 + Math.floor(Math.random()*100), protein: 45, carbs: 20, fat: 25, fiber: 5, sugar: 4, sodium: 320,
            micronutrients: { vitaminC: '20mg', iron: '2mg' }, timestamp: t
          });
        }

        // Dinner
        if (Math.random() > 0.2) {
          const t = new Date(d); t.setHours(19, 30);
          generatedMeals.push({
            id: `d${i}`, type: 'Dinner', name: 'Paneer Rice Bowl', servingSize: '350g', quantity: 1,
            calories: 580 + Math.floor(Math.random()*80), protein: 24, carbs: 72, fat: 21, fiber: 6, sugar: 4, sodium: 450,
            micronutrients: { calcium: '520mg', iron: '2.1mg' }, timestamp: t
          });
        }

        // Snack
        if (Math.random() > 0.4) {
          const t = new Date(d); t.setHours(16, 0);
          generatedMeals.push({
            id: `s${i}`, type: 'Snack', name: 'Fruit Bowl', servingSize: '250g', quantity: 1,
            calories: 240, protein: 4, carbs: 58, fat: 1, fiber: 8, sugar: 45, sodium: 10,
            micronutrients: { vitaminC: '85mg', potassium: '450mg' }, timestamp: t
          });
        }
      }
      
      setMeals(generatedMeals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      
      setActivities([
        { id: 'a1', message: 'Breakfast logged', type: 'meal', timestamp: new Date(new Date().setHours(8, 30)) },
        { id: 'a2', message: 'Lunch logged', type: 'meal', timestamp: new Date(new Date().setHours(13, 0)) },
      ]);
      
      // Initialize diet plan with default preferences
      setDietPlan(generateDietPlan(profile, { mealsPerDay: 4, dietType: 'Balanced' }));
    }
  }, [profile.personalInfo.fullName]);

  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...mealData,
      id: Math.random().toString(36).substring(7),
    };
    setMeals(prev => [...prev, newMeal]);
    addActivity(`${mealData.name} added to ${mealData.type}`, 'meal');
  };

  const updateMeal = (id: string, mealData: Partial<Meal>) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...mealData } : m));
    addActivity(`Meal updated`, 'system');
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    addActivity(`Meal deleted`, 'system');
  };

  const addActivity = (message: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addAiMessage = (msg: ConversationMessage) => {
    setAiConversation(prev => [...prev, msg]);
  };

  const updateProfile = (updates: Partial<OnboardingState>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };
  
  const todaysMeals = meals.filter(m => isSameDay(new Date(m.timestamp), new Date()));

  const clearLocalData = () => {
    setMeals([]);
    setActivities([]);
    setAiConversation([]);
    setDietPlan([]);
  };

  return (
    <NutritionContext.Provider value={{ 
      profile, setProfile, updateProfile, meals, todaysMeals, addMeal, updateMeal, deleteMeal, activities, addActivity, weeklyData: mockWeeklyData,
      dietPlan, setDietPlan, dietPreferences, setDietPreferences, aiConversation, addAiMessage,
      notificationPreferences, setNotificationPreferences, aiPreferences, setAiPreferences,
      appearancePreferences, setAppearancePreferences, privacyPreferences, setPrivacyPreferences, clearLocalData
    }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
