import React from 'react';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export const SelectionCard = ({
  title,
  description,
  icon,
  selected,
  onClick,
  className = ""
}: SelectionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-2xl border transition-all duration-200
        flex items-start gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/20
        ${selected 
          ? 'border-green-500 bg-green-50/50 shadow-sm shadow-green-100/50 scale-[1.02]' 
          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
        }
        ${className}
      `}
    >
      {icon && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors
          ${selected ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-500'}
        `}>
          {icon}
        </div>
      )}
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <span className={`font-semibold transition-colors ${selected ? 'text-green-900' : 'text-stone-800'}`}>
            {title}
          </span>
          
          {/* Check indicator */}
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            selected ? 'bg-green-500 border-green-500 scale-100' : 'border-stone-300 scale-90 opacity-0 group-hover:opacity-50'
          }`}>
            {selected && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        {description && (
          <p className={`text-sm mt-1 transition-colors ${selected ? 'text-green-700/80' : 'text-stone-500'}`}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
};
