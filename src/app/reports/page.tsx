"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { generateNutritionReport, NutritionReport } from '@/lib/nutrition/reports';
import { useSearchParams } from 'next/navigation';

function ReportsContent() {
  const { profile, meals, dietPlan } = useNutrition();
  const searchParams = useSearchParams();
  
  const [rangeStr, setRangeStr] = useState('7 Days');
  const [report, setReport] = useState<NutritionReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');

  const calculateDates = (range: string) => {
    const end = new Date();
    const start = new Date();
    if (range === '7 Days') start.setDate(end.getDate() - 6);
    else if (range === '30 Days') start.setDate(end.getDate() - 29);
    else if (range === '90 Days') start.setDate(end.getDate() - 89);
    return { start, end };
  };

  const generate = (range: string) => {
    setRangeStr(range);
    setIsGenerating(true);
    setGenerationSteps([]);
    const { start, end } = calculateDates(range);
    
    // Simulate generation UX
    const steps = [
      "Preparing nutrition data...",
      "Analyzing meal history...",
      "Calculating nutrition trends...",
      "Preparing your report..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setGenerationSteps(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setReport(generateNutritionReport(start, end, { profile, meals, dietPlan }));
        setIsGenerating(false);
      }
    }, 400); // Fast 1.6s demo
  };

  useEffect(() => {
    // Initial load
    const initialRange = searchParams.get('range') || '7 Days';
    generate(initialRange);
  }, []);

  const handleExportCSV = () => {
    if (!report) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Nutrition Score,${report.summary.nutritionScore}\n`
      + `Average Calories,${report.summary.averageCalories}\n`
      + `Average Protein,${report.summary.averageProtein}g\n`
      + `Meals Logged,${report.summary.mealsLogged}\n`
      + `Days Tracked,${report.daysTracked}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nutrition_report_${rangeStr.replace(' ', '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isGenerating || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-stone-100 border-t-green-500 animate-spin mb-8" />
        <h2 className="text-xl font-semibold text-stone-900 mb-6">Generating Report...</h2>
        <div className="space-y-2 text-stone-500 text-sm">
          {generationSteps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 animate-fade-in-up">
              <span className="text-green-500">✓</span> {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (report.daysTracked === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-3xl mb-6">📊</div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your nutrition report is not ready yet.</h2>
        <p className="text-stone-500 mb-8">Keep tracking meals to unlock detailed reports.</p>
        <div className="flex gap-4 mb-8 w-full justify-center">
          <div className="p-4 bg-white border border-stone-200 rounded-2xl">
            <div className="text-2xl font-bold text-stone-900">0</div>
            <div className="text-xs text-stone-500 font-medium">Meals Logged</div>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl">
            <div className="text-2xl font-bold text-stone-900">0</div>
            <div className="text-xs text-stone-500 font-medium">Days Tracked</div>
          </div>
        </div>
      </div>
    );
  }

  const sections = ['Overview', 'Calories', 'Macros', 'Meals', 'Insights'];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Header - Hidden on Print */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Nutrition Reports</h1>
          <p className="text-stone-500 font-medium mt-1">Your nutrition journey, summarized.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select 
            value={rangeStr}
            onChange={(e) => generate(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 shadow-sm focus:outline-none"
          >
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
          <button onClick={() => generate(rangeStr)} className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 shadow-sm text-sm">
            Generate Report
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 shadow-sm text-sm">
            Export CSV
          </button>
          <button onClick={handlePrint} className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 shadow-sm text-sm">
            Print
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-900">Nutrition Report</h1>
        <p className="text-stone-500">{report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}</p>
      </div>

      {/* Navigation - Hidden on Print */}
      <div className="flex overflow-x-auto gap-2 mb-8 hide-scrollbar print:hidden bg-stone-50/50 p-1 rounded-2xl border border-stone-200">
        {sections.map(s => (
          <button 
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === s ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {/* SUMMARY HERO */}
        {(activeTab === 'Overview' || true) && (
          <section id="Overview" className="print:block">
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 lg:p-12 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-between relative z-10">
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-lg text-stone-300 font-medium mb-1">Your Nutrition Summary</h2>
                  <p className="text-stone-400 text-sm font-medium mb-8">
                    {report.startDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} – {report.endDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="text-3xl font-bold">{report.summary.averageCalories}</div>
                      <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Avg Kcal/Day</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{report.summary.averageProtein}g</div>
                      <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Avg Pro/Day</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{report.summary.mealsLogged}</div>
                      <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Meals Logged</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{report.summary.goalAdherence}%</div>
                      <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Goal Adherence</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${report.summary.nutritionScore * 2.83} 283`} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold">{report.summary.nutritionScore}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Score</span>
                    </div>
                  </div>
                  <div className="text-xs text-stone-400 mt-4 max-w-[150px] text-center">Application nutrition score based on adherence</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CALORIES & MACROS */}
        {(activeTab === 'Overview' || activeTab === 'Calories' || activeTab === 'Macros') && (
          <section id="Calories" className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:block">
            {/* Calories */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-8">Calorie Intake Report</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Average Daily</div>
                  <div className="text-2xl font-bold text-stone-900">{report.calories.average} <span className="text-sm text-stone-400 font-medium">kcal</span></div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Target</div>
                  <div className="text-2xl font-bold text-stone-900">{report.calories.target} <span className="text-sm text-stone-400 font-medium">kcal</span></div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Highest Intake</div>
                  <div className="text-xl font-bold text-stone-900">{report.calories.highest}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Lowest Intake</div>
                  <div className="text-xl font-bold text-stone-900">{report.calories.lowest}</div>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="h-40 flex items-end gap-2 mt-4 relative">
                <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-stone-300 w-full z-0 flex items-center" style={{ bottom: `${(report.calories.target / Math.max(report.calories.target * 1.5, report.calories.highest)) * 100}%` }}>
                  <span className="absolute right-0 -mt-6 text-[10px] font-bold text-stone-400 bg-white px-1">Target</span>
                </div>
                {report.calories.dailyData.map((d, i) => {
                  const maxVal = Math.max(report.calories.target * 1.5, report.calories.highest);
                  const h = `${(d.calories / maxVal) * 100}%`;
                  const isOver = d.calories > d.target * 1.1;
                  const isUnder = d.calories < d.target * 0.9;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center group relative z-10 h-full">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-stone-900 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-20">
                        {d.calories} kcal
                      </div>
                      <div className={`w-full rounded-t-sm transition-all duration-500 ${isOver ? 'bg-orange-400' : isUnder ? 'bg-blue-400' : 'bg-green-500'}`} style={{ height: h }} />
                      <div className="text-[10px] text-stone-400 mt-2 font-medium truncate w-full text-center">{d.dateStr.split('-')[2]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Macros */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-8">Macronutrient Overview</h3>
              <div className="space-y-8">
                {[
                  { name: 'Protein', data: report.macros.protein, color: 'bg-blue-500' },
                  { name: 'Carbohydrates', data: report.macros.carbohydrates, color: 'bg-orange-500' },
                  { name: 'Fat', data: report.macros.fat, color: 'bg-purple-500' },
                ].map(m => (
                  <div key={m.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-stone-900">{m.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-900">{m.data.average}g</span>
                        <span className="text-xs font-medium text-stone-500"> / {m.data.target}g</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden flex relative">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${Math.min(100, m.data.percentage)}%` }} />
                      <div className="absolute right-0 top-0 bottom-0 pr-1 flex items-center text-[10px] font-bold text-stone-400">{m.data.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* MEALS & CONSISTENCY */}
        {(activeTab === 'Overview' || activeTab === 'Meals') && (
          <section id="Meals" className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid-cols-3 print:block">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Meal Tracking Summary</h3>
              <div className="text-4xl font-bold text-stone-900 mb-6">{report.meals.total} <span className="text-lg text-stone-500 font-medium">total meals</span></div>
              <div className="space-y-3">
                {[
                  { label: 'Breakfasts', val: report.meals.breakfast },
                  { label: 'Lunches', val: report.meals.lunch },
                  { label: 'Snacks', val: report.meals.snack },
                  { label: 'Dinners', val: report.meals.dinner }
                ].map(m => (
                  <div key={m.label} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                    <span className="text-stone-600 font-medium text-sm">{m.label}</span>
                    <span className="font-bold text-stone-900">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Meal Consistency</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-stone-900">{report.meals.consistency.daysTracked} <span className="text-lg text-stone-500">/ {report.meals.consistency.totalDays}</span></div>
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mt-1">Days Tracked</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                  <div>
                    <div className="text-xl font-bold text-stone-900">{report.meals.consistency.currentStreak} days</div>
                    <div className="text-xs font-medium text-stone-500 mt-1">Current Streak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-stone-900">{report.meals.consistency.longestStreak} days</div>
                    <div className="text-xs font-medium text-stone-500 mt-1">Longest Streak</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-6">Diet Plan Adherence</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-stone-100 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray={`${report.dietPlan.adherence * 2.83} 283`} />
                  </svg>
                  <span className="font-bold text-sm">{report.dietPlan.adherence}%</span>
                </div>
                <div>
                  <div className="font-bold text-stone-900">Adherence</div>
                  <div className="text-xs text-stone-500">Planned vs Completed</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-stone-500">Planned meals:</span> <span className="font-semibold">{report.dietPlan.planned}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Completed:</span> <span className="font-semibold text-green-600">{report.dietPlan.completed}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Skipped:</span> <span className="font-semibold text-stone-400">{report.dietPlan.skipped}</span></div>
              </div>
            </div>
          </section>
        )}

        {/* INSIGHTS */}
        {(activeTab === 'Overview' || activeTab === 'Insights') && (
          <section id="Insights" className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
            <div className="bg-green-50/50 border border-green-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-green-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="text-lg">✦</span> AI Report Insights
              </h3>
              <div className="space-y-4">
                {report.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 text-sm font-medium text-green-900 bg-white p-4 rounded-2xl shadow-sm border border-green-50">
                    <span className="text-green-500">→</span>
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">Your Highlights</h3>
                <ul className="space-y-3">
                  {report.highlights.length > 0 ? report.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-stone-700">
                      <span className="text-green-500 font-bold">✓</span> {h}
                    </li>
                  )) : <li className="text-sm text-stone-500">Keep tracking to unlock highlights!</li>}
                </ul>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">Areas to Improve</h3>
                <ul className="space-y-3">
                  {report.improvements.length > 0 ? report.improvements.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-stone-700">
                      <span className="text-orange-400 font-bold">•</span> {h}
                    </li>
                  )) : <li className="text-sm text-stone-500">You are doing great! No immediate areas to improve.</li>}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading reports...</div>}>
        <ReportsContent />
      </Suspense>
    </DashboardLayout>
  );
}
