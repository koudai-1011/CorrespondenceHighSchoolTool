import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Modal, TextInput, Chip } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';
import { Announcement } from '../../data/dummyAnnouncements';

interface AdminAnnouncementsProps {
  announcements: Announcement[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingId: string | null;
  formTitle: string;
  setFormTitle: (text: string) => void;
  formDescription: string;
  setFormDescription: (text: string) => void;
  formBackgroundColor: string;
  setFormBackgroundColor: (color: string) => void;
  formLink: string;
  setFormLink: (text: string) => void;
  formImageUrl: string;
  setFormImageUrl: (text: string) => void;
  handleEditAnnouncement: (announcement: Announcement) => void;
  handleDeleteAnnouncement: (id: string) => void;
  handleSaveAnnouncement: () => void;
  resetAnnouncementForm: () => void;
}

export const AdminAnnouncements: React.FC<AdminAnnouncementsProps> = ({
  announcements,
  showForm,
  setShowForm,
  editingId,
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  formBackgroundColor,
  setFormBackgroundColor,
  formLink,
  setFormLink,
  formImageUrl,
  setFormImageUrl,
  handleEditAnnouncement,
  handleDeleteAnnouncement,
  handleSaveAnnouncement,
  resetAnnouncementForm,
}) => {
  const colorOptions = [
    { label: '青', value: '#6B9BD1' },
    { label: 'オレンジ', value: '#F4A261' },
    { label: '緑', value: '#81C784' },
    { label: '紫', value: '#BA68C8' },
    { label: 'ピンク', value: '#FF6B9D' },
    { label: 'シアン', value: '#00BCD4' },
  ];

  const handleDelete = (id: string) => {
    if (confirm('このお知らせを削除しますか？')) {
      handleDeleteAnnouncement(id);
    }
  };

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>お知らせ管理</Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setShowForm(true)}
            style={styles.addButton}
          >
            新規作成
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.infoText}>
          ホーム画面のスライダーに表示されるお知らせを管理できます
        </Text>

        {/* お知らせ一覧 */}
        {announcements.map((announcement) => (
          <Card key={announcement.id} style={styles.announcementCard}>
            <Card.Content>
              <View style={styles.announcementHeader}>
                <View style={[styles.colorPreview, { backgroundColor: announcement.backgroundColor }]} />
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.announcementDescription}>
                    {announcement.description}
                  </Text>
                  {announcement.imageUrl && (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: announcement.imageUrl }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  {announcement.link && (
                    <Chip icon="link" style={styles.linkChip} textStyle={{ fontSize: 12 }}>
                      {announcement.link}
                    </Chip>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEditAnnouncement(announcement)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(announcement.id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* お知らせ作成・編集モーダル */}
      <Portal>
        <Modal visible={showForm} onDismiss={resetAnnouncementForm} contentContainerStyle={styles.modalContainer}>
          <ScrollView>
            <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: 'bold' }}>
              {editingId ? 'お知らせを編集' : '新しいお知らせを作成'}
            </Text>
            
            <TextInput
              label="タイトル"
              value={formTitle}
              onChangeText={setFormTitle}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="説明文"
              value={formDescription}
              onChangeText={setFormDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>背景色</Text>
            <View style={styles.colorOptions}>
              {colorOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: option.value },
                    formBackgroundColor === option.value && styles.colorOptionSelected
                  ]}
                  onPress={() => setFormBackgroundColor(option.value)}
                />
              ))}
            </View>

            <TextInput
              label="リンクURL (任意)"
              value={formLink}
              onChangeText={setFormLink}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            <TextInput
              label="画像URL (任意)"
              value={formImageUrl}
              onChangeText={setFormImageUrl}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            {formImageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Text variant="bodySmall" style={{ marginBottom: 4 }}>プレビュー:</Text>
                <Image source={{ uri: formImageUrl }} style={styles.imagePreview} resizeMode="cover" />
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={resetAnnouncementForm} style={{ flex: 1 }}>
                キャンセル
              </Button>
              <Button mode="contained" onPress={handleSaveAnnouncement} style={{ flex: 1 }}>
                {editingId ? '更新' : '作成'}
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
  announcementDescription: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  linkChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  imagePreviewContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
