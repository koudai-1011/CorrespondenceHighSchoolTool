import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Avatar, Chip, Button, Divider, SegmentedButtons, IconButton, Menu, Portal, Dialog, RadioButton, Paragraph } from 'react-native-paper';
import { User } from '../data/dummyUsers';
import { getFollowerCount, getFollowingCount, isFollowing } from '../data/dummySocial';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';
import { useModerationStore } from '../stores/moderationStore';

interface UserDetailScreenProps {
  route: {
    params: {
      user: User;
      matchCount?: number;
      isPreviewMode?: boolean; // 客観視モード（フォロー/メッセージボタン非表示）
    };
  };
  navigation: any;
}

// ジャンル別タグ表示コンポーネント
function TagTabView({ user }: { user: User }) {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const { detailedTags: myTags } = useRegistrationStore();

  // 自分のタグ名のセット
  const myTagNames = new Set(myTags.map(t => t.name));

  // ジャンル別にタグをフィルタリング
  const genres = [
    { value: 'all', label: 'All' },
    { value: '漫画・アニメ', label: 'アニメ・ゲーム' },
    { value: 'ゲーム', label: 'ゲーム' },
    { value: '趣味', label: '趣味' },
    { value: '音楽', label: '音楽' },
    { value: 'スポーツ', label: 'スポーツ' },
  ];

  const filteredTags = selectedGenre === 'all' 
    ? user.detailedTags 
    : user.detailedTags.filter(tag => tag.category === selectedGenre);

  return (
    <View>
      {/* ジャンル選択ボタン */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {genres.map(genre => (
            <TouchableOpacity
              key={genre.value}
              style={[
                styles.genreButton,
                selectedGenre === genre.value && styles.genreButtonActive
              ]}
              onPress={() => setSelectedGenre(genre.value)}
            >
              <Text style={[
                styles.genreButtonText,
                selectedGenre === genre.value && styles.genreButtonTextActive
              ]}>
                {genre.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* タグ表示 */}
      <View style={styles.tags}>
        {filteredTags.map((tag, index) => {
          const isMatched = myTagNames.has(tag.name);
          return (
            <Chip 
              key={`${tag.name}-${index}`} 
              style={[
                styles.tag,
                isMatched && styles.matchedTag
              ]}
              textStyle={isMatched && { color: 'white', fontWeight: '700' }}
              icon={isMatched ? 'star' : 'tag'}
            >
              {tag.name}
            </Chip>
          );
        })}
        {filteredTags.length === 0 && (
          <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
            このジャンルのタグはありません
          </Text>
        )}
      </View>
    </View>
  );
}

export default function UserDetailScreen({ route, navigation }: UserDetailScreenProps) {
  const { user, matchCount, isPreviewMode } = route.params;
  const [following, setFollowing] = useState(isFollowing('user1', user.id));
  
  // 通報・ブロック用state
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [blockDialogVisible, setBlockDialogVisible] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate');
  
  const { addReport, blockUser } = useModerationStore();
  
  const followerCount = getFollowerCount(user.id);
  const followingCount = getFollowingCount(user.id);

  const handleFollow = () => {
    setFollowing(!following);
    // 実際にはAPIを叩く
  };

  const handleMessage = () => {
    navigation.navigate('Chat', { 
      partnerId: user.id,
      partner: user
    });
  };

  const handleReport = () => {
    addReport({
      reporterId: 'user1',
      targetId: user.id,
      targetType: 'USER',
      reason: reportReason,
      details: `User profile: ${user.nickname}`,
    });
    setReportDialogVisible(false);
    setMenuVisible(false);
    alert('通報を受け付けました');
  };

  const handleBlock = () => {
    blockUser('user1', user.id);
    setBlockDialogVisible(false);
    setMenuVisible(false);
    alert(`${user.nickname}さんをブロックしました`);
    navigation.goBack();
  };

  // ヘッダー右側のメニューボタンを設定
  React.useLayoutEffect(() => {
    if (!isPreviewMode) {
      navigation.setOptions({
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item 
              onPress={() => {
                setReportDialogVisible(true);
                setMenuVisible(false);
              }} 
              title="通報する" 
              leadingIcon="alert"
            />
            <Menu.Item 
              onPress={() => {
                setBlockDialogVisible(true);
                setMenuVisible(false);
              }} 
              title="ブロックする" 
              leadingIcon="block-helper"
            />
          </Menu>
        ),
      });
    }
  }, [navigation, menuVisible, isPreviewMode]);

  return (
    <ScrollView style={styles.container}>
      {/* ヘッダー画像 */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={{ uri: 'https://picsum.photos/800/400' }} 
          style={styles.headerImage} 
        />
        <View style={styles.headerOverlay} />
      </View>

      {/* プロフィール情報 */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Avatar.Icon 
            size={100} 
            icon="account"
            style={[styles.avatar, { backgroundColor: user.themeColor }]} 
          />
        </View>

        <View style={styles.userInfo}>
          <Text variant="headlineMedium" style={styles.nickname}>{user.nickname}</Text>
          
          <View style={styles.attributes}>
            <Chip icon="school" style={styles.attributeChip} compact>{user.grade}</Chip>
            <Chip icon="map-marker" style={styles.attributeChip} compact>{user.prefecture}</Chip>
            <Chip icon="gender-male-female" style={styles.attributeChip} compact>{user.gender}</Chip>
          </View>

          {matchCount !== undefined && (
            <View style={styles.matchInfo}>
              <Text variant="titleMedium" style={{ color: COLORS.PRIMARY, fontWeight: 'bold' }}>
                共通点: {matchCount}個
              </Text>
            </View>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{followingCount}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>フォロー</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{followerCount}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>フォロワー</Text>
            </View>
          </View>

          {!isPreviewMode && (
            <View style={styles.actions}>
              <Button 
                mode={following ? "outlined" : "contained"}
                onPress={handleFollow}
                style={styles.actionButton}
              >
                {following ? "フォロー中" : "フォローする"}
              </Button>
              <Button 
                mode="contained" 
                buttonColor={COLORS.ACCENT}
                onPress={handleMessage}
                style={styles.actionButton}
                icon="chat"
              >
                メッセージ
              </Button>
            </View>
          )}
        </View>

        <Divider style={{ marginVertical: 24 }} />

        {/* 自己紹介 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>自己紹介</Text>
          <Card style={styles.bioCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={{ lineHeight: 24 }}>
                {user.bio || '自己紹介はまだありません。'}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* タグ */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>趣味・タグ</Text>
          <TagTabView user={user} />
        </View>

        {/* コミュニケーションスタイル */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>コミュニケーションスタイル</Text>
            <View style={styles.commStyle}>
              <View style={styles.commItem}>
                <Text style={styles.commLabel}>話しかけやすさ</Text>
                <View style={styles.levelBar}>
                  <View style={[styles.levelFill, { width: `${user.communicationType.approachability * 20}%`, backgroundColor: user.themeColor }]} />
                </View>
                <Text style={styles.commValue}>{user.communicationType.approachability}/5</Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>自分から話す</Text>
                <View style={styles.levelBar}>
                  <View style={[styles.levelFill, { width: `${user.communicationType.initiative * 20}%`, backgroundColor: user.themeColor }]} />
                </View>
                <Text style={styles.commValue}>{user.communicationType.initiative}/5</Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>返信の速さ</Text>
                <View style={styles.levelBar}>
                  <View style={[styles.levelFill, { width: `${user.communicationType.responseSpeed * 20}%`, backgroundColor: user.themeColor }]} />
                </View>
                <Text style={styles.commValue}>{user.communicationType.responseSpeed}/5</Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>グループサイズ</Text>
                <Text style={styles.commValue}>
                  {user.communicationType.groupPreference === 'one-on-one' ? '1対1' :
                   user.communicationType.groupPreference === 'small' ? '少人数' : '大人数OK'}
                </Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>手段</Text>
                <Text style={styles.commValue}>
                  {user.communicationType.textVsVoice === 'text' ? 'テキスト派' :
                   user.communicationType.textVsVoice === 'voice' ? '通話派' : 'どちらでもOK'}
                </Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>会話の深さ</Text>
                <View style={styles.levelBar}>
                  <View style={[styles.levelFill, { width: `${user.communicationType.deepVsCasual * 20}%`, backgroundColor: user.themeColor }]} />
                </View>
                <Text style={styles.commValue}>{user.communicationType.deepVsCasual}/5</Text>
              </View>

              <View style={styles.commItem}>
                <Text style={styles.commLabel}>オンライン頻度</Text>
                <View style={styles.levelBar}>
                  <View style={[styles.levelFill, { width: `${user.communicationType.onlineActivity * 20}%`, backgroundColor: user.themeColor }]} />
                </View>
                <Text style={styles.commValue}>{user.communicationType.onlineActivity}/5</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
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

        {/* ブロック確認ダイアログ */}
        <Dialog visible={blockDialogVisible} onDismiss={() => setBlockDialogVisible(false)}>
          <Dialog.Title>ブロックしますか？</Dialog.Title>
          <Dialog.Content>
            <Paragraph>このユーザーからのメッセージや投稿が表示されなくなります。この操作は設定から解除できます。</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBlockDialogVisible(false)}>キャンセル</Button>
            <Button onPress={handleBlock} textColor={COLORS.ERROR}>ブロックする</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerImageContainer: {
    height: 150,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    marginTop: -50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: COLORS.BACKGROUND,
  },
  userInfo: {
    alignItems: 'center',
  },
  nickname: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  attributes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  attributeChip: {
    backgroundColor: COLORS.SURFACE,
  },
  matchInfo: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  bioCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  genreButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  genreButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
  },
  genreButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.SURFACE,
  },
  matchedTag: {
    backgroundColor: COLORS.PRIMARY,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  commStyle: {
    gap: 16,
  },
  commItem: {
    marginBottom: 12,
  },
  commLabel: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  levelBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  commValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
});
