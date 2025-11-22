import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Modal, TextInput, Button, SegmentedButtons, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useCommunityStore, CommunityCategory } from '../stores/communityStore';
import { checkContent } from '../utils/contentModeration';

export default function CommunityScreen({ navigation }: { navigation: any }) {
  const { topics, addTopic, getTrendingTopics, getNewestTopics } = useCommunityStore();
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'all'>('all');
  const [sortType, setSortType] = useState<'trending' | 'new' | 'all'>('all');
  
  // トピック作成用State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('chat');

  // リアルタイムNGワードチェック
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (text: string, field: 'title' | 'content') => {
    if (field === 'title') setNewTitle(text);
    if (field === 'content') setNewContent(text);

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

  const handleCreateTopic = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('タイトルと内容を入力してください');
      return;
    }

    addTopic({
      categoryId: newCategory,
      authorId: 'user1',
      title: newTitle,
      content: newContent,
    });

    setShowCreateModal(false);
    resetForm();
    alert('トピックを作成しました');
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setNewCategory('chat');
    setModerationMessage(null);
    setIsInputValid(true);
  };

  let displayedTopics = topics;

  if (sortType === 'trending') {
    displayedTopics = getTrendingTopics();
  } else if (sortType === 'new') {
    displayedTopics = getNewestTopics();
  }

  const filteredTopics = selectedCategory === 'all' 
    ? displayedTopics 
    : displayedTopics.filter(t => t.categoryId === selectedCategory);

  const getCategoryLabel = (cat: CommunityCategory) => {
    switch (cat) {
      case 'game': return 'ゲーム';
      case 'study': return '勉強';
      case 'career': return '進路';
      case 'love': return '恋愛';
      case 'chat': return '雑談';
      case 'other': return 'その他';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: CommunityCategory) => {
    switch (cat) {
      case 'game': return '#E91E63';
      case 'study': return '#2196F3';
      case 'career': return '#4CAF50';
      case 'love': return '#F06292';
      case 'chat': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const renderTopic = ({ item }: any) => {
    const isTrending = item.commentCount >= 5; // 簡易的な盛り上がり判定

    return (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('TopicDetail', { topicId: item.id })}
    >
      <Card.Content>
        <View style={styles.header}>
          <Chip 
            style={{ backgroundColor: getCategoryColor(item.categoryId), marginRight: 8 }}
            textStyle={{ color: 'white', fontSize: 12 }}
          >
            {getCategoryLabel(item.categoryId)}
          </Chip>
          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {isTrending && <Text>🔥 </Text>}
            {item.title}
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.content} numberOfLines={2}>
          {item.content}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <IconButton icon="eye" size={16} style={styles.statIcon} />
            <Text variant="bodySmall" style={styles.statText}>{item.viewCount}</Text>
            
            <IconButton icon="comment" size={16} style={styles.statIcon} />
            <Text variant="bodySmall" style={styles.statText}>{item.commentCount}</Text>
          </View>
          
          <Text variant="bodySmall" style={styles.time}>
            {formatTime(item.lastCommentAt)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.BACKGROUND, position: 'relative' }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text variant="headlineMedium" style={styles.pageTitle}>コミュニティ</Text>
        <Text variant="bodyMedium" style={styles.pageSubtitle}>
          テーマごとに自由に話し合おう
        </Text>

        <SegmentedButtons
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as CommunityCategory | 'all')}
          buttons={[
            { value: 'all', label: 'すべて' },
            { value: 'game', label: 'ゲーム' },
            { value: 'study', label: '勉強' },
            { value: 'career', label: '進路' },
            { value: 'chat', label: '雑談' },
          ]}
          style={styles.filter}
        />

        <View style={styles.sortTabs}>
          <Chip 
            selected={sortType === 'all'} 
            onPress={() => setSortType('all')}
            style={styles.sortChip}
            showSelectedOverlay
          >
            すべて
          </Chip>
          <Chip 
            selected={sortType === 'trending'} 
            onPress={() => setSortType('trending')}
            style={styles.sortChip}
            showSelectedOverlay
            icon="fire"
          >
            盛り上がり
          </Chip>
          <Chip 
            selected={sortType === 'new'} 
            onPress={() => setSortType('new')}
            style={styles.sortChip}
            showSelectedOverlay
            icon="clock-outline"
          >
            新着
          </Chip>
        </View>
      </View>

        <FlatList
          data={filteredTopics}
          renderItem={renderTopic}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 100 }}
          style={{ flex: 1 }}
        />

        <FAB
          icon="plus"
          label="トピック作成"
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
        />

        <Portal>
          <Modal
            visible={showCreateModal}
            onDismiss={() => setShowCreateModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>新しいトピック</Text>

            {moderationMessage && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>{moderationMessage}</Text>
              </View>
            )}

            <Text style={styles.label}>カテゴリー</Text>
            <SegmentedButtons
              value={newCategory}
              onValueChange={(value) => setNewCategory(value as CommunityCategory)}
              buttons={[
                { value: 'game', label: 'ゲーム' },
                { value: 'study', label: '勉強' },
                { value: 'career', label: '進路' },
              ]}
              style={styles.input}
            />

            <TextInput
              label="タイトル"
              value={newTitle}
              onChangeText={(text) => handleInputChange(text, 'title')}
              mode="outlined"
              style={styles.input}
              error={!isInputValid && !!newTitle}
            />

            <TextInput
              label="内容"
              value={newContent}
              onChangeText={(text) => handleInputChange(text, 'content')}
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.input}
              error={!isInputValid && !!newContent}
            />

            <View style={styles.modalActions}>
              <Button onPress={() => setShowCreateModal(false)}>キャンセル</Button>
              <Button 
                mode="contained" 
                onPress={handleCreateTopic}
                disabled={!isInputValid}
              >
                作成
              </Button>
            </View>
          </Modal>
        </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  filter: {
    marginBottom: 12,
  },
  sortTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  sortChip: {
    backgroundColor: 'white',
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  content: {
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
    width: 20,
    height: 20,
  },
  statText: {
    marginRight: 12,
    color: COLORS.TEXT_TERTIARY,
  },
  time: {
    color: COLORS.TEXT_TERTIARY,
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
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
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
});
