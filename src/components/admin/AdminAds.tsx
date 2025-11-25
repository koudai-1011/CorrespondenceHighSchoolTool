import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Modal, TextInput, Chip, SegmentedButtons, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';
import { PopupAd as Ad, AdDisplayTrigger } from '../../stores/adStore';
import { SUGGESTIONS, CATEGORIES } from '../../data/tagData';
import { useSettingsStore } from '../../stores/settingsStore';

interface AdminAdsProps {
  ads: Ad[];
  showAdForm: boolean;
  setShowAdForm: (show: boolean) => void;
  editingAdId: string | null;
  setEditingAdId: (id: string | null) => void;
  adTitle: string;
  setAdTitle: (text: string) => void;
  adImageUrl: string;
  setAdImageUrl: (text: string) => void;
  adLinkUrl: string;
  setAdLinkUrl: (text: string) => void;
  adPrefectures: string;
  setAdPrefectures: (text: string) => void;
  adSelectedTags: string[];
  setAdSelectedTags: (tags: string[]) => void;
  currentTagCategory: string;
  setCurrentTagCategory: (category: string) => void;
  adMaxDisplayCount: string;
  setAdMaxDisplayCount: (text: string) => void;
  adDisplayTriggers: AdDisplayTrigger[];
  setAdDisplayTriggers: (triggers: AdDisplayTrigger[]) => void;
  adGrades: string[];
  setAdGrades: (grades: string[]) => void;
  adAgeMin: string;
  setAdAgeMin: (text: string) => void;
  adAgeMax: string;
  setAdAgeMax: (text: string) => void;
  handleEditAd: (ad: Ad) => void;
  toggleAdStatus: (id: string) => void;
  toggleAdTag: (tag: string) => void;
  handleSaveAd: () => void;
  handleDeleteAd: (id: string) => void;
  resetAdForm: () => void;
}

