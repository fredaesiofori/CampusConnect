/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CovaConversation } from '../../services/covaStorage';

export interface CovaHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: CovaConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
}

export const CovaHistoryDrawer: React.FC<CovaHistoryDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onClearAll,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRename = (conv: CovaConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (id: string, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
    setDeletingId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <div className="absolute inset-0 z-30 bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="bg-[#10132D] text-white px-4 py-3 flex items-center justify-between border-b border-[#25254D] shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Back to conversation"
            aria-label="Back to conversation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#A855F7]" />
              Saved Conversations
            </h3>
            <p className="text-[10px] text-slate-300">
              {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'} stored in your account
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6846F5] hover:bg-[#5835ea] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/60">
        {conversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-600">No past conversations yet</p>
            <p className="text-[11px] text-slate-400 max-w-[220px]">
              Your questions, scholarship searches, and advice will be saved automatically here.
            </p>
            <button
              type="button"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#6846F5] text-white text-xs font-medium cursor-pointer hover:bg-[#5835ea] transition-colors"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isEditing = editingId === conv.id;
            const isDeleting = deletingId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isEditing && !isDeleting) {
                    onSelectConversation(conv.id);
                    onClose();
                  }
                }}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer relative text-left ${
                  isActive
                    ? 'bg-white border-[#6846F5] shadow-xs ring-1 ring-[#6846F5]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {isEditing ? (
                  <form onSubmit={(e) => handleSaveRename(conv.id, e)} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                      className="flex-1 bg-slate-50 border border-[#6846F5] rounded-md px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded bg-[#6846F5] text-white hover:bg-[#5835ea]"
                      title="Save title"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelRename}
                      className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : isDeleting ? (
                  <div className="flex items-center justify-between gap-2 p-1 text-[11px] text-rose-800 bg-rose-50 rounded-lg">
                    <span>Delete this chat?</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleConfirmDelete(conv.id, e)}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-[10px]"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelDelete}
                        className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {conv.title}
                        </h4>
                        {isActive && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-violet-100 text-[#6846F5] px-1.5 py-0.2 rounded shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                        <span>
                          {new Date(conv.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {conv.messages.length} {conv.messages.length === 1 ? 'message' : 'messages'}
                        </span>
                      </p>
                    </div>

                    {/* Action buttons (Rename, Delete) */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(conv, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Rename conversation"
                        aria-label="Rename conversation"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(conv.id, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete conversation"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Privacy & Clear All */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
        {confirmClearAll ? (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px]">
                Are you sure you want to delete <strong>all</strong> conversation history? This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmClearAll(false)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-[11px] font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmClearAll(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold cursor-pointer shadow-2xs"
              >
                Clear All History
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-[#E7B75C] shrink-0" />
              Private to your account
            </span>

            {conversations.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="text-rose-600 hover:text-rose-700 hover:underline text-[10px] font-medium cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
