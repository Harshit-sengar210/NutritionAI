"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NutritionLogo } from '../brand/NutritionLogo';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Meals', href: '/meals', icon: '🍽️' },
  { name: 'Food Scanner', href: '/food-scanner', icon: '📷' },
  { name: 'Diet Plan', href: '/diet-plan', icon: '📋' },
  { name: 'AI Nutritionist', href: '/ai-nutritionist', icon: '✨' },
  { name: 'Reports', href: '/reports', icon: '📈' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col md:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-100 min-h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 mb-4">
          <NutritionLogo className="w-8 h-8" />
          <span className="font-semibold text-stone-900">Nutrition AI</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
          
          <div className="my-6 border-t border-stone-100 mx-4" />
          
          <Link href="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${pathname === '/profile' ? 'bg-green-50 text-green-700' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}>
            <span className="text-lg">👤</span> Profile
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${pathname === '/settings' ? 'bg-green-50 text-green-700' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}>
            <span className="text-lg">⚙️</span> Settings
          </Link>
        </nav>

        <div className="p-6 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-900">Nutrition AI</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Your intelligent nutrition companion</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0 overflow-x-hidden relative">
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 xl:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-100 flex items-center justify-around px-2 py-3 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 p-2 ${pathname === '/dashboard' ? 'text-green-600' : 'text-stone-400'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/meals" className={`flex flex-col items-center gap-1 p-2 ${pathname === '/meals' ? 'text-green-600' : 'text-stone-400'}`}>
          <span className="text-xl">🍽️</span>
          <span className="text-[10px] font-medium">Meals</span>
        </Link>
        
        {/* Floating Center Action */}
        <div className="relative -top-5">
          <Link href="/food-scanner" className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 text-white hover:scale-105 transition-transform active:scale-95">
            <span className="text-2xl">📷</span>
          </Link>
        </div>
        
        <Link href="/ai-nutritionist" className={`flex flex-col items-center gap-1 p-2 ${pathname === '/ai-nutritionist' ? 'text-green-600' : 'text-stone-400'}`}>
          <span className="text-xl">✨</span>
          <span className="text-[10px] font-medium">AI</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 p-2 ${pathname === '/profile' ? 'text-green-600' : 'text-stone-400'}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>

    </div>
  );
};
