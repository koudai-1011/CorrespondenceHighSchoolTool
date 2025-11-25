import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Avatar, Chip, FAB, SegmentedButtons, Portal, Modal, TextInput, Button, Dialog, Paragraph, IconButton, Divider } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useRecruitmentStore, RecruitmentCategory, RecruitmentPost } from '../stores/recruitmentStore';
import { useModerationStore } from '../stores/moderationStore';
import { checkContent } from '../utils/contentModeration';
import { modernStyles } from '../styles/modernStyles';

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

  const categories: { label: string, value: RecruitmentCategory | 'all' }[] = [
    { label: 'すべて', value: 'all' },
    { label: 'ゲーム', value: 'game' },
    { label: '勉強', value: 'study' },
    { label: 'イベント', value: 'event' },
    { label: '雑談', value: 'chat' },
    { label: 'その他', value: 'other' },
  ];

  const renderRecruitment = ({ item }: { item: RecruitmentPost }) => {
    const urgent = isUrgent(item);
    const brandNew = isNew(item);

    return (
      <TouchableOpacity 
        style={modernStyles.card}
        onPress={() => navigation.navigate('RecruitmentDetail', { recruitment: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Chip 
              style={[styles.categoryChip, { backgroundColor: COLORS.PRIMARY_LIGHT }]}
              textStyle={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '600' }}
            >
              {getCategoryLabel(item.category)}
            </Chip>
            {urgent && (
              <Chip style={[styles.statusChip, { backgroundColor: '#FFEBEE' }]} textStyle={{ color: COLORS.ERROR, fontSize: 11 }}>
                募集中
              </Chip>
            )}
            {brandNew && (
              <Chip style={[styles.statusChip, { backgroundColor: '#E3F2FD' }]} textStyle={{ color: COLORS.PRIMARY, fontSize: 11 }}>
                NEW
              </Chip>
            )}
          </View>
          <Text style={styles.dateText}>{formatTime(item.eventDate)}</Text>
        </View>

        <Text style={modernStyles.headingSecondary}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconButton icon="map-marker-outline" size={16} iconColor={COLORS.TEXT_SECONDARY} style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <IconButton icon="account-group-outline" size={16} iconColor={COLORS.TEXT_SECONDARY} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {item.currentParticipants.length} / {item.maxParticipants || '∞'} 人
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { fontSize: 14, lineHeight: 20 }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.participantAvatars}>
            {item.currentParticipants.slice(0, 3).map((p, i) => (
              <Avatar.Image 
                key={i} 
                size={24} 
                source={{ uri: `https://picsum.photos/seed/${p}/200` }} 
                style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
              />
            ))}
            {item.currentParticipants.length > 3 && (
              <View style={[styles.miniAvatar, styles.moreAvatar]}>
                <Text style={styles.moreAvatarText}>+{item.currentParticipants.length - 3}</Text>
              </View>
            )}
          </View>
          <Button 
            mode="contained" 
            compact 
            style={modernStyles.buttonPrimary}
            labelStyle={{ fontSize: 12 }}
            onPress={() => navigation.navigate('RecruitmentDetail', { recruitment: item })}
          >
            詳細を見る
          </Button>
        </View>
      </TouchableOpacity>
    );
  };

  const pagerRef = React.useRef<ScrollView>(null);
  const categoryScrollRef = React.useRef<ScrollView>(null);
  const tabMeasurements = React.useRef<{ [key: string]: { x: number, width: number } }>({});
  const { width } = Dimensions.get('window');

  // カテゴリ変更時にページャーとタブをスクロール
  React.useEffect(() => {
    const index = categories.findIndex(c => c.value === filterCategory);
    if (index !== -1 && pagerRef.current) {
      pagerRef.current.scrollTo({ x: index * width, animated: true });
      
      // タブをスクロール
      if (categoryScrollRef.current) {
        const measurement = tabMeasurements.current[filterCategory];
        if (measurement) {
          const scrollX = measurement.x - width / 2 + measurement.width / 2;
          categoryScrollRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
        }
      }
    }
  }, [filterCategory, width]);

  const renderCategoryPage = (catValue: RecruitmentCategory | 'all') => {
    const pageRecruitments = recruitments.filter(rec => 
      catValue === 'all' || rec.category === catValue
    );

    return (
      <View style={{ width, flex: 1 }}>
        <FlatList
          data={pageRecruitments}
          renderItem={renderRecruitment}
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
        <Text style={modernStyles.headingPrimary}>募集掲示板</Text>
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
                filterCategory === cat.value && styles.categoryPillActive
              ]}
              onPress={() => setFilterCategory(cat.value)}
              onLayout={(e) => {
                tabMeasurements.current[cat.value] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
              }}
            >
              <Text style={[
                styles.categoryPillText,
                filterCategory === cat.value && styles.categoryPillTextActive
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
          const currentIndex = categories.findIndex(c => c.value === filterCategory);
          const startX = currentIndex * width;
          const diff = currentX - startX;
          
          let nextIndex = currentIndex;
          if (diff > width * 0.2) {
            nextIndex = Math.min(currentIndex + 1, categories.length - 1);
          } else if (diff < -width * 0.2) {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          
          if (nextIndex !== currentIndex) {
            setFilterCategory(categories[nextIndex].value);
          } else {
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
            <Text style={modernStyles.headingSecondary}>募集を作成</Text>
            <IconButton icon="close" onPress={() => setShowCreateModal(false)} />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
              outlineColor={COLORS.BORDER}
              activeOutlineColor={COLORS.PRIMARY}
            />

            <TextInput
              label="詳細"
              value={description}
              onChangeText={(text) => handleInputChange(text, 'description')}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={COLORS.PRIMARY}
            />

            <TextInput
              label="開催場所"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={COLORS.PRIMARY}
              left={<TextInput.Icon icon="map-marker" />}
            />

            <TextInput
              label="日時 (例: 2023/12/31 19:00)"
              value={dateStr}
              onChangeText={setDateStr}
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={COLORS.PRIMARY}
              left={<TextInput.Icon icon="calendar" />}
            />

            <TextInput
              label="最大参加人数"
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={COLORS.PRIMARY}
              left={<TextInput.Icon icon="account-group" />}
            />

            <Text style={styles.label}>カテゴリー</Text>
            <View style={styles.categorySelect}>
              {categories.filter(c => c.value !== 'all').map((cat) => (
                <Chip
                  key={cat.value}
                  selected={category === cat.value}
                  onPress={() => setCategory(cat.value as RecruitmentCategory)}
                  style={[styles.selectChip, category === cat.value && { backgroundColor: COLORS.PRIMARY_LIGHT }]}
                  textStyle={{ color: category === cat.value ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY }}
                  showSelectedOverlay
                >
                  {cat.label}
                </Chip>
              ))}
            </View>

            <Button 
              mode="contained" 
              onPress={handleCreateRecruitment}
              disabled={!isInputValid || !title || !description || !location || !dateStr}
              style={[modernStyles.buttonPrimary, { marginTop: 24 }]}
            >
              募集する
            </Button>
          </ScrollView>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    height: 24,
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: 4,
    width: 16,
    height: 16,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  description: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  participantAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    borderWidth: 2,
    borderColor: 'white',
  },
  moreAvatar: {
    backgroundColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  moreAvatarText: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
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
    maxHeight: '90%',
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
    marginBottom: 16,
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
