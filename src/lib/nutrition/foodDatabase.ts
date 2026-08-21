export * from '@/data/foods';
export { foodDatabase as localFoodDatabase } from '@/data/foods';

export const searchFoods = (query: string) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  // using dynamic import or just require to avoid circular dep if any, but straight import is fine
  const { foodDatabase } = require('@/data/foods');
  return foodDatabase.filter((food: any) => food.name.toLowerCase().includes(lowerQuery));
};
