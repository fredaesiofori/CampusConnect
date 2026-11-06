/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X, ShieldCheck, Info } from 'lucide-react';
import { Button } from './Button';

export interface InfoModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#15152F]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-200 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-[#F8F9FD] border-b border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#F0EDFF] flex items-center justify-center text-[#6846F5] shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <h3 id="info-modal-title" className="text-sm sm:text-base font-bold font-display text-[#15152F] truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-[#64748B] hover:text-[#15152F] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            {description}
          </p>
          <div className="rounded-xl bg-[#F0EDFF]/50 border border-[#DDD6FE] p-3 text-xs text-[#6846F5] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Campus Connect operates with full transparency and verified scholar standards.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F8F9FD] border-t border-[#E2E8F0] flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
};