export const AdminAds: React.FC<AdminAdsProps> = ({
  ads,
  showAdForm,
  setShowAdForm,
  editingAdId,
  setEditingAdId,
  adTitle,
  setAdTitle,
  adImageUrl,
  setAdImageUrl,
  adLinkUrl,
  setAdLinkUrl,
  adPrefectures,
  setAdPrefectures,
  adSelectedTags,
  setAdSelectedTags,
  currentTagCategory,
  setCurrentTagCategory,
  adMaxDisplayCount,
  setAdMaxDisplayCount,
  adDisplayTriggers,
  setAdDisplayTriggers,
  adGrades,
  setAdGrades,
  adAgeMin,
  setAdAgeMin,
  adAgeMax,
  setAdAgeMax,
  handleEditAd,
  toggleAdStatus,
  toggleAdTag,
  handleSaveAd,
  handleDeleteAd,
  resetAdForm,
}) => {
  const handleDelete = (id: string) => {
    if (confirm('この広告を削除しますか？')) {
      handleDeleteAd(id);
    }
  };

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>ポップアップ広告管理</Text>
          <Button 
            mode="contained" 
            onPress={resetAdForm}
            icon="plus"
            style={styles.addButton}
          >
            新規作成
          </Button>
        </View>
        <Text style={styles.infoText}>
          アプリ起動時に表示するポップアップ広告を設定します。
        </Text>

        <Card style={styles.announcementCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>広告配信システムについて</Text>
            <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY, lineHeight: 20 }}>
              本アプリでは、以下のルールに基づいた「重み付け抽選」により広告が表示されます：{'\n'}
              1. <Text style={{ fontWeight: 'bold' }}>目標達成率の優先</Text>: 目標表示回数が多い（残り回数が多い）広告ほど、表示確率が高くなります。{'\n'}
              2. <Text style={{ fontWeight: 'bold' }}>狭域ターゲットの優先</Text>: 地域・タグ・学年などの条件が設定されている広告は、全国向け広告よりも優先的に表示されます（重み5倍）。
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.announcementCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>広告表示間隔設定</Text>
            <Text variant="bodySmall" style={{ marginBottom: 12, color: COLORS.TEXT_SECONDARY }}>
              広告が表示されてから次の広告が表示されるまでの最小間隔を設定します
            </Text>
            <SegmentedButtons
              value={(useSettingsStore.getState().adDisplayInterval / (60 * 60 * 1000)).toString()}
              onValueChange={(value) => {
                const hours = parseInt(value, 10);
                useSettingsStore.getState().setAdDisplayInterval(hours * 60 * 60 * 1000);
              }}
              buttons={[
                { value: '1', label: '1時間' },
                { value: '2', label: '2時間' },
                { value: '6', label: '6時間' },
                { value: '24', label: '24時間' },
              ]}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>広告一覧</Text>

        {ads.map((ad) => (
          <Card key={ad.id} style={styles.announcementCard}>
            <Card.Content>
              <View style={styles.announcementHeader}>
                <Image source={{ uri: ad.imageUrl }} style={styles.colorPreview} />
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={styles.announcementTitle}>{ad.title}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {ad.target.prefectures.length > 0 ? (
                      ad.target.prefectures.map((p: string, i: number) => <Chip key={i} compact>{p}</Chip>)
                    ) : (
                      <Chip compact>全国</Chip>
                    )}
                    {ad.target.tags.length > 0 && (
                      ad.target.tags.map((t: string, i: number) => <Chip key={i} compact>{t}</Chip>)
                    )}
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <IconButton icon={ad.isActive ? "eye" : "eye-off"} onPress={() => toggleAdStatus(ad.id)} />
                  <IconButton icon="pencil" onPress={() => handleEditAd(ad)} />
                  <IconButton icon="delete" onPress={() => handleDelete(ad.id)} />
                </View>
              </View>
              {ad.linkUrl && (
                <Text variant="bodySmall" style={{ marginTop: 8, color: COLORS.PRIMARY }}>
                  リンク: {ad.linkUrl}
                </Text>
              )}
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
                <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                  表示回数: {ad.displayCount} {ad.maxDisplayCount !== null ? `/ ${ad.maxDisplayCount}` : '/ 無制限'}
                </Text>
                <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                  トリガー: {ad.displayTriggers.join(', ')}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* 広告作成・編集モーダル */}
      <Portal>
        <Modal
          visible={showAdForm}
          onDismiss={() => setShowAdForm(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {editingAdId ? '広告を編集' : '新規広告作成'}
            </Text>

            <TextInput
              label="管理用タイトル"
              value={adTitle}
              onChangeText={setAdTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="画像URL"
              value={adImageUrl}
              onChangeText={setAdImageUrl}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            {adImageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: adImageUrl }} style={styles.imagePreview} resizeMode="contain" />
              </View>
            ) : null}

            <TextInput
              label="リンクURL (任意)"
              value={adLinkUrl}
              onChangeText={setAdLinkUrl}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            <Divider style={{ marginVertical: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>ターゲット設定</Text>

            <TextInput
              label="都道府県 (カンマ区切り、空欄で全国)"
              value={adPrefectures}
              onChangeText={setAdPrefectures}
              mode="outlined"
              style={styles.input}
              placeholder="東京都, 神奈川県"
            />

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
              <TextInput
                label="最小年齢"
                value={adAgeMin}
                onChangeText={setAdAgeMin}
                mode="outlined"
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
              />
              <TextInput
                label="最大年齢"
                value={adAgeMax}
                onChangeText={setAdAgeMax}
                mode="outlined"
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
              />
            </View>

            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>対象学年</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['中3', '高1', '高2', '高3', '既卒', '社会人', '保護者'].map(grade => (
                <Chip
                  key={grade}
                  selected={adGrades.includes(grade)}
                  onPress={() => {
                    if (adGrades.includes(grade)) {
                      setAdGrades(adGrades.filter(g => g !== grade));
                    } else {
                      setAdGrades([...adGrades, grade]);
                    }
                  }}
                  showSelectedOverlay
                >
                  {grade}
                </Chip>
              ))}
            </View>

            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>興味タグ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATEGORIES.map(category => (
                <Chip
                  key={category}
                  selected={currentTagCategory === category}
                  onPress={() => setCurrentTagCategory(category)}
                  style={{ marginRight: 8 }}
                  showSelectedOverlay
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {SUGGESTIONS[currentTagCategory]?.map((tag) => (
                <Chip
                  key={tag.name}
                  selected={adSelectedTags.includes(tag.name)}
                  onPress={() => toggleAdTag(tag.name)}
                  showSelectedOverlay
                >
                  {tag.name}
                </Chip>
              ))}
            </View>
            
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>選択中: {adSelectedTags.length > 0 ? adSelectedTags.join(', ') : 'なし（全タグ対象）'}</Text>

            <Divider style={{ marginVertical: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>表示設定</Text>

            <TextInput
              label="表示上限数（空欄で無制限）"
              value={adMaxDisplayCount}
              onChangeText={setAdMaxDisplayCount}
              mode="outlined"
              style={styles.input}
              placeholder="例: 100"
              keyboardType="numeric"
            />

            <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>表示トリガー</Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
              広告を表示するタイミングを選択してください（複数選択可）
            </Text>

            <View style={{ gap: 8, marginBottom: 16 }}>
              {([
                { value: 'APP_OPEN', label: 'アプリ起動時' },
                { value: 'PROFILE_UPDATE', label: 'プロフィール更新時' },
                { value: 'SCREEN_TRANSITION', label: '画面遷移時' },
                { value: 'TIME_BASED', label: '時間経過' },
              ] as { value: AdDisplayTrigger; label: string }[]).map(trigger => (
                <Chip
                  key={trigger.value}
                  selected={adDisplayTriggers.includes(trigger.value)}
                  onPress={() => {
                    if (adDisplayTriggers.includes(trigger.value)) {
                      setAdDisplayTriggers(adDisplayTriggers.filter(t => t !== trigger.value));
                    } else {
                      setAdDisplayTriggers([...adDisplayTriggers, trigger.value]);
                    }
                  }}
                  showSelectedOverlay
                >
                  {trigger.label}
                </Chip>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setShowAdForm(false)} style={{ flex: 1 }}>
                キャンセル
              </Button>
              <Button mode="contained" onPress={handleSaveAd} style={{ flex: 1 }}>
                保存
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
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
  addButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  announcementCard: {
    marginBottom: 12,
    backgroundColor: COLORS.SURFACE,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  announcementTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  imagePreviewContainer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
