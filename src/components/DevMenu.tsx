import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Portal, Modal, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function DevMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const menuItems = [
    { title: 'ログイン画面', screen: 'Login' },
    { title: 'プロフィール作成', screen: 'ProfileCreation' },
    { title: 'コミュニケーション診断', screen: 'CommunicationDiagnosis' },
    { title: '詳細タグ入力', screen: 'DetailedTagInput' },
    { title: 'ホーム', screen: 'Home' },
    { title: 'ユーザー探索', screen: 'UserExplore' },
    { title: 'タイムライン', screen: 'Timeline' },
    { title: '掲示板', screen: 'Board' },
    { title: '🛡️ 管理画面', screen: 'Admin' },
  ];

  const navigateTo = (screen: string) => {
    setVisible(false);
    navigation.navigate(screen as never);
  };

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setVisible(true)}
        style={styles.devButton}
        icon="cog"
        buttonColor="#FF5722"
      >
        開発メニュー
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.title}>開発者メニュー</Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            画面へ直接ジャンプできます
          </Text>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <List.Item
                key={item.screen}
                title={item.title}
                onPress={() => navigateTo(item.screen)}
                left={(props) => <List.Icon {...props} icon="arrow-right" />}
                style={styles.menuItem}
              />
            ))}
          </View>

          <Button onPress={() => setVisible(false)} style={{ marginTop: 16 }}>
            閉じる
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    bottom: 150,  // フッターナビゲーションやFABの上に配置
    right: 20,
    zIndex: 9999,
    elevation: 5,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  menuList: {
    maxHeight: 400,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});
