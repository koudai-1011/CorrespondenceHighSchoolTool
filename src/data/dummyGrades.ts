import { DUMMY_USERS } from './dummyUsers';

// 成績エントリーの型定義
export interface GradeEntry {
  id: string;
  userId: string;
  subject: string;      // 科目名
  score: number;        // 点数
  maxScore: number;     // 満点
  testDate: Date;       // テスト日
  testName: string;     // テスト名
}

// ユーザーの成績統計
export interface UserGradeStats {
  userId: string;
  totalScore: number;         // 合計点
  averageScore: number;       // 平均点
  rank: number;               // ランク
  gradeClass: 'S' | 'A' | 'B' | 'C' | 'D';  // クラス
  targetUniversityLevel: string;  // 志望校レベル
  monthlyImprovement: number;     // 月間成長率
}

// 科目リスト
export const SUBJECTS = [
  '国語',
  '数学',
  '英語',
  '理科',
  '社会',
];

// ダミー成績データ
export const DUMMY_GRADES: GradeEntry[] = [
  // user1の成績
  { id: 'g1', userId: 'user1', subject: '国語', score: 75, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g2', userId: 'user1', subject: '数学', score: 82, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g3', userId: 'user1', subject: '英語', score: 88, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g4', userId: 'user1', subject: '理科', score: 79, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g5', userId: 'user1', subject: '社会', score: 71, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  
  // user2の成績
  { id: 'g6', userId: 'user2', subject: '国語', score: 92, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g7', userId: 'user2', subject: '数学', score: 87, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g8', userId: 'user2', subject: '英語', score: 94, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g9', userId: 'user2', subject: '理科', score: 89, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g10', userId: 'user2', subject: '社会', score: 91, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  
  // user3の成績
  { id: 'g11', userId: 'user3', subject: '国語', score: 68, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g12', userId: 'user3', subject: '数学', score: 72, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g13', userId: 'user3', subject: '英語', score: 65, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g14', userId: 'user3', subject: '理科', score: 70, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
  { id: 'g15', userId: 'user3', subject: '社会', score: 69, maxScore: 100, testDate: new Date('2024-01-10'), testName: '第1回模試' },
];

// ユーザーの成績を取得
export const getUserGrades = (userId: string): GradeEntry[] => {
  return DUMMY_GRADES.filter(g => g.userId === userId);
};

// 平均点を計算
const calculateAverage = (grades: GradeEntry[]): number => {
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0);
  return total / grades.length;
};

// クラス判定（偏差値ベース）
const determineClass = (average: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
  if (average >= 85) return 'S';
  if (average >= 75) return 'A';
  if (average >= 65) return 'B';
  if (average >= 55) return 'C';
  return 'D';
};

// ユーザーの成績統計を計算
export const calculateUserStats = (userId: string): UserGradeStats => {
  const grades = getUserGrades(userId);
  const average = calculateAverage(grades);
  const user = DUMMY_USERS.find(u => u.id === userId);
  
  return {
    userId,
    totalScore: grades.reduce((sum, g) => sum + g.score, 0),
    averageScore: average,
    rank: 0, // ランキング計算後に設定
    gradeClass: determineClass(average),
    targetUniversityLevel: user?.careerPath || '未定',
    monthlyImprovement: Math.random() * 10 - 2, // ダミー: -2% ~ +8%
  };
};

// 全ユーザーの成績ランキングを取得
export const getGradeRanking = (): UserGradeStats[] => {
  const userIds = [...new Set(DUMMY_GRADES.map(g => g.userId))];
  const stats = userIds.map(id => calculateUserStats(id));
  
  // 平均点でソート
  stats.sort((a, b) => b.averageScore - a.averageScore);
  
  // ランクを設定
  stats.forEach((stat, index) => {
    stat.rank = index + 1;
  });
  
  return stats;
};

// クラス別ランキングを取得
export const getClassRanking = (gradeClass: 'S' | 'A' | 'B' | 'C' | 'D'): UserGradeStats[] => {
  const allRanking = getGradeRanking();
  const classRanking = allRanking.filter(stat => stat.gradeClass === gradeClass);
  
  // クラス内でランクを再設定
  classRanking.forEach((stat, index) => {
    stat.rank = index + 1;
  });
  
  return classRanking;
};

// 月間MVP（最も成長した人）を取得
export const getMonthlyMVP = (): UserGradeStats | null => {
  const ranking = getGradeRanking();
  if (ranking.length === 0) return null;
  
  return ranking.reduce((mvp, current) => 
    current.monthlyImprovement > mvp.monthlyImprovement ? current : mvp
  );
};

// クラス説明
export const CLASS_DESCRIPTIONS: Record<string, string> = {
  'S': '偏差値70以上 - 旧帝大・早慶レベル',
  'A': '偏差値60-69 - MARCH・関関同立レベル',
  'B': '偏差値50-59 - 中堅私立レベル',
  'C': '偏差値40-49 - 基礎固め中',
  'D': '偏差値39以下 - これから頑張ろう',
};
