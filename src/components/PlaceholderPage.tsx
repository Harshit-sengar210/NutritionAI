import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function PlaceholderPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white border border-stone-200 rounded-3xl p-8 text-center animate-fade-in">
        <span className="text-4xl mb-4">🚧</span>
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">Coming Soon</h1>
        <p className="text-stone-500 max-w-md">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </DashboardLayout>
  );
}
