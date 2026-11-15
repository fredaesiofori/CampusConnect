/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Globe } from 'lucide-react';
import { ALL_COUNTRIES, Country, searchCountries } from '../../data/countries';

export interface CountrySelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  mode?: 'country' | 'nationality';
  placeholder?: string;
  allowAll?: boolean;
  allLabel?: string;
  allValue?: string;
  className?: string;
  buttonClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showFlag?: boolean;
  helperText?: string;
  error?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  id,
  label,
  value,
  onChange,
  mode = 'country',
  placeholder,
  allowAll = false,
  allLabel = 'All Countries 🌐',
  allValue = '',
  className = '',
  buttonClassName = '',
  required = false,
  disabled = false,
  showFlag = true,
  helperText,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtered countries based on search query
  const filteredCountries = useMemo(() => {
    return searchCountries(searchQuery);
  }, [searchQuery]);

  // Find currently selected country record
  const selectedCountry = useMemo(() => {
    if (!value || value === allValue) return null;
    const lower = value.trim().toLowerCase();
    return ALL_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === lower ||
        c.nationality.toLowerCase() === lower ||
        c.code.toLowerCase() === lower
    );
  }, [value, allValue]);

  // Display label on trigger button
  const displayLabel = useMemo(() => {
    if (allowAll && (!value || value === allValue)) {
      return allLabel;
    }
    if (selectedCountry) {
      if (mode === 'nationality') {
        return `${selectedCountry.nationality} ${selectedCountry.flag}`;
      }
      return `${selectedCountry.name} ${selectedCountry.flag}`;
    }
    if (value) {
      return value;
    }
    return placeholder || (mode === 'nationality' ? 'Select Nationality...' : 'Select Country...');
  }, [allowAll, value, allValue, allLabel, selectedCountry, mode, placeholder]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#10132D] mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6846F5]/20 ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'border-[#6846F5] bg-white text-[#10132D] ring-2 ring-[#6846F5]/20 shadow-sm'
            : 'border-[#CBD5E1] bg-white text-[#10132D] hover:border-[#6846F5]/70'
        } ${error ? 'border-rose-400 focus:border-rose-500' : ''} ${buttonClassName}`}
      >
        <span className="truncate flex items-center gap-2">
          {showFlag && selectedCountry?.flag && (
            <span className="text-base shrink-0 leading-none" aria-hidden="true">
              {selectedCountry.flag}
            </span>
          )}
          {!selectedCountry && allowAll && (!value || value === allValue) && (
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className={!value && !allowAll ? 'text-slate-400' : 'text-[#10132D]'}>
            {displayLabel}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#6846F5]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 w-full min-w-[265px] sm:min-w-[290px] mt-1.5 bg-white border border-[#CBD5E1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Search Box with explicit Close Button */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    mode === 'nationality'
                      ? 'Search nationality or country...'
                      : 'Search country name (e.g. Ghana)...'
                  }
                  className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#6846F5] text-[#10132D] placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-[#10132D] hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Close dropdown"
                aria-label="Close dropdown"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-slate-400">
              <span>{filteredCountries.length} countries available</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#6846F5] hover:underline cursor-pointer"
                >
                  Reset search
                </button>
              )}
            </div>
          </div>

          {/* List of Countries */}
          <div className="max-h-60 sm:max-h-72 overflow-y-auto divide-y divide-slate-50 overscroll-contain">
            {/* Allow All Option if requested */}
            {allowAll && !searchQuery && (
              <button
                type="button"
                role="option"
                aria-selected={!value || value === allValue}
                onClick={() => handleSelect(allValue)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  !value || value === allValue
                    ? 'bg-[#F0EDFF] text-[#6846F5] font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#6846F5]" />
                  <span>{allLabel}</span>
                </span>
                {(!value || value === allValue) && (
                  <Check className="w-4 h-4 text-[#6846F5] shrink-0" />
                )}
              </button>
            )}

            {filteredCountries.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-600">No matching country found</p>
                <p className="text-[11px]">Check spelling or try typing &ldquo;Ghana&rdquo;</p>
              </div>
            ) : (
              filteredCountries.map((c) => {
                const itemValue = mode === 'nationality' ? c.nationality : c.name;
                const isSelected =
                  value?.trim().toLowerCase() === itemValue.toLowerCase() ||
                  value?.trim().toLowerCase() === c.name.toLowerCase();

                return (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(itemValue)}
                    className={`w-full min-h-[42px] px-3.5 py-2.5 text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0EDFF] text-[#6846F5] font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base shrink-0 leading-none">{c.flag}</span>
                      <span className="truncate">
                        {mode === 'nationality' ? c.nationality : c.name}
                      </span>
                      {mode === 'nationality' && (
                        <span className="text-[11px] text-slate-400 shrink-0 font-normal">
                          ({c.name})
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#6846F5] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

// Multi-select component for study destinations supporting search across all 202 countries
export interface CountryMultiSelectProps {
  label?: string;
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  className?: string;
  maxFeatured?: number;
}

export const CountryMultiSelect: React.FC<CountryMultiSelectProps> = ({
  label = 'Preferred Study Destinations',
  selectedCountries,
  onChange,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Common quick-access countries (Ghana prominently included first)
  const popularCountryNames = useMemo(
    () => [
      'Ghana',
      'United States',
      'United Kingdom',
      'Canada',
      'Germany',
      'Australia',
      'Rwanda',
      'South Africa',
      'France',
      'Japan',
      'South Korea',
      'Netherlands',
    ],
    []
  );

  const popularCountries = useMemo(() => {
    return popularCountryNames
      .map((name) => ALL_COUNTRIES.find((c) => c.name === name))
      .filter((c): c is Country => Boolean(c));
  }, [popularCountryNames]);

  const toggleCountry = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      if (selectedCountries.length === 1) return; // keep at least 1 destination
      onChange(selectedCountries.filter((c) => c !== countryName));
    } else {
      onChange([...selectedCountries, countryName]);
    }
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCountries(searchQuery);
  }, [searchQuery]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#10132D]">
          {label} ({selectedCountries.length} selected)
        </label>
        {selectedCountries.length > 0 && (
          <span className="text-[11px] text-[#6846F5] font-semibold">
            {selectedCountries.length} chosen
          </span>
        )}
      </div>

      {/* Selected tags chip bar */}
      <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 min-h-[42px] items-center">
        {selectedCountries.map((cName) => {
          const c = ALL_COUNTRIES.find((item) => item.name === cName);
          return (
            <span
              key={cName}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0EDFF] border border-[#DDD6FE] text-[#6846F5] text-xs font-semibold"
            >
              <span>{c?.flag || '🌐'}</span>
              <span>{cName}</span>
              {selectedCountries.length > 1 && (
                <button
                  type="button"
                  onClick={() => toggleCountry(cName)}
                  className="hover:text-rose-600 ml-0.5 cursor-pointer"
                  title={`Remove ${cName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          );
        })}
      </div>

      {/* Quick Access Top Countries */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Quick Select Popular Destinations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {popularCountries.map((dest) => {
            const isSelected = selectedCountries.includes(dest.name);
            return (
              <button
                key={dest.code}
                type="button"
                onClick={() => toggleCountry(dest.name)}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between min-h-[44px] active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#6846F5] bg-[#F0EDFF] text-[#10132D] font-bold ring-1 ring-[#6846F5]'
                    : 'border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <span>{dest.flag}</span>
                  <span className="truncate">{dest.name}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#6846F5] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Add Any Country Worldwide */}
      <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search and add any country worldwide (e.g. France, Sweden, Norway)..."
            className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#6846F5] text-[#10132D] placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg">
            {filteredCountries.length === 0 ? (
              <p className="p-3 text-xs text-slate-400 text-center">No matching country found.</p>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountries.includes(c.name);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleCountry(c.name)}
                    className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0EDFF] text-[#6846F5] font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                    {isSelected ? (
                      <span className="text-[11px] font-bold text-[#6846F5]">Selected ✓</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">+ Add</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
