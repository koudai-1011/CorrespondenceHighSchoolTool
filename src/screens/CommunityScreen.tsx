import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Modal, TextInput, Button, SegmentedButtons, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useCommunityStore, CommunityCategory } from '../stores/communityStore';
import { checkContent } from '../utils/contentModeration';
import { modernStyles } from '../styles/modernStyles';

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
      comments: [],
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

  const categories: { label: string, value: CommunityCategory | 'all' }[] = [
    { label: 'すべて', value: 'all' },
    { label: '雑談', value: 'chat' },
    { label: 'ゲーム', value: 'game' },
    { label: '勉強', value: 'study' },
    { label: '進路', value: 'career' },
    { label: '恋愛', value: 'love' },
    { label: 'その他', value: 'other' },
  ];

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  const renderTopic = ({ item }: any) => (
    <TouchableOpacity 
      style={modernStyles.card}
      onPress={() => navigation.navigate('TopicDetail', { topicId: item.id, title: item.title })}
    >
      <View style={styles.topicHeader}>
        <Chip 
          style={[styles.categoryChip, { backgroundColor: COLORS.PRIMARY_LIGHT }]}
          textStyle={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '600' }}
        >
          {getCategoryLabel(item.categoryId)}
        </Chip>
        <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
      </View>
      
      <Text style={modernStyles.headingSecondary}>{item.title}</Text>
      <Text style={[modernStyles.textBody, styles.topicContent]} numberOfLines={2}>
        {item.content}
      </Text>
      
      <View style={styles.topicFooter}>
        <View style={styles.statItem}>
          <IconButton icon="comment-outline" size={16} iconColor={COLORS.TEXT_SECONDARY} style={styles.statIcon} />
          <Text style={styles.statText}>{item.commentCount}</Text>
        </View>
        <View style={styles.statItem}>
          <IconButton icon="account-group-outline" size={16} iconColor={COLORS.TEXT_SECONDARY} style={styles.statIcon} />
          <Text style={styles.statText}>{item.comments?.length || 0}人が参加中</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const pagerRef = React.useRef<ScrollView>(null);
  const categoryScrollRef = React.useRef<ScrollView>(null);
  const tabMeasurements = React.useRef<{ [key: string]: { x: number, width: number } }>({});
  const { width } = Dimensions.get('window');

  // カテゴリ変更時にページャーとタブをスクロール（ボタン押下時のみ）
  React.useEffect(() => {
    const index = categories.findIndex(c => c.value === selectedCategory);
    if (index !== -1 && pagerRef.current) {
      pagerRef.current.scrollTo({ x: index * width, animated: true });
      
      // タブをスクロール
      if (categoryScrollRef.current) {
        const measurement = tabMeasurements.current[selectedCategory];
        if (measurement) {
          const scrollX = measurement.x - width / 2 + measurement.width / 2;
          categoryScrollRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
        }
      }
    }
  }, [selectedCategory, width]);

  const renderCategoryPage = (catValue: CommunityCategory | 'all') => {
    const pageTopics = catValue === 'all' 
      ? displayedTopics 
      : displayedTopics.filter(t => t.categoryId === catValue);

    return (
      <View style={{ width, flex: 1 }}>
        <FlatList
          data={pageTopics}
          renderItem={renderTopic}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          style={{ flex: 1 }}
        />
      </View>
    );
  };

  return (
    <View style={modernStyles.container}>
      <View style={styles.header}>
        <Text style={modernStyles.headingPrimary}>コミュニティ</Text>
        <IconButton icon="magnify" iconColor={COLORS.TEXT_PRIMARY} size={24} onPress={() => {}} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView 
          ref={categoryScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryPill,
                selectedCategory === cat.value && styles.categoryPillActive
              ]}
              onPress={() => setSelectedCategory(cat.value)}
              onLayout={(e) => {
                tabMeasurements.current[cat.value] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
              }}
            >
              <Text style={[
                styles.categoryPillText,
                selectedCategory === cat.value && styles.categoryPillTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollEndDrag={(e) => {
          const currentX = e.nativeEvent.contentOffset.x;
          const currentIndex = categories.findIndex(c => c.value === selectedCategory);
          const startX = currentIndex * width;
          const diff = currentX - startX;
          
          let nextIndex = currentIndex;
          // 画面幅の20%以上スワイプしたらページ移動とみなす
          if (diff > width * 0.2) {
            nextIndex = Math.min(currentIndex + 1, categories.length - 1);
          } else if (diff < -width * 0.2) {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          
          // 状態更新（useEffectでスクロールがトリガーされる）
          if (nextIndex !== currentIndex) {
            setSelectedCategory(categories[nextIndex].value);
          } else {
            // 同じページに戻る場合（スナップバック）
            if (pagerRef.current) {
              pagerRef.current.scrollTo({ x: nextIndex * width, animated: true });
            }
          }
        }}
        style={{ flex: 1 }}
      >
        {categories.map((cat) => (
          <React.Fragment key={cat.value}>
            {renderCategoryPage(cat.value)}
          </React.Fragment>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => setShowCreateModal(true)}
      />

      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalHeader}>
            <Text style={modernStyles.headingSecondary}>トピックを作成</Text>
            <IconButton icon="close" onPress={() => setShowCreateModal(false)} />
          </View>

          {moderationMessage && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{moderationMessage}</Text>
            </View>
          )}

          <TextInput
            label="タイトル"
            value={newTitle}
            onChangeText={(text) => handleInputChange(text, 'title')}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          />

          <TextInput
            label="内容"
            value={newContent}
            onChangeText={(text) => handleInputChange(text, 'content')}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          />

          <Text style={styles.label}>カテゴリー</Text>
          <View style={styles.categorySelect}>
            {categories.filter(c => c.value !== 'all').map((cat) => (
              <Chip
                key={cat.value}
                selected={newCategory === cat.value}
                onPress={() => setNewCategory(cat.value as CommunityCategory)}
                style={[styles.selectChip, newCategory === cat.value && { backgroundColor: COLORS.PRIMARY_LIGHT }]}
                textStyle={{ color: newCategory === cat.value ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY }}
                showSelectedOverlay
              >
                {cat.label}
              </Chip>
            ))}
          </View>

          <Button 
            mode="contained" 
            onPress={handleCreateTopic}
            disabled={!isInputValid || !newTitle.trim() || !newContent.trim()}
            style={[modernStyles.buttonPrimary, { marginTop: 24 }]}
          >
            作成する
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: 'white',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  categoryPillActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  categoryPillTextActive: {
    color: 'white',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryChip: {
    height: 24,
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
  },
  topicContent: {
    marginTop: 4,
    marginBottom: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
    width: 16,
    height: 16,
  },
  statText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 9999,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  categorySelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectChip: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  warningBox: {
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: COLORS.ERROR,
    fontSize: 13,
  },
});
