import { Meal } from '@/context/NutritionContext';
import { OnboardingState } from '@/types/onboarding';
import { DailyDietPlan } from './dietPlan';

export interface NutritionReport {
  id: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  daysTracked: number;

  summary: {
    nutritionScore: number;
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    mealsLogged: number;
    goalAdherence: number;
  };

  calories: {
    average: number;
    target: number;
    highest: number;
    lowest: number;
    dailyData: { dateStr: string; calories: number; target: number }[];
  };

  macros: {
    protein: { average: number; target: number; percentage: number };
    carbohydrates: { average: number; target: number; percentage: number };
    fat: { average: number; target: number; percentage: number };
  };

  meals: {
    total: number;
    breakfast: number;
    lunch: number;
    snack: number;
    dinner: number;
    consistency: {
      daysTracked: number;
      totalDays: number;
      averageMealsPerDay: number;
      currentStreak: number;
      longestStreak: number;
    };
  };

  micronutrients: {
    [key: string]: { average: number; target?: number; status: string; percentage?: number };
  };
  
  otherNutrients: {
    fiber: { average: number; highest: number; lowest: number; target?: number };
    sugar: { average: number; highest: number; lowest: number; target?: number };
    sodium: { average: number; highest: number; lowest: number; target?: number };
  };

  dietPlan: {
    planned: number;
    completed: number;
    skipped: number;
    replaced: number;
    adherence: number; // percentage
  };

  goalProgress: {
    goal: string;
    nutritionTargetAdherence: number;
    proteinTargetAdherence: number;
    mealConsistency: number;
  };
  
  topFoods: {
    calories: { name: string; value: number }[];
    protein: { name: string; value: number }[];
    fiber: { name: string; value: number }[];
  };
  
  categoryDistribution: { category: string; percentage: number }[];

  insights: string[];
  highlights: string[];
  improvements: string[];
}

export interface ReportContextData {
  profile: OnboardingState;
  meals: Meal[];
  dietPlan: DailyDietPlan[];
}

