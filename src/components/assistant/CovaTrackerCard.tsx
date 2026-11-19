/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  BookmarkCheck,
  Send,
  FileCheck,
  Trophy,
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { UniversityLogo } from '../ui/UniversityLogo';
import { CountryFlag } from '../ui/CountryFlagSvg';
import { ApplicationStage } from '../dashboard/TargetTrackerBoard';

export interface CovaTrackerCardProps {
  item: OpportunityItem;
  currentStage: ApplicationStage;
  onUpdateStage: (opportunityId: string, stage: ApplicationStage) => void;
  onViewDetails: (item: OpportunityItem) => void;
  onNavigateToTracker?: () => void;
}

export const CovaTrackerCard: React.FC<CovaTrackerCardProps> = ({
  item,
  currentStage,
  onUpdateStage,
  onViewDetails,
  onNavigateToTracker,
}) => {
  const [confirmingStage, setConfirmingStage] = useState<ApplicationStage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const officialName = item.officialName || item.title;
  const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
  const deadlineText = evalDeadline.displayText;

  const stages: {
    id: ApplicationStage;
    label: string;
    icon: React.ReactNode;
    badgeStyle: string;
    activeBg: string;
  }[] = [
    {
      id: 'saved',
      label: 'Saved Target',
      icon: <BookmarkCheck className="w-3 h-3" />,
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      activeBg: 'bg-blue-600 text-white',
    },
    {
      id: 'preparing',
      label: 'Preparing',
      icon: <FileCheck className="w-3 h-3" />,
      badgeStyle: 'bg-violet-50 text-[#6846F5] border-violet-200',
      activeBg: 'bg-[#6846F5] text-white',
    },
    {
      id: 'submitted',
      label: 'Submitted',
      icon: <Send className="w-3 h-3" />,
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      activeBg: 'bg-amber-600 text-white',
    },
    {
      id: 'accepted',
      label: 'Accepted',
      icon: <Trophy className="w-3 h-3" />,
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      activeBg: 'bg-emerald-600 text-white',
    },
  ];

  const currentStageInfo = stages.find((s) => s.id === currentStage) || stages[0];

  const handleStageClick = (stage: ApplicationStage) => {
    if (stage === currentStage) return;
    setConfirmingStage(stage);
  };

  const handleConfirm = async () => {
    if (!confirmingStage) return;
    setIsUpdating(true);
    const target = confirmingStage;
    try {
      await onUpdateStage(item.id, target);
      setSuccessNotice(`Updated to ${stages.find((s) => s.id === target)?.label}`);
      setTimeout(() => setSuccessNotice(null), 3000);
    } finally {
      setIsUpdating(false);
      setConfirmingStage(null);
    }
  };

  const handleCancel = () => {
    setConfirmingStage(null);
  };

  return (
    <div className="bg-white border border-slate-200/90 hover:border-[#6846F5]/50 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-all text-left">
      {/* Top Header: Logo, Name, Location */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <UniversityLogo item={item} size="sm" showVerifiedShield={true} />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {officialName}
            </h4>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
              <CountryFlag
                code={item.countryCode}
                country={item.country}
                className="w-3.5 h-[10px] rounded-[1.5px] ring-1 ring-black/10 overflow-hidden shrink-0"
              />
              <span>{item.country}</span>
              {item.city && <span className="text-slate-400">• {item.city}</span>}
            </p>
          </div>
        </div>

        {/* Current Stage Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${currentStageInfo.badgeStyle} shrink-0`}
        >
          {currentStageInfo.icon}
          <span>{currentStageInfo.label}</span>
        </span>
      </div>

      {/* Deadline Info */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className={`w-3 h-3 shrink-0 ${evalDeadline.isExpired ? 'text-amber-600' : 'text-slate-400'}`} />
          <span className="truncate">
            Deadline:{' '}
            <strong className={evalDeadline.isExpired ? 'text-amber-700' : undefined}>{deadlineText}</strong>
          </span>
        </div>
        {item.fundingDetails?.type && (
          <span className="text-emerald-700 font-medium shrink-0">
            {item.fundingDetails.type}
          </span>
        )}
      </div>

      {/* Confirmation Prompt when user requests status change */}
      {confirmingStage ? (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-2 animate-in fade-in duration-150">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Confirm moving <strong>{officialName}</strong> to{' '}
              <strong className="text-amber-950">
                {stages.find((s) => s.id === confirmingStage)?.label}
              </strong>
              ?
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[10px] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isUpdating}
              className="px-2.5 py-1 rounded bg-[#6846F5] hover:bg-[#5835ea] text-white text-[10px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
            >
              {isUpdating ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              Confirm Update
            </button>
          </div>
        </div>
      ) : (
        /* Stage Progress Stepper / Selector */
        <div className="mt-2.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
            Update Progress Stage
          </p>
          <div className="grid grid-cols-4 gap-1">
            {stages.map((stage) => {
              const isActive = stage.id === currentStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageClick(stage.id)}
                  className={`px-1.5 py-1 rounded-md text-[10px] font-medium text-center transition-all cursor-pointer truncate flex items-center justify-center gap-0.5 ${
                    isActive
                      ? `${stage.activeBg} font-bold shadow-2xs`
                      : 'bg-slate-100 hover:bg-violet-50 text-slate-600 hover:text-[#6846F5] border border-slate-200/80 hover:border-violet-300'
                  }`}
                  title={isActive ? `Currently at ${stage.label}` : `Move to ${stage.label}`}
                >
                  <span className="truncate">{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Notice if just updated */}
      {successNotice && (
        <div className="mt-2 px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[10px] font-medium flex items-center gap-1 animate-in fade-in">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {onNavigateToTracker && (
          <button
            type="button"
            onClick={onNavigateToTracker}
            className="text-[10px] font-medium text-[#6846F5] hover:text-[#5232d9] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Open in Target Tracker</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewDetails(item)}
          className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6846F5] hover:bg-[#5835ea] active:scale-[0.98] text-white font-medium text-[11px] shadow-2xs transition-all cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
