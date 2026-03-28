import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, Alert, SafeAreaView
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import InfoBadge from '../components/InfoBadge';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

export default function ItemDetailScreen({ route, navigation }: any) {
  const { item } = route.params;
  const { user } = useContext(AuthContext);
  const isOwner = user?._id === item.uploader?._id;

  const handleSwap = () => {
    Alert.alert(
      'Request Swap',
      `Send a swap request for "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request', onPress: async () => {
            try {
              await api.post('/swaps/request', { receiverId: item.uploader._id, requestedItemId: item._id });
              Alert.alert('✅ Sent!', 'Your swap request has been sent.');
              navigation.goBack();
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'Failed.');
            }
          }
        }
      ]
    );
  };

  const conditionType = item.condition?.toLowerCase().includes('new') ? 'new' :
    item.condition?.toLowerCase().includes('good') ? 'good' : 'fair';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.heroPlaceholder]}>
            <Text style={{ fontSize: 64 }}>👕</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <InfoBadge label={item.condition || 'Unknown'} type={conditionType} />
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Info Pills */}
          <View style={styles.detailsCard}>
            <DetailRow icon="📏" label="Size" value={item.size} />
            <DetailRow icon="🏷️" label="Category" value={item.category} />
            <DetailRow icon="👔" label="Type" value={item.type} />
            <DetailRow icon="👤" label="Owner" value={item.uploader?.name} />
          </View>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {item.tags.map((t: string) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>#{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Action */}
      {!isOwner && (
        <View style={styles.stickyBar}>
          <CustomButton title="🔄  Request Swap" onPress={handleSwap} style={{ flex: 1 }} />
        </View>
      )}
    </SafeAreaView>
  );
}

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { width: '100%', height: 320 },
  heroPlaceholder: { backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  title: { ...Typography.h2, flex: 1, marginRight: Spacing.sm },
  description: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  detailsCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.md, ...Shadow.sm, marginBottom: Spacing.md,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailIcon: { fontSize: 18, width: 28 },
  detailLabel: { ...Typography.label, flex: 1 },
  detailValue: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  tagText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '600' },
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, backgroundColor: Colors.card,
    borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.lg,
    flexDirection: 'row',
  },
});
