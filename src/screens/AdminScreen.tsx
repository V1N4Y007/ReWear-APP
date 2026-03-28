import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import CustomButton from '../components/CustomButton';
import InfoBadge from '../components/InfoBadge';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

interface Stats { totalUsers: number; totalItems: number; totalSwaps: number; }

export default function AdminScreen() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalItems: 0, totalSwaps: 0 });
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes] = await Promise.all([api.get('/admin/stats'), api.get('/admin/items')]);
      setStats(statsRes.data);
      setPendingItems(itemsRes.data.filter((i: any) => !i.isApproved));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const confirmAction = (label: string, action: () => void) =>
    Alert.alert(label, `Are you sure?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: label, style: label === 'Delete' ? 'destructive' : 'default', onPress: action }
    ]);

  const handleApprove = (id: string) => confirmAction('Approve', async () => {
    try { await api.put(`/admin/items/${id}/approve`); fetchData(); }
    catch { Alert.alert('Error'); }
  });

  const handleDelete = (id: string) => confirmAction('Delete', async () => {
    try { await api.delete(`/admin/items/${id}`); fetchData(); }
    catch { Alert.alert('Error'); }
  });

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <InfoBadge label="Pending" type="pending" />
      </View>
      <Text style={styles.uploaderText}>{item.category} · Size {item.size} · {item.condition}</Text>
      <Text style={styles.uploaderName}>By: {item.uploader?.name}</Text>
      <View style={styles.actionRow}>
        <CustomButton title="✓ Approve" onPress={() => handleApprove(item._id)} style={{ flex: 1 }} />
        <CustomButton title="✕ Delete" variant="outline" onPress={() => handleDelete(item._id)} style={{ flex: 1 }} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 80 }} /> : (
        <FlatList
          data={pendingItems}
          keyExtractor={i => i._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              <Text style={styles.heading}>Admin Dashboard</Text>
              {/* Stats */}
              <View style={styles.statsRow}>
                <StatCard icon="👥" label="Users" value={stats.totalUsers} />
                <StatCard icon="👕" label="Items" value={stats.totalItems} />
                <StatCard icon="🔄" label="Swaps" value={stats.totalSwaps} />
              </View>
              <Text style={styles.subHeading}>Pending Approval ({pendingItems.length})</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>✅</Text>
              <Text style={styles.emptyText}>All items reviewed!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: 60 },
  heading: { ...Typography.h2, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', ...Shadow.md,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { ...Typography.h2, color: Colors.primary },
  statLabel: { ...Typography.caption, marginTop: 2 },
  subHeading: { ...Typography.h3, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  itemTitle: { ...Typography.h3, flex: 1 },
  uploaderText: { ...Typography.bodySmall, marginBottom: 2 },
  uploaderName: { ...Typography.label, color: Colors.primaryDark, marginBottom: Spacing.md },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  empty: { alignItems: 'center', marginTop: Spacing.xl },
  emptyText: { ...Typography.h3, marginTop: Spacing.sm },
});
