import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  isBusy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  isBusy = false,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isBusy, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-navy/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-dialog-title"
      aria-describedby="signout-dialog-desc"
      onClick={() => {
        if (!isBusy) onCancel();
      }}
    >
      <div
        className="relative w-full max-w-[400px] rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 text-left animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          aria-label="Close sign out confirmation"
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center w-9 h-9 rounded-full text-slate hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-xl bg-electric/10 text-electric flex items-center justify-center mb-4">
          <LogOut className="w-5 h-5" />
        </div>

        <h2
          id="signout-dialog-title"
          className="text-lg font-extrabold text-navy tracking-tight pr-6"
        >
          Sign out of Campus Connect?
        </h2>

        <p
          id="signout-dialog-desc"
          className="mt-2 text-sm text-slate leading-relaxed"
        >
          Are you sure you want to sign out of your account?
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="min-h-[44px] w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-navy hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-xl bg-electric hover:bg-purple-700 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {isBusy ? 'Signing out...' : 'Yes, Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
};
