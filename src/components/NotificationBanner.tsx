/**
 * NotificationBanner.tsx
 * A premium in-app slide-down notification banner.
 * Mounts once in App.tsx and listens for notification events globally.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { onNotification, NotificationPayload, getNavCallback } from '../services/NotificationService';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

const TYPE_CONFIG = {
  success: { bg: Colors.primary, emoji: '✅' },
  info:    { bg: '#3b82f6',       emoji: '💬' },
  warning: { bg: Colors.warning,  emoji: '⏰' },
};

export default function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<NotificationPayload | null>(null);
  const slideY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = onNotification((notif) => {
      setPayload(notif);
      setVisible(true);
      show();
    });
    return unsub;
  }, []);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 70, friction: 10 }).start();
    timerRef.current = setTimeout(hide, 4000);
  };

  const hide = () => {
    Animated.timing(slideY, { toValue: -120, duration: 300, useNativeDriver: true }).start(() =>
      setVisible(false)
    );
  };

  const handleTap = () => {
    hide();
    const screen = payload?.screen;
    const navCallback = getNavCallback();
    if (screen && navCallback) {
      navCallback(screen);
    }
  };

  if (!visible || !payload) return null;

  const config = TYPE_CONFIG[payload.type ?? 'success'];

  return (
    <Animated.View style={[styles.container, { backgroundColor: config.bg, transform: [{ translateY: slideY }] }]}>
      <TouchableOpacity style={styles.inner} onPress={handleTap} activeOpacity={0.85}>
        <Text style={styles.emoji}>{config.emoji}</Text>
        <View style={styles.textBox}>
          <Text style={styles.title} numberOfLines={1}>{payload.title}</Text>
          <Text style={styles.message} numberOfLines={2}>{payload.message}</Text>
        </View>
        <TouchableOpacity onPress={hide} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    paddingHorizontal: Spacing.md,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    ...Shadow.lg,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 24,
  },
  textBox: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    fontSize: 14,
    color: Colors.white,
    marginBottom: 2,
  },
  message: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
  },
});
