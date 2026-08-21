"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AddMealModal } from './AddMealModal';

export const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    { name: 'Scan Food', icon: '📷', desc: 'Use AI to identify meals', href: '/food-scanner', isLink: true },
    { name: 'Add Meal', icon: '✍️', desc: 'Log nutrition manually', isLink: false },
    { name: 'Ask Nutrition AI', icon: '✨', desc: 'Get personalized advice', href: '/ai-nutritionist', isLink: true },
    { name: 'View Diet Plan', icon: '📋', desc: 'Your tailored schedule', href: '/diet-plan', isLink: true },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        {actions.map((action) => {
          const content = (
            <div className="bg-white border border-stone-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all group flex flex-col h-full hover:-translate-y-0.5 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-lg mb-3 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                {action.icon}
              </div>
              <h4 className="font-semibold text-stone-900 text-sm md:text-base group-hover:text-green-700 transition-colors">{action.name}</h4>
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
