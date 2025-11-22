import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, FAB, Card, Chip, Badge, Button } from 'react-native-paper';
import { useGroupStore, Group } from '../stores/groupStore';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';
import { DUMMY_USERS } from '../data/dummyUsers';

export default function GroupListScreen({ navigation }: { navigation: any }) {
  const { groups, checkAutoDeletion } = useGroupStore();
  const { userId } = useRegistrationStore();

  useEffect(() => {
    checkAutoDeletion();
  }, []);

  // 自分が参加しているグループ（削除されていないもの）
  const myGroups = groups.filter(g => 
    !g.isDeleted && g.memberIds.includes(userId)
  );

  const renderGroupItem = ({ item }: { item: Group }) => {
    const creator = DUMMY_USERS.find(u => u.id === item.creatorId);
    const creatorName = creator ? creator.nickname : '不明なユーザー';
    
    // 通知バッジ（承認待ちがある場合など、管理者に表示）
    const hasNotification = item.adminIds.includes(userId) && item.pendingMemberIds.length > 0;

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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="titleMedium" style={styles.groupName}>{item.name}</Text>
                {hasNotification && <Badge size={8} style={{ alignSelf: 'flex-start' }} />}
              </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button 
          mode="outlined" 
          icon="magnify" 
          onPress={() => navigation.navigate('GroupSearch')}
          style={styles.searchButton}
        >
          グループを探す
        </Button>
      </View>

      <FlatList
        data={myGroups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.TEXT_SECONDARY }}>参加しているグループはありません</Text>
            <Text variant="bodySmall" style={{ marginTop: 8, color: COLORS.TEXT_SECONDARY }}>新しいグループを探すか、作成してみましょう！</Text>
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
  searchButton: {
    width: '100%',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
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
