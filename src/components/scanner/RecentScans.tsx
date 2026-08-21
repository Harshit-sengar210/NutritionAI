"use client";

import React from 'react';

export const RecentScans = () => {
  const scans = [
    { id: 1, name: 'Paneer Rice Bowl', calories: 580, time: 'Today, 1:20 PM', icon: '🍲' },
    { id: 2, name: 'Fruit Bowl', calories: 240, time: 'Today, 10:30 AM', icon: '🍎' },
    { id: 3, name: 'Dal Rice', calories: 520, time: 'Yesterday', icon: '🍛' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-fade-in-up mt-8">
      <h3 className="text-sm font-semibold text-stone-900 mb-6 uppercase tracking-wider">Recent Scans</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scans.map(scan => (
          <div key={scan.id} className="flex items-center gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-white hover:border-stone-200 hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
              {scan.icon}
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm group-hover:text-green-700 transition-colors">{scan.name}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 font-medium">
                <span className="text-stone-700">{scan.calories} kcal</span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span>{scan.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
