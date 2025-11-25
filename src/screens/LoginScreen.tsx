import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { loginWithGoogle, getCurrentUser, subscribeToAuthState } from '../services/authService';
import { getUserProfile } from '../services/authService';
import { COLORS } from '../constants/AppConfig';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 既に認証済みのユーザーをチェック
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        // ユーザーが認証済みの場合、プロフィール確認後に画面遷移
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          // プロフィールがない場合はプロフィール作成画面へ
          navigation.reset({
            index: 0,
            routes: [{ name: 'ProfileCreation' }],
          });
        }
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();

      if (result.success) {
        // ログイン成功 - プロフィール作成画面へ
        const user = getCurrentUser();
        if (user) {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'ProfileCreation' }],
            });
          }
        }
      } else {
        Alert.alert('ログイン失敗', result.error || 'Google ログインに失敗しました');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert('エラー', 'ログイン処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text variant="displaySmall" style={styles.appName}>
          通信制高校ツール
        </Text>
        <Text variant="bodyLarge" style={styles.tagline}>
          つながりを、自分のペースで
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text variant="bodyMedium" style={styles.description}>
          Google アカウントでログインします
        </Text>

        <Button
          mode="contained"
          onPress={handleGoogleLogin}
          style={styles.googleButton}
          loading={loading}
          disabled={loading}
          icon="google"
        >
          Google でログイン
        </Button>

        <Text variant="bodySmall" style={styles.note}>
          ※ 初回ログイン時は自動でアカウントが作成されます
        </Text>
      </View>

      <Text variant="bodySmall" style={styles.footer}>
        Firebase × Google Sign-In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
  },
  centerContainer: {
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333',
  },
  googleButton: {
    marginVertical: 12,
    paddingVertical: 8,
    backgroundColor: '#4285F4',
  },
  note: {
    marginTop: 16,
    textAlign: 'center',
    color: '#999999',
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
