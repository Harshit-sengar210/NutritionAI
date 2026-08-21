import React from 'react';

interface OnboardingNavigationProps {
  onBack?: () => void;
  onContinue: () => void;
  continueText?: string;
  isContinueDisabled?: boolean;
}

export const OnboardingNavigation = ({
  onBack,
  onContinue,
  continueText = "Continue",
  isContinueDisabled = false
}: OnboardingNavigationProps) => {
  return (
    <div className="w-full flex items-center justify-between pt-8 mt-8 border-t border-stone-100">
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 text-stone-500 font-medium hover:text-stone-800 transition-colors focus:outline-none"
          >
            Back
          </button>
        )}
      </div>
      
      <button
        type="button"
        onClick={onContinue}
        disabled={isContinueDisabled}
        className={`
          px-8 py-3 rounded-2xl font-medium transition-all duration-200
          ${isContinueDisabled 
            ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
            : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
          }
        `}
      >
        {continueText}
      </button>
    </div>
  );
};
