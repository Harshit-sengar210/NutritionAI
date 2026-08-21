import React from 'react';

export const NutritionLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Soft green circular form */}
        <circle cx="50" cy="50" r="46" fill="url(#circle-grad)" />
        <circle cx="50" cy="50" r="46" stroke="url(#border-grad)" strokeWidth="1" />

        {/* Minimal leaf/nutrition symbol */}
        <path
          d="M48 35C48 35 34 35 34 49C34 63 48 65 48 65C48 65 62 65 62 51C62 37 48 35 48 35Z"
          fill="url(#leaf-grad)"
        />
        <path
          d="M48 65V35"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: 0.6 }}
        />

        {/* Small AI sparkle */}
        <path
          d="M68 30C68 30 67 36 61 37C67 38 68 44 68 44C68 44 69 38 75 37C69 36 68 30 68 30Z"
          fill="#10B981"
          className="animate-sparkle"
          style={{ transformOrigin: '68px 37px' }}
        />
        <path
          d="M32 25C32 25 31.5 28 28.5 28.5C31.5 29 32 32 32 32C32 32 32.5 29 35.5 28.5C32.5 28 32 25 32 25Z"
          fill="#34D399"
          className="animate-sparkle-delayed"
          style={{ transformOrigin: '32px 28.5px' }}
        />

        <defs>
          <linearGradient id="circle-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0FDF4" />
            <stop offset="1" stopColor="#DCFCE7" />
          </linearGradient>
          <linearGradient id="border-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BBF7D0" />
            <stop offset="1" stopColor="#86EFAC" />
          </linearGradient>
          <linearGradient id="leaf-grad" x1="34" y1="35" x2="62" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22C55E" />
            <stop offset="1" stopColor="#15803D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
