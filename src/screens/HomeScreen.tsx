import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, Card, Avatar, IconButton, FAB, SegmentedButtons, Portal, Modal, TextInput, Button, Chip } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useTimelineStore, PostVisibility } from '../stores/timelineStore';
import { DUMMY_USERS } from '../data/dummyUsers';
import { checkContent } from '../utils/contentModeration';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { posts, addPost, likePost, unlikePost } = useTimelineStore();
  const [feedType, setFeedType] = useState<'recommended' | 'following'>('recommended');
  
  // 投稿作成用State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null); // 画像URL
  const [visibility, setVisibility] = useState<PostVisibility>('public');

  // コメント用State
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  // リアルタイムNGワードチェック
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (text: string) => {
    setNewPostContent(text);
    if (text.length > 0) {
      const result = checkContent(text);
      setModerationMessage(result.message || null);
      setIsInputValid(result.isValid);
    } else {
      setModerationMessage(null);
      setIsInputValid(true);
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !isInputValid) {
      return;
    }

    addPost({
      userId: 'user1',
      content: newPostContent,
      images: newPostImage ? [newPostImage] : undefined,
      visibility,
    });

    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPostContent('');
    setNewPostImage(null);
    setVisibility('public');
    setModerationMessage(null);
    setIsInputValid(true);
  };

  const handleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post?.likes.includes('user1')) {
      unlikePost(postId, 'user1');
    } else {
      likePost(postId, 'user1');
    }
  };

  const handleCommentPress = (postId: string) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  const handleSubmitComment = () => {
    if (!selectedPostId || !commentContent.trim()) return;

    // ここでコメント追加アクションを呼び出す（timelineStoreに追加が必要）
    // 今回は簡易的にalertのみ（storeにaddCommentToPostはあるが、ここでは省略）
    // 実際には: addCommentToPost(selectedPostId, { userId: 'user1', content: commentContent });
    
    const { addCommentToPost } = useTimelineStore.getState();
    addCommentToPost(selectedPostId, {
      userId: 'user1',
      content: commentContent,
    });

    setCommentContent('');
    setShowCommentModal(false);
  };

  const filteredPosts = feedType === 'recommended' 
    ? posts.filter(p => p.visibility === 'public')
    : posts; // フォロー中は全投稿（簡易実装）

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}分前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
    return `${Math.floor(diff / 1440)}日前`;
  };

  const getVisibilityLabel = (vis: PostVisibility) => {
    switch (vis) {
      case 'public': return '公開';
      case 'followers': return 'フォロワー';
      case 'close_friends': return '親しい友達';
    }
  };

  const getVisibilityIcon = (vis: PostVisibility) => {
    switch (vis) {
      case 'public': return 'earth';
      case 'followers': return 'account-group';
      case 'close_friends': return 'account-heart';
    }
  };

  const renderPost = ({ item }: any) => {
    const author = DUMMY_USERS.find(u => u.id === item.userId);
    const isLiked = item.likes.includes('user1');

    return (
      <Card style={styles.postCard}>
        <Card.Content>
          <View style={styles.postHeader}>
            <Avatar.Icon 
              size={40} 
              icon="account" 
              style={{ backgroundColor: author?.themeColor || COLORS.PRIMARY_LIGHT }} 
            />
            <TouchableOpacity 
              style={styles.postHeaderText}
              onPress={() => navigation.navigate('UserDetail', { user: author })}
            >
              <Text variant="titleSmall" style={styles.userName}>{author?.nickname || 'Unknown'}</Text>
              <View style={styles.postMeta}>
                <Text variant="bodySmall" style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
                <IconButton 
                  icon={getVisibilityIcon(item.visibility)} 
                  size={12} 
                  style={styles.visibilityIcon} 
                />
                <Text variant="bodySmall" style={styles.visibility}>{getVisibilityLabel(item.visibility)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text variant="bodyMedium" style={styles.postContent}>{item.content}</Text>

          {item.images && item.images.length > 0 && (
            <Image 
              source={{ uri: item.images[0] }} 
              style={styles.postImage} 
              resizeMode="cover" 
            />
          )}

          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <IconButton 
                icon={isLiked ? 'heart' : 'heart-outline'} 
                size={20} 
                iconColor={isLiked ? '#E91E63' : COLORS.TEXT_SECONDARY}
                style={{ margin: 0 }}
              />
              <Text style={[styles.actionText, isLiked && { color: '#E91E63' }]}>
                {item.likes.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleCommentPress(item.id)}
            >
              <IconButton icon="comment-outline" size={20} iconColor={COLORS.TEXT_SECONDARY} style={{ margin: 0 }} />
              <Text style={styles.actionText}>{item.comments.length}</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.BACKGROUND, position: 'relative' }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text variant="headlineMedium" style={styles.pageTitle}>ホーム</Text>
        <Text variant="bodyMedium" style={styles.pageSubtitle}>
          みんなの投稿をチェックしよう
        </Text>

        <SegmentedButtons
          value={feedType}
          onValueChange={(value) => setFeedType(value as 'recommended' | 'following')}
          buttons={[
            { value: 'recommended', label: 'おすすめ', icon: 'star' },
            { value: 'following', label: 'フォロー中', icon: 'account-group' },
          ]}
          style={styles.filter}
        />
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 100 }}
        style={{ flex: 1 }}
      />

      <FAB
        icon="pencil"
        label="投稿"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      />

        <Portal>
          <Modal
            visible={showCreateModal}
            onDismiss={() => setShowCreateModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>新しい投稿</Text>

            {moderationMessage && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>{moderationMessage}</Text>
              </View>
            )}

            <TextInput
              label="いまどうしてる？"
              value={newPostContent}
              onChangeText={handleInputChange}
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.input}
              error={!isInputValid}
            />

            {/* 画像追加ボタン（ダミー） */}
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={() => setNewPostImage('https://picsum.photos/400/300')} // ダミー画像
            >
              <IconButton icon="image" size={24} />
              <Text>{newPostImage ? '画像を変更' : '画像を追加'}</Text>
            </TouchableOpacity>

            {newPostImage && (
              <Image source={{ uri: newPostImage }} style={styles.previewImage} />
            )}

            <Text style={styles.label}>公開範囲</Text>
            <SegmentedButtons
              value={visibility}
              onValueChange={(value) => setVisibility(value as PostVisibility)}
              buttons={[
                { value: 'public', label: '公開', icon: 'earth' },
                { value: 'followers', label: 'フォロワー', icon: 'account-group' },
              ]}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button onPress={() => setShowCreateModal(false)}>キャンセル</Button>
              <Button 
                mode="contained" 
                onPress={handleCreatePost}
                disabled={!isInputValid}
              >
                投稿
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* コメントモーダル */}
        <Portal>
          <Modal
            visible={showCommentModal}
            onDismiss={() => setShowCommentModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>コメントする</Text>
            <TextInput
              label="コメントを入力"
              value={commentContent}
              onChangeText={setCommentContent}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button onPress={() => setShowCommentModal(false)}>キャンセル</Button>
              <Button mode="contained" onPress={handleSubmitComment} disabled={!commentContent.trim()}>
                送信
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
    marginBottom: 16,
  },
  postCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  postHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontWeight: '600',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    color: COLORS.TEXT_TERTIARY,
  },
  visibilityIcon: {
    margin: 0,
    marginLeft: 8,
    width: 16,
    height: 16,
  },
  visibility: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 12,
  },
  postContent: {
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
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
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
});
