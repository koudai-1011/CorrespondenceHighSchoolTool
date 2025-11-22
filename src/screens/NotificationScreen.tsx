import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Avatar, Badge, FAB } from 'react-native-paper';
import { DUMMY_NOTIFICATIONS, Notification, getNotificationIcon } from '../data/dummyNotifications';
import { COLORS } from '../constants/AppConfig';

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const [notifications] = React.useState(DUMMY_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <List.Item
      title={item.userName}
      description={item.content}
      left={() => (
        <Avatar.Icon 
          size={40} 
          icon="account" 
          style={{ backgroundColor: item.userColor }} 
        />
      )}
      right={() => (
        <View style={styles.notificationRight}>
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatTime(item.timestamp)}
          </Text>
          {!item.read && <Badge style={styles.badge} />}
        </View>
      )}
      onPress={() => {
        if (item.link) {
          const screenName = item.link.replace('/', '');
          navigation.navigate(screenName);
        }
      }}
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
    />
  );

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <div style={{ padding: 16 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>通知</Text>
          {unreadCount > 0 && (
            <Text variant="bodyMedium" style={styles.unreadCount}>
              {unreadCount}件の未読
            </Text>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyTitle}>
              通知はありません
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              いいねやコメントがあるとここに表示されます
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  unreadCount: {
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    marginBottom: 8,
  },
  unreadItem: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  notificationRight: {
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
    fontSize: 16,
  },
  emptySubtitle: {
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
});
