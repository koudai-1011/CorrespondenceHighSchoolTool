import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, SegmentedButtons, Divider, Portal, Dialog, TextInput } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';

interface AdminReportsProps {
  reports: any[];
  reportStatusFilter: 'all' | 'pending' | 'reviewed' | 'resolved';
  setReportStatusFilter: (status: 'all' | 'pending' | 'reviewed' | 'resolved') => void;
  updateReportStatus: (id: string, status: 'pending' | 'reviewed' | 'resolved') => void;
  isBanned: (userId: string) => boolean;
  setSelectedReportForBan: (report: any) => void;
  setShowBanDialog: (show: boolean) => void;
  getActiveBans: () => any[];
  unbanUser: (banId: string) => void;
  showBanDialog: boolean;
  banType: 'temporary' | 'permanent';
  setBanType: (type: 'temporary' | 'permanent') => void;
  banDays: string;
  setBanDays: (days: string) => void;
  banReason: string;
  setBanReason: (reason: string) => void;
  banUser: (banData: any) => void;
  selectedReportForBan: any;
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  reports,
  reportStatusFilter,
  setReportStatusFilter,
  updateReportStatus,
  isBanned,
  setSelectedReportForBan,
  setShowBanDialog,
  getActiveBans,
  unbanUser,
  showBanDialog,
  banType,
  setBanType,
  banDays,
  setBanDays,
  banReason,
  setBanReason,
  banUser,
  selectedReportForBan,
}) => {
  return (
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
              1. <Text style={{ fontWeight: 'bold' }}>未対応（pending）</Text>: ユーザーから通報が届いた状態{'\n'}
              2. <Text style={{ fontWeight: 'bold' }}>確認済み（reviewed）</Text>: 管理者が内容を確認した状態{'\n'}
              3. <Text style={{ fontWeight: 'bold' }}>解決済み（resolved）</Text>: 対応が完了した状態
            </Text>
            
            <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>■ BAN（アカウント停止）機能</Text>
            <Text variant="bodySmall" style={{ lineHeight: 20, marginBottom: 8 }}>
              通報を確認後、必要に応じてユーザーをBANできます：{'\n'}
              • <Text style={{ fontWeight: 'bold' }}>一時停止</Text>: 7日/30日/90日の期間限定でアクセス制限{'\n'}
              • <Text style={{ fontWeight: 'bold' }}>永久BAN</Text>: アカウントを永久に利用停止
            </Text>
            
            <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>■ 推奨対応基準</Text>
            <Text variant="bodySmall" style={{ lineHeight: 20 }}>
              • 初回軽微な違反: 警告のみ{'\n'}
              • 繰り返しの違反: 7日間の一時停止{'\n'}
              • 重大な違反（誹謗中傷、ハラスメント等）: 30〜90日間の停止{'\n'}
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
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
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
  announcementTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  announcementDescription: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
