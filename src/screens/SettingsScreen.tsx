import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, List, Divider, Avatar, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { modernStyles } from '../styles/modernStyles';
import { useRegistrationStore } from '../stores/registrationStore';
import { User } from '../types/user';

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const { 
    userId, nickname, profileImageUrl, schoolName, grade, age,
    detailedTags, communicationType, socialLinks, prefecture, careerPath 
  } = useRegistrationStore();

  // 自分のデータをUser型に変換
  const myProfile: User = {
    id: userId || 'user1',
    nickname: nickname || 'ゲスト',
    profileImageUrl: profileImageUrl || 'https://picsum.photos/200',
    schoolName: schoolName || '未設定',
    prefecture: prefecture || '東京都',
    grade: grade || '1年',
    age: age || '16',
    gender: '未設定', // ストアにないので仮
    bio: 'よろしくお願いします。', // ストアにないので仮
    careerPath: careerPath || '大学進学',
    themeColor: '#00BCD4', // デフォルト
    detailedTags: detailedTags,
    socialLinks: socialLinks,
    communicationType: communicationType || {
      approachability: 3,
      initiative: 3,
      responseSpeed: 3,
      groupPreference: 'small',
      textVsVoice: 'text',
      deepVsCasual: 3,
      onlineActivity: 3,
    },
    followerCount: 0,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const handleOpenProfile = () => {
    navigation.navigate('UserDetail', { 
      user: myProfile,
      isPreviewMode: true // 自分自身の表示モード
    });
  };

  return (
    <View style={modernStyles.container}>
      <View style={styles.header}>
        <Text style={modernStyles.headingPrimary}>設定</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* プロフィールカード */}
        <TouchableOpacity style={styles.profileCard} onPress={handleOpenProfile}>
          <Avatar.Image 
            size={60} 
            source={{ uri: myProfile.profileImageUrl }} 
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{myProfile.nickname}</Text>
            <Text style={styles.profileId}>@{myProfile.id}</Text>
            <Text style={styles.viewProfileText}>プロフィールを表示</Text>
          </View>
          <IconButton icon="chevron-right" iconColor={COLORS.TEXT_TERTIARY} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('ProfileEdit', { isEditMode: true })}
          >
            <View style={styles.menuIconContainer}>
              <IconButton icon="account-edit-outline" size={24} iconColor={COLORS.PRIMARY} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>プロフィール編集</Text>
              <Text style={styles.menuDescription}>基本情報、SNSリンク、タグの設定</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconButton icon="shield-account-outline" size={24} iconColor={COLORS.PRIMARY} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>プライバシーとセキュリティ</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>表示と機能</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('FunctionSettings')}
          >
            <View style={styles.menuIconContainer}>
              <IconButton icon="palette-outline" size={24} iconColor={COLORS.ACCENT} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>機能とデザイン</Text>
              <Text style={styles.menuDescription}>フッター、テーマカラーの変更</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconButton icon="bell-outline" size={24} iconColor={COLORS.ACCENT} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>通知設定</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>サポート</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconButton icon="help-circle-outline" size={24} iconColor={COLORS.TEXT_SECONDARY} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>ヘルプセンター</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconButton icon="file-document-outline" size={24} iconColor={COLORS.TEXT_SECONDARY} style={styles.menuIcon} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>利用規約</Text>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: COLORS.BORDER,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  profileId: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  viewProfileText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  menuIcon: {
    margin: 0,
  },
  menuContent: {
    flex: 1,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
});
