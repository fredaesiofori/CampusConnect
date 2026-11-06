/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Compass, HelpCircle, Info, LogIn, ShieldCheck } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';

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
  isLoggedIn?: boolean;
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

export const defaultNavLinks: NavLinkItem[] = [
  { id: 'opportunities', label: 'Universities & Waivers', href: '#opportunities', icon: <Compass className="w-4 h-4" /> },
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
  isLoggedIn = false,
  userEmail,
  userName,
  onLogout,
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
    if (onNavigate) {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#10132D] transition-all duration-200 ${
        isScrolled
          ? 'border-b border-[#20254D] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'border-b border-[#1E234A]'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-6 lg:gap-8">
          {/* Zone 1: Brand Wordmark on Far Left */}
          <div className="flex items-center shrink-0">
            <a
              href="#home"
              onClick={handleLogoClick}
              aria-label="Campus Connect Home"
              className="inline-flex items-center rounded-xl p-1 -m-1 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF]"
            >
              <Logo size="md" variant="dark" showWordmark={true} />
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
                  className={`text-xs lg:text-sm font-medium transition-colors duration-150 py-1.5 lg:py-2 relative whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] rounded ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8065FF] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions on Far Right (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-4 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {onExploreHubClick && (
                  <button
                    type="button"
                    onClick={onExploreHubClick}
                    className="text-xs font-semibold text-white bg-[#6846F5] hover:bg-[#5835E5] px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-[0_2px_10px_rgba(104,70,245,0.4)] cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#E7B75C]" />
                    <span>Open Student Hub</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-1 border-l border-[#20254D]">
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
                    {userName || userEmail}
                  </span>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="text-xs text-slate-400 hover:text-rose-300 transition-colors cursor-pointer px-1 py-1"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* "Log In" Link */}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150 py-1.5 px-2.5 lg:py-2 lg:px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer"
                >
                  Log In
                </button>

                {/* Violet "Get Started Free →" Button */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onGetStartedClick}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-[0_4px_16px_rgba(104,70,245,0.4)] px-3.5 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#2D336B] bg-[#161B3D] text-white hover:bg-[#1F2552] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden fixed inset-x-0 top-16 sm:top-18 md:top-20 bottom-0 z-40 bg-[#10132D]/98 backdrop-blur-xl border-t border-[#20254D] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col justify-between overscroll-contain pb-safe"
        >
          <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Menu Navigation
            </div>

            {defaultNavLinks.map((link) => {
              const isActive = activeLinkId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`flex items-center justify-between w-full p-3.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8065FF]/15 text-[#C4B5FD] font-semibold border border-[#8065FF]/30'
                      : 'text-slate-200 hover:bg-[#181D42] active:bg-[#1E2452]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-[#8065FF]' : 'text-slate-400'}`}>
                      {link.icon}
                    </span>
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </a>
              );
            })}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="p-4 sm:p-6 border-t border-[#20254D] bg-[#0C0E24] space-y-3">
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
                    className="w-full py-3 text-center text-sm font-semibold text-rose-300 hover:text-rose-200 transition-colors rounded-xl border border-rose-900/40 bg-rose-950/20 flex items-center justify-center gap-2"
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
                  className="w-full py-3 text-center text-sm font-semibold text-slate-200 hover:text-white transition-colors rounded-xl border border-[#2D336B] bg-[#161B3D] flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
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
