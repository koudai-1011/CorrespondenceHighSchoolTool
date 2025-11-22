import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Searchbar, Chip, Card, SegmentedButtons, FAB } from 'react-native-paper';
import { useGroupStore, Group } from '../stores/groupStore';
import { COLORS } from '../constants/AppConfig';
import { DUMMY_USERS } from '../data/dummyUsers';
import { SUGGESTIONS } from '../data/tagData';

export default function GroupSearchScreen({ navigation }: { navigation: any }) {
  const { groups } = useGroupStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' | 'tag'
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 検索ロジック
  const filteredGroups = groups.filter(g => {
    if (g.isDeleted) return false;

    if (searchType === 'name') {
      return g.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // タグ検索
      if (selectedTag) {
        return g.tags.includes(selectedTag);
      }
      // 検索バー入力でのタグ検索もサポート（タグ選択していない場合）
      if (searchQuery) {
        return g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    }
  });

  const renderGroupItem = ({ item }: { item: Group }) => {
    const creator = DUMMY_USERS.find(u => u.id === item.creatorId);
    const creatorName = creator ? creator.nickname : '不明なユーザー';

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.groupIcon} />
            ) : (
              <View style={[styles.groupIcon, { backgroundColor: COLORS.PRIMARY, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.infoContainer}>
              <Text variant="titleMedium" style={styles.groupName}>{item.name}</Text>
              <Text variant="bodySmall" style={styles.creatorName}>代表: {creatorName}</Text>
              <View style={styles.tagContainer}>
                {item.tags.map((tag, index) => (
                  <Chip key={index} compact style={styles.tag} textStyle={{ fontSize: 10, marginVertical: 0, marginHorizontal: 4 }}>{tag}</Chip>
                ))}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // フラットなタグリストを作成（重複排除）
  const allTags = Array.from(new Set(Object.values(SUGGESTIONS).flat().map(t => t.name)));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SegmentedButtons
          value={searchType}
          onValueChange={setSearchType}
          buttons={[
            { value: 'name', label: '名前で検索' },
            { value: 'tag', label: 'タグで検索' },
          ]}
          style={{ marginBottom: 12 }}
        />

        {searchType === 'name' ? (
          <Searchbar
            placeholder="グループ名を検索"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        ) : (
          <View>
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>人気のタグから探す</Text>
            <FlatList
              horizontal
              data={allTags.slice(0, 20)} // 簡易的に表示
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Chip
                  selected={selectedTag === item}
                  onPress={() => setSelectedTag(selectedTag === item ? null : item)}
                  style={{ marginRight: 8 }}
                  showSelectedOverlay
                >
                  {item}
                </Chip>
              )}
              style={{ marginBottom: 8 }}
            />
            {!selectedTag && (
              <Searchbar
                placeholder="タグ名を入力して検索"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filteredGroups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: COLORS.TEXT_SECONDARY }}>条件に一致するグループは見つかりませんでした</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        label="グループを作成"
        style={styles.fab}
        onPress={() => navigation.navigate('GroupCreate')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  groupName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  creatorName: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    height: 24,
    backgroundColor: '#f0f0f0',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.PRIMARY,
  },
});
