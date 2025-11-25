import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text, List, Avatar, Badge, FAB, IconButton } from 'react-native-paper';
import { getChatRooms, getPartnerInfo } from '../data/dummyChat';
import { useGroupStore } from '../stores/groupStore';
import { COLORS } from '../constants/AppConfig';

type FilterType = 'all' | 'individual' | 'group';

export default function TalkScreen({ navigation }: { navigation: any }) {
  const [filter, setFilter] = useState<FilterType>('all');
  
  // 個人チャットデータ
  const chatRooms = getChatRooms('user1');
  
  // グループチャットデータ
  const { groups } = useGroupStore();
  const myGroups = groups.filter(g => g.memberIds.includes('user1'));

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diff = Math.floor((now.getTime() - targetDate.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const pagerRef = React.useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  // フィルタ変更時にページャーをスクロール
  React.useEffect(() => {
    const index = ['all', 'individual', 'group'].indexOf(filter);
    if (index !== -1 && pagerRef.current) {
      pagerRef.current.scrollTo({ x: index * width, animated: true });
    }
  }, [filter, width]);

  // データを統合してソート（フィルタ引数追加）
  const getItemsForFilter = (targetFilter: FilterType) => {
    const individualItems = chatRooms.map(room => ({
      type: 'individual' as const,
      id: room.id,
      data: room,
      timestamp: room.lastMessage.timestamp,
    }));

    const groupItems = myGroups.map(group => ({
      type: 'group' as const,
      id: group.id,
      data: group,
      timestamp: new Date(group.createdAt),
    }));

    const allItems = [...individualItems, ...groupItems].sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    if (targetFilter === 'individual') return individualItems;
    if (targetFilter === 'group') return groupItems;
    return allItems;
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'individual') {
      const room = item.data;
      const partnerId = room.participants.find((id: string) => id !== 'user1');
      const partner = getPartnerInfo(partnerId);
      
      if (!partner) return null;

      return (
        <List.Item
          title={partner.nickname}
          description={room.lastMessage.content}
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
                {formatTime(room.lastMessage.timestamp)}
              </Text>
              {room.unreadCount > 0 && (
                <Badge style={styles.badge}>{room.unreadCount}</Badge>
              )}
            </View>
          )}
          onPress={() => navigation.navigate('Chat', { partnerId, partner })}
          style={[styles.chatItem, room.unreadCount > 0 && styles.unreadItem]}
        />
      );
    } else {
      const group = item.data;
      return (
        <List.Item
          title={group.name}
          description={`${group.memberIds.length}人のメンバー`}
          left={() => (
            <Avatar.Icon 
              size={48} 
              icon="account-group" 
              style={{ backgroundColor: COLORS.ACCENT }} 
            />
          )}
          right={() => (
            <View style={styles.rightSection}>
              <Text variant="bodySmall" style={styles.timestamp}>
                {formatTime(group.createdAt)}
              </Text>
            </View>
          )}
          onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
          style={styles.chatItem}
        />
      );
    }
  };

  const renderPage = (targetFilter: FilterType) => {
    const items = getItemsForFilter(targetFilter);

    if (items.length === 0) {
      return (
        <View style={{ width, flex: 1, padding: 16 }}>
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              トークはまだありません
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              {targetFilter === 'group' 
                ? 'グループに参加してみよう！' 
                : '気になる人にメッセージを送ってみよう！'}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ width, flex: 1 }}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
      <View style={{ padding: 16, paddingBottom: 0, backgroundColor: 'white' }}>
        <View style={styles.headerRow}>
          <Text variant="headlineMedium" style={styles.title}>トーク</Text>
          <IconButton icon="magnify" onPress={() => {}} />
        </View>
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterList}
          >
            {[
              { value: 'all', label: 'すべて' },
              { value: 'individual', label: '個人' },
              { value: 'group', label: 'グループ' },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.filterPill,
                  filter === item.value && styles.filterPillActive
                ]}
                onPress={() => setFilter(item.value as FilterType)}
              >
                <Text style={[
                  styles.filterPillText,
                  filter === item.value && styles.filterPillTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollEndDrag={(e) => {
          const currentX = e.nativeEvent.contentOffset.x;
          const filters: FilterType[] = ['all', 'individual', 'group'];
          const currentIndex = filters.indexOf(filter);
          const startX = currentIndex * width;
          const diff = currentX - startX;
          
          let nextIndex = currentIndex;
          if (diff > width * 0.2) {
            nextIndex = Math.min(currentIndex + 1, filters.length - 1);
          } else if (diff < -width * 0.2) {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          
          if (nextIndex !== currentIndex) {
            setFilter(filters[nextIndex]);
          } else {
            if (pagerRef.current) {
              pagerRef.current.scrollTo({ x: nextIndex * width, animated: true });
            }
          }
        }}
        style={{ flex: 1 }}
      >
        {renderPage('all')}
        {renderPage('individual')}
        {renderPage('group')}
      </ScrollView>

        {/* 新規作成ボタン */}
        <FAB.Group
          open={false}
          visible
          icon="plus"
          actions={[
            {
              icon: 'account-plus',
              label: '新しい友達を探す',
              onPress: () => navigation.navigate('UserExplore'),
            },
            {
              icon: 'account-group',
              label: 'グループを探す',
              onPress: () => navigation.navigate('GroupSearch'),
            },
            {
              icon: 'plus-box',
              label: 'グループを作成',
              onPress: () => navigation.navigate('GroupCreate'),
            },
          ]}
          onStateChange={() => {}}
          onPress={() => {
            // FAB自体を押したときの挙動（グループ展開しないなら直接遷移でも可）
            // ここではシンプルにユーザー探索へ
            navigation.navigate('UserExplore');
          }}
          style={styles.fab}
          color="white"
          fabStyle={{ backgroundColor: COLORS.PRIMARY }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: 'white',
  },
  filterList: {
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterPillActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  filterPillTextActive: {
    color: 'white',
  },
  chatItem: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 8,
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
    right: 0,
    bottom: 40,
  },
});
