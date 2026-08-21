import { FoodItem } from '@/data/foods';

export interface CalculatedNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

/**
 * Calculates the nutritional values for a given food item based on the entered quantity.
 * 
 * @param food The base food item from the database
 * @param quantity The quantity entered by the user
 * @returns Recalculated nutritional values rounded to 1 decimal place (or integer for calories/sodium)
 */
export const calculateNutrition = (food: FoodItem, quantity: number): CalculatedNutrition => {
  // If the base quantity is 100g, and user enters 200g, the multiplier is 2.
  // If the base quantity is 1 serving, and user enters 2 servings, the multiplier is 2.
  const multiplier = quantity / food.baseQuantity;

  return {
    calories: Math.round(food.calories * multiplier),
    protein: Math.round((food.protein * multiplier) * 10) / 10,
    carbs: Math.round((food.carbs * multiplier) * 10) / 10,
    fat: Math.round((food.fat * multiplier) * 10) / 10,
    fiber: Math.round((food.fiber * multiplier) * 10) / 10,
    sugar: Math.round((food.sugar * multiplier) * 10) / 10,
    sodium: Math.round(food.sodium * multiplier),
  };
};

/**
 * Helper to aggregate total nutrition from an array of meals.
 */
export const calculateTotalNutrition = (meals: any[]): CalculatedNutrition => {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
    fiber: acc.fiber + (meal.fiber || 0),
    sugar: acc.sugar + (meal.sugar || 0),
    sodium: acc.sodium + (meal.sodium || 0),
  }), {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0
  });
};
