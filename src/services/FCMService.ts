/**
 * FCMService.ts
 * Handles all Firebase Cloud Messaging on the React Native side:
 *  - Get device token on startup
 *  - Listen for foreground messages (shows in-app banner)
 *  - Handle notification tap (navigate to correct screen)
 *  - Background / killed state is handled automatically by Firebase
 */
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { sendLocalNotification } from './NotificationService';

/** Request push notification permission (required on iOS, optional on Android 13+) */
export const requestPermission = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

/** Get the current device FCM token */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const token = await messaging().getToken();
    return token;
  } catch (err) {
    console.warn('FCM token error:', err);
    return null;
  }
};

/**
 * Initialise FCM listeners.
 * Call this once after the user logs in.
 * @param onNotificationTap - callback to navigate when notification is tapped
 */
export const initFCMListeners = (onNotificationTap: (screen: string) => void) => {
  // 1. FOREGROUND: app is open → show in-app banner via our NotificationBanner
  const unsubForeground = messaging().onMessage(async (remoteMessage) => {
    const title = remoteMessage.notification?.title ?? 'ReWear';
    const body = remoteMessage.notification?.body ?? '';
    const screen = remoteMessage.data?.screen as string | undefined;
    const type = screen === 'Swaps' ? 'info' : 'success';
    sendLocalNotification(title, body, screen, type);
  });

  // 2. BACKGROUND TAP: app was in background, user tapped notification
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const screen = remoteMessage.data?.screen as string | undefined;
    if (screen) onNotificationTap(screen);
  });

  // 3. KILLED STATE TAP: app was closed, user tapped notification to open app
  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      const screen = remoteMessage.data?.screen as string | undefined;
      if (screen) {
        // Small delay so navigation is ready
        setTimeout(() => onNotificationTap(screen), 1000);
      }
    }
  });

  // Return cleanup for foreground listener
  return () => unsubForeground();
};

/**
 * Background message handler — must be called at the top level of index.js.
 * Firebase handles displaying the notification automatically.
 */
export const setBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('FCM background message:', remoteMessage.notification?.title);
  });
};
