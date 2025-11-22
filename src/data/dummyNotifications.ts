// 通知のダミーデータ

export type NotificationType = 'dm' | 'follow' | 'timeline_post' | 'update' | 'admin_notice';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: Date;
  read: boolean;
  link?: string; // 遷移先のリンク（オプション）
}

export const DUMMY_NOTIFICATIONS: Notification[] = [
  // DM受信
  {
    id: 'notif1',
    type: 'dm',
    userId: 'user2',
    userName: 'ゆうき',
    userColor: '#F4A261',
    content: '新しいメッセージが届きました',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10分前
    read: false,
    link: '/ChatList',
  },
  // フォローされた
  {
    id: 'notif2',
    type: 'follow',
    userId: 'user5',
    userName: 'はると',
    userColor: '#BA68C8',
    content: 'さんがあなたをフォローしました',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
    read: false,
  },
  // フォローユーザーの投稿
  {
    id: 'notif3',
    type: 'timeline_post',
    userId: 'user3',
    userName: 'さくら',
    userColor: '#F06292',
    content: 'さんが新しい投稿をしました: 「今日のテスト頑張った！」',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5時間前
    read: true,
    link: '/Timeline',
  },
  // アップデートのお知らせ
  {
    id: 'notif4',
    type: 'update',
    userId: 'system',
    userName: 'システム',
    userColor: '#00BCD4',
    content: 'アプリが最新バージョンにアップデートされました（v2.1.0）',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1日前
    read: true,
  },
  // 運営からの連絡
  {
    id: 'notif5',
    type: 'admin_notice',
    userId: 'admin',
    userName: '運営チーム',
    userColor: '#FF6B9D',
    content: 'メンテナンスのお知らせ：11/25 23:00〜24:00',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2日前
    read: true,
    link: '/Home',
  },
  // DM受信
  {
    id: 'notif6',
    type: 'dm',
    userId: 'user4',
    userName: 'りく',
    userColor: '#81C784',
    content: '新しいメッセージが届きました',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3日前
    read: true,
    link: '/ChatList',
  },
  // フォローされた
  {
    id: 'notif7',
    type: 'follow',
    userId: 'user1',
    userName: 'あおい',
    userColor: '#6B9BD1',
    content: 'さんがあなたをフォローしました',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000), // 4日前
    read: true,
  },
  // フォローユーザーの投稿
  {
    id: 'notif8',
    type: 'timeline_post',
    userId: 'user2',
    userName: 'ゆうき',
    userColor: '#F4A261',
    content: 'さんが新しい投稿をしました: 「明日から期末テスト！」',
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000), // 5日前
    read: true,
    link: '/Timeline',
  },
  // 運営からの連絡
  {
    id: 'notif9',
    type: 'admin_notice',
    userId: 'admin',
    userName: '運営チーム',
    userColor: '#FF6B9D',
    content: '新機能「成績ランキング」をリリースしました！',
    timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000), // 7日前
    read: true,
    link: '/GradeRanking',
  },
  // アップデートのお知らせ
  {
    id: 'notif10',
    type: 'update',
    userId: 'system',
    userName: 'システム',
    userColor: '#00BCD4',
    content: 'セキュリティアップデートを実施しました',
    timestamp: new Date(Date.now() - 240 * 60 * 60 * 1000), // 10日前
    read: true,
  },
];

// アイコンを取得する関数
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'dm':
      return 'message';
    case 'follow':
      return 'account-plus';
    case 'timeline_post':
      return 'timeline';
    case 'update':
      return 'update';
    case 'admin_notice':
      return 'bullhorn';
    default:
      return 'bell';
  }
};

// 通知タイプのラベルを取得する関数
export const getNotificationTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case 'dm':
      return 'メッセージ';
    case 'follow':
      return 'フォロー';
    case 'timeline_post':
      return 'タイムライン';
    case 'update':
      return 'アップデート';
    case 'admin_notice':
      return '運営からのお知らせ';
    default:
      return '通知';
  }
};
