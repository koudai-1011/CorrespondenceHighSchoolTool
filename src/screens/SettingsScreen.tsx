import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';

export default function SettingsScreen({ navigation }: { navigation: any }) {
  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>設定</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            アプリの各種設定を管理
          </Text>
        </View>

        {/* プロフィール設定 */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>アカウント</List.Subheader>
          <List.Item
            title="プロフィール設定"
            description="基本情報、SNSリンク、タグを編集"
            left={(props) => <List.Icon {...props} icon="account-edit" color={COLORS.PRIMARY} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('ProfileEdit', { isEditMode: true })}
            style={styles.listItem}
          />
        </List.Section>

        <Divider />

        {/* 機能設定 */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>機能</List.Subheader>
          <List.Item
            title="機能設定"
            description="フッターカスタマイズ、ランキング参加など"
            left={(props) => <List.Icon {...props} icon="cog" color={COLORS.PRIMARY} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('FunctionSettings')}
            style={styles.listItem}
          />
        </List.Section>

        <Divider />

        {/* その他 */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>その他</List.Subheader>
          <List.Item
            title="アプリについて"
            description="バージョン情報"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
          <List.Item
            title="利用規約"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
          <List.Item
            title="プライバシーポリシー"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
        </List.Section>

        <View style={{ height: 100 }} />
      </ScrollView>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  sectionHeader: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    fontSize: 14,
  },
  listItem: {
    backgroundColor: COLORS.SURFACE,
  },
});
