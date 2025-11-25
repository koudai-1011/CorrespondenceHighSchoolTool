import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Chip, Avatar, IconButton, Portal, Dialog, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';
import { useUserDatabaseStore } from '../../stores/userDatabaseStore';
import { User } from '../../types/user';

export const AdminUserDatabase: React.FC = () => {
  const { 
    users, 
    searchQuery, 
    setSearchQuery, 
    filterGrade, 
    setFilterGrade, 
    getFilteredUsers,
    updateUser,
    deleteUser
  } = useUserDatabaseStore();

  const filteredUsers = getFilteredUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Edit Form State
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSchool, setEditSchool] = useState('');

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditNickname(user.nickname);
    setEditBio(user.bio || '');
    setEditSchool(user.schoolName || '');
    setShowEditDialog(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, {
        nickname: editNickname,
        bio: editBio,
        schoolName: editSchool,
      });
      setShowEditDialog(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('本当にこのユーザーを削除しますか？')) {
      deleteUser(userId);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>ユーザーデータベース</Text>
      
      {/* Search & Filter */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <TextInput
            label="ユーザー検索 (ID, 名前, 自己紹介)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            left={<TextInput.Icon icon="magnify" />}
            style={styles.searchInput}
          />
          <View style={styles.filterRow}>
            <Text variant="bodyMedium" style={{ marginRight: 8 }}>学年フィルタ:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['1', '2', '3', '4'].map(grade => (
                <Chip
                  key={grade}
                  selected={filterGrade === grade}
                  onPress={() => setFilterGrade(filterGrade === grade ? null : grade)}
                  style={styles.filterChip}
                  showSelectedOverlay
                >
                  {grade}年
                </Chip>
              ))}
            </ScrollView>
          </View>
        </Card.Content>
      </Card>

      <Text variant="bodySmall" style={{ marginBottom: 8 }}>
        該当件数: {filteredUsers.length}件 / 全{users.length}件
      </Text>

      {/* User List */}
      <View style={styles.userList}>
        {filteredUsers.map((user) => (
          <Card key={user.id} style={styles.userCard} onPress={() => openEditDialog(user)}>
            <Card.Content style={styles.userCardContent}>
              <View style={styles.userInfo}>
                <Avatar.Text 
                  size={40} 
                  label={user.nickname.substring(0, 1)} 
                  style={{ backgroundColor: user.themeColor || COLORS.PRIMARY }}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text variant="titleMedium" numberOfLines={1}>{user.nickname}</Text>
                  <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                    ID: {user.id} / {user.schoolName} / {user.grade}年
                  </Text>
                </View>
              </View>
              <IconButton icon="pencil" size={20} onPress={() => openEditDialog(user)} />
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>ユーザー編集: {selectedUser?.nickname}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="ニックネーム"
              value={editNickname}
              onChangeText={setEditNickname}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="学校名"
              value={editSchool}
              onChangeText={setEditSchool}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="自己紹介"
              value={editBio}
              onChangeText={setEditBio}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>キャンセル</Button>
            <Button onPress={handleSaveUser} mode="contained">保存</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  filterCard: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: 8,
  },
  userList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: 'white',
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dialogInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
});
