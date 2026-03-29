import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Outerwear'];

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items');
      setItems(data.reverse());
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useFocusEffect(React.useCallback(() => { fetchItems(); }, []));

  const filtered = items.filter(item => {
    const matchCat = activeFilter === 'All' || item.category?.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags?.join(' ').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Discover sustainable fashion</Text>
        </View>
        <Text style={{ fontSize: 28 }}>♻️</Text>
      </View>

      {/* Points Banner */}
      <View style={styles.pointsBanner}>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>⭐ {user?.points}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, tags..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.addFab} onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.addFabText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, activeFilter === cat && styles.chipActive]}
            onPress={() => setActiveFilter(cat)}
          >
            <Text style={[styles.chipText, activeFilter === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={i => i._id}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🧺</Text>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySub}>Try a different search or category</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.card, ...Shadow.sm },
  greeting: { ...Typography.h2, fontSize: 20 },
  subGreeting: { ...Typography.bodySmall, marginTop: 2 },
  pointsBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    padding: Spacing.md, ...Shadow.sm,
  },
  pointsLabel: { ...Typography.label, color: Colors.primaryDark },
  pointsValue: { ...Typography.h3, color: Colors.primaryDark },
  searchRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.sm },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, ...Shadow.sm,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, ...Typography.body, paddingVertical: Spacing.sm + 4, color: Colors.textPrimary },
  addFab: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  addFabText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  chipRow: { marginBottom: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.card, marginRight: Spacing.sm, ...Shadow.sm },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
  gridRow: { justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  grid: { paddingBottom: 100 },
  emptyState: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyEmoji: { fontSize: 48 },
  emptyText: { ...Typography.h3, marginTop: Spacing.md },
  emptySub: { ...Typography.bodySmall, marginTop: Spacing.xs },
});