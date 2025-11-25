// ダミーユーザーデータ（プロトタイプ用）
// ダミーユーザーデータ（プロトタイプ用）
import { User } from '../types/user';

export { User }; // Re-export for backward compatibility during refactoring


export const DUMMY_USERS: User[] = [
  {
    id: '1',
    nickname: 'あおい',
    schoolName: 'N高等学校',
    prefecture: '東京都',
    grade: '2',
    age: '17',
    gender: '女性',
    bio: 'アニメとゲームが大好きです！仲良くしてください！',
    careerPath: '大学進学',
    themeColor: '#6B9BD1',
    detailedTags: [
      { category: '漫画・アニメ', name: 'ONE PIECE' },
      { category: '漫画・アニメ', name: '鬼滅の刃' },
      { category: 'ゲーム', name: 'Apex Legends' },
      { category: '音楽', name: 'YOASOBI' },
      { category: 'スポーツ', name: 'バスケ' },
    ],
    communicationType: {
      approachability: 4,
      initiative: 3,
      responseSpeed: 3,
      groupPreference: 'small',
      textVsVoice: 'text',
      deepVsCasual: 4,
      onlineActivity: 3,
    },
    followerCount: 12,
    lastActive: new Date('2025-11-21').toISOString(),
    createdAt: new Date('2025-11-01').toISOString(),
    studyProfile: {
      mockExamName: '進研模試',
      targetUniversity: '早稲田大学',
      subjects: ['英語', '国語', '日本史'],
    },
    seasonalQuestion: {
      question: '冬の楽しみは？',
      answer: 'こたつでみかん',
    },
    titles: [
      { id: 't1', name: '新人', description: 'アプリに初登録', iconColor: '#4CAF50', obtainedAt: new Date('2025-11-01').toISOString() },
      { id: 't2', name: 'アクティブ', description: '7日間連続ログイン', iconColor: '#2196F3', obtainedAt: new Date('2025-11-08').toISOString() },
    ],
    currentTitleId: 't2',
  },
  {
    id: '2',
    nickname: 'ゆうき',
    schoolName: 'S高等学校',
    prefecture: '神奈川県',
    grade: '3',
    age: '18',
    gender: '男性',
    bio: 'FPSゲームやってます。ランク上げ手伝ってください。',
    careerPath: '専門学校',
    themeColor: '#F4A261',
    detailedTags: [
      { category: '漫画・アニメ', name: '呪術廻戦' },
      { category: 'ゲーム', name: 'VALORANT' },
      { category: 'ゲーム', name: 'Apex Legends' },
      { category: '音楽', name: 'Ado' },
      { category: 'スポーツ', name: 'サッカー' },
    ],
    communicationType: {
      approachability: 4,
      initiative: 5,
      responseSpeed: 5,
      groupPreference: 'large',
      textVsVoice: 'both',
      deepVsCasual: 2,
      onlineActivity: 5,
    },
    followerCount: 25,
    lastActive: new Date('2025-11-22').toISOString(),
    createdAt: new Date('2025-10-15').toISOString(),
    seasonalQuestion: {
      question: '冬の楽しみは？',
      answer: 'スノボに行きたい',
    },
  },
  {
    id: '3',
    nickname: 'さくら',
    schoolName: 'クラーク記念国際高等学校',
    prefecture: '大阪府',
    grade: '1',
    age: '16',
    gender: '女性',
    bio: 'イラスト描くのが趣味です。',
    careerPath: '未定',
    themeColor: '#F06292',
    detailedTags: [
      { category: '漫画・アニメ', name: 'SPY×FAMILY' },
      { category: '漫画・アニメ', name: '推しの子' },
      { category: 'ゲーム', name: 'あつまれ どうぶつの森' },
      { category: '音楽', name: 'YOASOBI' },
      { category: '趣味', name: 'イラスト' },
    ],
    communicationType: {
      approachability: 2,
      initiative: 2,
      responseSpeed: 3,
      groupPreference: 'one-on-one',
      textVsVoice: 'text',
      deepVsCasual: 4,
      onlineActivity: 2,
    },
    followerCount: 8,
    lastActive: new Date('2025-11-20').toISOString(),
    createdAt: new Date('2025-11-05').toISOString(),
    seasonalQuestion: {
      question: '冬の楽しみは？',
      answer: 'イルミネーション',
    },
  },
  {
    id: '4',
    nickname: 'りく',
    schoolName: '第一学院高等学校',
    prefecture: '愛知県',
    grade: '2',
    age: '17',
    gender: '男性',
    bio: 'バスケ部でした。今は通信制で勉強中。',
    careerPath: '大学進学',
    themeColor: '#81C784',
    detailedTags: [
      { category: '漫画・アニメ', name: 'ONE PIECE' },
      { category: 'ゲーム', name: 'ポケモン' },
      { category: 'ゲーム', name: 'マインクラフト' },
      { category: '音楽', name: 'Vaundy' },
      { category: 'スポーツ', name: 'バスケ' },
    ],
    communicationType: {
      approachability: 3,
      initiative: 4,
      responseSpeed: 4,
      groupPreference: 'small',
      textVsVoice: 'both',
      deepVsCasual: 3,
      onlineActivity: 4,
    },
    followerCount: 15,
    lastActive: new Date('2025-11-19').toISOString(),
    createdAt: new Date('2025-10-20').toISOString(),
    studyProfile: {
      mockExamName: '河合模試',
      targetUniversity: '明治大学',
      subjects: ['英語', '数学', '物理'],
    },
    seasonalQuestion: {
      question: '冬の楽しみは？',
      answer: '鍋パーティー',
    },
  },
  {
    id: '5',
    nickname: 'はると',
    schoolName: 'ルネサンス高等学校',
    prefecture: '福岡県',
    grade: '3',
    age: '18',
    gender: '男性',
    bio: 'スポーツ全般好きです！',
    careerPath: '就職',
    themeColor: '#BA68C8',
    detailedTags: [
      { category: '漫画・アニメ', name: 'ブルーロック' },
      { category: 'ゲーム', name: 'Apex Legends' },
      { category: 'ゲーム', name: 'スプラトゥーン' },
      { category: 'スポーツ', name: 'サッカー' },
      { category: 'スポーツ', name: '野球' },
    ],
    communicationType: {
      approachability: 3,
      initiative: 3,
      responseSpeed: 4,
      groupPreference: 'small',
      textVsVoice: 'voice',
      deepVsCasual: 3,
      onlineActivity: 4,
    },
    followerCount: 20,
    lastActive: new Date('2025-11-21').toISOString(),
    createdAt: new Date('2025-09-01').toISOString(),
    seasonalQuestion: {
      question: '冬の楽しみは？',
      answer: '温泉旅行',
    },
  },
];

// タグ一致数を計算する関数
export const calculateTagMatches = (userTags: { name: string }[], targetTags: { name: string }[]): number => {
  const userTagNames = userTags.map(t => t.name);
  const targetTagNames = targetTags.map(t => t.name);
  return userTagNames.filter(tag => targetTagNames.includes(tag)).length;
};

// ユーザーをソートする関数
export function sortUsers(users: User[], sortKey: string, currentUserTags?: { name: string }[]): User[] {
  const sorted = [...users];
  
  switch (sortKey) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
    case 'follower':
      return sorted.sort((a, b) => b.followerCount - a.followerCount);
    case 'new':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'match':
      if (!currentUserTags) return sorted;
      return sorted.sort((a, b) => {
        const matchA = calculateTagMatches(currentUserTags, a.detailedTags);
        const matchB = calculateTagMatches(currentUserTags, b.detailedTags);
        return matchB - matchA;
      });
    default:
      return sorted;
  }
};
