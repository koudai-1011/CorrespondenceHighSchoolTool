export interface User {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  schoolName: string;
  prefecture: string;
  grade: string;
  age: string;
  gender: string;
  bio?: string;
  careerPath: string;
  themeColor: string;
  detailedTags: { category: string; name: string }[];
  socialLinks?: Array<{ platform: string; url: string; username?: string }>;
  communicationType: {
    approachability: number;      // 1-5: 話しかけやすさ
    initiative: number;            // 1-5: 自分から話しかける頻度
    responseSpeed: number;         // 1-5: 返信の速さ
    groupPreference: 'one-on-one' | 'small' | 'large';
    textVsVoice: 'text' | 'voice' | 'both';
    deepVsCasual: number;          // 1-5: 深い話 vs 軽い話
    onlineActivity: number;        // 1-5: オンライン頻度
  };
  followerCount: number;
  lastActive: string; // ISO string for serialization
  createdAt: string;  // ISO string for serialization
  studyProfile?: {
    mockExamName: string;
    targetUniversity: string;
    subjects: string[];
  };
  seasonalQuestion?: {
    question: string;
    answer: string;
  };
  titles?: Array<{
    id: string;
    name: string;
    description: string;
    iconColor?: string;
    obtainedAt: string;
  }>;
  currentTitleId?: string;
}
