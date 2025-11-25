import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, SegmentedButtons, Portal, Modal, TextInput, Divider, Chip, ProgressBar, Dialog } from 'react-native-paper';
import { TabType, useAdmin } from '../hooks/useAdmin';
import { COLORS } from '../constants/AppConfig';
import { Announcement } from '../data/dummyAnnouncements';
import { DUMMY_USERS } from '../data/dummyUsers';
import { SUGGESTIONS, CATEGORIES } from '../data/tagData';
import { calculateEngagementRate, calculateRetentionRate } from '../data/dummyAnalytics';
import { useSettingsStore } from '../stores/settingsStore';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminAnnouncements } from '../components/admin/AdminAnnouncements';
import { AdminAds } from '../components/admin/AdminAds';
import { AdminReports } from '../components/admin/AdminReports';
import { AdminNgWords } from '../components/admin/AdminNgWords';
import { AdminNotifications } from '../components/admin/AdminNotifications';
import { AdminUserDatabase } from '../components/admin/AdminUserDatabase';
import { AdminTitles } from '../components/admin/AdminTitles';

export default function AdminScreen() {
  const {
    currentTab, setCurrentTab,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    showForm, setShowForm, editingId, setEditingId,
    formTitle, setFormTitle, formDescription, setFormDescription,
    formBackgroundColor, setFormBackgroundColor, formLink, setFormLink, formImageUrl, setFormImageUrl,
    ads, addAd, updateAd, deleteAd, toggleAdStatus,
    showAdForm, setShowAdForm, editingAdId, setEditingAdId,
    adTitle, setAdTitle, adImageUrl, setAdImageUrl, adLinkUrl, setAdLinkUrl,
    adPrefectures, setAdPrefectures, adSelectedTags, setAdSelectedTags,
    currentTagCategory, setCurrentTagCategory, adMaxDisplayCount, setAdMaxDisplayCount,
    adDisplayTriggers, setAdDisplayTriggers, adGrades, setAdGrades,
    adAgeMin, setAdAgeMin, adAgeMax, setAdAgeMax,
    reports, updateReportStatus, banUser, unbanUser, getActiveBans, isBanned, ngWords, addNgWord, removeNgWord,
    reportStatusFilter, setReportStatusFilter, showBanDialog, setShowBanDialog,
    selectedReportForBan, setSelectedReportForBan, banType, setBanType,
    banDays, setBanDays, banReason, setBanReason, newNgWord, setNewNgWord,
    analytics, tagAnalyticsByCategory,
    handleEditAd, toggleAdTag, toggleAdTrigger, toggleAdGrade, resetAdForm, handleSaveAd,
    handleSaveAnnouncement, resetAnnouncementForm, handleEditAnnouncement
  } = useAdmin();







  return (
    <View style={styles.container}>
      {/* Sidebar (WordPress Style) */}
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {currentTab === 'dashboard' ? 'ダッシュボード' :
             currentTab === 'users' ? 'ユーザーデータベース' :
             currentTab === 'titles' ? '称号管理' :
             currentTab === 'announcements' ? 'お知らせ管理' :
             currentTab === 'reports' ? '通報・BAN管理' :
             currentTab === 'ng_words' ? 'NGワード管理' :
             currentTab === 'ads' ? '広告管理' : '通知管理'}
          </Text>
        </View>

        <ScrollView style={styles.contentScroll}>
          {/* ... Content based on currentTab ... */}

        {currentTab === 'announcements' && (
          <AdminAnnouncements
            announcements={announcements}
            showForm={showForm}
            setShowForm={setShowForm}
            editingId={editingId}
            formTitle={formTitle}
            setFormTitle={setFormTitle}
            formDescription={formDescription}
            setFormDescription={setFormDescription}
            formBackgroundColor={formBackgroundColor}
            setFormBackgroundColor={setFormBackgroundColor}
            formLink={formLink}
            setFormLink={setFormLink}
            formImageUrl={formImageUrl}
            setFormImageUrl={setFormImageUrl}
            handleEditAnnouncement={handleEditAnnouncement}
            handleDeleteAnnouncement={deleteAnnouncement}
            handleSaveAnnouncement={handleSaveAnnouncement}
            resetAnnouncementForm={resetAnnouncementForm}
          />
        )}

        {currentTab === 'dashboard' && (
          <AdminDashboard analytics={analytics} tagAnalyticsByCategory={tagAnalyticsByCategory} />
        )}

        {currentTab === 'users' && (
          <AdminUserDatabase />
        )}

        {currentTab === 'titles' && (
          <AdminTitles />
        )}



        {currentTab === 'reports' && (
          <AdminReports
            reports={reports}
            reportStatusFilter={reportStatusFilter}
            setReportStatusFilter={setReportStatusFilter}
            updateReportStatus={updateReportStatus}
            isBanned={isBanned}
            setSelectedReportForBan={setSelectedReportForBan}
            setShowBanDialog={setShowBanDialog}
            getActiveBans={getActiveBans}
            unbanUser={unbanUser}
            showBanDialog={showBanDialog}
            banType={banType}
            setBanType={setBanType}
            banDays={banDays}
            setBanDays={setBanDays}
            banReason={banReason}
            setBanReason={setBanReason}
            banUser={banUser}
            selectedReportForBan={selectedReportForBan}
          />
        )}

        {currentTab === 'ng_words' && (
          <AdminNgWords
            ngWords={ngWords}
            newNgWord={newNgWord}
            setNewNgWord={setNewNgWord}
            addNgWord={addNgWord}
            removeNgWord={removeNgWord}
          />
        )}

        {currentTab === 'notifications' && (
          <AdminNotifications />
        )}

        {currentTab === 'ads' && (
          <AdminAds
            ads={ads}
            showAdForm={showAdForm}
            setShowAdForm={setShowAdForm}
            editingAdId={editingAdId}
            setEditingAdId={setEditingAdId}
            adTitle={adTitle}
            setAdTitle={setAdTitle}
            adImageUrl={adImageUrl}
            setAdImageUrl={setAdImageUrl}
            adLinkUrl={adLinkUrl}
            setAdLinkUrl={setAdLinkUrl}
            adPrefectures={adPrefectures}
            setAdPrefectures={setAdPrefectures}
            adSelectedTags={adSelectedTags}
            setAdSelectedTags={setAdSelectedTags}
            currentTagCategory={currentTagCategory}
            setCurrentTagCategory={setCurrentTagCategory}
            adMaxDisplayCount={adMaxDisplayCount}
            setAdMaxDisplayCount={setAdMaxDisplayCount}
            adDisplayTriggers={adDisplayTriggers}
            setAdDisplayTriggers={setAdDisplayTriggers}
            adGrades={adGrades}
            setAdGrades={setAdGrades}
            adAgeMin={adAgeMin}
            setAdAgeMin={setAdAgeMin}
            adAgeMax={adAgeMax}
            setAdAgeMax={setAdAgeMax}
            handleEditAd={handleEditAd}
            toggleAdStatus={toggleAdStatus}
            toggleAdTag={toggleAdTag}
            handleSaveAd={handleSaveAd}
            handleDeleteAd={deleteAd}
            resetAdForm={resetAdForm}
          />
        )}

        <View style={{ height: 120 }} />
      </ScrollView>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#23282d',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#32373c',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
  },
  sidebarItemActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  sidebarText: {
    color: '#a0a5aa',
    marginLeft: 8,
    fontSize: 14,
  },
  sidebarTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  contentScroll: {
    flex: 1,
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
});
