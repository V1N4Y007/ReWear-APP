import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Colors, Spacing, Typography } from '../theme';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('Missing fields', 'Please fill in all fields.'); return; }
    if (password.length < 6) { Alert.alert('Too short', 'Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert('Registration Failed', e.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>♻️</Text>
          </View>
          <Text style={styles.appName}>ReWear</Text>
          <Text style={styles.tagline}>Join the eco movement</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subheading}>Start exchanging clothes sustainably</Text>

          <CustomInput label="Full Name" placeholder="Alice Eco" value={name} onChangeText={setName} />
          <CustomInput
            label="Email" placeholder="you@example.com"
            value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address"
          />
          <CustomInput
            label="Password" placeholder="Min 6 characters"
            value={password} onChangeText={setPassword} secureTextEntry
          />

          <View style={styles.bonusBox}>
            <Text style={styles.bonusText}>🎁 You'll receive 50 bonus points on sign up!</Text>
          </View>

          <CustomButton title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: Spacing.sm }} />

          <TouchableOpacity style={styles.switchRow} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text style={[styles.switchText, styles.switchLink]}>Sign In</Text>
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
  bonusBox: {
    backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  bonusText: { ...Typography.bodySmall, color: Colors.primaryDark, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  switchText: { ...Typography.body, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: '600' },
});
