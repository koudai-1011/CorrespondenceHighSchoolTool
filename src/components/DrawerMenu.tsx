import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Drawer, Divider, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { AVAILABLE_FOOTER_ITEMS, useSettingsStore } from '../stores/settingsStore';
import { useRegistrationStore } from '../stores/registrationStore';
import { useNavigation } from '@react-navigation/native';

export default function DrawerMenu({ onClose }: { onClose: () => void }) {
  const navigation = useNavigation();
  const { nickname, userId, profileImageUrl, themeColor } = useRegistrationStore();
  const { examParticipation } = useSettingsStore();

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
    onClose();
  };

  // メニュー項目を整理
  const mainItems = [
    AVAILABLE_FOOTER_ITEMS.Home,
    AVAILABLE_FOOTER_ITEMS.Timeline,
    AVAILABLE_FOOTER_ITEMS.Community,
    AVAILABLE_FOOTER_ITEMS.Board,
  ];

  const featureItems = [
    AVAILABLE_FOOTER_ITEMS.Talk,
    AVAILABLE_FOOTER_ITEMS.UserExplore,
    ...(examParticipation ? [AVAILABLE_FOOTER_ITEMS.Ranking] : []),
    AVAILABLE_FOOTER_ITEMS.Notification,
  ];

  const settingsItems = [
    AVAILABLE_FOOTER_ITEMS.Settings,
    { id: 'profile-edit', label: 'プロフィール編集', icon: 'account-edit', screen: 'ProfileEdit' },
  ];

  // Conditionally add exam item
  const otherItems = [
    { id: 'admin', label: '管理画面', icon: 'shield-account', screen: 'Admin' },
    ...(examParticipation ? [{ id: 'exam', label: '試験', icon: 'pencil', screen: 'ExamScreen' }] : []), // Conditionally added exam item
  ];

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
        <Drawer.Section title="メイン">
          {mainItems.map((item) => (
            <Drawer.Item
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.screen)}
              style={styles.drawerItem}
            />
          ))}
        </Drawer.Section>

        <Drawer.Section title="機能">
          {featureItems.map((item) => (
            <Drawer.Item
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.screen)}
              style={styles.drawerItem}
            />
          ))}
        </Drawer.Section>

        <Drawer.Section title="設定">
          {settingsItems.map((item) => (
            <Drawer.Item
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.screen)}
              style={styles.drawerItem}
            />
          ))}
        </Drawer.Section>

        <Drawer.Section title="その他">
          {otherItems.map((item) => (
            <Drawer.Item
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.screen)}
              style={styles.drawerItem}
            />
          ))}
        </Drawer.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.PRIMARY_LIGHT,
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
    color: COLORS.TEXT_PRIMARY,
  },
  userId: {
    color: COLORS.TEXT_SECONDARY,
  },
  menuItems: {
    flex: 1,
  },
  drawerItem: {
    marginVertical: 0,
  },
});
