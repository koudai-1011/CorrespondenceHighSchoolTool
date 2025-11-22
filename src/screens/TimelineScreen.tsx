import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, IconButton, FAB } from 'react-native-paper';
import { getFollowingTweets, Tweet } from '../data/dummySocial';
import { COLORS } from '../constants/AppConfig';

export default function TimelineScreen({ navigation }: { navigation: any }) {
  const [tweets] = useState(getFollowingTweets('user1'));  // user1のフォロー中のつぶやき

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const renderTweet = ({ item }: { item: Tweet }) => (
    <Card style={styles.tweetCard}>
      <Card.Content>
        <View style={styles.tweetHeader}>
          <Avatar.Icon 
            size={40} 
            icon="account" 
            style={{ backgroundColor: item.userColor }} 
          />
          <View style={styles.tweetUserInfo}>
            <Text variant="titleSmall" style={styles.userName}>{item.userName}</Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.tweetContent}>
          {item.content}
        </Text>

        <View style={styles.tweetActions}>
          <View style={styles.actionButton}>
            <IconButton
              icon={item.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              iconColor={item.isLiked ? COLORS.ACCENT : COLORS.TEXT_SECONDARY}
            />
            <Text variant="bodySmall" style={styles.actionCount}>{item.likeCount}</Text>
          </View>
          <View style={styles.actionButton}>
            <IconButton
              icon="comment-outline"
              size={20}
              iconColor={COLORS.TEXT_SECONDARY}
            />
            <Text variant="bodySmall" style={styles.actionCount}>{item.commentCount}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <div style={{ padding: 16 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>タイムライン</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            フォロー中の人のつぶやき
          </Text>
        </View>

        {tweets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              タイムラインは空です
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              気になる人をフォローして、つぶやきをチェックしよう！
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('UserExplore')}
            >
              <Text style={styles.exploreButtonText}>ユーザーを探す</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tweets}
            renderItem={renderTweet}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </div>

      {/* 投稿ボタン */}
      <FAB
        icon="pencil"
        style={styles.fab}
        color="white"
        onPress={() => alert('つぶやき投稿機能は準備中です')}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  tweetCard: {
    marginBottom: 12,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tweetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tweetUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  timestamp: {
    color: COLORS.TEXT_TERTIARY,
    marginTop: 2,
  },
  tweetContent: {
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 12,
  },
  tweetActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    color: COLORS.TEXT_SECONDARY,
    marginLeft: -8,
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
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: COLORS.PRIMARY,
  },
});
