import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import CustomButton from '../components/CustomButton';
import ItemCard from '../components/ItemCard';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useContext(AuthContext);
  const [myItems, setMyItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const { data } = await api.get('/items');
        setMyItems(data.filter((i: any) => i.uploader?._id === user?._id));
      } catch (e) { console.log(e); }
    };
    fetchMyItems();
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout }
    ]);
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>{user?.points}</Text>
          </View>
          <Text style={styles.pointsEmoji}>⭐</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{myItems.length}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statNumber}>{user?.role === 'admin' ? '👑' : '🌱'}</Text>
            <Text style={styles.statLabel}>{user?.role === 'admin' ? 'Admin' : 'Member'}</Text>
          </View>
        </View>

        {/* My Items */}
        <Text style={styles.sectionTitle}>My Listings</Text>
        {myItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No listings yet</Text>
          </View>
        ) : (
          <View style={styles.itemGrid}>
            {myItems.map(item => (
              <ItemCard key={item._id} item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
            ))}
          </View>
        )}

        <CustomButton title="Log Out" onPress={handleLogout} variant="outline" style={{ marginTop: Spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md, ...Shadow.md,
  },
  avatarText: { color: Colors.white, fontSize: 28, fontWeight: '700' },
  name: { ...Typography.h2, marginBottom: 4 },
  email: { ...Typography.bodySmall },
  pointsCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    padding: Spacing.lg, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md, ...Shadow.md,
  },
  pointsLabel: { color: 'rgba(255,255,255,0.8)', ...Typography.label },
  pointsValue: { color: Colors.white, fontSize: 36, fontWeight: '800' },
  pointsEmoji: { fontSize: 48 },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.lg, marginBottom: Spacing.lg, ...Shadow.sm },
  statBox: { flex: 1, alignItems: 'center', padding: Spacing.md },
  statBorder: { borderLeftWidth: 1, borderLeftColor: Colors.border },
  statNumber: { ...Typography.h2, color: Colors.primary },
  statLabel: { ...Typography.caption, marginTop: 4 },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.md },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyEmoji: { fontSize: 40 },
  emptyText: { ...Typography.bodySmall, marginTop: Spacing.sm },
});
