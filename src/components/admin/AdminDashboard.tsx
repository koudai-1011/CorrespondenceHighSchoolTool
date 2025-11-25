import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, ProgressBar } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';
import { calculateRetentionRate } from '../../data/dummyAnalytics';
import { DUMMY_USERS } from '../../data/dummyUsers';
import { CATEGORIES } from '../../data/tagData';

interface AdminDashboardProps {
  analytics: any;
  tagAnalyticsByCategory: Record<string, Array<{name: string, count: number}>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ analytics, tagAnalyticsByCategory }) => {
  return (
    <View style={styles.section}>
      {/* アナリティクスセクション */}
      <Text variant="titleMedium" style={styles.sectionTitle}>分析ダッシュボード</Text>
      
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalUsers.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>総ユーザー数</Text>
            <Text variant="bodySmall" style={styles.statChange}>+{analytics.newUsersThisMonth} 今月</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.activeUsers.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>DAU (デイリーアクティブ)</Text>
            <Text variant="bodySmall" style={styles.statChange}>+{analytics.newUsersToday} 今日</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.monthlyActiveUsers.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>MAU (マンスリーアクティブ)</Text>
            <ProgressBar 
              progress={analytics.monthlyActiveUsers / analytics.totalUsers} 
              color={COLORS.PRIMARY}
              style={{ marginTop: 8 }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {calculateRetentionRate(analytics.monthlyActiveUsers, analytics.totalUsers).toFixed(1)}%
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>ユーザー保持率</Text>
            <Text variant="bodySmall" style={styles.statChange}>MAU / 総ユーザー</Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={styles.divider} />

      {/* エンゲージメント統計 */}
      <Text variant="titleMedium" style={styles.sectionTitle}>エンゲージメント</Text>
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalPosts.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>総投稿数</Text>
            <Text variant="bodySmall" style={styles.statChange}>+{analytics.postsToday} 今日</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalComments.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>総コメント数</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalLikes.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>総いいね数</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{analytics.activeChatRooms.toLocaleString()}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>アクティブなチャット</Text>
            <Text variant="bodySmall" style={styles.statChange}>+{analytics.messagesThisWeek.toLocaleString()} メッセージ/週</Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={styles.divider} />

      {/* トレンドチャート（簡易版） */}
      <Text variant="titleMedium" style={styles.sectionTitle}>7日間のトレンド</Text>
      
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.chartTitle}>デイリーアクティブユーザー (DAU)</Text>
          <View style={styles.chartContainer}>
            {analytics.dailyActiveUsersChart.map((item: any, index: number) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: `${(item.value / 400) * 100}%`, backgroundColor: COLORS.PRIMARY }
                  ]} 
                />
                <Text variant="bodySmall" style={styles.chartLabel}>{item.date}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.chartTitle}>ユーザー成長</Text>
          <View style={styles.chartContainer}>
            {analytics.userGrowthChart.map((item: any, index: number) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: `${(item.value / 1300) * 100}%`, backgroundColor: COLORS.ACCENT }
                  ]} 
                />
                <Text variant="bodySmall" style={styles.chartLabel}>{item.date}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* タグアナリティクス */}
      <Divider style={styles.divider} />
      <Text variant="titleMedium" style={styles.sectionTitle}>タグ分析</Text>
      <Text style={styles.infoText}>カテゴリーごとのタグ登録数ランキング</Text>

      {CATEGORIES.map(category => (
        <View key={category} style={{ marginBottom: 24 }}>
          <Text variant="titleSmall" style={{ marginBottom: 8, fontWeight: 'bold' }}>{category}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tagAnalyticsByCategory[category]?.map((item, index) => (
              <Card key={item.name} style={{ marginRight: 12, minWidth: 120, backgroundColor: COLORS.SURFACE }}>
                <Card.Content>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text variant="labelLarge" style={{ 
                      color: index < 3 ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY, 
                      fontWeight: 'bold',
                      marginRight: 8
                    }}>
                      #{index + 1}
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  </View>
                  <Text variant="bodySmall">{item.count} ユーザー</Text>
                  <ProgressBar 
                    progress={item.count / (DUMMY_USERS.length || 1)} 
                    color={index < 3 ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} 
                    style={{ height: 4, marginTop: 8, borderRadius: 2 }} 
                  />
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '48%', // 2 columns
    backgroundColor: COLORS.SURFACE,
  },
  statNumber: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  statChange: {
    color: COLORS.SUCCESS,
    marginTop: 4,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 24,
  },
  chartCard: {
    marginBottom: 16,
    backgroundColor: COLORS.SURFACE,
  },
  chartTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barFill: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
  },
});
