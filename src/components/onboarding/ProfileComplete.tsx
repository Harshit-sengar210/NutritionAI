import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const ProfileComplete = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1300),
      setTimeout(() => setStage(4), 1800),
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="w-32 h-32 relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-green-50 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-4 bg-green-100 rounded-full animate-glow" />
        
        <svg className={`w-12 h-12 text-green-600 relative z-10 transition-all duration-500 ${stage >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        {stage < 4 && (
          <svg className="w-8 h-8 text-green-500 absolute z-10 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-stone-900 mb-6 text-center">
        {stage >= 4 ? "Your Nutrition Profile is Ready" : "Analyzing your preferences..."}
      </h2>

      <div className="space-y-3 w-full max-w-xs">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
          <span className="text-stone-600 font-medium">Personal profile</span>
        </div>
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
          <span className="text-stone-600 font-medium">Dietary preferences</span>
        </div>
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
          <span className="text-stone-600 font-medium">Activity & goals</span>
        </div>
      </div>
    </div>
  );
};
