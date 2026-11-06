/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Campus Connect - Visual Design Tokens
 * Target Audience: African students discovering global scholarships
 * Brand Identity: Ambitious, welcoming, intelligent, and reliable
 */

export const colors = {
  // Brand Primary: Deep Violet
  primary: {
    DEFAULT: '#6846F5',
    hover: '#5534E4',
    active: '#4829CE',
    light: '#7E60F7',
    soft: '#F0EDFF',
    tint: '#ECE8FF',
  },
  // Brand Dark: Midnight Navy
  midnight: {
    DEFAULT: '#15152F',
    surface: '#1E1E3F',
    card: '#25254D',
    muted: '#34345E',
  },
  // Secondary: Soft Lavender
  lavender: {
    DEFAULT: '#F0EDFF',
    hover: '#E5DEFF',
    border: '#DDD6FE',
    light: '#F8F6FF',
  },
  // Accent: Warm Gold (Used sparingly for high-intent moments, awards, deadlines)
  gold: {
    DEFAULT: '#E7B75C',
    hover: '#DBA747',
    soft: '#FDF9EE',
    border: '#F5E0B3',
    dark: '#926A18',
  },
  // Neutral Canvas & Surfaces
  canvas: {
    base: '#FFFFFF',
    raised: '#FDFDFE',
    subtle: '#F8F9FD',
    card: '#FFFFFF',
  },
  // Typography Colors
  text: {
    primary: '#15152F',    // Dark midnight navy
    secondary: '#64748B',  // Slate muted gray
    muted: '#94A3B8',      // Soft gray for tertiary info
    inverse: '#FFFFFF',    // White on dark backgrounds
    primaryOnDark: '#F8FAFC',
    secondaryOnDark: '#94A3B8',
  },
  // Borders
  border: {
    subtle: '#E2E8F0',     // 1px hairline border
    lavender: '#EDE9FE',
    hover: '#CBD5E1',
    focus: '#6846F5',
  },
  // Semantic Indicators
  semantic: {
    success: '#059669',
    successBg: '#ECFDF5',
    warning: '#D97706',
    warningBg: '#FFFBEB',
    error: '#DC2626',
    errorBg: '#FEF2F2',
    info: '#0284C7',
    infoBg: '#F0F9FF',
  },
} as const;

export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  sizes: {
    'display-hero': {
      fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
      lineHeight: '1.15',
      letterSpacing: '-0.025em',
      fontWeight: '700',
    },
    'heading-1': {
      fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    'heading-2': {
      fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)',
      lineHeight: '1.25',
      letterSpacing: '-0.015em',
      fontWeight: '600',
    },
    'heading-3': {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.35',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    'body-large': {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.6',
      letterSpacing: '0',
      fontWeight: '400',
    },
    'body-base': {
      fontSize: '1rem', // 16px
      lineHeight: '1.55',
      letterSpacing: '0',
      fontWeight: '400',
    },
    'body-small': {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      letterSpacing: '0',
      fontWeight: '400',
    },
    'metadata': {
      fontSize: '0.8125rem', // 13px
      lineHeight: '1.4',
      letterSpacing: '0.01em',
      fontWeight: '500',
    },
    'kicker': {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.2',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontWeight: '600',
    },
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

export const radius = {
  none: '0',
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem',// 20px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(21, 21, 47, 0.04)',
  sm: '0 2px 4px -1px rgba(21, 21, 47, 0.05), 0 1px 2px -1px rgba(21, 21, 47, 0.03)',
  md: '0 4px 12px -2px rgba(21, 21, 47, 0.07), 0 2px 6px -2px rgba(21, 21, 47, 0.04)',
  lg: '0 12px 24px -4px rgba(21, 21, 47, 0.09), 0 4px 8px -2px rgba(21, 21, 47, 0.04)',
  xl: '0 20px 32px -6px rgba(21, 21, 47, 0.12), 0 8px 12px -4px rgba(21, 21, 47, 0.05)',
  gold: '0 4px 14px 0 rgba(231, 183, 92, 0.25)',
  primary: '0 4px 14px 0 rgba(104, 70, 245, 0.28)',
} as const;

export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1240px',
  '2xl': '1380px',
  readable: '68ch',
} as const;

export const buttonTokens = {
  base: 'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap shrink-0',
  variants: {
    primary: 'bg-[#6846F5] text-white hover:bg-[#5534E4] active:bg-[#4829CE] focus-visible:ring-[#6846F5] shadow-[0_2px_8px_rgba(104,70,245,0.25)]',
    secondary: 'bg-[#F0EDFF] text-[#6846F5] hover:bg-[#E5DEFF] active:bg-[#D9CFFE] focus-visible:ring-[#6846F5]',
    outline: 'border border-[#E2E8F0] bg-white text-[#15152F] hover:bg-[#F8F9FD] hover:border-[#CBD5E1] active:bg-[#F1F5F9] focus-visible:ring-[#6846F5]',
    midnight: 'bg-[#15152F] text-white hover:bg-[#1E1E3F] active:bg-[#0D0D1F] focus-visible:ring-[#15152F]',
    gold: 'bg-[#E7B75C] text-[#15152F] hover:bg-[#DBA747] active:bg-[#CD9938] focus-visible:ring-[#E7B75C] font-semibold shadow-[0_2px_8px_rgba(231,183,92,0.25)]',
    ghost: 'text-[#15152F] hover:bg-[#F8F9FD] hover:text-[#6846F5] focus-visible:ring-[#6846F5]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
  },
  sizes: {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[34px]',
    md: 'text-sm px-4 py-2 rounded-lg gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 min-h-[48px]',
  },
} as const;

export const cardTokens = {
  base: 'bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_-1px_rgba(21,21,47,0.05),0_1px_2px_-1px_rgba(21,21,47,0.03)] overflow-hidden transition-all duration-200',
  hover: 'hover:border-[#DDD6FE] hover:shadow-[0_8px_20px_-3px_rgba(21,21,47,0.08),0_3px_6px_-2px_rgba(21,21,47,0.04)] hover:-translate-y-0.5',
  elevated: 'bg-white rounded-xl border border-[#E2E8F0] shadow-[0_10px_25px_-3px_rgba(21,21,47,0.08),0_4px_8px_-2px_rgba(21,21,47,0.04)]',
  midnight: 'bg-[#15152F] text-white rounded-xl border border-[#25254D] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.3)]',
  lavenderTint: 'bg-[#FDFBFF] rounded-xl border border-[#EDE9FE] shadow-[0_2px_8px_rgba(104,70,245,0.04)]',
} as const;

export const inputTokens = {
  base: 'w-full rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#15152F] placeholder:text-[#94A3B8] transition-all duration-150 focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  sizes: {
    sm: 'px-3 py-1.5 text-xs min-h-[34px]',
    md: 'px-3.5 py-2 text-sm min-h-[40px]',
    lg: 'px-4 py-2.5 text-base min-h-[48px]',
  },
  error: 'border-red-400 text-red-900 focus:border-red-500 focus:ring-red-500/20',
} as const;
