/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Generates clean 2-letter (or 1-letter) initials from a student's first and last name.
 * Example: "Freda Ofori" -> "FO", "Freda Esi Ofori" -> "FO".
 */
export function getStudentInitials(fullName?: string | null, email?: string | null): string {
  const cleanedName = (fullName || '').trim().replace(/\s+/g, ' ');
  if (cleanedName) {
    const tokens = cleanedName
      .split(' ')
      .map((part) => part.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
      .filter(Boolean);

    if (tokens.length >= 2) {
      const firstChar = Array.from(tokens[0])[0] || '';
      const lastChar = Array.from(tokens[tokens.length - 1])[0] || '';
      const combined = `${firstChar}${lastChar}`.toUpperCase();
      if (combined) return combined;
    }

    if (tokens.length === 1) {
      const chars = Array.from(tokens[0]);
      if (chars.length >= 2) {
        return `${chars[0]}${chars[1]}`.toUpperCase();
      }
      if (chars.length === 1) {
        return chars[0].toUpperCase();
      }
    }
  }

  const localPart = (email || '').trim().split('@')[0] || '';
  if (localPart) {
    const emailTokens = localPart
      .split(/[._-]+/)
      .map((part) => part.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
      .filter(Boolean);

    if (emailTokens.length >= 2) {
      const firstChar = Array.from(emailTokens[0])[0] || '';
      const lastChar = Array.from(emailTokens[emailTokens.length - 1])[0] || '';
      const combined = `${firstChar}${lastChar}`.toUpperCase();
      if (combined) return combined;
    }

    const chars = Array.from(localPart.replace(/[^\p{L}\p{N}]/gu, ''));
    if (chars.length >= 2) {
      return `${chars[0]}${chars[1]}`.toUpperCase();
    }
    if (chars.length === 1) {
      return chars[0].toUpperCase();
    }
  }

  return 'ST';
}

export interface StudentInitialsAvatarProps {
  fullName?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<StudentInitialsAvatarProps['size']>, string> = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-11 h-11 sm:w-12 sm:h-12 text-sm sm:text-base',
  xl: 'w-14 h-14 text-lg',
};

export const StudentInitialsAvatar: React.FC<StudentInitialsAvatarProps> = ({
  fullName,
  email,
  size = 'md',
  className = '',
}) => {
  const initials = getStudentInitials(fullName, email);
  const labelName = (fullName || '').trim() || 'Student';

  return (
    <div
      role="img"
      aria-label={`${labelName} avatar (${initials})`}
      className={`${SIZE_CLASSES[size]} rounded-full bg-gradient-to-br from-[#10132D] via-[#1C204A] to-[#6846F5] text-white ring-1 ring-[#6846F5]/30 shadow-xs flex items-center justify-center font-display font-bold tracking-tight select-none shrink-0 ${className}`}
    >
      <span className="leading-none">{initials}</span>
    </div>
  );
};
