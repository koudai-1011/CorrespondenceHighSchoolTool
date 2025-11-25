import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Chip, Surface, Portal, Modal, IconButton } from 'react-native-paper';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS } from '../constants/AppConfig';

const SUBJECTS = ['英語', '数学', '国語', '理科', '社会', '情報'];
const RANKS = ['S', 'A', 'B', 'C', 'D', 'E'];

// 模試データ（階層構造）
const MOCK_EXAM_DATA = {
  '全統模試': ['全統共通テスト模試', '全統記述模試', '全統プレ共通テスト'],
  '進研模試': ['進研模試 総合学力テスト', '進研模試 大学入学共通テスト模試'],
  '駿台模試': ['駿台全国模試', '駿台・ベネッセ大学入学共通テスト模試'],
  '東進模試': ['東進 共通テスト本番レベル模試', '東進 早慶上理・難関国公立大模試'],
  'その他': ['その他'],
  '受けていない': ['受けていない']
};

// 科目データ（共通テスト・主要模試準拠）
const SUBJECT_GROUPS = [
  { category: '英語', subjects: ['英語リーディング', '英語リスニング'] },
  { category: '数学', subjects: ['数学I', '数学I・A', '数学II', '数学II・B・C', '数学III', '数学III・C'] },
  { category: '国語', subjects: ['国語総合', '現代文', '古文', '漢文'] },
  { category: '理科', subjects: ['物理基礎', '化学基礎', '生物基礎', '地学基礎', '物理', '化学', '生物', '地学'] },
  { category: '地歴公民', subjects: ['歴史総合・日本史探究', '歴史総合・世界史探究', '地理総合・地理探究', '公共・倫理', '公共・政治経済'] },
  { category: '情報', subjects: ['情報I'] }
];

// 偏差値の選択肢 (40以下〜75以上)
const DEVIATION_OPTIONS = ['40以下', ...Array.from({ length: 35 }, (_, i) => String(41 + i)), '75以上'];

// 勉強時間の選択肢
const STUDY_TIME_OPTIONS = [
  '0時間', '0.5時間', '1時間', '1.5時間', '2時間', '2.5時間', '3時間', 
  '3.5時間', '4時間', '4.5時間', '5時間', '5.5時間', '6時間', 
  '6.5時間', '7時間', '7.5時間', '8時間', '8.5時間', '9時間', 
  '9.5時間', '10時間', '11時間', '12時間以上'
];

const CRAM_SCHOOLS = ['河合塾', '駿台予備学校', '東進ハイスクール', '代々木ゼミナール', '武田塾', '四谷学院', 'その他', '通っていない'];

// 学習環境の選択肢
const STUDY_PLACES = [
  '自宅', 'カフェ', '図書館', 'スクーリング校', '自習室', '通学中', '早朝のファミレス', '学校の教室', 'その他'
];

// 学部データ（読み仮名付き）
const FACULTY_DATA = [
  { name: '文学部', kana: 'ぶんがくぶ' },
  { name: '法学部', kana: 'ほうがくぶ' },
  { name: '経済学部', kana: 'けいざいがくぶ' },
  { name: '商学部', kana: 'しょうがくぶ' },
  { name: '社会学部', kana: 'しゃかいがくぶ' },
  { name: '教育学部', kana: 'きょういくがくぶ' },
  { name: '外国語学部', kana: 'がいこくごがくぶ' },
  { name: '国際学部', kana: 'こくさいがくぶ' },
  { name: '理学部', kana: 'りがくぶ' },
  { name: '工学部', kana: 'こうがくぶ' },
  { name: '理工学部', kana: 'りこうがくぶ' },
  { name: '農学部', kana: 'のうがくぶ' },
  { name: '医学部', kana: 'いがくぶ' },
  { name: '薬学部', kana: 'やくがくぶ' },
  { name: '歯学部', kana: 'しがくぶ' },
  { name: '看護学部', kana: 'かんごがくぶ' },
  { name: '情報学部', kana: 'じょうほうがくぶ' },
  { name: '芸術学部', kana: 'げいじゅつがくぶ' },
  { name: 'スポーツ科学部', kana: 'すぽーつかがくぶ' },
];

