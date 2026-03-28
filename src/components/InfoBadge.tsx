import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

type BadgeType = 'new' | 'good' | 'fair' | 'pending' | 'accepted' | 'rejected' | 'custom';

interface Props {
  label: string;
  type?: BadgeType;
  color?: string;
}

const typeColors: Record<string, string> = {
  new: Colors.primary,
  good: '#3b82f6',
  fair: Colors.warning,
  pending: Colors.warning,
  accepted: Colors.primary,
  rejected: Colors.error,
  custom: Colors.textSecondary,
};

export default function InfoBadge({ label, type = 'custom', color }: Props) {
  const bg = color ?? typeColors[type] ?? Colors.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: bg + '22' }]}>
      <Text style={[styles.text, { color: bg }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: { ...Typography.caption, fontWeight: '700' },
});
