import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { Text, Card, Avatar, IconButton, Button, Chip, Badge, Surface } from 'react-native-paper';
import { COLORS, SPACING, RADIUS } from '../constants/AppConfig';
import { modernStyles } from '../styles/modernStyles';
import { DUMMY_NOTIFICATIONS, getNotificationIcon, getNotificationTypeLabel } from '../data/dummyNotifications';
import { DUMMY_USERS, sortUsers, calculateTagMatches } from '../data/dummyUsers';
import { User } from '../types/user';
import { useCommunityStore } from '../stores/communityStore';
import { useRecruitmentStore } from '../stores/recruitmentStore';
import { useAnnouncementStore } from '../stores/announcementStore';
import { useRegistrationStore } from '../stores/registrationStore';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { getTrendingTopics } = useCommunityStore();
  const { recruitments, isUrgent, isNew } = useRecruitmentStore();
  const { detailedTags } = useRegistrationStore();
  
  // Data for sections
  const notifications = DUMMY_NOTIFICATIONS.slice(0, 5); // Top 5 notifications
  const matchedUsers = sortUsers(DUMMY_USERS, 'match', [{ name: 'Apex Legends' }, { name: 'ONE PIECE' }]); // Mock current user tags
  const trendingTopics = getTrendingTopics().slice(0, 3);
  const recommendedRecruitments = recruitments.slice(0, 3); // Mock recommendation logic

  // Notification Slider Component (お知らせ)
  const { announcements } = useAnnouncementStore();
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = React.useRef<FlatList>(null);

  // Helper function for time display
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInHours < 24) return `${diffInHours}時間前`;
    return `${diffInDays}日前`;
  };



  // 無限ループ用のデータ作成
  // 実際のデータが少ない場合はループさせない、あるいは複製するなどの対応が必要
  // ここではシンプルに、データがあればそれを表示し、インジケーターをつける
  // 無限ループはFlatListのonMomentumScrollEndで制御するのが一般的だが、
  // 簡易的に自動スクロールと手動スクロールを組み合わせる

  const NotificationSlider = () => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (announcements.length <= 1) return;
        
        setSliderIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % announcements.length;
          if (sliderRef.current) {
            sliderRef.current.scrollToIndex({ index: nextIndex, animated: true });
          }
          return nextIndex;
        });
      }, 5000);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    useEffect(() => {
      if (announcements.length > 1) {
        startTimer();
      }
      return () => stopTimer();
    }, [announcements.length]);

    const handleScrollEnd = (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / (width - SPACING.M * 2 + SPACING.M));
      setSliderIndex(index);
      startTimer();
    };

    if (announcements.length === 0) return null;

    return (
      <View style={styles.sliderContainer}>
        <FlatList
          ref={sliderRef}
          data={announcements}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScrollBeginDrag={stopTimer}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.slideItem}
              onPress={() => {
                if (item.link) {
                   navigation.navigate(item.link.replace('/', ''));
                }
              }}
            >
              <Surface style={[styles.slideContent, { backgroundColor: item.backgroundColor }]} elevation={2}>
                <View style={styles.slideHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                    <IconButton icon="bell-ring" size={20} iconColor="white" />
                  </View>
                  <Text style={[styles.slideType, { color: 'white' }]}>お知らせ</Text>
                  <Text style={[styles.slideTime, { color: 'rgba(255,255,255,0.8)' }]}>{getTimeAgo(new Date(item.createdAt))}</Text>
                </View>
                <Text style={[styles.slideText, { color: 'white', fontWeight: 'bold' }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.slideText, { color: 'white', fontSize: 12 }]} numberOfLines={1}>
                  {item.description}
                </Text>
              </Surface>
            </TouchableOpacity>
          )}
          getItemLayout={(_, index) => ({
            length: width - SPACING.M * 2,
            offset: (width - SPACING.M * 2 + SPACING.M) * index,
            index,
          })}
          snapToInterval={width - SPACING.M * 2 + SPACING.M}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SPACING.M }}
        />
        {/* インジケーターのみ表示 */}
        <View style={styles.indicatorContainer}>
          {announcements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                index === sliderIndex ? styles.indicatorDotActive : styles.indicatorDotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  // Matched User Card Component
  const UserCard = ({ user }: { user: User }) => {
    const matchCount = calculateTagMatches(detailedTags, user.detailedTags);
    
    return (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => {
        console.log('HomeScreen: Navigating to UserDetail', user.id);
        navigation.navigate('UserDetail', { userId: user.id, matchCount });
      }}
    >
      <View style={styles.userCardHeader}>
        {user.profileImageUrl ? (
          <Avatar.Image 
            size={60} 
            source={{ uri: user.profileImageUrl }} 
            style={{ backgroundColor: user.themeColor }} 
          />
        ) : (
          <Avatar.Text 
            size={60} 
            label={user.nickname.charAt(0)} 
            style={{ backgroundColor: user.themeColor }} 
          />
        )}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{matchCount}個</Text>
        </View>
      </View>
      <Text style={styles.userName} numberOfLines={1}>{user.nickname}</Text>
      <Text style={styles.userInfo}>{user.grade}年生 / {user.prefecture}</Text>
      <View style={styles.tagContainer}>
        {user.detailedTags.slice(0, 2).map((tag, index) => (
          <View key={index} style={[styles.miniTag, { backgroundColor: user.themeColor + '20' }]}>
            <Text style={[styles.miniTagText, { color: user.themeColor }]}>#{tag.name}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
  };

  // Topic Item Component
  const TopicItem = ({ topic }: { topic: any }) => (
    <TouchableOpacity 
      style={modernStyles.card}
      onPress={() => navigation.navigate('TopicDetail', { topicId: topic.id })}
    >
      <View style={modernStyles.rowBetween}>
        <View style={styles.topicHeader}>
          <Text style={styles.topicCategory}>{getCategoryLabel(topic.categoryId)}</Text>
          <Text style={styles.topicTitle} numberOfLines={1}>{topic.title}</Text>
        </View>
        {isTopicHot(topic) && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>🔥 急上昇</Text>
          </View>
        )}
      </View>
      <View style={[modernStyles.row, { marginTop: 8 }]}>
        <Text style={modernStyles.textSecondary}>{topic.viewCount}人が見ています</Text>
        <Text style={[modernStyles.textSecondary, { marginLeft: 16 }]}>💬 {topic.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );

  // Recruitment Item Component
  const RecruitmentItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={modernStyles.card}
      onPress={() => navigation.navigate('RecruitmentDetail', { recruitmentId: item.id })}
    >
      <View style={modernStyles.rowBetween}>
        <Chip style={{ backgroundColor: COLORS.PRIMARY_LIGHT }} textStyle={{ color: COLORS.PRIMARY_DARK, fontSize: 12 }}>
          {getRecruitmentCategoryLabel(item.category)}
        </Chip>
        <View style={modernStyles.row}>
          {isUrgent(item) && <Badge style={{ backgroundColor: COLORS.ERROR, marginRight: 4 }}>急募</Badge>}
          {isNew(item) && <Badge style={{ backgroundColor: COLORS.WARNING }}>NEW</Badge>}
        </View>
      </View>
      <Text style={[modernStyles.headingSecondary, { marginTop: 8 }]}>{item.title}</Text>
      <Text style={modernStyles.textSecondary} numberOfLines={2}>{item.description}</Text>
      <View style={[modernStyles.row, { marginTop: 12 }]}>
        <IconButton icon="calendar" size={16} />
        <Text style={modernStyles.textSecondary}>{formatDate(item.eventDate)}</Text>
        <IconButton icon="map-marker" size={16} style={{ marginLeft: 8 }} />
        <Text style={modernStyles.textSecondary}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={modernStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Home</Text>
          <Text style={styles.headerSubtitle}>今日も良い出会いを</Text>
        </View>
        <IconButton icon="bell-outline" onPress={() => navigation.navigate('Notification')} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Slider */}
        <NotificationSlider />

        {/* Matched Users Section */}
        <View style={styles.section}>
          <View style={modernStyles.rowBetween}>
            <Text style={modernStyles.headingSecondary}>相性の良いユーザー</Text>
            <Button onPress={() => navigation.navigate('UserExplore')}>もっと見る</Button>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {matchedUsers.map(user => <UserCard key={user.id} user={user} />)}
          </ScrollView>
        </View>

        {/* Trending Topics Section */}
        <View style={styles.section}>
          <View style={modernStyles.rowBetween}>
            <Text style={modernStyles.headingSecondary}>盛り上がっているトピック</Text>
            <Button onPress={() => navigation.navigate('Community')}>すべて見る</Button>
          </View>
          {trendingTopics.map(topic => <TopicItem key={topic.id} topic={topic} />)}
        </View>

        {/* Recommended Recruitments Section */}
        <View style={styles.section}>
          <View style={modernStyles.rowBetween}>
            <Text style={modernStyles.headingSecondary}>おすすめの募集</Text>
            <Button onPress={() => navigation.navigate('Board')}>すべて見る</Button>
          </View>
          {recommendedRecruitments.map(rec => <RecruitmentItem key={rec.id} item={rec} />)}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Helper Functions
const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  return `${minutes}分前`;
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const isTopicHot = (topic: any) => {
  const now = new Date();
  return (now.getTime() - new Date(topic.lastCommentAt).getTime() < 3600000) || topic.commentCount > 10;
};

const getCategoryLabel = (cat: string) => {
  const labels: {[key: string]: string} = {
    game: 'ゲーム', study: '勉強', career: '進路', love: '恋愛', chat: '雑談', other: 'その他'
  };
  return labels[cat] || cat;
};

const getRecruitmentCategoryLabel = (cat: string) => {
  const labels: {[key: string]: string} = {
    game: 'ゲーム', study: '勉強', event: 'イベント', chat: '雑談', other: 'その他'
  };
  return labels[cat] || cat;
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.M,
    paddingTop: SPACING.L,
    paddingBottom: SPACING.S,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.L,
    paddingHorizontal: SPACING.M,
  },
  // Slider
  sliderContainer: {
    marginTop: SPACING.M,
    height: 140,
  },
  slider: {
    paddingHorizontal: SPACING.M,
  },
  slideItem: {
    width: width - SPACING.M * 2,
    marginRight: SPACING.M,
    paddingVertical: 4, // Shadow space
  },
  slideContent: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.MEDIUM,
    padding: SPACING.M,
    height: '100%',
    justifyContent: 'center',
  },
  slideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.S,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.ROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.S,
  },
  slideType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  slideTime: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
  },
  slideText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  // User Card
  horizontalList: {
    marginTop: SPACING.S,
    paddingBottom: SPACING.S, // Shadow space
  },
  userCard: {
    width: 140,
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.MEDIUM,
    padding: SPACING.S,
    marginRight: SPACING.M,
    elevation: 2,
    shadowColor: COLORS.PRIMARY_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userCardHeader: {
    position: 'relative',
    marginBottom: SPACING.S,
  },
  matchBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.ACCENT,
    borderRadius: RADIUS.SMALL,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  matchText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.S,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  miniTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.SMALL,
  },
  miniTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Topic
  topicHeader: {
    flex: 1,
  },
  topicCategory: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  hotBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.SMALL,
    marginLeft: 8,
  },
  hotBadgeText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  indicatorDotInactive: {
    backgroundColor: COLORS.BORDER,
  },
  indicatorText: {
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});