// 大学データ（読み仮名付き）
const UNIVERSITY_DATA = [
  { name: '東京大学', kana: 'とうきょうだいがく' },
  { name: '京都大学', kana: 'きょうとだいがく' },
  { name: '大阪大学', kana: 'おおさかだいがく' },
  { name: '東北大学', kana: 'とうほくだいがく' },
  { name: '名古屋大学', kana: 'なごやだいがく' },
  { name: '九州大学', kana: 'きゅうしゅうだいがく' },
  { name: '北海道大学', kana: 'ほっかいどうだいがく' },
  { name: '一橋大学', kana: 'ひとつばしだいがく' },
  { name: '東京工業大学', kana: 'とうきょうこうぎょうだいがく' },
  { name: '筑波大学', kana: 'つくばだいがく' },
  { name: '神戸大学', kana: 'こうべだいがく' },
  { name: '横浜国立大学', kana: 'よこはまこくりつだいがく' },
  { name: '千葉大学', kana: 'ちばだいがく' },
  { name: '早稲田大学', kana: 'わせだだいがく' },
  { name: '慶應義塾大学', kana: 'けいおうぎじゅくだいがく' },
  { name: '上智大学', kana: 'じょうちだいがく' },
  { name: '東京理科大学', kana: 'とうきょうりかだいがく' },
  { name: '明治大学', kana: 'めいじだいがく' },
  { name: '青山学院大学', kana: 'あおやまがくいんだいがく' },
  { name: '立教大学', kana: 'りっきょうだいがく' },
  { name: '中央大学', kana: 'ちゅうおうだいがく' },
  { name: '法政大学', kana: 'ほうせいだいがく' },
  { name: '学習院大学', kana: 'がくしゅういんだいがく' },
  { name: '関西大学', kana: 'かんさいだいがく' },
  { name: '関西学院大学', kana: 'かんせいがくいんだいがく' },
  { name: '同志社大学', kana: 'どうししゃだいがく' },
  { name: '立命館大学', kana: 'りつめいかんだいがく' },
];

