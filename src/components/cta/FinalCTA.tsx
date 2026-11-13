/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export interface FinalCTAProps {
  onCreateAccountClick?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onCreateAccountClick,
  onLoginClick,
  className = '',
}) => {
  return (
    <section
      id="cta"
      aria-label="Call to Action"
      className={`relative w-full overflow-hidden bg-[#15152F] py-14 sm:py-20 lg:py-24 text-white ${className}`}
    >
      {/* Restrained decorative background shapes with high-contrast accessibility */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        aria-hidden="true"
      >
        {/* Soft radial glow centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#6846F5]/25 to-[#E7B75C]/10 blur-3xl" />
        {/* Subtle geometric ring */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/5" />
      </div>

      <Container size="lg" className="relative z-10 text-center">
        {/* Restrained Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wider uppercase text-[#DDD6FE] mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#E7B75C]" />
          <span>START YOUR JOURNEY</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
          Your next opportunity starts here.
        </h2>

        {/* Supporting Text */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#DDD6FE] max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
          Create your free student account to explore universities worldwide, compare undergraduate and postgraduate admissions, discover scholarships and waiver options, and track your applications with COVA AI.
        </p>

        {/* Action Controls */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onCreateAccountClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-[0_4px_20px_rgba(104,70,245,0.45)] hover:shadow-[0_6px_24px_rgba(104,70,245,0.6)]"
          >
            Create Your Free Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onLoginClick}
            leftIcon={<LogIn className="w-4 h-4" />}
            className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white focus-visible:ring-white"
          >
            Log In to Your Account
          </Button>
        </div>

        {/* Reassurance Signals */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>Universities Worldwide</span>
          </div>
          <span className="hidden sm:inline text-white/20">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>Fee Waiver &amp; Test-Optional Filters</span>
          </div>
          <span className="hidden sm:inline text-white/20">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>Application Planning &amp; COVA AI</span>
          </div>
        </div>
      </Container>
    </section>
  );
};
