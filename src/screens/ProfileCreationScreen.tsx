import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, Avatar, SegmentedButtons, RadioButton, Portal, Modal } from 'react-native-paper';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS, PREFECTURES, GRADES, CAREER_PATHS, AGES, CORRESPONDENCE_SCHOOLS } from '../constants/AppConfig';

export default function ProfileCreationScreen({ navigation, route }: { navigation: any; route: any }) {
  const isEditMode = route?.params?.isEditMode ?? false;
  const {
    userId,
    nickname,
    schoolName,
    prefecture,
    grade,
    age,
    careerPath,
    themeColor,
    setUserId,
    setNickname,
    setSchool,
    setPrefecture,
    setGrade,
    setAge,
    setCareerPath,
    setThemeColor,
  } = useRegistrationStore();

  const [showPrefectureModal, setShowPrefectureModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [schoolSuggestions, setSchoolSuggestions] = useState<string[]>([]);
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);

  const { setExamParticipation } = useSettingsStore(); // 追加

  const handleNext = () => {
    // バリデーション
    if (!userId.trim() || !nickname.trim() || !schoolName.trim() || !prefecture || !grade || !age || !careerPath) {
      alert('すべての項目を入力してください');
      return;
    }

    // ユーザーIDの形式チェック
    const userIdRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      alert('ユーザーIDは4〜20文字の英数字とアンダースコアのみ使用できます');
      return;
    }

    if (isEditMode) {
      navigation.goBack();
    } else {
      // 大学進学の場合は学習プロフィール入力へ
      if (careerPath === '大学進学') {
        navigation.navigate('StudyProfileInput');
      } else {
        // それ以外は受験機能をOFFにして次へ
        setExamParticipation(false);
        navigation.navigate('CommunicationDiagnosis');
      }
    }
  };

  // 学校名のサジェスト処理
  const handleSchoolNameChange = (text: string) => {
    const filtered = CORRESPONDENCE_SCHOOLS.filter((school) =>
      school.toLowerCase().includes(text.toLowerCase()) ||
      school.replace(/[ぁ-ん]/g, '').includes(text)
    );
    setSchoolSuggestions(filtered);
    setShowSchoolSuggestions(filtered.length > 0 && text.length > 0);
  };

  const selectSchool = (school: string) => {
    setSchool(school);
    setShowSchoolSuggestions(false);
  };

  const handleColorSelect = (color: string) => {
    setThemeColor(color);
  };

  const handleGradeSelect = (item: { value: string }) => {
    setGrade(item.value);
  };

  // 全項目必須バリデーション
  const isValid = 
    nickname.length >= 1 &&
    schoolName.length >= 1 &&
    prefecture.length >= 1 &&
    grade.length >= 1 &&
    age.length >= 1 &&
    careerPath.length >= 1 &&
    themeColor.length >= 1;

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: '#fff' }}>
      <div style={{ padding: 24, minHeight: '100%' }}>
        <Text variant="headlineMedium" style={styles.title}>
          {isEditMode ? '基本情報編集' : 'プロフィール作成'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isEditMode ? '基本情報を更新します' : 'あなたのことを教えてください'}
        </Text>

        {/* ユーザーID */}
        <TextInput
          label="ユーザーID（必須）"
          value={userId}
          onChangeText={setUserId}
          mode="outlined"
          style={styles.input}
          placeholder="@username"
          left={<TextInput.Icon icon="at" />}
          autoCapitalize="none"
        />
        <Text variant="bodySmall" style={styles.helperText}>
          4〜20文字の英数字とアンダースコア。他のユーザーと重複不可。
        </Text>

        {/* ニックネーム */}
        <TextInput
          label="ニックネーム（必須）"
          value={nickname}
          onChangeText={setNickname}
          mode="outlined"
          style={styles.input}
          placeholder="表示名を入力"
        />

        {/* アバタープレビュー */}
        <View style={styles.avatarSection}>
          <Avatar.Icon 
            size={80} 
            icon="account" 
            style={{ backgroundColor: themeColor || COLORS.PRIMARY }} 
          />
          <Text variant="bodySmall" style={styles.avatarNote}>
            ※アイコン画像は登録後に設定できます
          </Text>
        </View>

        <View style={styles.form}>
          {/* 好きな色（テーマカラー） */}
          <Text variant="titleSmall" style={styles.label}>Q. 好きな色は？（アイコンの色になります） *</Text>
          <View style={styles.colorPalette}>
            {COLORS.THEME_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.value },
                  themeColor === color.value && styles.colorSelected
                ]}
                onPress={() => setThemeColor(color.value)}
              />
            ))}
          </View>

          <TextInput
            label="ニックネーム *"
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
            style={styles.input}
            placeholder="例: つくるん"
          />

          <TextInput
            label="所属校 *"
            value={schoolName}
            onChangeText={(text) => { setSchool(text); handleSchoolNameChange(text); }}
            mode="outlined"
            style={styles.input}
            placeholder="例: N高等学校"
            onFocus={() => {
              if (schoolName.length > 0) {
                const filtered = CORRESPONDENCE_SCHOOLS.filter(school => 
                  school.toLowerCase().includes(schoolName.toLowerCase())
                );
                setSchoolSuggestions(filtered);
                setShowSchoolSuggestions(filtered.length > 0);
              }
            }}
          />
          {showSchoolSuggestions && (
            <View style={styles.suggestionsContainer}>
              {schoolSuggestions.slice(0, 5).map((school) => (
                <TouchableOpacity 
                  key={school} 
                  style={styles.suggestionItem}
                  onPress={() => selectSchool(school)}
                >
                  <Text>{school}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text variant="titleSmall" style={styles.label}>年齢 *</Text>
          <TouchableOpacity 
            onPress={() => setShowAgeModal(true)} 
            style={styles.dropdownTrigger}
          >
            <Text style={{ color: age ? '#333' : '#666', fontSize: 16 }}>
              {age ? `${age}歳` : '年齢を選択してください'}
            </Text>
            <Text>▼</Text>
          </TouchableOpacity>

          <Text variant="titleSmall" style={styles.label}>学年 *</Text>
          <SegmentedButtons
            value={grade}
            onValueChange={(val) => setGrade(val)}
            buttons={GRADES}
            style={styles.segmentedButton}
            density="small"
          />

          <Text variant="titleSmall" style={styles.label}>都道府県 *</Text>
          <TouchableOpacity 
            onPress={() => setShowPrefectureModal(true)} 
            style={styles.dropdownTrigger}
          >
            <Text style={{ color: prefecture ? '#333' : '#666', fontSize: 16 }}>
              {prefecture || '都道府県を選択してください'}
            </Text>
            <Text>▼</Text>
          </TouchableOpacity>

          <Text variant="titleSmall" style={styles.label}>希望進路 *</Text>
          <View style={styles.radioGroup}>
            {CAREER_PATHS.map((path) => (
              <View key={path} style={styles.radioItem}>
                <RadioButton
                  value={path}
                  status={careerPath === path ? 'checked' : 'unchecked'}
                  onPress={() => setCareerPath(path)}
                  color={themeColor}
                />
                <Text onPress={() => setCareerPath(path)}>{path}</Text>
              </View>
            ))}
          </View>
        </View>

        <Button 
          mode="contained" 
          onPress={handleNext}
          style={[styles.button, { backgroundColor: themeColor || COLORS.PRIMARY }]}
          disabled={!isValid}
        >
          {isEditMode ? '保存' : '次へ進む'}
        </Button>
        
        {/* 下部の余白確保 */}
        <View style={{ height: 120 }} />
      </div>

      {/* モーダル */}
      <Portal>
        {/* 都道府県選択 */}
        <Modal 
          visible={showPrefectureModal} 
          onDismiss={() => setShowPrefectureModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>都道府県を選択</Text>
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            {PREFECTURES.map((pref) => (
              <TouchableOpacity 
                key={pref} 
                style={styles.modalItem}
                onPress={() => {
                  setPrefecture(pref);
                  setShowPrefectureModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{pref}</Text>
                {prefecture === pref && <Text style={{ color: themeColor }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </div>
          <Button onPress={() => setShowPrefectureModal(false)} style={{ marginTop: 16 }}>
            閉じる
          </Button>
        </Modal>

        {/* 年齢選択 */}
        <Modal 
          visible={showAgeModal} 
          onDismiss={() => setShowAgeModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>年齢を選択</Text>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {AGES.map((ageOption) => (
              <TouchableOpacity 
                key={ageOption} 
                style={styles.modalItem}
                onPress={() => {
                  setAge(ageOption);
                  setShowAgeModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{ageOption}歳</Text>
                {age === ageOption && <Text style={{ color: themeColor }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </div>
          <Button onPress={() => setShowAgeModal(false)} style={{ marginTop: 16 }}>
            閉じる
          </Button>
        </Modal>
      </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  subtitle: {
    color: '#666666',
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarNote: {
    marginTop: 8,
    color: '#999',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  form: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  helperText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: -12,
    marginBottom: 16,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    color: '#666666',
  },
  segmentedButton: {
    marginBottom: 16,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 4,
  },
  button: {
    paddingVertical: 6,
  },
  // モーダル用スタイル
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalItemText: {
    fontSize: 16,
  },
});
