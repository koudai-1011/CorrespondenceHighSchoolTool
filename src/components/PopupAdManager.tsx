import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Modal, Portal, IconButton } from 'react-native-paper';
import { useAdStore, PopupAd, AdDisplayTrigger } from '../stores/adStore';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';

interface PopupAdManagerProps {
  trigger?: AdDisplayTrigger; // トリガー条件
}

export default function PopupAdManager({ trigger }: PopupAdManagerProps) {
  const { ads, incrementDisplayCount } = useAdStore();
  const { prefecture, detailedTags, grade, age } = useRegistrationStore();
  const { lastAdDisplayTime, adDisplayInterval, setLastAdDisplayTime, pendingAdTrigger, clearPendingAdTrigger } = useSettingsStore();
  const [visible, setVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState<PopupAd | null>(null);

  // pendingAdTriggerの監視（プロフィール更新時など）
  useEffect(() => {
    if (!pendingAdTrigger) return;
    
    // トリガーが一致するか確認
    const effectiveTrigger = pendingAdTrigger;
    
    // pendingAdTriggerをクリア（次回の表示を防ぐ）
    clearPendingAdTrigger();
    
    // 広告表示ロジックを実行（以下は既存のロジックと同じ）
    displayAdForTrigger(effectiveTrigger);
  }, [pendingAdTrigger]);

  // 通常のトリガー監視（APP_OPENなど）
  useEffect(() => {
    // トリガーが指定されていない場合は何もしない
    if (!trigger) return;

    displayAdForTrigger(trigger);
  }, [trigger, ads, prefecture]); // detailedTagsは監視しない（タグ追加時に広告が表示されるのを防ぐ）

  const displayAdForTrigger = (targetTrigger: AdDisplayTrigger) => {
    // 2時間間隔チェック
    const now = Date.now();
    if (lastAdDisplayTime && (now - lastAdDisplayTime) < adDisplayInterval) {
      return; // まだ2時間経過していない
    }

    // マッチする広告を探す
    const matchedAds = ads.filter(ad => {
      if (!ad.isActive) return false;

      // トリガー条件チェック
      if (!ad.displayTriggers.includes(targetTrigger)) return false;

      // 上限数チェック
      if (ad.maxDisplayCount !== null && ad.displayCount >= ad.maxDisplayCount) {
        return false; // 上限に達している
      }

      // 都道府県チェック（空なら全国、または一致）
      const prefectureMatch = ad.target.prefectures.length === 0 || (prefecture && ad.target.prefectures.includes(prefecture));
      
      // タグチェック（空なら全タグ、または一致するタグがある）
      const userTagNames = detailedTags.map(t => t.name);
      const tagMatch = ad.target.tags.length === 0 || ad.target.tags.some(tag => userTagNames.includes(tag));

      // 学年チェック（空なら全学年、または一致）
      const gradeMatch = ad.target.grades.length === 0 || (grade && ad.target.grades.includes(grade));

      // 年齢チェック（nullなら制限なし、または範囲内）
      let ageMatch = true;
      if (age !== undefined) {
        const userAge = typeof age === 'number' ? age : parseInt(age, 10);
        if (!isNaN(userAge)) {
          if (ad.target.ageMin !== null && userAge < ad.target.ageMin) {
            ageMatch = false;
          }
          if (ad.target.ageMax !== null && userAge > ad.target.ageMax) {
            ageMatch = false;
          }
        }
      }

      return prefectureMatch && tagMatch && gradeMatch && ageMatch;
    });

    if (matchedAds.length > 0) {
      // 重み付け抽選ロジック
      let totalWeight = 0;
      const weightedAds = matchedAds.map(ad => {
        // 基本重み: 残り表示回数（無制限の場合は1000回分相当とする）
        // これにより、目標回数が多い（残り回数が多い）広告ほど表示されやすくなる
        const remainingCount = ad.maxDisplayCount !== null 
          ? Math.max(0, ad.maxDisplayCount - ad.displayCount)
          : 1000;
        
        // ターゲットブースト: 条件がある場合は重みを5倍にする
        // これにより、狭域ターゲット広告（地域限定など）が全国広告より優先されやすくなる
        const hasTarget = 
          ad.target.prefectures.length > 0 || 
          ad.target.tags.length > 0 || 
          ad.target.grades.length > 0 || 
          ad.target.ageMin !== null || 
          ad.target.ageMax !== null;
        
        const boost = hasTarget ? 5 : 1;
        const weight = remainingCount * boost;
        
        totalWeight += weight;
        return { ad, weight };
      });

      // 抽選実行
      let randomValue = Math.random() * totalWeight;
      let selectedAd = weightedAds[0].ad;

      for (const item of weightedAds) {
        randomValue -= item.weight;
        if (randomValue <= 0) {
          selectedAd = item.ad;
          break;
        }
      }

      setCurrentAd(selectedAd);
      setVisible(true);
      
      // 表示回数をインクリメント
      incrementDisplayCount(selectedAd.id);
      
      // 最後の表示時刻を更新
      setLastAdDisplayTime(now);
    }
  };

  if (!currentAd || !visible) return null;

  const handlePress = () => {
    if (currentAd.linkUrl) {
      Linking.openURL(currentAd.linkUrl);
      setVisible(false);
    }
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        {/* 背景（ここをタップすると閉じる） */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
        
        {/* コンテンツ */}
        <View style={styles.contentWrapper} pointerEvents="box-none">
          <View style={styles.content}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.touchable}>
              <Image source={{ uri: currentAd.imageUrl }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
            <IconButton
              icon="close-circle"
              iconColor="white"
              size={30}
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').height * 0.6,
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    // シャドウ
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
  },
});
