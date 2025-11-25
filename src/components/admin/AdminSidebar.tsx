import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { TabType } from '../../hooks/useAdmin';
import { COLORS } from '../../constants/AppConfig';

interface AdminSidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { value: 'dashboard', label: 'ダッシュボード', icon: 'view-dashboard' },
    { value: 'users', label: 'ユーザー', icon: 'account-group' },
    { value: 'titles', label: '称号管理', icon: 'trophy' },
    { value: 'announcements', label: 'お知らせ', icon: 'bullhorn' },
    { value: 'reports', label: '通報管理', icon: 'shield-alert' },
    { value: 'ng_words', label: 'NGワード', icon: 'text-box-remove' },
    { value: 'ads', label: '広告管理', icon: 'bullhorn' },
    { value: 'notifications', label: '通知', icon: 'bell' },
  ];

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        {/* Logo removed */}
      </View>
      <ScrollView>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.sidebarItem,
              currentTab === item.value && styles.sidebarItemActive
            ]}
            onPress={() => setCurrentTab(item.value as TabType)}
          >
            <IconButton 
              icon={item.icon} 
              iconColor={currentTab === item.value ? 'white' : '#a0a5aa'} 
              size={20} 
              style={{ margin: 0 }}
            />
            <Text style={[
              styles.sidebarText,
              currentTab === item.value && styles.sidebarTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#23282d',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#32373c',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
  },
  sidebarItemActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  sidebarText: {
    color: '#a0a5aa',
    marginLeft: 8,
    fontSize: 14,
  },
  sidebarTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
