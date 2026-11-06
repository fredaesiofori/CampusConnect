/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Award,
  Target,
  UserRound,
  BookOpen,
  Settings,
  LogOut,
  X,
  Sparkles,
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
    saved: number;
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
      id: 'tracker',
      label: 'Target Tracker',
      icon: <Target className="w-4 h-4" />,
      badge: counts?.saved,
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
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 pb-8 sm:pb-5 bg-white border-r border-[#E2E8F0] overflow-y-auto">
      {/* Top Brand Logo */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
          <Logo size="md" variant="light" showWordmark={true} />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1" aria-label="Scholar Dashboard Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-[#6846F5] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#10132D] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {typeof item.badge === 'number' && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
      <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
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
