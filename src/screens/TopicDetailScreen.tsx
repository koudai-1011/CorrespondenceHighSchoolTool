import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Avatar, TextInput, Button, IconButton, Divider } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useCommunityStore, CommunityCategory } from '../stores/communityStore';
import { DUMMY_USERS } from '../data/dummyUsers';
import { checkContent } from '../utils/contentModeration';

export default function TopicDetailScreen({ route }: { route: any }) {
  const { topicId } = route.params;
  const { topics, comments, addComment, getCommentsByTopicId, incrementViewCount } = useCommunityStore();
  
  const topic = topics.find(t => t.id === topicId);
  const [topicComments, setTopicComments] = useState(getCommentsByTopicId(topicId));
  const [newComment, setNewComment] = useState('');

  // リアルタイムNGワードチェック
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  useEffect(() => {
    if (topic) {
      incrementViewCount(topicId);
    }
  }, [topicId]);

  useEffect(() => {
    setTopicComments(getCommentsByTopicId(topicId));
  }, [comments]);

  const handleInputChange = (text: string) => {
    setNewComment(text);
    if (text.length > 0) {
      const result = checkContent(text);
      setModerationMessage(result.message || null);
      setIsInputValid(result.isValid);
    } else {
      setModerationMessage(null);
      setIsInputValid(true);
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !isInputValid) {
      return;
    }

    addComment({
      topicId,
      authorId: 'user1',
      content: newComment,
    });

    setNewComment('');
    setModerationMessage(null);
    setIsInputValid(true);
  };

  if (!topic) {
    return (
      <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
        <View style={styles.container}>
          <Text>トピックが見つかりません</Text>
        </View>
      </div>
    );
  }

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

  const author = DUMMY_USERS.find(u => u.id === topic.authorId);

  const renderComment = ({ item }: any) => {
    const commentAuthor = DUMMY_USERS.find(u => u.id === item.authorId);
    return (
      <View style={styles.commentItem}>
        <Avatar.Icon 
          size={36} 
          icon="account" 
          style={{ backgroundColor: commentAuthor?.themeColor || COLORS.PRIMARY_LIGHT }} 
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text variant="bodyMedium" style={styles.commentAuthor}>
              {commentAuthor?.nickname || 'Unknown'}
            </Text>
            <Text variant="bodySmall" style={styles.commentTime}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
          <Text variant="bodyMedium" style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* トピック詳細 */}
          <Card style={styles.topicCard}>
            <Card.Content>
              <View style={styles.categoryChip}>
                <Text 
                  style={{ 
                    backgroundColor: getCategoryColor(topic.categoryId), 
                    color: 'white', 
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 16,
                    fontSize: 12,
                  }}
                >
                  {getCategoryLabel(topic.categoryId)}
                </Text>
              </View>
              
              <Text variant="headlineSmall" style={styles.topicTitle}>{topic.title}</Text>

              <View style={styles.authorSection}>
                <Avatar.Icon 
                  size={32} 
                  icon="account" 
                  style={{ backgroundColor: author?.themeColor || COLORS.PRIMARY_LIGHT, marginRight: 8 }} 
                />
                <View>
                  <Text variant="bodyMedium">{author?.nickname || 'Unknown'}</Text>
                  <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY }}>
                    {formatTime(topic.createdAt)}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text variant="bodyLarge" style={styles.topicContent}>{topic.content}</Text>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <IconButton icon="eye" size={16} style={styles.statIcon} />
                  <Text variant="bodySmall">{topic.viewCount} 閲覧</Text>
                </View>
                <View style={styles.statItem}>
                  <IconButton icon="comment" size={16} style={styles.statIcon} />
                  <Text variant="bodySmall">{topic.commentCount} コメント</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* コメント一覧 */}
          <Text variant="titleMedium" style={styles.commentsTitle}>コメント ({topicComments.length})</Text>
          {topicComments.map((comment) => (
            <View key={comment.id}>
              {renderComment({ item: comment })}
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* コメント入力欄 */}
        <View style={styles.inputContainer}>
          {moderationMessage && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{moderationMessage}</Text>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              mode="outlined"
              value={newComment}
              onChangeText={handleInputChange}
              placeholder="コメントを入力"
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor="transparent"
              error={!isInputValid}
              multiline
            />
            <IconButton
              icon="send"
              mode="contained"
              containerColor={COLORS.PRIMARY}
              iconColor="white"
              size={24}
              onPress={handlePostComment}
              disabled={!newComment.trim() || !isInputValid}
            />
          </View>
        </View>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topicCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  topicTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  topicContent: {
    lineHeight: 26,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
    width: 20,
    height: 20,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: '600',
  },
  commentTime: {
    color: COLORS.TEXT_TERTIARY,
  },
  commentText: {
    lineHeight: 20,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: COLORS.BACKGROUND,
  },
  warningBox: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderTopWidth: 1,
    borderTopColor: '#FFCDD2',
  },
  warningText: {
    color: '#D32F2F',
    fontSize: 12,
  },
});
