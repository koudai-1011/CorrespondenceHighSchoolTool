import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, IconButton, SegmentedButtons, Portal, Modal, TextInput, Divider, Chip, ProgressBar, Dialog } from 'react-native-paper';
import { DUMMY_ANNOUNCEMENTS, Announcement } from '../data/dummyAnnouncements';
import { DUMMY_ANALYTICS, calculateEngagementRate, calculateRetentionRate } from '../data/dummyAnalytics';
import { COLORS } from '../constants/AppConfig';
import { useAdStore, PopupAd } from '../stores/adStore';
import { useSettingsStore } from '../stores/settingsStore';
import { SUGGESTIONS, CATEGORIES } from '../data/tagData';
import { DUMMY_USERS } from '../data/dummyUsers';
import { useModerationStore } from '../stores/moderationStore';

type TabType = 'dashboard' | 'reports' | 'ng_words' | 'ads' | 'notifications';

export default function AdminScreen() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>(DUMMY_ANNOUNCEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // フォーム用のstate
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBackgroundColor, setFormBackgroundColor] = useState('#6B9BD1');
  const [formLink, setFormLink] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const analytics = DUMMY_ANALYTICS;
  const { ads, addAd, updateAd, deleteAd, toggleAdStatus } = useAdStore();

  // タグアナリティクスの計算（カテゴリー別）
  const tagAnalyticsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    DUMMY_USERS.forEach(user => {
      user.detailedTags.forEach(tag => {
        counts[tag.name] = (counts[tag.name] || 0) + 1;
      });
    });

    const result: Record<string, Array<{name: string, count: number}>> = {};
    
    CATEGORIES.forEach(category => {
      const categoryTags = SUGGESTIONS[category] || [];
      const tagsWithCounts = categoryTags.map(tag => ({
        name: tag.name,
        count: counts[tag.name] || 0
      })).sort((a, b) => b.count - a.count);
      
      result[category] = tagsWithCounts;
    });

    return result;
  }, []);

  // 広告フォーム用のstate
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adPrefectures, setAdPrefectures] = useState(''); // カンマ区切り
  const [adSelectedTags, setAdSelectedTags] = useState<string[]>([]); // 選択されたタグ
  const [currentTagCategory, setCurrentTagCategory] = useState(CATEGORIES[0]); // タグ選択用カテゴリ
  const [adMaxDisplayCount, setAdMaxDisplayCount] = useState<string>(''); // 上限数（空文字列なら無制限）
  const [adDisplayTriggers, setAdDisplayTriggers] = useState<string[]>(['APP_OPEN']); // デフォルトはAPP_OPEN
  const [adGrades, setAdGrades] = useState<string[]>([]); // 対象学年
  const [adAgeMin, setAdAgeMin] = useState<string>(''); // 最小年齢
  const [adAgeMax, setAdAgeMax] = useState<string>(''); // 最大年齢

  // 通報管理用のstate
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('pending');
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedReportForBan, setSelectedReportForBan] = useState<any>(null);
  const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
  const [banDays, setBanDays] = useState('7');
  const [banReason, setBanReason] = useState('');

  // NGワード管理用state
  const { reports, updateReportStatus, banUser, unbanUser, getActiveBans, isBanned, ngWords, addNgWord, removeNgWord } = useModerationStore();
  const [newNgWord, setNewNgWord] = useState('');

  const handleEditAd = (ad: PopupAd) => {
    setEditingAdId(ad.id);
    setAdTitle(ad.title);
    setAdImageUrl(ad.imageUrl);
    setAdLinkUrl(ad.linkUrl);
    setAdPrefectures(ad.target.prefectures.join(', '));
    setAdSelectedTags(ad.target.tags);
    setAdMaxDisplayCount(ad.maxDisplayCount !== null ? ad.maxDisplayCount.toString() : '');
    setAdDisplayTriggers(ad.displayTriggers);
    setAdGrades(ad.target.grades);
    setAdAgeMin(ad.target.ageMin !== null ? ad.target.ageMin.toString() : '');
    setAdAgeMax(ad.target.ageMax !== null ? ad.target.ageMax.toString() : '');
    setShowAdForm(true);
  };

  const toggleAdTag = (tagName: string) => {
    if (adSelectedTags.includes(tagName)) {
      setAdSelectedTags(adSelectedTags.filter(t => t !== tagName));
    } else {
      setAdSelectedTags([...adSelectedTags, tagName]);
    }
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('この広告を削除しますか？')) {
      deleteAd(id);
    }
  };

  const handleSubmitAd = () => {
    if (!adTitle || !adImageUrl) {
      alert('タイトルと画像URLは必須です');
      return;
    }

    const target = {
      prefectures: adPrefectures.split(',').map(s => s.trim()).filter(s => s !== ''),
      tags: adSelectedTags,
      grades: adGrades,
      ageMin: adAgeMin.trim() === '' ? null : parseInt(adAgeMin, 10),
      ageMax: adAgeMax.trim() === '' ? null : parseInt(adAgeMax, 10),
    };

    const maxCount = adMaxDisplayCount.trim() === '' ? null : parseInt(adMaxDisplayCount, 10);

    if (editingAdId) {
      updateAd(editingAdId, {
        title: adTitle,
        imageUrl: adImageUrl,
        linkUrl: adLinkUrl,
        target,
        maxDisplayCount: maxCount,
        displayTriggers: adDisplayTriggers as any[],
      });
    } else {
      addAd({
        title: adTitle,
        imageUrl: adImageUrl,
        linkUrl: adLinkUrl,
        target,
        isActive: true,
        maxDisplayCount: maxCount,
        displayTriggers: adDisplayTriggers as any[],
      });
    }

    setShowAdForm(false);
    setEditingAdId(null);
    setAdTitle('');
    setAdImageUrl('');
    setAdLinkUrl('');
    setAdPrefectures('');
    setAdSelectedTags([]);
    setAdMaxDisplayCount('');
    setAdDisplayTriggers(['APP_OPEN']);
    setAdGrades([]);
    setAdAgeMin('');
    setAdAgeMax('');
  };


  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormTitle(announcement.title);
    setFormDescription(announcement.description);
    setFormBackgroundColor(announcement.backgroundColor);
    setFormLink(announcement.link || '');
    setFormImageUrl(announcement.imageUrl || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('このお知らせを削除しますか？')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
      console.log('お知らせを削除しました:', id);
    }
  };

  const handleSubmit = () => {
    if (!formTitle || !formDescription) {
      alert('タイトルと説明を入力してください');
      return;
    }

    if (editingId) {
      // 編集
      setAnnouncements(announcements.map(a => 
        a.id === editingId 
          ? { ...a, title: formTitle, description: formDescription, backgroundColor: formBackgroundColor, link: formLink || undefined, imageUrl: formImageUrl || undefined }
          : a
      ));
      console.log('お知らせを更新しました:', editingId);
    } else {
      // 新規作成
      const newAnnouncement: Announcement = {
        id: `ann${Date.now()}`,
        title: formTitle,
        description: formDescription,
        backgroundColor: formBackgroundColor,
        link: formLink || undefined,
        imageUrl: formImageUrl || undefined,
        createdAt: new Date(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      console.log('お知らせを作成しました:', newAnnouncement.id);
    }

    // フォームをリセット
    setShowForm(false);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormBackgroundColor('#6B9BD1');
    setFormLink('');
    setFormImageUrl('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormBackgroundColor('#6B9BD1');
    setFormLink('');
    setFormImageUrl('');
  };

  const colorOptions = [
    { label: '青', value: '#6B9BD1' },
    { label: 'オレンジ', value: '#F4A261' },
    { label: '緑', value: '#81C784' },
    { label: '紫', value: '#BA68C8' },
    { label: 'ピンク', value: '#FF6B9D' },
    { label: 'シアン', value: '#00BCD4' },
  ];

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>🛡️ 管理画面</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            アプリのコンテンツを管理
          </Text>
        </View>

        {/* タブ切り替え */}
        <SegmentedButtons
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as TabType)}
          buttons={[
            { value: 'dashboard', label: 'ダッシュボード', icon: 'view-dashboard' },
            { value: 'reports', label: '通報管理', icon: 'shield-alert' },
            { value: 'ng_words', label: 'NGワード', icon: 'text-box-remove' },
            { value: 'ads', label: '広告管理', icon: 'bullhorn' },
            { value: 'notifications', label: '通知', icon: 'bell' },
          ]}
          style={styles.tabs}
        />

        {currentTab === 'dashboard' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>お知らせ管理</Text>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => setShowForm(true)}
                style={styles.addButton}
              >
                新規作成
              </Button>
            </View>

            <Text variant="bodySmall" style={styles.infoText}>
              ホーム画面のスライダーに表示されるお知らせを管理できます
            </Text>

            {/* お知らせ一覧 */}
            {announcements.map((announcement) => (
              <Card key={announcement.id} style={styles.announcementCard}>
                <Card.Content>
                  <View style={styles.announcementHeader}>
                    <View style={[styles.colorPreview, { backgroundColor: announcement.backgroundColor }]} />
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={styles.announcementTitle}>
                        {announcement.title}
                      </Text>
                      <Text variant="bodySmall" style={styles.announcementDescription}>
                        {announcement.description}
                      </Text>
                      {announcement.imageUrl && (
                        <View style={styles.imagePreviewContainer}>
                          <Image
                            source={{ uri: announcement.imageUrl }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                      {announcement.link && (
                        <Chip icon="link" style={styles.linkChip} textStyle={{ fontSize: 12 }}>
                          {announcement.link}
                        </Chip>
                      )}
                    </View>
                    <View style={styles.actionButtons}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => handleEdit(announcement)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDelete(announcement.id)}
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}

            {/* アナリティクスセクション */}
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>分析ダッシュボード</Text>
            
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalUsers.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>総ユーザー数</Text>
                  <Text variant="bodySmall" style={styles.statChange}>+{analytics.newUsersThisMonth} 今月</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.activeUsers.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>DAU (デイリーアクティブ)</Text>
                  <Text variant="bodySmall" style={styles.statChange}>+{analytics.newUsersToday} 今日</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.monthlyActiveUsers.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>MAU (マンスリーアクティブ)</Text>
                  <ProgressBar 
                    progress={analytics.monthlyActiveUsers / analytics.totalUsers} 
                    color={COLORS.PRIMARY}
                    style={{ marginTop: 8 }}
                  />
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {calculateRetentionRate(analytics.monthlyActiveUsers, analytics.totalUsers).toFixed(1)}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>ユーザー保持率</Text>
                  <Text variant="bodySmall" style={styles.statChange}>MAU / 総ユーザー</Text>
                </Card.Content>
              </Card>
            </View>

            <Divider style={styles.divider} />

            {/* エンゲージメント統計 */}
            <Text variant="titleMedium" style={styles.sectionTitle}>エンゲージメント</Text>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalPosts.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>総投稿数</Text>
                  <Text variant="bodySmall" style={styles.statChange}>+{analytics.postsToday} 今日</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalComments.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>総コメント数</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.totalLikes.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>総いいね数</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.statNumber}>{analytics.activeChatRooms.toLocaleString()}</Text>
                  <Text variant="bodySmall" style={styles.statLabel}>アクティブなチャット</Text>
                  <Text variant="bodySmall" style={styles.statChange}>+{analytics.messagesThisWeek.toLocaleString()} メッセージ/週</Text>
                </Card.Content>
              </Card>
            </View>

            <Divider style={styles.divider} />

            {/* トレンドチャート（簡易版） */}
            <Text variant="titleMedium" style={styles.sectionTitle}>7日間のトレンド</Text>
            
            <Card style={styles.chartCard}>
              <Card.Content>
                <Text variant="titleSmall" style={styles.chartTitle}>デイリーアクティブユーザー (DAU)</Text>
                <View style={styles.chartContainer}>
                  {analytics.dailyActiveUsersChart.map((item, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View 
                        style={[
                          styles.barFill, 
                          { height: `${(item.value / 400) * 100}%`, backgroundColor: COLORS.PRIMARY }
                        ]} 
                      />
                      <Text variant="bodySmall" style={styles.chartLabel}>{item.date}</Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.chartCard}>
              <Card.Content>
                <Text variant="titleSmall" style={styles.chartTitle}>ユーザー成長</Text>
                <View style={styles.chartContainer}>
                  {analytics.userGrowthChart.map((item, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View 
                        style={[
                          styles.barFill, 
                          { height: `${(item.value / 1300) * 100}%`, backgroundColor: COLORS.ACCENT }
                        ]} 
                      />
                      <Text variant="bodySmall" style={styles.chartLabel}>{item.date}</Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* タグアナリティクス */}
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>タグ分析</Text>
            <Text style={styles.infoText}>カテゴリーごとのタグ登録数ランキング</Text>

            {CATEGORIES.map(category => (
              <View key={category} style={{ marginBottom: 24 }}>
                <Text variant="titleSmall" style={{ marginBottom: 8, fontWeight: 'bold' }}>{category}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {tagAnalyticsByCategory[category]?.map((item, index) => (
                    <Card key={item.name} style={{ marginRight: 12, minWidth: 120, backgroundColor: COLORS.SURFACE }}>
                      <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Text variant="labelLarge" style={{ 
                            color: index < 3 ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY, 
                            fontWeight: 'bold',
                            marginRight: 8
                          }}>
                            #{index + 1}
                          </Text>
                          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        </View>
                        <Text variant="bodySmall">{item.count} ユーザー</Text>
                        <ProgressBar 
                          progress={item.count / (DUMMY_USERS.length || 1)} 
                          color={index < 3 ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} 
                          style={{ height: 4, marginTop: 8, borderRadius: 2 }} 
                        />
                      </Card.Content>
                    </Card>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {currentTab === 'notifications' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>通知管理</Text>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              ユーザーへの一斉通知機能は今後実装予定です
            </Text>
          </View>
        )}

        {currentTab === 'reports' && (
          <>
            <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>通報・BAN管理</Text>
            
            {/* モデレーションシステムの説明 */}
            <Card style={[styles.announcementCard, { backgroundColor: '#E3F2FD' }]}>
              <Card.Content>
                <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>📋 モデレーションシステムについて</Text>
                <Text variant="bodySmall" style={{ lineHeight: 20, marginBottom: 12 }}>
                  本アプリでは、安全なコミュニティを維持するため、段階的なモデレーションシステムを導入しています。
                </Text>
                
                <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>■ 通報処理フロー</Text>
                <Text variant="bodySmall" style={{ lineHeight: 20, marginBottom: 8 }}>
                  1. <Text style={{ fontWeight: 'bold' }}>未対応（pending）</Text>: ユーザーから通報が届いた状態{+'\n'}
                  2. <Text style={{ fontWeight: 'bold' }}>確認済み（reviewed）</Text>: 管理者が内容を確認した状態{+'\n'}
                  3. <Text style={{ fontWeight: 'bold' }}>解決済み（resolved）</Text>: 対応が完了した状態
                </Text>
                
                <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>■ BAN（アカウント停止）機能</Text>
                <Text variant="bodySmall" style={{ lineHeight: 20, marginBottom: 8 }}>
                  通報を確認後、必要に応じてユーザーをBANできます：{+'\n'}
                  • <Text style={{ fontWeight: 'bold' }}>一時停止</Text>: 7日/30日/90日の期間限定でアクセス制限{+'\n'}
                  • <Text style={{ fontWeight: 'bold' }}>永久BAN</Text>: アカウントを永久に利用停止
                </Text>
                
                <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>■ 推奨対応基準</Text>
                <Text variant="bodySmall" style={{ lineHeight: 20 }}>
                  • 初回軽微な違反: 警告のみ{+'\n'}
                  • 繰り返しの違反: 7日間の一時停止{+'\n'}
                  • 重大な違反（誹謗中傷、ハラスメント等）: 30〜90日間の停止{+'\n'}
                  • 極めて悪質な違反: 永久BAN
                </Text>
              </Card.Content>
            </Card>
            
            <Divider style={{ marginVertical: 16 }} />
            
            <Text variant="titleMedium" style={styles.sectionTitle}>通報一覧</Text>

            <SegmentedButtons
              value={reportStatusFilter}
              onValueChange={(value) => setReportStatusFilter(value as any)}
              buttons={[
                { value: 'pending', label: `未対応 (${reports.filter(r => r.status === 'pending').length})` },
                { value: 'reviewed', label: '確認済み' },
                { value: 'resolved', label: '解決済み' },
                { value: 'all', label: 'すべて' },
              ]}
              style={{ marginBottom: 16 }}
            />

            {(() => {
              const filteredReports = reportStatusFilter === 'all' 
                ? reports 
                : reports.filter(r => r.status === reportStatusFilter);

              return filteredReports.length === 0 ? (
                <Card style={styles.announcementCard}>
                  <Card.Content>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', color: COLORS.TEXT_SECONDARY }}>
                      {reportStatusFilter === 'pending' ? '未対応の通報はありません' : '該当する通報がありません'}
                    </Text>
                  </Card.Content>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} style={styles.announcementCard}>
                    <Card.Content>
                      <View style={styles.announcementHeader}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                            <Chip 
                              style={{ 
                                backgroundColor: 
                                  report.status === 'pending' ? COLORS.ERROR : 
                                  report.status === 'reviewed' ? COLORS.PRIMARY : 
                                  COLORS.SUCCESS 
                              }}
                              textStyle={{ color: 'white', fontWeight: 'bold' }}
                            >
                              {report.status === 'pending' ? '未対応' : 
                               report.status === 'reviewed' ? '確認済み' : '解決済み'}
                            </Chip>
                            <Chip compact>
                              {report.targetType === 'MESSAGE' ? 'メッセージ' :
                               report.targetType === 'BULLETIN' ? '掲示板投稿' : 'ユーザー'}
                            </Chip>
                          </View>
                          <Text variant="titleMedium" style={styles.announcementTitle}>
                            通報理由: {report.reason === 'inappropriate' ? '不適切な内容' :
                                     report.reason === 'spam' ? 'スパム・宣伝' :
                                     report.reason === 'harassment' ? '嫌がらせ・誹謗中傷' : 'その他'}
                          </Text>
                          <Text variant="bodySmall" style={styles.announcementDescription}>
                            詳細: {report.details || 'なし'}
                          </Text>
                          <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY, marginTop: 4 }}>
                            通報日時: {new Date(report.createdAt).toLocaleString('ja-JP')}
                          </Text>
                          <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY }}>
                            通報者ID: {report.reporterId} / 対象ID: {report.targetId}
                          </Text>
                        </View>
                        <View style={styles.actionButtons}>
                          {report.status === 'pending' && (
                            <>
                              <Button
                                mode="contained"
                                onPress={() => updateReportStatus(report.id, 'reviewed')}
                                style={{ marginBottom: 8 }}
                              >
                                確認済みにする
                              </Button>
                              {report.targetType === 'USER' && !isBanned(report.targetId) && (
                                <Button
                                  mode="contained"
                                  buttonColor={COLORS.ERROR}
                                  onPress={() => {
                                    setSelectedReportForBan(report);
                                    setShowBanDialog(true);
                                  }}
                                >
                                  ユーザーをBAN
                                </Button>
                              )}
                            </>
                          )}
                          {report.status === 'reviewed' && (
                            <>
                              <Button
                                mode="contained"
                                buttonColor={COLORS.SUCCESS}
                                onPress={() => updateReportStatus(report.id, 'resolved')}
                                style={{ marginBottom: 8 }}
                              >
                                解決済みにする
                              </Button>
                              {report.targetType === 'USER' && !isBanned(report.targetId) && (
                                <Button
                                  mode="contained"
                                  buttonColor={COLORS.ERROR}
                                  onPress={() => {
                                    setSelectedReportForBan(report);
                                    setShowBanDialog(true);
                                  }}
                                >
                                  ユーザーをBAN
                                </Button>
                              )}
                            </>
                          )}
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))
              );
            })()}
            
            {/* BAN一覧セクション */}
            <Divider style={{ marginVertical: 24 }} />
            
            <Text variant="titleMedium" style={styles.sectionTitle}>現在のBAN一覧</Text>
            {(() => {
              const activeBans = getActiveBans();
              
              return activeBans.length === 0 ? (
                <Card style={styles.announcementCard}>
                  <Card.Content>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', color: COLORS.TEXT_SECONDARY }}>
                  現在BANされているユーザーはいません
                    </Text>
                  </Card.Content>
                </Card>
              ) : (
                activeBans.map((ban) => (
                  <Card key={ban.id} style={styles.announcementCard}>
                    <Card.Content>
                      <View style={styles.announcementHeader}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                            <Chip 
                              style={{ backgroundColor: ban.banType === 'permanent' ? '#D32F2F' : '#F57C00' }}
                              textStyle={{ color: 'white', fontWeight: 'bold' }}
                            >
                              {ban.banType === 'permanent' ? '永久BAN' : '一時停止'}
                            </Chip>
                          </View>
                          <Text variant="titleMedium" style={styles.announcementTitle}>
                            ユーザーID: {ban.userId}
                          </Text>
                          <Text variant="bodySmall" style={styles.announcementDescription}>
                            理由: {ban.reason}
                          </Text>
                          <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY, marginTop: 4 }}>
                            開始日: {new Date(ban.startDate).toLocaleString('ja-JP')}
                          </Text>
                          {ban.endDate && (
                            <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY }}>
                              終了日: {new Date(ban.endDate).toLocaleString('ja-JP')}
                            </Text>
                          )}
                          <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY }}>
                            BAN実行者: {ban.bannedBy}
                          </Text>
                        </View>
                        <View style={styles.actionButtons}>
                          <Button
                            mode="contained"
                            buttonColor={COLORS.SUCCESS}
                            onPress={() => unbanUser(ban.id)}
                          >
                            BAN解除
                          </Button>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))
              );
            })()}
          </View>

{/* BANダイアログ */}
<Portal>
  <Dialog visible={showBanDialog} onDismiss={() => setShowBanDialog(false)}>
    <Dialog.Title>ユーザーをBANする</Dialog.Title>
    <Dialog.Content>
      <Text variant="bodyMedium">対象ユーザーID: {selectedReportForBan?.targetId}</Text>
      <SegmentedButtons
        value={banType}
        onValueChange={(value) => setBanType(value as any)}
        buttons={[{ value: 'temporary', label: '一時停止' }, { value: 'permanent', label: '永久BAN' }]}
        style={{ marginTop: 8, marginBottom: 8 }}
      />
      {banType === 'temporary' && (
        <TextInput
          label="期間 (日)"
          value={banDays}
          onChangeText={setBanDays}
          keyboardType="numeric"
          style={{ marginBottom: 8 }}
        />
      )}
      <TextInput
        label="BAN理由"
        value={banReason}
        onChangeText={setBanReason}
        multiline
        numberOfLines={3}
      />
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setShowBanDialog(false)}>キャンセル</Button>
      <Button
        onPress={() => {
          if (!selectedReportForBan) return;
          const userId = selectedReportForBan.targetId;
          const banData: any = {
            userId,
            bannedBy: 'admin',
            banType,
            reason: banReason || '規約違反',
            relatedReportIds: [selectedReportForBan.id],
          };
          if (banType === 'temporary') {
            const days = parseInt(banDays, 10) || 7;
            const end = new Date();
            end.setDate(end.getDate() + days);
            banData.endDate = end;
          }
          banUser(banData);
          updateReportStatus(selectedReportForBan.id, 'resolved');
          setShowBanDialog(false);
        }}
      >
        確定
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>
      </>
    )}

        {currentTab === 'ng_words' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>NGワード管理</Text>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              ここで設定された単語を含む投稿（チャット、掲示板）は自動的にブロックされます。
            </Text>

            <Card style={styles.announcementCard}>
              <Card.Content>
                <Text variant="titleSmall" style={{ marginBottom: 12 }}>新しいNGワードを追加</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="NGワード"
                    value={newNgWord}
                    onChangeText={setNewNgWord}
                    style={{ flex: 1, backgroundColor: 'white' }}
                  />
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (newNgWord.trim()) {
                        // カンマ（半角・全角）で分割して追加
                        const words = newNgWord.split(/[,、]/).map(w => w.trim()).filter(w => w.length > 0);
                        words.forEach(word => addNgWord(word));
                        setNewNgWord('');
                      }
                    }}
                    style={{ justifyContent: 'center' }}
                    disabled={!newNgWord.trim()}
                  >
                    追加
                  </Button>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.announcementCard, { marginTop: 16 }]}>
              <Card.Content>
                <Text variant="titleSmall" style={{ marginBottom: 12 }}>登録済みNGワード ({ngWords.length})</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {ngWords.map((word, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeNgWord(word)}
                      style={{ backgroundColor: '#FFEBEE' }}
                      textStyle={{ color: '#D32F2F' }}
                    >
                      {word}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {currentTab === 'ads' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>ポップアップ広告管理</Text>
              <Button 
                mode="contained" 
                onPress={() => {
                  setEditingAdId(null);
                  setAdTitle('');
                  setAdImageUrl('');
                  setAdLinkUrl('');
                  setAdPrefectures('');
                  setAdSelectedTags([]);
                  setShowAdForm(true);
                }}
                icon="plus"
                style={styles.addButton}
              >
                新規作成
              </Button>
            </View>
            <Text style={styles.infoText}>
              アプリ起動時に表示するポップアップ広告を設定します。
            </Text>

            <Card style={styles.announcementCard}>
              <Card.Content>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>広告配信システムについて</Text>
                <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY, lineHeight: 20 }}>
                  本アプリでは、以下のルールに基づいた「重み付け抽選」により広告が表示されます：{'\n'}
                  1. <Text style={{ fontWeight: 'bold' }}>目標達成率の優先</Text>: 目標表示回数が多い（残り回数が多い）広告ほど、表示確率が高くなります。{'\n'}
                  2. <Text style={{ fontWeight: 'bold' }}>狭域ターゲットの優先</Text>: 地域・タグ・学年などの条件が設定されている広告は、全国向け広告よりも優先的に表示されます（重み5倍）。
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.announcementCard}>
              <Card.Content>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>広告表示間隔設定</Text>
                <Text variant="bodySmall" style={{ marginBottom: 12, color: COLORS.TEXT_SECONDARY }}>
                  広告が表示されてから次の広告が表示されるまでの最小間隔を設定します
                </Text>
                <SegmentedButtons
                  value={(useSettingsStore.getState().adDisplayInterval / (60 * 60 * 1000)).toString()}
                  onValueChange={(value) => {
                    const hours = parseInt(value, 10);
                    useSettingsStore.getState().setAdDisplayInterval(hours * 60 * 60 * 1000);
                  }}
                  buttons={[
                    { value: '1', label: '1時間' },
                    { value: '2', label: '2時間' },
                    { value: '6', label: '6時間' },
                    { value: '24', label: '24時間' },
                  ]}
                />
              </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>広告一覧</Text>

            {ads.map((ad) => (
              <Card key={ad.id} style={styles.announcementCard}>
                <Card.Content>
                  <View style={styles.announcementHeader}>
                    <Image source={{ uri: ad.imageUrl }} style={styles.colorPreview} />
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={styles.announcementTitle}>{ad.title}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                        {ad.target.prefectures.length > 0 ? (
                          ad.target.prefectures.map((p, i) => <Chip key={i} compact>{p}</Chip>)
                        ) : (
                          <Chip compact>全国</Chip>
                        )}
                        {ad.target.tags.length > 0 && (
                          ad.target.tags.map((t, i) => <Chip key={i} compact>{t}</Chip>)
                        )}
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <IconButton icon={ad.isActive ? "eye" : "eye-off"} onPress={() => toggleAdStatus(ad.id)} />
                      <IconButton icon="pencil" onPress={() => handleEditAd(ad)} />
                      <IconButton icon="delete" onPress={() => handleDeleteAd(ad.id)} />
                    </View>
                  </View>
                  {ad.linkUrl && (
                    <Text variant="bodySmall" style={{ marginTop: 8, color: COLORS.PRIMARY }}>
                      リンク: {ad.linkUrl}
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
                    <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                      表示回数: {ad.displayCount} {ad.maxDisplayCount !== null ? `/ ${ad.maxDisplayCount}` : '/ 無制限'}
                    </Text>
                    <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY }}>
                      トリガー: {ad.displayTriggers.join(', ')}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* お知らせ作成・編集モーダル */}
      <Portal>
        <Modal
          visible={showForm}
          onDismiss={handleCancel}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {editingId ? 'お知らせを編集' : '新しいお知らせを作成'}
            </Text>

            <TextInput
              label="タイトル"
              value={formTitle}
              onChangeText={setFormTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="説明"
              value={formDescription}
              onChangeText={setFormDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TextInput
              label="リンク（任意）"
              value={formLink}
              onChangeText={setFormLink}
              mode="outlined"
              placeholder="/GradeRanking"
              style={styles.input}
            />

            <TextInput
              label="画像URL（任意）"
              value={formImageUrl}
              onChangeText={setFormImageUrl}
              mode="outlined"
              placeholder="https://example.com/image.jpg"
              style={styles.input}
            />

            {formImageUrl && (
              <View style={styles.imagePreviewForm}>
                <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
                  画像プレビュー (16:9)
                </Text>
                <Image
                  source={{ uri: formImageUrl }}
                  style={styles.imagePreviewLarge}
                  resizeMode="cover"
                />
              </View>
            )}

            <Text variant="titleSmall" style={styles.label}>背景色</Text>
            <View style={styles.colorPicker}>
              {colorOptions.map((color) => (
                <Button
                  key={color.value}
                  mode={formBackgroundColor === color.value ? 'contained' : 'outlined'}
                  onPress={() => setFormBackgroundColor(color.value)}
                  style={styles.colorButton}
                  buttonColor={color.value}
                  textColor={formBackgroundColor === color.value ? 'white' : color.value}
                >
                  {color.label}
                </Button>
              ))}
            </View>

            {/* プレビュー */}
            <Text variant="titleSmall" style={styles.label}>プレビュー</Text>
            <Card style={[styles.previewCard, { backgroundColor: formBackgroundColor }]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.previewTitle}>
                  {formTitle || 'タイトル'}
                </Text>
                <Text variant="bodyMedium" style={styles.previewDesc}>
                  {formDescription || '説明'}
                </Text>
              </Card.Content>
            </Card>

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={handleCancel} style={{ flex: 1 }}>
                キャンセル
              </Button>
              <Button mode="contained" onPress={handleSubmit} style={{ flex: 1 }}>
                {editingId ? '更新' : '作成'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      {/* 広告作成・編集モーダル */}
      <Portal>
        <Modal
          visible={showAdForm}
          onDismiss={() => setShowAdForm(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {editingAdId ? '広告を編集' : '新規広告作成'}
            </Text>

            <TextInput
              label="管理用タイトル"
              value={adTitle}
              onChangeText={setAdTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="画像URL"
              value={adImageUrl}
              onChangeText={setAdImageUrl}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            <TextInput
              label="リンクURL"
              value={adLinkUrl}
              onChangeText={setAdLinkUrl}
              mode="outlined"
              style={styles.input}
              placeholder="https://..."
            />

            <Divider style={{ marginVertical: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>ターゲット設定</Text>

            <TextInput
              label="対象都道府県（カンマ区切り）"
              value={adPrefectures}
              onChangeText={setAdPrefectures}
              mode="outlined"
              style={styles.input}
              placeholder="例: 福岡県, 東京都（空欄で全国）"
            />

            <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>対象学年</Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
              選択した学年のユーザーに広告が表示されます（選択なしで全学年）
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['1年生', '2年生', '3年生'].map(grade => (
                <Chip
                  key={grade}
                  selected={adGrades.includes(grade)}
                  onPress={() => {
                    if (adGrades.includes(grade)) {
                      setAdGrades(adGrades.filter(g => g !== grade));
                    } else {
                      setAdGrades([...adGrades, grade]);
                    }
                  }}
                  showSelectedOverlay
                >
                  {grade}
                </Chip>
              ))}
            </View>

            <Text variant="titleMedium" style={{ marginBottom: 8 }}>対象年齢範囲</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TextInput
                label="最小年齢（空欄で制限なし）"
                value={adAgeMin}
                onChangeText={setAdAgeMin}
                mode="outlined"
                style={{ flex: 1 }}
                placeholder="例: 15"
                keyboardType="numeric"
              />
              <TextInput
                label="最大年齢（空欄で制限なし）"
                value={adAgeMax}
                onChangeText={setAdAgeMax}
                mode="outlined"
                style={{ flex: 1 }}
                placeholder="例: 18"
                keyboardType="numeric"
              />
            </View>

            <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>対象タグ設定</Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
              選択したタグを設定しているユーザーに広告が表示されます
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATEGORIES.map(category => (
                <Chip
                  key={category}
                  selected={currentTagCategory === category}
                  onPress={() => setCurrentTagCategory(category)}
                  style={{ marginRight: 8 }}
                  showSelectedOverlay
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {SUGGESTIONS[currentTagCategory]?.map((tag) => (
                <Chip
                  key={tag.name}
                  selected={adSelectedTags.includes(tag.name)}
                  onPress={() => toggleAdTag(tag.name)}
                  showSelectedOverlay
                >
                  {tag.name}
                </Chip>
              ))}
            </View>
            
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>選択中: {adSelectedTags.length > 0 ? adSelectedTags.join(', ') : 'なし（全タグ対象）'}</Text>

            <Divider style={{ marginVertical: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>表示設定</Text>

            <TextInput
              label="表示上限数（空欄で無制限）"
              value={adMaxDisplayCount}
              onChangeText={setAdMaxDisplayCount}
              mode="outlined"
              style={styles.input}
              placeholder="例: 100"
              keyboardType="numeric"
            />

            <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>表示トリガー</Text>
            <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
              広告を表示するタイミングを選択してください（複数選択可）
            </Text>

            <View style={{ gap: 8, marginBottom: 16 }}>
              {[
                { value: 'APP_OPEN', label: 'アプリ起動時' },
                { value: 'PROFILE_UPDATE', label: 'プロフィール更新時' },
                { value: 'SCREEN_TRANSITION', label: '画面遷移時' },
                { value: 'TIME_BASED', label: '時間経過' },
              ].map(trigger => (
                <Chip
                  key={trigger.value}
                  selected={adDisplayTriggers.includes(trigger.value)}
                  onPress={() => {
                    if (adDisplayTriggers.includes(trigger.value)) {
                      setAdDisplayTriggers(adDisplayTriggers.filter(t => t !== trigger.value));
                    } else {
                      setAdDisplayTriggers([...adDisplayTriggers, trigger.value]);
                    }
                  }}
                  showSelectedOverlay
                >
                  {trigger.label}
                </Chip>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setShowAdForm(false)} style={{ flex: 1 }}>
                キャンセル
              </Button>
              <Button mode="contained" onPress={handleSubmitAd} style={{ flex: 1 }}>
                保存
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  tabs: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  announcementCard: {
    marginBottom: 12,
    backgroundColor: COLORS.SURFACE,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  announcementTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  announcementDescription: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  linkChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  imagePreviewContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    padding: 40,
    fontStyle: 'italic',
  },
  // アナリティクス関連のスタイル
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: COLORS.SURFACE,
    flex: 1,
    minWidth: '48%',
  },
  statNumber: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  statChange: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    marginVertical: 16,
  },
  chartCard: {
    backgroundColor: COLORS.SURFACE,
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 10,
  },
  chartLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
    marginTop: 4,
  },
  // モーダル関連のスタイル
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  imagePreviewForm: {
    marginBottom: 16,
  },
  imagePreviewLarge: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  colorButton: {
    flex: 1,
    minWidth: '30%',
  },
  previewCard: {
    marginBottom: 24,
  },
  previewTitle: {
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  previewDesc: {
    color: 'rgba(255,255,255,0.9)',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
