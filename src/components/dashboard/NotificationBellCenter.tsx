/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  FileCheck,
  Info,
  Settings,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  StudentNotificationCategory,
  StudentNotificationRecord,
  formatRelativeNotificationTime,
} from '../../services/notifications';

export type NotificationFilterTab =
  | 'all'
  | 'unread'
  | 'deadline'
  | 'opportunity'
  | 'application'
  | 'history';

export interface NotificationBellCenterProps {
  notifications: StudentNotificationRecord[];
  onMarkAsRead: (notificationId: string, read: boolean) => Promise<void> | void;
  onMarkAllRead: () => Promise<void> | void;
  onDeleteNotification: (notificationId: string) => Promise<void> | void;
  onClearAllNotifications: () => Promise<void> | void;
  onNavigateNotification: (notification: StudentNotificationRecord) => void;
  onOpenNotificationSettings: () => void;
}

function getCategoryIcon(category: StudentNotificationCategory) {
  switch (category) {
    case 'deadline':
      return <Clock className="w-4 h-4 text-amber-600" />;
    case 'opportunity':
      return <Sparkles className="w-4 h-4 text-[#6846F5]" />;
    case 'application':
      return <FileCheck className="w-4 h-4 text-blue-600" />;
    case 'requirement':
      return <Info className="w-4 h-4 text-emerald-600" />;
    default:
      return <Bell className="w-4 h-4 text-slate-600" />;
  }
}

function getCategoryIconBg(category: StudentNotificationCategory): string {
  switch (category) {
    case 'deadline':
      return 'bg-amber-50 border-amber-200/70';
    case 'opportunity':
      return 'bg-[#F0EDFF] border-[#DDD6FE]';
    case 'application':
      return 'bg-blue-50 border-blue-200/70';
    case 'requirement':
      return 'bg-emerald-50 border-emerald-200/70';
    default:
      return 'bg-slate-100 border-slate-200';
  }
}

function getCategoryLabel(category: StudentNotificationCategory): string {
  switch (category) {
    case 'deadline':
      return 'Deadline Reminder';
    case 'opportunity':
      return 'Opportunity Match';
    case 'application':
      return 'Application Progress';
    case 'requirement':
      return 'Requirement Update';
    default:
      return 'Portal Notice';
  }
}

