import { FoodItem } from './foodDatabase';

export interface DetectionResult {
  food: FoodItem;
  confidence: number;
  detectedIngredients: string[];
}

// 5 premium demo meals
export const demoDetectionResults: DetectionResult[] = [
  {
    food: {
      id: "demo1", name: "Paneer Rice Bowl", category: "Snacks", servingUnit: "g", baseQuantity: 350,
      calories: 580, protein: 24, carbs: 72, fat: 21, fiber: 6, sugar: 4, sodium: 450,
      micronutrients: { calcium: "520mg", iron: "2.1mg" }
    },
    confidence: 91,
    detectedIngredients: ["Paneer", "Rice", "Mixed Vegetables", "Spices"]
  },
  {
    food: {
      id: "demo2", name: "Grilled Chicken Salad", category: "Snacks", servingUnit: "g", baseQuantity: 300,
      calories: 420, protein: 38, carbs: 12, fat: 22, fiber: 5, sugar: 3, sodium: 380,
      micronutrients: { vitaminC: "24mg", iron: "1.8mg", potassium: "400mg" }
    },
    confidence: 95,
    detectedIngredients: ["Chicken Breast", "Lettuce", "Cherry Tomatoes", "Olive Oil"]
  },
  {
    food: {
      id: "demo3", name: "Fruit Bowl", category: "Snacks", servingUnit: "g", baseQuantity: 250,
      calories: 240, protein: 4, carbs: 58, fat: 1, fiber: 8, sugar: 45, sodium: 10,
      micronutrients: { vitaminC: "85mg", potassium: "450mg" }
    },
    confidence: 88,
    detectedIngredients: ["Apple", "Banana", "Grapes", "Berries"]
  },
  {
    food: {
      id: "demo4", name: "Dal Rice", category: "Snacks", servingUnit: "g", baseQuantity: 400,
      calories: 520, protein: 18, carbs: 90, fat: 8, fiber: 12, sugar: 2, sodium: 320,
      micronutrients: { iron: "4.5mg", potassium: "500mg" }
    },
    confidence: 94,
    detectedIngredients: ["Yellow Lentils", "White Rice", "Coriander"]
  },
  {
    food: {
      id: "demo5", name: "Vegetable Roti Plate", category: "Snacks", servingUnit: "plate", baseQuantity: 1,
      calories: 460, protein: 16, carbs: 75, fat: 12, fiber: 14, sugar: 8, sodium: 500,
      micronutrients: { vitaminA: "400 IU", iron: "3.5mg", calcium: "150mg" }
    },
    confidence: 89,
    detectedIngredients: ["Whole Wheat Roti", "Mixed Vegetable Curry", "Yogurt"]
  }
];

/**
 * Simulates a computer vision API call.
 * Takes a mock image file and returns a random detection result after a delay.
 */
export const simulateImageDetection = async (imageFile: File | string): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Pick a random result to make the demo feel dynamic
      const randomIndex = Math.floor(Math.random() * demoDetectionResults.length);
      resolve(demoDetectionResults[randomIndex]);
    }, 2000); // 2 second simulated delay for scanning animation
  });
};
