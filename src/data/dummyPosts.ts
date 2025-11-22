// 掲示板投稿のダミーデータ
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  type: 'tweet' | 'recruit';
  content: string;
  tags: string[];
  timestamp: Date;
  likeCount: number;
  commentCount: number;
  isAnonymous: boolean;
}

export const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'あおい',
    userColor: '#6B9BD1',
    type: 'tweet',
    content: '今日は数学の勉強を3時間頑張った！微分積分がだんだん分かってきた気がする😊',
    tags: ['勉強', '数学'],
    timestamp: new Date('2025-11-22T02:30:00'),
    likeCount: 5,
    commentCount: 2,
    isAnonymous: false,
  },
  {
    id: '2',
    userId: '2',
    userName: 'ゆうき',
    userColor: '#F4A261',
    type: 'recruit',
    content: 'プログラミング勉強してる人いませんか？一緒に勉強できる仲間を探してます！Python初心者です🐍',
    tags: ['募集', 'プログラミング'],
    timestamp: new Date('2025-11-22T01:15:00'),
    likeCount: 8,
    commentCount: 4,
    isAnonymous: false,
  },
  {
    id: '3',
    userId: '3',
    userName: '匿名',
    userColor: '#90A4AE',
    type: 'tweet',
    content: '最近、自分のペースで勉強できるようになってきた。通信制高校に転校して良かったと思う。',
    tags: [],
    timestamp: new Date('2025-11-21T23:45:00'),
    likeCount: 12,
    commentCount: 3,
    isAnonymous: true,
  },
  {
    id: '4',
    userId: '4',
    userName: 'りく',
    userColor: '#81C784',
    type: 'recruit',
    content: '関東圏で一緒にカフェで勉強できる人募集！週末とか空いてる人いたら声かけてください☕',
    tags: ['募集', '勉強会', '関東'],
    timestamp: new Date('2025-11-21T20:00:00'),
    likeCount: 6,
    commentCount: 5,
    isAnonymous: false,
  },
  {
    id: '5',
    userId: '5',
    userName: 'はると',
    userColor: '#BA68C8',
    type: 'tweet',
    content: '今日は朝起きれた！小さな成功だけど嬉しい✨',
    tags: ['生活', '朝活'],
    timestamp: new Date('2025-11-21T18:30:00'),
    likeCount: 15,
    commentCount: 7,
    isAnonymous: false,
  },
];
