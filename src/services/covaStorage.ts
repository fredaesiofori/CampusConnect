/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpportunityItem } from '../data/opportunities';

export interface StoredMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  error?: boolean;
  errorMessage?: string;
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

function getStorageKey(userId: string): string {
  const cleanId = userId || 'anonymous_scholar';
  return `${STORAGE_PREFIX}${cleanId}`;
}

function getActiveKey(userId: string): string {
  const cleanId = userId || 'anonymous_scholar';
  return `${ACTIVE_CONV_PREFIX}${cleanId}`;
}

export const covaStorage = {
  // Load all conversations for a specific authenticated student
  getConversations(userId: string): CovaConversation[] {
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      if (!raw) return [];
      const parsed: CovaConversation[] = JSON.parse(raw);
      // Ensure sorted by updatedAt descending
      return parsed.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.warn('Failed to parse COVA conversations from storage:', e);
      return [];
    }
  },

  // Get active conversation ID for a student
  getActiveConversationId(userId: string): string | null {
    try {
      return localStorage.getItem(getActiveKey(userId));
    } catch {
      return null;
    }
  },

  // Set active conversation ID for a student
  setActiveConversationId(userId: string, conversationId: string): void {
    try {
      localStorage.setItem(getActiveKey(userId), conversationId);
    } catch {}
  },

  // Get a specific conversation
  getConversation(userId: string, conversationId: string): CovaConversation | null {
    const list = this.getConversations(userId);
    return list.find((c) => c.id === conversationId) || null;
  },

  // Save or update a conversation
  saveConversation(userId: string, conversation: CovaConversation): void {
    try {
      const list = this.getConversations(userId);
      const existingIdx = list.findIndex((c) => c.id === conversation.id);
      const updatedConv: CovaConversation = {
        ...conversation,
        updatedAt: new Date().toISOString(),
      };

      let newList: CovaConversation[];
      if (existingIdx >= 0) {
        newList = [...list];
        newList[existingIdx] = updatedConv;
      } else {
        newList = [updatedConv, ...list];
      }

      // Limit stored conversations to 30 per student to preserve storage
      if (newList.length > 30) {
        newList = newList.slice(0, 30);
      }

      localStorage.setItem(getStorageKey(userId), JSON.stringify(newList));
      this.setActiveConversationId(userId, conversation.id);
    } catch (e) {
      console.warn('Failed to save COVA conversation to storage:', e);
    }
  },

  // Create a brand new conversation
  createConversation(userId: string, initialWelcome: string, title = 'New Conversation'): CovaConversation {
    const newConv: CovaConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          content: initialWelcome,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    this.saveConversation(userId, newConv);
    return newConv;
  },

  // Rename a conversation
  renameConversation(userId: string, conversationId: string, newTitle: string): boolean {
    const list = this.getConversations(userId);
    const target = list.find((c) => c.id === conversationId);
    if (!target) return false;

    target.title = newTitle.trim() || 'Conversation';
    target.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  // Delete a specific conversation
  deleteConversation(userId: string, conversationId: string): boolean {
    const list = this.getConversations(userId);
    const filtered = list.filter((c) => c.id !== conversationId);
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(filtered));
      const activeId = this.getActiveConversationId(userId);
      if (activeId === conversationId) {
        const nextActive = filtered[0]?.id || '';
        if (nextActive) {
          this.setActiveConversationId(userId, nextActive);
        } else {
          localStorage.removeItem(getActiveKey(userId));
        }
      }
      return true;
    } catch {
      return false;
    }
  },

  // Clear all conversations for the student (Right to erasure / privacy)
  clearAllConversations(userId: string): boolean {
    try {
      localStorage.removeItem(getStorageKey(userId));
      localStorage.removeItem(getActiveKey(userId));
      return true;
    } catch {
      return false;
    }
  },
};
