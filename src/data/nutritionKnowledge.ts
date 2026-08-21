export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export const nutritionKnowledge: KnowledgeDocument[] = [
  {
    id: 'k1',
    title: 'Paneer Nutrition Guide',
    content: 'Paneer is a fresh cheese common in the Indian subcontinent. It is an unaged, non-melting soft cheese made by curdling milk with a fruit- or vegetable-derived acid, such as lemon juice. It is an excellent source of vegetarian protein, containing about 18g of protein per 100g. It is also very high in calcium and fat, making it calorie-dense. It is ideal for muscle gain diets but should be portion-controlled for weight loss.',
    tags: ['paneer', 'protein', 'vegetarian', 'dairy', 'calcium']
  },
  {
    id: 'k2',
    title: 'Oats for Breakfast',
    content: 'Oats are among the healthiest grains on earth. They are a gluten-free whole grain and a great source of important vitamins, minerals, fiber, and antioxidants. Studies show that oats and oatmeal have many health benefits. These include weight loss, lower blood sugar levels, and a reduced risk of heart disease. The high soluble fiber content (beta-glucan) helps keep you full for hours.',
    tags: ['oats', 'breakfast', 'carbs', 'fiber', 'grains']
  },
  {
    id: 'k3',
    title: 'Chicken Breast for Muscle Gain',
    content: 'Chicken breast is one of the most popular foods among fitness enthusiasts and bodybuilders. It is exceptionally high in protein (approx 31g per 100g) while being very low in fat and carbohydrates. This makes it a perfect lean protein source for building muscle without adding excess calories from fat.',
    tags: ['chicken', 'protein', 'muscle', 'lean']
  },
  {
    id: 'k4',
    title: 'Dal and Rice Synergy',
    content: 'Dal (lentils) and Rice is a staple combination in Indian cuisine. While lentils are high in protein, they lack certain essential amino acids (like methionine) which are found in rice. Conversely, rice lacks lysine, which is abundant in lentils. Eating them together provides a complete protein profile comparable to meat.',
    tags: ['dal', 'rice', 'protein', 'vegetarian', 'amino acids']
  },
  {
    id: 'k5',
    title: 'Almonds and Healthy Fats',
    content: 'Almonds are highly nutritious tree nuts. They are rich in healthy monounsaturated fats, fiber, protein, and various important nutrients like Vitamin E and Magnesium. Due to their high fat content, they are calorie-dense and should be eaten in moderation (about 1 ounce or 28g per day) as a healthy snack.',
    tags: ['almonds', 'nuts', 'fat', 'snack']
  },
  {
    id: 'k6',
    title: 'Fruits and Natural Sugars',
    content: 'Fruits like apples, bananas, and mangoes contain fructose, a natural sugar. Unlike added sugars found in processed foods, the sugar in whole fruits comes packaged with water, fiber, and micronutrients. The fiber slows down digestion and prevents massive blood sugar spikes. Bananas are particularly good for pre-workout energy due to their easily digestible carbs and potassium.',
    tags: ['fruits', 'sugar', 'carbs', 'banana', 'apple']
  }
];
