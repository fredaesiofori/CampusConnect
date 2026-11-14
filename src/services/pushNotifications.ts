/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, isSupported } from 'firebase/messaging';
import firebaseConfigData from '../../firebase-applet-config.json';
import {
  deleteStudentPushTokenFromFirestore,
  saveStudentPushTokenToFirestore,
  StudentPushTokenRecord,
} from './firebase';

export type BrowserPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export interface PushCapabilityStatus {
  browserSupported: boolean;
  serviceWorkerSupported: boolean;
  permissionState: BrowserPermissionState;
  vapidKeyConfigured: boolean;
  serverDispatchConfigured: boolean;
  canRegisterFcmToken: boolean;
  summary: string;
}

const TOKEN_STORAGE_KEY_PREFIX = 'cc_fcm_token_id_v1_';

function getConfiguredVapidKey(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  return (metaEnv?.VITE_FIREBASE_VAPID_KEY || '').trim();
}

function makeDeviceTokenDocId(token: string): string {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `web_${(hash >>> 0).toString(36)}`;
}

export async function getPushCapabilityStatus(): Promise<PushCapabilityStatus> {
  const hasWindow = typeof window !== 'undefined';
  const hasNotification = hasWindow && 'Notification' in window;
  const serviceWorkerSupported = hasWindow && 'serviceWorker' in navigator;

  let fcmSupported = false;
  if (hasWindow && hasNotification && serviceWorkerSupported) {
    try {
      fcmSupported = await isSupported();
    } catch {
      fcmSupported = false;
    }
  }

  const permissionState: BrowserPermissionState = hasNotification
    ? (Notification.permission as BrowserPermissionState)
    : 'unsupported';

  const vapidKey = getConfiguredVapidKey();
  const vapidKeyConfigured = vapidKey.length > 0;
  // Server-side Firebase Admin messaging dispatch is disabled until deployment with Admin credentials + VAPID key
  const serverDispatchConfigured = false;
  const canRegisterFcmToken = fcmSupported && serviceWorkerSupported && vapidKeyConfigured;

  let summary = '';
  if (!hasNotification || !serviceWorkerSupported || !fcmSupported) {
    summary = 'This browser environment does not support Web Push notifications.';
  } else if (permissionState === 'denied') {
    summary = 'Browser notification permission is blocked in your browser site settings.';
  } else if (!vapidKeyConfigured) {
    summary =
      'Browser permission can be enabled for active sessions, but background FCM push delivery remains disabled until a Web Push VAPID key and deployed Firebase Admin service are configured.';
  } else {
    summary =
      'Browser push token registration is available; background push dispatch awaits deployed Firebase Admin credentials.';
  }

  return {
    browserSupported: fcmSupported && hasNotification,
    serviceWorkerSupported,
    permissionState,
    vapidKeyConfigured,
    serverDispatchConfigured,
    canRegisterFcmToken,
    summary,
  };
}

export interface EnablePushResult {
  success: boolean;
  permissionState: BrowserPermissionState;
  tokenRegistered: boolean;
  tokenId?: string;
  message: string;
  error?: string;
}

/**
 * MUST only be called in direct response to a user button click.
 */
export async function enableBrowserPushNotifications(userId: string): Promise<EnablePushResult> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      success: false,
      permissionState: 'unsupported',
      tokenRegistered: false,
      error: 'Browser notifications are not supported on this device or browser.',
      message: 'Browser notifications are unsupported.',
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      permissionState: permission as BrowserPermissionState,
      tokenRegistered: false,
      error:
        permission === 'denied'
          ? 'Notification permission was denied. You can re-enable it in your browser site settings.'
          : 'Notification permission prompt was dismissed.',
      message: 'Browser notifications were not granted.',
    };
  }

  const vapidKey = getConfiguredVapidKey();
  const canUseFcm = 'serviceWorker' in navigator && (await isSupported().catch(() => false));

  if (!canUseFcm || !vapidKey) {
    return {
      success: true,
      permissionState: 'granted',
      tokenRegistered: false,
      message:
        'Browser permission granted. Background push delivery remains disabled until Web Push VAPID key & deployed notification server are configured.',
    };
  }

  try {
    const swParams = new URLSearchParams({
      apiKey: firebaseConfigData.apiKey,
      authDomain: firebaseConfigData.authDomain,
      projectId: firebaseConfigData.projectId,
      messagingSenderId: firebaseConfigData.messagingSenderId,
      appId: firebaseConfigData.appId,
    });
    const swReg = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${swParams.toString()}`
    );
    const messaging = getMessaging(getApp());
    const fcmToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg,
    });

    if (!fcmToken) {
      return {
        success: true,
        permissionState: 'granted',
        tokenRegistered: false,
        message: 'Permission granted, but no FCM device token was issued by the browser.',
      };
    }

    const tokenId = makeDeviceTokenDocId(fcmToken);
    const nowIso = new Date().toISOString();
    const record: StudentPushTokenRecord = {
      id: tokenId,
      userId,
      token: fcmToken,
      platform: navigator.platform || 'web',
      permissionState: 'granted',
      enabled: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await saveStudentPushTokenToFirestore(userId, record);
    try {
      localStorage.setItem(`${TOKEN_STORAGE_KEY_PREFIX}${userId}`, tokenId);
    } catch {
      // Ignore storage failures
    }

    return {
      success: true,
      permissionState: 'granted',
      tokenRegistered: true,
      tokenId,
      message:
        'Browser notification token saved securely to your account. Automated background push delivery will activate once server-side push dispatch is deployed.',
    };
  } catch (err: any) {
    return {
      success: false,
      permissionState: 'granted',
      tokenRegistered: false,
      error: err?.message || 'Could not register Web Push service worker token.',
      message: 'Push token registration failed.',
    };
  }
}

export async function disableBrowserPushNotifications(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const storedTokenId = localStorage.getItem(`${TOKEN_STORAGE_KEY_PREFIX}${userId}`);
    if (storedTokenId) {
      await deleteStudentPushTokenFromFirestore(userId, storedTokenId);
      localStorage.removeItem(`${TOKEN_STORAGE_KEY_PREFIX}${userId}`);
    }
  } catch {
    // Ignore storage failures
  }

  try {
    if (await isSupported().catch(() => false)) {
      const messaging = getMessaging(getApp());
      await deleteToken(messaging).catch(() => {});
    }
  } catch {
    // Ignore deleteToken errors if none registered
  }
}

export async function cleanupRevokedPushTokenIfNeeded(userId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window) || !userId) return false;
  if (Notification.permission === 'granted') return false;

  try {
    const storedTokenId = localStorage.getItem(`${TOKEN_STORAGE_KEY_PREFIX}${userId}`);
    if (storedTokenId) {
      await deleteStudentPushTokenFromFirestore(userId, storedTokenId);
      localStorage.removeItem(`${TOKEN_STORAGE_KEY_PREFIX}${userId}`);
      return true;
    }
  } catch {
    // Ignore
  }
  return false;
}
