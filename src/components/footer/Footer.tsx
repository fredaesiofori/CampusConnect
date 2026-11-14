/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Logo } from '../brand/Logo';
import { Container } from '../ui/Container';

export interface FooterProps {
  onNavigateSection?: (href: string, label: string) => void;
  onPlaceholderClick?: (title: string, description: string) => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onPlaceholderClick,
  onLoginClick,
  onSignUpClick,
  onLogoClick,
  className = '',
}) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      if (onNavigateSection) {
        onNavigateSection(href, label);
      }
    }
  };

  const handlePlaceholder = (e: React.MouseEvent, title: string, description: string) => {
    e.preventDefault();
    if (onPlaceholderClick) {
      onPlaceholderClick(title, description);
    }
  };

  return (
    <footer
      aria-label="Campus Connect Footer"
      className={`bg-[#0F0F23] text-[#94A3B8] border-t border-[#1F1F3D] pt-12 sm:pt-16 pb-8 sm:pb-12 ${className}`}
    >
      <Container size="xl">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-[#1F1F3D]">
          {/* Brand & Mission Column (Full on mobile/tablet, 5 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <a
              href={onLogoClick ? '#/dashboard' : '#home'}
              onClick={(e) => {
                e.preventDefault();
                if (onLogoClick) {
                  onLogoClick();
                  return;
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={onLogoClick ? 'Go to Campus Connect Student Dashboard' : 'Campus Connect Home'}
              className="inline-block transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Logo size="md" variant="dark" showWordmark={true} />
            </a>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Helping students worldwide discover accredited universities, explore undergraduate and postgraduate admissions, compare fee-waiver and test-optional pathways, find scholarships, and organize their applications with clarity.
            </p>

            {/* Social Media Placeholders with explicit advisory */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#64748B] mb-2.5">
                Official Channels
              </span>
              <div className="flex items-center gap-2.5">
                {/* Official WhatsApp Channel */}
                <a
                  href="https://whatsapp.com/channel/0029Vb8fEmFIXnllw16FPk2y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1B1B3A] border border-[#2D2D56] text-[#DDD6FE] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  title="CampusConnect 🎓📚 on WhatsApp"
                  aria-label="Follow CampusConnect on WhatsApp"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M17.507 14.307l-.009.075c-2.199-1.096-2.429-1.242-2.713-.82-.203.301-.787 1.011-.963 1.217-.177.206-.353.228-.658.076-.305-.152-1.288-.474-2.454-1.514-.908-.81-1.521-1.812-1.7-2.117-.179-.305-.019-.47.133-.622.137-.137.305-.356.458-.534.153-.178.204-.305.305-.51.102-.203.051-.38-.025-.533-.076-.153-.687-1.654-.94-2.264-.247-.595-.497-.514-.686-.523-.178-.009-.381-.01-.585-.01-.203 0-.534.076-.814.381-.28.305-1.067 1.042-1.067 2.542 0 1.5 1.092 2.946 1.245 3.149.153.203 2.148 3.28 5.203 4.602.727.314 1.295.502 1.738.643.73.232 1.394.199 1.919.123.585-.085 1.804-.737 2.058-1.448.254-.712.254-1.322.178-1.449-.076-.127-.279-.203-.584-.355zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.93.55 3.73 1.5 5.27L2 22l4.88-1.45a9.98 9.98 0 0 0 5.16 1.45c5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.25c-1.6 0-3.1-.45-4.4-1.24l-.31-.19-3.26.97.97-3.17-.2-.33a8.17 8.17 0 0 1-1.25-4.27c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25z"/>
                  </svg>
                </a>

                {/* Official Facebook Page */}
                <a
                  href="https://www.facebook.com/share/1FAKxcXvNF/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1B1B3A] border border-[#2D2D56] text-[#DDD6FE] hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
                  title="Visit Campus Connect on Facebook"
                  aria-label="Visit Campus Connect on Facebook"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {[
                  { name: 'LinkedIn', label: 'in' },
                  { name: 'X / Twitter', label: '𝕏' },
                  { name: 'YouTube', label: 'yt' },
                  { name: 'Instagram', label: 'ig' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={(e) =>
                      handlePlaceholder(
                        e,
                        `${item.name} Channel`,
                        `Campus Connect's official ${item.name} channel will launch with our public scholar network.`
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-[#1B1B3A] border border-[#2D2D56] text-xs font-semibold text-[#DDD6FE] hover:text-white hover:bg-[#6846F5] hover:border-[#6846F5] transition-all flex items-center justify-center cursor-pointer"
                    title={`${item.name} (Official channel launching soon)`}
                    aria-label={`Official ${item.name} channel placeholder`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Quick Navigation Links (1 col on tablet, 3 cols on lg) */}
          <div className="sm:col-span-1 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, '#how-it-works', 'How It Works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  onClick={(e) => handleLinkClick(e, '#benefits', 'Platform Benefits')}
                  className="hover:text-white transition-colors"
                >
                  Platform Benefits
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleLinkClick(e, '#faq', 'Frequently Asked Questions')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSignUpClick && onSignUpClick()}
                  className="hover:text-white transition-colors text-left"
                >
                  Create Free Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLoginClick && onLoginClick()}
                  className="hover:text-white transition-colors text-left"
                >
                  Log In
                </button>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) =>
                    handlePlaceholder(
                      e,
                      'About Campus Connect',
                      'Campus Connect is a global university, admissions, and educational opportunities platform. We help students discover accredited institutions worldwide, review undergraduate and postgraduate requirements, explore fee waivers, test-optional options, and scholarships, and track their applications.'
                    )
                  }
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) =>
                    handlePlaceholder(
                      e,
                      'Scholar Support & Inquiries',
                      'Have questions or want to partner with us? Our team is available at support@campusconnect.edu (official portal inquiries).'
                    )
                  }
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Standards (1 col on tablet, 3 cols on lg) */}
          <div className="sm:col-span-1 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#privacy"
                  onClick={(e) =>
                    handlePlaceholder(
                      e,
                      'Privacy Policy',
                      'Campus Connect safeguards student data. We never sell your academic or profile information to third-party brokers. Data submitted during profile matching is used strictly to help match you with relevant universities, admissions pathways, and scholarship opportunities.'
                    )
                  }
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) =>
                    handlePlaceholder(
                      e,
                      'Terms of Use',
                      'Campus Connect is an informational discovery and application planning platform. All university admissions, fee waivers, and scholarship decisions are made directly by host universities and awarding organizations.'
                    )
                  }
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#trust-transparency"
                  onClick={(e) => handleLinkClick(e, '#trust-transparency', 'Transparency Standards')}
                  className="hover:text-white transition-colors"
                >
                  Transparency Standards
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Dynamic Copyright & Clean Standards */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#64748B] text-center sm:text-left">
          <div>
            © {currentYear} Campus Connect. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-xs">
            <span>Built for Students Worldwide</span>
            <span className="hidden sm:inline">·</span>
            <span>Global University &amp; Opportunity Directory</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
