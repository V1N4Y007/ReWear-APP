import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../theme';

export default function LoadingScreen() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scale]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoCircle, { transform: [{ scale }] }]}>
        <Text style={styles.logoEmoji}>♻️</Text>
      </Animated.View>
      <Text style={styles.appName}>ReWear</Text>
      <ActivityIndicator size="large" color={Colors.white} style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
    marginBottom: Spacing.xl,
  },
  loader: {
    marginTop: Spacing.lg,
  },
});
