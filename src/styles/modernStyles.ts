// モダンなデザインシステム用のスタイル定義

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/AppConfig';

export const modernStyles = StyleSheet.create({
  // カード
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  cardElevated: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  // テキスト
  headingPrimary: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },

  headingSecondary: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },

  bodyPrimary: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },

  bodySecondary: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  // ボタン
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonOutline: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },

  // チップ
  chip: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  chipText: {
    color: COLORS.PRIMARY_DARK,
    fontSize: 12,
    fontWeight: '600',
  },

  // その他
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },

  badge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

// グラデーション色の定義
export const gradients = {
  primary: ['#00BCD4', '#0097A7'],
  secondary: ['#5C6BC0', '#3949AB'],
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  accent: ['#FF6B9D', '#EC407A'],
};
