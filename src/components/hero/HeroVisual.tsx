/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface HeroVisualProps {
  className?: string;
  imageSrc?: string;
  altText?: string;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({
  className = '',
  imageSrc = '/assets/aistudio/Proud_Graduate_with_Diploma_and_Books_e327ce0d.png',
  altText = 'Proud graduate in black graduation cap and gown holding diploma and books',
}) => {
  return (
    <div
      className={`relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[520px] xl:h-[550px] max-h-[560px] flex items-center justify-center md:justify-end overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute -top-10 -right-10 w-72 h-72 bg-[#8065FF]/15 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-8 right-12 w-64 h-64 bg-[#6846F5]/10 rounded-full blur-2xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Graduate Portrait Container */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-l-none">
        {/* Exact uploaded photograph */}
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
          loading="eager"
          decoding="async"
        />

        {/* Soft top gradient blend for stacked mobile view */}
        <div
          className="absolute inset-x-0 top-0 h-12 sm:h-16 md:hidden bg-gradient-to-b from-[#10132D] via-[#10132D]/70 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Natural soft dark gradient blending transition along the LEFT edge on tablet/desktop */}
        <div
          className="hidden md:block absolute inset-y-0 left-0 w-24 sm:w-32 md:w-36 lg:w-48 bg-gradient-to-r from-[#10132D] via-[#10132D]/70 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Subtle bottom fade to blend smoothly into hero base */}
        <div
          className="absolute inset-x-0 bottom-0 h-14 sm:h-16 lg:h-20 bg-gradient-to-t from-[#10132D] via-[#10132D]/60 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Stylized Handwritten Accent Text: "More Opportunities, Bigger Dreams" */}
        <div
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-5 sm:-translate-y-8 md:-translate-y-12 z-20 pointer-events-none select-none text-right"
          aria-hidden="true"
        >
          <p
            style={{ fontFamily: "'Caveat', cursive" }}
            className="text-base sm:text-2xl lg:text-[2rem] text-white/95 font-bold leading-[1.1] rotate-[-5deg] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-wide"
          >
            &lsquo;More<br />
            Opportunities,<br />
            Bigger Dreams&rsquo;
          </p>
          {/* Violet brush curve accent underneath */}
          <svg
            className="w-16 sm:w-22 lg:w-28 ml-auto mt-1 opacity-85 drop-shadow-[0_2px_8px_rgba(128,101,255,0.4)]"
            viewBox="0 0 120 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12C36 4 84 4 116 11"
              stroke="#8065FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
