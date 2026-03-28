import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Shadow, Spacing, Typography } from '../theme';

interface Action {
  icon?: React.ReactNode;
  onPress: () => void;
}

interface Props {
  title: string;
  leftAction?: Action;
  rightAction?: Action;
}

export default function HeaderBar({ title, leftAction, rightAction }: Props) {
  return (
    <View style={styles.container}>
      {leftAction ? (
        <TouchableOpacity style={styles.btn} onPress={leftAction.onPress}>
          {leftAction.icon ?? <Text style={styles.icon}>‹</Text>}
        </TouchableOpacity>
      ) : <View style={styles.btn} />}

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {rightAction ? (
        <TouchableOpacity style={styles.btn} onPress={rightAction.onPress}>
          {rightAction.icon ?? <Text style={styles.icon}>⋯</Text>}
        </TouchableOpacity>
      ) : <View style={styles.btn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    ...Shadow.sm,
  },
  btn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { ...Typography.h3, flex: 1, textAlign: 'center' },
  icon: { fontSize: 24, color: Colors.textPrimary },
});
