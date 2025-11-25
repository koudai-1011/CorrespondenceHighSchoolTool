// モダンなデザインシステム用のスタイル定義

import { StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/AppConfig';

export const modernStyles = StyleSheet.create({
  // コンテナ
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // Typography
  headingLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.M,
    letterSpacing: 0.5,
  },
  headingPrimary: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.S,
  },
  headingSecondary: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.S,
  },
  textBody: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  
  // Cards & Surfaces
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.LARGE, // Pop style: larger radius
    padding: SPACING.M,
    marginBottom: SPACING.M,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 188, 212, 0.15)', // Turquoise shadow
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardFlat: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.MEDIUM,
    padding: SPACING.M,
    marginBottom: SPACING.S,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: RADIUS.ROUND,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.ROUND,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Inputs
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: RADIUS.MEDIUM,
    padding: SPACING.M,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: SPACING.M,
  },
  
  // Layout Helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Lists
  listContainer: {
    padding: SPACING.M,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  
  // Badges & Tags
  badge: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  
  // アバター
  avatar: {
    borderRadius: 9999,
    backgroundColor: COLORS.BORDER,
  },
});

// グラデーションは廃止し、ソリッドカラーを使用
export const gradients = {
  primary: [COLORS.PRIMARY, COLORS.PRIMARY],
  secondary: [COLORS.TEXT_SECONDARY, COLORS.TEXT_SECONDARY],
  success: [COLORS.SUCCESS, COLORS.SUCCESS],
  warning: [COLORS.WARNING, COLORS.WARNING],
  error: [COLORS.ERROR, COLORS.ERROR],
  accent: [COLORS.ACCENT, COLORS.ACCENT],
};
