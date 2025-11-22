import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Avatar, Button, Chip, IconButton, Divider, List } from 'react-native-paper';
import { COLORS } from '../constants/AppConfig';
import { useRecruitmentStore, RecruitmentCategory } from '../stores/recruitmentStore';
import { DUMMY_USERS } from '../data/dummyUsers';

export default function RecruitmentDetailScreen({ route, navigation }: { route: any, navigation: any }) {
  const { recruitmentId } = route.params;
  const { recruitments, joinRecruitment, leaveRecruitment, closeRecruitment } = useRecruitmentStore();
  
  const recruitment = recruitments.find(r => r.id === recruitmentId);

  if (!recruitment) {
    return (
      <View style={styles.container}>
        <Text>募集が見つかりません</Text>
      </View>
    );
  }

  const isJoined = recruitment.currentParticipants.includes('user1'); // 自分のID
  const isOwner = recruitment.userId === 'user1';
  const isFull = recruitment.maxParticipants ? recruitment.currentParticipants.length >= recruitment.maxParticipants : false;
  const isClosed = recruitment.status === 'closed';

  const getCategoryLabel = (cat: RecruitmentCategory) => {
    switch (cat) {
      case 'game': return 'ゲーム';
      case 'study': return '勉強';
      case 'event': return 'イベント';
      case 'chat': return '雑談';
      case 'other': return 'その他';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: RecruitmentCategory) => {
    switch (cat) {
      case 'game': return '#E91E63';
      case 'study': return '#2196F3';
      case 'event': return '#4CAF50';
      case 'chat': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleJoin = () => {
    joinRecruitment(recruitment.id, 'user1');
    Alert.alert('参加しました', '当日を楽しみに待ちましょう！');
  };

  const handleLeave = () => {
    Alert.alert(
      'キャンセル確認',
      '本当に参加をキャンセルしますか？',
      [
        { text: 'いいえ', style: 'cancel' },
        { 
          text: 'はい', 
          onPress: () => {
            leaveRecruitment(recruitment.id, 'user1');
            Alert.alert('キャンセルしました');
          }
        }
      ]
    );
  };

  const handleClose = () => {
    Alert.alert(
      '締め切り確認',
      '募集を締め切りますか？これ以上参加できなくなります。',
      [
        { text: 'いいえ', style: 'cancel' },
        { 
          text: 'はい', 
          onPress: () => {
            closeRecruitment(recruitment.id);
            Alert.alert('募集を締め切りました');
          }
        }
      ]
    );
  };

  // 参加者ユーザー情報の取得
  const participants = recruitment.currentParticipants.map(userId => 
    DUMMY_USERS.find(u => u.id === userId) || { id: userId, nickname: 'Unknown', avatar: null }
  );

  const owner = DUMMY_USERS.find(u => u.id === recruitment.userId);

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Chip 
                style={{ backgroundColor: getCategoryColor(recruitment.category), alignSelf: 'flex-start', marginBottom: 12 }}
                textStyle={{ color: 'white' }}
              >
                {getCategoryLabel(recruitment.category)}
              </Chip>
              {isClosed && (
                <Chip style={{ backgroundColor: COLORS.TEXT_TERTIARY, marginLeft: 8, marginBottom: 12 }} textStyle={{ color: 'white' }}>
                  締め切り
                </Chip>
              )}
            </View>

            <Text variant="headlineSmall" style={styles.title}>{recruitment.title}</Text>

            <View style={styles.ownerSection}>
              <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY, marginRight: 8 }}>主催者:</Text>
              <Avatar.Icon size={24} icon="account" style={{ backgroundColor: COLORS.PRIMARY_LIGHT, marginRight: 8 }} />
              <Text variant="bodyMedium">{owner?.nickname || 'Unknown'}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <IconButton icon="calendar-clock" size={20} style={styles.infoIcon} />
              <View>
                <Text variant="labelMedium" style={styles.label}>開催日時</Text>
                <Text variant="bodyLarge">{formatTime(recruitment.eventDate)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <IconButton icon="map-marker" size={20} style={styles.infoIcon} />
              <View>
                <Text variant="labelMedium" style={styles.label}>場所</Text>
                <Text variant="bodyLarge">{recruitment.location}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <IconButton icon="account-group" size={20} style={styles.infoIcon} />
              <View>
                <Text variant="labelMedium" style={styles.label}>募集人数</Text>
                <Text variant="bodyLarge">
                  {recruitment.currentParticipants.length} / {recruitment.maxParticipants || '∞'} 人
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>詳細</Text>
            <Text variant="bodyMedium" style={styles.description}>{recruitment.description}</Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>参加者一覧</Text>
            <View style={styles.participantsList}>
              {participants.map((user, index) => (
                <View key={index} style={styles.participantItem}>
                  <Avatar.Icon size={40} icon="account" style={{ backgroundColor: COLORS.PRIMARY_LIGHT, marginBottom: 4 }} />
                  <Text variant="bodySmall" numberOfLines={1}>{user.nickname}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionContainer}>
          {isOwner ? (
            <Button 
              mode="contained" 
              onPress={handleClose}
              disabled={isClosed}
              style={styles.actionButton}
              buttonColor={COLORS.TEXT_SECONDARY}
            >
              {isClosed ? '締め切りました' : '募集を締め切る'}
            </Button>
          ) : isJoined ? (
            <Button 
              mode="outlined" 
              onPress={handleLeave}
              style={styles.actionButton}
              textColor={COLORS.ERROR}
              disabled={isClosed}
            >
              キャンセルする
            </Button>
          ) : (
            <Button 
              mode="contained" 
              onPress={handleJoin}
              disabled={isFull || isClosed}
              style={styles.actionButton}
              buttonColor={isFull || isClosed ? COLORS.TEXT_TERTIARY : COLORS.PRIMARY}
            >
              {isClosed ? '受付終了' : isFull ? '満員' : '参加する'}
            </Button>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    margin: 0,
    marginRight: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  description: {
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  participantItem: {
    alignItems: 'center',
    width: 60,
  },
  actionContainer: {
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 6,
  },
});
