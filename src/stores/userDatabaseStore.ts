import { create } from 'zustand';
import { User } from '../types/user';
import { DUMMY_USERS } from '../data/dummyUsers';

interface UserDatabaseState {
  users: User[];
  searchQuery: string;
  filterGrade: string | null;
  filterPrefecture: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilterGrade: (grade: string | null) => void;
  setFilterPrefecture: (prefecture: string | null) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void; // Soft delete or actual delete? For now actual.
  
  // Selectors (computed values are usually done in components or hooks, but we can have helper methods)
  getFilteredUsers: () => User[];
}

export const useUserDatabaseStore = create<UserDatabaseState>((set, get) => ({
  users: [...DUMMY_USERS],
  searchQuery: '',
  filterGrade: null,
  filterPrefecture: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterGrade: (grade) => set({ filterGrade: grade }),
  setFilterPrefecture: (prefecture) => set({ filterPrefecture: prefecture }),

  updateUser: (userId, updates) => set((state) => ({
    users: state.users.map((user) => 
      user.id === userId ? { ...user, ...updates } : user
    ),
  })),

  deleteUser: (userId) => set((state) => ({
    users: state.users.filter((user) => user.id !== userId),
  })),

  getFilteredUsers: () => {
    const { users, searchQuery, filterGrade, filterPrefecture } = get();
    return users.filter((user) => {
      const matchesSearch = 
        user.nickname.includes(searchQuery) || 
        user.id.includes(searchQuery) ||
        (user.bio && user.bio.includes(searchQuery));
      
      const matchesGrade = filterGrade ? user.grade === filterGrade : true;
      const matchesPrefecture = filterPrefecture ? user.prefecture === filterPrefecture : true;

      return matchesSearch && matchesGrade && matchesPrefecture;
    });
  },
}));
