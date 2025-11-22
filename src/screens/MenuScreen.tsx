import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { AVAILABLE_FOOTER_ITEMS } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

export default function MenuScreen({ navigation }: { navigation: any }) {
  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>メニュー</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            すべての機能にアクセス
          </Text>
        </View>

        <View style={styles.grid}>
          {AVAILABLE_FOOTER_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.screen)}
            >
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <IconButton
                    icon={item.icon}
                    size={32}
                    iconColor={COLORS.PRIMARY}
                    style={{ margin: 0 }}
                  />
                  <Text variant="titleSmall" style={styles.itemLabel}>
                    {item.label}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            フッターに表示する項目は「設定」→「機能設定」から変更できます
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '48%',
  },
  card: {
    backgroundColor: COLORS.SURFACE,
    elevation: 1,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  itemLabel: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    marginVertical: 24,
  },
  footer: {
    paddingHorizontal: 16,
  },
  footerText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
