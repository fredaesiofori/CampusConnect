/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';
import { Globe } from 'lucide-react';
import * as Flags3x2 from 'country-flag-icons/react/3x2';
import { getCountryByCode, getCountryByName } from '../../data/countries';

export type DestinationFlagCode = 'CA' | 'GB' | 'US' | 'AU' | 'DE';

export interface CountryFlagProps {
  code?: string | null;
  country?: string | null;
  className?: string;
  title?: string;
}

export interface CountryFlagSvgProps {
  code: DestinationFlagCode | string;
  country?: string | null;
  className?: string;
  title?: string;
}

const COUNTRY_ALIAS_TO_ISO: Record<string, string> = {
  uk: 'GB',
  'u.k.': 'GB',
  'united kingdom': 'GB',
  britain: 'GB',
  'great britain': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  us: 'US',
  usa: 'US',
  'u.s.': 'US',
  'u.s.a.': 'US',
  'united states': 'US',
  'united states of america': 'US',
  uae: 'AE',
  'u.a.e.': 'AE',
  'united arab emirates': 'AE',
  'south korea': 'KR',
  'republic of korea': 'KR',
  'north korea': 'KP',
  'ivory coast': 'CI',
  "cote d'ivoire": 'CI',
  "côte d'ivoire": 'CI',
  drc: 'CD',
  'congo (drc)': 'CD',
  'democratic republic of the congo': 'CD',
  'congo (brazzaville)': 'CG',
  'republic of the congo': 'CG',
  'czech republic': 'CZ',
  czechia: 'CZ',
  russia: 'RU',
  'russian federation': 'RU',
  turkey: 'TR',
  türkiye: 'TR',
  vietnam: 'VN',
  'viet nam': 'VN',
  taiwan: 'TW',
  'hong kong': 'HK',
  macao: 'MO',
  macau: 'MO',
  palestine: 'PS',
  'vatican city': 'VA',
  'holy see': 'VA',
  eswatini: 'SZ',
  swaziland: 'SZ',
  'cabo verde': 'CV',
  'cape verde': 'CV',
  'timor-leste': 'TL',
  'east timor': 'TL',
  brunei: 'BN',
  laos: 'LA',
  syria: 'SY',
  iran: 'IR',
  moldova: 'MD',
  tanzania: 'TZ',
  bolivia: 'BO',
  venezuela: 'VE',
};

const FLAG_REGISTRY = Flags3x2 as Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
>;

/**
 * Resolves any ISO-2 code, common code alias (e.g. UK -> GB), country name, or nationality
 * to its canonical uppercase ISO 3166-1 alpha-2 code.
 */
export function resolveCountryIsoCode(
  code?: string | null,
  country?: string | null
): string | null {
  const rawCode = (code || '').trim();
  if (rawCode) {
    const lowerCode = rawCode.toLowerCase();
    if (COUNTRY_ALIAS_TO_ISO[lowerCode]) {
      return COUNTRY_ALIAS_TO_ISO[lowerCode];
    }
    const upperCode = rawCode.toUpperCase();
    if (FLAG_REGISTRY[upperCode]) {
      return upperCode;
    }
    const byCode = getCountryByCode(upperCode);
    if (byCode) {
      return byCode.code.toUpperCase();
    }
  }

  const rawCountry = (country || '').trim();
  if (rawCountry) {
    const lowerCountry = rawCountry.toLowerCase();
    if (COUNTRY_ALIAS_TO_ISO[lowerCountry]) {
      return COUNTRY_ALIAS_TO_ISO[lowerCountry];
    }
    const byName = getCountryByName(rawCountry);
    if (byName) {
      return byName.code.toUpperCase();
    }
    const upperCountry = rawCountry.toUpperCase();
    if (FLAG_REGISTRY[upperCountry]) {
      return upperCountry;
    }
  }

  return null;
}

const US_STAR_ROWS = [
  { count: 6, y: 12, startX: 16, stepX: 32 },
  { count: 5, y: 24, startX: 32, stepX: 32 },
  { count: 6, y: 36, startX: 16, stepX: 32 },
  { count: 5, y: 48, startX: 32, stepX: 32 },
  { count: 6, y: 60, startX: 16, stepX: 32 },
  { count: 5, y: 72, startX: 32, stepX: 32 },
  { count: 6, y: 84, startX: 16, stepX: 32 },
  { count: 5, y: 96, startX: 32, stepX: 32 },
  { count: 6, y: 108, startX: 16, stepX: 32 },
];

