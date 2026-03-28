import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import InfoBadge from './InfoBadge';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.md * 2 - Spacing.sm) / 2;

interface Props {
  item: any;
  onPress: () => void;
}

export default function ItemCard({ item, onPress }: Props) {
  const conditionType = item.condition?.toLowerCase().includes('new')
    ? 'new'
    : item.condition?.toLowerCase().includes('good')
    ? 'good'
    : 'fair';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {item.images && item.images[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ fontSize: 32 }}>👕</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>Size {item.size} · {item.category}</Text>
        <View style={styles.footer}>
          <InfoBadge label={item.condition || 'Unknown'} type={conditionType} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  image: { width: '100%', height: 160 },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { padding: Spacing.sm + 4 },
  title: { ...Typography.h3, fontSize: 14, marginBottom: 2 },
  meta: { ...Typography.bodySmall, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row' },
});
