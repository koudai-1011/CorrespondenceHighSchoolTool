import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card, Avatar, Chip, Button, Divider, SegmentedButtons, IconButton, Menu, Portal, Dialog, RadioButton, Paragraph, FAB } from 'react-native-paper';
import { DUMMY_USERS } from '../data/dummyUsers';
import { User } from '../types/user';
import { getFollowerCount, getFollowingCount, isFollowing } from '../data/dummySocial';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';
import { useModerationStore } from '../stores/moderationStore';
import { modernStyles } from '../styles/modernStyles';

interface UserDetailScreenProps {
  route: {
    params: {
      user?: User;
      userId?: string;
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
  const { user: paramUser, userId, matchCount, isPreviewMode } = route.params;
           // userIdからユーザーを検索、または渡されたuserオブジェクトを使用
  const foundUser = paramUser || DUMMY_USERS.find(u => u.id === userId);

  if (!foundUser) {
    return (
      <View style={[modernStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>ユーザーが見つかりません</Text>
        <Button onPress={() => navigation.goBack()}>戻る</Button>
      </View>
    );
  }

  const user = foundUser as User;

  const { userId: currentUserId } = useRegistrationStore();
  const isOwnProfile = user.id === currentUserId;

  const [following, setFollowing] = useState(isFollowing('user1', user.id));
  const [activeTab, setActiveTab] = useState('info'); // default to info (profile)

  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [blockDialogVisible, setBlockDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const handleReport = () => {
    // API call would go here
    setReportDialogVisible(false);
    alert('通報を受け付けました');
  };

  const handleBlock = () => {
    // API call would go here
    setBlockDialogVisible(false);
    alert('ユーザーをブロックしました');
    navigation.goBack();
  };

  return (
    <View style={modernStyles.container}>
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.profileContent}>
            <View style={styles.topSection}>
              <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
                <Avatar.Image 
                  size={80} 
                  source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/80' }} 
                  style={styles.avatar} 
                />
              </TouchableOpacity>
              <View style={styles.actionButtons}>
                {!isOwnProfile && !isPreviewMode && (
                  <>
                    <Button 
                      mode={following ? "outlined" : "contained"} 
                      onPress={() => setFollowing(!following)}
                      style={following ? styles.followingButton : styles.followButton}
                    >
                      {following ? 'フォロー中' : 'フォロー'}
                    </Button>
                    <IconButton 
                      icon="email-outline" 
                      mode="outlined" 
                      style={styles.iconButton} 
                      onPress={() => navigation.navigate('Chat', { user })} 
                    />
                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <IconButton 
                          icon="dots-horizontal" 
                          mode="outlined" 
                          style={styles.iconButton} 
                          onPress={() => setMenuVisible(true)} 
                        />
                      }
                    >
                      <Menu.Item onPress={() => { setMenuVisible(false); setReportDialogVisible(true); }} title="通報する" leadingIcon="alert" />
                      <Menu.Item onPress={() => { setMenuVisible(false); setBlockDialogVisible(true); }} title="ブロックする" leadingIcon="block-helper" />
                    </Menu>
                  </>
                )}
                {isOwnProfile && (
                  <Button mode="outlined" style={styles.editButton} onPress={() => navigation.navigate('ProfileEdit')}>
                    編集
                  </Button>
                )}
              </View>
            </View>

            <View style={styles.nameSection}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>{user.nickname}</Text>
              <Text style={styles.userId}>@{user.id}</Text>
              {!isOwnProfile && matchCount !== undefined && matchCount > 0 && (
                <Chip 
                  icon="heart" 
                  style={{ backgroundColor: user.themeColor, alignSelf: 'flex-start', marginTop: 8 }} 
                  textStyle={{ color: 'white', fontWeight: 'bold' }}
                >
                  {matchCount}個一致
                </Chip>
              )}
            </View>

            <Text style={styles.bio}>{user.bio || '自己紹介がありません'}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Avatar.Icon size={16} icon="map-marker" style={{ backgroundColor: 'transparent' }} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.infoText}>{user.prefecture}</Text>
              </View>
              <View style={styles.infoItem}>
                <Avatar.Icon size={16} icon="school" style={{ backgroundColor: 'transparent' }} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.infoText}>{user.grade}年生</Text>
              </View>
              {user.age && (
                <View style={styles.infoItem}>
                  <Avatar.Icon size={16} icon="cake-variant" style={{ backgroundColor: 'transparent' }} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.infoText}>{user.age}歳</Text>
                </View>
              )}
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity onPress={() => navigation.navigate('FollowList', { userId: user.id, initialTab: 'following' })}>
                <Text style={styles.statNumber}>{getFollowingCount(user.id)} <Text style={styles.statLabel}>フォロー</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('FollowList', { userId: user.id, initialTab: 'followers' })}>
                <Text style={styles.statNumber}>{getFollowerCount(user.id)} <Text style={styles.statLabel}>フォロワー</Text></Text>
              </TouchableOpacity>
              {user.titles && user.titles.length > 0 && (
                <TouchableOpacity onPress={() => setTitleModalVisible(true)}>
                  <Text style={styles.statNumber}>{user.titles.length} <Text style={styles.statLabel}>称号</Text></Text>
                </TouchableOpacity>
              )}
            </View>

