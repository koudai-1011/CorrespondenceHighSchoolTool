import { create } from 'zustand';
import type { AdDisplayTrigger } from './adStore';

export interface FooterItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
}

export const AVAILABLE_FOOTER_ITEMS: Record<string, FooterItem> = {
  UserExplore: { id: 'user_explore', label: 'ユーザー探索', icon: 'account-search', screen: 'UserExplore' },
  Home: { id: 'home', label: 'ホーム', icon: 'home', screen: 'Home' },
  Timeline: { id: 'timeline', label: 'タイムライン', icon: 'timeline', screen: 'Timeline' },
  Notification: { id: 'notification', label: '通知', icon: 'bell', screen: 'Notification' },
  Community: { id: 'community', label: 'コミュニティ', icon: 'forum', screen: 'Community' },
  Board: { id: 'board', label: '募集', icon: 'bullhorn', screen: 'Board' },
  Ranking: { id: 'ranking', label: '受験', icon: 'school', screen: 'GradeRanking' },
  Settings: { id: 'settings', label: '設定', icon: 'cog', screen: 'Settings' },
  Talk: { id: 'talk', label: 'トーク', icon: 'chat', screen: 'Talk' },
};

import { StudyProfile } from './registrationStore';

export interface SettingsState {
  // フッターカスタマイズ
  footerItems: FooterItem[];
  
  // 受験機能（旧ランキング参加）
  examParticipation: boolean;
  
  // 学習プロフィール（設定画面で編集可能にするため）
  studyProfile: StudyProfile | null;

  // 現在のルート名
  currentRouteName: string;
  
  // 広告表示制御
  lastAdDisplayTime: number | null;
  adDisplayInterval: number;
  pendingAdTrigger: AdDisplayTrigger | null;
  
  // アクション
  setFooterItems: (items: FooterItem[]) => void;
  setExamParticipation: (value: boolean) => void;
  setStudyProfile: (profile: StudyProfile | null) => void;
  setCurrentRouteName: (name: string) => void;
  setLastAdDisplayTime: (time: number) => void;
  setPendingAdTrigger: (trigger: AdDisplayTrigger) => void;
  clearPendingAdTrigger: () => void;
  setAdDisplayInterval: (interval: number) => void;
  resetToDefault: () => void;
}

export const DEFAULT_FOOTER_ITEMS: FooterItem[] = [
  AVAILABLE_FOOTER_ITEMS.Home,
  AVAILABLE_FOOTER_ITEMS.Timeline,
  AVAILABLE_FOOTER_ITEMS.Community,
  AVAILABLE_FOOTER_ITEMS.Board,
  AVAILABLE_FOOTER_ITEMS.Talk,
];

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000; // 2時間

export const useSettingsStore = create<SettingsState>((set) => ({
  footerItems: DEFAULT_FOOTER_ITEMS,
  examParticipation: false, // デフォルトはOFF（プロフィール作成時に判定）
  studyProfile: null,
  currentRouteName: 'Home',
  lastAdDisplayTime: null,
  adDisplayInterval: TWO_HOURS_IN_MS,
  pendingAdTrigger: null,
  
  setFooterItems: (items) => set({ footerItems: items }),
  setExamParticipation: (value) => set({ examParticipation: value }),
  setStudyProfile: (profile) => set({ studyProfile: profile }),
  setCurrentRouteName: (name) => set({ currentRouteName: name }),
  setLastAdDisplayTime: (time) => set({ lastAdDisplayTime: time }),
  setPendingAdTrigger: (trigger) => set({ pendingAdTrigger: trigger }),
  clearPendingAdTrigger: () => set({ pendingAdTrigger: null }),
  setAdDisplayInterval: (interval) => set({ adDisplayInterval: interval }),
  resetToDefault: () => set({ 
    footerItems: DEFAULT_FOOTER_ITEMS,
    examParticipation: false,
    studyProfile: null,
    currentRouteName: 'Home',
    lastAdDisplayTime: null,
    adDisplayInterval: TWO_HOURS_IN_MS,
    pendingAdTrigger: null,
  }),
}));
