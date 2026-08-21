"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AddMealModal } from './AddMealModal';

export const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    { name: 'Scan Food', icon: '📸', desc: 'Use AI to identify meals', href: '/food-scanner', isLink: true, hoverBorder: 'hover:border-purple-200', iconBg: 'group-hover:bg-purple-50 group-hover:border-purple-100', textHover: 'group-hover:text-purple-700' },
    { name: 'Add Meal', icon: '➕', desc: 'Log nutrition manually', isLink: false, hoverBorder: 'hover:border-emerald-200', iconBg: 'group-hover:bg-emerald-50 group-hover:border-emerald-100', textHover: 'group-hover:text-emerald-700' },
    { name: 'Ask Nutrition AI', icon: '✨', desc: 'Get personalized advice', href: '/ai-nutritionist', isLink: true, hoverBorder: 'hover:border-blue-200', iconBg: 'group-hover:bg-blue-50 group-hover:border-blue-100', textHover: 'group-hover:text-blue-700' },
    { name: 'View Diet Plan', icon: '📋', desc: 'Your tailored schedule', href: '/diet-plan', isLink: true, hoverBorder: 'hover:border-amber-200', iconBg: 'group-hover:bg-amber-50 group-hover:border-amber-100', textHover: 'group-hover:text-amber-700' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        {actions.map((action) => {
          const content = (
            <div className={`bg-white border border-stone-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full hover:-translate-y-0.5 cursor-pointer ${action.hoverBorder}`}>
              <div className={`w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-lg mb-3 transition-colors ${action.iconBg}`}>
                {action.icon}
              </div>
              <h4 className={`font-semibold text-stone-900 text-sm md:text-base transition-colors ${action.textHover}`}>{action.name}</h4>
              <p className="text-xs text-stone-500 mt-1">{action.desc}</p>
            </div>
          );

          if (action.isLink) {
            return (
              <Link key={action.name} href={action.href!}>
                {content}
              </Link>
            );
          }

          return (
            <div key={action.name} onClick={() => setIsModalOpen(true)}>
              {content}
            </div>
          );
        })}
      </div>

      <AddMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
