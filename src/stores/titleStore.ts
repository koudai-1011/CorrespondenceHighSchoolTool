import { create } from 'zustand';

export interface Title {
  id: string;
  name: string;
  description: string;
  iconColor: string;
  obtainedAt: string;
}

interface TitleState {
  // All available titles in the system
  availableTitles: Title[];
  
  // Mapping of userId to their title IDs
  userTitles: Record<string, string[]>;
  
  // Actions
  createTitle: (title: Omit<Title, 'id' | 'obtainedAt'>) => void;
  deleteTitle: (titleId: string) => void;
  updateTitle: (titleId: string, updates: Partial<Title>) => void;
  
  // User title management
  grantTitleToUser: (userId: string, titleId: string) => void;
  revokeTitleFromUser: (userId: string, titleId: string) => void;
  getUserTitles: (userId: string) => Title[];
  getTitleHolders: (titleId: string) => string[]; // Returns user IDs
}

export const useTitleStore = create<TitleState>((set, get) => ({
  availableTitles: [
    { id: 't1', name: '新人', description: 'アプリに初登録', iconColor: '#4CAF50', obtainedAt: '' },
    { id: 't2', name: 'アクティブ', description: '7日間連続ログイン', iconColor: '#2196F3', obtainedAt: '' },
    { id: 't3', name: 'コミュニケーター', description: '100回のメッセージ送信', iconColor: '#FF9800', obtainedAt: '' },
  ],
  
  userTitles: {},
  
  createTitle: (titleData) => set((state) => ({
    availableTitles: [
      ...state.availableTitles,
      {
        ...titleData,
        id: `t${Date.now()}`,
        obtainedAt: '',
      },
    ],
  })),
  
  deleteTitle: (titleId) => set((state) => {
    // Also remove from all users
    const updatedUserTitles = { ...state.userTitles };
    Object.keys(updatedUserTitles).forEach((userId) => {
      updatedUserTitles[userId] = updatedUserTitles[userId].filter((tId) => tId !== titleId);
    });
    
    return {
      availableTitles: state.availableTitles.filter((t) => t.id !== titleId),
      userTitles: updatedUserTitles,
    };
  }),
  
  updateTitle: (titleId, updates) => set((state) => ({
    availableTitles: state.availableTitles.map((t) =>
      t.id === titleId ? { ...t, ...updates } : t
    ),
  })),
  
  grantTitleToUser: (userId, titleId) => set((state) => {
    const currentTitles = state.userTitles[userId] || [];
    if (currentTitles.includes(titleId)) {
      return state; // Already has the title
    }
    
    return {
      userTitles: {
        ...state.userTitles,
        [userId]: [...currentTitles, titleId],
      },
    };
  }),
  
  revokeTitleFromUser: (userId, titleId) => set((state) => ({
    userTitles: {
      ...state.userTitles,
      [userId]: (state.userTitles[userId] || []).filter((tId) => tId !== titleId),
    },
  })),
  
  getUserTitles: (userId) => {
    const state = get();
    const titleIds = state.userTitles[userId] || [];
    return state.availableTitles.filter((t) => titleIds.includes(t.id));
  },
  
  getTitleHolders: (titleId) => {
    const state = get();
    return Object.entries(state.userTitles)
      .filter(([_, titles]) => titles.includes(titleId))
      .map(([userId]) => userId);
  },
}));
