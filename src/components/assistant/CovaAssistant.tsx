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
  Trophy,
  FileCheck,
  Clock,
  LayoutDashboard,
  Check,
  Copy,
  Square,
  History,
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  authService,
  StudentProfile,
  TargetListItem,
  ActiveApplicationItem,
} from '../../services/auth';
import { auth, subscribeToFirebaseAuthState } from '../../services/firebase';
import { OpportunityItem, authenticOpportunities } from '../../data/opportunities';
import { CovaOpportunityCard } from './CovaOpportunityCard';
import { CovaTrackerCard } from './CovaTrackerCard';
import { CovaHistoryDrawer } from './CovaHistoryDrawer';
import { OpportunityDetailModal } from '../dashboard/OpportunityDetailModal';
import { ApplicationStage } from '../dashboard/TargetTrackerBoard';
import { covaStorage, CovaConversation, StoredMessage } from '../../services/covaStorage';

export interface CovaAssistantProps {
  className?: string;
  userId?: string;
  userName?: string;
  studentProfile?: StudentProfile;
  savedOpportunities?: Set<string>;
  targetList?: Record<string, TargetListItem>;
  activeApplications?: Record<string, ActiveApplicationItem>;
  applicationTracker?: Record<string, ApplicationStage>;
  onToggleSave?: (opportunityId: string, title: string) => void;
  onUpdateApplicationStatus?: (opportunityId: string, stage: ApplicationStage) => void;
  onSelectOpportunity?: (opportunity: OpportunityItem) => void;
  onNavigateToTracker?: () => void;
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
  trackerOpportunities?: OpportunityItem[];
  followUps?: string[];
}