            {/* タブ */}
            <View style={styles.tabContainer}>
              <SegmentedButtons
                value={activeTab}
                onValueChange={setActiveTab}
                buttons={[
                  { value: 'info', label: 'プロフィール' },
                  { value: 'posts', label: '投稿' },
                  ...(isOwnProfile ? [{ value: 'likes', label: 'いいね' }] : []),
                ]}
                style={styles.tabs}
                density="medium"
              />
            </View>

            {/* タブコンテンツ */}
            <View style={styles.tabContent}>
              {activeTab === 'info' && (
                <View>
                  {/* ... info content ... */}
                  {/* 季節の質問（プロフィール帳要素） */}
                  <Card style={[styles.sectionCard, { borderColor: COLORS.ACCENT, borderWidth: 1 }]}>
                    <Card.Title 
                      title="Seasonal Q&A" 
                      subtitle="冬の質問"
                      left={(props) => <Avatar.Icon {...props} icon="snowflake" style={{ backgroundColor: COLORS.ACCENT }} />}
                    />
                    <Card.Content>
                      <View style={styles.qaItem}>
                        <Text style={styles.questionText}>Q. 冬に聴きたい曲は？</Text>
                        <Text style={styles.answerText}>A. {user.nickname === 'user2' ? 'Snow Halation' : 'クリスマスソング / back number'}</Text>
                      </View>
                      <Divider style={{ marginVertical: 8 }} />
                      <View style={styles.qaItem}>
                        <Text style={styles.questionText}>Q. こたつで食べたいものは？</Text>
                        <Text style={styles.answerText}>A. {user.nickname === 'user2' ? 'みかん' : '雪見だいふく'}</Text>
                      </View>
                      <Divider style={{ marginVertical: 8 }} />
                      <View style={styles.qaItem}>
                        <Text style={styles.questionText}>Q. 今年の目標を一言で！</Text>
                        <Text style={styles.answerText}>A. {user.nickname === 'user2' ? 'APEXマスター到達！' : '友達100人作る！'}</Text>
                      </View>
                    </Card.Content>
                  </Card>

                  <Card style={styles.sectionCard}>
                    <Card.Title title="趣味・興味" />
                    <Card.Content>
                      <TagTabView user={user} />
                    </Card.Content>
                  </Card>

                  <Card style={styles.sectionCard}>
                    <Card.Title title="コミュニケーションスタイル" />
                    <Card.Content>
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
                  
                  <Text style={styles.sectionTitle}>SNSリンク</Text>
                  {user.socialLinks && user.socialLinks.length > 0 ? (
                    <View style={styles.socialLinks}>
                      {user.socialLinks.map((link, index) => (
                        <TouchableOpacity key={index} style={styles.socialLinkItem}>
                          <IconButton icon="link" size={20} />
                          <Text style={styles.socialLinkText}>{link.platform}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyStateText}>SNSリンクは登録されていません</Text>
                  )}
                </View>
              )}
              {activeTab === 'likes' && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>いいねした投稿はありません</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* 通報ダイアログ */}
        <Portal>
          <Dialog visible={reportDialogVisible} onDismiss={() => setReportDialogVisible(false)} style={{ backgroundColor: 'white' }}>
            <Dialog.Title>通報の理由</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group onValueChange={value => setReportReason(value)} value={reportReason}>
                <RadioButton.Item label="不適切なコンテンツ" value="inappropriate" />
                <RadioButton.Item label="スパム・宣伝" value="spam" />
                <RadioButton.Item label="嫌がらせ・誹謗中傷" value="harassment" />
                <RadioButton.Item label="その他" value="other" />
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setReportDialogVisible(false)}>キャンセル</Button>
              <Button onPress={handleReport} textColor={COLORS.ERROR}>通報する</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* ブロックダイアログ */}
        <Portal>
          <Dialog visible={blockDialogVisible} onDismiss={() => setBlockDialogVisible(false)} style={{ backgroundColor: 'white' }}>
            <Dialog.Title>ブロックしますか？</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                {user.nickname}さんをブロックすると、お互いにメッセージの送信や投稿の閲覧ができなくなります。
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setBlockDialogVisible(false)}>キャンセル</Button>
              <Button onPress={handleBlock} textColor={COLORS.ERROR}>ブロックする</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* 称号一覧モーダル */}
        <Portal>
          <Dialog visible={titleModalVisible} onDismiss={() => setTitleModalVisible(false)} style={{ backgroundColor: 'white' }}>
            <Dialog.Title>所持称号</Dialog.Title>
            <Dialog.ScrollArea style={{ maxHeight: 400, paddingHorizontal: 0 }}>
              <ScrollView>
                {user.titles?.map((title, index) => (
                  <View key={title.id} style={styles.titleItem}>
                    <View style={styles.titleHeader}>
                      <Avatar.Icon 
                        size={40} 
                        icon="trophy" 
                        style={{ backgroundColor: title.iconColor || COLORS.PRIMARY }} 
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.titleName}>{title.name}</Text>
                        <Text style={styles.titleDescription}>{title.description}</Text>
                        <Text style={styles.titleDate}>取得日: {new Date(title.obtainedAt).toLocaleDateString('ja-JP')}</Text>
                      </View>
                      {user.currentTitleId === title.id && (
                        <Chip style={{ backgroundColor: COLORS.PRIMARY }} textStyle={{ color: 'white', fontSize: 10 }}>装備中</Chip>
                      )}
                    </View>
                    {index < (user.titles?.length || 0) - 1 && <Divider style={{ marginTop: 12 }} />}
                  </View>
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setTitleModalVisible(false)}>閉じる</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* アバター画像拡大モーダル */}
        <Portal>
          <Dialog visible={avatarModalVisible} onDismiss={() => setAvatarModalVisible(false)} style={{ backgroundColor: 'transparent' }}>
            <Dialog.Content style={{ paddingVertical: 8, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Image 
                  source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/300' }} 
                  style={{ width: 300, height: 300, borderRadius: 150 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </Dialog.Content>
          </Dialog>
        </Portal>

      </>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileContent: {
    paddingHorizontal: 16,
    paddingTop: 16, // Changed from negative margin
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: COLORS.SURFACE,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  editButton: {
    borderColor: COLORS.BORDER,
    borderRadius: 20,
  },
  followButton: {
    borderRadius: 20,
    minWidth: 100,
  },
  followingButton: {
    borderColor: COLORS.BORDER,
  },
  iconButton: {
    margin: 0,
    borderColor: COLORS.BORDER,
  },
  nameSection: {
    marginBottom: 12,
  },
  userId: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: 4,
    width: 16,
    height: 16,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_SECONDARY,
  },
  tabContainer: {
    marginBottom: 16,
  },
  tabs: {
    backgroundColor: 'transparent',
  },
  tabContent: {
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  genreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  genreButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  genreButtonText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  genreButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  matchedTag: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
  },
  socialLinks: {
    gap: 8,
  },
  socialLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  socialLinkText: {
    marginLeft: 8,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: COLORS.TEXT_TERTIARY,
  },
  sectionCard: {
    marginBottom: 16,
    backgroundColor: COLORS.SURFACE,
  },
  commStyle: {
    marginTop: 8,
  },
  commItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    width: 100,
  },
  levelBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  commValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    width: 30,
    textAlign: 'right',
  },
  qaItem: {
    marginBottom: 4,
  },
  questionText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  titleItem: {
    padding: 16,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  titleDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  titleDate: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
  },
});
