import { FoodItem, foodDatabase } from '@/data/foods';
import { OnboardingState } from '@/types/onboarding';

export interface PlannedMeal {
  id: string;
  type: string;
  food: FoodItem;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyDietPlan {
  dateStr: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DietPlanPreferences {
  mealsPerDay: number;
  dietType: string;
}

export const generateDietPlan = (profile: OnboardingState, preferences: DietPlanPreferences): DailyDietPlan[] => {
  const { nutritionTargets } = profile;
  
  // Filter foods by diet preference if possible
  // For this mock, we'll just prioritize categories based on preferences.
  let availableFoods = [...foodDatabase];
  if (preferences.dietType === 'Vegetarian') {
    availableFoods = availableFoods.filter(f => !f.name.toLowerCase().includes('chicken'));
  }
  
  const breakfasts = availableFoods.filter(f => f.category === 'Grains' || f.name.includes('Oats') || f.name.includes('Fruit'));
  const mains = availableFoods.filter(f => f.category === 'Protein' || f.category === 'Snacks' || f.name.includes('Bowl') || f.name.includes('Rice'));
  const snacks = availableFoods.filter(f => f.category === 'Fruits' || f.category === 'Nuts & Seeds' || f.category === 'Dairy');

  const generateDay = (dayIndex: number): DailyDietPlan => {
    const meals: PlannedMeal[] = [];
    let currentCals = 0;
    
    // 1. Breakfast
    const bFood = breakfasts[Math.floor(Math.random() * breakfasts.length)] || availableFoods[0];
    const bMultiplier = 1.5;
    meals.push({
      id: `dp-d${dayIndex}-b`,
      type: 'Breakfast',
      food: bFood,
      quantity: bMultiplier,
      calories: Math.round(bFood.calories * bMultiplier),
      protein: Math.round(bFood.protein * bMultiplier),
      carbs: Math.round(bFood.carbs * bMultiplier),
      fat: Math.round(bFood.fat * bMultiplier),
    });

    // 2. Lunch
    const lFood = mains[Math.floor(Math.random() * mains.length)] || availableFoods[0];
    const lMultiplier = 1.2;
    meals.push({
      id: `dp-d${dayIndex}-l`,
      type: 'Lunch',
      food: lFood,
      quantity: lMultiplier,
      calories: Math.round(lFood.calories * lMultiplier),
      protein: Math.round(lFood.protein * lMultiplier),
      carbs: Math.round(lFood.carbs * lMultiplier),
      fat: Math.round(lFood.fat * lMultiplier),
    });

    // 3. Dinner
    const dFood = mains[Math.floor(Math.random() * mains.length)] || availableFoods[0];
    const dMultiplier = 1.0;
    meals.push({
      id: `dp-d${dayIndex}-d`,
      type: 'Dinner',
      food: dFood,
      quantity: dMultiplier,
      calories: Math.round(dFood.calories * dMultiplier),
      protein: Math.round(dFood.protein * dMultiplier),
      carbs: Math.round(dFood.carbs * dMultiplier),
      fat: Math.round(dFood.fat * dMultiplier),
    });

    // 4. Snacks (if 4 or 5 meals)
    if (preferences.mealsPerDay >= 4) {
      const sFood = snacks[Math.floor(Math.random() * snacks.length)] || availableFoods[0];
      meals.push({
        id: `dp-d${dayIndex}-s1`,
        type: 'Snack',
        food: sFood,
        quantity: 1,
        calories: sFood.calories,
        protein: sFood.protein,
        carbs: sFood.carbs,
        fat: sFood.fat,
      });
    }
    if (preferences.mealsPerDay >= 5) {
      const sFood = snacks[Math.floor(Math.random() * snacks.length)] || availableFoods[0];
      meals.push({
        id: `dp-d${dayIndex}-s2`,
        type: 'Evening Snack',
        food: sFood,
        quantity: 1,
        calories: sFood.calories,
        protein: sFood.protein,
        carbs: sFood.carbs,
        fat: sFood.fat,
      });
    }

    // Sort chronologically
    const typeOrder: Record<string, number> = { 'Breakfast': 1, 'Snack': 2, 'Lunch': 3, 'Evening Snack': 4, 'Dinner': 5 };
    meals.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

    const d = new Date();
    d.setDate(d.getDate() + dayIndex);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return {
      dateStr,
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    };
  };

  const plan: DailyDietPlan[] = [];
  for (let i = 0; i < 7; i++) {
    plan.push(generateDay(i));
  }

  return plan;
};