// Simple Markdown parser for bolding, lists, and external links
function renderFormattedContent(text: string) {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanedLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;

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
  userId: propUserId,
  userName,
  studentProfile: propProfile,
  savedOpportunities: propSavedOpportunities,
  targetList: propTargetList,
  activeApplications: propActiveApplications,
  applicationTracker: propApplicationTracker,
  onToggleSave,
  onUpdateApplicationStatus,
  onSelectOpportunity,
  onNavigateToTracker,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);

  // Copy status feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // History Drawer open state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Modal opportunity state for "View Details"
  const [modalOpportunity, setModalOpportunity] = useState<OpportunityItem | null>(null);

  // Current authenticated user ID (reactively tracked across Firebase Auth hydration)
  const initialActiveUser = authService.getCurrentUser();
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return (
      propUserId ||
      auth.currentUser?.uid ||
      initialActiveUser?.id ||
      initialActiveUser?.email ||
      'authenticated_scholar'
    );
  });

  useEffect(() => {
    const resolved =
      propUserId ||
      auth.currentUser?.uid ||
      authService.getCurrentUser()?.id ||
      authService.getCurrentUser()?.email ||
      'authenticated_scholar';
    if (resolved !== currentUserId) {
      setCurrentUserId(resolved);
    }
  }, [propUserId, currentUserId]);

  useEffect(() => {
    const unsubscribe = subscribeToFirebaseAuthState((fbUser) => {
      if (fbUser && !fbUser.isAnonymous) {
        setCurrentUserId(propUserId || fbUser.uid);
      } else {
        const cached = authService.getCurrentUser();
        setCurrentUserId(propUserId || cached?.id || cached?.email || 'authenticated_scholar');
      }
    });
    return () => unsubscribe();
  }, [propUserId]);

  const initialWelcome =
    "Hi! I'm COVA, your Campus Connect AI advisor. 🎓 I'm here to guide your university discovery, review Saved Opportunities, organize your Target List, track Active Applications, and help draft strong personal statements. What would you like to work on today?";

  // Conversation list & active conversation ID
  const [conversations, setConversations] = useState<CovaConversation[]>(() => {
    return covaStorage.getConversations(currentUserId);
  });

  const [activeConvId, setActiveConvId] = useState<string>(() => {
    const existing = covaStorage.getActiveConversationId(currentUserId);
    if (existing && covaStorage.getConversation(currentUserId, existing)) {
      return existing;
    }
    const existingList = covaStorage.getConversations(currentUserId);
    if (existingList.length > 0) {
      covaStorage.setActiveConversationId(currentUserId, existingList[0].id);
      return existingList[0].id;
    }
    const initial = covaStorage.createConversation(currentUserId, initialWelcome);
    return initial.id;
  });

  // Active messages initialized from stored active conversation
  const [messages, setMessages] = useState<Message[]>(() => {
    const active = covaStorage.getConversation(currentUserId, activeConvId);
    if (active && active.messages.length > 0) {
      return active.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
        isStreaming: false,
      }));
    }
    return [
      {
        id: 'welcome-msg',
        role: 'model',
        content: initialWelcome,
        timestamp: new Date(),
      },
    ];
  });

  // Synchronized 4-Pillar Student Data State
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    if (propSavedOpportunities) return propSavedOpportunities;
    const userSaved = initialActiveUser?.savedOpportunities || [];
    return new Set(userSaved);
  });

  const [targetListMap, setTargetListMap] = useState<Record<string, TargetListItem>>(() => {
    if (propTargetList) return propTargetList;
    return initialActiveUser?.targetList || {};
  });

  const [activeApplicationsMap, setActiveApplicationsMap] = useState<
    Record<string, ActiveApplicationItem>
  >(() => {
    if (propActiveApplications) return propActiveApplications;
    return initialActiveUser?.activeApplications || {};
  });

  const [trackerMap, setTrackerMap] = useState<Record<string, ApplicationStage>>(() => {
    if (propApplicationTracker) return propApplicationTracker;
    const userTracker = initialActiveUser?.applicationTracker || {};
    return userTracker as Record<string, ApplicationStage>;
  });

  useEffect(() => {
    if (propSavedOpportunities) {
      setSavedIds(propSavedOpportunities);
    }
  }, [propSavedOpportunities]);

  useEffect(() => {
    if (propTargetList) {
      setTargetListMap(propTargetList);
    }
  }, [propTargetList]);

  useEffect(() => {
    if (propActiveApplications) {
      setActiveApplicationsMap(propActiveApplications);
    }
  }, [propActiveApplications]);

  useEffect(() => {
    if (propApplicationTracker) {
      setTrackerMap(propApplicationTracker);
    }
  }, [propApplicationTracker]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const abortReasonRef = useRef<'stop' | 'timeout' | 'reset' | null>(null);
  const clientTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSendingRef = useRef<boolean>(false);
  const currentUserIdRef = useRef<string>(currentUserId);
  const activeConvIdRef = useRef<string>(activeConvId);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // Active student profile (from prop or current user session)
  const latestCachedUser = authService.getCurrentUser();
  const activeProfile = propProfile || latestCachedUser?.profile;

  // Hydrate and merge conversations from Firestore whenever authenticated student changes
  useEffect(() => {
    let cancelled = false;
    const userCache = authService.getCurrentUser();
    const legacyKeys = [
      'authenticated_scholar',
      'anonymous_scholar',
      userCache?.email || '',
    ].filter((k) => Boolean(k) && k !== currentUserId);

    // Immediately show local conversations for this uid
    const localList = covaStorage.getConversations(currentUserId);
    if (localList.length > 0 && !isSendingRef.current) {
      const preferredId = covaStorage.getActiveConversationId(currentUserId);
      const chosen =
        (preferredId ? localList.find((c) => c.id === preferredId) : null) || localList[0];
      setConversations(localList);
      setActiveConvId(chosen.id);
      setMessages(
        chosen.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
          isStreaming: false,
        }))
      );
    }

    covaStorage
      .loadConversationsSynced(currentUserId, legacyKeys)
      .then((syncedList) => {
        if (cancelled) return;
        if (syncedList.length > 0) {
          setConversations(syncedList);
          if (!isSendingRef.current) {
            const preferredId = covaStorage.getActiveConversationId(currentUserId);
            const currentInSynced = syncedList.find((c) => c.id === activeConvIdRef.current);
            const currentHasUserTurns = currentInSynced?.messages.some((m) => m.role === 'user');
            const chosen =
              (preferredId ? syncedList.find((c) => c.id === preferredId) : null) ||
              (currentHasUserTurns ? currentInSynced : null) ||
              syncedList.find((c) => c.messages.some((m) => m.role === 'user')) ||
              syncedList[0];
            if (chosen) {
              setActiveConvId(chosen.id);
              covaStorage.setActiveConversationId(currentUserId, chosen.id);
              setMessages(
                chosen.messages.map((m) => ({
                  ...m,
                  timestamp: new Date(m.timestamp),
                  isStreaming: false,
                }))
              );
            }
          }
        } else if (!isSendingRef.current && localList.length === 0) {
          const fresh = covaStorage.createConversation(currentUserId, initialWelcome);
          setConversations([fresh]);
          setActiveConvId(fresh.id);
          setMessages(
            fresh.messages.map((m) => ({
              ...m,
              timestamp: new Date(m.timestamp),
              isStreaming: false,
            }))
          );
        }
      })
      .catch(() => {
        // Fallback already handled via local cache
      });

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  // Check health and GEMINI_API_KEY status
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/cova/health');
      if (res.ok) {
        const data = await res.json();
        setApiConfigured(Boolean(data.geminiConfigured));
      }
    } catch {
      // Backend may be starting
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Cleanup active request/timers on unmount
  useEffect(() => {
    return () => {
      if (clientTimeoutRef.current) {
        clearTimeout(clientTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortReasonRef.current = 'reset';
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Synchronize active conversation messages to local cache AND Firestore account
  const syncActiveConversationToStorage = useCallback(
    (
      currentMessages: Message[],
      titleOverride?: string,
      targetConvIdOverride?: string,
      targetUserIdOverride?: string
    ) => {
      const uid = targetUserIdOverride || currentUserIdRef.current;
      const convId = targetConvIdOverride || activeConvIdRef.current;

      const storedMsgs: StoredMessage[] = currentMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
        ...(m.error ? { error: true } : {}),
        ...(m.errorMessage ? { errorMessage: m.errorMessage } : {}),
        ...(m.opportunities && m.opportunities.length > 0
          ? {
              opportunities: m.opportunities,
              opportunityIds: m.opportunities.map((o) => o.id),
            }
          : {}),
        ...(m.trackerOpportunities && m.trackerOpportunities.length > 0
          ? {
              trackerOpportunities: m.trackerOpportunities,
              trackerOpportunityIds: m.trackerOpportunities.map((o) => o.id),
            }
          : {}),
        ...(m.followUps && m.followUps.length > 0 ? { followUps: m.followUps } : {}),
      }));

      const activeConv = covaStorage.getConversation(uid, convId);
      let title = titleOverride || activeConv?.title || 'New Conversation';

      // Auto-generate title from first user inquiry if still default
      if (title === 'New Conversation' || title === 'Conversation') {
        const firstUserMsg = currentMessages.find((m) => m.role === 'user' && m.content.trim() !== '');
        if (firstUserMsg) {
          title =
            firstUserMsg.content.slice(0, 42) + (firstUserMsg.content.length > 42 ? '...' : '');
        }
      }

      const now = new Date().toISOString();
      const updated: CovaConversation = {
        id: convId,
        userId: uid,
        title,
        createdAt: activeConv?.createdAt || now,
        updatedAt: now,
        messages: storedMsgs,
      };

      const hasRealUserTurns = currentMessages.some(
        (m) => m.role === 'user' && m.content.trim() !== ''
      );

      if (hasRealUserTurns) {
        void covaStorage.saveConversationSynced(uid, updated);
      } else {
        covaStorage.saveConversation(uid, updated);
      }

      if (uid === currentUserIdRef.current) {
        setConversations(covaStorage.getConversations(uid));
      }
    },
    []
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !modalOpportunity) {
        if (isHistoryOpen) {
          setIsHistoryOpen(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalOpportunity, isHistoryOpen]);

  // Scroll to bottom whenever messages change or dialog opens
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen && !isHistoryOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isHistoryOpen]);

  // Handle saving an opportunity from a COVA card
  const handleToggleSave = (opportunityId: string, title: string) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(opportunityId)) {
      newSaved.delete(opportunityId);
    } else {
      newSaved.add(opportunityId);
    }
    setSavedIds(newSaved);

    if (onToggleSave) {
      onToggleSave(opportunityId, title);
    } else {
      void authService.toggleSavedOpportunitySynced(opportunityId);
    }
  };

  // Handle updating an application stage from a COVA card
  const handleUpdateStage = (opportunityId: string, stage: ApplicationStage) => {
    const updated = {
      ...trackerMap,
      [opportunityId]: stage,
    };
    setTrackerMap(updated);

    if (stage === 'preparing' || stage === 'submitted' || stage === 'accepted') {
      const existing = activeApplicationsMap[opportunityId];
      const now = new Date().toISOString();
      setActiveApplicationsMap((prev) => ({
        ...prev,
        [opportunityId]: {
          opportunityId,
          stage,
          completedTasks: existing?.completedTasks || [],
          notes: existing?.notes,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
        },
      }));
    }

    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(opportunityId, stage);
    } else {
      authService.updateApplicationStatus(opportunityId, stage);
    }
  };

  // Handle "View Details" click on a card
  const handleViewDetails = (opportunity: OpportunityItem) => {
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity);
    }
    setModalOpportunity(opportunity);
  };

  // Copy message text to clipboard (with iframe-safe fallback)
  const handleCopyMessage = async (msgId: string, text: string) => {
    if (!text) return;
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        copied = document.execCommand('copy');
        document.body.removeChild(helper);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedId(msgId);
      setTimeout(() => setCopiedId((prev) => (prev === msgId ? null : prev)), 2000);
    }
  };

  // Stop active AI generation
  const handleStopGenerating = useCallback(() => {
    if (clientTimeoutRef.current) {
      clearTimeout(clientTimeoutRef.current);
      clientTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortReasonRef.current = 'stop';
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    isSendingRef.current = false;
    setIsLoading(false);

    setMessages((prev) => {
      const hasStreaming = prev.some((m) => m.isStreaming);
      if (!hasStreaming) return prev;
      const stopped = prev.map((msg) =>
        msg.isStreaming
          ? {
              ...msg,
              isStreaming: false,
              content: msg.content.trim()
                ? msg.content
                : 'Response generation was stopped before text finished.',
            }
          : msg
      );
      syncActiveConversationToStorage(stopped);
      return stopped;
    });
  }, [syncActiveConversationToStorage]);

  // New Chat action
  const handleNewChat = () => {
    handleStopGenerating();
    const newConv = covaStorage.createConversation(currentUserId, initialWelcome);
    setActiveConvId(newConv.id);
    activeConvIdRef.current = newConv.id;
    setConversations(covaStorage.getConversations(currentUserId));
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: initialWelcome,
        timestamp: new Date(),
      },
    ]);
  };

  // Select conversation from history
  const handleSelectConversation = (convId: string) => {
    handleStopGenerating();
    const conv = covaStorage.getConversation(currentUserId, convId);
    if (conv) {
      setActiveConvId(conv.id);
      activeConvIdRef.current = conv.id;
      covaStorage.setActiveConversationId(currentUserId, conv.id);
      setMessages(
        conv.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
          isStreaming: false,
        }))
      );
    }
  };

  // Rename conversation
  const handleRenameConversation = (convId: string, newTitle: string) => {
    void covaStorage.renameConversationSynced(currentUserId, convId, newTitle);
    setConversations(covaStorage.getConversations(currentUserId));
  };

  // Delete conversation
  const handleDeleteConversation = (convId: string) => {
    void covaStorage.deleteConversationSynced(currentUserId, convId);
    const updatedList = covaStorage.getConversations(currentUserId);
    setConversations(updatedList);

    if (activeConvId === convId) {
      if (updatedList.length > 0) {
        handleSelectConversation(updatedList[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // Clear all conversations
  const handleClearAllConversations = () => {
    void covaStorage.clearAllConversationsSynced(currentUserId);
    setConversations([]);
    handleNewChat();
  };

  const starterPrompts = [
    {
      label: 'My Application Status',
      prompt:
        'Review my Active Applications, Target List goals, and Saved Opportunities separately without mixing them up.',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      label: 'Personal Statement Outline',
      prompt:
        'Help me draft a compelling personal statement outline tailored to my degree and field of study.',
      icon: <FileCheck className="w-3.5 h-3.5 text-[#6846F5]" />,
    },
    {
      label: 'International Checklist',
      prompt:
        'What documents and steps do I need to prepare for international university admissions (transcripts, English waiver, letters)?',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      label: 'Upcoming Deadlines',
      prompt:
        'Prioritize upcoming deadlines across my Active Applications and Target List goals and explain which ones need action first.',
      icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
    },
  ];

  const OPPORTUNITY_LOOKUP = useRef(
    new Map<string, OpportunityItem>(authenticOpportunities.map((o) => [o.id, o]))
  );

  // Core streaming/request executor shared by Send, Regenerate, and Retry (prevents duplicate messages)
  const executeChatRequest = async ({
    textToSend,
    priorMessages,
    nextMessages,
    botMessageId,
    targetConvId,
    targetUid,
  }: {
    textToSend: string;
    priorMessages: Message[];
    nextMessages: Message[];
    botMessageId: string;
    targetConvId: string;
    targetUid: string;
  }) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setMessages(nextMessages);
    setIsLoading(true);

    if (clientTimeoutRef.current) {
      clearTimeout(clientTimeoutRef.current);
      clientTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortReasonRef.current = 'reset';
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    abortReasonRef.current = null;

    clientTimeoutRef.current = setTimeout(() => {
      abortReasonRef.current = 'timeout';
      controller.abort();
    }, 50_000);

    const conversationHistory = priorMessages
      .filter((m) => !m.error && m.content.trim() !== '')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // Build synchronized 4-pillar payloads cleanly separated
    const studentSavedPayload = Array.from(savedIds).map((id) => {
      const opp = OPPORTUNITY_LOOKUP.current.get(id);
      return {
        id,
        officialName: opp?.officialName || opp?.title || id,
        country: opp?.country || 'Global',
        category: opp?.category || 'university',
        deadlineText: opp?.deadlines?.deadlineText || 'Rolling Admissions',
        feeStatus: opp?.applicationFees?.status || 'Standard',
        testStatus: opp?.testWaiverRules?.status || 'Standard',
        fundingType: opp?.fundingDetails?.type || 'Standard',
      };
    });

    const studentTargetListPayload = Object.values(targetListMap).map((target) => {
      const opp = OPPORTUNITY_LOOKUP.current.get(target.opportunityId);
      return {
        id: target.opportunityId,
        officialName: opp?.officialName || opp?.title || target.opportunityId,
        country: opp?.country || 'Global',
        priority: target.priority,
        intakeYear: target.intakeYear,
        personalGoal: target.personalGoal,
        deadlineText: opp?.deadlines?.deadlineText || 'Rolling Admissions',
        feeStatus: opp?.applicationFees?.status || 'Standard',
        fundingType: opp?.fundingDetails?.type || 'Standard',
      };
    });

    const studentActiveAppsPayload = Object.values(activeApplicationsMap).map((app) => {
      const opp = OPPORTUNITY_LOOKUP.current.get(app.opportunityId);
      const completedTasks = Array.isArray(app.completedTasks) ? app.completedTasks : [];
      return {
        id: app.opportunityId,
        officialName: opp?.officialName || opp?.title || app.opportunityId,
        country: opp?.country || 'Global',
        stage: app.stage,
        completedTasksCount: completedTasks.length,
        totalTasksCount: 6,
        completedTasks,
        notes: app.notes,
        deadlineText: opp?.deadlines?.deadlineText || 'Rolling Admissions',
        feeStatus: opp?.applicationFees?.status || 'Standard',
        testStatus: opp?.testWaiverRules?.status || 'Standard',
        fundingType: opp?.fundingDetails?.type || 'Standard',
      };
    });

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
                preferredFieldsOfStudy: activeProfile.preferredFieldsOfStudy,
                graduationYear: activeProfile.graduationYear,
                currentSchool: activeProfile.currentSchool,
                fundingPreference: activeProfile.fundingPreference,
                fundingTypePreference: activeProfile.fundingTypePreference,
                studyModePreference: activeProfile.studyModePreference,
                testPreference: activeProfile.testPreference,
              }
            : undefined,
          studentSavedOpportunities: studentSavedPayload,
          studentTargetList: studentTargetListPayload,
          studentActiveApplications: studentActiveAppsPayload,
          stream: true,
        }),
        signal: controller.signal,
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

        setMessages((prev) => {
          const finalMsgs = prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  error: true,
                  errorMessage: errMsg,
                  content: errMsg,
                }
              : msg
          );
          syncActiveConversationToStorage(finalMsgs, undefined, targetConvId, targetUid);
          return finalMsgs;
        });
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
      let trackerOpportunities: OpportunityItem[] | undefined;
      let followUps: string[] | undefined;
      let receivedStreamError = false;
      let streamErrorMessage = '';

      const processSseFrame = (rawFrame: string) => {
        const trimmed = rawFrame.trim();
        if (!trimmed) return;

        if (trimmed.startsWith('event: error')) {
          const dataLine = trimmed.split(/\r?\n/).find((l) => l.startsWith('data:'));
          let parsedErrMsg = 'Unable to generate a response right now. Please try again.';
          if (dataLine) {
            try {
              const parsed = JSON.parse(dataLine.replace(/^data:\s*/, ''));
              if (parsed?.error) parsedErrMsg = 'COVA is temporarily unavailable right now. Please try again shortly.';
            } catch {}
          }
          receivedStreamError = true;
          streamErrorMessage = parsedErrMsg;
          return;
        }

        const dataLines = trimmed.split(/\r?\n/).filter((l) => l.startsWith('data:'));
        for (const dl of dataLines) {
          const rawData = dl.replace(/^data:\s*/, '').trim();
          if (!rawData || rawData === '[DONE]') continue;

          try {
            const parsed = JSON.parse(rawData);
            if (typeof parsed.chunk === 'string' && parsed.chunk.length > 0) {
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
            if (parsed.matchedOpportunities || parsed.trackerOpportunities || parsed.followUps) {
              matchedOpportunities = parsed.matchedOpportunities || matchedOpportunities;
              trackerOpportunities = parsed.trackerOpportunities || trackerOpportunities;
              followUps = parsed.followUps || followUps;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? {
                        ...msg,
                        opportunities: matchedOpportunities || msg.opportunities,
                        trackerOpportunities: trackerOpportunities || msg.trackerOpportunities,
                        followUps: followUps || msg.followUps,
                      }
                    : msg
                )
              );
            }
          } catch {}
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || '';

        for (const frame of frames) {
          processSseFrame(frame);
          if (receivedStreamError) break;
        }
        if (receivedStreamError) break;
      }

      // Flush any trailing SSE frame left in buffer after stream end
      if (!receivedStreamError && buffer.trim()) {
        processSseFrame(buffer);
      }

      if (receivedStreamError) {
        setMessages((prev) => {
          const errMsgs = prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  error: true,
                  errorMessage: streamErrorMessage,
                  content: streamErrorMessage,
                }
              : msg
          );
          syncActiveConversationToStorage(errMsgs, undefined, targetConvId, targetUid);
          return errMsgs;
        });
        return;
      }

      if (!accumulatedText.trim() && abortReasonRef.current !== 'stop') {
        const emptyErr = 'COVA could not complete that response right now. Please retry.';
        setMessages((prev) => {
          const errMsgs = prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  error: true,
                  errorMessage: emptyErr,
                  content: emptyErr,
                }
              : msg
          );
          syncActiveConversationToStorage(errMsgs, undefined, targetConvId, targetUid);
          return errMsgs;
        });
        return;
      }

      // Finalize streaming message state and sync to persistent storage
      setMessages((prev) => {
        const finalized = prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                isStreaming: false,
                opportunities: matchedOpportunities || msg.opportunities,
                trackerOpportunities: trackerOpportunities || msg.trackerOpportunities,
                followUps: followUps || msg.followUps,
              }
            : msg
        );
        syncActiveConversationToStorage(finalized, undefined, targetConvId, targetUid);
        return finalized;
      });
      setApiConfigured(true);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        if (abortReasonRef.current === 'timeout') {
          const timeoutMsg =
            'The request timed out while waiting for a response. Please click Retry to try again.';
          setMessages((prev) => {
            const errMsgs = prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    isStreaming: false,
                    error: true,
                    errorMessage: timeoutMsg,
                    content: timeoutMsg,
                  }
                : msg
            );
            syncActiveConversationToStorage(errMsgs, undefined, targetConvId, targetUid);
            return errMsgs;
          });
        }
        return;
      }

      const errorMessage =
        'COVA is temporarily unreachable. Please check your internet connection and try again.';

      setMessages((prev) => {
        const errorList = prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                isStreaming: false,
                error: true,
                errorMessage,
                content: errorMessage,
              }
            : msg
        );
        syncActiveConversationToStorage(errorList, undefined, targetConvId, targetUid);
        return errorList;
      });
    } finally {
      if (clientTimeoutRef.current) {
        clearTimeout(clientTimeoutRef.current);
        clientTimeoutRef.current = null;
      }
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      isSendingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText ?? inputMessage).trim();
    if (!textToSend || isSendingRef.current || isLoading) return;

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessageId = `user-${Date.now()}`;
    const botMessageId = `model-${Date.now()}`;

    const priorMessages = [...messages];
    const nextMessages: Message[] = [
      ...priorMessages,
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

    await executeChatRequest({
      textToSend,
      priorMessages,
      nextMessages,
      botMessageId,
      targetConvId: activeConvIdRef.current,
      targetUid: currentUserIdRef.current,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Regenerate response IN-PLACE for a user turn without appending duplicate user messages
  const regenerateResponse = async (userPromptIndex: number) => {
    if (isSendingRef.current || isLoading) return;
    const userMsg = messages[userPromptIndex];
    if (!userMsg || userMsg.role !== 'user') return;

    const priorMessages = messages.slice(0, userPromptIndex);
    const botMessageId = `model-${Date.now()}`;
    const nextMessages: Message[] = [
      ...priorMessages,
      userMsg,
      {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ];

    await executeChatRequest({
      textToSend: userMsg.content,
      priorMessages,
      nextMessages,
      botMessageId,
      targetConvId: activeConvIdRef.current,
      targetUid: currentUserIdRef.current,
    });
  };

  // Retry failed AI message IN-PLACE without appending a duplicate user prompt
  const retryFailedMessage = async (errorMsgIndex: number) => {
    if (isSendingRef.current || isLoading) return;
    let userPromptIndex = -1;
    for (let i = errorMsgIndex - 1; i >= 0; i--) {
      if (messages[i]?.role === 'user') {
        userPromptIndex = i;
        break;
      }
    }
    if (userPromptIndex === -1) return;
    await regenerateResponse(userPromptIndex);
  };

  return (
    <>
      <div
        className={`fixed flex flex-col items-end pointer-events-none ${
          isOpen
            ? 'inset-0 z-50 md:inset-auto md:bottom-6 md:right-6 md:z-40'
            : 'bottom-[76px] right-3 z-40 md:bottom-6 md:right-6'
        } ${className}`}
      >
        {/* 1. COVA Chat Panel Overlay (Responsive: Full-screen on mobile/small tablet, Card on md+) */}
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cova-chat-title"
            className="pointer-events-auto w-full h-[100dvh] md:w-[480px] md:h-[620px] md:max-h-[calc(100vh-5.5rem)] md:mb-3 bg-white rounded-none md:rounded-2xl shadow-[0_20px_50px_rgba(16,19,45,0.28)] border-0 md:border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in duration-200 relative"
          >
            {/* Slide-in Conversation History Drawer */}
            <CovaHistoryDrawer
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              conversations={conversations}
              activeConversationId={activeConvId}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              onRenameConversation={handleRenameConversation}
              onDeleteConversation={handleDeleteConversation}
              onClearAll={handleClearAllConversations}
            />

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
                      Admissions Advisor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate max-w-[210px] leading-tight">
                    Campus Opportunity &amp; Virtual Assistant
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* History Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="h-8 px-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  title="View conversation history"
                  aria-label="View conversation history"
                >
                  <History className="w-4 h-4 text-violet-300" />
                  <span className="hidden xs:inline">History</span>
                </button>

                {/* New Chat Button */}
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="New chat"
                  aria-label="New chat"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Target Tracker Button */}
                {onNavigateToTracker && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTracker();
                      setIsOpen(false);
                    }}
                    className="h-8 px-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    title="Open Target Tracker Board"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden xs:inline">Tracker</span>
                  </button>
                )}

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
            </div>

            {/* Profile & Tracker Status Banner */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {activeProfile?.intendedDegree ? (
                    <>
                      Target: <strong className="font-semibold text-slate-800">{activeProfile.intendedDegree}</strong>
                      {activeProfile.fieldOfStudy ? ` • ${activeProfile.fieldOfStudy}` : ''}
                    </>
                  ) : (
                    <span>International Scholar Advisor</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[10px] font-semibold text-[#6846F5] bg-violet-100/70 px-2 py-0.5 rounded-full whitespace-nowrap"
                  title="Synchronized with Active Applications, Target List, and Saved Opportunities"
                >
                  {Object.keys(activeApplicationsMap).length} Active · {Object.keys(targetListMap).length} Targets · {savedIds.size} Saved
                </span>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-sm">
              {/* Trust Badge */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-0.5 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#E7B75C]" />
                  Synced Student Advisor
                </span>
              </div>

              {/* Message History */}
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start w-full'
                  } animate-in fade-in duration-150 group/msg`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6846F5] to-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start w-full'}`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs leading-relaxed text-xs sm:text-[13px] relative ${
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
                              disabled={isLoading}
                              onClick={() => void retryFailedMessage(index)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 disabled:opacity-50 font-medium text-[11px] cursor-pointer transition-colors shadow-2xs"
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

                          {/* Interactive Tracker Cards Section */}
                          {msg.trackerOpportunities && msg.trackerOpportunities.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                                <span className="flex items-center gap-1.5 text-[#10132D]">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  Your Tracked Applications ({msg.trackerOpportunities.length})
                                </span>
                                {onNavigateToTracker && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onNavigateToTracker();
                                      setIsOpen(false);
                                    }}
                                    className="text-[10px] text-[#6846F5] hover:underline font-semibold cursor-pointer"
                                  >
                                    View Board &rarr;
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2">
                                {msg.trackerOpportunities.map((opp) => (
                                  <CovaTrackerCard
                                    key={opp.id}
                                    item={opp}
                                    currentStage={
                                      activeApplicationsMap[opp.id]?.stage ||
                                      trackerMap[opp.id] ||
                                      'saved'
                                    }
                                    onUpdateStage={handleUpdateStage}
                                    onViewDetails={handleViewDetails}
                                    onNavigateToTracker={onNavigateToTracker}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interactive Opportunity Discovery Cards */}
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
                                Suggested Next Steps
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

                    {/* Message Action Bar (Copy & Regenerate Controls) */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-1 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-between'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {msg.role === 'model' && !msg.isStreaming && msg.content && (
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover/msg:opacity-100 focus-within:opacity-100 transition-opacity">
                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={() => void handleCopyMessage(msg.id, msg.content)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Copy response"
                            aria-label="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>

                          {/* Regenerate Button */}
                          {index > 0 && messages[index - 1]?.role === 'user' && (
                            <button
                              type="button"
                              onClick={() => void regenerateResponse(index - 1)}
                              disabled={isLoading}
                              className="p-1 rounded text-slate-400 hover:text-[#6846F5] hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-40"
                              title="Regenerate response"
                              aria-label="Regenerate response"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Starter Quick Discovery & Guidance Prompts */}
              {messages.length <= 2 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1">
                    Application Guidance &amp; Tracker
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {starterPrompts.map((item) => (
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

              {/* Offline Advisor Notice */}
              {apiConfigured === false && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 text-[11px]">COVA Advisor Offline</p>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Live AI responses are temporarily unavailable right now. You can still browse verified programs, scholarships, and deadlines.
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
                  placeholder="Ask about your applications, SOP outline, deadlines..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none max-h-28 py-1 leading-normal"
                  aria-label="Ask COVA a question"
                />

                {/* Submit or Stop Generating Button */}
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors shadow-2xs"
                    title="Stop generating"
                    aria-label="Stop generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-8 h-8 rounded-lg bg-[#6846F5] hover:bg-[#5835ea] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shrink-0 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="truncate">Saved to student account</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Floating Action Button (FAB) */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto group relative flex items-center gap-2 h-11 sm:h-12 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#6846F5] via-[#7B59F8] to-[#8065FF] text-white shadow-[0_8px_25px_rgba(104,70,245,0.35)] hover:shadow-[0_10px_30px_rgba(104,70,245,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] focus-visible:ring-offset-2"
            aria-label="Open COVA AI assistant"
            aria-expanded={false}
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
        )}
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
