import { create } from 'zustand';
import { User } from '../types/user';

export type GroupJoinType = 'open' | 'approval';

export interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  tags: string[];
  creatorId: string;
  adminIds: string[]; // 管理者権限を持つユーザーID
  memberIds: string[]; // メンバー全員のID（管理者含む）
  pendingMemberIds: string[]; // 承認待ちユーザーID
  joinType: GroupJoinType;
  lastActivityAt: string; // ISO string
  createdAt: string; // ISO string
  isDeleted: boolean; // 60日ルールなどで削除された場合
}

interface GroupState {
  groups: Group[];
  
  // Actions
  createGroup: (group: Omit<Group, 'id' | 'createdAt' | 'lastActivityAt' | 'isDeleted' | 'adminIds' | 'memberIds' | 'pendingMemberIds'>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  joinGroup: (groupId: string, userId: string) => void;
  leaveGroup: (groupId: string, userId: string) => void;
  approveMember: (groupId: string, userId: string) => void;
  rejectMember: (groupId: string, userId: string) => void;
  addAdmin: (groupId: string, userId: string) => void;
  removeAdmin: (groupId: string, userId: string) => void;
  checkAutoDeletion: () => void; // 60日ルールチェック
}

// ダミーデータ
const DUMMY_GROUPS: Group[] = [
  {
    id: 'g1',
    name: '放課後ゲーム部',
    description: 'みんなでApexやValorantをやりましょう！初心者歓迎です。',
    imageUrl: 'https://placehold.co/200x200/333/fff?text=Game',
    tags: ['ゲーム', 'Apex Legends', 'VALORANT'],
    creatorId: 'user2',
    adminIds: ['user2'],
    memberIds: ['user2', 'user3', 'user4'],
    pendingMemberIds: [],
    joinType: 'open',
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5日前
    isDeleted: false,
  },
  {
    id: 'g2',
    name: 'イラスト練習会',
    description: 'お互いのイラストを見せ合ったりアドバイスし合ったりする場所です。',
    imageUrl: 'https://placehold.co/200x200/ff99cc/fff?text=Art',
    tags: ['イラスト', '趣味', '創作'],
    creatorId: 'user5',
    adminIds: ['user5'],
    memberIds: ['user5', 'user1'], // 自分(user1)が入っている
    pendingMemberIds: ['user6'],
    joinType: 'approval',
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2日前
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    isDeleted: false,
  },
  {
    id: 'g3',
    name: '進路相談室',
    description: '大学進学について情報交換しましょう。',
    imageUrl: null,
    tags: ['勉強', '進路', '大学受験'],
    creatorId: 'user8',
    adminIds: ['user8'],
    memberIds: ['user8'],
    pendingMemberIds: [],
    joinType: 'open',
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(), // 70日前（削除対象）
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(),
    isDeleted: false, // checkAutoDeletionでtrueになるはず
  },
];

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: DUMMY_GROUPS,

  createGroup: (groupData) => set((state) => {
    const newGroup: Group = {
      ...groupData,
      id: `g${Date.now()}`,
      adminIds: [groupData.creatorId],
      memberIds: [groupData.creatorId],
      pendingMemberIds: [],
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };
    return { groups: [newGroup, ...state.groups] };
  }),

  updateGroup: (id, updates) => set((state) => ({
    groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
  })),

  deleteGroup: (id) => set((state) => ({
    groups: state.groups.filter((g) => g.id !== id),
  })),

  joinGroup: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      if (g.joinType === 'open') {
        return { ...g, memberIds: [...g.memberIds, userId] };
      } else {
        return { ...g, pendingMemberIds: [...g.pendingMemberIds, userId] };
      }
    }),
  })),

  leaveGroup: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        memberIds: g.memberIds.filter((id) => id !== userId),
        adminIds: g.adminIds.filter((id) => id !== userId),
      };
    }),
  })),

  approveMember: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        memberIds: [...g.memberIds, userId],
        pendingMemberIds: g.pendingMemberIds.filter((id) => id !== userId),
      };
    }),
  })),

  rejectMember: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        pendingMemberIds: g.pendingMemberIds.filter((id) => id !== userId),
      };
    }),
  })),

  addAdmin: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      if (!g.memberIds.includes(userId)) return g; // メンバーでないと管理者になれない
      return { ...g, adminIds: [...g.adminIds, userId] };
    }),
  })),

  removeAdmin: (groupId, userId) => set((state) => ({
    groups: state.groups.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, adminIds: g.adminIds.filter((id) => id !== userId) };
    }),
  })),

  checkAutoDeletion: () => set((state) => {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    return {
      groups: state.groups.map(g => {
        const lastActivity = new Date(g.lastActivityAt);
        if (lastActivity < sixtyDaysAgo) {
          return { ...g, isDeleted: true };
        }
        return g;
      })
    };
  }),
}));
