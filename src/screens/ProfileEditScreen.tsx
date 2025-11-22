import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Avatar, Card, IconButton, Portal, Modal, TextInput, Button, Divider, SegmentedButtons, FAB } from 'react-native-paper';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

export default function ProfileEditScreen({ navigation, route }: { navigation: any; route: any }) {
  const isEditMode = route?.params?.isEditMode ?? false;
  const {
    userId,
    nickname,
    profileImageUrl,
    schoolName,
    prefecture,
    grade,
    age,
    careerPath,
    themeColor,
    socialLinks,
    detailedTags,
    communicationType,
    setProfileImageUrl,
    setSocialLinks,
  } = useRegistrationStore();

  const { setPendingAdTrigger } = useSettingsStore();

  // モーダル表示状態
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(profileImageUrl || '');

  // SNSリンク編集用のstate
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempPlatform, setTempPlatform] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempUsername, setTempUsername] = useState('');

  // プロフィール画像の保存
  const handleSaveImage = () => {
    setProfileImageUrl(tempImageUrl || undefined);
    setShowImageModal(false);
    setPendingAdTrigger('PROFILE_UPDATE'); // プロフィール更新トリガー
  };

  // プロフィール画像のクリア
  const handleClearImage = () => {
    setTempImageUrl('');
    setProfileImageUrl(undefined);
    setShowImageModal(false);
  };

  // SNSリンクの追加・編集
  const handleSaveSocialLink = () => {
    if (!tempPlatform.trim() || !tempUrl.trim()) {
      alert('プラットフォームとURLを入力してください');
      return;
    }

    // 新規追加時、同じプラットフォームが既に登録されていないかチェック
    if (editingIndex === null) {
      const alreadyExists = socialLinks.some(link => link.platform === tempPlatform);
      if (alreadyExists) {
        alert(`${tempPlatform}は既に登録されています`);
        return;
      }
    }

    const newLink = {
      platform: tempPlatform,
      url: tempUrl,
      username: tempUsername || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...socialLinks];
      updated[editingIndex] = newLink;
      setSocialLinks(updated);
    } else {
      setSocialLinks([...socialLinks, newLink]);
    }

    setShowSocialModal(false);
    setTempPlatform('');
    setTempUrl('');
    setTempUsername('');
    setEditingIndex(null);
    setPendingAdTrigger('PROFILE_UPDATE'); // プロフィール更新トリガー
  };

  // SNSリンクの削除
  const handleDeleteSocialLink = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
  };

  // SNSリンク編集モーダルを開く
  const openSocialModal = (index?: number) => {
    if (index !== undefined) {
      const link = socialLinks[index];
      setTempPlatform(link.platform);
      setTempUrl(link.url);
      setTempUsername(link.username || '');
      setEditingIndex(index);
    } else {
      // 新規追加時：未登録のプラットフォームを自動選択
      const platforms = ['Discord', 'X', 'Instagram'];
      const availablePlatform = platforms.find(
        platform => !socialLinks.some(link => link.platform === platform)
      );
      setTempPlatform(availablePlatform || 'Discord');
      setTempUrl('');
      setTempUsername('');
      setEditingIndex(null);
    }
    setShowSocialModal(true);
  };

  // コミュニケーションスタイルのラベル取得
  const getGroupPreferenceLabel = (value: string) => {
    switch (value) {
      case 'one-on-one': return '1対1';
      case 'small': return '少人数(2-5人)';
      case 'large': return '大人数OK';
      default: return value;
    }
  };

  const getTextVsVoiceLabel = (value: string) => {
    switch (value) {
      case 'text': return 'テキスト派';
      case 'voice': return '通話派';
      case 'both': return 'どちらでもOK';
      default: return value;
    }
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        {/* プロフィール画像 */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={() => {
            setTempImageUrl(profileImageUrl || '');
            setShowImageModal(true);
          }}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
              <Avatar.Icon size={120} icon="account" style={{ backgroundColor: themeColor }} />
            )}
            <View style={styles.imageEditBadge}>
              <IconButton icon="camera" size={20} iconColor="white" style={{ margin: 0 }} />
            </View>
          </TouchableOpacity>
          <Text variant="bodySmall" style={styles.imageHint}>
            タップして画像を変更
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* 客観視ボタン */}
        <Button
          mode="outlined"
          onPress={() => {
            const myProfile = {
              id: 'user1',
              nickname,
              profileImageUrl,
              schoolName,
              prefecture,
              grade,
              age,
              careerPath,
              themeColor,
              detailedTags,
              communicationType,
              followerCount: 0,
              lastActive: new Date(),
              createdAt: new Date(),
            };
            navigation.navigate('UserDetail', { user: myProfile, isPreviewMode: true });
          }}
          style={styles.previewButton}
          icon="eye"
        >
          自分のプロフィールを客観視する
        </Button>

        {/* 基本情報 */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ProfileCreation', { isEditMode: true })}
          activeOpacity={0.7}
        >
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>基本情報</Text>
                <IconButton icon="arrow-right" size={20} />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ニックネーム</Text>
                <Text style={styles.infoValue}>{nickname || '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ユーザーID</Text>
                <Text style={styles.infoValue}>@{userId || '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>学校</Text>
                <Text style={styles.infoValue}>{schoolName || '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>都道府県</Text>
                <Text style={styles.infoValue}>{prefecture || '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>学年</Text>
                <Text style={styles.infoValue}>{grade ? `${grade}年生` : '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>年齢</Text>
                <Text style={styles.infoValue}>{age || '未設定'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>進路</Text>
                <Text style={styles.infoValue}>{careerPath || '未設定'}</Text>
              </View>

              <Text variant="bodySmall" style={styles.hint}>
                タップして編集
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {/* コミュニケーションスタイル */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('CommunicationDiagnosis', { isEditMode: true })}
          activeOpacity={0.7}
        >
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>コミュニケーションスタイル</Text>
                <IconButton icon="arrow-right" size={20} />
              </View>

              <View style={styles.commStyleGrid}>
                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>話しかけやすさ</Text>
                  <Text style={styles.commStyleValue}>{communicationType.approachability}/5</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>自分から話す</Text>
                  <Text style={styles.commStyleValue}>{communicationType.initiative}/5</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>返信の速さ</Text>
                  <Text style={styles.commStyleValue}>{communicationType.responseSpeed}/5</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>グループ好み</Text>
                  <Text style={styles.commStyleValue}>{getGroupPreferenceLabel(communicationType.groupPreference)}</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>手段</Text>
                  <Text style={styles.commStyleValue}>{getTextVsVoiceLabel(communicationType.textVsVoice)}</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>会話の深さ</Text>
                  <Text style={styles.commStyleValue}>{communicationType.deepVsCasual}/5</Text>
                </View>

                <View style={styles.commStyleItem}>
                  <Text style={styles.commStyleLabel}>オンライン頻度</Text>
                  <Text style={styles.commStyleValue}>{communicationType.onlineActivity}/5</Text>
                </View>
              </View>

              <Text variant="bodySmall" style={styles.hint}>
                タップして編集
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {/* 詳細タグ */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('DetailedTagInput', { isEditMode: true })}
          activeOpacity={0.7}
        >
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>詳細タグ</Text>
                <IconButton icon="arrow-right" size={20} />
              </View>

              <Text variant="bodyMedium" style={styles.tagCount}>
                {detailedTags.length}個のタグ
              </Text>

              {detailedTags.length > 0 && (
                <View style={styles.tagPreview}>
                  {detailedTags.slice(0, 5).map((tag, index) => (
                    <Text key={index} style={styles.tagChip}>
                      {tag.name}
                    </Text>
                  ))}
                  {detailedTags.length > 5 && (
                    <Text style={styles.tagMore}>他{detailedTags.length - 5}個</Text>
                  )}
                </View>
              )}

              <Text variant="bodySmall" style={styles.hint}>
                タップして編集
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {/* SNSリンク */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>SNSリンク</Text>
              {socialLinks.length < 3 && (
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => openSocialModal()}
                />
              )}
            </View>

            <Text variant="bodyMedium" style={styles.tagCount}>
              {socialLinks.length}個のリンク
            </Text>

            {socialLinks.length > 0 && (
              <View style={styles.socialList}>
                {socialLinks.map((link, index) => (
                  <View key={index} style={styles.socialItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.socialPlatform}>{link.platform}</Text>
                      <Text style={styles.socialUrl} numberOfLines={1}>{link.url}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <IconButton
                        icon="pencil"
                        size={18}
                        onPress={() => openSocialModal(index)}
                      />
                      <IconButton
                        icon="delete"
                        size={18}
                        onPress={() => handleDeleteSocialLink(index)}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text variant="bodySmall" style={styles.hint}>
              タップして追加・編集
            </Text>
          </Card.Content>
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>

      {isEditMode && (
        <FAB
          icon="check"
          label="保存"
          style={styles.fab}
          onPress={() => navigation.goBack()}
        />
      )}

      {/* プロフィール画像設定モーダル */}
      <Portal>
        <Modal
          visible={showImageModal}
          onDismiss={() => setShowImageModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>プロフィール画像を設定</Text>

          <TextInput
            label="画像URL"
            value={tempImageUrl}
            onChangeText={setTempImageUrl}
            mode="outlined"
            placeholder="https://example.com/image.jpg"
            style={styles.input}
          />

          {tempImageUrl && (
            <View style={styles.imagePreview}>
              <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
                プレビュー
              </Text>
              <Image
                source={{ uri: tempImageUrl }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          )}

          <Text variant="bodySmall" style={styles.modalHint}>
            プロフィールに表示したい画像のURLを入力してください
          </Text>

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={handleClearImage} style={{ flex: 1 }}>
              クリア
            </Button>
            <Button mode="outlined" onPress={() => setShowImageModal(false)} style={{ flex: 1 }}>
              キャンセル
            </Button>
            <Button mode="contained" onPress={handleSaveImage} style={{ flex: 1 }}>
              保存
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* SNSリンク編集モーダル */}
      <Portal>
        <Modal
          visible={showSocialModal}
          onDismiss={() => setShowSocialModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingIndex !== null ? 'SNSリンクを編集' : 'SNSリンクを追加'}
          </Text>

          <Text variant="bodyMedium" style={{ marginBottom: 8, color: COLORS.TEXT_PRIMARY }}>
            プラットフォームを選択
          </Text>
          <SegmentedButtons
            value={tempPlatform}
            onValueChange={setTempPlatform}
            buttons={[
              { 
                value: 'Discord', 
                label: 'Discord',
                disabled: editingIndex === null && socialLinks.some(link => link.platform === 'Discord')
              },
              { 
                value: 'X', 
                label: 'X',
                disabled: editingIndex === null && socialLinks.some(link => link.platform === 'X')
              },
              { 
                value: 'Instagram', 
                label: 'Instagram',
                disabled: editingIndex === null && socialLinks.some(link => link.platform === 'Instagram')
              },
            ]}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            label="URL"
            value={tempUrl}
            onChangeText={setTempUrl}
            mode="outlined"
            placeholder="https://..."
            style={styles.input}
          />

          <TextInput
            label="ユーザー名（任意）"
            value={tempUsername}
            onChangeText={setTempUsername}
            mode="outlined"
            placeholder="@username"
            style={styles.input}
          />

          <Text variant="bodySmall" style={styles.modalHint}>
            Discord、X、Instagramのプロフィールリンクを各1つずつ追加できます
          </Text>

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowSocialModal(false)} style={{ flex: 1 }}>
              キャンセル
            </Button>
            <Button mode="contained" onPress={handleSaveSocialLink} style={{ flex: 1 }}>
              {editingIndex !== null ? '更新' : '追加'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  imageEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHint: {
    marginTop: 8,
    color: COLORS.TEXT_SECONDARY,
  },
  divider: {
    marginVertical: 16,
  },
  card: {
    backgroundColor: COLORS.SURFACE,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  comingSoon: {
    color: COLORS.TEXT_TERTIARY,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  infoValue: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  commStyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  commStyleItem: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  commStyleLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  commStyleValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  hint: {
    color: COLORS.TEXT_TERTIARY,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  tagCount: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  tagPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    color: COLORS.PRIMARY,
  },
  tagMore: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 12,
    alignSelf: 'center',
  },
  socialList: {
    gap: 8,
  },
  socialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  socialPlatform: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    width: 100,
  },
  socialUrl: {
    flex: 1,
    color: COLORS.TEXT_SECONDARY,
  },
  previewButton: {
    marginVertical: 16,
    borderColor: COLORS.PRIMARY,
  },
  // モーダル
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  imagePreview: {
    marginBottom: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  modalHint: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.PRIMARY,
  },
});
