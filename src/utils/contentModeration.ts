import { useModerationStore } from '../stores/moderationStore';

/**
 * コンテンツモデレーションユーティリティ
 * ユーザーの投稿内容をチェックし、不適切な表現が含まれていないか確認します。
 */

export interface ModerationResult {
  isValid: boolean;
  hasNgWord: boolean;
  ngWords: string[];
  requiresReview: boolean;
  message?: string;
}

/**
 * テキストコンテンツをチェックします
 * @param text チェック対象のテキスト
 * @returns モデレーション結果
 */
export const checkContent = (text: string): ModerationResult => {
  if (!text) {
    return { isValid: true, hasNgWord: false, ngWords: [], requiresReview: false };
  }

  const detectedNgWords: string[] = [];
  const { ngWords } = useModerationStore.getState();

  // NGワードチェック
  ngWords.forEach(word => {
    // 単純な文字列一致チェック（正規表現ではなく部分一致）
    if (text.includes(word)) {
      if (!detectedNgWords.includes(word)) {
        detectedNgWords.push(word);
      }
    }
  });

  if (detectedNgWords.length > 0) {
    return {
      isValid: false,
      hasNgWord: true,
      ngWords: detectedNgWords,
      requiresReview: true,
      message: `不適切な表現が含まれています: ${detectedNgWords.join(', ')}`
    };
  }

  return {
    isValid: true,
    hasNgWord: false,
    ngWords: [],
    requiresReview: false
  };
};

/**
 * ユーザー名などの短いテキストのチェック
 */
export const checkUsername = (username: string): ModerationResult => {
  return checkContent(username);
};
