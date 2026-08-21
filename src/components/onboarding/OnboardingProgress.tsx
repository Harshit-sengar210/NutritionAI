import React from 'react';

export const steps = [
  "Personal",
  "Lifestyle",
  "Diet",
  "Allergies",
  "Goals",
  "Targets",
  "Summary"
];

interface OnboardingProgressProps {
  currentStepIndex: number;
}

export const OnboardingProgress = ({ currentStepIndex }: OnboardingProgressProps) => {
  return (
    <div className="w-full mb-8 pt-4 pb-2 relative hidden md:block">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step} className="flex flex-col items-center relative z-10 w-16">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-white shadow-sm' : ''}
                  ${isCurrent ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-stone-100 text-stone-400' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-[10px] mt-2 font-medium transition-colors ${
                isCompleted || isCurrent ? 'text-stone-700' : 'text-stone-400'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connecting lines */}
      <div className="absolute top-[32px] left-[32px] right-[32px] h-[2px] bg-stone-100 -z-0">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
