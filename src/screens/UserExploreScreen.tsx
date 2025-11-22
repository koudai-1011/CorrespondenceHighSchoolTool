import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Chip, Menu, Searchbar, Portal, Modal, SegmentedButtons } from 'react-native-paper';
import { useRegistrationStore } from '../stores/registrationStore';
import { DUMMY_USERS, sortUsers, calculateTagMatches, User } from '../data/dummyUsers';
import UserCard from '../components/UserCard';
import { PREFECTURES, CAREER_PATHS, AGES, COLORS } from '../constants/AppConfig';

type SortType = 'newest' | 'followers' | 'active' | 'match';
type SearchMode = 'similar' | 'ideal' | 'none';

export default function UserExploreScreen({ navigation }: { navigation: any }) {
  const { detailedTags } = useRegistrationStore();
  
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchMode, setSearchMode] = useState<SearchMode>('none');
  const [searchQuery, setSearchQuery] = useState('');
  
  // フィルタ（拡張）
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ドロップダウンメニューの状態
  const [prefectureMenuVisible, setPrefectureMenuVisible] = useState(false);
  const [gradeMenuVisible, setGradeMenuVisible] = useState(false);
  const [ageMenuVisible, setAgeMenuVisible] = useState(false);
  const [careerMenuVisible, setCareerMenuVisible] = useState(false);

  const grades = ['1', '2', '3', '4'];

  // ユーザーリストのフィルタリングとソート
  const filteredAndSortedUsers = useMemo(() => {
    let users = [...DUMMY_USERS];

    // フィルタ適用
    if (selectedPrefecture) {
      users = users.filter(u => u.prefecture === selectedPrefecture);
    }
    if (selectedGrade) {
      users = users.filter(u => u.grade === selectedGrade);
    }
    if (selectedAge) {
      users = users.filter(u => u.age === selectedAge);
    }
    if (selectedCareerPath) {
      users = users.filter(u => u.careerPath === selectedCareerPath);
    }

    // 検索適用
    if (searchMode === 'similar') {
      // 自分と似ている人検索（タグ一致率順）
      return sortUsers(users, 'match', detailedTags);
    } else if (searchMode === 'ideal' && searchQuery) {
      // 条件検索（ニックネームやタグで検索）
      users = users.filter(u => 
        u.nickname.includes(searchQuery) ||
        u.detailedTags.some(tag => tag.name.includes(searchQuery))
      );
    }

    // 通常のソート
    return sortUsers(users, sortBy, detailedTags);
  }, [sortBy, searchMode, searchQuery, selectedPrefecture, selectedGrade, selectedAge, selectedCareerPath, detailedTags]);

  const handleResetFilters = () => {
    setSelectedPrefecture('');
    setSelectedGrade('');
    setSelectedAge('');
    setSelectedCareerPath('');
    setSearchMode('none');
    setSearchQuery('');
  };

  const renderUserCard = ({ item }: { item: User }) => {
    const matchCount = calculateTagMatches(detailedTags, item.detailedTags);
    return (
      <UserCard 
        user={item} 
        matchCount={searchMode === 'similar' || sortBy === 'match' ? matchCount : undefined}
      />
    );
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <div style={{ padding: 16 }}>
        <Text variant="headlineMedium" style={styles.title}>ユーザーを探す</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          気の合う仲間を見つけよう
        </Text>

        {/* 検索バー */}
        <View style={styles.searchContainer}>
          <Button 
            mode={searchMode === 'similar' ? 'contained' : 'outlined'}
            onPress={() => setSearchMode(searchMode === 'similar' ? 'none' : 'similar')}
            style={styles.searchButton}
            compact
          >
            似ている人
          </Button>
          <View style={{ flex: 1 }}>
            <Searchbar
              placeholder="ニックネームやタグで検索"
              value={searchQuery}
              onChangeText={(query) => {
                setSearchQuery(query);
                if (query) setSearchMode('ideal');
                else setSearchMode('none');
              }}
              style={styles.searchBar}
            />
          </View>
        </View>

        {/* 並び替えとフィルタ */}
        <View style={styles.controls}>
          <SegmentedButtons
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortType)}
            buttons={[
              { value: 'newest', label: '新着順' },
              { value: 'active', label: 'アクティブ' },
              { value: 'followers', label: '人気順' },
              { value: 'match', label: '一致率順' },
            ]}
            style={styles.sortButtons}
            density="small"
          />
          <Button 
            mode="outlined" 
            onPress={() => setShowFilterModal(true)}
            style={styles.filterButton}
            icon="filter-variant"
            compact
          >
            フィルタ
            {(selectedPrefecture || selectedGrade || selectedAge || selectedCareerPath) && ' ●'}
          </Button>
        </View>

        {/* アクティブフィルタ表示 */}
        {(selectedPrefecture || selectedGrade || selectedAge || selectedCareerPath || searchMode !== 'none') && (
          <View style={styles.activeFilters}>
            {searchMode === 'similar' && (
              <Chip onClose={() => setSearchMode('none')} style={styles.filterChip}>
                自分と似ている人
              </Chip>
            )}
            {selectedPrefecture && (
              <Chip onClose={() => setSelectedPrefecture('')} style={styles.filterChip}>
                {selectedPrefecture}
              </Chip>
            )}
            {selectedGrade && (
              <Chip onClose={() => setSelectedGrade('')} style={styles.filterChip}>
                {selectedGrade}年生
              </Chip>
            )}
            {selectedAge && (
              <Chip onClose={() => setSelectedAge('')} style={styles.filterChip}>
                {selectedAge}歳
              </Chip>
            )}
            {selectedCareerPath && (
              <Chip onClose={() => setSelectedCareerPath('')} style={styles.filterChip}>
                {selectedCareerPath}
              </Chip>
            )}
            <Button onPress={handleResetFilters} compact>クリア</Button>
          </View>
        )}

        {/* ユーザーリスト */}
        <Text variant="bodyMedium" style={styles.resultCount}>
          {filteredAndSortedUsers.length}人が見つかりました
        </Text>

        <FlatList
          data={filteredAndSortedUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </div>

      {/* フィルタモーダル */}
      <Portal>
        <Modal 
          visible={showFilterModal} 
          onDismiss={() => setShowFilterModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>フィルタ</Text>

          {/* 都道府県フィルタ */}
          <View style={styles.filterRow}>
            <Text variant="titleSmall" style={styles.filterLabel}>都道府県</Text>
            <Menu
              visible={prefectureMenuVisible}
              onDismiss={() => setPrefectureMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setPrefectureMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {selectedPrefecture || 'すべて'}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => { setSelectedPrefecture(''); setPrefectureMenuVisible(false); }} 
                title="すべて" 
              />
              {PREFECTURES.slice(0, 10).map((pref) => (
                <Menu.Item
                  key={pref}
                  onPress={() => { setSelectedPrefecture(pref); setPrefectureMenuVisible(false); }}
                  title={pref}
                />
              ))}
            </Menu>
          </View>

          {/* 学年フィルタ */}
          <View style={styles.filterRow}>
            <Text variant="titleSmall" style={styles.filterLabel}>学年</Text>
            <Menu
              visible={gradeMenuVisible}
              onDismiss={() => setGradeMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setGradeMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {selectedGrade ? `${selectedGrade}年生` : 'すべて'}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => { setSelectedGrade(''); setGradeMenuVisible(false); }} 
                title="すべて" 
              />
              {grades.map((grade) => (
                <Menu.Item
                  key={grade}
                  onPress={() => { setSelectedGrade(grade); setGradeMenuVisible(false); }}
                  title={`${grade}年生`}
                />
              ))}
            </Menu>
          </View>

          {/* 年齢フィルタ */}
          <View style={styles.filterRow}>
            <Text variant="titleSmall" style={styles.filterLabel}>年齢</Text>
            <Menu
              visible={ageMenuVisible}
              onDismiss={() => setAgeMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setAgeMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {selectedAge ? `${selectedAge}歳` : 'すべて'}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => { setSelectedAge(''); setAgeMenuVisible(false); }} 
                title="すべて" 
              />
              {AGES.map((age) => (
                <Menu.Item
                  key={age}
                  onPress={() => { setSelectedAge(age); setAgeMenuVisible(false); }}
                  title={`${age}歳`}
                />
              ))}
            </Menu>
          </View>

          {/* 希望進路フィルタ */}
          <View style={styles.filterRow}>
            <Text variant="titleSmall" style={styles.filterLabel}>希望進路</Text>
            <Menu
              visible={careerMenuVisible}
              onDismiss={() => setCareerMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setCareerMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {selectedCareerPath || 'すべて'}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => { setSelectedCareerPath(''); setCareerMenuVisible(false); }} 
                title="すべて" 
              />
              {CAREER_PATHS.map((path) => (
                <Menu.Item
                  key={path}
                  onPress={() => { setSelectedCareerPath(path); setCareerMenuVisible(false); }}
                  title={path}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.modalActions}>
            <Button onPress={handleResetFilters}>リセット</Button>
            <Button mode="contained" onPress={() => setShowFilterModal(false)}>
              適用
            </Button>
          </View>
        </Modal>
      </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchButton: {
    alignSelf: 'center',
  },
  searchBar: {
    backgroundColor: COLORS.SURFACE,
    elevation: 0,
    borderRadius: 12,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sortButtons: {
    flex: 1,
  },
  filterButton: {
    alignSelf: 'center',
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  resultCount: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  dropdownButton: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  dropdownContent: {
    justifyContent: 'flex-start',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalLabel: {
    marginBottom: 8,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedItem: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    fontWeight: '600',
  },
});
