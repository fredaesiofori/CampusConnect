/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Award,
  UserRound,
  BookOpen,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

export type DashboardNavTab =
  | 'overview'
  | 'universities'
  | 'scholarships'
  | 'tracker'
  | 'profile'
  | 'resources'
  | 'settings';

export interface DashboardSidebarProps {
  activeTab: DashboardNavTab;
  onSelectTab: (tab: DashboardNavTab) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    universities: number;
    scholarships: number;
    saved?: number;
  };
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
  counts,
}) => {
  // Handle Escape key to close mobile drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  // Prevent background scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

  const navItems: {
    id: DashboardNavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'universities',
      label: 'Explore Universities',
      icon: <Building2 className="w-4 h-4" />,
      badge: counts?.universities,
    },
    {
      id: 'scholarships',
      label: 'Scholarships',
      icon: <Award className="w-4 h-4" />,
      badge: counts?.scholarships,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserRound className="w-4 h-4" />,
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleItemClick = (id: DashboardNavTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="relative flex flex-col h-full justify-between p-4 sm:p-5 pb-8 sm:pb-5 bg-gradient-to-b from-[#230B5E] via-[#371489] to-[#1A0747] text-white border-r border-white/10 overflow-y-auto overflow-x-hidden">
      {/* Ambient curved violet wave at bottom-left matching reference */}
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 w-full h-48 opacity-45"
      >
        <path
          d="M0 95C65 45 145 145 280 55V220H0V95Z"
          fill="url(#sidebarWaveA)"
        />
        <path
          d="M0 140C90 95 170 185 280 115V220H0V140Z"
          fill="url(#sidebarWaveB)"
        />
        <defs>
          <linearGradient id="sidebarWaveA" x1="0" y1="60" x2="280" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6D28D9" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2E1065" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sidebarWaveB" x1="0" y1="115" x2="260" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="1" stopColor="#1E084E" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Brand Logo & Navigation */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <button
            type="button"
            onClick={() => handleItemClick('overview')}
            aria-label="Go to Campus Connect Dashboard"
            className="text-left rounded-xl p-1 -m-1 transition-opacity duration-150 hover:opacity-90 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Logo size="md" variant="dark" iconShape="circle" onPurple={true} showWordmark={true} />
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer shrink-0"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Scholar Dashboard Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6846F5] text-white shadow-[0_6px_18px_rgba(124,58,237,0.5)]'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-white/75'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {typeof item.badge === 'number' && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive
                        ? 'bg-white text-[#35147E]'
                        : 'bg-white text-[#230B5E] shadow-xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Log Out Section */}
      <div className="relative z-10 pt-4 border-t border-white/20 space-y-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <LogOut className="w-4 h-4 text-white/80" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Universal Slide-Out Navigation Drawer (Mobile, Tablet, and Desktop) */}
      {isOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#10132D]/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer container */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
