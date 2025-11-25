export const APP_CONFIG = {
  NAME: '通信制高校ツール', // 仮アプリ名
};

export const COLORS = {
  // Main Brand Colors
  PRIMARY: '#00BCD4',       // Turquoise
  PRIMARY_LIGHT: '#B2EBF2', // Light Turquoise
  PRIMARY_DARK: '#0097A7',  // Dark Turquoise
  ACCENT: '#FF4081',        // Pop Pink
  ACCENT_YELLOW: '#FFEB3B', // Pop Yellow for highlights
  
  // Functional Colors
  BACKGROUND: '#F0F4F8',    // Slightly cool gray/blue background
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#263238',  // Dark Blue Grey
  TEXT_SECONDARY: '#546E7A',
  TEXT_TERTIARY: '#90A4AE',
  BORDER: '#CFD8DC',
  
  // Status Colors
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  
  // Theme Colors (kept for reference if needed, but PRIMARY is now fixed to Turquoise)
  THEME_COLORS: [
    { label: 'ターコイズ', value: '#00BCD4' },
    { label: 'スカイ', value: '#1D9BF0' },
    { label: 'ローズ', value: '#F91880' },
    { label: 'パープル', value: '#7856FF' },
    { label: 'オレンジ', value: '#FF7A00' },
    { label: 'グリーン', value: '#00BA7C' },
  ],
};

export const RADIUS = {
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  ROUND: 999,
};

export const SPACING = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export const AGES = Array.from({ length: 8 }, (_, i) => (15 + i).toString()); // 15-22歳

export const GRADES = [
  { label: '高校1年生', value: '1' },
  { label: '高校2年生', value: '2' },
  { label: '高校3年生', value: '3' },
  { label: '4年生以上', value: '4' },
  { label: '卒業生', value: 'grad' },
];

export const CAREER_PATHS = [
  '大学進学', '短期大学', '専門学校', '就職', '留学', '起業', '未定', 'その他'
];

// 通信制高校のリスト（主要なもの）
export const CORRESPONDENCE_SCHOOLS = [
  'N高等学校',
  'S高等学校',
  'クラーク記念国際高等学校',
  '第一学院高等学校',
  'NHK学園高等学校',
  '飛鳥未来高等学校',
  'ルネサンス高等学校',
  'ルネサンス豊田高等学校',
  'ルネサンス大阪高等学校',
  'トライ式高等学院',
  '鹿島学園高等学校',
  '鹿島朝日高等学校',
  'ヒューマンキャンパス高等学校',
  'わせがく高等学校',
  '代々木高等学校',
  '星槎国際高等学校',
  '屋久島おおぞら高等学校',
  'あずさ第一高等学校',
  '中央高等学院',
  'KTC中央高等学院',
  '東京共育学園高等部',
  'サポート校（その他）',
  '公立通信制高校',
  'その他',
];
