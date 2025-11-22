import React from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, Button, Chip, Avatar, List, Divider, IconButton } from 'react-native-paper';
import { useGroupStore } from '../stores/groupStore';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';
import { DUMMY_USERS } from '../data/dummyUsers';

export default function GroupDetailScreen({ route, navigation }: { route: any, navigation: any }) {
  const { groupId } = route.params;
  const { groups, joinGroup, leaveGroup, approveMember, rejectMember, addAdmin, removeAdmin } = useGroupStore();
  const { userId } = useRegistrationStore();
  
  const group = groups.find(g => g.id === groupId);

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>グループが見つかりません</Text>
      </View>
    );
  }

  const isMember = group.memberIds.includes(userId);
  const isPending = group.pendingMemberIds.includes(userId);
  const isAdmin = group.adminIds.includes(userId);
  const creator = DUMMY_USERS.find(u => u.id === group.creatorId);

  const handleJoin = () => {
    if (group.joinType === 'approval') {
      Alert.alert('申請', 'グループへの参加を申請しますか？', [
        { text: 'キャンセル', style: 'cancel' },
        { text: '申請する', onPress: () => joinGroup(groupId, userId) }
      ]);
    } else {
      Alert.alert('参加', 'グループに参加しますか？', [
        { text: 'キャンセル', style: 'cancel' },
        { text: '参加する', onPress: () => joinGroup(groupId, userId) }
      ]);
    }
  };

  const handleLeave = () => {
    Alert.alert('退会', '本当に退会しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '退会する', style: 'destructive', onPress: () => {
        leaveGroup(groupId, userId);
        navigation.goBack();
      }}
    ]);
  };

  // メンバーリストのレンダリング用データ
  const members = group.memberIds.map(id => {
    const user = DUMMY_USERS.find(u => u.id === id);
    if (!user) return null;
    return { ...user, isAdmin: group.adminIds.includes(id), isCreator: group.creatorId === id };
  }).filter((u): u is NonNullable<typeof u> => u !== null);

  const pendingMembers = group.pendingMemberIds.map(id => DUMMY_USERS.find(u => u.id === id)).filter((u): u is NonNullable<typeof u> => u !== undefined);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {group.imageUrl ? (
          <Image source={{ uri: group.imageUrl }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: COLORS.PRIMARY, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>{group.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>{group.name}</Text>
          <Text variant="bodyMedium" style={styles.creator}>代表: {creator?.nickname || '不明'}</Text>
          
          <View style={styles.tags}>
            {group.tags.map(tag => (
              <Chip key={tag} style={styles.tag} compact>{tag}</Chip>
            ))}
          </View>

          <Text style={styles.description}>{group.description}</Text>

          <View style={styles.actionButtonContainer}>
            {isMember ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button mode="contained" onPress={() => Alert.alert('チャット', 'チャット画面へ遷移します（未実装）')} style={{ flex: 1 }}>
                  チャットを開く
                </Button>
                <Button mode="outlined" onPress={handleLeave} textColor={COLORS.ERROR}>
                  退会
                </Button>
              </View>
            ) : isPending ? (
              <Button mode="contained" disabled>承認待ち</Button>
            ) : (
              <Button mode="contained" onPress={handleJoin}>
                {group.joinType === 'approval' ? '参加を申請する' : '参加する'}
              </Button>
            )}
          </View>
        </View>
      </View>

      {isAdmin && pendingMembers.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>承認待ち ({pendingMembers.length})</Text>
          {pendingMembers.map((member) => (
            <List.Item
              key={member.id}
              title={member.nickname}
              left={props => <Avatar.Image {...props} size={40} source={{ uri: member.profileImageUrl }} />}
              right={props => (
                <View style={{ flexDirection: 'row' }}>
                  <IconButton icon="check" iconColor={COLORS.PRIMARY} onPress={() => approveMember(groupId, member.id)} />
                  <IconButton icon="close" iconColor={COLORS.ERROR} onPress={() => rejectMember(groupId, member.id)} />
                </View>
              )}
            />
          ))}
          <Divider />
        </View>
      )}

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>メンバー ({members.length})</Text>
        {members.map((member) => (
          <List.Item
            key={member.id}
            title={member.nickname}
            description={member.isAdmin ? (member.isCreator ? '代表' : '管理者') : 'メンバー'}
            left={props => <Avatar.Image {...props} size={40} source={{ uri: member.profileImageUrl }} />}
            right={props => isAdmin && member.id !== userId && !member.isCreator ? (
              <IconButton icon="dots-vertical" onPress={() => {
                Alert.alert('メンバー管理', `${member.nickname}への操作`, [
                  { 
                    text: member.isAdmin ? '管理者権限を剥奪' : '管理者権限を付与', 
                    onPress: () => member.isAdmin ? removeAdmin(groupId, member.id) : addAdmin(groupId, member.id) 
                  },
                  { text: 'キャンセル', style: 'cancel' }
                ]);
              }} />
            ) : null}
          />
        ))}
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  headerContent: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creator: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f0f0',
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  actionButtonContainer: {
    marginTop: 8,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
