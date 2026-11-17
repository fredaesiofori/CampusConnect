/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Compass, HelpCircle, Info, LogIn, ShieldCheck } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { StudentInitialsAvatar } from '../ui/StudentInitialsAvatar';
import { NotificationBellCenter } from '../dashboard/NotificationBellCenter';
import { StudentNotificationRecord } from '../../services/notifications';

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  activeLinkId?: string;
  onNavigate?: (id: string) => void;
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  onExploreHubClick?: () => void;
  onLogoClick?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
  notifications?: StudentNotificationRecord[];
  onMarkNotificationRead?: (notificationId: string, read: boolean) => Promise<void> | void;
  onMarkAllNotificationsRead?: () => Promise<void> | void;
  onDeleteNotification?: (notificationId: string) => Promise<void> | void;
  onClearAllNotifications?: () => Promise<void> | void;
  onNavigateNotification?: (notification: StudentNotificationRecord) => void;
  onOpenNotificationSettings?: () => void;
  className?: string;
}

export const defaultNavLinks: NavLinkItem[] = [
  { id: 'how-it-works', label: 'How It Works', href: '#how-it-works', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'benefits', label: 'Why Campus Connect', href: '#benefits', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'about', label: 'About', href: '#about', icon: <Info className="w-4 h-4" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeLinkId,
  onNavigate,
  onLoginClick,
  onGetStartedClick,
  onExploreHubClick,
  onLogoClick,
  isLoggedIn = false,
  userEmail,
  userName,
  onLogout,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  onClearAllNotifications,
  onNavigateNotification,
  onOpenNotificationSettings,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to adjust backdrop intensity smoothly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent, item: NavLinkItem) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (isLoggedIn) {
      if (onLogoClick) {
        onLogoClick();
        return;
      }
      if (onExploreHubClick) {
        onExploreHubClick();
        return;
      }
    }
    if (onNavigate) {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-200 ${
        isScrolled
          ? 'border-b border-slate-200 shadow-[0_4px_16px_rgba(16,19,45,0.06)]'
          : 'border-b border-slate-100'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2 sm:gap-5 lg:gap-8">
          {/* Mobile Left Cluster: Hamburger Menu + Brand Wordmark (< md) */}
          <div className="flex md:hidden items-center gap-1.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
              className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-1 flex items-center justify-center rounded-xl text-[#10132D] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#10132D]" />
              ) : (
                <Menu className="w-5 h-5 text-[#10132D]" />
              )}
            </button>

            <a
              href={isLoggedIn ? '#/home' : '#home'}
              onClick={handleLogoClick}
              aria-label={isLoggedIn ? 'Go to Campus Connect Student Home' : 'Campus Connect Home'}
              className="inline-flex items-center min-w-0 max-w-full rounded-xl py-1 pr-1 transition-opacity duration-150 hover:opacity-85 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
            >
              <Logo size="sm" variant="light" iconShape="circle" showWordmark={true} />
            </a>
          </div>

          {/* Mobile Right Cluster: Real Notification Bell + Student Initials (Authenticated) OR Clean Log In (Guest) */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            {isLoggedIn ? (
              <>
                <NotificationBellCenter
                  notifications={notifications}
                  onMarkAsRead={onMarkNotificationRead || (() => {})}
                  onMarkAllRead={onMarkAllNotificationsRead || (() => {})}
                  onDeleteNotification={onDeleteNotification || (() => {})}
                  onClearAllNotifications={onClearAllNotifications || (() => {})}
                  onNavigateNotification={
                    onNavigateNotification ||
                    (() => {
                      if (onExploreHubClick) onExploreHubClick();
                    })
                  }
                  onOpenNotificationSettings={
                    onOpenNotificationSettings ||
                    (() => {
                      if (onExploreHubClick) onExploreHubClick();
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onExploreHubClick) onExploreHubClick();
                  }}
                  aria-label="Open Student Dashboard"
                  title="Open Student Dashboard"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] active:scale-[0.96] transition-transform"
                >
                  <StudentInitialsAvatar
                    fullName={userName}
                    email={userEmail}
                    size="md"
                    className="w-9 h-9 text-xs"
                  />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold text-[#6846F5] hover:bg-[#F3F0FF] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
              >
                Log In
              </button>
            )}
          </div>

          {/* Desktop & Tablet Zone 1: Brand Wordmark on Far Left */}
          <div className="hidden md:flex items-center shrink-0">
            <a
              href={isLoggedIn ? '#/home' : '#home'}
              onClick={handleLogoClick}
              aria-label={isLoggedIn ? 'Go to Campus Connect Student Home' : 'Campus Connect Home'}
              className="inline-flex items-center rounded-xl p-1 -m-1 transition-opacity duration-150 hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
            >
              <Logo size="sm" variant="light" iconShape="circle" showWordmark={true} />
            </a>
          </div>

          {/* Zone 2: Navigation Links Across Top (Desktop & Tablet) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-4 lg:gap-8"
          >
            {defaultNavLinks.map((link) => {
              const isActive = activeLinkId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-xs lg:text-[13px] font-medium transition-colors duration-150 py-1.5 relative whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] rounded ${
                    isActive
                      ? 'text-[#5D35F5] font-semibold'
                      : 'text-[#475569] hover:text-[#10132D]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6846F5] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions on Far Right (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <NotificationBellCenter
                  notifications={notifications}
                  onMarkAsRead={onMarkNotificationRead || (() => {})}
                  onMarkAllRead={onMarkAllNotificationsRead || (() => {})}
                  onDeleteNotification={onDeleteNotification || (() => {})}
                  onClearAllNotifications={onClearAllNotifications || (() => {})}
                  onNavigateNotification={
                    onNavigateNotification ||
                    (() => {
                      if (onExploreHubClick) onExploreHubClick();
                    })
                  }
                  onOpenNotificationSettings={
                    onOpenNotificationSettings ||
                    (() => {
                      if (onExploreHubClick) onExploreHubClick();
                    })
                  }
                />

                {onExploreHubClick && (
                  <button
                    type="button"
                    onClick={onExploreHubClick}
                    className="text-xs font-semibold text-white bg-[#6846F5] hover:bg-[#5835E5] px-2.5 lg:px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-[0_2px_10px_rgba(104,70,245,0.3)] cursor-pointer whitespace-nowrap"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#E7B75C]" />
                    <span className="hidden lg:inline">Open Student Hub</span>
                    <span className="lg:hidden">Student Hub</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <StudentInitialsAvatar fullName={userName} email={userEmail} size="sm" />
                  <span className="hidden lg:inline text-xs text-[#10132D] font-semibold truncate max-w-[120px]">
                    {userName || userEmail}
                  </span>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-1.5 py-1 whitespace-nowrap"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-xs lg:text-[13px] font-semibold text-[#10132D] hover:text-[#5D35F5] border border-slate-300 hover:border-[#6846F5] bg-white transition-colors duration-150 py-1.5 px-3 lg:px-5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer whitespace-nowrap"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={onGetStartedClick}
                  className="bg-gradient-to-r from-[#5B2EE6] via-[#6846F5] to-[#7B3FE4] hover:from-[#4E23D4] hover:to-[#6B31D6] text-white shadow-[0_4px_14px_rgba(91,46,230,0.3)] px-3 lg:px-5 py-1.5 rounded-full text-xs lg:text-[13px] font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer whitespace-nowrap"
                >
                  Create Free Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden fixed inset-x-0 top-14 bottom-0 z-40 bg-white border-t border-slate-100 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col justify-between overscroll-contain pb-safe"
        >
          <div className="px-4 py-4 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 pb-2">
              Menu Navigation
            </div>

            {defaultNavLinks.map((link) => {
              const isActive = activeLinkId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`flex items-center justify-between w-full p-3.5 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F3F0FF] text-[#6846F5] font-semibold border border-[#E6DFFF]'
                      : 'text-[#10132D] hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-[#6846F5]' : 'text-slate-400'}`}>
                      {link.icon}
                    </span>
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              );
            })}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="p-4 border-t border-slate-100 bg-[#F8F9FD] space-y-2.5">
            {isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onExploreHubClick) onExploreHubClick();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  Open Student Hub
                </Button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-3 text-center text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Log Out of Scholar Account
                  </button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onGetStartedClick) onGetStartedClick();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  Get Started Free
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onLoginClick) onLoginClick();
                  }}
                  className="w-full py-3 text-center text-sm font-semibold text-[#10132D] hover:text-[#6846F5] transition-colors rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#6846F5]" />
                  Log In to Scholar Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
