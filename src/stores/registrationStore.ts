import { create } from 'zustand';

interface SocialLink {
  platform: string;
  url: string;
  username?: string;
}

interface RegistrationState {
  // 基本プロフィール
  userId: string;  // @username形式のID
  nickname: string;
  profileImageUrl?: string; // プロフィール画像URL（新規追加）
  schoolName: string;
  prefecture: string;
  grade: string;
  age: string;
  careerPath: string;
  themeColor: string;

  // SNSリンク
  socialLinks: SocialLink[];

  // ソーシャル機能
  followerCount: number;
  followingCount: number;
  
  // コミュニケーションスタイル（7項目に拡張）
  communicationType: {
    approachability: number;      // 1-5: 話しかけやすさ
    initiative: number;            // 1-5: 自分から話しかける頻度
    responseSpeed: number;         // 1-5: 返信の速さ
    groupPreference: 'one-on-one' | 'small' | 'large'; // グループサイズの好み
    textVsVoice: 'text' | 'voice' | 'both'; // テキスト vs 音声
    deepVsCasual: number;          // 1-5: 深い話 vs 軽い話
    onlineActivity: number;        // 1-5: オンライン頻度
  };

  // 詳細タグ
  detailedTags: Array<{
    category: string;
    name: string;
  }>;

  // 学習プロフィール
  studyProfile: StudyProfile;

  // 季節の質問
  seasonalQuestion: {
    question: string;
    answer: string;
  };

  // Actions
  setUserId: (userId: string) => void;
  setNickname: (nickname: string) => void;
  setProfileImageUrl: (url: string | undefined) => void; // 新規追加
  setSchool: (schoolName: string) => void;
  setPrefecture: (prefecture: string) => void;
  setGrade: (grade: string) => void;
  setAge: (age: string) => void;
  setCareerPath: (careerPath: string) => void;
  setThemeColor: (themeColor: string) => void;
  setSocialLinks: (socialLinks: SocialLink[]) => void;
  setCommunicationType: (communicationType: RegistrationState['communicationType']) => void;
  setDetailedTags: (detailedTags: Array<{ category: string; name: string }>) => void;
  addTag: (category: string, name: string) => void;
  removeTag: (name: string) => void;
  setStudyProfile: (profile: StudyProfile) => void;
  updateStudyProfile: <K extends keyof StudyProfile>(field: K, value: StudyProfile[K]) => void;
  setSeasonalQuestion: (question: string, answer: string) => void;
  reset: () => void;
}

export interface StudyProfile {
  mockExamName: string;
  mockExamOther?: string; // その他選択時の自由記述
  deviationScores: Record<string, string>; // 科目ごとの偏差値 (科目名: 偏差値)
  rank: 'I' | 'II' | 'III' | 'IV' | 'V' | ''; // 判定ランク (I~V)
  subjects: {
    strong: string[];
    weak: string[];
  };
  targetUniversity: string;
  targetFaculty: string;
  isTargetUndecided: boolean; // 志望校未定フラグ
  examType: 'general' | 'comprehensive' | 'recommendation';
  studyTime: 'morning' | 'night' | 'irregular';
  studyPlace: string[]; // 複数選択に変更
  averageStudyTime: string; // 数値入力 (分単位または時間単位の文字列)
  cramSchool: string;
  cramSchoolOther?: string; // その他選択時の自由記述
  isCramSchoolNotAttending: boolean; // 塾に通っていないフラグ
}

const initialStudyProfile: StudyProfile = {
  mockExamName: '',
  deviationScores: {},
  rank: '',
  subjects: { strong: [], weak: [] },
  targetUniversity: '',
  targetFaculty: '',
  isTargetUndecided: false,
  examType: 'general',
  studyTime: 'irregular',
  studyPlace: [],
  averageStudyTime: '',
  cramSchool: '',
  isCramSchoolNotAttending: false,
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  // 初期値
  userId: '',
  nickname: '',
  profileImageUrl: undefined,
  schoolName: '',
  prefecture: '',
  grade: '',
  age: '',
  careerPath: '',
  themeColor: '#00BCD4',
  socialLinks: [],
  followerCount: 0,
  followingCount: 0,
  
  communicationType: {
    approachability: 3,
    initiative: 3,
    responseSpeed: 3,
    groupPreference: 'small',
    textVsVoice: 'both',
    deepVsCasual: 3,
    onlineActivity: 3,
  },
  
  detailedTags: [],
  tags: [],
  studyProfile: initialStudyProfile,
  seasonalQuestion: {
    question: '',
    answer: '',
  },

  // アクション
  setUserId: (id) => set({ userId: id }),
  setNickname: (nickname) => set({ nickname }),
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
  setSchool: (schoolName) => set({ schoolName }),
  setPrefecture: (prefecture) => set({ prefecture }),
  setGrade: (grade) => set({ grade }),
  setAge: (age) => set({ age }),
  setCareerPath: (careerPath) => set({ careerPath }),
  setThemeColor: (themeColor) => set({ themeColor }),
  setSocialLinks: (socialLinks) => set({ socialLinks }),
  setCommunicationType: (communicationType) => set({ communicationType }),
  setDetailedTags: (detailedTags) => set({ detailedTags }),
  addTag: (category, name) => set((state) => ({
    detailedTags: [...state.detailedTags, { category, name }],
  })),
  removeTag: (name) => set((state) => ({
    detailedTags: state.detailedTags.filter((tag) => tag.name !== name),
  })),
  setStudyProfile: (profile) => set({ studyProfile: profile }),
  updateStudyProfile: (field, value) => set((state) => ({
    studyProfile: { ...state.studyProfile, [field]: value }
  })),
  setSeasonalQuestion: (question, answer) => set({
    seasonalQuestion: { question, answer }
  }),
  reset: () => set({
    userId: '',
    nickname: '',
    profileImageUrl: undefined,
    schoolName: '',
    prefecture: '',
    grade: '',
    age: '',
    careerPath: '',
    themeColor: '#00BCD4',
    socialLinks: [],
    followerCount: 0,
    followingCount: 0,
    communicationType: {
      approachability: 3,
      initiative: 3,
      responseSpeed: 3,
      groupPreference: 'small',
      textVsVoice: 'both',
      deepVsCasual: 3,
      onlineActivity: 3,
    },
    detailedTags: [],
    studyProfile: initialStudyProfile,
  }),
}));

