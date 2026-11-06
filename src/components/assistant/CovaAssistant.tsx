/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Send,
  X,
  GraduationCap,
  Building2,
  Award,
  Globe,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';
import { authService, StudentProfile } from '../../services/auth';
import { OpportunityItem, authenticOpportunities } from '../../data/opportunities';
import { CovaOpportunityCard } from './CovaOpportunityCard';
import { OpportunityDetailModal } from '../dashboard/OpportunityDetailModal';

export interface CovaAssistantProps {
  className?: string;
  userName?: string;
  studentProfile?: StudentProfile;
  savedOpportunities?: Set<string>;
  onToggleSave?: (opportunityId: string, title: string) => void;
  onSelectOpportunity?: (opportunity: OpportunityItem) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
  errorMessage?: string;
  opportunities?: OpportunityItem[];
  followUps?: string[];
}

// Simple Markdown parser for bolding, lists, and external links
function renderFormattedContent(text: string) {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Check if line is a bullet point
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanedLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;

    // Parse links [Label](url) and **bold**
    const parts: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const processTextForBold = (str: string, keyPrefix: string) => {
      const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bp, bpIdx) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return (
            <strong key={`${keyPrefix}-b-${bpIdx}`} className="font-semibold text-slate-900">
              {bp.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${keyPrefix}-t-${bpIdx}`}>{bp}</span>;
      });
    };

    let linkIdx = 0;
    while ((match = linkRegex.exec(cleanedLine)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = cleanedLine.substring(lastIndex, match.index);
        parts.push(...processTextForBold(textBefore, `pre-${lineIdx}-${linkIdx}`));
      }

      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={`link-${lineIdx}-${linkIdx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-[#6846F5] hover:text-[#5232d9] font-medium underline underline-offset-2 break-all"
        >
          {label}
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );

      lastIndex = match.index + match[0].length;
      linkIdx++;
    }

    if (lastIndex < cleanedLine.length) {
      parts.push(...processTextForBold(cleanedLine.substring(lastIndex), `post-${lineIdx}`));
    }

    if (isBullet) {
      return (
        <li key={`line-${lineIdx}`} className="ml-4 list-disc space-y-1">
          {parts.length > 0 ? parts : cleanedLine}
        </li>
      );
    }

    if (line.trim() === '') {
      return <div key={`empty-${lineIdx}`} className="h-1.5" />;
    }

    return (
      <p key={`p-${lineIdx}`} className="leading-relaxed">
        {parts.length > 0 ? parts : line}
      </p>
    );
  });
}

