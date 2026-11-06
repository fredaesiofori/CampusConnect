/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Lock, Sparkles, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CountrySelect } from '../ui/CountrySelect';

export interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  searchContext?: { query?: string; destination?: string } | null;
  onSuccess?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  searchContext,
  onSuccess,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Ghana');

  // Handle Escape key to dismiss modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#15152F]/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-7 md:p-8 animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#15152F]">
              {mode === 'login' ? 'Welcome Back!' : 'Account Initialized!'}
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {mode === 'login'
                ? `Logged in as ${email || 'scholar@university.edu'}. Your private directory of universities, waivers, and funding is unlocked.`
                : `Welcome ${fullName || 'Scholar'}, your profile is set up. You now have full access to accredited universities, $0 application fees, and SAT waivers.`}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  if (onSuccess) {
                    onSuccess(email || (fullName ? `${fullName.toLowerCase().replace(/\s+/g, '.')}@scholar.edu` : 'scholar@campusconnect.edu'));
                  }
                  handleReset();
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Enter Student Hub &amp; Directory
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6846F5]">
                {mode === 'login'
                  ? 'Scholar Access'
                  : searchContext
                  ? 'Private Student Access'
                  : 'Create Free Account'}
              </span>
              <h3 id="auth-modal-title" className="text-2xl font-bold font-display text-[#15152F] mt-1">
                {mode === 'login'
                  ? 'Log In to Campus Connect'
                  : searchContext
                  ? 'Create an Account to View Matches'
                  : 'Begin Your Scholarship Journey'}
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {mode === 'login'
                  ? 'Access your saved international scholarships and application progress.'
                  : searchContext
                  ? `Create your free account to unlock verified scholarship listings matching "${searchContext.query || 'your field'}" in ${searchContext.destination || 'global destinations'}.`
                  : 'Join ambitious scholars across Africa finding fully funded international programs.'}
              </p>

              {/* Private Student Dashboard Highlights Callout when triggered by search or signup */}
              {mode === 'signup' && searchContext && (
                <div className="mt-3.5 p-3 rounded-xl bg-[#F0EDFF] border border-[#DDD6FE] text-xs text-[#15152F] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#6846F5]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked in your student dashboard:</span>
                  </div>
                  <ul className="text-[11px] text-[#4B5563] space-y-1 pl-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6846F5] shrink-0" />
                      <span>Find &amp; filter scholarships by country, degree level, and category</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6846F5] shrink-0" />
                      <span>View verified eligibility requirements, funding coverage, and deadlines</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6846F5] shrink-0" />
                      <span>Save favourite scholarships and track your applications</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Kwame Mensah"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {mode === 'signup' && (
                <CountrySelect
                  id="auth-signup-country"
                  label="Country of Origin / Citizenship"
                  value={country}
                  onChange={setCountry}
                  required
                />
              )}

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                required
              />

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {mode === 'login'
                    ? 'Log In'
                    : searchContext
                    ? 'Create Free Account & View Matches'
                    : 'Create Free Account'}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('signup')}
                    className="font-semibold text-[#6846F5] hover:underline cursor-pointer"
                  >
                    Get Started Free
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="font-semibold text-[#6846F5] hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
