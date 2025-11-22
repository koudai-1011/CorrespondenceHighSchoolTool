// アナリティクスのダミーデータ

export interface AnalyticsData {
  // ユーザー統計
  totalUsers: number;
  activeUsers: number; // DAU (Daily Active Users)
  monthlyActiveUsers: number; // MAU
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;

  // エンゲージメント統計
  totalPosts: number;
  postsToday: number;
  postsThisWeek: number;
  postsThisMonth: number;
  totalComments: number;
  totalLikes: number;

  // チャット統計
  totalMessages: number;
  messagesThisWeek: number;
  activeChatRooms: number;

  // 成績統計
  totalGradeEntries: number;
  gradeEntriesThisWeek: number;

  // トレンドデータ（過去7日間）
  dailyActiveUsersChart: { date: string; value: number }[];
  dailyPostsChart: { date: string; value: number }[];
  userGrowthChart: { date: string; value: number }[];
}

// ダミーのアナリティクスデータ
export const DUMMY_ANALYTICS: AnalyticsData = {
  // ユーザー統計
  totalUsers: 1247,
  activeUsers: 342, // 今日アクティブなユーザー
  monthlyActiveUsers: 891,
  newUsersToday: 12,
  newUsersThisWeek: 78,
  newUsersThisMonth: 234,

  // エンゲージメント統計
  totalPosts: 5834,
  postsToday: 45,
  postsThisWeek: 312,
  postsThisMonth: 1456,
  totalComments: 12489,
  totalLikes: 28934,

  // チャット統計
  totalMessages: 34567,
  messagesThisWeek: 2345,
  activeChatRooms: 156,

  // 成績統計
  totalGradeEntries: 8934,
  gradeEntriesThisWeek: 567,

  // トレンドデータ
  dailyActiveUsersChart: [
    { date: '11/15', value: 298 },
    { date: '11/16', value: 312 },
    { date: '11/17', value: 287 },
    { date: '11/18', value: 334 },
    { date: '11/19', value: 356 },
    { date: '11/20', value: 328 },
    { date: '11/21', value: 342 },
  ],
  dailyPostsChart: [
    { date: '11/15', value: 38 },
    { date: '11/16', value: 42 },
    { date: '11/17', value: 35 },
    { date: '11/18', value: 48 },
    { date: '11/19', value: 52 },
    { date: '11/20', value: 44 },
    { date: '11/21', value: 45 },
  ],
  userGrowthChart: [
    { date: '11/15', value: 1013 },
    { date: '11/16', value: 1025 },
    { date: '11/17', value: 1038 },
    { date: '11/18', value: 1067 },
    { date: '11/19', value: 1089 },
    { date: '11/20', value: 1123 },
    { date: '11/21', value: 1247 },
  ],
};

// エンゲージメント率を計算
export const calculateEngagementRate = (
  activeUsers: number,
  totalPosts: number,
  totalComments: number,
  totalLikes: number
): number => {
  const totalEngagements = totalPosts + totalComments + totalLikes;
  if (activeUsers === 0) return 0;
  return (totalEngagements / activeUsers) * 100;
};

// ユーザー保持率を計算 (MAU / 総ユーザー数)
export const calculateRetentionRate = (
  monthlyActiveUsers: number,
  totalUsers: number
): number => {
  if (totalUsers === 0) return 0;
  return (monthlyActiveUsers / totalUsers) * 100;
};
