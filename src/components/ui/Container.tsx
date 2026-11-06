/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: 'white' | 'subtle' | 'lavender' | 'midnight';
  spacing?: 'compact' | 'normal' | 'generous';
}

const surfaceClasses = {
  white: 'bg-white text-[#15152F]',
  subtle: 'bg-[#F8F9FD] text-[#15152F] border-y border-[#E2E8F0]/60',
  lavender: 'bg-[#F0EDFF] text-[#15152F] border-y border-[#DDD6FE]/60',
  midnight: 'bg-[#15152F] text-white',
};

const sectionSpacingClasses = {
  compact: 'py-8 sm:py-12',
  normal: 'py-12 sm:py-16 lg:py-20',
  generous: 'py-16 sm:py-24 lg:py-28',
};

export const Section: React.FC<SectionProps> = ({
  children,
  surface = 'white',
  spacing = 'normal',
  className = '',
  ...props
}) => {
  return (
    <section
      className={`relative w-full ${surfaceClasses[surface]} ${sectionSpacingClasses[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  darkTheme?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  align = 'left',
  darkTheme = false,
  className = '',
  ...props
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl mb-10 sm:mb-14 ${alignClass} ${className}`} {...props}>
      {kicker && (
        <span
          className={`block text-xs font-semibold tracking-wider uppercase mb-2 ${
            darkTheme ? 'text-[#E7B75C]' : 'text-[#6846F5]'
          }`}
        >
          {kicker}
        </span>
      )}
      <h2
        className={`font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl [text-wrap:balance] ${
          darkTheme ? 'text-white' : 'text-[#15152F]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed [text-wrap:pretty] ${
            darkTheme ? 'text-slate-300' : 'text-[#64748B]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
