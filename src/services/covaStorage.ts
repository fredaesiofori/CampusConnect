/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { authenticOpportunities, OpportunityItem } from '../data/opportunities';
import {
  auth,
  fetchCovaConversationsFromFirestore,
  saveCovaConversationToFirestore,
  deleteCovaConversationFromFirestore,
  clearAllCovaConversationsInFirestore,
  FirestoreCovaConversation,
} from './firebase';

export interface StoredMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  error?: boolean;
  errorMessage?: string;
  opportunityIds?: string[];
  trackerOpportunityIds?: string[];
  opportunities?: OpportunityItem[];
  trackerOpportunities?: OpportunityItem[];
  followUps?: string[];
}

export interface CovaConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
}

const STORAGE_PREFIX = 'campusconnect_cova_convs_';
const ACTIVE_CONV_PREFIX = 'campusconnect_cova_active_';

const OPPORTUNITY_INDEX = new Map<string, OpportunityItem>(
  authenticOpportunities.map((opp) => [opp.id, opp])
);

function getStorageKey(userId: string): string {
  const cleanId = userId || 'anonymous_scholar';
  return `${STORAGE_PREFIX}${cleanId}`;
}

function getActiveKey(userId: string): string {
  const cleanId = userId || 'anonymous_scholar';
  return `${ACTIVE_CONV_PREFIX}${cleanId}`;
}

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function canSyncToCloud(userId: string): boolean {
  const fbUser = auth.currentUser;
  return Boolean(fbUser && !fbUser.isAnonymous && userId && fbUser.uid === userId);
}

export function hydrateStoredMessage(m: StoredMessage): StoredMessage {
  const hydratedOpps =
    Array.isArray(m.opportunities) && m.opportunities.length > 0
      ? m.opportunities
      : Array.isArray(m.opportunityIds)
      ? m.opportunityIds
          .map((id) => OPPORTUNITY_INDEX.get(id))
          .filter((item): item is OpportunityItem => Boolean(item))
      : undefined;

  const hydratedTrackerOpps =
    Array.isArray(m.trackerOpportunities) && m.trackerOpportunities.length > 0
      ? m.trackerOpportunities
      : Array.isArray(m.trackerOpportunityIds)
      ? m.trackerOpportunityIds
          .map((id) => OPPORTUNITY_INDEX.get(id))
          .filter((item): item is OpportunityItem => Boolean(item))
      : undefined;

  return {
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    ...(m.error ? { error: true } : {}),
    ...(m.errorMessage ? { errorMessage: m.errorMessage } : {}),
    ...(hydratedOpps && hydratedOpps.length > 0
      ? {
          opportunities: hydratedOpps,
          opportunityIds: hydratedOpps.map((o) => o.id),
        }
      : m.opportunityIds && m.opportunityIds.length > 0
      ? { opportunityIds: m.opportunityIds }
      : {}),
    ...(hydratedTrackerOpps && hydratedTrackerOpps.length > 0
      ? {
          trackerOpportunities: hydratedTrackerOpps,
          trackerOpportunityIds: hydratedTrackerOpps.map((o) => o.id),
        }
      : m.trackerOpportunityIds && m.trackerOpportunityIds.length > 0
      ? { trackerOpportunityIds: m.trackerOpportunityIds }
      : {}),
    ...(Array.isArray(m.followUps) && m.followUps.length > 0 ? { followUps: m.followUps } : {}),
  };
}

export function compactStoredMessage(m: StoredMessage): StoredMessage {
  const opportunityIds = Array.isArray(m.opportunityIds)
    ? m.opportunityIds.filter(Boolean).slice(0, 8)
    : Array.isArray(m.opportunities)
    ? m.opportunities.map((o) => o.id).filter(Boolean).slice(0, 8)
    : undefined;

  const trackerOpportunityIds = Array.isArray(m.trackerOpportunityIds)
    ? m.trackerOpportunityIds.filter(Boolean).slice(0, 8)
    : Array.isArray(m.trackerOpportunities)
    ? m.trackerOpportunities.map((o) => o.id).filter(Boolean).slice(0, 8)
    : undefined;

  return {
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    ...(m.error ? { error: true } : {}),
    ...(m.errorMessage ? { errorMessage: m.errorMessage } : {}),
    ...(opportunityIds && opportunityIds.length > 0 ? { opportunityIds } : {}),
    ...(trackerOpportunityIds && trackerOpportunityIds.length > 0 ? { trackerOpportunityIds } : {}),
    ...(Array.isArray(m.followUps) && m.followUps.length > 0
      ? { followUps: m.followUps.slice(0, 6) }
      : {}),
  };
}

export function hydrateConversation(conv: CovaConversation | FirestoreCovaConversation): CovaConversation {
  return {
    id: conv.id,
    userId: conv.userId,
    title: conv.title || 'Conversation',
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
    messages: Array.isArray(conv.messages) ? conv.messages.map((m) => hydrateStoredMessage(m)) : [],
  };
}

