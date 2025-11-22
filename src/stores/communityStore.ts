import { create } from 'zustand';

export type CommunityCategory = 'game' | 'study' | 'career' | 'love' | 'chat' | 'other';

export interface Topic {
  id: string;
  categoryId: CommunityCategory;
  authorId: string;
  title: string;
  content: string;
  commentCount: number;
  viewCount: number;
  lastCommentAt: Date;
  createdAt: Date;
}

export interface Comment {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

interface CommunityState {
  topics: Topic[];
  comments: Comment[];
  
  // Actions
  addTopic: (topic: Omit<Topic, 'id' | 'commentCount' | 'viewCount' | 'lastCommentAt' | 'createdAt'>) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getTopicsByCategory: (category: CommunityCategory) => Topic[];
  getCommentsByTopicId: (topicId: string) => Comment[];
  incrementViewCount: (topicId: string) => void;
  getTrendingTopics: () => Topic[];
  getNewestTopics: () => Topic[];
}

// ダミーデータ生成
const generateDummyTopics = (): Topic[] => {
  const now = new Date();
  return [
    {
      id: 'topic1',
      categoryId: 'game',
      authorId: 'user2',
      title: 'APEXのランク構成について語りたい',
      content: '最近ゴールド帯で詰まってます...みんなはどんな構成で回してますか？',
      commentCount: 8,
      viewCount: 45,
      lastCommentAt: new Date(now.getTime() - 1000 * 60 * 30), // 30分前
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5時間前
    },
    {
      id: 'topic2',
      categoryId: 'study',
      authorId: 'user3',
      title: '数学IIの微分積分が難しい...',
      content: '教科書の例題は解けるんですが、応用問題になると手が出ません。おすすめの参考書ありますか？',
      commentCount: 12,
      viewCount: 78,
      lastCommentAt: new Date(now.getTime() - 1000 * 60 * 15), // 15分前
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1日前
    },
    {
      id: 'topic3',
      categoryId: 'career',
      authorId: 'user4',
      title: '大学選びで迷ってます',
      content: 'IT系の大学に進みたいんですが、私立と国公立どっちがいいですかね？',
      commentCount: 15,
      viewCount: 92,
      lastCommentAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2時間前
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2日前
    },
    {
      id: 'topic4',
      categoryId: 'chat',
      authorId: 'user5',
      title: '最近見たアニメの話',
      content: '推しの子の新シーズン楽しみすぎる！',
      commentCount: 20,
      viewCount: 120,
      lastCommentAt: new Date(now.getTime() - 1000 * 60 * 5), // 5分前
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10), // 10時間前
    },
  ];
};

const generateDummyComments = (): Comment[] => {
  const now = new Date();
  return [
    {
      id: 'comment1',
      topicId: 'topic1',
      authorId: 'user1',
      content: 'ブラハ・ライフライン・ジブラルタルの構成がおすすめです！',
      createdAt: new Date(now.getTime() - 1000 * 60 * 45),
    },
    {
      id: 'comment2',
      topicId: 'topic1',
      authorId: 'user3',
      content: '自分はオクタン使ってます。機動力大事！',
      createdAt: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      id: 'comment3',
      topicId: 'topic2',
      authorId: 'user1',
      content: 'チャート式がおすすめです！',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
    },
  ];
};

export const useCommunityStore = create<CommunityState>((set, get) => ({
  topics: generateDummyTopics(),
  comments: generateDummyComments(),

  addTopic: (topicData) => set((state) => ({
    topics: [
      {
        ...topicData,
        id: Math.random().toString(36).substring(7),
        commentCount: 0,
        viewCount: 0,
        lastCommentAt: new Date(),
        createdAt: new Date(),
      },
      ...state.topics,
    ],
  })),

  addComment: (commentData) => set((state) => {
    const newComment: Comment = {
      ...commentData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
    };

    // トピックのコメント数と最終コメント日時を更新
    const updatedTopics = state.topics.map(topic => 
      topic.id === commentData.topicId
        ? { ...topic, commentCount: topic.commentCount + 1, lastCommentAt: new Date() }
        : topic
    );

    return {
      comments: [...state.comments, newComment],
      topics: updatedTopics,
    };
  }),

  getTopicsByCategory: (category) => {
    const { topics } = get();
    return topics.filter(topic => topic.categoryId === category);
  },

  getCommentsByTopicId: (topicId) => {
    const { comments } = get();
    return comments.filter(comment => comment.topicId === topicId);
  },

  incrementViewCount: (topicId) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId ? { ...topic, viewCount: topic.viewCount + 1 } : topic
    ),
  })),

  getTrendingTopics: () => {
    const { topics } = get();
    const now = new Date();
    // 24時間以内のコメント数と閲覧数でスコア計算
    return [...topics].sort((a, b) => {
      const scoreA = (a.commentCount * 2) + a.viewCount + (now.getTime() - a.lastCommentAt.getTime() < 86400000 ? 50 : 0);
      const scoreB = (b.commentCount * 2) + b.viewCount + (now.getTime() - b.lastCommentAt.getTime() < 86400000 ? 50 : 0);
      return scoreB - scoreA;
    });
  },

  getNewestTopics: () => {
    const { topics } = get();
    return [...topics].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
}));
