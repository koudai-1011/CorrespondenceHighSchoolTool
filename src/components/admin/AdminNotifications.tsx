import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';

export const AdminNotifications: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>通知管理</Text>
      <Text variant="bodyMedium" style={styles.placeholderText}>
        ユーザーへの一斉通知機能は今後実装予定です
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 32,
  },
});