export const CovaAssistant: React.FC<CovaAssistantProps> = ({
  className = '',
  userName,
  studentProfile: propProfile,
  savedOpportunities: propSavedOpportunities,
  onToggleSave,
  onSelectOpportunity,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);

  // Modal opportunity state for "View Details"
  const [modalOpportunity, setModalOpportunity] = useState<OpportunityItem | null>(null);

  // Synchronized saved opportunities Set
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    if (propSavedOpportunities) return propSavedOpportunities;
    const userSaved = authService.getCurrentUser()?.savedOpportunities || [];
    return new Set(userSaved);
  });

  // Keep savedIds in sync when prop changes
  useEffect(() => {
    if (propSavedOpportunities) {
      setSavedIds(propSavedOpportunities);
    }
  }, [propSavedOpportunities]);

  const initialWelcome =
    "Hi! I'm COVA, your Campus Connect AI advisor. 🎓 I'm here to help you discover verified universities, scholarships, application fee waivers, and funding matching your background and budget worldwide. What are you looking to study?";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content: initialWelcome,
      timestamp: new Date(),
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Active student profile (from prop or local user session)
  const activeProfile = propProfile || authService.getCurrentUser()?.profile;

  // Check health and GEMINI_API_KEY status
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/cova/health');
      if (res.ok) {
        const data = await res.json();
        setApiConfigured(Boolean(data.geminiConfigured));
      }
    } catch {
      // Backend may be starting or offline
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !modalOpportunity) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalOpportunity]);

  // Scroll to bottom whenever messages change or dialog opens
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Handle saving an opportunity from a COVA card
  const handleToggleSave = (opportunityId: string, title: string) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(opportunityId)) {
      newSaved.delete(opportunityId);
    } else {
      newSaved.add(opportunityId);
    }
    setSavedIds(newSaved);

    // Call prop callback if provided
    if (onToggleSave) {
      onToggleSave(opportunityId, title);
    } else {
      authService.toggleSavedOpportunity(opportunityId);
    }
  };

  // Handle "View Details" click on a card
  const handleViewDetails = (opportunity: OpportunityItem) => {
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity);
    }
    setModalOpportunity(opportunity);
  };

  const starterDiscoveryPrompts = [
    {
      label: 'Find $0 Application Fee Universities',
      prompt: 'Find universities in the United States or Canada with a $0 application fee or verified fee waivers for international students.',
      icon: <Building2 className="w-3.5 h-3.5 text-[#6846F5]" />,
    },
    {
      label: 'Fully Funded Scholarships',
      prompt: 'Show me top fully funded scholarships for African and international students in the UK, USA, and Canada.',
      icon: <Award className="w-3.5 h-3.5 text-[#E7B75C]" />,
    },
    {
      label: 'No SAT / GRE Required',
      prompt: 'Which universities waive SAT or GRE test scores for international admissions?',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      label: 'WAEC / WASSCE English Accepted',
      prompt: 'Can you find universities that accept my WAEC or WASSCE English result without requiring IELTS or TOEFL?',
      icon: <Globe className="w-3.5 h-3.5 text-blue-500" />,
    },
  ];

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessageId = `user-${Date.now()}`;
    const botMessageId = `model-${Date.now()}`;

    const newMessages: Message[] = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        content: textToSend,
        timestamp: new Date(),
      },
      {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ];

    setMessages(newMessages);
    setIsLoading(true);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const conversationHistory = messages
      .filter((m) => !m.error && m.content.trim() !== '')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await fetch('/api/cova/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory,
          studentProfile: activeProfile
            ? {
                nationality: activeProfile.nationality,
                countryOfResidence: activeProfile.countryOfResidence,
                preferredDestinations: activeProfile.preferredDestinations,
                intendedDegree: activeProfile.intendedDegree,
                educationLevel: activeProfile.educationLevel,
                fieldOfStudy: activeProfile.fieldOfStudy,
                fundingPreference: activeProfile.fundingPreference,
                testPreference: activeProfile.testPreference,
              }
            : undefined,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch {}

        const errMsg =
          errData.error ||
          (response.status === 429
            ? 'Rate limit reached. Please wait a moment before sending another message.'
            : 'Unable to connect to COVA AI service. Please try again.');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  error: true,
                  errorMessage: errMsg,
                  content: errMsg,
                }
              : msg
          )
        );
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error('No readable stream available in response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';
      let matchedOpportunities: OpportunityItem[] | undefined;
      let followUps: string[] | undefined;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('event: error')) {
            const dataLine = trimmed.split('\n').find((l) => l.startsWith('data:'));
            if (dataLine) {
              try {
                const parsed = JSON.parse(dataLine.replace(/^data:\s*/, ''));
                accumulatedText = parsed.error || accumulatedText;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          isStreaming: false,
                          error: true,
                          errorMessage: parsed.error,
                          content: parsed.error,
                        }
                      : msg
                  )
                );
              } catch {}
            }
            setIsLoading(false);
            return;
          }

          if (trimmed.startsWith('data:')) {
            const rawData = trimmed.replace(/^data:\s*/, '');
            if (rawData === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          content: accumulatedText,
                        }
                      : msg
                  )
                );
              }
              if (parsed.matchedOpportunities || parsed.followUps) {
                matchedOpportunities = parsed.matchedOpportunities || matchedOpportunities;
                followUps = parsed.followUps || followUps;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          opportunities: matchedOpportunities || msg.opportunities,
                          followUps: followUps || msg.followUps,
                        }
                      : msg
                  )
                );
              }
            } catch {}
          }
        }
      }

      // Finalize streaming message state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                isStreaming: false,
                opportunities: matchedOpportunities || msg.opportunities,
                followUps: followUps || msg.followUps,
              }
            : msg
        )
      );
      setApiConfigured(true);
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      const errorMessage =
        err?.message || 'A network error occurred while communicating with COVA. Please try again.';

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                isStreaming: false,
                error: true,
                errorMessage,
                content: errorMessage,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const resetChat = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: initialWelcome,
        timestamp: new Date(),
      },
    ]);
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none ${className}`}
      >
        {/* 1. COVA Chat Panel Overlay */}
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cova-chat-title"
            className="pointer-events-auto w-[calc(100vw-2rem)] sm:w-[460px] h-[600px] max-h-[calc(100vh-5.5rem)] mb-3 bg-white rounded-2xl shadow-[0_16px_48px_rgba(16,19,45,0.26)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 ease-out"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#10132D] via-[#1E1B4B] to-[#2E1065] text-white px-4 py-3 flex items-center justify-between border-b border-[#25254D] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6846F5] to-[#A855F7] text-white shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#10132D] ${
                      isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 id="cova-chat-title" className="text-sm font-bold tracking-tight text-white">
                      COVA
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/15 text-[#DDD6FE] px-1.5 py-0.5 rounded">
                      AI Advisor
                    </span>
                    {activeProfile?.intendedDegree && (
                      <span className="hidden sm:inline-block text-[10px] font-medium bg-[#6846F5]/40 text-violet-200 px-1.5 py-0.5 rounded truncate max-w-[110px]">
                        {activeProfile.intendedDegree}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 truncate max-w-[210px] leading-tight">
                    Campus Opportunity &amp; Virtual Assistant
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer"
                  title="Restart conversation"
                  aria-label="Restart conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer"
                  aria-label="Close COVA assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Personalization Banner */}
            {activeProfile && (activeProfile.intendedDegree || activeProfile.fieldOfStudy) && (
              <div className="bg-slate-100/90 border-b border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Personalized for: <strong className="font-semibold text-slate-800">{activeProfile.intendedDegree || 'Scholar'}</strong>
                    {activeProfile.fieldOfStudy ? ` • ${activeProfile.fieldOfStudy}` : ''}
                    {activeProfile.preferredDestinations?.length
                      ? ` • ${activeProfile.preferredDestinations.slice(0, 2).join(', ')}`
                      : ''}
                  </span>
                </div>
                {savedIds.size > 0 && (
                  <span className="text-[10px] font-semibold text-[#6846F5] bg-violet-100/70 px-2 py-0.5 rounded-full shrink-0">
                    {savedIds.size} saved
                  </span>
                )}
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-sm">
              {/* Trust Badge */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-0.5 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#E7B75C]" />
                  Verified Registry Discovery &amp; Gemini 3.8 Flash
                </span>
              </div>

              {/* Message History */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start w-full'
                  } animate-in fade-in duration-150`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6846F5] to-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start w-full'}`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs leading-relaxed text-xs sm:text-[13px] ${
                        msg.role === 'user'
                          ? 'bg-[#6846F5] text-white rounded-tr-sm ml-auto max-w-[85%]'
                          : msg.error
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-sm w-full'
                          : 'bg-white border border-slate-200/90 text-[#10132D] rounded-tl-sm w-full'
                      }`}
                    >
                      {msg.role === 'model' && msg.id === 'welcome-msg' && userName && (
                        <p className="font-semibold text-[#6846F5] mb-1">
                          Hello {userName.split(' ')[0]}! 👋
                        </p>
                      )}

                      {msg.error ? (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                              <p className="font-semibold text-rose-900">AI Response Notice</p>
                              <p className="text-rose-800 leading-relaxed">{msg.errorMessage || msg.content}</p>
                            </div>
                          </div>
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={retryLastMessage}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 font-medium text-[11px] cursor-pointer transition-colors shadow-2xs"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Retry
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {renderFormattedContent(msg.content)}

                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3.5 bg-[#6846F5] animate-pulse ml-0.5 align-middle" />
                          )}

                          {/* Interactive Verified Opportunity Cards */}
                          {msg.opportunities && msg.opportunities.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                                <span className="flex items-center gap-1.5 text-[#10132D]">
                                  <Building2 className="w-3.5 h-3.5 text-[#6846F5]" />
                                  Verified Matching Opportunities ({msg.opportunities.length})
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  Campus Connect Registry
                                </span>
                              </div>

                              <div className="space-y-2">
                                {msg.opportunities.map((opp) => (
                                  <CovaOpportunityCard
                                    key={opp.id}
                                    item={opp}
                                    isSaved={savedIds.has(opp.id)}
                                    onToggleSave={handleToggleSave}
                                    onViewDetails={handleViewDetails}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Follow-Up Refinements */}
                          {msg.followUps && msg.followUps.length > 0 && !msg.isStreaming && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100/90 space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Refine Search
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.followUps.map((prompt) => (
                                  <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleSendMessage(prompt)}
                                    disabled={isLoading}
                                    className="text-[11px] font-medium text-slate-700 hover:text-[#6846F5] bg-slate-50 hover:bg-violet-50/80 border border-slate-200/90 hover:border-violet-300 rounded-full px-2.5 py-1 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 group active:scale-[0.98]"
                                  >
                                    <span>{prompt}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#6846F5] group-hover:translate-x-0.5 transition-all" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-[10px] text-slate-400 font-medium px-1 block ${
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Starter Quick Discovery Prompts */}
              {messages.length <= 2 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1">
                    Discover Opportunities
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {starterDiscoveryPrompts.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSendMessage(item.prompt)}
                        disabled={isLoading}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:border-[#6846F5] hover:bg-violet-50/40 text-left transition-all duration-150 cursor-pointer shadow-2xs group"
                      >
                        <span className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="font-semibold text-xs text-slate-800 block truncate group-hover:text-[#6846F5]">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {item.prompt}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* API Key Pending Notice */}
              {apiConfigured === false && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 text-[11px]">Gemini API Key Required</p>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      To activate live AI responses, add your <code>GEMINI_API_KEY</code> in AI Studio project secrets. The server will automatically connect to Gemini 3.8 Flash.
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Footer Input Area */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 shadow-2xs focus-within:border-[#6846F5] focus-within:ring-2 focus-within:ring-[#6846F5]/10 transition-all"
              >
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={handleInputResize}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask for universities, scholarships, $0 fees, SAT waivers..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none max-h-28 py-1 leading-normal"
                  aria-label="Ask COVA a question"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-[#6846F5] hover:bg-[#5835ea] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shrink-0 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="truncate">Grounds in 455 verified opportunities</span>
              </div>
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

      {/* 3. Detail Modal for Cards Opened Directly in COVA */}
      {modalOpportunity && (
        <OpportunityDetailModal
          item={modalOpportunity}
          onClose={() => setModalOpportunity(null)}
          isSaved={savedIds.has(modalOpportunity.id)}
          onToggleSave={handleToggleSave}
        />
      )}
    </>
  );
};
