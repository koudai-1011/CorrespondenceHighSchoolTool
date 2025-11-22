import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Drawer, Divider, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useSettingsStore } from '../stores/settingsStore';
import { useRegistrationStore } from '../stores/registrationStore';

export default function DrawerMenu({ navigation, onClose }: { navigation: any, onClose: () => void }) {
  const { footerItems } = useSettingsStore();
  const { nickname, userId, profileImageUrl, themeColor } = useRegistrationStore();

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー（プロフィール） */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          {profileImageUrl ? (
            <Avatar.Image size={60} source={{ uri: profileImageUrl }} />
          ) : (
            <Avatar.Icon size={60} icon="account" style={{ backgroundColor: themeColor || COLORS.PRIMARY }} />
          )}
          <View style={styles.textInfo}>
            <Text variant="titleMedium" style={styles.nickname}>{nickname || 'ゲスト'}</Text>
            <Text variant="bodySmall" style={styles.userId}>@{userId || 'guest'}</Text>
          </View>
        </View>
        <IconButton icon="close" onPress={onClose} />
      </View>

      <Divider />

      <ScrollView style={styles.menuItems}>
        <Drawer.Section title="メニュー">
          {footerItems.map((item) => (
            <Drawer.Item
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.screen)}
              style={styles.drawerItem}
            />
          ))}
        </Drawer.Section>

        <Divider style={styles.divider} />

        <Drawer.Section title="その他">
          <Drawer.Item
            label="機能設定"
            icon="cog"
            onPress={() => handleNavigate('FunctionSettings')}
          />
          <Drawer.Item
            label="ヘルプ・お問い合わせ"
            icon="help-circle"
            onPress={() => {}}
          />
        </Drawer.Section>
      </ScrollView>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50, // ステータスバー分
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    marginLeft: 12,
  },
  nickname: {
    fontWeight: 'bold',
  },
  userId: {
    color: COLORS.TEXT_SECONDARY,
  },
  menuItems: {
    flex: 1,
  },
  drawerItem: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  version: {
    color: COLORS.TEXT_TERTIARY,
  },
});
