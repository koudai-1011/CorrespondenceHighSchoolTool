import { DUMMY_USERS, User } from './dummyUsers';

// フォロー関係のダミーデータ
export interface Follow {
  followerId: string;  // フォローする人
  followingId: string; // フォローされる人
  createdAt: Date;
}

// ダミーフォローデータ
export const DUMMY_FOLLOWS: Follow[] = [
  { followerId: 'user1', followingId: 'user2', createdAt: new Date('2024-01-15') },
  { followerId: 'user1', followingId: 'user3', createdAt: new Date('2024-01-16') },
  { followerId: 'user1', followingId: 'user5', createdAt: new Date('2024-01-17') },
  { followerId: 'user2', followingId: 'user1', createdAt: new Date('2024-01-18') },
  { followerId: 'user2', followingId: 'user4', createdAt: new Date('2024-01-19') },
  { followerId: 'user3', followingId: 'user1', createdAt: new Date('2024-01-20') },
  { followerId: 'user4', followingId: 'user2', createdAt: new Date('2024-01-21') },
  { followerId: 'user5', followingId: 'user1', createdAt: new Date('2024-01-22') },
];

// フォロー状態の確認
export const isFollowing = (followerId: string, followingId: string): boolean => {
  return DUMMY_FOLLOWS.some(
    f => f.followerId === followerId && f.followingId === followingId
  );
};

// フォロワー一覧を取得
export const getFollowers = (userId: string): User[] => {
  const followerIds = DUMMY_FOLLOWS
    .filter(f => f.followingId === userId)
    .map(f => f.followerId);
  
  return DUMMY_USERS.filter(u => followerIds.includes(u.id));
};

// フォロー中一覧を取得
export const getFollowing = (userId: string): User[] => {
  const followingIds = DUMMY_FOLLOWS
    .filter(f => f.followerId === userId)
    .map(f => f.followingId);
  
  return DUMMY_USERS.filter(u => followingIds.includes(u.id));
};

// フォロワー数を取得
export const getFollowerCount = (userId: string): number => {
  return DUMMY_FOLLOWS.filter(f => f.followingId === userId).length;
};

// フォロー中の数を取得
export const getFollowingCount = (userId: string): number => {
  return DUMMY_FOLLOWS.filter(f => f.followerId === userId).length;
};

// つぶやき（ツイート）のデータ構造
export interface Tweet {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: Date;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
}

// ダミーつぶやきデータ
export const DUMMY_TWEETS: Tweet[] = [
  {
    id: 't1',
    userId: 'user2',
    userName: 'さくら',
    userColor: '#E91E63',
    content: '今日の勉強、英語の長文が少し読めるようになってきた！継続は力なりって本当だね📚',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likeCount: 5,
    commentCount: 2,
  },
  {
    id: 't2',
    userId: 'user3',
    userName: 'ゆうと',
    userColor: '#2196F3',
    content: 'アニメ見ながらゆっくり休憩中。明日からまた頑張ろ～',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likeCount: 3,
    commentCount: 1,
  },
  {
    id: 't3',
    userId: 'user5',
    userName: 'あおい',
    userColor: '#00BCD4',
    content: 'イラスト完成！久しぶりに納得いく作品ができた✨',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likeCount: 12,
    commentCount: 4,
  },
  {
    id: 't4',
    userId: 'user2',
    userName: 'さくら',
    userColor: '#E91E63',
    content: '今日は早起きできた！朝の時間って気持ちいいね☀️',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likeCount: 7,
    commentCount: 3,
  },
];

// フォロー中のつぶやきを取得
export const getFollowingTweets = (userId: string): Tweet[] => {
  const followingIds = getFollowing(userId).map(u => u.id);
  return DUMMY_TWEETS
    .filter(t => followingIds.includes(t.userId))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
