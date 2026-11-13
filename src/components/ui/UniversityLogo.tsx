/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { OpportunityItem, UniversityLogo as LogoData } from '../../data/opportunities';

export interface UniversityLogoProps {
  item?: OpportunityItem;
  logo?: LogoData;
  officialName?: string;
  shortName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showVerifiedShield?: boolean;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  item,
  logo,
  officialName: propOfficialName,
  shortName: propShortName,
  size = 'md',
  className = '',
  showVerifiedShield = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const effectiveLogo: LogoData | undefined = logo || item?.logo;
  const officialName = propOfficialName || item?.officialName || item?.institution || 'University';
  const shortName = propShortName || item?.shortName || '';
  const isVerified = item?.isVerified ?? false;

  // Determine monogram / initials fallback
  const monogram =
    effectiveLogo?.monogram ||
    (shortName ? shortName.slice(0, 4) : officialName.split(/\s+/).map((w) => w[0]).join('').slice(0, 3)).toUpperCase();

  const logoUrl = effectiveLogo?.logoUrl;

  const sizeClasses = {
    xs: 'w-7 h-7 min-w-[28px] text-[10px] rounded-lg',
    sm: 'w-9 h-9 min-w-[36px] text-xs rounded-xl',
    md: 'w-11 h-11 min-w-[44px] text-sm rounded-xl',
    lg: 'w-14 h-14 min-w-[56px] text-base rounded-2xl',
    xl: 'w-16 h-16 min-w-[64px] text-lg rounded-2xl',
  }[size];

  const imgPadding = {
    xs: 'p-0.5',
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
    xl: 'p-2.5',
  }[size];

  const shieldSize = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  }[size];

  // If a valid official logo URL exists and has not encountered an error, display the official crest/seal
  if (logoUrl && !hasError) {
    return (
      <div
        className={`relative ${sizeClasses} bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        title={`Official Crest / Seal: ${officialName}`}
      >
        <img
          src={logoUrl}
          alt={`${officialName} official crest`}
          className={`w-full h-full object-contain ${imgPadding}`}
          loading="lazy"
          onError={() => setHasError(true)}
        />
        {showVerifiedShield && isVerified && (
          <span
            className="absolute -top-0.5 -right-0.5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-1 ring-white shadow-xs p-0.5"
            title="Verified Official Institution"
          >
            <ShieldCheck className={shieldSize} />
          </span>
        )}
      </div>
    );
  }

  // Clean, neutral institutional placeholder with monogram and official institutional colors
  const bgColor = effectiveLogo?.bg || '#0F2C59';
  const textColor = effectiveLogo?.text || '#FFFFFF';

  return (
    <div
      className={`relative ${sizeClasses} shadow-2xs flex flex-col items-center justify-center shrink-0 border border-slate-200/80 select-none overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      title={`${officialName} (Official Crest Pending Verification)`}
    >
      <span className="font-bold font-mono tracking-wider leading-none text-center px-0.5 truncate max-w-full">
        {monogram}
      </span>
      {showVerifiedShield && isVerified && (
        <span
          className="absolute -top-0.5 -right-0.5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-1 ring-white shadow-xs p-0.5"
          title="Verified Institution Record"
        >
          <ShieldCheck className={shieldSize} />
        </span>
      )}
    </div>
  );
};

export interface UniversityCrestCardImageProps {
  item: OpportunityItem;
  variant?: 'cover' | 'thumbnail' | 'banner';
  className?: string;
  countryBadge?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const UniversityCrestCardImage: React.FC<UniversityCrestCardImageProps> = ({
  item,
  variant = 'thumbnail',
  className = '',
  countryBadge,
  actionButton,
}) => {
  const [hasError, setHasError] = useState(false);
  const officialName = item.officialName || item.institution || 'University';
  const shortName = item.shortName || '';
  const logoUrl = item.logo?.logoUrl;
  const monogram =
    item.logo?.monogram ||
    (shortName ? shortName.slice(0, 4) : officialName.split(/\s+/).map((w) => w[0]).join('').slice(0, 3)).toUpperCase();

  const bgColor = item.logo?.bg || '#0F2C59';
  const textColor = item.logo?.text || '#FFFFFF';

  // Sizing by variant
  const containerClasses = {
    thumbnail:
      'relative w-full sm:w-44 md:w-48 h-36 sm:h-32 rounded-xl overflow-hidden bg-slate-50/90 border border-slate-200/80 shadow-2xs shrink-0 flex items-center justify-center p-3.5 group',
    cover:
      'relative h-40 sm:h-44 w-full overflow-hidden bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-center p-4 group',
    banner:
      'relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-b from-slate-900 via-[#10132D] to-slate-900 border-b border-slate-800 flex items-center justify-center p-6',
  }[variant];

  const imgClasses = {
    thumbnail:
      'max-h-24 max-w-[85%] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105',
    cover:
      'max-h-24 sm:max-h-28 max-w-[70%] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105',
    banner:
      'max-h-32 sm:max-h-36 max-w-[80%] w-auto h-auto object-contain drop-shadow-md',
  }[variant];

  const placeholderMonogramSize = {
    thumbnail: 'text-2xl',
    cover: 'text-3xl',
    banner: 'text-4xl',
  }[variant];

  const hasValidCrest = Boolean(logoUrl) && !hasError;

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Top badges / actions overlay */}
      {(countryBadge || actionButton) && (
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="pointer-events-auto">{countryBadge}</div>
          <div className="pointer-events-auto">{actionButton}</div>
        </div>
      )}

      {hasValidCrest ? (
        variant === 'banner' ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-center max-w-[280px] max-h-36 border border-white/20">
            <img
              src={logoUrl}
              alt={`${officialName} official crest`}
              className="max-h-24 sm:max-h-28 max-w-full w-auto h-auto object-contain"
              loading="lazy"
              onError={() => setHasError(true)}
            />
          </div>
        ) : (
          <img
            src={logoUrl}
            alt={`${officialName} official crest`}
            className={imgClasses}
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )
      ) : (
        /* Neutral Monogram Placeholder with University Initials per Requirement 6 */
        <div
          className="w-full h-full rounded-lg flex flex-col items-center justify-center p-3 select-none text-center shadow-inner relative overflow-hidden"
          style={{ backgroundColor: variant === 'banner' ? '#1E293B' : bgColor, color: textColor }}
          title={`${officialName} (Official Crest Pending Verification)`}
        >
          <span className={`font-black font-mono tracking-widest ${placeholderMonogramSize} leading-none`}>
            {monogram}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-1.5 truncate max-w-[90%]">
            {shortName || officialName}
          </span>
          <span className="text-[9px] opacity-70 mt-0.5 font-medium tracking-tight">
            Accredited Institution
          </span>
        </div>
      )}
    </div>
  );
};
