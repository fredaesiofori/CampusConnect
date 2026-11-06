/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'subtle' | 'lavender' | 'gold' | 'outline' | 'midnight' | 'success';
  size?: 'sm' | 'md';
}

const variantMap = {
  subtle: 'bg-[#F8F9FD] text-[#15152F] border border-[#E2E8F0]',
  lavender: 'bg-[#F0EDFF] text-[#6846F5] border border-[#DDD6FE]/60',
  gold: 'bg-[#FDF9EE] text-[#926A18] border border-[#F5E0B3]',
  outline: 'bg-white text-[#64748B] border border-[#E2E8F0]',
  midnight: 'bg-[#15152F] text-white border border-[#25254D]',
  success: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]',
};

const sizeMap = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
  md: 'text-xs px-2.5 py-1 rounded-md font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Clean Unboxed Metadata component adhering to the frontend design constitution:
 * "Never wrap metadata in rounded pill boxes; render as clean, unboxed text with subtle typographic separators"
 */
export interface MetadataItemProps {
  items: Array<React.ReactNode>;
  className?: string;
  separator?: string;
}

export const MetadataRow: React.FC<MetadataItemProps> = ({
  items,
  className = '',
  separator = '·',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#64748B] font-medium ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-[#CBD5E1] select-none" aria-hidden="true">
              {separator}
            </span>
          )}
          <span className="inline-flex items-center gap-1">{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
};
