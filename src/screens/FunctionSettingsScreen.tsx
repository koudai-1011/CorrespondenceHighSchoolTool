import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Switch, Divider, Button, IconButton, Portal, Modal, FAB } from 'react-native-paper';
import { useSettingsStore, AVAILABLE_FOOTER_ITEMS, FooterItem } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

export default function FunctionSettingsScreen({ navigation }: { navigation: any }) {
  const {
    footerItems,
    rankingParticipation,
    setFooterItems,
    setRankingParticipation,
    resetToDefault,
  } = useSettingsStore();

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // 5つのスロットを管理（未選択の場合はnull）
  const slots: (FooterItem | null)[] = [
    footerItems[0] || null,
    footerItems[1] || null,
    footerItems[2] || null,
    footerItems[3] || null,
    footerItems[4] || null,
  ];

  // 選択可能なアイテム（既に配置されているものを除外）
  const availableItems = AVAILABLE_FOOTER_ITEMS.filter(
    item => !footerItems.some(fi => fi.id === item.id)
  );

  const handleSlotPress = (index: number) => {
    setSelectedSlotIndex(index);
  };

  const handleItemSelect = (item: FooterItem) => {
    if (selectedSlotIndex === null) return;

    const newFooterItems = [...footerItems];
    newFooterItems[selectedSlotIndex] = item;
    setFooterItems(newFooterItems.filter(Boolean)); // nullを除外
    setSelectedSlotIndex(null);
  };

  const handleRemoveFromSlot = (index: number) => {
    const newFooterItems = footerItems.filter((_, i) => i !== index);
    setFooterItems(newFooterItems);
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>機能設定</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            アプリの動作をカスタマイズ
          </Text>
        </View>

        {/* ランキング参加設定 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>成績ランキング</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" style={styles.settingLabel}>ランキングに参加する</Text>
              <Text variant="bodySmall" style={styles.settingDesc}>
                {rankingParticipation 
                  ? '成績が他のユーザーに表示されます' 
                  : '成績は非公開になります（自分のみ閲覧可能）'}
              </Text>
            </View>
            <Switch
              value={rankingParticipation}
              onValueChange={setRankingParticipation}
              color={COLORS.PRIMARY}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* フッターカスタマイズ */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            フッターナビゲーション
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            フッターに表示する5つのアイテムを選択してください。空欄をタップして項目を選びます。
          </Text>

          {/* 5つのスロット */}
          <View style={styles.slotsContainer}>
            {slots.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slot,
                  selectedSlotIndex === index && styles.slotSelected,
                  !item && styles.slotEmpty,
                ]}
                onPress={() => handleSlotPress(index)}
              >
                {item ? (
                  <View style={styles.slotContent}>
                    <IconButton
                      icon={item.icon}
                      size={24}
                      iconColor={COLORS.PRIMARY}
                      style={{ margin: 0 }}
                    />
                    <Text variant="bodySmall" style={styles.slotLabel} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <IconButton
                      icon="close-circle"
                      size={16}
                      iconColor="#999"
                      style={styles.removeButton}
                      onPress={() => handleRemoveFromSlot(index)}
                    />
                  </View>
                ) : (
                  <View style={styles.slotPlaceholder}>
                    <IconButton icon="plus" size={24} iconColor="#CCC" style={{ margin: 0 }} />
                    <Text variant="bodySmall" style={styles.placeholderText}>
                      {index + 1}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 利用可能なアイテム */}
          {selectedSlotIndex !== null && (
            <View style={styles.availableSection}>
              <Text variant="titleSmall" style={styles.availableTitle}>
                {selectedSlotIndex + 1}番目に配置するアイテムを選択:
              </Text>
              <View style={styles.availableGrid}>
                {availableItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.availableItem}
                    onPress={() => handleItemSelect(item)}
                  >
                    <IconButton
                      icon={item.icon}
                      size={24}
                      iconColor={COLORS.PRIMARY}
                      style={{ margin: 0 }}
                    />
                    <Text variant="bodySmall" style={styles.availableLabel} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button
                mode="text"
                onPress={() => setSelectedSlotIndex(null)}
                style={{ marginTop: 8 }}
              >
                キャンセル
              </Button>
            </View>
          )}

          <Button
            mode="outlined"
            icon="refresh"
            onPress={resetToDefault}
            style={styles.resetButton}
          >
            デフォルトに戻す
          </Button>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        icon="check"
        label="保存"
        style={styles.fab}
        onPress={() => navigation.goBack()}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
  },
  settingLabel: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  settingDesc: {
    color: COLORS.TEXT_SECONDARY,
  },
  divider: {
    marginVertical: 8,
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  slot: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slotEmpty: {
    borderStyle: 'dashed',
    borderColor: '#CCC',
  },
  slotSelected: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 3,
    borderStyle: 'solid',
  },
  slotContent: {
    alignItems: 'center',
    width: '100%',
  },
  slotLabel: {
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    fontSize: 10,
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
  },
  slotPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#CCC',
    marginTop: 4,
  },
  availableSection: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  availableTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  availableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  availableItem: {
    width: 80,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  availableLabel: {
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    fontSize: 10,
    marginTop: 4,
  },
  resetButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.PRIMARY,
  },
});