function buildStarPath(cx: number, cy: number, points: number, outerR: number, innerR: number): string {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    coords.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${coords.join(' ')} Z`;
}

/**
 * Centralized, locally bundled SVG CountryFlag component supporting all countries
 * in Campus Connect without OS/browser flag emoji fallback ("GB", "US", "CA", "AU", "DE").
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  country,
  className = 'w-5 h-[14px] rounded-[2px] shadow-2xs ring-1 ring-black/10 overflow-hidden shrink-0',
  title,
}) => {
  const uid = useId();
  const gbClipId = `${uid}-gb-clip`;
  const gbDiagId = `${uid}-gb-diag`;
  const auClipId = `${uid}-au-clip`;
  const auDiagId = `${uid}-au-diag`;

  const resolvedCode = resolveCountryIsoCode(code, country);

  if (resolvedCode === 'CA') {
    return (
      <svg
        viewBox="0 0 96 64"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {title && <title>{title}</title>}
        <rect width="96" height="64" fill="#FFFFFF" />
        <rect width="24" height="64" fill="#D80621" />
        <rect x="72" width="24" height="64" fill="#D80621" />
        <path
          fill="#D80621"
          d="M48 11.5L44.2 19L39.3 17.5L41.6 28.4L34.7 22.8L33.5 26L27.5 25L29.2 30.8L26.5 32.5L36.2 40.3L34.8 43.8L46.3 42.3L46 53.5H50L49.7 42.3L61.2 43.8L59.8 40.3L69.5 32.5L66.8 30.8L68.5 25L62.5 26L61.3 22.8L54.4 28.4L56.7 17.5L51.8 19L48 11.5Z"
        />
      </svg>
    );
  }

  if (resolvedCode === 'GB') {
    return (
      <svg
        viewBox="0 0 60 40"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {title && <title>{title}</title>}
        <clipPath id={gbClipId}>
          <rect width="60" height="40" />
        </clipPath>
        <clipPath id={gbDiagId}>
          <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
        </clipPath>
        <g clipPath={`url(#${gbClipId})`}>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
          <path
            d="M0,0 L60,40 M60,0 L0,40"
            clipPath={`url(#${gbDiagId})`}
            stroke="#C8102E"
            strokeWidth="4.6"
          />
          <path d="M30,0 v40 M0,20 h60" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7.2" />
        </g>
      </svg>
    );
  }

  if (resolvedCode === 'US') {
    return (
      <svg
        viewBox="0 0 494 325"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {title && <title>{title}</title>}
        <rect width="494" height="325" fill="#FFFFFF" />
        {[0, 2, 4, 6, 8, 10, 12].map((idx) => (
          <rect
            key={idx}
            y={idx * 25}
            width="494"
            height="25"
            fill="#B22234"
          />
        ))}
        <rect width="198" height="175" fill="#3C3B6E" />
        <g fill="#FFFFFF">
          {US_STAR_ROWS.map((row, rowIdx) =>
            Array.from({ length: row.count }, (_, colIdx) => {
              const cx = row.startX + colIdx * row.stepX;
              const cy = row.y * 1.45;
              return (
                <path
                  key={`${rowIdx}-${colIdx}`}
                  d={buildStarPath(cx, cy, 5, 7.2, 2.9)}
                />
              );
            })
          )}
        </g>
      </svg>
    );
  }

  if (resolvedCode === 'AU') {
    return (
      <svg
        viewBox="0 0 90 60"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {title && <title>{title}</title>}
        <clipPath id={auClipId}>
          <rect width="45" height="30" />
        </clipPath>
        <clipPath id={auDiagId}>
          <path d="M22.5,15 h22.5 v15 z v15 h-22.5 z h-22.5 v-15 z v-15 h22.5 z" />
        </clipPath>
        <rect width="90" height="60" fill="#00008B" />
        {/* Union Jack Canton */}
        <g clipPath={`url(#${auClipId})`}>
          <rect width="45" height="30" fill="#012169" />
          <path d="M0,0 L45,30 M45,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
          <path
            d="M0,0 L45,30 M45,0 L0,30"
            clipPath={`url(#${auDiagId})`}
            stroke="#E4002B"
            strokeWidth="3.4"
          />
          <path d="M22.5,0 v30 M0,15 h45" stroke="#FFFFFF" strokeWidth="9" />
          <path d="M22.5,0 v30 M0,15 h45" stroke="#E4002B" strokeWidth="5.4" />
        </g>
        {/* Commonwealth Star */}
        <path d={buildStarPath(22.5, 45, 7, 8.2, 3.6)} fill="#FFFFFF" />
        {/* Southern Cross */}
        <path d={buildStarPath(67.5, 11, 7, 4.3, 1.9)} fill="#FFFFFF" />
        <path d={buildStarPath(57, 25, 7, 4.3, 1.9)} fill="#FFFFFF" />
        <path d={buildStarPath(78, 22, 7, 4.3, 1.9)} fill="#FFFFFF" />
        <path d={buildStarPath(67.5, 49, 7, 4.3, 1.9)} fill="#FFFFFF" />
        <path d={buildStarPath(72, 33, 5, 2.6, 1.1)} fill="#FFFFFF" />
      </svg>
    );
  }

  if (resolvedCode === 'DE') {
    return (
      <svg
        viewBox="0 0 60 36"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {title && <title>{title}</title>}
        <rect width="60" height="12" y="0" fill="#000000" />
        <rect width="60" height="12" y="12" fill="#DD0000" />
        <rect width="60" height="12" y="24" fill="#FFCE00" />
      </svg>
    );
  }

  const BundledFlag = resolvedCode ? FLAG_REGISTRY[resolvedCode] : undefined;
  if (BundledFlag) {
    return (
      <BundledFlag
        className={className}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      />
    );
  }

  return (
    <Globe
      className={`${className} text-slate-400`}
      aria-hidden="true"
      focusable="false"
    />
  );
};

export const CountryFlagSvg: React.FC<CountryFlagSvgProps> = ({
  code,
  country,
  className = 'w-11 h-8',
  title,
}) => <CountryFlag code={code} country={country} className={className} title={title} />;

