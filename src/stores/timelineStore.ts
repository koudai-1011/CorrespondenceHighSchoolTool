import { create } from 'zustand';

export type PostVisibility = 'public' | 'followers' | 'close_friends';

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  visibility: PostVisibility;
  likes: string[]; // userIds who liked
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

interface TimelineState {
  posts: Post[];
  
  // Actions
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  addCommentToPost: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getPublicPosts: () => Post[];
  getFollowersPosts: (userId: string) => Post[];
}

// ダミーデータ生成
const generateDummyPosts = (): Post[] => {
  const now = new Date();
  return [
    {
      id: 'post1',
      userId: 'user2',
      content: '今日のAPEXめっちゃ調子良かった！ダイヤ到達できそう🎮',
      visibility: 'public',
      likes: ['user1', 'user3', 'user4'],
      comments: [
        {
          id: 'c1',
          userId: 'user1',
          content: 'おめでとう！',
          createdAt: new Date(now.getTime() - 1000 * 60 * 30),
        }
      ],
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'post2',
      userId: 'user3',
      content: 'レポート終わった〜疲れた💤',
      visibility: 'public',
      likes: ['user1', 'user2'],
      comments: [],
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
    },
    {
      id: 'post3',
      userId: 'user1',
      content: '今日は良い天気だったな☀️散歩してリフレッシュできた',
      visibility: 'public',
      likes: ['user2'],
      comments: [],
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
    },
    {
      id: 'post4',
      userId: 'user4',
      content: '大学のオープンキャンパス行ってきた！めっちゃ楽しかった',
      visibility: 'followers',
      likes: ['user1', 'user3'],
      comments: [],
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    },
  ];
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  posts: generateDummyPosts(),

  addPost: (postData) => set((state) => ({
    posts: [
      {
        ...postData,
        id: Math.random().toString(36).substring(7),
        likes: [],
        comments: [],
        createdAt: new Date(),
      },
      ...state.posts,
    ],
  })),

  likePost: (postId, userId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId && !post.likes.includes(userId)
        ? { ...post, likes: [...post.likes, userId] }
        : post
    ),
  })),

  unlikePost: (postId, userId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes.filter(id => id !== userId) }
        : post
    ),
  })),

  addCommentToPost: (postId, commentData) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                ...commentData,
                id: Math.random().toString(36).substring(7),
                createdAt: new Date(),
              }
            ]
          }
        : post
    ),
  })),

  getPublicPosts: () => {
    const { posts } = get();
    return posts.filter(post => post.visibility === 'public');
  },

  getFollowersPosts: (userId) => {
    const { posts } = get();
    // 簡易実装: フォロー関係を考慮せず、followersとpublicを返す
    return posts.filter(post => 
      post.visibility === 'public' || post.visibility === 'followers'
    );
  },
}));
