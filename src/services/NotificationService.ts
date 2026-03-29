/**
 * NotificationService.ts
 *
 * Pure JavaScript in-app notification system for ReWear.
 * Uses a global event emitter so any screen can fire a toast/banner.
 * No native libraries needed — zero Gradle conflicts.
 */
import { NativeEventEmitter, NativeModules, DeviceEventEmitter } from 'react-native';

export interface NotificationPayload {
  title: string;
  message: string;
  screen?: string; // Optional: navigate to this tab when banner is tapped
  type?: 'success' | 'info' | 'warning';
}

const NOTIFICATION_EVENT = 'REWEAR_NOTIFICATION';

/** Fire an in-app notification banner (instant) */
export const sendLocalNotification = (
  title: string,
  message: string,
  screen?: string,
  type: NotificationPayload['type'] = 'success'
) => {
  DeviceEventEmitter.emit(NOTIFICATION_EVENT, { title, message, screen, type });
};

/** Schedule an in-app notification after a delay (in milliseconds) */
export const scheduleNotification = (
  title: string,
  message: string,
  delayMs: number,
  screen?: string,
  type: NotificationPayload['type'] = 'info'
) => {
  setTimeout(() => {
    DeviceEventEmitter.emit(NOTIFICATION_EVENT, { title, message, screen, type });
  }, delayMs);
};

/** Subscribe to notification events (used by NotificationBanner component) */
export const onNotification = (
  callback: (payload: NotificationPayload) => void
) => {
  const sub = DeviceEventEmitter.addListener(NOTIFICATION_EVENT, callback);
  return () => sub.remove(); // Return cleanup function
};

/** Initialise notification system and wire up navigation callback */
let _navCallback: ((screen: string) => void) | null = null;

export const initNotifications = (onTap: (screen: string) => void) => {
  _navCallback = onTap;
};

export const getNavCallback = () => _navCallback;
