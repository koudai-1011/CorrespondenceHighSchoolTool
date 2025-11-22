import { create } from 'zustand';
import type { AdDisplayTrigger } from './adStore';

export interface FooterItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
}

export const AVAILABLE_FOOTER_ITEMS: FooterItem[] = [
  { id: 'user_explore', label: 'ユーザー探索', icon: 'account-search', screen: 'UserExplore' },
  { id: 'home', label: 'ホーム', icon: 'home', screen: 'Home' },
  { id: 'timeline', label: 'タイムライン', icon: 'timeline', screen: 'Timeline' },
  { id: 'notification', label: '通知', icon: 'bell', screen: 'Notification' },
  { id: 'chat', label: 'チャット', icon: 'message', screen: 'ChatList' },
  { id: 'community', label: 'コミュニティ', icon: 'forum', screen: 'Community' },
  { id: 'board', label: '募集', icon: 'bullhorn', screen: 'Board' },
  { id: 'ranking', label: 'ランキング', icon: 'trophy', screen: 'GradeRanking' },
  { id: 'settings', label: '設定', icon: 'cog', screen: 'Settings' },
];

interface SettingsState {
  // フッターカスタマイズ
  footerItems: FooterItem[];
  
  // ランキング参加
  rankingParticipation: boolean;
  
  // 現在のルート名
  currentRouteName: string;
  
  // 広告表示制御
  lastAdDisplayTime: number | null;  // 最後に広告を表示した時刻（Unix timestamp）
  adDisplayInterval: number;          // 広告表示間隔（ミリ秒、デフォルト2時間）
  pendingAdTrigger: AdDisplayTrigger | null; // 次に表示する広告のトリガー（設定後にクリア）
  
  // アクション
  setFooterItems: (items: FooterItem[]) => void;
 setRankingParticipation: (value: boolean) => void;
  setCurrentRouteName: (name: string) => void;
  setLastAdDisplayTime: (time: number) => void;
  setPendingAdTrigger: (trigger: AdDisplayTrigger) => void;
  clearPendingAdTrigger: () => void;
  setAdDisplayInterval: (interval: number) => void;
  resetToDefault: () => void;
}

const DEFAULT_FOOTER_ITEMS: FooterItem[] = [
  AVAILABLE_FOOTER_ITEMS[1], // ホーム
  AVAILABLE_FOOTER_ITEMS[5], // コミュニティ
  AVAILABLE_FOOTER_ITEMS[6], // 募集（中央）
  AVAILABLE_FOOTER_ITEMS[4], // チャット
  AVAILABLE_FOOTER_ITEMS[8], // 設定
];

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000; // 2時間

export const useSettingsStore = create<SettingsState>((set) => ({
  footerItems: DEFAULT_FOOTER_ITEMS,
  rankingParticipation: true,
  currentRouteName: 'Home',
  lastAdDisplayTime: null,
  adDisplayInterval: TWO_HOURS_IN_MS,
  pendingAdTrigger: null,
  
  setFooterItems: (items) => set({ footerItems: items }),
  setRankingParticipation: (value) => set({ rankingParticipation: value }),
  setCurrentRouteName: (name) => set({ currentRouteName: name }),
  setLastAdDisplayTime: (time) => set({ lastAdDisplayTime: time }),
  setPendingAdTrigger: (trigger) => set({ pendingAdTrigger: trigger }),
  clearPendingAdTrigger: () => set({ pendingAdTrigger: null }),
  setAdDisplayInterval: (interval) => set({ adDisplayInterval: interval }),
  resetToDefault: () => set({ 
    footerItems: DEFAULT_FOOTER_ITEMS,
    rankingParticipation: true,
    currentRouteName: 'Home',
    lastAdDisplayTime: null,
    adDisplayInterval: TWO_HOURS_IN_MS,
    pendingAdTrigger: null,
  }),
}));