export function mergeConversationLists(
  userId: string,
  cloudList: CovaConversation[],
  localList: CovaConversation[]
): { merged: CovaConversation[]; localAdditionsToPush: CovaConversation[] } {
  const map = new Map<string, CovaConversation>();
  const cloudIds = new Set<string>();

  for (const conv of cloudList) {
    if (!conv || !conv.id) continue;
    cloudIds.add(conv.id);
    map.set(conv.id, hydrateConversation({ ...conv, userId }));
  }

  const localAdditionsToPush: CovaConversation[] = [];

  for (const localConv of localList) {
    if (!localConv || !localConv.id) continue;
    const normalizedLocal = hydrateConversation({ ...localConv, userId });
    const hasUserTurns = normalizedLocal.messages.some((m) => m.role === 'user' && m.content.trim() !== '');
    const existing = map.get(normalizedLocal.id);

    if (!existing) {
      map.set(normalizedLocal.id, normalizedLocal);
      if (hasUserTurns) {
        localAdditionsToPush.push(normalizedLocal);
      }
    } else {
      const localUpdated = new Date(normalizedLocal.updatedAt).getTime() || 0;
      const cloudUpdated = new Date(existing.updatedAt).getTime() || 0;
      const shouldPreferLocal =
        localUpdated > cloudUpdated && normalizedLocal.messages.length >= existing.messages.length;

      if (shouldPreferLocal) {
        // Preserve cloud's immutable createdAt for Firestore update rules
        const mergedConv: CovaConversation = {
          ...normalizedLocal,
          createdAt: existing.createdAt,
        };
        map.set(normalizedLocal.id, mergedConv);
        if (hasUserTurns) {
          localAdditionsToPush.push(mergedConv);
        }
      }
    }
  }

  const merged = Array.from(map.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 50);

  return { merged, localAdditionsToPush };
}

function writeConversationsCache(userId: string, list: CovaConversation[]): void {
  if (!hasLocalStorage()) return;
  try {
    const compacted = list.slice(0, 50).map((c) => ({
      ...c,
      messages: c.messages.map((m) => compactStoredMessage(m)),
    }));
    localStorage.setItem(getStorageKey(userId), JSON.stringify(compacted));
  } catch (e) {
    console.warn('Failed to write COVA conversation cache:', e);
  }
}

