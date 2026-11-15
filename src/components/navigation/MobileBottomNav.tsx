/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, Home, Search, User } from 'lucide-react';

export type MobileBottomNavTab = 'home' | 'explore' | 'dashboard' | 'profile';

export interface MobileBottomNavProps {
  activeTab: MobileBottomNavTab;
  onSelectHome: () => void;
  onSelectExplore: () => void;
  onSelectDashboard: () => void;
  onSelectProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectHome,
  onSelectExplore,
  onSelectDashboard,
  onSelectProfile,
}) => {
  const items: {
    id: MobileBottomNavTab;
    label: string;
    onClick: () => void;
    renderIcon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      onClick: onSelectHome,
      renderIcon: (isActive) => (
        <Home
          className="w-[21px] h-[21px]"
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={isActive ? 1.8 : 2}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'explore',
      label: 'Explore',
      onClick: onSelectExplore,
      renderIcon: (isActive) => (
        <Search
          className="w-[21px] h-[21px]"
          strokeWidth={isActive ? 2.4 : 2}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      onClick: onSelectDashboard,
      renderIcon: (isActive) => (
        <GraduationCap
          className="w-[22px] h-[22px]"
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={isActive ? 1.8 : 2}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      onClick: onSelectProfile,
      renderIcon: (isActive) => (
        <User
          className="w-[21px] h-[21px]"
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={isActive ? 2 : 2}
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E6E9F0] h-16 pb-safe shadow-[0_-4px_18px_rgba(16,19,45,0.05)]"
    >
      <div className="grid grid-cols-4 h-full max-w-md mx-auto px-2">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-current={isActive ? 'page' : undefined}
              className={`relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6846F5] ${
                isActive
                  ? 'text-[#5D35F5]'
                  : 'text-[#10132D] hover:text-[#5D35F5]'
              }`}
            >
              {item.renderIcon(isActive)}
              <span
                className={`text-[11px] leading-tight tracking-tight ${
                  isActive ? 'font-bold text-[#5D35F5]' : 'font-medium text-[#334155]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="mt-0.5 w-11 h-[2.5px] rounded-full bg-[#5D35F5]"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
