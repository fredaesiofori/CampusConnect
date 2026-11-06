/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  GraduationCap,
  Info,
  Building2,
  Award,
  Globe,
  Bot,
  Compass,
} from 'lucide-react';

export interface CovaAssistantProps {
  className?: string;
  userName?: string;
}

export const CovaAssistant: React.FC<CovaAssistantProps> = ({
  className = '',
  userName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Scroll to bottom on open
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen]);

  const welcomeMessage =
    "Hi! I'm COVA, your Campus Connect AI assistant. 🎓 I'm here to help you explore universities, scholarships, and study opportunities worldwide. What can I help you with today?";

  const sampleTopics = [
    { label: 'Verified Scholarships', icon: <Award className="w-3.5 h-3.5 text-[#E7B75C]" /> },
    { label: '$0 Fee Universities', icon: <Building2 className="w-3.5 h-3.5 text-[#6846F5]" /> },
    { label: 'GRE & SAT Waivers', icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Global Destinations', icon: <Globe className="w-3.5 h-3.5 text-blue-500" /> },
  ];

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none ${className}`}
    >
      {/* 1. COVA Chat Panel Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cova-chat-title"
          className="pointer-events-auto w-[calc(100vw-2rem)] sm:w-[410px] h-[520px] max-h-[calc(100vh-6rem)] mb-3 bg-white rounded-2xl shadow-[0_12px_40px_rgba(16,19,45,0.22)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 ease-out"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#10132D] via-[#1E1B4B] to-[#2E1065] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#25254D] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6846F5] to-[#A855F7] text-white shadow-md">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#10132D]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="cova-chat-title" className="text-sm font-bold tracking-tight text-white">
                    COVA
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/15 text-[#DDD6FE] px-1.5 py-0.5 rounded">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-[210px] leading-tight">
                  Campus Opportunity &amp; Virtual Assistant
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer"
              aria-label="Close COVA assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-sm">
            {/* Greeting Tag */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200/80 rounded-full px-2.5 py-0.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#E7B75C]" />
                Powered by Campus Connect Intelligence
              </span>
            </div>

            {/* Welcome Message Bubble from COVA */}
            <div className="flex items-start gap-2.5 max-w-[92%] animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6846F5] to-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <div className="bg-white border border-slate-200/90 text-[#10132D] p-3.5 rounded-2xl rounded-tl-sm shadow-xs leading-relaxed text-xs sm:text-[13px]">
                  {userName && (
                    <p className="font-semibold text-[#6846F5] mb-1">
                      Hello {userName.split(' ')[0]}! 👋
                    </p>
                  )}
                  <p>{welcomeMessage}</p>
                </div>
                <span className="text-[10px] text-slate-400 pl-1 font-medium">Just now</span>
              </div>
            </div>

            {/* Quick Topic Chips Preview */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1">
                Explore Opportunities
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {sampleTopics.map((topic) => (
                  <div
                    key={topic.label}
                    className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-[11px] font-medium shadow-2xs"
                  >
                    <span>{topic.icon}</span>
                    <span className="truncate">{topic.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Backend Connection Status Card */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2 shadow-2xs">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-snug">
                <p className="font-bold text-amber-900 text-[11px]">Assistant Interface Preview</p>
                <p className="text-[11px] text-amber-800">
                  COVA&apos;s conversational AI model is being connected in the next update. Message input is temporarily paused.
                </p>
              </div>
            </div>

            <div ref={chatBottomRef} />
          </div>

          {/* Footer Message Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-1.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-[#6846F5] transition-colors">
              <input
                type="text"
                disabled
                placeholder="AI model backend connecting soon..."
                className="flex-1 bg-transparent text-xs text-slate-500 placeholder:text-slate-400 focus:outline-none cursor-not-allowed select-none"
                aria-label="Chat message input (temporarily disabled)"
              />
              <button
                type="button"
                disabled
                className="w-7 h-7 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center cursor-not-allowed shrink-0 transition-colors"
                aria-label="Send message (disabled)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-none">
              COVA is designed to assist African scholars worldwide.
            </p>
          </div>
        </div>
      )}

      {/* 2. Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center gap-2 h-11 sm:h-12 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#6846F5] via-[#7B59F8] to-[#8065FF] text-white shadow-[0_8px_25px_rgba(104,70,245,0.35)] hover:shadow-[0_10px_30px_rgba(104,70,245,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] focus-visible:ring-offset-2"
        aria-label={isOpen ? 'Close COVA assistant' : 'Open COVA AI assistant'}
        aria-expanded={isOpen}
        title="COVA - Campus Opportunity & Virtual Assistant"
      >
        {/* Animated Icon Avatar */}
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E7B75C]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#6846F5] animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#6846F5]" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold tracking-tight">COVA</span>
          <span className="hidden xs:inline-block text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white/95 px-1.5 py-0.5 rounded">
            AI
          </span>
        </div>
      </button>
    </div>
  );
};
