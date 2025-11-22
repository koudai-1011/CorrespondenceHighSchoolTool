// お知らせのダミーデータ

export interface Announcement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  backgroundColor: string;
  createdAt: Date;
}

export const DUMMY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: '新機能リリース！',
    description: '成績ランキング機能が追加されました',
    backgroundColor: '#6B9BD1',
    link: '/GradeRanking',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'ann2',
    title: 'メンテナンスのお知らせ',
    description: '11/25 23:00〜24:00にメンテナンスを実施します',
    backgroundColor: '#F4A261',
    createdAt: new Date('2024-11-19'),
  },
  {
    id: 'ann3',
    title: '勉強会イベント開催',
    description: '12月1日にオンライン勉強会を開催します！',
    backgroundColor: '#81C784',
    link: '/Board',
    createdAt: new Date('2024-11-18'),
  },
  {
    id: 'ann4',
    title: 'アンケート実施中',
    description: 'アプリの改善にご協力ください',
    backgroundColor: '#BA68C8',
    createdAt: new Date('2024-11-17'),
  },
  {
    id: 'ann5',
    title: 'プロフィール機能強化',
    description: 'タグのジャンル別表示が可能になりました',
    backgroundColor: '#FF6B9D',
    link: '/ProfileEdit',
    createdAt: new Date('2024-11-16'),
  },
  {
    id: 'ann6',
    title: 'チャット機能改善',
    description: '既読機能とスタンプ機能を追加予定',
    backgroundColor: '#00BCD4',
    link: '/ChatList',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'ann7',
    title: 'サポート時間延長',
    description: '平日のサポート時間を21時まで延長しました',
    backgroundColor: '#FFA726',
    createdAt: new Date('2024-11-14'),
  },
  {
    id: 'ann8',
    title: '新しいタグ追加',
    description: '趣味カテゴリに新しいタグを追加しました',
    backgroundColor: '#7E57C2',
    link: '/DetailedTagInput',
    createdAt: new Date('2024-11-13'),
  },
  {
    id: 'ann9',
    title: 'バグ修正',
    description: 'いくつかの不具合を修正しました',
    backgroundColor: '#66BB6A',
    createdAt: new Date('2024-11-12'),
  },
  {
    id: 'ann10',
    title: 'ユーザー数1000人突破！',
    description: 'ご利用ありがとうございます！',
    backgroundColor: '#FFD54F',
    link: '/UserExplore',
    createdAt: new Date('2024-11-11'),
  },
];
