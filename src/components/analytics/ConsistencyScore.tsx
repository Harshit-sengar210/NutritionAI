"use client";

import React from 'react';

interface ConsistencyScoreProps {
  score: number;
}

export const ConsistencyScore = ({ score }: ConsistencyScoreProps) => {
  return (
    <div className="bg-gradient-to-br from-green-900 to-green-950 border border-green-800 rounded-3xl p-6 lg:p-8 shadow-lg text-white h-full flex flex-col justify-center relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/30 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl -z-0" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-green-400 font-semibold uppercase tracking-wider text-sm mb-2">Consistency Score</h3>
          <p className="text-green-50 text-sm max-w-[180px]">Based on logging habits and target adherence.</p>
        </div>
        
        <div className="w-24 h-24 shrink-0 relative">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="40" fill="none" 
              stroke="#4ade80" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (score / 100) * 251.2}
              className="transition-all duration-1000 ease-out delay-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
