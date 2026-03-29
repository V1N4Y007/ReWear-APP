/**
 * fcmService.js
 * Backend Firebase Admin SDK — sends real push notifications to devices.
 * Uses the google-services credentials embedded in service account JSON.
 */
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin once
let initialized = false;

const initFirebase = () => {
  if (initialized) return;
  try {
    let serviceAccount;
    // Check if running on Vercel with Environment Variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Fallback for Local Development
      const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
      serviceAccount = require(serviceAccountPath);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (err) {
    console.warn('⚠️  Firebase Admin not initialized (missing service account):', err.message);
  }
};

/**
 * Send a push notification to a specific device token.
 * @param {string} token - FCM device token of the recipient
 * @param {string} title - Notification title
 * @param {string} body  - Notification body
 * @param {object} data  - Optional key-value data payload (for navigation)
 */
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!token) return; // Silently skip if no token stored
  initFirebase();
  if (!initialized) return;

  try {
    const message = {
      token,
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      android: {
        notification: {
          sound: 'default',
          priority: 'high',
          channelId: 'rewear-channel',
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log(`📲 FCM sent: ${response}`);
  } catch (err) {
    // Token expired or invalid — clear it from DB
    console.warn('FCM send error:', err.message);
  }
};

module.exports = { sendPushNotification };
