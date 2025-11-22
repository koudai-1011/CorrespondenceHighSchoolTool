import { create } from 'zustand';

export type ReportTargetType = 'USER' | 'MESSAGE' | 'BULLETIN';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved';
export type BanType = 'temporary' | 'permanent';

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportTargetType;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface UserBan {
  id: string;
  userId: string;
  bannedBy: string; // 管理者ID
  banType: BanType;
  startDate: Date;
  endDate?: Date; // temporaryの場合のみ
  reason: string;
  relatedReportIds?: string[];
}

interface ModerationState {
  reports: Report[];
  blocks: Block[];
  bans: UserBan[];
  
  // 通報アクション
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  
  // ブロックアクション
  blockUser: (blockerId: string, blockedId: string) => void;
  unblockUser: (blockerId: string, blockedId: string) => void;
  isBlocked: (userId1: string, userId2: string) => boolean;
  
  // BAN管理
  banUser: (ban: Omit<UserBan, 'id' | 'startDate'>) => void;
  unbanUser: (banId: string) => void;
  isBanned: (userId: string) => boolean;
  getBanInfo: (userId: string) => UserBan | undefined;
  getActiveBans: () => UserBan[];

  // NGワード管理
  ngWords: string[];
  addNgWord: (word: string) => void;
  removeNgWord: (word: string) => void;
  resetNgWords: () => void;
}

const INITIAL_NG_WORDS = [
  '死ね', '殺す', 'キモい', 'うざい', '馬鹿', 'アホ', 'ゴミ', 'カス',
  'エロ', 'セフレ', 'やりたい',
  '薬', '売ります', '買います',
  'LINE', 'ライン', 'ID', '電話番号'
];

// ダミーデータ
const DUMMY_REPORTS: Report[] = [
  {
    id: 'r1',
    reporterId: 'user2',
    targetId: 'user1',
    targetType: 'USER',
    reason: 'inappropriate',
    details: 'プロフィールに不適切な内容が含まれています',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
  },
];

const DUMMY_BLOCKS: Block[] = [];
const DUMMY_BANS: UserBan[] = [];

export const useModerationStore = create<ModerationState>((set, get) => ({
  reports: DUMMY_REPORTS,
  blocks: DUMMY_BLOCKS,
  bans: DUMMY_BANS,
  ngWords: INITIAL_NG_WORDS,

  // 通報機能
  addReport: (reportData) => set((state) => ({
    reports: [
      ...state.reports,
      {
        ...reportData,
        id: Math.random().toString(36).substring(7),
        status: 'pending',
        createdAt: new Date(),
      },
    ],
  })),

  updateReportStatus: (id, status) => set((state) => ({
    reports: state.reports.map((r) => 
      r.id === id ? { ...r, status } : r
    ),
  })),

  // ブロック機能
  blockUser: (blockerId, blockedId) => set((state) => {
    if (state.blocks.some(b => b.blockerId === blockerId && b.blockedId === blockedId)) {
      return state;
    }
    return {
      blocks: [
        ...state.blocks,
        {
          id: Math.random().toString(36).substring(7),
          blockerId,
          blockedId,
          createdAt: new Date(),
        },
      ],
    };
  }),

  unblockUser: (blockerId, blockedId) => set((state) => ({
    blocks: state.blocks.filter(
      (b) => !(b.blockerId === blockerId && b.blockedId === blockedId)
    ),
  })),

  isBlocked: (userId1, userId2) => {
    const { blocks } = get();
    return blocks.some(
      (b) => 
        (b.blockerId === userId1 && b.blockedId === userId2) || 
        (b.blockerId === userId2 && b.blockedId === userId1)
    );
  },

  // BAN機能
  banUser: (banData) => set((state) => ({
    bans: [
      ...state.bans,
      {
        ...banData,
        id: Math.random().toString(36).substring(7),
        startDate: new Date(),
      },
    ],
  })),

  unbanUser: (banId) => set((state) => ({
    bans: state.bans.filter(b => b.id !== banId),
  })),

  isBanned: (userId) => {
    const { bans } = get();
    const now = new Date();
    return bans.some(ban => {
      if (ban.userId !== userId) return false;
      if (ban.banType === 'permanent') return true;
      // 一時停止の場合、期限をチェック
      if (ban.endDate && ban.endDate > now) return true;
      return false;
    });
  },

  getBanInfo: (userId) => {
    const { bans } = get();
    const now = new Date();
    const activeBan = bans.find(ban => {
      if (ban.userId !== userId) return false;
      if (ban.banType === 'permanent') return true;
      if (ban.endDate && ban.endDate > now) return true;
      return false;
    });
    return activeBan; // Changed from null to undefined to match interface
  },

  getActiveBans: () => {
    const { bans } = get();
    const now = new Date();
    return bans.filter(ban => {
      if (ban.banType === 'permanent') return true;
      if (ban.endDate && ban.endDate > now) return true;
      return false;
    });
  },

  // NGワード管理アクション
  addNgWord: (word) => set((state) => ({
    ngWords: state.ngWords.includes(word) ? state.ngWords : [...state.ngWords, word]
  })),
  removeNgWord: (word) => set((state) => ({
    ngWords: state.ngWords.filter(w => w !== word)
  })),
  resetNgWords: () => set({ ngWords: INITIAL_NG_WORDS }),
}));
