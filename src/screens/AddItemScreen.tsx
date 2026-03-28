import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import api from '../services/api';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Colors, Radius, Spacing, Typography } from '../theme';

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AddItemScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !description || !category || !type || !size || !condition) {
      Alert.alert('Incomplete', 'Please fill in all required fields.'); return;
    }
    setLoading(true);
    try {
      await api.post('/items', { title, description, category, type, size, condition, tags: [], images: imageUrl ? [imageUrl] : [] });
      Alert.alert('🎉 Listed!', 'Your item is pending Admin approval. You earned 10 points!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to list item.');
    } finally {
      setLoading(false);
    }
  };

  const ChipSelector = ({ options, value, onSelect }: { options: string[], value: string, onSelect: (v: string) => void }) => (
    <View style={styles.chipRow}>
      {options.map(opt => (
        <View key={opt} style={[styles.chip, value === opt && styles.chipActive]}>
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]} onPress={() => onSelect(opt)}>{opt}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.pointsHint}>
          <Text style={styles.pointsHintText}>💡 List an item and earn 10 points!</Text>
        </View>

        <CustomInput label="Title *" placeholder="e.g. Blue Denim Jacket" value={title} onChangeText={setTitle} />
        <CustomInput label="Description *" placeholder="Describe the item..." value={description} onChangeText={setDescription} multiline />
        <CustomInput label="Category *" placeholder="e.g. Men, Women, Kids" value={category} onChangeText={setCategory} />
        <CustomInput label="Type *" placeholder="e.g. Tops, Bottoms, Shoes" value={type} onChangeText={setType} />

        <Text style={styles.sectionLabel}>Size *</Text>
        <ChipSelector options={SIZES} value={size} onSelect={setSize} />

        <Text style={styles.sectionLabel}>Condition *</Text>
        <ChipSelector options={CONDITIONS} value={condition} onSelect={setCondition} />

        <CustomInput
          label="Image URL (optional)"
          placeholder="https://example.com/image.jpg"
          value={imageUrl} onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        <CustomButton title="Publish Item" onPress={handleAdd} loading={loading} style={{ marginTop: Spacing.md }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: 80 },
  pointsHint: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  pointsHintText: { ...Typography.bodySmall, color: Colors.primaryDark, fontWeight: '600' },
  sectionLabel: { ...Typography.label, marginBottom: Spacing.sm, marginTop: Spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
});
