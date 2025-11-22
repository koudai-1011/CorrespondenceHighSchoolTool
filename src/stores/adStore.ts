import { create } from 'zustand';

export interface TargetCondition {
  prefectures: string[]; // 空配列なら全国
  tags: string[];        // 空配列なら全タグ
  grades: string[];      // 空配列なら全学年（例: ['1年生', '2年生']）
  ageMin: number | null; // 最小年齢（nullなら制限なし）
  ageMax: number | null; // 最大年齢（nullなら制限なし）
}

export type AdDisplayTrigger = 
  | 'APP_OPEN'           // アプリを開いた時
  | 'PROFILE_UPDATE'     // プロフィール更新時
  | 'SCREEN_TRANSITION'  // 特定画面への遷移時
  | 'TIME_BASED';        // 時間経過（定期的）

export interface PopupAd {
  id: string;
  title: string; // 管理用タイトル
  imageUrl: string;
  linkUrl: string;
  target: TargetCondition;
  isActive: boolean;
  createdAt: Date;
  displayCount: number;          // 表示回数
  maxDisplayCount: number | null; // 上限数（nullなら無制限）
  displayTriggers: AdDisplayTrigger[]; // 表示トリガー条件
}

interface AdState {
  ads: PopupAd[];
  addAd: (ad: Omit<PopupAd, 'id' | 'createdAt' | 'displayCount'>) => void;
  updateAd: (id: string, ad: Partial<PopupAd>) => void;
  deleteAd: (id: string) => void;
  toggleAdStatus: (id: string) => void;
  incrementDisplayCount: (id: string) => void; // NEW: 表示回数をインクリメント
}

export const useAdStore = create<AdState>((set) => ({
  ads: [
    // ダミーデータ
    {
      id: 'ad1',
      title: '福岡限定イベント',
      imageUrl: 'https://placehold.co/600x800/orange/white?text=Fukuoka+Event',
      linkUrl: 'https://example.com/fukuoka',
      target: {
        prefectures: ['福岡県'],
        tags: [],
        grades: [],
        ageMin: null,
        ageMax: null,
      },
      isActive: true,
      createdAt: new Date(),
      displayCount: 0,
      maxDisplayCount: 100,
      displayTriggers: ['APP_OPEN'],
    },
    {
      id: 'ad2',
      title: 'ゲーム好き集まれ',
      imageUrl: 'https://placehold.co/600x800/blue/white?text=Game+Tournament',
      linkUrl: 'https://example.com/game',
      target: {
        prefectures: [],
        tags: ['ゲーム', 'FPS'],
        grades: [],
        ageMin: null,
        ageMax: null,
      },
      isActive: true,
      createdAt: new Date(),
      displayCount: 0,
      maxDisplayCount: null,
      displayTriggers: ['APP_OPEN', 'PROFILE_UPDATE'],
    },
    {
      id: 'ad3',
      title: '全国キャンペーン',
      imageUrl: 'https://placehold.co/600x800/green/white?text=Campaign',
      linkUrl: 'https://example.com/campaign',
      target: {
        prefectures: [],
        tags: [],
        grades: [],
        ageMin: null,
        ageMax: null,
      },
      isActive: true,
      createdAt: new Date(),
      displayCount: 0,
      maxDisplayCount: null,
      displayTriggers: ['APP_OPEN'],
    },
  ],
  addAd: (ad) => set((state) => ({
    ads: [{ ...ad, id: `ad${Date.now()}`, createdAt: new Date(), displayCount: 0 }, ...state.ads]
  })),
  updateAd: (id, updatedAd) => set((state) => ({
    ads: state.ads.map((ad) => (ad.id === id ? { ...ad, ...updatedAd } : ad))
  })),
  deleteAd: (id) => set((state) => ({
    ads: state.ads.filter((ad) => ad.id !== id)
  })),
  toggleAdStatus: (id) => set((state) => ({
    ads: state.ads.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad))
  })),
  incrementDisplayCount: (id) => set((state) => ({
    ads: state.ads.map((ad) => (ad.id === id ? { ...ad, displayCount: ad.displayCount + 1 } : ad))
  })),
}));
