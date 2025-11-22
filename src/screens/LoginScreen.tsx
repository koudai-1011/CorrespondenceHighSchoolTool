import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const handleLogin = () => {
    navigation.navigate('ProfileCreation');
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

        <View style={styles.buttonContainer}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            }}
            onClick={handleLogin}
          >
            <Text variant="titleMedium" style={styles.buttonText}>
              🚀 はじめる
            </Text>
          </div>
        </View>

        <Text variant="bodySmall" style={styles.note}>
          ※ プロトタイプ版です
        </Text>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
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
  buttonContainer: {
    width: 280,
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
  },
  note: {
    color: "#999999",
    textAlign: "center",
  },
});
