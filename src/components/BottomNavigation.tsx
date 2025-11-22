import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

export default function BottomNavigation() {
  const navigation = useNavigation();
  // ストアから現在のルート名を取得
  const { footerItems, currentRouteName } = useSettingsStore();

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
  };

  // footerItemsが存在しない場合は何も表示しない
  if (!footerItems || footerItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {footerItems.map((item, index) => {
        const isActive = currentRouteName === item.screen;
        const isCenterItem = index === 2; // 中央のアイテム

        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, isCenterItem && styles.centerItem]}
            onPress={() => handleNavigate(item.screen)}
          >
            <View style={[styles.iconContainer, isCenterItem && styles.centerIconContainer]}>
              <IconButton
                icon={item.icon}
                size={isCenterItem ? 28 : 24}
                iconColor={isActive ? (isCenterItem ? '#FFFFFF' : COLORS.PRIMARY) : '#757575'}
                style={{ margin: 0 }}
              />
            </View>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                isActive && styles.activeLabel,
                isCenterItem && styles.centerLabel,
              ]}
            >
              {item.label}
            </Text>
            {isActive && !isCenterItem && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  centerItem: {
    marginTop: -8, // 中央のアイテムを少し持ち上げる
  },
  iconContainer: {
    marginBottom: 2,
  },
  centerIconContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },
  activeLabel: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  centerLabel: {
    fontSize: 10,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
});
