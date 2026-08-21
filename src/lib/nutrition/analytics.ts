import { Meal } from '@/context/NutritionContext';
import { OnboardingState } from '@/types/onboarding';

export type DateRange = 'Today' | '7 Days' | '30 Days';

const isSameDay = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

export const filterMealsByDateRange = (meals: Meal[], range: DateRange): Meal[] => {
  const today = new Date();
  
  if (range === 'Today') {
    return meals.filter(m => isSameDay(new Date(m.timestamp), today));
  }
  
  const cutoff = new Date(today);
  if (range === '7 Days') {
    cutoff.setDate(cutoff.getDate() - 6); // Includes today + 6 previous days = 7
  } else if (range === '30 Days') {
    cutoff.setDate(cutoff.getDate() - 29);
  }
  cutoff.setHours(0,0,0,0);
  
  return meals.filter(m => new Date(m.timestamp) >= cutoff);
};

export const getPreviousRangeMeals = (meals: Meal[], range: DateRange): Meal[] => {
  const today = new Date();
  const currentCutoff = new Date(today);
  const prevCutoff = new Date(today);
  
  if (range === 'Today') {
    currentCutoff.setDate(currentCutoff.getDate() - 1);
    return meals.filter(m => isSameDay(new Date(m.timestamp), currentCutoff));
  } else if (range === '7 Days') {
    currentCutoff.setDate(currentCutoff.getDate() - 6);
    prevCutoff.setDate(currentCutoff.getDate() - 7);
  } else if (range === '30 Days') {
    currentCutoff.setDate(currentCutoff.getDate() - 29);
    prevCutoff.setDate(currentCutoff.getDate() - 30);
  }
  
  currentCutoff.setHours(0,0,0,0);
  prevCutoff.setHours(0,0,0,0);
  
  return meals.filter(m => {
    const d = new Date(m.timestamp);
    return d >= prevCutoff && d < currentCutoff;
  });
};

export const calculateAverages = (meals: Meal[], range: DateRange) => {
  if (meals.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  let days = 1;
  if (range === '7 Days') days = 7;
  if (range === '30 Days') days = 30;

  const sums = meals.reduce((acc, m) => {
    acc.calories += m.calories;
    acc.protein += m.protein;
    acc.carbs += m.carbs;
    acc.fat += m.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return {
    calories: Math.round(sums.calories / days),
    protein: Math.round(sums.protein / days),
    carbs: Math.round(sums.carbs / days),
    fat: Math.round(sums.fat / days)
  };
};

export const calculateTrend = (currentAvg: number, prevAvg: number) => {
  if (prevAvg === 0) return 0;
  return Math.round(((currentAvg - prevAvg) / prevAvg) * 100);
};

export const calculateMacroDistribution = (meals: Meal[]) => {
  if (meals.length === 0) return { protein: 0, carbs: 0, fat: 0, total: 0 };
  const sums = meals.reduce((acc, m) => {
    acc.protein += m.protein;
    acc.carbs += m.carbs;
    acc.fat += m.fat;
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 });

  const total = sums.protein + sums.carbs + sums.fat;
  if (total === 0) return { protein: 0, carbs: 0, fat: 0, total: 0 };

  return {
    protein: Math.round((sums.protein / total) * 100),
    carbs: Math.round((sums.carbs / total) * 100),
    fat: Math.round((sums.fat / total) * 100),
    total
  };
};

export const calculateMealDistribution = (meals: Meal[]) => {
  const totals = { Breakfast: 0, Lunch: 0, Snack: 0, Dinner: 0 };
  let totalCalories = 0;
  
  meals.forEach(m => {
    if (totals[m.type as keyof typeof totals] !== undefined) {
      totals[m.type as keyof typeof totals] += m.calories;
      totalCalories += m.calories;
    }
  });

  if (totalCalories === 0) return { Breakfast: 0, Lunch: 0, Snack: 0, Dinner: 0 };

  return {
    Breakfast: Math.round((totals.Breakfast / totalCalories) * 100),
    Lunch: Math.round((totals.Lunch / totalCalories) * 100),
    Snack: Math.round((totals.Snack / totalCalories) * 100),
    Dinner: Math.round((totals.Dinner / totalCalories) * 100),
  };
};

export const getTopContributors = (meals: Meal[], metric: 'calories' | 'protein') => {
  const foodMap: Record<string, number> = {};
  
  meals.forEach(m => {
    if (!foodMap[m.name]) foodMap[m.name] = 0;
    foodMap[m.name] += m[metric];
  });

  return Object.entries(foodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, value]) => ({ name, value: Math.round(value) }));
};

export const calculateConsistencyScore = (meals: Meal[], profile: OnboardingState, range: DateRange) => {
  // Simple heuristic score
  let daysToCheck = 1;
  if (range === '7 Days') daysToCheck = 7;
  if (range === '30 Days') daysToCheck = 30;

  if (meals.length === 0) return 0;

  const daysLogged = new Set(meals.map(m => new Date(m.timestamp).toDateString())).size;
  const loggingConsistency = (daysLogged / daysToCheck) * 100;

  const avg = calculateAverages(meals, range);
  
  // Closeness to calorie target (closer is better, max 100)
  const calRatio = avg.calories / profile.nutritionTargets.calories;
  let calScore = 100;
  if (calRatio > 1.2 || calRatio < 0.8) {
    calScore -= Math.abs(1 - calRatio) * 100;
  }
  calScore = Math.max(0, Math.min(100, calScore));

  // Closeness to protein target (undershooting penalizes more)
  const proRatio = avg.protein / profile.nutritionTargets.protein;
  let proScore = proRatio >= 1 ? 100 : proRatio * 100;

  return Math.round((loggingConsistency * 0.4) + (calScore * 0.3) + (proScore * 0.3));
};

export const generateDailyTrendData = (meals: Meal[], range: DateRange) => {
  const today = new Date();
  let days = 7;
  if (range === 'Today') days = 1; // Trend chart doesn't make much sense for Today, but we'll show 1 bar
  if (range === '30 Days') days = 30;

  const data = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    
    const dayMeals = meals.filter(m => {
      const md = new Date(m.timestamp);
      md.setHours(0,0,0,0);
      return md.getTime() === d.getTime();
    });

    data.push({
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: dayNames[d.getDay()],
      isToday: i === 0,
      calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
      protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
      carbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
      fat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
    });
  }

  return data;
};