export default function StudyProfileInputScreen({ navigation, route }: { navigation: any; route: any }) {
  const { studyProfile, updateStudyProfile } = useRegistrationStore();
  const { setExamParticipation, setStudyProfile } = useSettingsStore();
  const isEditMode = route?.params?.isEditMode ?? false;

  // モーダル状態管理
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    multiple?: boolean;
    selected?: string[];
    onSelect: (value: string | string[]) => void;
  }>({ visible: false, title: '', options: [], onSelect: () => {} });

  // 模試選択用状態
  const [mockExamCategory, setMockExamCategory] = useState<string | null>(null);

  // 科目選択用状態
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(Object.keys(studyProfile.deviationScores));

  // サジェスト状態
  const [univSuggestions, setUnivSuggestions] = useState<string[]>([]);
  const [showUnivSuggestions, setShowUnivSuggestions] = useState(false);
  const [facultySuggestions, setFacultySuggestions] = useState<string[]>([]);
  const [showFacultySuggestions, setShowFacultySuggestions] = useState(false);

  const handleNext = () => {
    setExamParticipation(true);
    setStudyProfile(studyProfile);
    
    if (isEditMode) {
      navigation.goBack();
    } else {
      navigation.navigate('CommunicationDiagnosis');
    }
  };

  const openSelector = (title: string, options: string[], onSelect: (val: string) => void) => {
    setModalConfig({
      visible: true,
      title,
      options,
      multiple: false,
      onSelect: (val) => {
        onSelect(val as string);
        setModalConfig(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const openMultiSelector = (title: string, options: string[], selected: string[], onSelect: (val: string[]) => void) => {
    setModalConfig({
      visible: true,
      title,
      options,
      multiple: true,
      selected,
      onSelect: (val) => {
        onSelect(val as string[]);
        setModalConfig(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const toggleSubject = (type: 'strong' | 'weak', subject: string) => {
    const currentList = studyProfile.subjects[type];
    const newList = currentList.includes(subject)
      ? currentList.filter(s => s !== subject)
      : [...currentList, subject];
    
    updateStudyProfile('subjects', {
      ...studyProfile.subjects,
      [type]: newList
    });
  };

  const handleUniversityChange = (text: string) => {
    updateStudyProfile('targetUniversity', text);
    if (text.length > 0) {
      const filtered = UNIVERSITY_DATA
        .filter(u => u.name.includes(text) || u.kana.includes(text))
        .map(u => u.name);
      setUnivSuggestions(filtered);
      setShowUnivSuggestions(true);
    } else {
      setShowUnivSuggestions(false);
    }
  };

  const handleFacultyChange = (text: string) => {
    updateStudyProfile('targetFaculty', text);
    if (text.length > 0) {
      const filtered = FACULTY_DATA
        .filter(f => f.name.includes(text) || f.kana.includes(text))
        .map(f => f.name);
      setFacultySuggestions(filtered);
      setShowFacultySuggestions(true);
    } else {
      setShowFacultySuggestions(false);
    }
  };

  const toggleStudyPlace = (place: string) => {
    const currentPlaces = studyProfile.studyPlace || [];
    const newPlaces = currentPlaces.includes(place)
      ? currentPlaces.filter(p => p !== place)
      : [...currentPlaces, place];
    updateStudyProfile('studyPlace', newPlaces as any); // 配列として保存
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={styles.title}>
          {isEditMode ? '学習プロフィールの編集' : '学習プロフィール'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isEditMode 
            ? '受験生同士で共有するプロフィールを編集します'
            : '受験生同士で共有するプロフィールを作成します。\n※後から変更可能です'}
        </Text>

        {/* 模試・偏差値 */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>現在の学力目安</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text variant="bodySmall" style={styles.label}>受験した模試名</Text>
            <TouchableOpacity
              onPress={() => {
                openSelector('模試の種類を選択', Object.keys(MOCK_EXAM_DATA), (category) => {
                  setMockExamCategory(category);
                  setTimeout(() => {
                    const details = MOCK_EXAM_DATA[category as keyof typeof MOCK_EXAM_DATA] || [];
                    openSelector('模試名を選択', details, (exam) => {
                      updateStudyProfile('mockExamName', exam);
                    });
                  }, 300);
                });
              }}
            >
              <TextInput
                value={studyProfile.mockExamName}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
                style={styles.input}
                placeholder="選択してください"
                pointerEvents="none"
              />
            </TouchableOpacity>
            {studyProfile.mockExamName === 'その他' && (
              <TextInput
                label="模試名を入力"
                value={studyProfile.mockExamOther || ''}
                onChangeText={(text) => updateStudyProfile('mockExamOther', text)}
                mode="outlined"
                style={styles.input}
              />
            )}
          </View>

          {studyProfile.mockExamName !== '受けていない' && (
            <>
              <Text variant="bodySmall" style={styles.label}>科目別偏差値</Text>
              <Button 
                mode="outlined" 
                onPress={() => {
                  const allSubjects = SUBJECT_GROUPS.reduce((acc, g) => [...acc, ...g.subjects], [] as string[]);
                  openMultiSelector('受験した科目を選択', allSubjects, selectedSubjects, (subjects) => {
                    setSelectedSubjects(subjects);
                  });
                }}
                style={{ marginBottom: 12 }}
              >
                受験した科目を選択・変更
              </Button>

              <View style={styles.deviationGrid}>
                {selectedSubjects.map((subj) => (
                  <View key={subj} style={styles.deviationItem}>
                    <Text variant="bodySmall" style={{ marginBottom: 4 }}>{subj}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        openSelector(`${subj}の偏差値`, DEVIATION_OPTIONS, (val) => {
                          updateStudyProfile('deviationScores', {
                            ...studyProfile.deviationScores,
                            [subj]: val
                          });
                        });
                      }}
                    >
                      <TextInput
                        value={studyProfile.deviationScores[subj] || ''}
                        mode="outlined"
                        editable={false}
                        style={styles.deviationInput}
                        dense
                        placeholder="-"
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {selectedSubjects.length === 0 && (
                <Text variant="bodySmall" style={{ color: COLORS.TEXT_TERTIARY, textAlign: 'center', marginBottom: 8 }}>
                  科目が選択されていません
                </Text>
              )}
            </>
          )}
        </Surface>

        {/* 得意・苦手科目 */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>得意・苦手科目</Text>
          
          <Text variant="bodySmall" style={styles.label}>得意科目</Text>
          {SUBJECT_GROUPS.map(group => (
            <View key={`strong-${group.category}`} style={styles.subjectGroup}>
              <Text style={styles.groupLabel}>{group.category}</Text>
              <View style={styles.chipContainer}>
                {group.subjects.map(subj => (
                  <Chip
                    key={`strong-${subj}`}
                    selected={studyProfile.subjects.strong.includes(subj)}
                    onPress={() => toggleSubject('strong', subj)}
                    style={styles.chip}
                    showSelectedOverlay
                    compact
                  >
                    {subj}
                  </Chip>
                ))}
              </View>
            </View>
          ))}

          <Text variant="bodySmall" style={[styles.label, { marginTop: 24 }]}>苦手科目</Text>
          {SUBJECT_GROUPS.map(group => (
            <View key={`weak-${group.category}`} style={styles.subjectGroup}>
              <Text style={styles.groupLabel}>{group.category}</Text>
              <View style={styles.chipContainer}>
                {group.subjects.map(subj => (
                  <Chip
                    key={`weak-${subj}`}
                    selected={studyProfile.subjects.weak.includes(subj)}
                    onPress={() => toggleSubject('weak', subj)}
                    style={styles.chip}
                    showSelectedOverlay
                    compact
                  >
                    {subj}
                  </Chip>
                ))}
              </View>
            </View>
          ))}
        </Surface>

        {/* 志望校 */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>志望校・受験方式</Text>
          
          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="目標大学"
              value={studyProfile.targetUniversity}
              onChangeText={handleUniversityChange}
              mode="outlined"
              style={styles.input}
              placeholder="大学名を入力（ひらがな可）"
              disabled={studyProfile.isTargetUndecided}
            />
            {showUnivSuggestions && !studyProfile.isTargetUndecided && (
              <View style={styles.suggestionContainer}>
                {univSuggestions.map((univ) => (
                  <TouchableOpacity
                    key={univ}
                    style={styles.suggestionItem}
                    onPress={() => {
                      updateStudyProfile('targetUniversity', univ);
                      setShowUnivSuggestions(false);
                    }}
                  >
                    <Text>{univ}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => updateStudyProfile('isTargetUndecided', !studyProfile.isTargetUndecided)}
            >
              <IconButton 
                icon={studyProfile.isTargetUndecided ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={20} 
                iconColor={COLORS.PRIMARY}
                style={{ margin: 0 }}
              />
              <Text variant="bodyMedium">決まっていない</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="目標学部"
              value={studyProfile.targetFaculty}
              onChangeText={handleFacultyChange}
              mode="outlined"
              style={styles.input}
              placeholder="学部名を入力（ひらがな可）"
              disabled={studyProfile.isTargetUndecided}
            />
            {showFacultySuggestions && !studyProfile.isTargetUndecided && (
              <View style={styles.suggestionContainer}>
                {facultySuggestions.map((faculty) => (
                  <TouchableOpacity
                    key={faculty}
                    style={styles.suggestionItem}
                    onPress={() => {
                      updateStudyProfile('targetFaculty', faculty);
                      setShowFacultySuggestions(false);
                    }}
                  >
                    <Text>{faculty}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text variant="bodySmall" style={styles.label}>受験方式</Text>
          <SegmentedButtons
            value={studyProfile.examType}
            onValueChange={(val) => updateStudyProfile('examType', val as any)}
            buttons={[
              { value: 'general', label: '一般' },
              { value: 'comprehensive', label: '総合型' },
              { value: 'recommendation', label: '推薦' },
            ]}
            style={styles.segmentedButtons}
          />
        </Surface>

        {/* 学習スタイル */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>学習スタイル</Text>
          
          <Text variant="bodySmall" style={styles.label}>勉強する時間帯</Text>
          <SegmentedButtons
            value={studyProfile.studyTime}
            onValueChange={(val) => updateStudyProfile('studyTime', val as any)}
            buttons={[
              { value: 'morning', label: '朝型' },
              { value: 'night', label: '夜型' },
              { value: 'irregular', label: '不規則' },
            ]}
            style={styles.segmentedButtons}
          />

          <Text variant="bodySmall" style={[styles.label, { marginTop: 12 }]}>主な学習環境（複数選択可）</Text>
          <View style={styles.chipContainer}>
            {STUDY_PLACES.map((place) => (
              <Chip
                key={place}
                selected={(studyProfile.studyPlace || []).includes(place)}
                onPress={() => toggleStudyPlace(place)}
                style={styles.chip}
                showSelectedOverlay
              >
                {place}
              </Chip>
            ))}
          </View>

          <Text variant="bodySmall" style={[styles.label, { marginTop: 12 }]}>1日の平均勉強時間</Text>
          <TouchableOpacity
            onPress={() => {
              openSelector('平均勉強時間を選択', STUDY_TIME_OPTIONS, (val) => {
                updateStudyProfile('averageStudyTime', val);
              });
            }}
          >
            <TextInput
              value={studyProfile.averageStudyTime}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.input}
              placeholder="選択してください"
              pointerEvents="none"
            />
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <Text variant="bodySmall" style={styles.label}>通っている塾</Text>
            <TouchableOpacity
              onPress={() => {
                openSelector('塾を選択', CRAM_SCHOOLS, (school) => {
                  updateStudyProfile('cramSchool', school);
                  if (school === '通っていない') {
                    updateStudyProfile('isCramSchoolNotAttending', true);
                  } else {
                    updateStudyProfile('isCramSchoolNotAttending', false);
                  }
                });
              }}
              disabled={studyProfile.isCramSchoolNotAttending}
            >
              <TextInput
                value={studyProfile.cramSchool}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
                style={styles.input}
                placeholder="選択してください"
                disabled={studyProfile.isCramSchoolNotAttending}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {studyProfile.cramSchool === 'その他' && (
              <TextInput
                label="塾名を入力"
                value={studyProfile.cramSchoolOther || ''}
                onChangeText={(text) => updateStudyProfile('cramSchoolOther', text)}
                mode="outlined"
                style={styles.input}
              />
            )}
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => {
                const newValue = !studyProfile.isCramSchoolNotAttending;
                updateStudyProfile('isCramSchoolNotAttending', newValue);
                if (newValue) {
                  updateStudyProfile('cramSchool', '通っていない');
                } else {
                  updateStudyProfile('cramSchool', '');
                }
              }}
            >
              <IconButton 
                icon={studyProfile.isCramSchoolNotAttending ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={20} 
                iconColor={COLORS.PRIMARY}
                style={{ margin: 0 }}
              />
              <Text variant="bodyMedium">通っていない</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        <Button 
          mode="contained" 
          onPress={handleNext}
          style={styles.button}
          contentStyle={{ height: 48 }}
        >
          {isEditMode ? '保存する' : '次へ進む'}
        </Button>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* カスタム選択モーダル */}
      <Portal>
        <Modal
          visible={modalConfig.visible}
          onDismiss={() => setModalConfig(prev => ({ ...prev, visible: false }))}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>{modalConfig.title}</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {modalConfig.options.map((option) => {
              const isSelected = modalConfig.multiple 
                ? modalConfig.selected?.includes(option)
                : false;

              return (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    if (modalConfig.multiple) {
                      const currentSelected = modalConfig.selected || [];
                      const newSelected = currentSelected.includes(option)
                        ? currentSelected.filter(s => s !== option)
                        : [...currentSelected, option];
                      // 状態更新は親コンポーネントで行うため、ここではonSelectを呼ぶだけにするのが理想だが、
                      // モーダル内で完結させるためにconfigを更新する
                      setModalConfig(prev => ({ ...prev, selected: newSelected }));
                    } else {
                      modalConfig.onSelect(option);
                    }
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {modalConfig.multiple && (
                      <IconButton
                        icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={20}
                        iconColor={COLORS.PRIMARY}
                      />
                    )}
                    <Text style={styles.modalOptionText}>{option}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button 
              mode="text" 
              onPress={() => setModalConfig(prev => ({ ...prev, visible: false }))}
            >
              キャンセル
            </Button>
            {modalConfig.multiple && (
              <Button 
                mode="contained" 
                onPress={() => modalConfig.onSelect(modalConfig.selected as any)}
                style={{ marginLeft: 8 }}
              >
                決定
              </Button>
            )}
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
    fontSize: 13,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.PRIMARY,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rankSelector: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rankValue: {
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  deviationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  deviationItem: {
    width: '30%',
    marginBottom: 8,
  },
  deviationInput: {
    backgroundColor: 'white',
    fontSize: 12,
  },
  suggestionContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    marginTop: -8,
    marginBottom: 12,
    zIndex: 1000,
    elevation: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  subjectGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
});
