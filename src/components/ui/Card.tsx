/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cardTokens } from '../../design-system/tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hover' | 'elevated' | 'midnight' | 'lavenderTint';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

const paddingMap = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-9',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  padding = 'md',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const variantClass = cardTokens[variant] || cardTokens.base;
  const paddingClass = paddingMap[padding];

  return (
    <Component
      className={`${variantClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`font-semibold text-lg text-[#15152F] tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={`text-sm text-[#64748B] leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
