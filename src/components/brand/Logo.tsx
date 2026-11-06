/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-[#15152F] flex items-center justify-center p-1.5 shadow-[0_2px_8px_rgba(21,21,47,0.15)] ring-1 ring-[#6846F5]/20 shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Pathway / Graduation Cap Geometric Wings in Violet */}
          <path
            d="M16 4L4 10.5L16 17L28 10.5L16 4Z"
            fill="#6846F5"
          />
          {/* African connection arch & foundation */}
          <path
            d="M8 15V22C8 25.3137 11.5817 28 16 28C20.4183 28 24 25.3137 24 22V15L16 19.5L8 15Z"
            fill="#F0EDFF"
            fillOpacity="0.85"
          />
          {/* Warm Gold focal beacon node */}
          <circle
            cx="24"
            cy="11"
            r="3"
            fill="#E7B75C"
          />
          <path
            d="M24 14V19"
            stroke="#E7B75C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-bold tracking-tight ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-[#15152F]'
            }`}
          >
            Campus<span className="text-[#6846F5]">Connect</span>
          </span>
          <span
            className={`text-[10px] tracking-widest uppercase font-medium mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-[#64748B]'
            }`}
          >
            Global Scholarships
          </span>
        </div>
      )}
    </div>
  );
};
