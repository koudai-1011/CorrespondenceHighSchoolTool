import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Avatar, IconButton, Divider } from 'react-native-paper';
import { getFollowers, getFollowing } from '../data/dummySocial';
import { COLORS } from '../constants/AppConfig';

type TabType = 'followers' | 'following';

export default function FollowListScreen({ route, navigation }: { route: any; navigation: any }) {
  const { userId, initialTab } = route.params || { userId: 'user1', initialTab: 'followers' };
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab || 'followers');

  const followers = getFollowers(userId);
  const following = getFollowing(userId);

  const currentList = activeTab === 'followers' ? followers : following;

  const renderUser = ({ item }: { item: any }) => (
    <List.Item
      title={item.nickname}
      description={`@${item.id} · ${item.detailedTags.slice(0, 2).map((t: any) => t.name).join(', ')}`}
      left={(props) => (
        <Avatar.Icon
          {...props}
          size={48}
          icon="account"
          style={{ backgroundColor: item.themeColor }}
        />
      )}
      right={(props) => (
        <IconButton
          {...props}
          icon="chevron-right"
          onPress={() => navigation.navigate('UserDetail', { user: item })}
        />
      )}
      onPress={() => navigation.navigate('UserDetail', { user: item })}
      style={styles.userItem}
    />
  );

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <div style={{ padding: 0 }}>
        {/* タブ */}
        <View style={styles.tabs}>
          <View
            style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
            onTouchEnd={() => setActiveTab('followers')}
          >
            <Text
              variant="titleMedium"
              style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}
            >
              フォロワー ({followers.length})
            </Text>
          </View>
          <View
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onTouchEnd={() => setActiveTab('following')}
          >
            <Text
              variant="titleMedium"
              style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}
            >
              フォロー中 ({following.length})
            </Text>
          </View>
        </View>

        {/* ユーザーリスト */}
        {currentList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              {activeTab === 'followers' ? 'まだフォロワーがいません' : 'まだフォローしていません'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentList}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Divider />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  userItem: {
    backgroundColor: COLORS.SURFACE,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
  },
});
