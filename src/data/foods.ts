export type FoodCategory = 'Grains' | 'Fruits' | 'Vegetables' | 'Dairy' | 'Protein' | 'Nuts & Seeds' | 'Beverages' | 'Snacks';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  servingUnit: string;
  baseQuantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  micronutrients?: {
    vitaminA?: string;
    vitaminC?: string;
    vitaminD?: string;
    calcium?: string;
    iron?: string;
    potassium?: string;
  };
}

export const foodDatabase: FoodItem[] = [
  // Grains
  { id: 'g1', name: 'White Rice', category: 'Grains', servingUnit: 'g', baseQuantity: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
  { id: 'g2', name: 'Brown Rice', category: 'Grains', servingUnit: 'g', baseQuantity: 100, calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, sugar: 0.2, sodium: 5 },
  { id: 'g3', name: 'Oats', category: 'Grains', servingUnit: 'g', baseQuantity: 100, calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, sugar: 0, sodium: 2 },
  { id: 'g4', name: 'Whole Wheat Roti', category: 'Grains', servingUnit: 'piece', baseQuantity: 1, calories: 120, protein: 4, carbs: 22, fat: 2.5, fiber: 3, sugar: 0, sodium: 110 },
  { id: 'g5', name: 'Quinoa', category: 'Grains', servingUnit: 'g', baseQuantity: 100, calories: 120, protein: 4.1, carbs: 21.3, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },
  
  // Protein
  { id: 'p1', name: 'Chicken Breast', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  { id: 'p2', name: 'Paneer', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 265, protein: 18, carbs: 6, fat: 20, fiber: 0, sugar: 0, sodium: 18 },
  { id: 'p3', name: 'Tofu', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 144, protein: 15.8, carbs: 2.8, fat: 8.7, fiber: 2.3, sugar: 0.3, sodium: 14 },
  { id: 'p4', name: 'Whole Egg', category: 'Protein', servingUnit: 'large', baseQuantity: 1, calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, sugar: 0.2, sodium: 71 },
  { id: 'p5', name: 'Yellow Dal (Cooked)', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 1, sodium: 2 },
  { id: 'p6', name: 'Chickpeas (Cooked)', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7 },
  { id: 'p7', name: 'Rajma (Kidney Beans)', category: 'Protein', servingUnit: 'g', baseQuantity: 100, calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4, sugar: 0.3, sodium: 2 },
  
  // Fruits
  { id: 'f1', name: 'Apple', category: 'Fruits', servingUnit: 'medium', baseQuantity: 1, calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 1, micronutrients: { vitaminC: '8.4mg' } },
  { id: 'f2', name: 'Banana', category: 'Fruits', servingUnit: 'medium', baseQuantity: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, micronutrients: { potassium: '422mg' } },
  { id: 'f3', name: 'Orange', category: 'Fruits', servingUnit: 'medium', baseQuantity: 1, calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0, micronutrients: { vitaminC: '70mg' } },
  { id: 'f4', name: 'Mango', category: 'Fruits', servingUnit: 'g', baseQuantity: 100, calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1, micronutrients: { vitaminA: '1082 IU', vitaminC: '36.4mg' } },
  { id: 'f5', name: 'Papaya', category: 'Fruits', servingUnit: 'g', baseQuantity: 100, calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 8, sodium: 8, micronutrients: { vitaminC: '60.9mg' } },
  { id: 'f6', name: 'Guava', category: 'Fruits', servingUnit: 'g', baseQuantity: 100, calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, sugar: 9, sodium: 2, micronutrients: { vitaminC: '228.3mg' } },
  
  // Vegetables
  { id: 'v1', name: 'Spinach (Raw)', category: 'Vegetables', servingUnit: 'g', baseQuantity: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, micronutrients: { vitaminA: '9377 IU', iron: '2.7mg' } },
  { id: 'v2', name: 'Broccoli', category: 'Vegetables', servingUnit: 'g', baseQuantity: 100, calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, micronutrients: { vitaminC: '89.2mg' } },
  { id: 'v3', name: 'Carrot', category: 'Vegetables', servingUnit: 'g', baseQuantity: 100, calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, micronutrients: { vitaminA: '16706 IU' } },
  { id: 'v4', name: 'Tomato', category: 'Vegetables', servingUnit: 'g', baseQuantity: 100, calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
  { id: 'v5', name: 'Potato (Boiled)', category: 'Vegetables', servingUnit: 'g', baseQuantity: 100, calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, sugar: 0.9, sodium: 5, micronutrients: { potassium: '379mg' } },
  
  // Dairy
  { id: 'd1', name: 'Whole Milk', category: 'Dairy', servingUnit: 'ml', baseQuantity: 100, calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5, sodium: 43, micronutrients: { calcium: '113mg' } },
  { id: 'd2', name: 'Skim Milk', category: 'Dairy', servingUnit: 'ml', baseQuantity: 100, calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, sugar: 5, sodium: 42, micronutrients: { calcium: '122mg' } },
  { id: 'd3', name: 'Curd (Whole Milk)', category: 'Dairy', servingUnit: 'g', baseQuantity: 100, calories: 98, protein: 3.5, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 3.4, sodium: 36, micronutrients: { calcium: '111mg' } },
  { id: 'd4', name: 'Greek Yogurt', category: 'Dairy', servingUnit: 'g', baseQuantity: 100, calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36, micronutrients: { calcium: '110mg' } },
  
  // Nuts & Seeds
  { id: 'n1', name: 'Almonds', category: 'Nuts & Seeds', servingUnit: 'g', baseQuantity: 100, calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, sugar: 4.4, sodium: 1, micronutrients: { calcium: '269mg', iron: '3.7mg' } },
  { id: 'n2', name: 'Walnuts', category: 'Nuts & Seeds', servingUnit: 'g', baseQuantity: 100, calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, sugar: 2.6, sodium: 2 },
  { id: 'n3', name: 'Peanuts', category: 'Nuts & Seeds', servingUnit: 'g', baseQuantity: 100, calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, sugar: 4, sodium: 18 },
  { id: 'n4', name: 'Chia Seeds', category: 'Nuts & Seeds', servingUnit: 'g', baseQuantity: 100, calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, sugar: 0, sodium: 16 },
  
  // Beverages
  { id: 'b1', name: 'Coconut Water', category: 'Beverages', servingUnit: 'ml', baseQuantity: 100, calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sugar: 2.6, sodium: 105, micronutrients: { potassium: '250mg' } },
  { id: 'b2', name: 'Black Tea (No Sugar)', category: 'Beverages', servingUnit: 'cup', baseQuantity: 1, calories: 2, protein: 0, carbs: 0.7, fat: 0, fiber: 0, sugar: 0, sodium: 7 },
  { id: 'b3', name: 'Green Tea', category: 'Beverages', servingUnit: 'cup', baseQuantity: 1, calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  
  // Snacks/Meals (Complex)
  { id: 's1', name: 'Paneer Rice Bowl', category: 'Snacks', servingUnit: 'bowl', baseQuantity: 1, calories: 580, protein: 24, carbs: 72, fat: 21, fiber: 6, sugar: 4, sodium: 450, micronutrients: { calcium: '520mg', iron: '2.1mg' } },
  { id: 's2', name: 'Grilled Chicken Salad', category: 'Snacks', servingUnit: 'plate', baseQuantity: 1, calories: 420, protein: 38, carbs: 12, fat: 22, fiber: 5, sugar: 3, sodium: 380 },
  { id: 's3', name: 'Fruit Bowl', category: 'Snacks', servingUnit: 'bowl', baseQuantity: 1, calories: 240, protein: 4, carbs: 58, fat: 1, fiber: 8, sugar: 45, sodium: 10 },
  { id: 's4', name: 'Dal Rice', category: 'Snacks', servingUnit: 'plate', baseQuantity: 1, calories: 520, protein: 18, carbs: 90, fat: 8, fiber: 12, sugar: 2, sodium: 320 },
  { id: 's5', name: 'Vegetable Roti Plate', category: 'Snacks', servingUnit: 'plate', baseQuantity: 1, calories: 460, protein: 16, carbs: 75, fat: 12, fiber: 14, sugar: 8, sodium: 500 }
];
