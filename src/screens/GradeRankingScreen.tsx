import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, SegmentedButtons, FAB } from 'react-native-paper';
import { getGradeRanking, getClassRanking, getMonthlyMVP, CLASS_DESCRIPTIONS } from '../data/dummyGrades';
import { getPartnerInfo } from '../data/dummyChat';
import { COLORS } from '../constants/AppConfig';

type ViewType = 'all' | 'class';

export default function GradeRankingScreen({ navigation }: { navigation: any }) {
  const [viewType, setViewType] = useState<ViewType>('all');
  const [selectedClass, setSelectedClass] = useState<'S' | 'A' | 'B' | 'C' | 'D'>('A');
  
  const allRanking = getGradeRanking();
  const classRanking = getClassRanking(selectedClass);
  const mvp = getMonthlyMVP();
  
  const currentRanking = viewType === 'all' ? allRanking : classRanking;
  
  // 自分の統計
  const myStats = allRanking.find(s => s.userId === 'user1');

  const getClassColor = (gradeClass: string) => {
    const colors: Record<string, string> = {
      'S': '#FFD700',
      'A': '#00BCD4',
      'B': '#4CAF50',
      'C': '#FFC107',
      'D': '#9E9E9E',
    };
    return colors[gradeClass] || '#9E9E9E';
  };

  const renderRankingItem = ({ item, index }: { item: any; index: number }) => {
    const user = getPartnerInfo(item.userId);
    const isMyself = item.userId === 'user1';
    
    return (
      <Card style={[styles.rankCard, isMyself && styles.myRankCard]}>
        <Card.Content>
          <View style={styles.rankRow}>
            <View style={styles.rankLeft}>
              <View style={[styles.rankBadge, index < 3 && styles.topRankBadge]}>
                <Text variant="titleLarge" style={styles.rankNumber}>
                  {item.rank}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text variant="titleMedium" style={styles.userName}>
                  {user?.nickname || 'Unknown'}
                  {isMyself && ' (あなた)'}
                </Text>
                <Chip 
                  style={[styles.classChip, { backgroundColor: getClassColor(item.gradeClass) }]}
                  textStyle={{ color: 'white', fontWeight: '700' }}
                  compact
                >
                  {item.gradeClass}クラス
                </Chip>
              </View>
            </View>
            <View style={styles.rankRight}>
              <Text variant="headlineSmall" style={styles.score}>
                {item.averageScore.toFixed(1)}
              </Text>
              <Text variant="bodySmall" style={styles.scoreLabel}>平均点</Text>
              {item.monthlyImprovement > 0 && (
                <Text variant="bodySmall" style={styles.improvement}>
                  ↑ +{item.monthlyImprovement.toFixed(1)}%
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <div style={{ padding: 16 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>成績ランキング</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            みんなで高め合おう！
          </Text>
        </View>

        {/* 自分の成績サマリー */}
        {myStats && (
          <Card style={styles.myStatsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.myStatsTitle}>あなたの成績</Text>
              <View style={styles.myStatsRow}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {myStats.rank}位
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>総合順位</Text>
                </View>
                <View style={styles.statItem}>
                  <Chip 
                    style={[styles.classChipLarge, { backgroundColor: getClassColor(myStats.gradeClass) }]}
                    textStyle={{ color: 'white', fontWeight: '700', fontSize: 20 }}
                  >
                    {myStats.gradeClass}
                  </Chip>
                  <Text variant="bodySmall" style={styles.statLabel}>クラス</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {myStats.averageScore.toFixed(1)}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>平均点</Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.classDesc}>
                {CLASS_DESCRIPTIONS[myStats.gradeClass]}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* 月間MVP */}
        {mvp && mvp.monthlyImprovement > 0 && (
          <Card style={styles.mvpCard}>
            <Card.Content>
              <View style={styles.mvpHeader}>
                <Text variant="titleLarge" style={styles.mvpTitle}>🏆 今月のMVP</Text>
              </View>
              <Text variant="bodyLarge" style={styles.mvpName}>
                {getPartnerInfo(mvp.userId)?.nickname}
              </Text>
              <Text variant="bodyMedium" style={styles.mvpDesc}>
                今月 +{mvp.monthlyImprovement.toFixed(1)}% 成長！
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* ビュー切り替え */}
        <SegmentedButtons
          value={viewType}
          onValueChange={(value) => setViewType(value as ViewType)}
          buttons={[
            { value: 'all', label: '全体ランキング' },
            { value: 'class', label: 'クラス別' },
          ]}
          style={styles.tabs}
        />

        {/* クラス選択 */}
        {viewType === 'class' && (
          <View style={styles.classSelector}>
            {(['S', 'A', 'B', 'C', 'D'] as const).map(cls => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classButton,
                  { backgroundColor: getClassColor(cls) },
                  selectedClass === cls && styles.selectedClassButton
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text style={styles.classButtonText}>{cls}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ランキングリスト */}
        <FlatList
          data={currentRanking}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.userId}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </div>

      {/* 成績入力ボタン */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        label="成績を登録"
        onPress={() => navigation.navigate('GradeInput')}
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
  myStatsCard: {
    marginBottom: 16,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.PRIMARY,
  },
  myStatsTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  myStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  classChipLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  classDesc: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mvpCard: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  mvpHeader: {
    marginBottom: 8,
  },
  mvpTitle: {
    fontWeight: '700',
    color: '#D4AF37',
  },
  mvpName: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  mvpDesc: {
    color: COLORS.TEXT_SECONDARY,
  },
  tabs: {
    marginBottom: 16,
  },
  classSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  classButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedClassButton: {
    borderWidth: 3,
    borderColor: COLORS.TEXT_PRIMARY,
  },
  classButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  rankCard: {
    marginBottom: 12,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
  },
  myRankCard: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topRankBadge: {
    backgroundColor: '#FFD700',
  },
  rankNumber: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  classChip: {
    alignSelf: 'flex-start',
  },
  rankRight: {
    alignItems: 'flex-end',
  },
  score: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  scoreLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
  },
  improvement: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: COLORS.PRIMARY,
  },
});
