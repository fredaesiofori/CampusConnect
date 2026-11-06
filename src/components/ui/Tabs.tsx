/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  size = 'md',
  className = '',
}) => {
  const padClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 bg-[#F8F9FD] border border-[#E2E8F0] rounded-xl ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${padClass} ${
              isActive
                ? 'bg-white text-[#15152F] shadow-sm font-semibold'
                : 'text-[#64748B] hover:text-[#15152F] hover:bg-white/50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-[#F0EDFF] text-[#6846F5]' : 'bg-slate-200/60 text-[#64748B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
