import { OnboardingState } from '@/types/onboarding';
import { Meal, AiPreferences } from '@/context/NutritionContext';
import { DailyDietPlan } from '@/lib/nutrition/dietPlan';
import { retrieveKnowledge } from './retrieval';
import { foodDatabase } from '@/data/foods';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: any[];
  sources?: string[];
}

export interface AIContext {
  profile: OnboardingState;
  todaysMeals: Meal[];
  dietPlan: DailyDietPlan[];
  aiPreferences: AiPreferences;
}

/**
 * A mock AI conversation router.
 * In production, this would call an LLM (e.g., OpenAI/Gemini) with the context and query.
 */
export const generateAIResponse = async (
  query: string, 
  context: AIContext
): Promise<Partial<ConversationMessage>> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const lowerQuery = query.toLowerCase();
      let content = "I can help you with your nutrition goals. Could you provide more details?";
      let recommendations: any[] = [];
      let sources: string[] = [];

      // 0. AI Context Check
      if (!context.aiPreferences.aiNutritionistContext) {
        resolve({
          content: "I have been instructed not to use personalized context. How can I help you generally?",
        });
        return;
      }

      // 1. Contextual awareness check
      if (lowerQuery.includes('dinner') || lowerQuery.includes('eat for')) {
        let contentStr = "";
        if (context.aiPreferences.useMealHistory) {
          const remainingCal = context.profile.nutritionTargets.calories - context.todaysMeals.reduce((s, m) => s + m.calories, 0);
          const remainingPro = context.profile.nutritionTargets.protein - context.todaysMeals.reduce((s, m) => s + m.protein, 0);
          contentStr = `Based on your remaining macros (${Math.max(0, remainingCal)} kcal and ${Math.max(0, remainingPro)}g protein left), here are some recommendations that fit your ${context.profile.diet.preference || 'current'} diet.`;
        } else {
          contentStr = `Here are some recommendations that fit your ${context.profile.diet.preference || 'current'} diet.`;
        }
        
        content = contentStr;
        
        // Find foods that fit roughly
        if (context.aiPreferences.foodBasedSuggestions) {
          recommendations = foodDatabase
            .filter(f => f.category === 'Protein' || f.category === 'Snacks')
            .sort((a, b) => b.protein - a.protein)
            .slice(0, 2);
        }
          
      } 
      // 2. Knowledge / RAG check
      else if (lowerQuery.includes('tell me about') || lowerQuery.includes('protein') || lowerQuery.includes('carbs')) {
        const ragResults = await retrieveKnowledge(query);
        
        if (ragResults.length > 0) {
          content = `According to our nutrition knowledge base:\n\n${ragResults[0].document.content}`;
          sources = [ragResults[0].document.title];
        } else {
          content = "I don't have specific knowledge documents on that, but I can still help you track it in your meals.";
        }
      }
      // 3. Status check
      else if (lowerQuery.includes('how am i doing') || lowerQuery.includes('status') || lowerQuery.includes('today')) {
        if (!context.aiPreferences.useMealHistory) {
           content = "I'm not able to see your meal history right now based on your settings. You'll need to enable it in Settings > AI & Personalization.";
        } else {
          const cals = context.todaysMeals.reduce((s, m) => s + m.calories, 0);
          const target = context.profile.nutritionTargets.calories;
          const percent = Math.round((cals / target) * 100) || 0;
          
          content = `You've consumed ${cals} kcal today, which is ${percent}% of your ${target} kcal goal. Keep it up!`;
        }
      }

      resolve({
        content,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
        sources: sources.length > 0 ? sources : undefined
      });
    }, 1500); // 1.5s simulated thinking time
  });
};
