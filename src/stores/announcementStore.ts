import { create } from 'zustand';
import { DUMMY_ANNOUNCEMENTS, Announcement } from '../data/dummyAnnouncements';

interface AnnouncementState {
  announcements: Announcement[];
  
  // Actions
  addAnnouncement: (announcement: Announcement) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  getRecentAnnouncements: (limit?: number) => Announcement[];
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: DUMMY_ANNOUNCEMENTS,

  addAnnouncement: (announcement) => set((state) => ({
    announcements: [announcement, ...state.announcements]
  })),

  updateAnnouncement: (id, updates) => set((state) => ({
    announcements: state.announcements.map((a) => 
      a.id === id ? { ...a, ...updates } : a
    )
  })),

  deleteAnnouncement: (id) => set((state) => ({
    announcements: state.announcements.filter((a) => a.id !== id)
  })),

  getRecentAnnouncements: (limit = 5) => {
    return get().announcements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));
