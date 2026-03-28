import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  label?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: any;
  multiline?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  label,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  multiline,
  error,
  leftIcon,
  style,
}: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.errorBorder : styles.normalBorder]}>
        {leftIcon && <View style={styles.iconBox}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, multiline && { height: 90, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: { ...Typography.label, marginBottom: Spacing.xs, marginLeft: 2 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
  },
  normalBorder: { borderColor: Colors.border },
  errorBorder: { borderColor: Colors.error },
  iconBox: { marginRight: Spacing.sm },
  input: { flex: 1, ...Typography.body, paddingVertical: Spacing.md, color: Colors.textPrimary },
  errorText: { ...Typography.caption, color: Colors.error, marginTop: 4, marginLeft: 2 },
});