export const covaStorage = {
  // Load all conversations for a specific authenticated student from local cache
  getConversations(userId: string): CovaConversation[] {
    if (!hasLocalStorage()) return [];
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      if (!raw) return [];
      const parsed: CovaConversation[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((c) => hydrateConversation(c))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (e) {
      console.warn('Failed to parse COVA conversations from storage:', e);
      return [];
    }
  },

  // Get active conversation ID for a student
  getActiveConversationId(userId: string): string | null {
    if (!hasLocalStorage()) return null;
    try {
      return localStorage.getItem(getActiveKey(userId));
    } catch {
      return null;
    }
  },

  // Set active conversation ID for a student
  setActiveConversationId(userId: string, conversationId: string): void {
    if (!hasLocalStorage()) return;
    try {
      localStorage.setItem(getActiveKey(userId), conversationId);
    } catch {}
  },

  // Get a specific conversation
  getConversation(userId: string, conversationId: string): CovaConversation | null {
    const list = this.getConversations(userId);
    return list.find((c) => c.id === conversationId) || null;
  },

  // Save or update a conversation locally
  saveConversation(userId: string, conversation: CovaConversation): CovaConversation {
    const now = new Date().toISOString();
    const updatedConv: CovaConversation = hydrateConversation({
      ...conversation,
      userId,
      updatedAt: conversation.updatedAt || now,
    });

    const list = this.getConversations(userId);
    const existingIdx = list.findIndex((c) => c.id === updatedConv.id);

    let newList: CovaConversation[];
    if (existingIdx >= 0) {
      newList = [...list];
      newList[existingIdx] = {
        ...updatedConv,
        createdAt: list[existingIdx].createdAt || updatedConv.createdAt,
        updatedAt: now,
      };
    } else {
      newList = [{ ...updatedConv, updatedAt: now }, ...list];
    }

    if (newList.length > 50) {
      newList = newList.slice(0, 50);
    }

    writeConversationsCache(userId, newList);
    this.setActiveConversationId(userId, updatedConv.id);
    return newList.find((c) => c.id === updatedConv.id) || updatedConv;
  },

  // Save locally AND persist to Firestore account for cross-device sync
  async saveConversationSynced(userId: string, conversation: CovaConversation): Promise<boolean> {
    const savedLocal = this.saveConversation(userId, conversation);
    if (!canSyncToCloud(userId)) {
      return false;
    }
    return saveCovaConversationToFirestore(userId, {
      ...savedLocal,
      messages: savedLocal.messages.map((m) => compactStoredMessage(m)),
    });
  },

  // Create a brand new conversation locally
  createConversation(userId: string, initialWelcome: string, title = 'New Conversation'): CovaConversation {
    const now = new Date().toISOString();
    const newConv: CovaConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      title,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          content: initialWelcome,
          timestamp: now,
        },
      ],
    };

    return this.saveConversation(userId, newConv);
  },

  // Rename a conversation locally
  renameConversation(userId: string, conversationId: string, newTitle: string): CovaConversation | null {
    const list = this.getConversations(userId);
    const target = list.find((c) => c.id === conversationId);
    if (!target) return null;

    target.title = newTitle.trim().slice(0, 160) || 'Conversation';
    target.updatedAt = new Date().toISOString();
    writeConversationsCache(userId, list);
    return target;
  },

  // Rename locally AND persist to Firestore
  async renameConversationSynced(
    userId: string,
    conversationId: string,
    newTitle: string
  ): Promise<boolean> {
    const updated = this.renameConversation(userId, conversationId, newTitle);
    if (!updated || !canSyncToCloud(userId)) {
      return false;
    }
    return saveCovaConversationToFirestore(userId, {
      ...updated,
      messages: updated.messages.map((m) => compactStoredMessage(m)),
    });
  },

  // Delete a specific conversation locally
  deleteConversation(userId: string, conversationId: string): boolean {
    const list = this.getConversations(userId);
    const filtered = list.filter((c) => c.id !== conversationId);
    writeConversationsCache(userId, filtered);
    if (hasLocalStorage()) {
      const activeId = this.getActiveConversationId(userId);
      if (activeId === conversationId) {
        const nextActive = filtered[0]?.id || '';
        if (nextActive) {
          this.setActiveConversationId(userId, nextActive);
        } else {
          try {
            localStorage.removeItem(getActiveKey(userId));
          } catch {}
        }
      }
    }
    return true;
  },

  // Delete locally AND remove from Firestore
  async deleteConversationSynced(userId: string, conversationId: string): Promise<boolean> {
    this.deleteConversation(userId, conversationId);
    if (!canSyncToCloud(userId)) {
      return false;
    }
    return deleteCovaConversationFromFirestore(userId, conversationId);
  },

  // Clear all conversations for the student locally
  clearAllConversations(userId: string): boolean {
    if (!hasLocalStorage()) return true;
    try {
      localStorage.removeItem(getStorageKey(userId));
      localStorage.removeItem(getActiveKey(userId));
      return true;
    } catch {
      return false;
    }
  },

  // Clear all locally AND wipe user's Firestore covaConversations subcollection
  async clearAllConversationsSynced(userId: string): Promise<boolean> {
    this.clearAllConversations(userId);
    if (!canSyncToCloud(userId)) {
      return false;
    }
    return clearAllCovaConversationsInFirestore(userId);
  },

  // Load & merge conversations from Firestore + local cache + safe legacy key migration
  async loadConversationsSynced(
    userId: string,
    legacyLocalKeys: string[] = []
  ): Promise<CovaConversation[]> {
    const localOwn = this.getConversations(userId);

    // Collect pre-existing local conversations stored under legacy keys (e.g., anonymous_scholar or email)
    // Only migrate conversations that contain at least one real student message
    const migratedFromLegacy: CovaConversation[] = [];
    const cleanedLegacyKeys = Array.from(new Set(legacyLocalKeys)).filter(
      (k) => Boolean(k) && k !== userId
    );
    for (const legacyKey of cleanedLegacyKeys) {
      const legacyConvs = this.getConversations(legacyKey);
      for (const lc of legacyConvs) {
        const hasRealMessages = lc.messages.some((m) => m.role === 'user' && m.content.trim() !== '');
        if (hasRealMessages && !localOwn.some((own) => own.id === lc.id)) {
          migratedFromLegacy.push({ ...lc, userId });
        }
      }
    }

    const combinedLocal = [...localOwn, ...migratedFromLegacy];

    if (!canSyncToCloud(userId)) {
      if (migratedFromLegacy.length > 0) {
        writeConversationsCache(userId, combinedLocal);
        cleanedLegacyKeys.forEach((k) => this.clearAllConversations(k));
      }
      return this.getConversations(userId);
    }

    const cloudRaw = await fetchCovaConversationsFromFirestore(userId);
    const cloudList = cloudRaw.map((c) => hydrateConversation(c));
    const { merged, localAdditionsToPush } = mergeConversationLists(userId, cloudList, combinedLocal);

    writeConversationsCache(userId, merged);

    // Push any local-only or migrated conversations to Firestore safely in the background
    if (localAdditionsToPush.length > 0) {
      await Promise.allSettled(
        localAdditionsToPush.map((conv) =>
          saveCovaConversationToFirestore(userId, {
            ...conv,
            messages: conv.messages.map((m) => compactStoredMessage(m)),
          })
        )
      );
    }

    // Remove legacy keys only after migration has merged into userId's cache/cloud
    if (migratedFromLegacy.length > 0) {
      cleanedLegacyKeys.forEach((k) => this.clearAllConversations(k));
    }

    return merged;
  },
};
