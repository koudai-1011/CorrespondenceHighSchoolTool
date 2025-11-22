import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Avatar, Badge, FAB, SegmentedButtons } from 'react-native-paper';
import { getChatRooms, getPartnerInfo } from '../data/dummyChat';
import { COLORS } from '../constants/AppConfig';
import GroupListScreen from './GroupListScreen';

export default function ChatListScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'group'
  const chatRooms = getChatRooms('user1');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const renderChatRoom = ({ item }: { item: any }) => {
    const partnerId = item.participants.find((id: string) => id !== 'user1');
    const partner = getPartnerInfo(partnerId);
    
    if (!partner) return null;

    return (
      <List.Item
        title={partner.nickname}
        description={item.lastMessage.content}
        left={() => (
          <Avatar.Icon 
            size={48} 
            icon="account" 
            style={{ backgroundColor: partner.themeColor }} 
          />
        )}
        right={() => (
          <View style={styles.rightSection}>
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
            {item.unreadCount > 0 && (
              <Badge style={styles.badge}>{item.unreadCount}</Badge>
            )}
          </View>
        )}
        onPress={() => navigation.navigate('Chat', { partnerId, partner })}
        style={[styles.chatItem, item.unreadCount > 0 && styles.unreadItem]}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
      <View style={{ padding: 16, paddingBottom: 0, backgroundColor: 'white' }}>
        <Text variant="headlineMedium" style={styles.title}>チャット</Text>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'chat', label: 'トーク' },
            { value: 'group', label: 'グループ' },
          ]}
          style={{ marginBottom: 16 }}
        />
      </View>

      {activeTab === 'group' ? (
        <GroupListScreen navigation={navigation} />
      ) : (
        <View style={{ flex: 1, padding: 16 }}>
          {chatRooms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                チャットはまだありません
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                気になる人にメッセージを送ってみよう！
              </Text>
            </View>
          ) : (
            <FlatList
              data={chatRooms}
              renderItem={renderChatRoom}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}

          {/* 新規チャットボタン */}
          <FAB
            icon="plus"
            style={styles.fab}
            color="white"
            onPress={() => navigation.navigate('UserExplore')}
            label="新規チャット"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  chatItem: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 12,
  },
  unreadItem: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 4,
    fontSize: 12,
  },
  badge: {
    backgroundColor: COLORS.ACCENT,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtitle: {
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.PRIMARY,
  },
});
