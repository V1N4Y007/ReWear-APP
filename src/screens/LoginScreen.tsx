import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Colors, Spacing, Typography, Radius } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Missing fields', 'Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert('Login Failed', e.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>♻️</Text>
          </View>
          <Text style={styles.appName}>ReWear</Text>
          <Text style={styles.tagline}>Community Clothing Exchange</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to continue</Text>

          <CustomInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CustomInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.sm }} />

          <TouchableOpacity style={styles.switchRow} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Text style={[styles.switchText, styles.switchLink]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 34, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  tagline: { ...Typography.body, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
  card: {
    flex: 1, backgroundColor: Colors.background,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: Spacing.lg, paddingTop: Spacing.xl,
  },
  heading: { ...Typography.h2, marginBottom: Spacing.xs },
  subheading: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  switchText: { ...Typography.body, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: '600' },
});