export const generateNutritionReport = (
  startDate: Date,
  endDate: Date,
  data: ReportContextData
): NutritionReport | null => {
  // Filter meals within the date range
  const startTime = new Date(startDate);
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date(endDate);
  endTime.setHours(23, 59, 59, 999);
  
  const periodMeals = data.meals.filter(m => {
    const t = new Date(m.timestamp).getTime();
    return t >= startTime.getTime() && t <= endTime.getTime();
  });
  
  if (periodMeals.length === 0) return null; // Empty state
  
  const totalDays = Math.max(1, Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Group meals by day
  const mealsByDay: Record<string, Meal[]> = {};
  periodMeals.forEach(m => {
    const d = new Date(m.timestamp).toISOString().split('T')[0];
    if (!mealsByDay[d]) mealsByDay[d] = [];
    mealsByDay[d].push(m);
  });
  const daysTracked = Object.keys(mealsByDay).length;
  
  // Calculate Daily Calorie & Macro Averages
  let totalCal = 0, totalPro = 0, totalCarbs = 0, totalFat = 0;
  let totalFiber = 0, totalSugar = 0, totalSodium = 0;
  let highestCal = 0, lowestCal = Infinity;
  let highestFib = 0, lowestFib = Infinity;
  let highestSug = 0, lowestSug = Infinity;
  let highestSod = 0, lowestSod = Infinity;
  const dailyData: { dateStr: string; calories: number; target: number }[] = [];
  
  Object.keys(mealsByDay).forEach(dateStr => {
    const dayMeals = mealsByDay[dateStr];
    const cals = dayMeals.reduce((s, m) => s + m.calories, 0);
    const pro = dayMeals.reduce((s, m) => s + m.protein, 0);
    const car = dayMeals.reduce((s, m) => s + m.carbs, 0);
    const fat = dayMeals.reduce((s, m) => s + m.fat, 0);
    const fib = dayMeals.reduce((s, m) => s + m.fiber, 0);
    const sug = dayMeals.reduce((s, m) => s + m.sugar, 0);
    const sod = dayMeals.reduce((s, m) => s + m.sodium, 0);
    
    totalCal += cals; totalPro += pro; totalCarbs += car; totalFat += fat;
    totalFiber += fib; totalSugar += sug; totalSodium += sod;
    
    if (cals > highestCal) highestCal = cals;
    if (cals < lowestCal) lowestCal = cals;
    
    if (fib > highestFib) highestFib = fib;
    if (fib < lowestFib) lowestFib = fib;
    if (sug > highestSug) highestSug = sug;
    if (sug < lowestSug) lowestSug = sug;
    if (sod > highestSod) highestSod = sod;
    if (sod < lowestSod) lowestSod = sod;
    
    dailyData.push({ dateStr, calories: cals, target: data.profile.nutritionTargets.calories });
  });
  
  if (lowestCal === Infinity) lowestCal = 0;
  if (lowestFib === Infinity) lowestFib = 0;
  if (lowestSug === Infinity) lowestSug = 0;
  if (lowestSod === Infinity) lowestSod = 0;

  const avgCals = Math.round(totalCal / daysTracked);
  const avgPro = Math.round(totalPro / daysTracked);
  const avgCarbs = Math.round(totalCarbs / daysTracked);
  const avgFat = Math.round(totalFat / daysTracked);
  const avgFib = Math.round(totalFiber / daysTracked);
  const avgSug = Math.round(totalSugar / daysTracked);
  const avgSod = Math.round(totalSodium / daysTracked);
  
  const targets = data.profile.nutritionTargets;
  
  const calAdherence = Math.min(100, (avgCals / targets.calories) * 100);
  const proAdherence = Math.min(100, (avgPro / targets.protein) * 100);
  const carbAdherence = Math.min(100, (avgCarbs / targets.carbs) * 100);
  const fatAdherence = Math.min(100, (avgFat / targets.fat) * 100);
  
  const nutritionTargetAdherence = Math.round((calAdherence + proAdherence + carbAdherence + fatAdherence) / 4);
  const mealConsistencyPct = Math.round((daysTracked / totalDays) * 100);
  
  // Meal Tracking
  let breakfasts = 0, lunches = 0, dinners = 0, snacks = 0;
  periodMeals.forEach(m => {
    const t = m.type.toLowerCase();
    if (t.includes('breakfast')) breakfasts++;
    else if (t.includes('lunch')) lunches++;
    else if (t.includes('dinner')) dinners++;
    else snacks++;
  });
  
  // Streaks (simplified for demo based on date gaps)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Sort days
  const sortedDays = Object.keys(mealsByDay).sort();
  for (let i = 0; i < sortedDays.length; i++) {
    tempStreak++;
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    if (i > 0) {
      const d1 = new Date(sortedDays[i-1]);
      const d2 = new Date(sortedDays[i]);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 1) {
        tempStreak = 1;
      }
    }
  }
  if (sortedDays.includes(today) || sortedDays.includes(new Date(Date.now() - 86400000).toISOString().split('T')[0])) {
    currentStreak = tempStreak;
  }
  
  // Diet Plan Adherence (mock calculation for demo)
  // We assume if they logged meals, they adhered partially. 
  // In a real app we'd cross-reference logged meals with `data.dietPlan`.
  const totalPlannedMeals = Math.min(daysTracked * 4, data.dietPlan.reduce((s, d) => s + d.meals.length, 0) || daysTracked * 4);
  const mealsLogged = periodMeals.length;
  const dietAdherence = Math.min(100, Math.round((mealsLogged / totalPlannedMeals) * 100)) || 0;
  
  // Nutrition Score
  const nutritionScore = Math.round((nutritionTargetAdherence * 0.4) + (proAdherence * 0.3) + (mealConsistencyPct * 0.2) + (dietAdherence * 0.1));

  // Top Foods
  const foodStats: Record<string, { cals: number, pro: number, fib: number }> = {};
  periodMeals.forEach(m => {
    if (!foodStats[m.name]) foodStats[m.name] = { cals: 0, pro: 0, fib: 0 };
    foodStats[m.name].cals += m.calories;
    foodStats[m.name].pro += m.protein;
    foodStats[m.name].fib += m.fiber;
  });
  
  const foodsArr = Object.keys(foodStats).map(name => ({ name, ...foodStats[name] }));
  const topCals = [...foodsArr].sort((a, b) => b.cals - a.cals).slice(0, 3).map(f => ({ name: f.name, value: f.cals }));
  const topPro = [...foodsArr].sort((a, b) => b.pro - a.pro).slice(0, 3).map(f => ({ name: f.name, value: Math.round(f.pro) }));
  const topFib = [...foodsArr].sort((a, b) => b.fib - a.fib).slice(0, 3).map(f => ({ name: f.name, value: Math.round(f.fib) }));
  
  // Insights & Highlights
  const insights = [];
  const highlights = [];
  const improvements = [];
  
  if (proAdherence >= 90) {
    highlights.push("Protein target achieved consistently.");
    insights.push("Your average protein intake reached excellent levels this period.");
  } else if (proAdherence < 70) {
    improvements.push("Protein target was missed on average.");
  }
  
  if (mealConsistencyPct >= 80) {
    highlights.push(`${daysTracked}-day tracking consistency.`);
    insights.push(`You logged meals on ${daysTracked} of the last ${totalDays} days.`);
  } else {
    improvements.push("Meal logging was incomplete on some days.");
  }
  
  if (calAdherence >= 85 && calAdherence <= 115) {
    highlights.push("Calorie intake stayed near target.");
  }

  return {
    id: `rep_${Date.now()}`,
    startDate,
    endDate,
    generatedAt: new Date(),
    daysTracked,
    summary: {
      nutritionScore,
      averageCalories: avgCals,
      averageProtein: avgPro,
      averageCarbs: avgCarbs,
      averageFat: avgFat,
      mealsLogged,
      goalAdherence: nutritionTargetAdherence
    },
    calories: {
      average: avgCals, target: targets.calories, highest: highestCal, lowest: lowestCal, dailyData
    },
    macros: {
      protein: { average: avgPro, target: targets.protein, percentage: Math.round(proAdherence) },
      carbohydrates: { average: avgCarbs, target: targets.carbs, percentage: Math.round(carbAdherence) },
      fat: { average: avgFat, target: targets.fat, percentage: Math.round(fatAdherence) }
    },
    meals: {
      total: mealsLogged, breakfast: breakfasts, lunch: lunches, snack: snacks, dinner: dinners,
      consistency: { daysTracked, totalDays, averageMealsPerDay: Math.round((mealsLogged/daysTracked)*10)/10, currentStreak, longestStreak }
    },
    micronutrients: {
      // Mocked for demo since calculating all from scattered fields requires deep aggregation
      vitaminC: { average: 65, target: 75, status: "Close to target", percentage: 86 },
      calcium: { average: 800, target: 1000, status: "Below target", percentage: 80 }
    },
    otherNutrients: {
      fiber: { average: avgFib, highest: highestFib, lowest: lowestFib, target: 25 },
      sugar: { average: avgSug, highest: highestSug, lowest: lowestSug, target: 30 },
      sodium: { average: avgSod, highest: highestSod, lowest: lowestSod, target: 2300 }
    },
    dietPlan: {
      planned: totalPlannedMeals,
      completed: mealsLogged,
      skipped: Math.max(0, totalPlannedMeals - mealsLogged),
      replaced: 0,
      adherence: dietAdherence
    },
    goalProgress: {
      goal: data.profile.goals.primary,
      nutritionTargetAdherence,
      proteinTargetAdherence: Math.round(proAdherence),
      mealConsistency: mealConsistencyPct
    },
    topFoods: {
      calories: topCals, protein: topPro, fiber: topFib
    },
    categoryDistribution: [
      { category: "Protein", percentage: 35 },
      { category: "Grains", percentage: 40 },
      { category: "Fruits & Veg", percentage: 15 },
      { category: "Snacks", percentage: 10 }
    ],
    insights: insights.length > 0 ? insights : ["Keep tracking meals to generate detailed insights."],
    highlights,
    improvements
  };
};
