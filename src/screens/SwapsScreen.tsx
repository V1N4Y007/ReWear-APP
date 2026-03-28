import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import InfoBadge from '../components/InfoBadge';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

export default function SwapsScreen() {
  const { user } = useContext(AuthContext);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/swaps');
      setSwaps(data.reverse());
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useFocusEffect(React.useCallback(() => { fetchSwaps(); }, []));

  const respond = (id: string, status: string) => {
    const label = status === 'Accepted' ? 'Accept' : 'Reject';
    Alert.alert(`${label} Swap`, `Are you sure you want to ${label.toLowerCase()} this swap?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: label, style: status === 'Rejected' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            await api.put(`/swaps/${id}`, { status });
            fetchSwaps();
          } catch (e) { Alert.alert('Error', 'Could not update swap.'); }
        }
      }
    ]);
  };

  const renderItem = ({ item: swap }: { item: any }) => {
    const isReceiver = swap.receiver?._id === user?._id;
    const statusType = swap.status?.toLowerCase() as any;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <InfoBadge label={swap.status} type={statusType} />
          <Text style={styles.date}>{new Date(swap.createdAt).toLocaleDateString()}</Text>
        </View>

        <Text style={styles.captionText}>
          {isReceiver
            ? `${swap.requester?.name} wants your "${swap.requestedItem?.title}"`
            : `You requested "${swap.requestedItem?.title}" from ${swap.receiver?.name}`}
        </Text>

        {isReceiver && swap.status === 'Pending' && (
          <View style={styles.actionRow}>
            <CustomButton title="✓ Accept" onPress={() => respond(swap._id, 'Accepted')} style={styles.acceptBtn} />
            <CustomButton title="✕ Reject" onPress={() => respond(swap._id, 'Rejected')} variant="outline" style={styles.rejectBtn} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 80 }} />
      ) : (
        <FlatList
          data={swaps}
          keyExtractor={s => s._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={styles.heading}>My Swap Requests</Text>}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>🔄</Text>
              <Text style={styles.emptyText}>No swaps yet</Text>
              <Text style={styles.emptySub}>Browse the marketplace to discover items!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: 60 },
  heading: { ...Typography.h2, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  date: { ...Typography.caption },
  captionText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  acceptBtn: { flex: 1 },
  rejectBtn: { flex: 1 },
  empty: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyText: { ...Typography.h3, marginTop: Spacing.md },
  emptySub: { ...Typography.bodySmall, marginTop: Spacing.xs, textAlign: 'center' },
});
