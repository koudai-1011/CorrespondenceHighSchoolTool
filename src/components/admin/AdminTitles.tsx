import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Chip, Avatar, IconButton, Portal, Dialog, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';
import { useTitleStore } from '../../stores/titleStore';
import { useUserDatabaseStore } from '../../stores/userDatabaseStore';

export const AdminTitles: React.FC = () => {
  const { availableTitles, createTitle, deleteTitle, updateTitle, grantTitleToUser, revokeTitleFromUser, getTitleHolders } = useTitleStore();
  const { users } = useUserDatabaseStore();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<any>(null);
  
  // Form state
  const [titleName, setTitleName] = useState('');
  const [titleDescription, setTitleDescription] = useState('');
  const [titleColor, setTitleColor] = useState('#4CAF50');
  
  const colorOptions = [
    { label: '緑', value: '#4CAF50' },
    { label: '青', value: '#2196F3' },
    { label: 'オレンジ', value: '#FF9800' },
    { label: '紫', value: '#9C27B0' },
    { label: '赤', value: '#F44336' },
    { label: 'ピンク', value: '#E91E63' },
  ];
  
  const openCreateDialog = () => {
    setTitleName('');
    setTitleDescription('');
    setTitleColor('#4CAF50');
    setShowCreateDialog(true);
  };
  
  const openEditDialog = (title: any) => {
    setSelectedTitle(title);
    setTitleName(title.name);
    setTitleDescription(title.description);
    setTitleColor(title.iconColor);
    setShowEditDialog(true);
  };
  
  const handleCreateTitle = () => {
    if (!titleName || !titleDescription) {
      alert('タイトルと説明を入力してください');
      return;
    }
    createTitle({
      name: titleName,
      description: titleDescription,
      iconColor: titleColor,
    });
    setShowCreateDialog(false);
  };
  
  const handleUpdateTitle = () => {
    if (!selectedTitle) return;
    updateTitle(selectedTitle.id, {
      name: titleName,
      description: titleDescription,
      iconColor: titleColor,
    });
    setShowEditDialog(false);
  };
  
  const handleDeleteTitle = (titleId: string) => {
    if (confirm('この称号を削除しますか？所持しているユーザーからも削除されます。')) {
      deleteTitle(titleId);
    }
  };
  
  const openGrantDialog = (title: any) => {
    setSelectedTitle(title);
    setShowGrantDialog(true);
  };
  
  const handleToggleTitleForUser = (userId: string, titleId: string) => {
    const holders = getTitleHolders(titleId);
    if (holders.includes(userId)) {
      revokeTitleFromUser(userId, titleId);
    } else {
      grantTitleToUser(userId, titleId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.sectionTitle}>称号管理</Text>
        <Button mode="contained" onPress={openCreateDialog} icon="plus">
          新規作成
        </Button>
      </View>
      
      <Text variant="bodySmall" style={{ marginBottom: 16 }}>
        全 {availableTitles.length} 件の称号が登録されています
      </Text>

      {/* Title List */}
      <View style={styles.titleList}>
        {availableTitles.map((title) => {
          const holders = getTitleHolders(title.id);
          return (
            <Card key={title.id} style={styles.titleCard}>
              <Card.Content>
                <View style={styles.titleHeader}>
                  <View style={styles.titleInfo}>
                    <Avatar.Icon 
                      size={40} 
                      icon="trophy" 
                      style={{ backgroundColor: title.iconColor }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text variant="titleMedium">{title.name}</Text>
                      <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                        {title.description}
                      </Text>
                      <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY, marginTop: 4 }}>
                        所持ユーザー: {holders.length}人
                      </Text>
                    </View>
                  </View>
                  <View style={styles.titleActions}>
                    <IconButton icon="account-multiple" size={20} onPress={() => openGrantDialog(title)} />
                    <IconButton icon="pencil" size={20} onPress={() => openEditDialog(title)} />
                    <IconButton icon="delete" size={20} onPress={() => handleDeleteTitle(title.id)} />
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </View>

      {/* Create Dialog */}
      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>新規称号作成</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="称号名"
              value={titleName}
              onChangeText={setTitleName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="説明"
              value={titleDescription}
              onChangeText={setTitleDescription}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.dialogInput}
            />
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>アイコンカラー</Text>
            <View style={styles.colorPicker}>
              {colorOptions.map((color) => (
                <Chip
                  key={color.value}
                  selected={titleColor === color.value}
                  onPress={() => setTitleColor(color.value)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  avatar={<Avatar.Icon size={24} icon="circle" style={{ backgroundColor: color.value }} />}
                >
                  {color.label}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>キャンセル</Button>
            <Button onPress={handleCreateTitle} mode="contained">作成</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>称号編集: {selectedTitle?.name}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="称号名"
              value={titleName}
              onChangeText={setTitleName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="説明"
              value={titleDescription}
              onChangeText={setTitleDescription}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.dialogInput}
            />
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>アイコンカラー</Text>
            <View style={styles.colorPicker}>
              {colorOptions.map((color) => (
                <Chip
                  key={color.value}
                  selected={titleColor === color.value}
                  onPress={() => setTitleColor(color.value)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  avatar={<Avatar.Icon size={24} icon="circle" style={{ backgroundColor: color.value }} />}
                >
                  {color.label}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>キャンセル</Button>
            <Button onPress={handleUpdateTitle} mode="contained">更新</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Grant/Revoke Dialog */}
      <Portal>
        <Dialog visible={showGrantDialog} onDismiss={() => setShowGrantDialog(false)}>
          <Dialog.Title>称号付与: {selectedTitle?.name}</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
              {users.map((user) => {
                const hasTitle = selectedTitle ? getTitleHolders(selectedTitle.id).includes(user.id) : false;
                return (
                  <Card key={user.id} style={styles.userCard}>
                    <Card.Content style={styles.userCardContent}>
                      <View style={styles.userInfo}>
                        <Avatar.Text 
                          size={32} 
                          label={user.nickname.substring(0, 1)} 
                          style={{ backgroundColor: user.themeColor || COLORS.PRIMARY }}
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                          <Text variant="bodyMedium">{user.nickname}</Text>
                          <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                            ID: {user.id}
                          </Text>
                        </View>
                      </View>
                      <Button
                        mode={hasTitle ? 'contained' : 'outlined'}
                        compact
                        onPress={() => handleToggleTitleForUser(user.id, selectedTitle!.id)}
                      >
                        {hasTitle ? '剥奪' : '付与'}
                      </Button>
                    </Card.Content>
                  </Card>
                );
              })}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowGrantDialog(false)}>閉じる</Button>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  titleList: {
    gap: 12,
  },
  titleCard: {
    backgroundColor: 'white',
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleActions: {
    flexDirection: 'row',
  },
  dialogInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userCard: {
    backgroundColor: 'white',
    marginBottom: 8,
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
});
