/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  iconShape?: 'rounded' | 'circle';
  showWordmark?: boolean;
  onPurple?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  iconShape = 'rounded',
  showWordmark = true,
  onPurple = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
  };

  const textSizes = {
    sm: 'text-[15px] sm:text-base',
    md: 'text-base sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  const isDark = variant === 'dark';

  const isSmall = size === 'sm';
  const isCircle = iconShape === 'circle';

  return (
    <div className={`inline-flex items-center ${isSmall ? 'gap-2 min-w-0 max-w-full' : 'gap-2.5'} select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`${iconSizes[size]} ${
          onPurple
            ? 'rounded-full bg-white ring-1 ring-white/30 shadow-[0_4px_14px_rgba(12,4,38,0.35)]'
            : isCircle
            ? 'rounded-full bg-gradient-to-br from-[#5B2EE6] to-[#3B169C] ring-1 ring-[#6846F5]/30 shadow-[0_2px_8px_rgba(75,34,184,0.28)]'
            : 'rounded-xl bg-[#15152F] ring-1 ring-[#6846F5]/20 shadow-[0_2px_8px_rgba(21,21,47,0.15)]'
        } flex items-center justify-center p-1.5 shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Pathway / Graduation Cap Geometric Wings */}
          <path
            d="M16 4L4 10.5L16 17L28 10.5L16 4Z"
            fill={onPurple ? '#35147E' : isCircle ? '#FFFFFF' : '#6846F5'}
          />
          {/* African connection arch & foundation */}
          <path
            d="M8 15V22C8 25.3137 11.5817 28 16 28C20.4183 28 24 25.3137 24 22V15L16 19.5L8 15Z"
            fill={onPurple ? '#5B2EE6' : '#F0EDFF'}
            fillOpacity={onPurple ? '0.9' : '0.85'}
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
        <div className="flex flex-col leading-none min-w-0">
          <span
            className={`font-display font-bold tracking-tight truncate ${textSizes[size]} ${
              isDark || onPurple ? 'text-white' : 'text-[#15152F]'
            }`}
          >
            Campus<span className={onPurple ? 'text-[#C4B5FD]' : 'text-[#6846F5]'}>Connect</span>
          </span>
          <span
            className={`${
              isSmall
                ? 'text-[7.5px] min-[360px]:text-[8.5px] tracking-[0.03em] min-[360px]:tracking-[0.05em]'
                : 'text-[8.5px] sm:text-[9.5px] tracking-[0.06em] sm:tracking-[0.08em]'
            } uppercase font-medium mt-0.5 whitespace-nowrap truncate ${
              onPurple ? 'text-white/80' : isDark ? 'text-slate-400' : 'text-[#64748B]'
            }`}
          >
            Global Education Opportunities
          </span>
        </div>
      )}
    </div>
  );
};
