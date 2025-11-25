import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, TextInput, IconButton, Avatar, Menu, Portal, Dialog, Button, RadioButton, Surface } from 'react-native-paper';
import { getChatMessages } from '../data/dummyChat';
import { COLORS } from '../constants/AppConfig';
import { useModerationStore } from '../stores/moderationStore';
import { checkContent } from '../utils/contentModeration';

// LINE風の日付フォーマット
const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '今日';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨日';
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function ChatScreen({ route, navigation }: { route: any, navigation: any }) {
  const { partnerId, partner } = route.params;
  // メッセージに replyToId と isDeleted を追加するために型拡張が必要ですが、
  // ここでは既存のデータ構造に動的に追加する形で扱います。
  const [messages, setMessages] = useState(getChatMessages('user1', partnerId).map(m => ({
    ...m,
    replyToId: undefined as string | undefined,
    isDeleted: false as boolean
  })));
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // 通報・ブロック・メニュー用state
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [blockDialogVisible, setBlockDialogVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('inappropriate');
  
  // リプライ用state
  const [replyingTo, setReplyingTo] = useState<any | null>(null);

  // リアルタイムNGワードチェック
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      const result = checkContent(text);
      setModerationMessage(result.message || null);
      setIsInputValid(result.isValid);
    } else {
      setModerationMessage(null);
      setIsInputValid(true);
    }
  };
  
  const { addReport, blockUser } = useModerationStore();

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    // 自動モデレーションチェック
    const moderationResult = checkContent(inputText);
    if (!moderationResult.isValid) {
      Alert.alert(
        '投稿できません',
        moderationResult.message || '不適切な表現が含まれています。',
        [{ text: 'OK' }]
      );
      return;
    }

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 'user1',
      receiverId: partnerId,
      content: inputText,
      timestamp: new Date(),
      read: false,
      replyToId: replyingTo?.id,
      isDeleted: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setReplyingTo(null);
    
    // スクロール
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      '送信取り消し',
      'このメッセージの送信を取り消しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '取り消す', 
          style: 'destructive',
          onPress: () => {
            setMessages(messages.map(m => 
              m.id === messageId ? { ...m, isDeleted: true } : m
            ));
            setVisibleMenuId(null);
          }
        }
      ]
    );
  };

  const handleReport = () => {
    if (selectedMessageId) {
      addReport({
        reporterId: 'user1',
        targetId: selectedMessageId,
        targetType: 'MESSAGE',
        reason: reportReason,
        details: `Message from ${partnerId}`,
      });
      setReportDialogVisible(false);
      setVisibleMenuId(null);
      alert('通報を受け付けました');
    }
  };

  const handleBlock = () => {
    blockUser('user1', partnerId);
    setBlockDialogVisible(false);
    setVisibleMenuId(null);
    alert(`${partner.nickname}さんをブロックしました`);
    navigation.goBack();
  };

  // 日付区切りを入れたリストを作成
  const getFormattedMessages = () => {
    const formatted: any[] = [];
    let lastDate = '';

    messages.forEach(message => {
      const messageDate = formatDate(message.timestamp);
      if (messageDate !== lastDate) {
        formatted.push({ type: 'date', date: messageDate, id: `date-${messageDate}` });
        lastDate = messageDate;
      }
      formatted.push({ type: 'message', ...message });
    });

    return formatted;
  };

  const renderMessage = ({ item }: { item: any }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Surface style={styles.dateChip} elevation={0}>
            <Text style={styles.dateText}>{item.date}</Text>
          </Surface>
        </View>
      );
    }

    const isMyMessage = item.senderId === 'user1';
    const replyTarget = item.replyToId ? messages.find(m => m.id === item.replyToId) : null;

    if (item.isDeleted) {
      return (
        <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.partnerMessageRow]}>
          <Text style={styles.deletedText}>メッセージの送信を取り消しました</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.partnerMessageRow]}>
        {!isMyMessage && (
          <Avatar.Image
            size={36}
            source={{ uri: partner.profileImageUrl || 'https://via.placeholder.com/36' }}
            style={styles.avatar}
          />
        )}
        
        <View style={[styles.bubbleContainer, isMyMessage ? styles.myBubbleContainer : styles.partnerBubbleContainer]}>
          {/* 相手の名前（グループチャット等を想定して一応配置、1対1なら不要かもだがLINEっぽさのため） */}
          {!isMyMessage && (
            <Text style={styles.senderName}>{partner.nickname}</Text>
          )}

          <Menu
            visible={visibleMenuId === item.id}
            onDismiss={() => setVisibleMenuId(null)}
            anchor={
              <TouchableOpacity
                onLongPress={() => {
                  setSelectedMessageId(item.id);
                  setVisibleMenuId(item.id);
                }}
                delayLongPress={300}
                activeOpacity={0.9}
              >
                <View style={[
                  styles.bubble, 
                  isMyMessage ? styles.myBubble : styles.partnerBubble,
                  replyTarget && styles.bubbleWithReply
                ]}>
                  {/* リプライ元の表示 */}
                  {replyTarget && (
                    <View style={styles.replyPreviewInBubble}>
                      <Text style={styles.replySenderName}>
                        {replyTarget.senderId === 'user1' ? '自分' : partner.nickname}
                      </Text>
                      <Text numberOfLines={1} style={styles.replyContent}>
                        {replyTarget.isDeleted ? '送信取り消しされたメッセージ' : replyTarget.content}
                      </Text>
                    </View>
                  )}

                  <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.partnerMessageText]}>
                    {item.content}
                  </Text>
                </View>
              </TouchableOpacity>
            }
          >
            <Menu.Item 
              onPress={() => {
                setReplyingTo(item);
                setVisibleMenuId(null);
              }} 
              title="リプライ" 
              leadingIcon="reply"
            />
            {isMyMessage ? (
              <Menu.Item 
                onPress={() => handleDeleteMessage(item.id)} 
                title="送信取消" 
                leadingIcon="delete"
                titleStyle={{ color: COLORS.ERROR }}
              />
            ) : (
              <>
                <Menu.Item 
                  onPress={() => {
                    setReportDialogVisible(true);
                    setVisibleMenuId(null);
                  }} 
                  title="通報する" 
                  leadingIcon="alert"
                />
                <Menu.Item 
                  onPress={() => {
                    setBlockDialogVisible(true);
                    setVisibleMenuId(null);
                  }} 
                  title="ブロックする" 
                  leadingIcon="block-helper"
                />
              </>
            )}
          </Menu>
        </View>

        {/* 時間表示 */}
        <Text style={styles.timeText}>
          {formatTime(item.timestamp)}
          {isMyMessage && item.read && <Text style={styles.readText}>{'\n'}既読</Text>}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* メッセージリスト */}
        <FlatList
          ref={flatListRef}
          data={getFormattedMessages()}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* 入力エリア */}
        <View style={styles.inputWrapper}>
          {/* リプライプレビュー */}
          {replyingTo && (
            <View style={styles.replyContext}>
              <View style={styles.replyBar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.replyToLabel}>
                  {replyingTo.senderId === 'user1' ? '自分' : partner.nickname}への返信
                </Text>
                <Text numberOfLines={1} style={styles.replyToContent}>
                  {replyingTo.content}
                </Text>
              </View>
              <IconButton icon="close" size={20} onPress={() => setReplyingTo(null)} />
            </View>
          )}

          {moderationMessage && (
            <View style={styles.moderationAlert}>
              <Text style={styles.moderationText}>{moderationMessage}</Text>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <IconButton icon="plus" size={24} iconColor={COLORS.TEXT_SECONDARY} style={{ margin: 0 }} />
            <IconButton icon="camera" size={24} iconColor={COLORS.TEXT_SECONDARY} style={{ margin: 0 }} />
            <IconButton icon="image" size={24} iconColor={COLORS.TEXT_SECONDARY} style={{ margin: 0 }} />
            
            <TextInput
              mode="outlined"
              value={inputText}
              onChangeText={handleInputChange}
              placeholder="メッセージを入力"
              style={styles.input}
              outlineStyle={{ borderRadius: 20, borderWidth: 0 }}
              contentStyle={{ paddingVertical: 8 }}
              dense
            />
            <IconButton
              icon="send"
              mode="contained"
              containerColor={COLORS.PRIMARY}
              iconColor="white"
              size={20}
              onPress={handleSend}
              disabled={inputText.trim().length === 0 || !isInputValid}
              style={{ margin: 0, marginLeft: 8 }}
            />
          </View>
        </View>
      </View>

      {/* 通報ダイアログ */}
      <Portal>
        <Dialog visible={reportDialogVisible} onDismiss={() => setReportDialogVisible(false)}>
          <Dialog.Title>通報する</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setReportReason(value)} value={reportReason}>
              <RadioButton.Item label="不適切な内容" value="inappropriate" />
              <RadioButton.Item label="スパム・宣伝" value="spam" />
              <RadioButton.Item label="嫌がらせ・誹謗中傷" value="harassment" />
              <RadioButton.Item label="その他" value="other" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReportDialogVisible(false)}>キャンセル</Button>
            <Button onPress={handleReport}>送信</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ブロック確認ダイアログ */}
      <Portal>
        <Dialog visible={blockDialogVisible} onDismiss={() => setBlockDialogVisible(false)}>
          <Dialog.Title>ブロックしますか？</Dialog.Title>
          <Dialog.Content>
            <Text>このユーザーからのメッセージを受信しなくなります。この操作は設定から解除できます。</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBlockDialogVisible(false)}>キャンセル</Button>
            <Button onPress={handleBlock} textColor={COLORS.ERROR}>ブロックする</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8FB8E6', // LINE風の背景色
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateChip: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageRow: {
    flexDirection: 'row-reverse',
  },
  partnerMessageRow: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  bubbleContainer: {
    maxWidth: '70%',
  },
  myBubbleContainer: {
    marginLeft: 8,
  },
  partnerBubbleContainer: {
    marginRight: 8,
  },
  senderName: {
    fontSize: 11,
    color: '#555',
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 36,
  },
  myBubble: {
    backgroundColor: '#8DE055', // LINE風の緑
    borderTopRightRadius: 4,
  },
  partnerBubble: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  bubbleWithReply: {
    paddingTop: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#000',
  },
  partnerMessageText: {
    color: '#000',
  },
  timeText: {
    fontSize: 10,
    color: '#555',
    marginHorizontal: 4,
    marginBottom: 2,
  },
  readText: {
    fontSize: 10,
    color: '#555',
  },
  deletedText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'center',
  },
  // Reply styles
  replyPreviewInBubble: {
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,0.2)',
    paddingLeft: 8,
    marginBottom: 8,
  },
  replySenderName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  replyContent: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  // Input area
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    maxHeight: 100,
    fontSize: 15,
  },
  replyContext: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  replyBar: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    marginRight: 8,
    borderRadius: 2,
  },
  replyToLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  replyToContent: {
    fontSize: 12,
    color: '#666',
  },
  moderationAlert: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderTopWidth: 1,
    borderTopColor: '#FFCDD2',
  },
  moderationText: {
    color: '#D32F2F',
    fontSize: 12,
  },
});
