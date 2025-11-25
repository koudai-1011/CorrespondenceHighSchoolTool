import { useState, useMemo } from 'react';
import { useAnnouncementStore } from '../stores/announcementStore';
import { useAdStore, PopupAd, AdDisplayTrigger } from '../stores/adStore';
import { useModerationStore } from '../stores/moderationStore';
import { DUMMY_ANALYTICS } from '../data/dummyAnalytics';
import { DUMMY_USERS } from '../data/dummyUsers';
import { SUGGESTIONS, CATEGORIES } from '../data/tagData';

export type TabType = 'dashboard' | 'users' | 'titles' | 'announcements' | 'reports' | 'ng_words' | 'ads' | 'notifications';

export const useAdmin = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  // Announcement Logic
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncementStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBackgroundColor, setFormBackgroundColor] = useState('#6B9BD1');
  const [formLink, setFormLink] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Ad Logic
  const { ads, addAd, updateAd, deleteAd, toggleAdStatus } = useAdStore();
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adPrefectures, setAdPrefectures] = useState('');
  const [adSelectedTags, setAdSelectedTags] = useState<string[]>([]);
  const [currentTagCategory, setCurrentTagCategory] = useState(CATEGORIES[0]);
  const [adMaxDisplayCount, setAdMaxDisplayCount] = useState<string>('');
  const [adDisplayTriggers, setAdDisplayTriggers] = useState<AdDisplayTrigger[]>(['APP_OPEN']);
  const [adGrades, setAdGrades] = useState<string[]>([]);
  const [adAgeMin, setAdAgeMin] = useState<string>('');
  const [adAgeMax, setAdAgeMax] = useState<string>('');

  // Moderation Logic
  const { reports, updateReportStatus, banUser, unbanUser, getActiveBans, isBanned, ngWords, addNgWord, removeNgWord } = useModerationStore();
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('pending');
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedReportForBan, setSelectedReportForBan] = useState<any>(null);
  const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
  const [banDays, setBanDays] = useState('7');
  const [banReason, setBanReason] = useState('');
  const [newNgWord, setNewNgWord] = useState('');

  // Analytics Logic
  const analytics = DUMMY_ANALYTICS;
  const tagAnalyticsByCategory = useMemo(() => {
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

  // Helper Functions
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

  const toggleAdTrigger = (trigger: AdDisplayTrigger) => {
    if (adDisplayTriggers.includes(trigger)) {
      setAdDisplayTriggers(adDisplayTriggers.filter(t => t !== trigger));
    } else {
      setAdDisplayTriggers([...adDisplayTriggers, trigger]);
    }
  };

  const toggleAdGrade = (grade: string) => {
    if (adGrades.includes(grade)) {
      setAdGrades(adGrades.filter(g => g !== grade));
    } else {
      setAdGrades([...adGrades, grade]);
    }
  };

  const resetAdForm = () => {
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
    setShowAdForm(false);
  };

  const handleSaveAd = () => {
    const target = {
      prefectures: adPrefectures.split(',').map(p => p.trim()).filter(p => p),
      tags: adSelectedTags,
      grades: adGrades,
      ageMin: adAgeMin ? parseInt(adAgeMin) : null,
      ageMax: adAgeMax ? parseInt(adAgeMax) : null,
    };

    const adData = {
      title: adTitle,
      imageUrl: adImageUrl,
      linkUrl: adLinkUrl,
      target,
      maxDisplayCount: adMaxDisplayCount ? parseInt(adMaxDisplayCount) : null,
      displayTriggers: adDisplayTriggers,
      isActive: true, // Default to active for new ads
    };

    if (editingAdId) {
      updateAd(editingAdId, adData);
    } else {
      addAd(adData);
    }
    resetAdForm();
  };

  const resetAnnouncementForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormBackgroundColor('#6B9BD1');
    setFormLink('');
    setFormImageUrl('');
    setShowForm(false);
  };

  const handleSaveAnnouncement = () => {
    if (!formTitle || !formDescription) {
      alert('タイトルと説明を入力してください');
      return;
    }

    if (editingId) {
      updateAnnouncement(editingId, {
        title: formTitle,
        description: formDescription,
        backgroundColor: formBackgroundColor,
        link: formLink || undefined,
        imageUrl: formImageUrl || undefined,
      });
    } else {
      addAnnouncement({
        id: `ann${Date.now()}`,
        title: formTitle,
        description: formDescription,
        backgroundColor: formBackgroundColor,
        link: formLink || undefined,
        imageUrl: formImageUrl || undefined,
        createdAt: new Date(),
      });
    }
    resetAnnouncementForm();
  };

  const handleEditAnnouncement = (announcement: any) => {
    setEditingId(announcement.id);
    setFormTitle(announcement.title);
    setFormDescription(announcement.description);
    setFormBackgroundColor(announcement.backgroundColor);
    setFormLink(announcement.link || '');
    setFormImageUrl(announcement.imageUrl || '');
    setShowForm(true);
  };

  return {
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
  };
};
