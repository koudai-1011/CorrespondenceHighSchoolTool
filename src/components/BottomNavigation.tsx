import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

export default function BottomNavigation() {
  const navigation = useNavigation();
  const { footerItems, currentRouteName } = useSettingsStore();

  const handleNavigate = (screen: string) => {
    console.log('[BottomNav] Tab clicked:', screen);
    console.log('[BottomNav] Current route:', currentRouteName);
    try {
      navigation.navigate(screen as never);
      console.log('[BottomNav] Navigate called successfully');
    } catch (error) {
      console.error('[BottomNav] Navigate error:', error);
    }
  };

  if (!footerItems || footerItems.length === 0) {
    console.warn('[BottomNav] No footer items');
    return null;
  }

  return (
    <View style={styles.container}>
      {footerItems.map((item) => {
        const isActive = currentRouteName === item.screen;
        
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => {
              console.log('[BottomNav] TouchableOpacity pressed:', item.screen);
              handleNavigate(item.screen);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={isActive ? COLORS.PRIMARY : COLORS.TEXT_TERTIARY}
              />
              <Text 
                variant="labelSmall" 
                style={{ 
                  color: isActive ? COLORS.PRIMARY : COLORS.TEXT_TERTIARY,
                  fontSize: 10,
                  marginTop: 2,
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 56, // 少し低く
    backgroundColor: COLORS.SURFACE, // 白背景
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER, // 極薄いボーダー
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingBottom: 0, // iPhone X等のSafeArea対応は親側で制御するか、ここでpaddingBottomを入れる
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    margin: 0,
  },
});
