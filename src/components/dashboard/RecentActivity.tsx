"use client";

import React from 'react';
import { useNutrition } from '@/context/NutritionContext';

export const RecentActivity = () => {
  const { activities } = useNutrition();

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '800ms' }}>
      <h3 className="text-sm font-semibold text-stone-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.slice(0, 4).map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="mt-1">
              {activity.type === 'meal' && <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />}
              {activity.type === 'insight' && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1" />}
              {activity.type === 'system' && <div className="w-2 h-2 rounded-full bg-stone-300 mt-1" />}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800">{activity.message}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-stone-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};
