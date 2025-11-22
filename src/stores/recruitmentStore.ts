import { create } from 'zustand';

export type RecruitmentCategory = 'game' | 'study' | 'event' | 'chat' | 'other';
export type RecruitmentStatus = 'open' | 'closed';

export interface RecruitmentPost {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: RecruitmentCategory;
  eventDate: Date;
  location: string; // オンライン or 場所名
  maxParticipants?: number;
  currentParticipants: string[]; // userId list
  status: RecruitmentStatus;
  createdAt: Date;
}

interface RecruitmentState {
  recruitments: RecruitmentPost[];
  
  // Actions
  addRecruitment: (recruitment: Omit<RecruitmentPost, 'id' | 'currentParticipants' | 'status' | 'createdAt'>) => void;
  joinRecruitment: (recruitmentId: string, userId: string) => void;
  leaveRecruitment: (recruitmentId: string, userId: string) => void;
  closeRecruitment: (recruitmentId: string) => void;
  getRecruitmentsByCategory: (category: RecruitmentCategory) => RecruitmentPost[];
  getRecruitmentsByUserId: (userId: string) => RecruitmentPost[];
  isUrgent: (recruitment: RecruitmentPost) => boolean;
  isNew: (recruitment: RecruitmentPost) => boolean;
}

// ダミーデータ生成
const generateDummyRecruitments = (): RecruitmentPost[] => {
  const now = new Date();
  return [
    {
      id: 'rec1',
      userId: 'user2',
      title: '今夜APEXランク募集！',
      description: 'ゴールド帯です。楽しくできる方募集！VCありでお願いします。',
      category: 'game',
      eventDate: new Date(now.getTime() + 1000 * 60 * 60 * 3), // 3時間後
      location: 'オンライン (Discord)',
      maxParticipants: 2,
      currentParticipants: ['user2'],
      status: 'open',
      createdAt: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      id: 'rec2',
      userId: 'user3',
      title: '数学の課題一緒にやりませんか？',
      description: '数IIの微積がわかりません...教えてくれる方、もしくは一緒に悩んでくれる方！',
      category: 'study',
      eventDate: new Date(now.getTime() + 1000 * 60 * 60 * 24), // 明日
      location: 'オンライン (Zoom)',
      maxParticipants: 3,
      currentParticipants: ['user3', 'user4'],
      status: 'open',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'rec3',
      userId: 'user5',
      title: '都内でカフェ会',
      description: '通信制高校に通う人同士で話しませんか？新宿あたりで。',
      category: 'event',
      eventDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3), // 3日後
      location: '新宿',
      maxParticipants: 5,
      currentParticipants: ['user5'],
      status: 'open',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
    },
    {
      id: 'rec4',
      userId: 'user1', // 自分
      title: 'VALORANT アンレート',
      description: '初心者です！優しく教えてくれる方募集。',
      category: 'game',
      eventDate: new Date(now.getTime() + 1000 * 60 * 60 * 1), // 1時間後
      location: 'オンライン',
      maxParticipants: 4,
      currentParticipants: ['user1'],
      status: 'open',
      createdAt: new Date(now.getTime() - 1000 * 60 * 10),
    },
  ];
};

export const useRecruitmentStore = create<RecruitmentState>((set, get) => ({
  recruitments: generateDummyRecruitments(),

  addRecruitment: (recruitmentData) => set((state) => ({
    recruitments: [
      {
        ...recruitmentData,
        id: Math.random().toString(36).substring(7),
        currentParticipants: [recruitmentData.userId],
        status: 'open',
        createdAt: new Date(),
      },
      ...state.recruitments,
    ],
  })),

  joinRecruitment: (recruitmentId, userId) => set((state) => ({
    recruitments: state.recruitments.map((rec) => {
      if (rec.id !== recruitmentId) return rec;
      if (rec.currentParticipants.includes(userId)) return rec;
      if (rec.maxParticipants && rec.currentParticipants.length >= rec.maxParticipants) return rec;
      
      return {
        ...rec,
        currentParticipants: [...rec.currentParticipants, userId],
      };
    }),
  })),

  leaveRecruitment: (recruitmentId, userId) => set((state) => ({
    recruitments: state.recruitments.map((rec) => {
      if (rec.id !== recruitmentId) return rec;
      return {
        ...rec,
        currentParticipants: rec.currentParticipants.filter((id) => id !== userId),
      };
    }),
  })),

  closeRecruitment: (recruitmentId) => set((state) => ({
    recruitments: state.recruitments.map((rec) => 
      rec.id === recruitmentId ? { ...rec, status: 'closed' } : rec
    ),
  })),

  getRecruitmentsByCategory: (category) => {
    const { recruitments } = get();
    return recruitments.filter((rec) => rec.category === category);
  },

  getRecruitmentsByUserId: (userId) => {
    const { recruitments } = get();
    return recruitments.filter((rec) => rec.userId === userId);
  },

  isUrgent: (recruitment) => {
    const now = new Date();
    const diff = recruitment.eventDate.getTime() - now.getTime();
    // 24時間以内なら急募
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  },

  isNew: (recruitment) => {
    const now = new Date();
    const diff = now.getTime() - recruitment.createdAt.getTime();
    // 3時間以内なら新着
    return diff < 3 * 60 * 60 * 1000;
  },
}));
