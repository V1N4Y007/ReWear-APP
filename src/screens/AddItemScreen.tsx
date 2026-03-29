import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import api from '../services/api';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { sendLocalNotification } from '../services/NotificationService';
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
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode || !response.assets?.[0]?.base64) return;
    const asset = response.assets[0];
    const base64Data = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
    setLocalImageUri(base64Data); // Using the base64 data directly as the local UI preview string
  };

  const pickerOptions: any = { mediaType: 'photo', quality: 0.5, maxWidth: 800, maxHeight: 800, includeBase64: true };

  const openCamera = () => launchCamera(pickerOptions, handlePickerResponse);
  const openGallery = () => launchImageLibrary(pickerOptions, handlePickerResponse);

  const handleAdd = async () => {
    if (!title || !description || !category || !type || !size || !condition || !localImageUri) {
      Alert.alert('Incomplete', 'Please fill in all required fields and upload an image.'); return;
    }
    setLoading(true);
    setUploadProgress('Saving to database...');
    try {
      // Send the compressed base64 string directly to MongoDB via the backend array
      await api.post('/items', { title, description, category, type, size, condition, tags: [], images: [localImageUri] });

      // Fire instant notification confirming listing
      sendLocalNotification(
        '🎉 Item Listed!',
        `"${title}" is pending admin approval. You earned 10 points!`,
        'Home'
      );

      Alert.alert('🎉 Listed!', 'Your item is pending Admin approval. You earned 10 points!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message || 'Failed to list item.');
    } finally {
      setLoading(false);
      setUploadProgress('');
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

        <Text style={styles.sectionLabel}>Item Photo *</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
          {localImageUri ? (
            <Image source={{ uri: localImageUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.pickerPlaceholder}>
              <Text style={styles.pickerIcon}>📷</Text>
              <Text style={styles.pickerText}>Tap to Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <CustomButton title={loading ? uploadProgress : "Publish Item"} onPress={handleAdd} loading={loading} style={{ marginTop: Spacing.md }} />
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
  imagePicker: {
    height: 200, backgroundColor: Colors.card, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  previewImage: { width: '100%', height: '100%' },
  pickerPlaceholder: { alignItems: 'center' },
  pickerIcon: { fontSize: 32, marginBottom: 8 },
  pickerText: { ...Typography.label, color: Colors.textSecondary },
});
