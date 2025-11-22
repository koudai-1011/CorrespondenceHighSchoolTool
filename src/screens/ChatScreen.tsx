import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, IconButton, Avatar, Menu, Portal, Dialog, Button, RadioButton } from 'react-native-paper';
import { getChatMessages } from '../data/dummyChat';
import { COLORS } from '../constants/AppConfig';
import { useModerationStore } from '../stores/moderationStore';
import { checkContent } from '../utils/contentModeration';

export default function ChatScreen({ route, navigation }: { route: any, navigation: any }) {
  const { partnerId, partner } = route.params;
  const [messages, setMessages] = useState(getChatMessages('user1', partnerId));
  const [inputText, setInputText] = useState('');
  
  // 通報・ブロック用state
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [blockDialogVisible, setBlockDialogVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('inappropriate');
  
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
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === 'user1';

    return (
      <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
        {!isMyMessage && (
          <Avatar.Icon
            size={32}
            icon="account"
            style={{ backgroundColor: partner.themeColor, marginRight: 8 }}
          />
        )}
        
        <Menu
          visible={visibleMenuId === item.id}
          onDismiss={() => setVisibleMenuId(null)}
          anchor={
            <TouchableOpacity
              onLongPress={() => {
                if (!isMyMessage) {
                  setSelectedMessageId(item.id);
                  setVisibleMenuId(item.id);
                }
              }}
              delayLongPress={500}
            >
              <View style={[styles.messageBubble, isMyMessage && styles.myMessageBubble]}>
                <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
                  {item.content}
                </Text>
                <Text style={[styles.messageTime, isMyMessage && styles.myMessageTime]}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            </TouchableOpacity>
          }
        >
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
        </Menu>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: COLORS.BACKGROUND 
      }}>
        {/* メッセージリスト */}
        <View style={{ flex: 1, padding: 16 }}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        {/* 入力エリア */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        {moderationMessage && (
          <View style={{ padding: 8, backgroundColor: '#FFEBEE', borderTopWidth: 1, borderTopColor: '#FFCDD2' }}>
            <Text style={{ color: '#D32F2F', fontSize: 12 }}>{moderationMessage}</Text>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            value={inputText}
            onChangeText={handleInputChange}
            placeholder="メッセージを入力"
            style={styles.input}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            error={!isInputValid}
          />
          <IconButton
            icon="send"
            mode="contained"
            containerColor={COLORS.PRIMARY}
            iconColor="white"
            size={24}
            onPress={handleSend}
            disabled={inputText.trim().length === 0 || !isInputValid}
          />
        </View>
      </KeyboardAvoidingView>
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
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: COLORS.PRIMARY,
  },
  messageText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    marginTop: 4,
    textAlign: 'right',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
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
  sendButton: {
    margin: 0,
  },
});
