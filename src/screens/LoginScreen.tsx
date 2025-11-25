import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/AppConfig';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestoreからユーザー情報を取得
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        // ユーザー情報が存在する場合はホーム画面へ
        navigation.navigate('Home');
      } else {
        // プロフィールが未作成の場合はプロフィール作成画面へ
        navigation.navigate('ProfileCreation');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'ログインに失敗しました';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'ユーザーが見つかりません';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが正しくありません';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません';
      }
      
      Alert.alert('ログインエラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上で設定してください');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestoreにユーザードキュメントを作成
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // プロフィール作成画面へ
      navigation.navigate('ProfileCreation');
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = '新規登録に失敗しました';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードが弱すぎます';
      }
      
      Alert.alert('登録エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)'
    }}>
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
          <TextInput
            label="メールアドレス"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
          />
          
          <TextInput
            label="パスワード"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            disabled={loading}
          />

          <Button 
            mode="contained" 
            onPress={isSignUp ? handleSignUp : handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {isSignUp ? '新規登録' : 'ログイン'}
          </Button>

          <Button 
            mode="text" 
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.switchButton}
            disabled={loading}
            textColor="#FFFFFF"
          >
            {isSignUp ? 'アカウントをお持ちの方はログイン' : '新規登録はこちら'}
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.note}>
          ※ Firebase連携版
        </Text>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    width: '100%',
    maxWidth: 400,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.PRIMARY,
  },
  switchButton: {
    marginTop: 8,
  },
  note: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