export const NotificationBellCenter: React.FC<NotificationBellCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onDeleteNotification,
  onClearAllNotifications,
  onNavigateNotification,
  onOpenNotificationSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationFilterTab>('all');
  const [confirmClear, setConfirmClear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'deadline':
        return notifications.filter((n) => n.category === 'deadline');
      case 'opportunity':
        return notifications.filter(
          (n) => n.category === 'opportunity' || n.category === 'requirement'
        );
      case 'application':
        return notifications.filter((n) => n.category === 'application');
      case 'history':
        return notifications.filter((n) => n.read);
      case 'all':
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRowClick = async (item: StudentNotificationRecord) => {
    if (!item.read) {
      await onMarkAsRead(item.id, true);
    }
    setIsOpen(false);
    onNavigateNotification(item);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        className={`relative w-11 h-11 min-w-[44px] min-h-[44px] sm:w-10 sm:h-10 sm:min-w-0 sm:min-h-0 rounded-full sm:rounded-xl border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] ${
          isOpen
            ? 'bg-[#F0EDFF] border-[#6846F5] text-[#6846F5]'
            : 'bg-transparent sm:bg-white border-transparent sm:border-slate-200 text-[#10132D] sm:text-slate-600 hover:text-[#10132D] hover:bg-slate-100 sm:hover:bg-slate-50'
        }`}
      >
        <Bell className="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px]" />
        {unreadCount > 0 && (
          <span
            data-testid="notification-unread-badge"
            className="absolute top-1 right-1 sm:-top-1.5 sm:-right-1.5 min-w-[17px] sm:min-w-[20px] h-[17px] sm:h-5 px-1 rounded-full bg-[#EF4444] sm:bg-[#6846F5] text-white text-[9.5px] sm:text-[10px] font-bold flex items-center justify-center shadow-xs tabular-nums border-2 border-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#10132D]/25 backdrop-blur-[1px] z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Notification Drawer / Dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notification Centre"
          className="fixed inset-x-3 top-[72px] max-h-[calc(100vh-88px)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[420px] sm:max-h-[min(560px,calc(100vh-96px))] z-40 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] bg-[#F8F9FD] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-display text-[#10132D]">Notifications</h2>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  · {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => onMarkAllRead()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#6846F5] hover:bg-[#F0EDFF] transition-colors cursor-pointer"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}

              {notifications.length > 0 && !confirmClear && (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Clear notifications"
                >
                  Clear
                </button>
              )}

              {confirmClear && (
                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">
                  <button
                    type="button"
                    onClick={async () => {
                      await onClearAllNotifications();
                      setConfirmClear(false);
                    }}
                    className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                  <span className="text-rose-300">/</span>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="text-[11px] font-medium text-slate-600 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 border-b border-slate-100 bg-white flex items-center gap-1 overflow-x-auto scrollbar-none">
            {(
              [
                { id: 'all', label: `All (${notifications.length})` },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'deadline', label: 'Deadlines' },
                { id: 'opportunity', label: 'Matches' },
                { id: 'application', label: 'Applications' },
                { id: 'history', label: 'History' },
              ] as const
            ).map((tab) => {
              const selected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#10132D] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#10132D]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Notification Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-10 text-center space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F9FD] border border-[#E2E8F0] text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#10132D]">
                  {activeFilter === 'unread'
                    ? 'No unread notifications'
                    : activeFilter === 'history'
                    ? 'No notification history yet'
                    : 'No notifications yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {activeFilter === 'unread'
                    ? 'You have reviewed all current reminders and alerts.'
                    : 'Bookmark opportunities, set Target List goals, or start an application to track verified deadlines and personalized matches.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !item.read;
                return (
                  <div
                    key={item.id}
                    className={`group px-4 py-3.5 transition-colors flex items-start gap-3 ${
                      isUnread
                        ? 'bg-[#F8F7FF] hover:bg-[#F1EEFF]/80'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getCategoryIconBg(
                        item.category
                      )}`}
                    >
                      {getCategoryIcon(item.category)}
                    </div>

                    {/* Content & Click-to-Navigate */}
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => void handleRowClick(item)}
                        className="w-full text-left space-y-1 cursor-pointer focus-visible:outline-none focus-visible:underline"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs leading-snug line-clamp-2 ${
                              isUnread
                                ? 'font-bold text-[#10132D]'
                                : 'font-semibold text-slate-700'
                            }`}
                          >
                            {isUnread && (
                              <span
                                className="inline-block w-1.5 h-1.5 rounded-full bg-[#6846F5] mr-1.5 align-middle"
                                aria-label="Unread"
                              />
                            )}
                            {item.title}
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {item.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-400 font-medium pt-0.5">
                          <span
                            className={
                              item.priority === 'urgent'
                                ? 'text-amber-700 font-bold'
                                : 'text-slate-500'
                            }
                          >
                            {getCategoryLabel(item.category)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formatRelativeNotificationTime(item.createdAt)}</span>
                          {item.opportunityId && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-0.5 text-[#6846F5] font-semibold">
                                Open <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Per-Item Actions */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void onMarkAsRead(item.id, !item.read);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isUnread
                            ? 'text-[#6846F5] hover:bg-[#E7E0FF]'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                        title={isUnread ? 'Mark as read' : 'Mark as unread'}
                        aria-label={isUnread ? 'Mark as read' : 'Mark as unread'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void onDeleteNotification(item.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8F9FD] flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {notifications.length > 0
                ? `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`
                : 'Verified account alerts'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenNotificationSettings();
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6846F5] hover:underline cursor-pointer py-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Notification Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
