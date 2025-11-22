import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text, Card, Avatar, Chip, FAB, SegmentedButtons, Portal, Modal, TextInput, Button, Dialog, Paragraph, IconButton, Divider } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useRecruitmentStore, RecruitmentCategory, RecruitmentPost } from '../stores/recruitmentStore';
import { useModerationStore } from '../stores/moderationStore';
import { checkContent } from '../utils/contentModeration';

export default function BoardScreen({ navigation }: { navigation: any }) {
  const { recruitments, addRecruitment, joinRecruitment, leaveRecruitment, isUrgent, isNew } = useRecruitmentStore();
  const [filterCategory, setFilterCategory] = useState<RecruitmentCategory | 'all'>('all');
  
  // 募集作成用State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecruitmentCategory>('game');
  const [location, setLocation] = useState('');
  const [dateStr, setDateStr] = useState(''); // 簡易的な日付入力
  const [maxParticipants, setMaxParticipants] = useState('4');

  // リアルタイムNGワードチェック
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (text: string, field: 'title' | 'description') => {
    if (field === 'title') setTitle(text);
    if (field === 'description') setDescription(text);

    if (text.length > 0) {
      const result = checkContent(text);
      if (!result.isValid) {
        setModerationMessage(result.message || null);
        setIsInputValid(false);
        return;
      }
    }
    setModerationMessage(null);
    setIsInputValid(true);
  };

  const handleCreateRecruitment = () => {
    if (!title || !description || !location || !dateStr) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    // 日付の簡易パース (YYYY/MM/DD HH:mm形式を想定)
    const eventDate = new Date(dateStr);
    if (isNaN(eventDate.getTime())) {
      Alert.alert('エラー', '日付の形式が正しくありません (例: 2023/12/31 19:00)');
      return;
    }

    addRecruitment({
      userId: 'user1', // 自分のID
      title,
      description,
      category,
      eventDate,
      location,
      maxParticipants: parseInt(maxParticipants) || undefined,
    });

    setShowCreateModal(false);
    resetForm();
    Alert.alert('完了', '募集を作成しました！');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('game');
    setLocation('');
    setDateStr('');
    setMaxParticipants('4');
    setModerationMessage(null);
    setIsInputValid(true);
  };

  const filteredRecruitments = recruitments.filter(rec => 
    filterCategory === 'all' || rec.category === filterCategory
  );

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getCategoryLabel = (cat: RecruitmentCategory) => {
    switch (cat) {
      case 'game': return 'ゲーム';
      case 'study': return '勉強';
      case 'event': return 'イベント';
      case 'chat': return '雑談';
      case 'other': return 'その他';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: RecruitmentCategory) => {
    switch (cat) {
      case 'game': return '#E91E63';
      case 'study': return '#2196F3';
      case 'event': return '#4CAF50';
      case 'chat': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderRecruitment = ({ item }: { item: RecruitmentPost }) => {
    const isJoined = item.currentParticipants.includes('user1');
    const isFull = item.maxParticipants ? item.currentParticipants.length >= item.maxParticipants : false;

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('RecruitmentDetail', { recruitmentId: item.id })}>
        <Card.Content>
          <View style={styles.header}>
            <Chip 
              style={{ backgroundColor: getCategoryColor(item.category), marginRight: 8 }}
              textStyle={{ color: 'white', fontSize: 12 }}
            >
              {getCategoryLabel(item.category)}
            </Chip>
            <Text variant="titleMedium" style={styles.titleText}>{item.title}</Text>
            {isUrgent(item) && (
              <Chip style={styles.badgeUrgent} textStyle={styles.badgeText}>急募</Chip>
            )}
            {isNew(item) && (
              <Chip style={styles.badgeNew} textStyle={styles.badgeText}>NEW</Chip>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IconButton icon="calendar-clock" size={16} style={styles.infoIcon} />
              <Text variant="bodyMedium">{formatTime(item.eventDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <IconButton icon="map-marker" size={16} style={styles.infoIcon} />
              <Text variant="bodyMedium">{item.location}</Text>
            </View>
          </View>

          <Paragraph style={styles.description}>{item.description}</Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <View style={styles.participants}>
              <IconButton icon="account-group" size={20} style={styles.infoIcon} />
              <Text variant="bodyMedium">
                {item.currentParticipants.length} / {item.maxParticipants || '∞'} 人参加中
              </Text>
            </View>
            
            {isJoined ? (
              <Button 
                mode="outlined" 
                onPress={() => leaveRecruitment(item.id, 'user1')}
                textColor={COLORS.ERROR}
              >
                キャンセル
              </Button>
            ) : (
              <Button 
                mode="contained" 
                onPress={() => joinRecruitment(item.id, 'user1')}
                disabled={isFull}
                buttonColor={isFull ? COLORS.TEXT_TERTIARY : COLORS.PRIMARY}
              >
                {isFull ? '満員' : '参加する'}
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.BACKGROUND, position: 'relative' }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text variant="headlineMedium" style={styles.pageTitle}>募集掲示板</Text>
        <Text variant="bodyMedium" style={styles.pageSubtitle}>
          ゲームや勉強、イベントの仲間を見つけよう
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <SegmentedButtons
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value as RecruitmentCategory | 'all')}
            buttons={[
              { value: 'all', label: 'すべて' },
              { value: 'game', label: 'ゲーム' },
              { value: 'study', label: '勉強' },
              { value: 'event', label: 'イベント' },
              { value: 'chat', label: '雑談' },
            ]}
            style={styles.filter}
          />
        </ScrollView>
      </View>

      <FlatList
        data={filteredRecruitments}
        renderItem={renderRecruitment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 100 }}
        style={{ flex: 1 }}
      />

        <FAB
          icon="plus"
          label="募集する"
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
        />

        <Portal>
          <Modal
            visible={showCreateModal}
            onDismiss={() => setShowCreateModal(false)}
            contentContainerStyle={styles.modal}
          >
            <ScrollView>
              <Text variant="titleLarge" style={styles.modalTitle}>募集を作成</Text>

              {moderationMessage && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>{moderationMessage}</Text>
                </View>
              )}

              <TextInput
                label="タイトル"
                value={title}
                onChangeText={(text) => handleInputChange(text, 'title')}
                mode="outlined"
                style={styles.input}
                error={!isInputValid && !!title}
              />

              <Text style={styles.label}>カテゴリー</Text>
              <SegmentedButtons
                value={category}
                onValueChange={(value) => setCategory(value as RecruitmentCategory)}
                buttons={[
                  { value: 'game', label: 'ゲーム' },
                  { value: 'study', label: '勉強' },
                  { value: 'event', label: 'イベント' },
                ]}
                style={styles.input}
              />

              <TextInput
                label="開催日時 (例: 2023/12/31 19:00)"
                value={dateStr}
                onChangeText={setDateStr}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY/MM/DD HH:mm"
              />

              <TextInput
                label="場所 (例: Discord, 新宿)"
                value={location}
                onChangeText={setLocation}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="募集人数"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="詳細"
                value={description}
                onChangeText={(text) => handleInputChange(text, 'description')}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                error={!isInputValid && !!description}
              />

              <View style={styles.modalActions}>
                <Button onPress={() => setShowCreateModal(false)}>キャンセル</Button>
                <Button 
                  mode="contained" 
                  onPress={handleCreateRecruitment}
                  disabled={!isInputValid}
                >
                  作成
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  pageTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  pageSubtitle: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filter: {
    minWidth: 400,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontWeight: '700',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: 4,
    width: 20,
    height: 20,
  },
  description: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.PRIMARY,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  label: {
    marginBottom: 8,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  warningBox: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    marginBottom: 16,
    borderRadius: 4,
  },
  warningText: {
    color: '#D32F2F',
    fontSize: 12,
  },
  badgeUrgent: {
    backgroundColor: '#FF5252',
    marginLeft: 8,
    height: 24,
  },
  badgeNew: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
    height: 24,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    lineHeight: 14,
    marginVertical: 0,
    marginHorizontal: 4,
  },
});
