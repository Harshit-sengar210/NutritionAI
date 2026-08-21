"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { generateAIResponse, ConversationMessage } from '@/lib/ai/nutritionist';
import { useSearchParams, useRouter } from 'next/navigation';

function AIChatContent() {
  const { profile, todaysMeals, dietPlan, aiConversation, addAiMessage, addMeal, aiPreferences } = useNutrition();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const queryParam = searchParams.get('query');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiConversation, isTyping]);

  useEffect(() => {
    if (queryParam && aiConversation.length === 0) {
      handleSend(queryParam);
      router.replace('/ai-nutritionist', { scroll: false });
    }
  }, [queryParam]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg: ConversationMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    addAiMessage(userMsg);
    setInput('');
    setIsTyping(true);

    const aiResponse = await generateAIResponse(text, {
      profile, todaysMeals, dietPlan, aiPreferences
    });

    addAiMessage({
      id: Math.random().toString(),
      role: 'assistant',
      content: aiResponse.content!,
      recommendations: aiResponse.recommendations,
      sources: aiResponse.sources,
      timestamp: new Date()
    });

    setIsTyping(false);
  };

  const handleLogRecommendation = (food: any) => {
    addMeal({
      type: 'Snack', 
      name: food.name,
      servingSize: `${food.baseQuantity}${food.servingUnit}`,
      quantity: 1,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber || 0,
      sugar: food.sugar || 0,
      sodium: food.sodium || 0,
      timestamp: new Date()
    });
    router.push('/dashboard');
  };

  const remainingCals = profile.nutritionTargets.calories - todaysMeals.reduce((s,m) => s + m.calories, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] animate-fade-in">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl shadow-inner border border-green-100">✦</div>
            <div>
              <h1 className="font-semibold text-stone-900 leading-tight">AI Nutritionist</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-stone-500">Online & ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30">
          {aiConversation.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-3xl mb-6 text-green-500">✦</div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">Tell me what you're trying to achieve.</h2>
              <p className="text-stone-500 text-sm mb-8">I can help you plan meals, analyze your nutrition, or find healthy food alternatives.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {[
                  "What should I eat for dinner?",
                  "Am I getting enough protein?",
                  "Suggest a high-protein snack.",
                  "Tell me about oats."
                ].map(q => (
                  <button 
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:border-green-300 hover:text-green-700 hover:shadow-sm transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {aiConversation.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-4 rounded-2xl text-sm md:text-base ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-sm' 
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.content}
                </div>
                
                {msg.sources && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.sources.map(src => (
                      <div key={src} className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-500 border border-stone-200">
                        <span>📚</span> {src}
                      </div>
                    ))}
                  </div>
                )}

                {msg.recommendations && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.recommendations.map(rec => (
                      <div key={rec.id} className="bg-white border border-stone-200 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-stone-900 text-sm">{rec.name}</span>
                          <span className="text-xs font-bold text-stone-500">{rec.calories} kcal</span>
                        </div>
                        <button 
                          onClick={() => handleLogRecommendation(rec)}
                          className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          Add to Meal
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <span className={`text-[10px] text-stone-400 mt-1 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-stone-100">
          <div className="text-xs text-stone-400 text-center mb-3">
            For medical or condition-specific nutrition advice, consult a qualified healthcare professional.
          </div>
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl p-1.5 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your nutrition..."
              className="flex-1 bg-transparent px-4 py-2.5 outline-none text-stone-700 placeholder-stone-400"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 disabled:opacity-50 transition-all"
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel (Desktop) */}
      <div className="hidden lg:flex w-80 flex-col gap-4 shrink-0">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4">Current Context</h3>
          
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-medium text-stone-500 mb-1">Goal</span>
              <span className="text-sm font-semibold text-stone-900 bg-stone-100 px-2 py-1 rounded">{profile.goals.primary}</span>
            </div>
            
            <div>
              <span className="block text-xs font-medium text-stone-500 mb-1">Diet Preference</span>
              <span className="text-sm font-semibold text-stone-900 bg-stone-100 px-2 py-1 rounded">{profile.diet.preference || 'Balanced'}</span>
            </div>
          </div>

          <div className="h-px w-full bg-stone-100 my-4" />

          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4">Today's Macros</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-stone-600">Remaining Cals</span>
              <span className={`font-bold ${remainingCals < 0 ? 'text-red-500' : 'text-stone-900'}`}>
                {Math.max(0, remainingCals)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all" 
                style={{ width: `${Math.min(100, ((profile.nutritionTargets.calories - remainingCals) / profile.nutritionTargets.calories) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AINutritionistPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading AI interface...</div>}>
        <AIChatContent />
      </Suspense>
    </DashboardLayout>
  );
}
